"""Merge Engine - Facade orchestrating downloads, normalization, and stitching."""

import logging
import os
import subprocess
import threading
import uuid
from pathlib import Path
from typing import Callable, List, Optional

from tubemerge.core import settings
from tubemerge.utils.file_system import safe_remove_directory
from tubemerge.apps.merger.models import PipelineStatus, ProgressSnapshot, MergeJobSpecification
from tubemerge.apps.playlists.services import PlaylistMetadataService
from tubemerge.apps.merger.services.normalizer import VideoNormalizerService
from tubemerge.apps.merger.services.stitcher import VideoStitcherService

logger = logging.getLogger(__name__)

class MergeEngine:
    """Facade coordinator for executing multi-video playlist merge jobs."""

    def __init__(
        self,
        job_spec: MergeJobSpecification,
        ytdlp_path: str,
        ffmpeg_path: str,
        ffprobe_path: Optional[str] = None,
        on_progress: Optional[Callable[[ProgressSnapshot], None]] = None,
    ):
        self.job_spec = job_spec
        self.ytdlp_path = ytdlp_path
        self.ffmpeg_path = ffmpeg_path
        self.ffprobe_path = ffprobe_path
        self.on_progress = on_progress

        self.metadata_service = PlaylistMetadataService(ytdlp_path=ytdlp_path)
        self.normalizer_service = VideoNormalizerService(ffmpeg_path=ffmpeg_path)
        self.stitcher_service = VideoStitcherService(ffmpeg_path=ffmpeg_path)

        self._cancel_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

    def _emit(self, snapshot: ProgressSnapshot) -> None:
        if self.on_progress:
            try:
                self.on_progress(snapshot)
            except Exception as exc:
                logger.warning("Error in progress callback: %s", exc)

    def cancel(self) -> None:
        self._cancel_event.set()

    @property
    def is_cancelled(self) -> bool:
        return self._cancel_event.is_set()

    @property
    def is_running(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    def start(self) -> threading.Thread:
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()
        return self._thread

    def _probe_duration(self, file_path: Path) -> float:
        """Use ffprobe or ffmpeg to get actual duration of a file in seconds."""
        if self.ffprobe_path:
            cmd = [
                self.ffprobe_path,
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(file_path),
            ]
            try:
                res = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
                if res.returncode == 0:
                    return float(res.stdout.strip())
            except Exception:
                pass
        return 0.0

    def _run(self) -> None:
        job_id = uuid.uuid4().hex[:8]
        temp_dir = settings.TEMP_WORKDIR / job_id
        temp_dir.mkdir(parents=True, exist_ok=True)

        output_dir = Path(self.job_spec.output_dir) if self.job_spec.output_dir else settings.DEFAULT_OUTPUT_DIR
        output_dir.mkdir(parents=True, exist_ok=True)

        out_filename = self.job_spec.output_filename or f"TubeMerge_{job_id}.mp4"
        if not out_filename.endswith(".mp4"):
            out_filename += ".mp4"
        final_output_path = output_dir / out_filename

        try:
            # 1. Fetch metadata
            self._emit(ProgressSnapshot(
                status=PipelineStatus.FETCHING,
                overall_percent=2.0,
                message=f"Fetching playlist metadata: {self.job_spec.playlist_url}",
            ))

            playlist = self.metadata_service.fetch_playlist(self.job_spec.playlist_url)
            selected_entries = [
                playlist.entries[i] for i in self.job_spec.selected_indices
                if 0 <= i < len(playlist.entries)
            ]

            if not selected_entries:
                raise ValueError("No valid videos selected for merge.")

            if self.is_cancelled:
                self._emit(ProgressSnapshot(status=PipelineStatus.CANCELLED, message="Merge cancelled by user."))
                return

            # 2. Canvas determination
            canvas_key = self.job_spec.canvas_preset
            preset = settings.CANVAS_PRESETS.get(canvas_key, settings.CANVAS_PRESETS["auto"])
            target_w = preset["width"]
            target_h = preset["height"]
            target_fps = preset["fps"]

            if canvas_key == "auto" and selected_entries[0].url:
                pw, ph, pfps = self.metadata_service.probe_canvas(selected_entries[0].url)
                target_w, target_h, target_fps = pw, ph, pfps

            total_videos = len(selected_entries)
            raw_files = []

            # 3. Download phase
            for idx, clip in enumerate(selected_entries, start=1):
                if self.is_cancelled:
                    self._emit(ProgressSnapshot(status=PipelineStatus.CANCELLED, message="Merge cancelled by user."))
                    return

                pct = 5.0 + (idx / total_videos) * 40.0
                self._emit(ProgressSnapshot(
                    status=PipelineStatus.DOWNLOADING,
                    current_item=idx,
                    total_items=total_videos,
                    current_video_title=clip.title,
                    overall_percent=pct,
                    message=f"Downloading ({idx}/{total_videos}): {clip.title}",
                ))

                out_template = str(temp_dir / f"raw_{idx:04d}.%(ext)s")
                dl_cmd = [
                    self.ytdlp_path,
                    "--ffmpeg-location", self.ffmpeg_path,
                    "-f", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best",
                    "-o", out_template,
                    "--no-playlist",
                    "--no-warnings",
                    clip.url,
                ]

                res = subprocess.run(dl_cmd, capture_output=True, text=True, timeout=1800)
                if res.returncode != 0:
                    logger.warning("Download failed for %s: %s", clip.title, res.stderr[:200])
                    continue

                candidates = [
                    p for p in temp_dir.glob(f"raw_{idx:04d}.*")
                    if not p.name.endswith((".part", ".ytdl"))
                ]
                if candidates:
                    raw_files.append((clip, candidates[0]))

            if not raw_files:
                raise RuntimeError("No videos were successfully downloaded; nothing to merge.")

            # 4. Normalization phase with progressive cleanup
            normalized_files: List[Path] = []
            durations: List[float] = []
            titles_success: List[str] = []

            for idx, (clip, raw_path) in enumerate(raw_files, start=1):
                if self.is_cancelled:
                    self._emit(ProgressSnapshot(status=PipelineStatus.CANCELLED, message="Merge cancelled by user."))
                    return

                pct = 45.0 + (idx / len(raw_files)) * 35.0
                self._emit(ProgressSnapshot(
                    status=PipelineStatus.NORMALIZING,
                    current_item=idx,
                    total_items=len(raw_files),
                    current_video_title=clip.title,
                    overall_percent=pct,
                    message=f"Normalising ({idx}/{len(raw_files)}): {clip.title}",
                ))

                norm_path = temp_dir / f"norm_{idx:04d}.mp4"
                success = self.normalizer_service.normalize(
                    input_path=raw_path,
                    output_path=norm_path,
                    target_w=target_w,
                    target_h=target_h,
                    fps=target_fps,
                    crf=self.job_spec.crf,
                )

                # Progressive cleanup: delete raw file immediately to reclaim disk space
                raw_path.unlink(missing_ok=True)

                if success:
                    normalized_files.append(norm_path)
                    dur = self._probe_duration(norm_path) or float(clip.duration_seconds or 1.0)
                    durations.append(dur)
                    titles_success.append(clip.title)

            if not normalized_files:
                raise RuntimeError("Normalization failed for all video segments.")

            # 5. Stitching phase
            if self.is_cancelled:
                self._emit(ProgressSnapshot(status=PipelineStatus.CANCELLED, message="Merge cancelled by user."))
                return

            self._emit(ProgressSnapshot(
                status=PipelineStatus.STITCHING,
                overall_percent=82.0,
                message="Stitching segments into final video…",
            ))

            manifest_path = temp_dir / "manifest.txt"
            self.stitcher_service.write_manifest(normalized_files, manifest_path)
            stitch_ok = self.stitcher_service.stitch_segments(manifest_path, final_output_path)

            if not stitch_ok:
                raise RuntimeError("FFmpeg concat demuxer failed to merge video segments.")

            # 6. Chapter embedding phase
            self._emit(ProgressSnapshot(
                status=PipelineStatus.EMBEDDING_CHAPTERS,
                overall_percent=90.0,
                message="Embedding chapter markers…",
            ))

            metadata_content = self.stitcher_service.build_chapter_metadata(titles_success, durations)
            meta_path = temp_dir / "chapters.txt"
            meta_path.write_text(metadata_content, encoding="utf-8")
            self.stitcher_service.embed_chapters(final_output_path, meta_path)

            # 7. Finalize & Complete
            safe_remove_directory(temp_dir)
            self._emit(ProgressSnapshot(
                status=PipelineStatus.DONE,
                overall_percent=100.0,
                message=f"Merge complete: {final_output_path}",
                output_file=str(final_output_path),
            ))

        except Exception as exc:
            safe_remove_directory(temp_dir)
            self._emit(ProgressSnapshot(
                status=PipelineStatus.ERROR,
                error=str(exc),
                message=f"Pipeline error: {exc}",
            ))
