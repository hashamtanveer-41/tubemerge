from typing import Optional
from fastapi import HTTPException
from tubemerge.apps.licensing.services.license_service import LicenseService
from tubemerge.apps.licensing.services.telemetry_service import TelemetryService
from tubemerge.apps.licensing.services.fingerprint_service import FingerprintService
from tubemerge.apps.auth.services import AuthService
from tubemerge.apps.licensing.schemas.license_schema import (
    ActivateLicenseRequest,
    LicenseStatusResponse,
    UserProfileResponse,
    UsageMetricsResponse,
)

class LicenseController:
    @staticmethod
    def _extract_token(authorization: Optional[str]) -> Optional[str]:
        if not authorization:
            return None
        parts = authorization.split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]
        return authorization

    @classmethod
    def get_status(cls, authorization: Optional[str] = None) -> LicenseStatusResponse:
        token = cls._extract_token(authorization)
        if token:
            try:
                user_info = AuthService.get_current_user(token)
                return LicenseStatusResponse(
                    status="active",
                    plan_tier=user_info.get("plan_tier", "CREATOR_PRO"),
                    license_key=None,
                    expires_at="Lifetime Cloud License" if user_info.get("plan_tier") == "LIFETIME" else "Active Subscription",
                    hardware_id=FingerprintService.get_hardware_id(),
                    max_devices=user_info.get("max_devices", 2),
                    active_devices=len(user_info.get("active_devices", [])),
                    offline_verified=True,
                )
            except Exception:
                pass

        status_dict = LicenseService.get_license_status()
        return LicenseStatusResponse(**status_dict)

    @staticmethod
    def activate(request: ActivateLicenseRequest) -> LicenseStatusResponse:
        try:
            status_dict = LicenseService.activate_key(
                key=request.license_key,
                device_name=request.device_name,
            )
            return LicenseStatusResponse(**status_dict)
        except ValueError as exc:
            msg = str(exc)
            status_code = 409 if "limit reached" in msg.lower() else 422
            raise HTTPException(status_code=status_code, detail=msg)

    @staticmethod
    def deactivate() -> LicenseStatusResponse:
        status_dict = LicenseService.deactivate_key()
        return LicenseStatusResponse(**status_dict)

    @classmethod
    def get_profile(cls, authorization: Optional[str] = None) -> UserProfileResponse:
        token = cls._extract_token(authorization)
        if token:
            try:
                user_info = AuthService.get_current_user(token)
                user = user_info["user"]
                return UserProfileResponse(
                    id=user["id"],
                    name=user.get("full_name") or "Creator",
                    email=user["email"],
                    handle=user.get("handle") or "@creator",
                    created_at=user.get("created_at") or "Sep 2026",
                )
            except Exception:
                pass

        return UserProfileResponse(
            id="usr_guest",
            name="Guest Creator",
            email="guest@tubemerge.local",
            handle="@guest.tubemerge",
            created_at="Sep 2026",
        )

    @classmethod
    def get_usage(cls, authorization: Optional[str] = None) -> UsageMetricsResponse:
        token = cls._extract_token(authorization)
        user_id = None
        plan_tier = "FREE"

        if token:
            try:
                user_info = AuthService.get_current_user(token)
                user_id = user_info["user"]["id"]
                plan_tier = user_info.get("plan_tier", "COMMUNITY")
            except Exception:
                pass

        if not user_id:
            lic = LicenseService.get_license_status()
            plan_tier = lic.get("plan_tier", "FREE")

        daily_quota = (
            1_000_000 if plan_tier == "LIFETIME"
            else (100 if plan_tier in ("PRO", "CREATOR_PRO", "STUDIO") else 3)
        )

        hwid = FingerprintService.get_hardware_id()
        usage_dict = TelemetryService.get_user_usage(
            user_id=user_id,
            hardware_id=hwid,
            daily_quota=daily_quota,
        )
        return UsageMetricsResponse(**usage_dict)
