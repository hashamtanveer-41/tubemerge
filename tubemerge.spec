# -*- mode: python ; coding: utf-8 -*-
"""PyInstaller multi-platform build specification for TubeMerge.

Supports:
- Windows: Standalone .exe / installer bundle with assets/logo.ico
- macOS: Standalone Mach-O .app bundle with com.tubemerge.desktop identifier
- Linux: Standalone ELF executable / AppImage target
"""

import sys
import os
from pathlib import Path

block_cipher = None

ROOT_DIR = SPECPATH

# Platform-specific icon selection
if sys.platform.startswith("win"):
    app_icon = os.path.join(ROOT_DIR, "assets", "logo.ico")
elif sys.platform == "darwin":
    icns_path = os.path.join(ROOT_DIR, "assets", "logo.icns")
    app_icon = icns_path if os.path.exists(icns_path) else os.path.join(ROOT_DIR, "assets", "logo.png")
else:
    app_icon = os.path.join(ROOT_DIR, "assets", "logo.png")

datas = [
    (os.path.join(ROOT_DIR, "frontend", "dist"), os.path.join("frontend", "dist")),
    (os.path.join(ROOT_DIR, "assets"), "assets"),
]

hidden_imports = [
    # Uvicorn ASGI internals
    "uvicorn",
    "uvicorn.logging",
    "uvicorn.loops",
    "uvicorn.loops.auto",
    "uvicorn.protocols",
    "uvicorn.protocols.http",
    "uvicorn.protocols.http.auto",
    "uvicorn.protocols.http.h11_impl",
    "uvicorn.protocols.websockets",
    "uvicorn.protocols.websockets.auto",
    "uvicorn.lifespan",
    "uvicorn.lifespan.on",
    # TubeMerge modular packages
    "tubemerge",
    "tubemerge.app",
    "tubemerge.core",
    "tubemerge.core.settings",
    "tubemerge.core.config",
    "tubemerge.server",
    "tubemerge.server.app",
    "tubemerge.db",
    "tubemerge.db.connection",
    "tubemerge.apps",
    "tubemerge.apps.binaries",
    "tubemerge.apps.binaries.routes",
    "tubemerge.apps.binaries.services",
    "tubemerge.apps.playlists",
    "tubemerge.apps.playlists.routes",
    "tubemerge.apps.playlists.services",
    "tubemerge.apps.merger",
    "tubemerge.apps.merger.routes",
    "tubemerge.apps.merger.services",
    "tubemerge.apps.merger.services.engine",
    "tubemerge.apps.merger.services.normalizer",
    "tubemerge.apps.merger.services.stitcher",
    "tubemerge.apps.merger.controllers",
    "tubemerge.apps.merger.controllers.merge_controller",
    "tubemerge.apps.system",
    "tubemerge.apps.system.routes",
    "tubemerge.apps.system.services",
    "tubemerge.apps.history",
    "tubemerge.apps.history.routes",
    "tubemerge.apps.history.services",
    "tubemerge.apps.queues",
    "tubemerge.apps.queues.routes",
    "tubemerge.apps.queues.services",
    "tubemerge.apps.telemetry",
    "tubemerge.apps.telemetry.service",
    # Third party engines
    "httpx",
    "pywebview",
]

a = Analysis(
    ["main.py"],
    pathex=[ROOT_DIR, os.path.join(ROOT_DIR, "src")],
    binaries=[],
    datas=datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        "tkinter",
        "matplotlib",
        "scipy",
        "numpy",
        "IPython",
        "notebook",
        "test",
        "unittest",
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="TubeMerge",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=app_icon,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="TubeMerge",
)

# macOS Application Bundle (.app)
if sys.platform == "darwin":
    app = BUNDLE(
        coll,
        name="TubeMerge.app",
        icon=app_icon,
        bundle_identifier="com.tubemerge.desktop",
        info_plist={
            "NSHighResolutionCapable": "True",
            "LSBackgroundOnly": "False",
            "CFBundleName": "TubeMerge",
            "CFBundleDisplayName": "TubeMerge",
            "CFBundleIdentifier": "com.tubemerge.desktop",
            "CFBundleVersion": "1.0.0",
            "CFBundleShortVersionString": "1.0.0",
        },
    )
