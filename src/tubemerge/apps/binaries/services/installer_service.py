import stat
import tarfile
import urllib.request
from pathlib import Path
from typing import Optional, Tuple
from tubemerge.core import settings

FFMPEG_URL = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
YTDLP_URL = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"

class BinaryInstallerService:
    def __init__(self, binaries_dir: Optional[Path] = None):
        self.binaries_dir = binaries_dir or settings.BINARIES_DIR
        self.binaries_dir.mkdir(parents=True, exist_ok=True)

    def download_ytdlp(self) -> str:
        dest = self.binaries_dir / "yt-dlp"
        urllib.request.urlretrieve(YTDLP_URL, dest)
        dest.chmod(dest.stat().st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)
        return str(dest)

    def download_ffmpeg(self) -> Tuple[str, str]:
        tar_dest = self.binaries_dir / "ffmpeg.tar.xz"
        urllib.request.urlretrieve(FFMPEG_URL, tar_dest)

        with tarfile.open(tar_dest, "r:xz") as tar:
            for member in tar.getmembers():
                if member.name.endswith("/ffmpeg") or member.name == "ffmpeg":
                    member.name = "ffmpeg"
                    tar.extract(member, path=self.binaries_dir)
                elif member.name.endswith("/ffprobe") or member.name == "ffprobe":
                    member.name = "ffprobe"
                    tar.extract(member, path=self.binaries_dir)

        tar_dest.unlink(missing_ok=True)
        ffmpeg_path = self.binaries_dir / "ffmpeg"
        ffprobe_path = self.binaries_dir / "ffprobe"

        ffmpeg_path.chmod(ffmpeg_path.stat().st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)
        ffprobe_path.chmod(ffprobe_path.stat().st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)

        return str(ffmpeg_path), str(ffprobe_path)
