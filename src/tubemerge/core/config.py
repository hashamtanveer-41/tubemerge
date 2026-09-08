"""Global feature flags and runtime configuration for TubeMerge.

This is the single authoritative place for toggling monetization phases
and configuring the production web endpoint. All other modules import
their flags from here.
"""

# ---------------------------------------------------------------------------
# Monetization Phase Toggle
# ---------------------------------------------------------------------------
# Launch Phase  (False): The app runs entirely locally. Progress updates are
#               rendered natively inside the PyWebView / React UI. No browser
#               window is opened.
#
# Traffic Phase (True):  When a user triggers a merge, the system default
#               web browser is opened to PRODUCTION_WEB_URL with the session
#               ID and status param so ads can run during the processing wait.
MONETIZATION_ACTIVE: bool = False

# ---------------------------------------------------------------------------
# Production Web URL
# ---------------------------------------------------------------------------
# Base URL for the ad-supported processing page. A unique session_id and
# status query param are appended at runtime.
#   e.g. https://tubemerger.com?id=<uuid4>&status=processing
PRODUCTION_WEB_URL: str = "https://tubemerger.com"

# ---------------------------------------------------------------------------
# Privacy-Preserving Telemetry
# ---------------------------------------------------------------------------
# Aptabase anonymous telemetry endpoint (no PII — only raw event counters).
# Set to empty string to disable telemetry entirely.
TELEMETRY_APP_KEY: str = "A-EU-1063594697"
TELEMETRY_HOST: str = "https://eu.aptabase.com"  # EU data residency

# ---------------------------------------------------------------------------
# Clip-count bucketing for telemetry (prevents recording exact values)
# ---------------------------------------------------------------------------
# Events are bucketed: "small" = ≤ TELEMETRY_SMALL_THRESHOLD clips,
# "large" = > TELEMETRY_SMALL_THRESHOLD. Raw counts are never sent.
TELEMETRY_SMALL_THRESHOLD: int = 20
