"""Ed25519 Cryptographic Licensing & Offline Verification Engine."""

import base64
import json
import time
from pathlib import Path
from typing import Dict, Any, Tuple, Optional

from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

from tubemerge.core import settings

# ---------------------------------------------------------------------------
# Master Cryptographic Keys
# Embedded Public Key for offline client-side zero-trust validation.
# ---------------------------------------------------------------------------
EMBEDDED_PUBLIC_KEY_HEX = "495918d7b68b11cd9fe1134719713ef42900666bdb729bc8b5c5c69fec6da445"
_AUTHORITY_PRIVATE_KEY_HEX = "6939b69e4975add44c99d0a7c789a1accfe8b1d9e20f52f773930e71810615ef"

LICENSE_FILE_PATH: Path = settings.APP_DATA_DIR / "license.lic"

class CryptoService:
    """Handles asymmetric signing, token packing, and client-side offline verification."""

    @classmethod
    def _get_public_key(cls) -> ed25519.Ed25519PublicKey:
        raw_bytes = bytes.fromhex(EMBEDDED_PUBLIC_KEY_HEX)
        return ed25519.Ed25519PublicKey.from_public_bytes(raw_bytes)

    @classmethod
    def _get_private_key(cls) -> ed25519.Ed25519PrivateKey:
        raw_bytes = bytes.fromhex(_AUTHORITY_PRIVATE_KEY_HEX)
        return ed25519.Ed25519PrivateKey.from_private_bytes(raw_bytes)

    @classmethod
    def sign_license(cls, payload: Dict[str, Any]) -> str:
        """Asymmetrically signs a license payload with Ed25519.

        Returns a packed string in format: <base64_payload>.<base64_signature>
        """
        json_bytes = json.dumps(payload, sort_keys=True, separators=(',', ':')).encode("utf-8")
        private_key = cls._get_private_key()
        signature = private_key.sign(json_bytes)

        b64_payload = base64.urlsafe_b64encode(json_bytes).decode("ascii")
        b64_signature = base64.urlsafe_b64encode(signature).decode("ascii")

        return f"{b64_payload}.{b64_signature}"

    @classmethod
    def verify_token(
        cls,
        token: str,
        expected_machine_id: str,
    ) -> Tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
        """Verifies Ed25519 signature, node-locked machine binding, and expiration.

        Returns (is_valid, payload_dict, error_reason).
        """
        if not token or "." not in token:
            return False, None, "Malformed license token format."

        parts = token.strip().split(".")
        if len(parts) != 2:
            return False, None, "Invalid license token structure."

        b64_payload, b64_signature = parts

        try:
            payload_bytes = base64.urlsafe_b64decode(b64_payload)
            signature_bytes = base64.urlsafe_b64decode(b64_signature)
        except Exception:
            return False, None, "Cryptographic base64 decoding failure."

        # 1. Asymmetric Cryptographic Verification
        public_key = cls._get_public_key()
        try:
            public_key.verify(signature_bytes, payload_bytes)
        except InvalidSignature:
            return False, None, "Invalid cryptographic signature. Unauthorized tampering detected."
        except Exception as exc:
            return False, None, f"Signature verification exception: {exc}"

        # 2. Payload Parsing
        try:
            payload: Dict[str, Any] = json.loads(payload_bytes.decode("utf-8"))
        except Exception:
            return False, None, "Payload JSON structure is corrupt."

        # 3. Node-Locked Machine ID Validation
        token_machine_id = payload.get("machine_id", "")
        if token_machine_id != expected_machine_id:
            return False, payload, "Node-lock mismatch: license is bound to another workstation."

        # 4. Periodic Offline Tolerance & Expiry Validation
        offline_grace_until = payload.get("offline_grace_until", 0)
        current_time = int(time.time())

        # If offline grace period has passed (e.g. 30 days offline without server check)
        if offline_grace_until and current_time > offline_grace_until:
            return False, payload, "Offline grace period expired. Server verification required."

        return True, payload, None

    @classmethod
    def save_license_file(cls, token: str) -> None:
        """Stores the signed license file securely in user application data."""
        settings.APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(LICENSE_FILE_PATH, "w", encoding="utf-8") as f:
            f.write(token.strip())

    @classmethod
    def load_license_file(cls) -> Optional[str]:
        """Loads the signed license file from local disk if present."""
        if not LICENSE_FILE_PATH.exists():
            return None
        try:
            with open(LICENSE_FILE_PATH, "r", encoding="utf-8") as f:
                content = f.read().strip()
                return content if content else None
        except Exception:
            return None

    @classmethod
    def remove_license_file(cls) -> None:
        """Deletes the local signed license file upon deactivation."""
        if LICENSE_FILE_PATH.exists():
            try:
                LICENSE_FILE_PATH.unlink()
            except Exception:
                pass
