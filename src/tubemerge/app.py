import os
import sys
import time
import shutil
import subprocess
import threading
import urllib.request
import webbrowser

import uvicorn
from tubemerge.core import settings
from tubemerge.data.banner import BANNER
from tubemerge.server.app import create_app

def _start_server(port: int) -> None:
    app = create_app()
    config = uvicorn.Config(
        app=app,
        host=settings.HOST,
        port=port,
        log_level="warning",
    )
    server = uvicorn.Server(config)
    server.run()

def _wait_for_server(timeout: float = 12.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{settings.SERVER_URL}/api/health", timeout=0.5) as r:
                if r.status == 200:
                    return True
        except Exception:
            time.sleep(0.1)
    return False

def _launch_desktop_window() -> None:
    url = f"{settings.SERVER_URL}/"
    has_display = bool(os.environ.get("DISPLAY") or os.environ.get("WAYLAND_DISPLAY"))

    launched_gui = False
    if has_display:
        # 1. Primary: Native PyWebView GTK / Cocoa / WinForms desktop frame
        try:
            import webview
            window = webview.create_window(
                title=f"{settings.APP_NAME} – {settings.APP_TAGLINE}",
                url=url,
                width=1280,
                height=820,
                min_size=(960, 640),
                background_color="#0F0F0F",
            )
            webview.start()
            launched_gui = True
        except Exception as exc:
            print(f"Native PyWebView window unavailable ({exc}). Checking for standalone desktop browser mode...")

        # 2. Secondary Linux fallback: Chromeless Standalone Desktop App Window (--app=...)
        if not launched_gui:
            chromium_bins = ["google-chrome", "chromium", "chromium-browser", "brave-browser", "microsoft-edge"]
            for bin_name in chromium_bins:
                bin_path = shutil.which(bin_name)
                if bin_path:
                    try:
                        # Opens as an isolated standalone desktop frame (no address bar, no tabs)
                        subprocess.Popen([
                            bin_path,
                            f"--app={url}",
                            "--window-size=1280,820",
                            "--class=TubeMerge",
                        ])
                        launched_gui = True
                        print(f"Launched standalone desktop app window via {bin_name}.")
                        break
                    except Exception:
                        continue

    # 3. Tertiary fallback: System browser redirection
    if not launched_gui:
        print(f"TubeMerge is running at {settings.SERVER_URL}")
        try:
            webbrowser.open(url)
        except Exception:
            pass

    try:
        if sys.stdin and sys.stdin.isatty():
            input("[Press Enter or Ctrl+C to stop TubeMerge]\n")
        else:
            while True:
                time.sleep(1)
    except (KeyboardInterrupt, EOFError):
        print(f"Shutting down {settings.APP_NAME}. Goodbye.")

def run() -> None:
    print(BANNER)
    print("Starting TubeMerge backend...")

    # Dynamic Port Allocation: Lease an ephemeral kernel port if 7842 is busy/held
    actual_port = settings.find_available_port(settings.HOST, settings.PORT)
    if actual_port != settings.PORT:
        print(f"Port {settings.PORT} is busy; dynamically bound to port {actual_port}.")
    settings.PORT = actual_port
    settings.SERVER_URL = f"http://{settings.HOST}:{actual_port}"

    server_thread = threading.Thread(target=_start_server, args=(actual_port,), daemon=True)
    server_thread.start()

    if not _wait_for_server():
        print("Backend failed to start.")
        sys.exit(1)

    print("Backend ready.")
    _launch_desktop_window()
