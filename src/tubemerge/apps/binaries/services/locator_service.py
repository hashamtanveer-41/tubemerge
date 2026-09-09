import os
import sys
import shutil
import stat
from pathlib import Path
from typing import Optional
from tubemerge.core import settings

class BinaryLocatorService:
    def __init__(self, binaries_dir: Optional[Path] = None):
        self.binaries_dir = binaries_dir or settings.BINARIES_DIR
        self.binaries_dir.mkdir(parents=True, exist_ok=True)

    def which(self, name: str) -> Optional[Path]:
        names = [name]
        if sys.platform == "win32" and not name.endswith(".exe"):
            names = [f"{name}.exe", name]

        for n in names:
            # 1. Bundled in user app data binaries dir (~/.tubemerger/bin)
            bundled = self.binaries_dir / n
            if bundled.is_file() and (sys.platform == "win32" or os.access(bundled, os.X_OK)):
                return bundled

            # 2. Bundled inside application installation directory
            # Windows: C:\Program Files\TubeMerge\bin
            # macOS: TubeMerge.app/Contents/MacOS/bin or TubeMerge.app/Contents/Resources/bin
            if getattr(sys, "frozen", False):
                app_dir = Path(sys.executable).parent
            else:
                app_dir = Path(__file__).resolve().parents[4]

            candidates = [
                app_dir / n,
                app_dir / "bin" / n,
                app_dir.parent / "Resources" / n,
                app_dir.parent / "Resources" / "bin" / n,
            ]
            for candidate in candidates:
                if candidate.is_file() and (sys.platform == "win32" or os.access(candidate, os.X_OK)):
                    return candidate

            # 3. macOS Homebrew & MacPorts paths (when launched from Finder without shell PATH)
            if sys.platform == "darwin":
                mac_candidates = [
                    Path("/opt/homebrew/bin") / n,      # Apple Silicon Homebrew (M1/M2/M3/M4)
                    Path("/usr/local/bin") / n,         # Intel Homebrew
                    Path("/opt/local/bin") / n,         # MacPorts
                ]
                for mac_p in mac_candidates:
                    if mac_p.is_file() and os.access(mac_p, os.X_OK):
                        return mac_p

            # 4. User local bin (~/.local/bin)
            local_bin = Path.home() / ".local" / "bin" / n
            if local_bin.is_file() and (sys.platform == "win32" or os.access(local_bin, os.X_OK)):
                return local_bin

            # 5. System PATH via shutil.which
            found = shutil.which(n)
            if found:
                return Path(found)

        return None

    def find_ffmpeg(self) -> str:
        path = self.which("ffmpeg")
        if not path:
            raise FileNotFoundError("FFmpeg executable not found. Please click 'Install Binaries' in Settings.")
        return str(path)

    def find_ffprobe(self) -> str:
        path = self.which("ffprobe")
        if not path:
            raise FileNotFoundError("FFprobe executable not found. Please click 'Install Binaries' in Settings.")
        return str(path)

    def find_ytdlp(self) -> str:
        path = self.which("yt-dlp")
        if path:
            return str(path)

        # On non-Windows platforms only, create a python wrapper script if yt_dlp is installed
        if sys.platform != "win32":
            try:
                import yt_dlp
                wrapper = self.binaries_dir / "yt-dlp"
                if not wrapper.exists():
                    with open(wrapper, "w") as f:
                        f.write("#!/usr/bin/env python3\nimport sys\nfrom yt_dlp import main\nsys.exit(main())\n")
                    wrapper.chmod(wrapper.stat().st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)
                return str(wrapper)
            except ImportError:
                pass

        raise FileNotFoundError("yt-dlp executable not found. Please click 'Install Binaries' in Settings.")
