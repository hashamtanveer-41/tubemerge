"""Video Normalizer Service - Standardizes resolution, aspect ratio, CFR, and audio."""

import os
import subprocess
from pathlib import Path
from typing import Optional, Callable

from tubemerge.core import settings
from tubemerge.apps.licensing.services.guard_service import LicensingGuard

class VideoNormalizerService:
    """Standardizes arbitrary video clips to a uniform resolution, 30fps CFR, and AAC stereo."""

    def __init__(self, ffmpeg_path: str):
        self.ffmpeg_path = ffmpeg_path

    @staticmethod
    def build_filter_graph(target_w: int, target_h: int, fps: int = 30) -> str:
        """Scale preserving aspect ratio, pad with black bars, enforce 1:1 SAR and constant FPS."""
        return (
            f"scale={target_w}:{target_h}:force_original_aspect_ratio=decrease,"
            f"pad={target_w}:{target_h}:(ow-iw)/2:(oh-ih)/2:color=black,"
            f"setsar=1,"
            f"fps={fps}"
        )

    def normalize(
        self,
        input_path: Path,
        output_path: Path,
        target_w: int = 1920,
        target_h: int = 1080,
        fps: int = 30,
        crf: int = settings.DEFAULT_CRF,
        audio_bitrate: str = settings.DEFAULT_AUDIO_BITRATE,
        on_log: Optional[Callable[[str], None]] = None,
    ) -> bool:
        """Run FFmpeg to normalize video and audio streams with anti-tamper capability enforcement."""
        # Cryptographic anti-tamper capability derivation (avoids naive `if isPro` bypasses)
        policy = LicensingGuard.get_effective_policy()
        safe_w, safe_h, safe_fps = policy.clamp_dimensions(target_w, target_h, fps)
        encoder_args = policy.get_encoder_config(crf=crf)

        filter_graph = self.build_filter_graph(safe_w, safe_h, safe_fps)

        cmd = [
            self.ffmpeg_path,
            "-y",
            "-i", str(input_path),
            "-vf", filter_graph,
            "-r", str(safe_fps),
            "-fps_mode", "cfr",
            *encoder_args,
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-ar", str(settings.AUDIO_SAMPLE_RATE),
            "-ac", str(settings.AUDIO_CHANNELS),
            "-b:a", audio_bitrate,
            str(output_path),
        ]

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
        )

        # Monitor output
        while True:
            line = proc.stderr.readline() if proc.stderr else ""
            if not line and proc.poll() is not None:
                break
            if line and on_log:
                on_log(line.strip())

        proc.wait()
        return proc.returncode == 0 and output_path.exists() and output_path.stat().st_size > 0
