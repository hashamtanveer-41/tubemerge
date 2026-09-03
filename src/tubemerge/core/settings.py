"""Centralized Application Configuration (Django-style Settings)."""

import os
from pathlib import Path
from typing import Dict, Any

# ---------------------------------------------------------------------------
# Application Branding & Identity
# ---------------------------------------------------------------------------
APP_NAME = "TubeMerge"
APP_TAGLINE = "YouTube Playlist Merger"
DOMAIN = "videoplaylistmerger.com"
VERSION = "1.0.0"

# ---------------------------------------------------------------------------
# Filesystem Paths
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
USER_HOME = Path.home()

def _resolve_data_dir() -> Path:
    """Resolve writable app data directory with safe fallback."""
    candidate = USER_HOME / ".videoplaylistmerger"
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

# Ensure ~/.videoplaylistmerger/bin is in PATH for any subprocesses
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

from tubemerge.core.security_vault import SecurityVault

# Encrypted AES-256-GCM token for distributed binary runtime
_VAULT_FALLBACK_TOKEN = "gzcsZQ5XiB2j4-9fvNh7mcDeN57RdDEG2o2O7w7pW1f4L2wV4-aFqFw87uJcRjGv5v3F8b_h4q0mD2sL9-pW3tM8wG1rK4bE7yQ0uI6aV2hX5fP7zB9mO1lC3jS5eT8rY9uP1k="

SUPABASE_DB_URL = os.environ.get("SUPABASE_DB_URL")
if not SUPABASE_DB_URL or not SUPABASE_DB_URL.startswith("postgresql://"):
    try:
        # Decrypt embedded AES-256 vault token in-memory
        SUPABASE_DB_URL = SecurityVault.decrypt_secret(_VAULT_FALLBACK_TOKEN)
    except Exception:
        SUPABASE_DB_URL = "postgresql://postgres:YjpcvtVyawSMuaeU@db.qjzhdfpnprthvdbijpoq.supabase.co:5432/postgres"
