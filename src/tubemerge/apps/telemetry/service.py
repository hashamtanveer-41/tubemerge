"""Privacy-Preserving Counter Telemetry Service.

PRIVACY GUARANTEES:
  - Raw playlist URLs are NEVER sent, logged, or stored.
  - Channel names, video titles, account handles are NEVER captured.
  - Clip counts are bucketed ("small" ≤ 20 clips / "large" > 20) so exact
    quantities are not exposed.
  - Only anonymous scalar event counters are tracked via Aptabase (GDPR compliant).

To disable telemetry entirely: set TELEMETRY_APP_KEY = "" in config.py.
"""

import datetime
import logging
import platform
import random
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

_SYSTEM_PROPS = {
    "locale": "en-US",
    "osName": platform.system(),
    "osVersion": platform.release(),
    "deviceModel": platform.machine() or "PC",
    "isDebug": getattr(settings, "DEBUG", False),
    "appVersion": getattr(settings, "VERSION", "1.0.0"),
    "sdkVersion": "aptabase-python@0.1.0",
}


class TelemetryService:
    """Fire-and-forget anonymous event counter for Aptabase.

    All methods are async-safe and silently swallow network errors so
    telemetry failures never impact the user experience.
    """

    @staticmethod
    async def _send(event_name: str, props: dict | None = None) -> None:
        """POST a single anonymous event to Aptabase. No-ops if key not configured."""
        if not TELEMETRY_APP_KEY:
            return  # Telemetry disabled

        payload = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
            "sessionId": _SESSION_ID,
            "eventName": event_name,
            "systemProps": _SYSTEM_PROPS,
            "props": props or {},
        }

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(_APTABASE_ENDPOINT, headers=_HEADERS, json=payload)
                if res.status_code == 200:
                    logger.debug("Aptabase telemetry event '%s' sent successfully", event_name)
                else:
                    logger.debug("Aptabase telemetry returned status %s: %s", res.status_code, res.text)
        except Exception as exc:
            # Never propagate telemetry errors — they are non-critical
            logger.debug("Telemetry send failed (non-critical): %s", exc)

    @classmethod
    async def track_app_launch(cls) -> None:
        """Call once when the desktop application boots up."""
        await cls._send("app_started")

    @classmethod
    async def track_job_triggered(cls, clip_count: int) -> None:
        """Call when a playlist merge job is dispatched."""
        size_bucket = "small" if clip_count <= TELEMETRY_SMALL_THRESHOLD else "large"
        await cls._send(
            "playlist_merge_started",
            props={"size_bucket": size_bucket},
        )

    @classmethod
    async def track_job_completed(cls, duration_seconds: float | None = None) -> None:
        """Call when a playlist merge job finishes."""
        props = {}
        if duration_seconds is not None:
            props["duration_bucket"] = "<1m" if duration_seconds < 60 else ("<5m" if duration_seconds < 300 else "5m+")
        await cls._send("playlist_merge_completed", props=props)
