import sys
"""Privacy-Preserving Counter Telemetry Service for TubeMerger.

PRIVACY GUARANTEES:
  - Raw playlist URLs are NEVER sent, logged, or stored.
  - Channel names, video titles, account handles are NEVER captured.
  - User IPs are never stored by Aptabase (GDPR compliant).
  - Only anonymous scalar event counters & buckets are tracked via Aptabase.

Aptabase Cloud Events:
  - app_started: App launch, DAU, OS & version distribution
  - playlist_inspected: Playlist URL fetched & parsed
  - playlist_merge_started: User initiated a download & stitch
  - playlist_merge_completed: Pipeline completed rendering successfully
  - playlist_merge_failed: Pipeline encountered an error
  - playlist_merge_cancelled: User cancelled an active job

To disable telemetry entirely: set TELEMETRY_APP_KEY = "" in config.py.
"""

import asyncio
import datetime
import logging
import platform
import random
import threading
import time
import httpx

from tubemerge.core.config import (
    TELEMETRY_APP_KEY,
    TELEMETRY_HOST,
    TELEMETRY_SMALL_THRESHOLD,
)
from tubemerge.core import settings

logger = logging.getLogger(__name__)

_APTABASE_ENDPOINT = f"{TELEMETRY_HOST}/api/v0/event"
_HEADERS = {
    "App-Key": TELEMETRY_APP_KEY,
    "Content-Type": "application/json",
}

# Per-process session ID: epoch + random 8 digits
_SESSION_ID = f"{int(time.time())}{random.randint(10000000, 99999999)}"

_IS_DEV = not getattr(sys, "frozen", False)

_SYSTEM_PROPS = {
    "locale": "en-US",
    "osName": platform.system(),
    "osVersion": platform.release(),
    "deviceModel": platform.machine() or "PC",
    "isDebug": getattr(settings, "DEBUG", _IS_DEV),
    "appVersion": getattr(settings, "VERSION", "1.0.1"),
    "sdkVersion": "aptabase-python@0.1.0",
}


def _bucket_clips(clip_count: int) -> str:
    if clip_count <= 5:
        return "1-5"
    if clip_count <= 15:
        return "6-15"
    if clip_count <= 30:
        return "16-30"
    if clip_count <= 50:
        return "31-50"
    return "50+"


def _bucket_duration(duration_seconds: float) -> str:
    if duration_seconds < 60:
        return "<1m"
    if duration_seconds < 300:
        return "1-5m"
    if duration_seconds < 900:
        return "5-15m"
    return "15m+"


class TelemetryService:
    """Thread-safe, fire-and-forget anonymous event counter for Aptabase."""

    @staticmethod
    def _send_sync(payload: dict) -> None:
        """Synchronous HTTP POST to Aptabase, run in background thread."""
        try:
            with httpx.Client(timeout=4.0) as client:
                res = client.post(_APTABASE_ENDPOINT, headers=_HEADERS, json=payload)
                if res.status_code == 200:
                    logger.debug("Aptabase event '%s' sent successfully", payload.get("eventName"))
                else:
                    logger.debug("Aptabase returned status %s: %s", res.status_code, res.text)
        except Exception as exc:
            logger.debug("Telemetry send failed (non-critical): %s", exc)

    @classmethod
    def _dispatch(cls, event_name: str, props: dict | None = None) -> None:
        """Dispatch event in a daemon thread so it never blocks any thread or loop."""
        if not TELEMETRY_APP_KEY:
            return

        payload = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
            "sessionId": _SESSION_ID,
            "eventName": event_name,
            "systemProps": _SYSTEM_PROPS,
            "props": props or {},
        }

        # Run completely decoupled in a daemon thread
        threading.Thread(target=cls._send_sync, args=(payload,), daemon=True).start()

    @classmethod
    async def _send(cls, event_name: str, props: dict | None = None) -> None:
        """Async compatibility wrapper."""
        cls._dispatch(event_name, props)

    @classmethod
    def track_app_launch(cls) -> None:
        """Call once when the desktop application boots up."""
        cls._dispatch("app_started")

    @classmethod
    def track_playlist_inspected(cls, clip_count: int) -> None:
        """Call when a playlist URL is fetched and parsed."""
        cls._dispatch(
            "playlist_inspected",
            props={
                "clip_count_bucket": _bucket_clips(clip_count),
                "clip_count": clip_count,
            },
        )

    @classmethod
    def track_job_triggered(cls, clip_count: int, preset: str = "auto") -> None:
        """Call when a playlist merge job is initiated."""
        cls._dispatch(
            "playlist_merge_started",
            props={
                "clip_count_bucket": _bucket_clips(clip_count),
                "clip_count": clip_count,
                "preset": preset,
            },
        )

    @classmethod
    def track_job_completed(cls, duration_seconds: float | None = None, clip_count: int | None = None) -> None:
        """Call when a playlist merge job finishes rendering."""
        props = {}
        if duration_seconds is not None:
            props["duration_bucket"] = _bucket_duration(duration_seconds)
            props["duration_seconds"] = int(duration_seconds)
        if clip_count is not None:
            props["clip_count"] = clip_count
            props["clip_count_bucket"] = _bucket_clips(clip_count)
        cls._dispatch("playlist_merge_completed", props=props)

    @classmethod
    def track_job_failed(cls, error_type: str = "general_error") -> None:
        """Call when a playlist merge job fails."""
        cls._dispatch("playlist_merge_failed", props={"error_type": error_type})

    @classmethod
    def track_job_cancelled(cls) -> None:
        """Call when an active merge job is cancelled by the user."""
        cls._dispatch("playlist_merge_cancelled")
