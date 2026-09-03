"""TubeMerge Cloud API Gateway Server.

Deployable standalone cloud microservice (on Railway, Render, Fly.io, or VPS)
that maintains the private PostgreSQL database connection string and exposes
secure, rate-limited, zero-trust HTTPS endpoints for distributed desktop clients.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tubemerge.apps.auth.routes import router as auth_router
from tubemerge.apps.admin.routes import router as admin_router
from tubemerge.apps.licensing.controllers.license_controller import router as licensing_router
from tubemerge.apps.licensing.controllers.telemetry_controller import router as telemetry_router

def create_cloud_app() -> FastAPI:
    app = FastAPI(
        title="TubeMerge Cloud API Gateway",
        version="1.0.0",
        description="Centralized cloud authentication, licensing, and billing telemetry server.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount Cloud Subsystems
    app.include_router(auth_router)
    app.include_router(licensing_router)
    app.include_router(telemetry_router)
    app.include_router(admin_router)

    @app.get("/health")
    def health():
        return {"status": "ok", "service": "tubemerge-cloud-gateway"}

    return app

app = create_cloud_app()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("tubemerge.cloud_server:app", host="0.0.0.0", port=port, reload=False)
