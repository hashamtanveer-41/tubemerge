"""Update checking service — uses only stdlib (no third-party deps).

Startup sequence:
  1. check_connectivity()  →  is the GitHub API reachable?
  2. check_for_updates()   →  is a newer (or forced) release available?

Force-update triggers:
  - Major version bump: new_major > current_major
  - Release name or body contains the token [MANDATORY] or [BREAKING]
"""

import json
import sys
import time
import urllib.error
import urllib.request
from typing import Optional

from tubemerge.core import settings

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
GITHUB_API_URL = (
    "https://api.github.com/repos/hashamtanveer-41/tubemerger/releases/latest"
)
CONNECTIVITY_TEST_URL = "https://api.github.com"
WEBSITE_DOWNLOAD_URL = "https://tubemerger.com/download"

# OS-specific canonical asset filenames (served via GitHub releases/latest)
_ASSET_MAP = {
    "win32": "TubeMerge-Setup.exe",
    "darwin": "TubeMerge-macOS-x64.zip",
    "linux": "TubeMerge-Linux-x64.tar.gz",
}

GITHUB_RELEASES_BASE = (
    "https://github.com/hashamtanveer-41/tubemerger/releases/latest/download"
)

# Simple in-process cache to avoid hammering the API more than once per hour
_cache: dict = {"data": None, "ts": 0.0}
_CACHE_TTL = 3600  # seconds


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_semver(tag: str) -> tuple[int, int, int]:
    """Parse a 'v1.2.3' or '1.2.3' tag into a (major, minor, patch) tuple."""
    tag = tag.lstrip("vV").strip()
    parts = tag.split(".")
    try:
        major = int(parts[0]) if len(parts) > 0 else 0
        minor = int(parts[1]) if len(parts) > 1 else 0
        patch = int(parts[2].split("-")[0]) if len(parts) > 2 else 0
    except (ValueError, IndexError):
        major = minor = patch = 0
    return major, minor, patch


def _is_mandatory_release(name: str, body: str) -> bool:
    """Check if release notes flag this as a forced/breaking update."""
    combined = (name or "").upper() + " " + (body or "").upper()
    return "[MANDATORY]" in combined or "[BREAKING]" in combined


def _direct_download_url() -> str:
    asset = _ASSET_MAP.get(sys.platform, "TubeMerge-Linux-x64.tar.gz")
    return f"{GITHUB_RELEASES_BASE}/{asset}"


def _fetch_json(url: str, timeout: float = 3.5) -> Optional[dict]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": f"TubeMerge/{settings.VERSION}",
            "Accept": "application/vnd.github+json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def check_connectivity(timeout: float = 4.0) -> bool:
    """Return True if the GitHub API is reachable within *timeout* seconds."""
    req = urllib.request.Request(
        CONNECTIVITY_TEST_URL,
        headers={"User-Agent": f"TubeMerge/{settings.VERSION}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status < 500
    except Exception:
        return False


def check_for_updates() -> dict:
    """Return an update-status dict.

    Returns
    -------
    {
        current_version: str,
        latest_version: str,
        update_available: bool,
        is_major: bool,
        is_force_update: bool,
        release_name: str,
        release_notes: str,
        published_at: str,
        download_url: str,
        website_download_url: str,
    }
    """
    base = {
        "current_version": settings.VERSION,
        "latest_version": settings.VERSION,
        "update_available": False,
        "is_major": False,
        "is_force_update": False,
        "release_name": "",
        "release_notes": "",
        "published_at": "",
        "download_url": _direct_download_url(),
        "website_download_url": WEBSITE_DOWNLOAD_URL,
    }

    # Serve from cache if fresh
    now = time.time()
    if _cache["data"] and (now - _cache["ts"]) < _CACHE_TTL:
        return _cache["data"]

    data = _fetch_json(GITHUB_API_URL)
    if not data:
        return base

    tag = data.get("tag_name", "")
    if not tag:
        return base

    current = _parse_semver(settings.VERSION)
    latest = _parse_semver(tag)

    update_available = latest > current
    is_major = latest[0] > current[0]
    is_mandatory = _is_mandatory_release(
        data.get("name", ""), data.get("body", "")
    )
    is_force_update = is_major or is_mandatory

    result = {
        "current_version": settings.VERSION,
        "latest_version": tag.lstrip("vV"),
        "update_available": update_available,
        "is_major": is_major,
        "is_force_update": is_force_update,
        "release_name": data.get("name", ""),
        "release_notes": data.get("body", ""),
        "published_at": data.get("published_at", ""),
        "download_url": _direct_download_url(),
        "website_download_url": WEBSITE_DOWNLOAD_URL,
    }

    _cache["data"] = result
    _cache["ts"] = now
    return result
