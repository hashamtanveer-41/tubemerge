"""Playlist Metadata Service - Interacts with yt-dlp to inspect playlists."""

import json
import logging
import re
import subprocess
from typing import Optional, Tuple

from tubemerge.apps.playlists.models import Playlist, VideoClip

logger = logging.getLogger(__name__)

class PlaylistMetadataService:
    """Encapsulates probing and extracting metadata for YouTube playlists and videos."""

    def __init__(self, ytdlp_path: str):
        self.ytdlp_path = ytdlp_path

    @staticmethod
    def sanitize_url(raw_url: str) -> str:
        """Strip surrounding quotes, whitespace, and clean query params."""
        if not raw_url:
            return ""
        url = raw_url.strip().strip("'\"").strip()
        return url

    def fetch_playlist(self, url: str) -> Playlist:
        """Fetch playlist metadata via yt-dlp flat-playlist mode."""
        clean_url = self.sanitize_url(url)
        if not clean_url:
            raise ValueError("URL cannot be empty.")

        cmd = [
            self.ytdlp_path,
            "-J",
            "--flat-playlist",
            "--no-warnings",
            "--socket-timeout", "15",
            "--retries", "1",
            clean_url,
        ]

        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=45)
        except subprocess.TimeoutExpired:
            raise TimeoutError("YouTube request timed out. Please check your internet connection.")
        except Exception as exc:
            raise RuntimeError(f"Failed to execute yt-dlp: {exc}")

        if res.returncode != 0:
            stderr = res.stderr.lower()
            if "does not exist" in stderr or "404" in stderr or "not found" in stderr or "is private" in stderr:
                raise ValueError("The playlist does not exist, is private, or the URL contains a typo.")
            raise RuntimeError(f"Unable to fetch playlist: {res.stderr.strip()[:200]}")

        try:
            data = json.loads(res.stdout)
        except json.JSONDecodeError:
            raise RuntimeError("Invalid response received from yt-dlp parser.")

        entries = []
        raw_entries = data.get("entries") or []

        cover_thumb = data.get("thumbnail")

        for item in raw_entries:
            if not item:
                continue
            video_id = item.get("id") or ""
            video_title = item.get("title") or "Untitled Video"
            video_url = item.get("url") or (f"https://www.youtube.com/watch?v={video_id}" if video_id else "")
            duration = int(item.get("duration") or 0)

            # Thumbnails
            thumb = None
            if item.get("thumbnails"):
                thumb = item["thumbnails"][-1].get("url")
            elif item.get("thumbnail"):
                thumb = item["thumbnail"]
            elif video_id:
                thumb = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"

            if not cover_thumb and thumb:
                cover_thumb = thumb

            width = int(item.get("width") or 0)
            height = int(item.get("height") or 0)
            fps = float(item.get("fps") or 0.0)

            clip = VideoClip(
                id=video_id,
                title=video_title,
                url=video_url,
                duration_seconds=duration,
                thumbnail_url=thumb,
                width=width,
                height=height,
                fps=fps,
            )
            entries.append(clip)

        return Playlist(
            playlist_id=data.get("id") or "",
            title=data.get("title") or "Untitled Playlist",
            channel=data.get("uploader") or data.get("channel") or "YouTube Channel",
            webpage_url=data.get("webpage_url") or clean_url,
            entries=entries,
            thumbnail=cover_thumb,
        )

    def probe_canvas(self, video_url: str) -> Tuple[int, int, int]:
        """Inspect actual stream metadata of the first video to determine master canvas."""
        cmd = [
            self.ytdlp_path,
            "-j",
            "--no-playlist",
            "--no-warnings",
            "--socket-timeout", "10",
            video_url,
        ]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
            if res.returncode == 0:
                d = json.loads(res.stdout)
                w = int(d.get("width") or 1920)
                h = int(d.get("height") or 1080)
                fps = int(round(float(d.get("fps") or 30)))
                return w, h, fps
        except Exception:
            pass
        return 1920, 1080, 30
