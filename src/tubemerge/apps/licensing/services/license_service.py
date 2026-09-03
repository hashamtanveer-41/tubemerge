"""License Service - Node-Locking, Device Slot Management, and Cryptographic Issuance."""

import sqlite3
import time
from typing import Dict, Any, Optional

from tubemerge.db.connection import get_db_connection
from tubemerge.apps.licensing.services.fingerprint_service import FingerprintService
from tubemerge.apps.licensing.services.crypto_service import CryptoService

# Default maximum allowed concurrent machines per license
MAX_ALLOWED_MACHINES = 2
# Offline grace period: 30 days tolerance
OFFLINE_GRACE_PERIOD_SECONDS = 30 * 86400

class LicenseService:
    """Manages license keys, multi-device slot allocation, and Ed25519 signing."""

    @classmethod
    def get_license_status(cls) -> Dict[str, Any]:
        """Retrieves verified license status using offline cryptographic validation."""
        hwid = FingerprintService.get_hardware_id()
        local_token = CryptoService.load_license_file()

        # Try validating local Ed25519 token offline first
        if local_token:
            is_valid, payload, error_msg = CryptoService.verify_token(local_token, hwid)
            if is_valid and payload:
                tier = payload.get("tier", "PRO")
                key = payload.get("license_key", "")
                grace = payload.get("offline_grace_until", 0)

                # Query database for device count if available
                device_count = cls._get_active_device_count(key)

                return {
                    "status": "active",
                    "plan_tier": tier,
                    "license_key": key,
                    "expires_at": "Lifetime (30d Offline Grace)" if grace else "Lifetime",
                    "hardware_id": hwid,
                    "max_devices": MAX_ALLOWED_MACHINES,
                    "active_devices": max(1, device_count),
                    "offline_grace_until": grace,
                    "offline_verified": True,
                }

        # Check local database fallback
        conn = get_db_connection()
        cur = conn.execute(
            """
            SELECT l.key, l.plan_tier, l.status, l.max_devices, l.expires_at
            FROM licenses l
            JOIN device_activations d ON l.key = d.license_key
            WHERE d.hardware_id = ? AND l.status = 'active'
            LIMIT 1
            """,
            (hwid,)
        )
        row = cur.fetchone()

        if row:
            key, tier, status, max_devices, expires_at = row
            device_count = cls._get_active_device_count(key)

            # Auto-generate and save Ed25519 license file
            cls._issue_and_save_token(key, hwid, tier)

            return {
                "status": "active",
                "plan_tier": tier,
                "license_key": key,
                "expires_at": expires_at or "Lifetime",
                "hardware_id": hwid,
                "max_devices": MAX_ALLOWED_MACHINES,
                "active_devices": max(1, device_count),
                "offline_verified": True,
            }

        return {
            "status": "unlicensed",
            "plan_tier": "FREE",
            "license_key": None,
            "expires_at": None,
            "hardware_id": hwid,
            "max_devices": 1,
            "active_devices": 1,
            "offline_verified": False,
        }

    @classmethod
    def activate_key(cls, key: str, device_name: Optional[str] = None) -> Dict[str, Any]:
        """Validates key, checks device limit (<= 2), binds machine ID, and signs token."""
        clean_key = key.strip().upper()
        if len(clean_key) < 8:
            raise ValueError("License key format is invalid.")

        hwid = FingerprintService.get_hardware_id()
        device_label = device_name or "Primary Workstation"

        # Determine tier
        tier = "LIFETIME" if "LIFE" in clean_key else ("STUDIO" if "STUDIO" in clean_key else "PRO")

        conn = get_db_connection()
        with conn:
            # 1. Verify or register license key in authority store
            conn.execute(
                """
                INSERT INTO licenses (key, plan_tier, status, max_devices, expires_at)
                VALUES (?, ?, 'active', ?, 'Lifetime License')
                ON CONFLICT(key) DO UPDATE SET status = 'active'
                """,
                (clean_key, tier, MAX_ALLOWED_MACHINES)
            )

            # 2. Check if this machine is already activated for this key
            cur_existing = conn.execute(
                "SELECT id FROM device_activations WHERE license_key = ? AND hardware_id = ?",
                (clean_key, hwid)
            )
            already_active = cur_existing.fetchone() is not None

            if not already_active:
                # 3. Check active device count (Node-Locking to 2 machines)
                cur_count = conn.execute(
                    "SELECT COUNT(*) FROM device_activations WHERE license_key = ?",
                    (clean_key,)
                )
                active_count = cur_count.fetchone()[0]

                if active_count >= MAX_ALLOWED_MACHINES:
                    raise ValueError(
                        f"Activation limit reached ({active_count}/{MAX_ALLOWED_MACHINES} machines). "
                        "Please deactivate an older machine to transfer your license."
                    )

                # Bind new machine
                conn.execute(
                    """
                    INSERT INTO device_activations (license_key, hardware_id, device_name)
                    VALUES (?, ?, ?)
                    """,
                    (clean_key, hwid, device_label)
                )
            else:
                # Refresh last ping
                conn.execute(
                    """
                    UPDATE device_activations
                    SET last_ping_at = CURRENT_TIMESTAMP
                    WHERE license_key = ? AND hardware_id = ?
                    """,
                    (clean_key, hwid)
                )

        # 4. Issue Asymmetrically Signed Ed25519 Token
        token = cls._issue_and_save_token(clean_key, hwid, tier)

        status_dict = cls.get_license_status()
        status_dict["license_token"] = token
        return status_dict

    @classmethod
    def deactivate_key(cls) -> Dict[str, Any]:
        """Deactivates and unbinds the current machine, releasing the slot."""
        hwid = FingerprintService.get_hardware_id()
        conn = get_db_connection()

        with conn:
            # Delete machine activation binding
            conn.execute(
                "DELETE FROM device_activations WHERE hardware_id = ?",
                (hwid,)
            )

        # Delete local signed license file
        CryptoService.remove_license_file()

        return cls.get_license_status()

    @classmethod
    def _issue_and_save_token(cls, key: str, hwid: str, tier: str) -> str:
        """Constructs license payload, signs with Ed25519, and saves locally."""
        now = int(time.time())
        payload = {
            "license_key": key,
            "machine_id": hwid,
            "tier": tier,
            "issued_at": now,
            "offline_grace_until": now + OFFLINE_GRACE_PERIOD_SECONDS,
            "max_devices": MAX_ALLOWED_MACHINES,
        }

        token = CryptoService.sign_license(payload)
        CryptoService.save_license_file(token)
        return token

    @classmethod
    def _get_active_device_count(cls, key: str) -> int:
        try:
            conn = get_db_connection()
            cur = conn.execute(
                "SELECT COUNT(*) FROM device_activations WHERE license_key = ?",
                (key,)
            )
            return cur.fetchone()[0]
        except Exception:
            return 1
