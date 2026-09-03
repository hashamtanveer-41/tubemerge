import re
import subprocess
from typing import Optional

class BinaryInspectorService:
    @staticmethod
    def get_ffmpeg_version(path: str) -> Optional[str]:
        try:
            res = subprocess.run([path, "-version"], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                match = re.search(r"ffmpeg version\s+(\S+)", res.stdout)
                return match.group(1) if match else "unknown"
        except Exception:
            pass
        return None

    @staticmethod
    def get_ytdlp_version(path: str) -> Optional[str]:
        try:
            res = subprocess.run([path, "--version"], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return res.stdout.strip()
        except Exception:
            pass
        return None
