"""FastAPI Application Factory - Assembles modular apps and static assets."""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from tubemerge.core import settings
from tubemerge.db import init_db
from tubemerge.apps.binaries.routes import router as binaries_router
from tubemerge.apps.playlists.routes import router as playlists_router
from tubemerge.apps.merger.routes import router as merger_router
from tubemerge.apps.system.routes import router as system_router
from tubemerge.apps.licensing import licensing_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler initializing directories and database on boot."""
    settings.BINARIES_DIR.mkdir(parents=True, exist_ok=True)
    settings.TEMP_WORKDIR.mkdir(parents=True, exist_ok=True)
    settings.DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    init_db()
    yield

def create_app() -> FastAPI:
    """Instantiate and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        description=settings.APP_TAGLINE,
        version=settings.VERSION,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register modular apps routers
    app.include_router(binaries_router)
    app.include_router(playlists_router)
    app.include_router(merger_router)
    app.include_router(system_router)
    app.include_router(licensing_router)

    # Mount static assets (logo.png)
    assets_dir = settings.PROJECT_ROOT / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    # Mount compiled React + Vite distribution
    frontend_dist = settings.PROJECT_ROOT / "frontend" / "dist"
    if frontend_dist.exists():
        static_dir = frontend_dist / "static"
        if static_dir.exists():
            app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

        @app.get("/")
        async def serve_index():
            return FileResponse(frontend_dist / "index.html")

        @app.get("/{catchall:path}")
        async def serve_spa(catchall: str):
            file_path = frontend_dist / catchall
            if file_path.is_file():
                return FileResponse(file_path)
            return FileResponse(frontend_dist / "index.html")

    return app
