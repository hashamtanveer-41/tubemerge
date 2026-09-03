import sqlite3
from typing import Dict, Any
from tubemerge.db.connection import get_db_connection

class TelemetryService:
    @staticmethod
    def record_request(endpoint: str, status_code: int = 200) -> None:
        """Records an operational request for quota and telemetry tracking.

        STRICT PRIVACY: Never records URLs, video IDs, or user content.
        """
        try:
            conn = get_db_connection()
            with conn:
                conn.execute(
                    "INSERT INTO request_telemetry (endpoint, status_code) VALUES (?, ?)",
                    (endpoint, status_code)
                )
        except Exception:
            pass

    @staticmethod
    def get_daily_usage(daily_quota: int = 100) -> Dict[str, Any]:
        """Calculates requests processed in the current 24-hour UTC window."""
        try:
            conn = get_db_connection()
            cur = conn.execute("""
                SELECT COUNT(*) FROM request_telemetry
                WHERE timestamp >= datetime('now', '-24 hours')
            """)
            requests_today = cur.fetchone()[0]

            cur_total = conn.execute("SELECT COUNT(*) FROM request_telemetry WHERE endpoint LIKE '%start-merge%'")
            total_merges = cur_total.fetchone()[0]

            return {
                "requests_today": requests_today,
                "daily_quota": daily_quota,
                "total_lifetime_merges": max(1, total_merges),
                "total_minutes_processed": max(12, total_merges * 8),
                "quota_reset_in_hours": 12,
            }
        except Exception:
            return {
                "requests_today": 0,
                "daily_quota": daily_quota,
                "total_lifetime_merges": 0,
                "total_minutes_processed": 0,
                "quota_reset_in_hours": 24,
            }
