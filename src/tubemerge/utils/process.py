"""Process execution utilities to ensure background processes never spawn visible console windows and run in a clean environment."""

import os
import sys
import subprocess
from typing import Dict, Any

def get_clean_subprocess_env() -> Dict[str, str]:
    """Return a clean environment dictionary for spawning external subprocesses.

    When running inside a PyInstaller frozen bundle on Linux, PyInstaller sets
    LD_LIBRARY_PATH to its bundled _internal directory. External processes
    (such as /usr/bin/python3 invoked by yt-dlp or system ffmpeg) inheriting this
    LD_LIBRARY_PATH fail with symbol/version mismatch errors (e.g. OpenSSL/libcrypto).

    PyInstaller preserves the pre-launch environment in LD_LIBRARY_PATH_ORIG.
    """
    env = dict(os.environ)
    if "LD_LIBRARY_PATH_ORIG" in env:
        env["LD_LIBRARY_PATH"] = env["LD_LIBRARY_PATH_ORIG"]
    else:
        env.pop("LD_LIBRARY_PATH", None)
    return env

def get_hidden_subprocess_kwargs() -> Dict[str, Any]:
    """Return creationflags, startupinfo, and clean env for background subprocesses."""
    kwargs: Dict[str, Any] = {
        "env": get_clean_subprocess_env()
    }
    if sys.platform == "win32":
        # CREATE_NO_WINDOW (0x08000000) prevents creating a console window
        kwargs["creationflags"] = 0x08000000
        # STARTUPINFO with SW_HIDE (0) forces any launched process window to be hidden
        if hasattr(subprocess, "STARTUPINFO"):
            si = subprocess.STARTUPINFO()
            if hasattr(subprocess, "STARTF_USESHOWWINDOW"):
                si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
            si.wShowWindow = 0
            kwargs["startupinfo"] = si
    return kwargs

