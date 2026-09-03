#!/usr/bin/env python3
"""Root application entrypoint delegating to src/tubemerge."""

import sys
from pathlib import Path

# Add src/ to sys.path
SRC_DIR = Path(__file__).resolve().parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from tubemerge.app import run

if __name__ == "__main__":
    run()
