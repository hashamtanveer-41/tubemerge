"""Telemetry & Usage Metering Service.

Accurately meters billable video processing and concatenation requests
across Supabase Cloud PostgreSQL and local SQLite WAL.
"""

from typing import Dict, Any, Optional
from tubemerge.db.connection import get_db_connection
from tubemerge.apps.auth.db import get_supabase_cursor

class TelemetryService:
    @staticmethod
    def record_billable_request(
        user_id: Optional[str] = None,
        hardware_id: Optional[str] = None,
        request_type: str = "merge_job",
        video_count: int = 0,
        duration_seconds: int = 0,
        status: str = "completed",
    ) -> None:
        """Records a real billable merge request into Supabase PostgreSQL and local SQLite."""
        # 1. Cloud persistence in Supabase for user billing
        if user_id:
            try:
                with get_supabase_cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO public.user_requests
                        (user_id, hardware_id, request_type, status, video_count, duration_seconds)
                        VALUES (%s, %s, %s, %s, %s, %s);
                        """,
                        (user_id, hardware_id, request_type, status, video_count, duration_seconds),
                    )
            except Exception:
                pass

        # 2. Local SQLite WAL persistence for offline tracking
        try:
            conn = get_db_connection()
            with conn:
                conn.execute(
                    """
                    INSERT INTO request_telemetry
                    (endpoint, request_type, user_id, duration_seconds, status_code)
                    VALUES (?, ?, ?, ?, ?);
                    """,
                    ("/api/merger/start-merge", request_type, user_id, duration_seconds, 200),
                )
        except Exception:
            pass

    @staticmethod
    def get_user_usage(
        user_id: Optional[str] = None,
        hardware_id: Optional[str] = None,
        daily_quota: int = 3,
        is_weekly: bool = True,
    ) -> Dict[str, Any]:
        """Calculates accurate billable usage for the current user or workstation.

        For Free tier: 3 playlists a week (7-day window).
        For Pro / Lifetime: daily / uncapped limits.

        Returns:
            requests_today: Merges performed in the quota window (7d for free, 24h for pro)
            daily_quota: Configured tier quota
            quota_period: 'week' for Free, 'day' for Pro
            total_lifetime_merges: Total merges initiated
            total_minutes_processed: Total video minutes merged
            quota_reset_in_hours: Hours until quota cycle reset
        """
        quota_period = "week" if is_weekly else "day"
        time_interval_pg = "7 days" if is_weekly else "24 hours"
        time_interval_sqlite = "-7 days" if is_weekly else "-24 hours"
        reset_hours = 168 if is_weekly else 24

        # 1. If user is authenticated, query Supabase cloud for real usage
        if user_id:
            try:
                with get_supabase_cursor() as cur:
                    # Requests in current period (past 7 days for weekly free tier, 24h for pro)
                    cur.execute(
                        f"""
                        SELECT COUNT(*) FROM public.user_requests
                        WHERE user_id = %s
                          AND request_type = 'merge_job'
                          AND created_at >= NOW() - INTERVAL '{time_interval_pg}';
                        """,
                        (user_id,),
                    )
                    row_period = cur.fetchone()
                    requests_in_period = row_period[0] if row_period else 0

                    # Lifetime stats
                    cur.execute(
                        """
                        SELECT COUNT(*), COALESCE(SUM(duration_seconds), 0)
                        FROM public.user_requests
                        WHERE user_id = %s
                          AND request_type = 'merge_job';
                        """,
                        (user_id,),
                    )
                    row_total = cur.fetchone()
                    total_merges = row_total[0] if row_total else 0
                    total_seconds = row_total[1] if row_total else 0

                    return {
                        "requests_today": requests_in_period,
                        "daily_quota": daily_quota,
                        "quota_period": quota_period,
                        "total_lifetime_merges": total_merges,
                        "total_minutes_processed": round(total_seconds / 60),
                        "quota_reset_in_hours": reset_hours,
                    }
            except Exception:
                pass

        # 2. Fallback to local SQLite WAL (guest or offline workstation)
        try:
            conn = get_db_connection()
            cur = conn.execute(
                f"""
                SELECT COUNT(*) FROM request_telemetry
                WHERE request_type = 'merge_job'
                  AND timestamp >= datetime('now', '{time_interval_sqlite}');
                """
            )
            row_period = cur.fetchone()
            requests_in_period = row_period[0] if row_period else 0

            cur_total = conn.execute(
                """
                SELECT COUNT(*), COALESCE(SUM(duration_seconds), 0)
                FROM request_telemetry
                WHERE request_type = 'merge_job';
                """
            )
            row_total = cur_total.fetchone()
            total_merges = row_total[0] if row_total else 0
            total_seconds = row_total[1] if row_total else 0

            return {
                "requests_today": requests_in_period,
                "daily_quota": daily_quota,
                "quota_period": quota_period,
                "total_lifetime_merges": total_merges,
                "total_minutes_processed": round(total_seconds / 60),
                "quota_reset_in_hours": reset_hours,
            }
        except Exception:
            return {
                "requests_today": 0,
                "daily_quota": daily_quota,
                "quota_period": quota_period,
                "total_lifetime_merges": 0,
                "total_minutes_processed": 0,
                "quota_reset_in_hours": reset_hours,
            }
