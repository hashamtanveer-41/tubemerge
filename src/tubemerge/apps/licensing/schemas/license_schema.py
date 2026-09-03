from typing import Optional
from pydantic import BaseModel

class ActivateLicenseRequest(BaseModel):
    license_key: str
    machine_id: Optional[str] = None
    device_name: Optional[str] = None

class LicenseStatusResponse(BaseModel):
    status: str
    plan_tier: str
    license_key: Optional[str] = None
    expires_at: Optional[str] = None
    hardware_id: str
    max_devices: int = 2
    active_devices: int = 1
    offline_verified: Optional[bool] = True
    license_token: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    handle: str
    created_at: str

class UsageMetricsResponse(BaseModel):
    requests_today: int
    daily_quota: int
    quota_period: Optional[str] = "week"
    total_lifetime_merges: int
    total_minutes_processed: int
    quota_reset_in_hours: int
