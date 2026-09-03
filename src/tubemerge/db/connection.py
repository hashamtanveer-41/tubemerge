import sqlite3
import threading
from pathlib import Path
from typing import Optional
from tubemerge.core import settings

DB_FILE = settings.APP_DATA_DIR / "tubemerge.db"
_local = threading.local()

def get_db_connection() -> sqlite3.Connection:
    """Returns a thread-local SQLite connection configured with WAL mode."""
    if not hasattr(_local, "connection") or _local.connection is None:
        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(
            str(DB_FILE),
            timeout=10.0,
            check_same_thread=False,
        )
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA busy_timeout=5000;")
        _local.connection = conn
    return _local.connection

def init_db() -> None:
    """Initializes schema and bootstraps default license if not present."""
    conn = get_db_connection()
    with conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS licenses (
                key TEXT PRIMARY KEY,
                plan_tier TEXT NOT NULL,
                status TEXT NOT NULL,
                max_devices INTEGER DEFAULT 3,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TEXT
            );
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS device_activations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                license_key TEXT NOT NULL,
                hardware_id TEXT NOT NULL,
                device_name TEXT,
                activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_ping_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(license_key, hardware_id)
            );
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS request_telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint TEXT NOT NULL,
                status_code INTEGER NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Seed default development / community license if empty
        cur = conn.execute("SELECT COUNT(*) FROM licenses")
        if cur.fetchone()[0] == 0:
            conn.execute(
                """
                INSERT INTO licenses (key, plan_tier, status, max_devices, expires_at)
                VALUES (?, ?, ?, ?, ?)
                """,
                ("TM-PRO-8842-7719-2026", "PRO", "active", 3, "Lifetime License")
            )
