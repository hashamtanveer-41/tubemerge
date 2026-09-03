"""System Service - Interacts with host OS desktop environment."""

import os
import platform
import subprocess
from pathlib import Path

class SystemService:
    """Invokes native file managers and media players across OS platforms."""

    @staticmethod
    def open_file(path_str: str) -> bool:
        """Open file in system default media player."""
        p = Path(path_str)
        if not p.exists():
            return False

        system = platform.system()
        try:
            if system == "Linux":
                subprocess.Popen(["xdg-open", str(p)])
            elif system == "Darwin":
                subprocess.Popen(["open", str(p)])
            elif system == "Windows":
                os.startfile(str(p))
            return True
        except Exception:
            return False

    @staticmethod
    def open_folder(path_str: str) -> bool:
        """Open containing folder in Nautilus / Explorer / Finder."""
        p = Path(path_str)
        target_dir = p if p.is_dir() else p.parent

        if not target_dir.exists():
            return False

        system = platform.system()
        try:
            if system == "Linux":
                subprocess.Popen(["xdg-open", str(target_dir)])
            elif system == "Darwin":
                subprocess.Popen(["open", str(target_dir)])
            elif system == "Windows":
                subprocess.Popen(["explorer", str(target_dir)])
            return True
        except Exception:
            return False
