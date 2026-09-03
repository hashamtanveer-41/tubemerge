from fastapi import HTTPException
from tubemerge.apps.licensing.services.license_service import LicenseService
from tubemerge.apps.licensing.services.telemetry_service import TelemetryService
from tubemerge.apps.licensing.schemas.license_schema import (
    ActivateLicenseRequest,
    LicenseStatusResponse,
    UserProfileResponse,
    UsageMetricsResponse,
)

class LicenseController:
    @staticmethod
    def get_status() -> LicenseStatusResponse:
        status_dict = LicenseService.get_license_status()
        return LicenseStatusResponse(**status_dict)

    @staticmethod
    def activate(request: ActivateLicenseRequest) -> LicenseStatusResponse:
        try:
            status_dict = LicenseService.activate_key(
                key=request.license_key,
                device_name=request.device_name,
            )
            TelemetryService.record_request("/api/license/activate", 200)
            return LicenseStatusResponse(**status_dict)
        except ValueError as exc:
            msg = str(exc)
            status_code = 409 if "limit reached" in msg.lower() else 422
            raise HTTPException(status_code=status_code, detail=msg)

    @staticmethod
    def deactivate() -> LicenseStatusResponse:
        status_dict = LicenseService.deactivate_key()
        TelemetryService.record_request("/api/license/deactivate", 200)
        return LicenseStatusResponse(**status_dict)

    @staticmethod
    def get_profile() -> UserProfileResponse:
        TelemetryService.record_request("/api/account/profile", 200)
        return UserProfileResponse(
            id="usr_creator_01",
            name="TubeMerge Creator",
            email="creator@videoplaylistmerger.com",
            handle="@creator.tubemerge",
            created_at="Sep 2026",
        )

    @staticmethod
    def get_usage() -> UsageMetricsResponse:
        license_info = LicenseService.get_license_status()
        quota = 100 if license_info["plan_tier"] in ("PRO", "STUDIO", "LIFETIME") else 3
        usage_dict = TelemetryService.get_daily_usage(daily_quota=quota)
        return UsageMetricsResponse(**usage_dict)
