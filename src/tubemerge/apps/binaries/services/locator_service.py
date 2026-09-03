import os
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
        bundled = self.binaries_dir / name
        if bundled.is_file() and os.access(bundled, os.X_OK):
            return bundled

        local_bin = Path.home() / ".local" / "bin" / name
        if local_bin.is_file() and os.access(local_bin, os.X_OK):
            return local_bin

        found = shutil.which(name)
        if found:
            return Path(found)

        return None

    def find_ffmpeg(self) -> str:
        path = self.which("ffmpeg")
        if not path:
            raise FileNotFoundError("FFmpeg executable not found.")
        return str(path)

    def find_ffprobe(self) -> str:
        path = self.which("ffprobe")
        if not path:
            raise FileNotFoundError("FFprobe executable not found.")
        return str(path)

    def find_ytdlp(self) -> str:
        path = self.which("yt-dlp")
        if path:
            return str(path)

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

        raise FileNotFoundError("yt-dlp executable not found.")
