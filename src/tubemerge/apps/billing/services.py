import os
import secrets
import logging
from typing import Dict, Any, List, Optional
import stripe

from tubemerge.apps.auth.db import get_supabase_cursor

logger = logging.getLogger(__name__)

# Stripe API configuration from environment
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

PLANS_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "COMMUNITY",
        "name": "Community Free",
        "price": "$0",
        "interval": "Forever",
        "description": "Essential playlist stitching for personal listening & study.",
        "features": [
            "3 playlist merges per week",
            "Up to 1080p Full HD encoding",
            "Standard CPU software encoding",
            "1 linked workstation node",
        ],
        "popular": False,
        "badge": None,
    },
    {
        "id": "CREATOR_PRO_MONTHLY",
        "name": "Creator Pro (Monthly)",
        "price": "$9",
        "interval": "per month",
        "description": "Uncapped multi-hour playlists for YouTube creators & editors.",
        "features": [
            "Unlimited playlist merges (No limits)",
            "4K 60FPS Ultra HD encoding",
            "NVIDIA / Apple Silicon NVENC acceleration",
            "Automatic YouTube chapters embedding",
            "2 active workstation nodes",
        ],
        "popular": True,
        "badge": "MOST POPULAR",
    },
    {
        "id": "LIFETIME",
        "name": "Lifetime Hero Pass",
        "price": "$49",
        "interval": "one-time payment",
        "description": "Pay once, own TubeMerge forever with all future AI updates included.",
        "features": [
            "Everything in Creator Pro forever",
            "All future v2.0 AI tools included (Auto-Bumper, Voice Ripper)",
            "Permanent offline cryptographic license",
            "Priority discord & email support",
            "Up to 5 workstation nodes",
        ],
        "popular": False,
        "badge": "BEST VALUE",
    },
]

class BillingService:
    @staticmethod
    def get_plans() -> List[Dict[str, Any]]:
        """Returns public subscription plans catalog."""
        return PLANS_CATALOG

    @staticmethod
    def create_checkout_session(
        user_id: str,
        user_email: str,
        plan_tier: str,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
    ) -> Dict[str, str]:
        """Creates a Stripe Checkout Session for subscription or lifetime purchase."""
        s_url = success_url or "http://127.0.0.1:7842/ui/index.html?payment=success"
        c_url = cancel_url or "http://127.0.0.1:7842/ui/index.html?payment=cancelled"

        target_tier = "LIFETIME" if "LIFETIME" in plan_tier.upper() else "CREATOR_PRO"

        # If Stripe credentials are not set in .env, provide a safe simulated checkout link
        if not STRIPE_SECRET_KEY:
            logger.info("STRIPE_SECRET_KEY not set. Generating simulated instant checkout.")
            # In development/demo, simulate immediate fulfillment
            BillingService.fulfill_purchase(user_id=user_id, plan_tier=target_tier)
            return {
                "checkout_url": f"{s_url}&simulated=true&plan={target_tier}",
                "session_id": f"sim_sess_{secrets.token_hex(12)}",
                "plan_tier": target_tier,
            }

        unit_amount = 4900 if target_tier == "LIFETIME" else 900
        mode = "payment" if target_tier == "LIFETIME" else "subscription"

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                customer_email=user_email,
                client_reference_id=user_id,
                metadata={
                    "user_id": user_id,
                    "target_tier": target_tier,
                    "plan_id": plan_tier,
                },
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": f"TubeMerge {target_tier.replace('_', ' ').title()}",
                                "description": "Uncapped 4K YouTube Playlist Merger & Chapter Embedder",
                            },
                            "unit_amount": unit_amount,
                            **({"recurring": {"interval": "month"}} if mode == "subscription" else {}),
                        },
                        "quantity": 1,
                    }
                ],
                mode=mode,
                success_url=f"{s_url}&session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=c_url,
            )
            return {
                "checkout_url": session.url,
                "session_id": session.id,
                "plan_tier": target_tier,
            }
        except Exception as exc:
            logger.error("Stripe session creation error: %s", exc)
            raise ValueError(f"Stripe error: {str(exc)}")

    @staticmethod
    def fulfill_purchase(user_id: str, plan_tier: str) -> None:
        """Fulfills entitlement after verified payment webhook."""
        normalized_tier = "LIFETIME" if "LIFETIME" in plan_tier.upper() else "CREATOR_PRO"
        prefix = "TM-LIFETIME" if normalized_tier == "LIFETIME" else "TM-PRO"
        product_key = f"{prefix}-{secrets.token_hex(4).upper()}-{secrets.token_hex(4).upper()}"
        max_devices = 5 if normalized_tier == "LIFETIME" else 2

        try:
            import uuid
            # Verify valid UUID string
            user_uuid = str(uuid.UUID(str(user_id)))

            with get_supabase_cursor() as cur:
                # 1. Update user tier
                cur.execute(
                    "UPDATE public.users SET tier = %s, updated_at = NOW() WHERE id = %s;",
                    (normalized_tier, user_uuid),
                )

                # 2. Issue master product license key
                cur.execute(
                    """
                    INSERT INTO public.user_licenses (user_id, license_key, tier, status, max_devices)
                    VALUES (%s, %s, %s, 'active', %s)
                    ON CONFLICT (license_key) DO NOTHING;
                    """,
                    (user_uuid, product_key, normalized_tier, max_devices),
                )

            logger.info(
                "Fulfillment complete for user %s: Tier upgraded to %s (License: %s)",
                user_uuid,
                normalized_tier,
                product_key,
            )
        except Exception as exc:
            logger.warning("Fulfillment DB update skipped: %s", exc)

    @staticmethod
    def handle_webhook(payload: bytes, sig_header: Optional[str]) -> Dict[str, Any]:
        """Validates and processes Stripe webhook events."""
        if not STRIPE_WEBHOOK_SECRET:
            # Fallback for webhook testing without signature verification
            import json
            event = json.loads(payload.decode("utf-8"))
        else:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )

        event_type = event.get("type")
        logger.info("Received Stripe webhook event: %s", event_type)

        if event_type == "checkout.session.completed":
            session = event.get("data", {}).get("object", {})
            user_id = session.get("client_reference_id") or session.get("metadata", {}).get("user_id")
            plan_tier = session.get("metadata", {}).get("target_tier", "CREATOR_PRO")

            if user_id:
                BillingService.fulfill_purchase(user_id=user_id, plan_tier=plan_tier)
                return {"status": "fulfilled", "user_id": user_id, "tier": plan_tier}

        return {"status": "ignored", "event": event_type}
