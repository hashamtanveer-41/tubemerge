from fastapi import APIRouter, Header, HTTPException, Request
from typing import Optional, List, Dict, Any

from tubemerge.apps.billing.schemas import (
    CreateCheckoutRequest,
    CreateCheckoutResponse,
    PlanItem,
)
from tubemerge.apps.billing.services import BillingService
from tubemerge.apps.auth.services import AuthService

router = APIRouter(prefix="/api/billing", tags=["Cloud Billing & Payments"])

def _extract_token(authorization: Optional[str] = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required.")
    parts = authorization.split(" ")
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return authorization

@router.get("/plans", response_model=List[PlanItem])
def get_plans():
    """Retrieve public subscription and lifetime plans catalog."""
    return BillingService.get_plans()

@router.post("/create-checkout-session", response_model=CreateCheckoutResponse)
def create_checkout_session(
    payload: CreateCheckoutRequest,
    authorization: Optional[str] = Header(None),
):
    """Generates a secure Stripe Checkout Session URL for upgrading."""
    token = _extract_token(authorization)
    auth_data = AuthService.get_current_user(token)
    user = auth_data.user

    try:
        result = BillingService.create_checkout_session(
            user_id=user.id,
            user_email=user.email,
            plan_tier=payload.plan_tier,
            success_url=payload.success_url,
            cancel_url=payload.cancel_url,
        )
        return CreateCheckoutResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None),
):
    """Processes Stripe Webhooks for instant license fulfillment."""
    payload = await request.body()
    try:
        res = BillingService.handle_webhook(payload, stripe_signature)
        return res
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(exc)}")
