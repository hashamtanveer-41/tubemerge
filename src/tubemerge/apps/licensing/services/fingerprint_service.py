"""Hardware Fingerprinting Service - Generates stable, privacy-preserving machine IDs."""

import hashlib
import os
import platform
import subprocess
import uuid
from typing import List

# Internal application salt to prevent rainbow table attacks
FINGERPRINT_SALT = "tubemerge-node-lock-v1-entropy-seed"

class FingerprintService:
    """Generates cross-platform persistent hardware fingerprints."""

    @staticmethod
    def _get_linux_identifiers() -> List[str]:
        ids: List[str] = []
        # Motherboard / DMI product UUID
        for path in [
            "/sys/class/dmi/id/product_uuid",
            "/sys/class/dmi/id/board_serial",
            "/etc/machine-id",
            "/var/lib/dbus/machine-id",
        ]:
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        val = f.read().strip()
                        if val:
                            ids.append(val)
                except Exception:
                    pass

        # CPU model info (stable across minor OS patches)
        if os.path.exists("/proc/cpuinfo"):
            try:
                with open("/proc/cpuinfo", "r", encoding="utf-8") as f:
                    for line in f:
                        if line.startswith("model name") or line.startswith("Hardware"):
                            ids.append(line.strip())
                            break
            except Exception:
                pass

        return ids

    @staticmethod
    def _get_windows_identifiers() -> List[str]:
        ids: List[str] = []
        try:
            # Motherboard UUID via wmic
            out = subprocess.check_output(
                ["wmic", "csproduct", "get", "uuid"],
                stderr=subprocess.DEVNULL,
                timeout=2,
            ).decode("utf-8", errors="ignore").splitlines()
            cleaned = [line.strip() for line in out if line.strip() and "UUID" not in line]
            if cleaned:
                ids.append(cleaned[0])
        except Exception:
            pass

        try:
            # CPU Processor ID via wmic
            out = subprocess.check_output(
                ["wmic", "cpu", "get", "processorid"],
                stderr=subprocess.DEVNULL,
                timeout=2,
            ).decode("utf-8", errors="ignore").splitlines()
            cleaned = [line.strip() for line in out if line.strip() and "ProcessorId" not in line]
            if cleaned:
                ids.append(cleaned[0])
        except Exception:
            pass

        return ids

    @staticmethod
    def _get_darwin_identifiers() -> List[str]:
        ids: List[str] = []
        try:
            out = subprocess.check_output(
                ["ioreg", "-rd1", "-c", "IOPlatformExpertDevice"],
                stderr=subprocess.DEVNULL,
                timeout=2,
            ).decode("utf-8", errors="ignore").splitlines()
            for line in out:
                if "IOPlatformUUID" in line:
                    parts = line.split("=")
                    if len(parts) > 1:
                        ids.append(parts[1].strip().strip('"'))
        except Exception:
            pass
        return ids

    @classmethod
    def get_hardware_id(cls) -> str:
        """Generates a stable, unique Machine ID using hardware identifiers.

        Combines Motherboard UUID, CPU signature, primary MAC address, and
        platform info into a salted SHA-256 hash.
        """
        collected: List[str] = []
        os_type = platform.system().lower()

        if "linux" in os_type:
            collected.extend(cls._get_linux_identifiers())
        elif "windows" in os_type:
            collected.extend(cls._get_windows_identifiers())
        elif "darwin" in os_type:
            collected.extend(cls._get_darwin_identifiers())

        # Cross-platform fallbacks & NIC primary MAC
        try:
            mac_int = uuid.getnode()
            collected.append(f"mac-{mac_int}")
        except Exception:
            pass

        collected.append(platform.machine() or "x86_64")
        collected.append(platform.processor() or "cpu")

        # Combine all components with deterministic salt
        raw_seed = "|".join(collected)
        salted_payload = f"{FINGERPRINT_SALT}:{raw_seed}"

        return hashlib.sha256(salted_payload.encode("utf-8")).hexdigest()
