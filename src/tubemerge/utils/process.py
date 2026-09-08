"""Process execution utilities to ensure background processes never spawn visible console windows."""

import sys
import subprocess
from typing import Dict, Any

def get_hidden_subprocess_kwargs() -> Dict[str, Any]:
    """Return creationflags and startupinfo that completely suppress console windows on Windows."""
    kwargs: Dict[str, Any] = {}
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
