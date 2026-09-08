"""Centralized Application Configuration (Django-style Settings)."""

import os
import sys
from pathlib import Path
from typing import Dict, Any

# ---------------------------------------------------------------------------
# Application Branding & Identity
# ---------------------------------------------------------------------------
APP_NAME = "TubeMerge"
APP_TAGLINE = "YouTube Playlist Merger"
DOMAIN = "tubemerger.com"
VERSION = "1.0.0"

# ---------------------------------------------------------------------------
# Filesystem Paths
# ---------------------------------------------------------------------------
if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
    PROJECT_ROOT = Path(sys._MEIPASS)
else:
    PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent

USER_HOME = Path.home()

def _resolve_data_dir() -> Path:
    """Resolve writable app data directory with safe fallback."""
    candidate = USER_HOME / ".tubemerger"
    legacy = USER_HOME / ".videoplaylistmerger"
    if legacy.exists() and not candidate.exists():
        try:
            import shutil
            shutil.copytree(legacy, candidate)
        except Exception:
            pass
    try:
        candidate.mkdir(parents=True, exist_ok=True)
        test_file = candidate / ".write_test"
        test_file.touch()
        test_file.unlink()
        return candidate
    except Exception:
        fallback = PROJECT_ROOT / ".data"
        fallback.mkdir(parents=True, exist_ok=True)
        return fallback

APP_DATA_DIR = _resolve_data_dir()
BINARIES_DIR = APP_DATA_DIR / "bin"
BINARIES_DIR.mkdir(parents=True, exist_ok=True)

TEMP_WORKDIR = APP_DATA_DIR / "temp_workdir"
TEMP_WORKDIR.mkdir(parents=True, exist_ok=True)

SETTINGS_FILE = APP_DATA_DIR / "settings.json"

def _resolve_output_dir() -> Path:
    """Resolve default video output directory."""
    for candidate in [USER_HOME / "Videos", USER_HOME / "Downloads", PROJECT_ROOT / "output"]:
        try:
            candidate.mkdir(parents=True, exist_ok=True)
            test_file = candidate / ".write_test"
            test_file.touch()
            test_file.unlink()
            return candidate
        except Exception:
            continue
    fallback = PROJECT_ROOT / "output"
    fallback.mkdir(parents=True, exist_ok=True)
    return fallback

DEFAULT_OUTPUT_DIR = _resolve_output_dir()

# Ensure ~/.tubemerger/bin is in PATH for any subprocesses
os.environ["PATH"] = f"{BINARIES_DIR}:{os.environ.get('PATH', '')}"

# ---------------------------------------------------------------------------
# Canvas & Encoding Presets
# ---------------------------------------------------------------------------
CANVAS_PRESETS: Dict[str, Dict[str, Any]] = {
    "auto": {
        "label": "Auto (Match First Video)",
        "width": 1920,
        "height": 1080,
        "fps": 30,
    },
    "1080p": {
        "label": "1080p Full HD (1920x1080, 16:9)",
        "width": 1920,
        "height": 1080,
        "fps": 30,
    },
    "720p": {
        "label": "720p HD (1280x720, 16:9)",
        "width": 1280,
        "height": 720,
        "fps": 30,
    },
    "480p": {
        "label": "480p SD (854x480, 16:9)",
        "width": 854,
        "height": 480,
        "fps": 30,
    },
    "360p": {
        "label": "360p Low (640x360, 16:9)",
        "width": 640,
        "height": 360,
        "fps": 30,
    },
    "4k": {
        "label": "4K Ultra HD (3840x2160, 16:9)",
        "width": 3840,
        "height": 2160,
        "fps": 30,
    },
    "9:16": {
        "label": "9:16 Vertical (Shorts / Reels, 1080x1920)",
        "width": 1080,
        "height": 1920,
        "fps": 30,
    },
}

DEFAULT_CRF = 21
DEFAULT_AUDIO_BITRATE = "192k"
AUDIO_SAMPLE_RATE = 44100
AUDIO_CHANNELS = 2

# ---------------------------------------------------------------------------
# Network & Server
# ---------------------------------------------------------------------------
HOST = "127.0.0.1"
PORT = 7842
SERVER_URL = f"http://{HOST}:{PORT}"

# ---------------------------------------------------------------------------
# Supabase Cloud Database Configuration
# ---------------------------------------------------------------------------
def _load_env_file():
    env_file = PROJECT_ROOT / ".env"
    if env_file.exists():
        try:
            for line in env_file.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip())
        except Exception:
            pass

_load_env_file()

SUPABASE_DB_URL = None
