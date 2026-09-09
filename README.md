# TubeMerger 🎬

> **Free, Open-Source Desktop Application to Download & Merge YouTube Playlists into a Single Video**  
> *Official Website: [tubemerger.com](https://tubemerger.com) · GitHub: [hashamtanveer-41/tubemerger](https://github.com/hashamtanveer-41/tubemerger)*

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/react-19.0-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SQLite WAL](https://img.shields.io/badge/Database-SQLite%20WAL-003B57.svg)](https://sqlite.org/wal.html)
[![Version](https://img.shields.io/badge/version-1.0.5-brightgreen.svg)](https://github.com/hashamtanveer-41/tubemerger/releases/latest)

**TubeMerger** is a 100% free, open-source desktop application for Windows, macOS, and Linux that lets you **download YouTube playlists offline** and **merge a full playlist into a single seamless video** — or save each clip as a separate file. Powered by yt-dlp and FFmpeg running entirely on your local machine, TubeMerger is an ad-free video downloader with no accounts, no subscriptions, no upload limits, and no cloud dependencies. Paste a playlist URL, pick which videos to include, choose your quality, and get a broadcast-quality MP4 with automatic chapter bookmarks in minutes.

What makes TubeMerger different from every other YouTube playlist downloader is its granular per-video control. Unlike bulk download tools that blindly grab everything, TubeMerger shows you every video in the playlist before downloading — letting you skip or exclude specific clips with a single click. You also get real-time metrics while the merge runs: live download speed, total playlist duration, and an estimated output file size, so you always know exactly what is happening on your machine.

---

## Core Features

### 🎬 Stitched or Separate Downloads
Choose exactly how your output is structured. **Stitched mode** concatenates all selected videos into one seamless master MP4 with chapter markers at each clip boundary — perfect for archiving an entire course, lecture series, or tutorial playlist. **Separate Downloads mode** saves each chosen clip as its own individual file in a dedicated folder, giving you full flexibility without any manual splitting afterwards.

### ✂️ Granular Playlist Control
Never download a video you don't want. TubeMerger's playlist inspector shows you every video's title, thumbnail, and duration before a single byte is downloaded. Toggle individual clips on or off with one click. Reorder your selection, skip irrelevant episodes, or cherry-pick just the clips you need — the merge pipeline only touches what you've selected.

### 📺 Multi-Quality Selection
Download in the resolution that fits your needs. TubeMerger supports **360p, 480p, 720p HD, 1080p Full HD, and 4K Ultra HD** output targets. The normalization engine automatically re-encodes all clips to the chosen canvas using libx264 (CRF 21), eliminating black bars, aspect-ratio jumps, and resolution mismatches between clips from different playlist entries.

### 📊 Real-Time Metrics Dashboard
Never be left guessing. The live progress panel shows you:
- **Download speed** — updated in real time via Server-Sent Events (SSE)
- **Total playlist duration** — calculated from all selected clip metadata before download starts
- **Estimated output file size** — computed from bitrate and duration so you know the final size before the merge completes
- **Per-clip encoding status** — watch each video move through download → normalize → stitch

---

## Additional Capabilities

- **Automated Chapter Demuxing** — Embeds seekable MP4 chapter markers from each video's title. Works natively in VLC, QuickTime, Windows Media Player, and any standard player.
- **Smart Audio Normalization** — Re-encodes all audio tracks to uniform 44.1 kHz AAC stereo so there are no volume spikes or level drops across merged clips.
- **100% Local & Private Processing** — yt-dlp and FFmpeg run directly on your machine. No video streams, playlist URLs, or titles are ever uploaded to cloud servers.
- **Merge Job Queue & History** — Queue multiple playlists, cancel in-progress jobs, and review past merges from a local SQLite WAL history log.
- **Auto Binary Management** — FFmpeg and yt-dlp are auto-detected from PATH or downloaded automatically to `~/.tubemerger/bin/` on first launch. No manual setup.
- **Completely Free & Unlimited** — Zero paywalls, no device limits, no subscription tiers, and no license keys. MIT licensed.

---

## Processing Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant User as User (React 19 UI)
    participant API as FastAPI Backend Sidecar
    participant YTDLP as yt-dlp Extractor
    participant FFMPEG as FFmpeg Processing Engine
    participant DB as SQLite WAL Cache

    Note over User,API: Step 1: Playlist Inspection & Video Selection
    User->>API: Paste YouTube Playlist URL
    API->>YTDLP: Probe playlist metadata & extract clip list
    YTDLP-->>API: Return video titles, durations & thumbnails
    API-->>User: Display interactive clip selector — skip specific videos before download

    Note over User,FFMPEG: Step 2: Local Download & Normalisation
    User->>API: Start Merge (Selected Video Indices + Quality + Mode)
    API->>DB: Record new merge job in local history
    API->>YTDLP: Download selected raw video streams to temp workspace
    loop For each downloaded clip
        API->>FFMPEG: Re-encode to chosen resolution (360p–4K) + AAC stereo
        FFMPEG-->>API: Stream encoding progress (SSE) → real-time speed & file size
        API-->>User: Live dashboard: speed, duration, estimated output size
    end

    Note over API,User: Step 3: Stitch or Separate + Chapter Embedding
    API->>FFMPEG: Concat demuxer (stitched mode) OR copy to output folder (separate mode)
    API->>FFMPEG: Embed MP4 chapter markers from clip titles
    FFMPEG-->>API: Final unified .mp4 or individual files created
    API->>DB: Mark merge job as completed
    API-->>User: Complete! Reveal file in OS file manager
```

---

## System Architecture & Directory Layout

```
tubemerger/
├── assets/                                      # Branded assets & studio panoramic artwork
│   ├── banner.jpg                               # "We Build to Make Your Life Easier" banner
│   └── logo.png                                 # TubeMerger identity badge
├── docs/                                        # Architecture & engineering specifications
│   └── PRODUCTION_ISSUES_AND_SOLUTIONS.md       # Technical issue resolution post-mortem
├── frontend/                                    # Modern React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                              # Primitive components (Button, Badge, Spinner)
│   │   │   ├── layout/                          # Header, Sidebar, Navigation
│   │   │   └── merge/                           # Action panels, ProgressSpotlight, FloatingActionBar
│   │   ├── views/
│   │   │   ├── EmptyStateView.tsx               # 3x2 Feature showcase grid & GitHub Star CTA
│   │   │   ├── DiscoveryView.tsx                # Playlist clip inspector & granular selector
│   │   │   ├── HistoryView.tsx                  # Local SQLite merge history log
│   │   │   └── QueuesView.tsx                   # Background merge queue view
│   │   ├── hooks/useMergeApp.ts                 # Unified application state manager
│   │   └── services/api.ts                      # Strongly typed REST client & SSE subscriber
│   └── dist/                                    # Pre-compiled production bundle
├── src/
│   └── tubemerge/                               # Python Backend (Modular Apps)
│       ├── core/
│       │   ├── settings.py                      # Application settings, paths & canvas presets
│       │   └── config.py                        # Feature flags & monetization settings
│       ├── db/
│       │   └── connection.py                    # SQLite WAL connection manager & auto-migrations
│       ├── apps/
│       │   ├── binaries/                        # FFmpeg & yt-dlp locator & auto-installer
│       │   ├── playlists/                       # YouTube metadata & master canvas probing
│       │   ├── merger/                          # FFmpeg normalizer, concat stitcher, MergeEngine
│       │   │   ├── services/
│       │   │   │   ├── engine.py                # Download → normalise → stitch pipeline
│       │   │   │   ├── normalizer.py            # FFmpeg per-clip re-encode (libx264 + AAC)
│       │   │   │   └── stitcher.py              # FFmpeg concat + chapter metadata embed
│       │   │   ├── controllers/merge_controller.py
│       │   │   └── routes.py                    # /api/start-merge, /api/progress (SSE), /api/cancel
│       │   ├── history/                         # Local merge job history management
│       │   ├── queues/                          # Merge job queue handling
│       │   ├── updates/                         # Startup update check & forced update enforcement
│       │   ├── system/                          # Native OS file integration (xdg-open / explorer)
│       │   └── telemetry/                       # Aptabase anonymous counter service
│       ├── server/app.py                        # FastAPI application mounting SPA and routers
│       └── app.py                               # PyWebView desktop window / browser launcher
├── website/                                     # Official Marketing Landing Page & Web Docs
│   ├── src/                                     # React + Tailwind CSS marketing site
│   ├── public/                                  # Static brand assets, sitemap & robots.txt
│   ├── vercel.json                              # Vercel deployment configuration (tubemerger.com)
│   └── package.json                             # Website build dependencies
├── scripts/
│   └── bump_version.py                          # Atomic version bump across all project files
├── tests/                                       # OOP unit and integration test suite
├── main.py                                      # Primary application entrypoint
├── pyproject.toml                               # PEP 621 packaging metadata
└── requirements.txt                             # Python dependencies
```

---

## Recommended GitHub Repository Topics

Add these topics in **Settings → Topics** for maximum search discoverability:

```
youtube-playlist-downloader  youtube-playlist-merger  merge-youtube-playlist
ad-free-downloader           open-source-desktop-app  skip-videos
granular-playlist-control    multi-quality-download   real-time-download-speed
download-speed-tracker       stitched-video-download  separate-video-download
youtube-downloader           ffmpeg                   yt-dlp
offline-video-downloader     privacy-first            chapter-embedding
cross-platform               mit-license
```

---

## Privacy-Preserving Analytics (Aptabase)

TubeMerger incorporates privacy-first, GDPR-compliant volumetric telemetry via [Aptabase](https://aptabase.com).

- **App Key**: `A-EU-1063594697`
- **Region**: EU (`https://eu.aptabase.com`)

### Privacy Guarantees

1. **Zero Personally Identifiable Information (PII)**: No usernames, IP addresses, device identifiers, or hardware fingerprints are collected.
2. **No URLs or Video Metadata**: YouTube URLs, playlist links, channel names, and video titles are **never transmitted** or logged.
3. **Clip Count Bucketing**: Raw numbers of selected clips are never sent; they are bucketed into generic categories (`small` for ≤ 20 clips, `large` for > 20 clips).
4. **Tracked Events**:
   - `app_started`: Anonymous ping on desktop app startup.
   - `playlist_merge_started`: Dispatched when a merge pipeline starts (with `size_bucket`).
   - `playlist_merge_completed`: Dispatched upon successful job finish (with duration bucket).

### Disabling Telemetry

Telemetry can be disabled at any time by setting `TELEMETRY_APP_KEY = ""` in `src/tubemerge/core/config.py`:

```python
# src/tubemerge/core/config.py
TELEMETRY_APP_KEY: str = ""  # Set to empty string to disable telemetry
```

---

## 🛠 Quick Start

### 1. Prerequisites
- **Python 3.10+** (Python 3.10, 3.11, 3.12, 3.13, 3.14 supported)
- **Node.js 18+ & npm** (only needed if building frontend from source)
- **FFmpeg & yt-dlp** (Auto-detected from PATH or automatically downloaded on first launch to `~/.tubemerger/bin/`)

### 2. Installation
```bash
git clone https://github.com/hashamtanveer-41/tubemerger.git
cd tubemerger

# Optional: Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 3. Running the Application
```bash
python3 main.py
```
*The app automatically launches a native desktop GUI window (PyWebView) or opens in your default browser at `http://127.0.0.1:7842`.*

---

## 💻 Frontend Development (Optional)

If modifying the React user interface:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite live development server
npm run dev

# Compile production bundle into frontend/dist/
npm run build
```

---

## 🧪 Automated Testing

Run the comprehensive unit test suite:
```bash
python3 -m unittest discover tests
```

---

## 🔖 Version Management

Bump versions atomically across all project files with the included script:
```bash
python3 scripts/bump_version.py 1.0.6          # apply
python3 scripts/bump_version.py 1.0.6 --dry-run # preview only
```

---

## 📄 License
This project is licensed under the **[MIT License](LICENSE)** — free for personal and commercial use.  
*Copyright © 2026 TubeMerger Contributors.*
