import os
import sys
import time
import threading
import urllib.request
import webbrowser

import uvicorn
from tubemerge.core import settings
from tubemerge.data.banner import BANNER
from tubemerge.server.app import create_app

def _start_server() -> None:
    app = create_app()
    config = uvicorn.Config(
        app=app,
        host=settings.HOST,
        port=settings.PORT,
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
            print(f"Native desktop window unavailable ({exc}). Opening in default browser.")

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

    server_thread = threading.Thread(target=_start_server, daemon=True)
    server_thread.start()

    if not _wait_for_server():
        print("Backend failed to start.")
        sys.exit(1)

    print("Backend ready.")
    _launch_desktop_window()
