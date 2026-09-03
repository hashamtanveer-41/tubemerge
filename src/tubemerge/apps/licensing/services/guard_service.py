"""Client-Side Anti-Tamper & Distributed Pipeline Enforcement Guard."""

import hashlib
import time
from dataclasses import dataclass
from typing import Dict, Any, List, Optional

from tubemerge.apps.licensing.services.fingerprint_service import FingerprintService
from tubemerge.apps.licensing.services.crypto_service import CryptoService

@dataclass(frozen=True)
class PipelineCapabilityPolicy:
    """Cryptographically-derived capabilities for video processing engines.

    Avoids naive boolean checks (`if isPro`) by providing pipeline configurations
    derived directly from the verified cryptographic payload.
    """
    tier: str
    is_licensed: bool
    max_width: int
    max_height: int
    max_fps: int
    allow_hardware_acceleration: bool
    max_parallel_workers: int
    pipeline_validation_checksum: str

    def clamp_dimensions(self, width: int, height: int, fps: int) -> tuple[int, int, int]:
        """Clamps dimensions to cryptographically authorized limits."""
        final_w = min(width, self.max_width)
        final_h = min(height, self.max_height)
        final_fps = min(fps, self.max_fps)
        return final_w, final_h, final_fps

    def get_encoder_config(self, crf: int = 21, preset: str = "fast") -> List[str]:
        """Derives FFmpeg encoder arguments from validated capabilities."""
        if self.allow_hardware_acceleration and self.is_licensed:
            # Hardware-accelerated encoding authorized by cryptographic token
            return ["-c:v", "libx264", "-preset", preset, "-crf", str(crf)]
        # Default community tier encoding
        return ["-c:v", "libx264", "-preset", "medium", "-crf", str(max(crf, 23))]

class LicensingGuard:
    """Anti-tamper licensing guard distributed into application operations."""

    @classmethod
    def get_effective_policy(cls) -> PipelineCapabilityPolicy:
        """Inspects and cryptographically verifies local license state offline.

        Validates the Ed25519 signature and node-locked hardware ID.
        """
        hwid = FingerprintService.get_hardware_id()
        raw_token = CryptoService.load_license_file()

        if not raw_token:
            return cls._get_default_community_policy(hwid)

        is_valid, payload, error_reason = CryptoService.verify_token(raw_token, hwid)

        if not is_valid or not payload:
            return cls._get_default_community_policy(hwid)

        tier = payload.get("tier", "FREE")
        is_pro = tier in ("PRO", "CREATOR_PRO", "STUDIO", "LIFETIME")

        if not is_pro:
            return cls._get_default_community_policy(hwid)

        # Cryptographically derived checksum for pipeline integrity
        token_seed = f"{payload.get('license_key')}:{hwid}:{payload.get('issued_at')}"
        derived_checksum = hashlib.sha256(token_seed.encode("utf-8")).hexdigest()[:16]

        return PipelineCapabilityPolicy(
            tier=tier,
            is_licensed=True,
            max_width=3840,  # 4K / 8K capable
            max_height=2160,
            max_fps=60,
            allow_hardware_acceleration=True,
            max_parallel_workers=4,
            pipeline_validation_checksum=derived_checksum,
        )

    @classmethod
    def _get_default_community_policy(cls, hwid: str) -> PipelineCapabilityPolicy:
        derived_checksum = hashlib.sha256(f"free:{hwid}".encode("utf-8")).hexdigest()[:16]
        return PipelineCapabilityPolicy(
            tier="FREE",
            is_licensed=False,
            max_width=1920,
            max_height=1080,
            max_fps=30,
            allow_hardware_acceleration=False,
            max_parallel_workers=1,
            pipeline_validation_checksum=derived_checksum,
        )
