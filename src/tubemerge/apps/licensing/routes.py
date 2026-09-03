from typing import Optional
from fastapi import APIRouter, Header
from tubemerge.apps.licensing.controllers.license_controller import LicenseController
from tubemerge.apps.licensing.schemas.license_schema import (
    ActivateLicenseRequest,
    LicenseStatusResponse,
    UserProfileResponse,
    UsageMetricsResponse,
)

router = APIRouter(tags=["Licensing & Anti-Piracy"])

# ---------------------------------------------------------------------------
# Standard Endpoints (Client / Frontend)
# ---------------------------------------------------------------------------
@router.get("/api/license/status", response_model=LicenseStatusResponse)
def get_license_status(authorization: Optional[str] = Header(None)):
    return LicenseController.get_status(authorization)

@router.post("/api/license/activate", response_model=LicenseStatusResponse)
def activate_license(request: ActivateLicenseRequest):
    return LicenseController.activate(request)

@router.post("/api/license/deactivate", response_model=LicenseStatusResponse)
def deactivate_license():
    return LicenseController.deactivate()

@router.get("/api/account/profile", response_model=UserProfileResponse)
def get_user_profile(authorization: Optional[str] = Header(None)):
    return LicenseController.get_profile(authorization)

@router.get("/api/account/usage", response_model=UsageMetricsResponse)
def get_account_usage(authorization: Optional[str] = Header(None)):
    return LicenseController.get_usage(authorization)

# ---------------------------------------------------------------------------
# Versioned Node-Locking Endpoints (/api/v1/license/*)
# ---------------------------------------------------------------------------
@router.get("/api/v1/license/status", response_model=LicenseStatusResponse)
def v1_get_license_status(authorization: Optional[str] = Header(None)):
    return LicenseController.get_status(authorization)

@router.post("/api/v1/license/activate", response_model=LicenseStatusResponse)
def v1_activate_license(request: ActivateLicenseRequest):
    return LicenseController.activate(request)

@router.post("/api/v1/license/deactivate", response_model=LicenseStatusResponse)
def v1_deactivate_license():
    return LicenseController.deactivate()
