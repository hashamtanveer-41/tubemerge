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

        conn.execute("""
            CREATE TABLE IF NOT EXISTS merge_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id TEXT UNIQUE,
                playlist_title TEXT NOT NULL,
                playlist_url TEXT NOT NULL,
                channel_name TEXT,
                video_count INTEGER NOT NULL,
                duration_seconds INTEGER DEFAULT 0,
                resolution TEXT DEFAULT '1080p',
                output_path TEXT NOT NULL,
                file_size_bytes INTEGER DEFAULT 0,
                status TEXT DEFAULT 'completed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS merge_queues (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                playlist_url TEXT NOT NULL,
                playlist_title TEXT,
                channel_name TEXT,
                video_count INTEGER DEFAULT 0,
                canvas_preset TEXT DEFAULT 'auto',
                crf INTEGER DEFAULT 21,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

        # Seed initial history demo item if empty
        cur_h = conn.execute("SELECT COUNT(*) FROM merge_history")
        if cur_h.fetchone()[0] == 0:
            conn.execute("""
                INSERT INTO merge_history (
                    job_id, playlist_title, playlist_url, channel_name,
                    video_count, duration_seconds, resolution, output_path,
                    file_size_bytes, status
                ) VALUES (
                    'job_demo_init_01', 'Complete Web Development Bootcamp',
                    'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJLM5U93Y-GpdVn',
                    'Traversy Media', 14, 4820, '1080p',
                    '/home/hasham-tanveer/Videos/Complete_Web_Dev.mp4',
                    1845493760, 'completed'
                )
            """)

        # Seed initial queue demo item if empty
        cur_q = conn.execute("SELECT COUNT(*) FROM merge_queues")
        if cur_q.fetchone()[0] == 0:
            conn.execute("""
                INSERT INTO merge_queues (
                    playlist_url, playlist_title, channel_name,
                    video_count, canvas_preset, crf, status
                ) VALUES (
                    'https://www.youtube.com/playlist?list=PLillGF-RfqbZ2ybcoD2OamnhcwV0WCj9y',
                    'Python FastAPI Masterclass', 'Fireship', 8, 'auto', 21, 'pending'
                )
            """)
