# TubeMerge

**Merge YouTube playlists into a single MP4 — offline, free, and open source.**

TubeMerge is a cross-platform desktop application that downloads videos selected from any public or unlisted YouTube playlist, standardises them to a uniform resolution and stereo audio track, stitches them seamlessly into one MP4 file, and automatically embeds clickable chapter markers for every video track.

---

## Key Features

- **Granular Clip Selection**: Select all or any subset of videos from a playlist; reorder or merge them in sequence.
- **Resolution Normalisation**: Automatically scales and pads varying video resolutions to a uniform canvas (CRF 21, libx264) to eliminate glitchy transitions and aspect ratio jumps.
- **Balanced Audio Standardisation**: Re-encodes audio tracks to uniform 44.1 kHz AAC stereo to avoid volume drops between clips.
- **Embedded Chapter Markers**: Embeds seekable MP4 chapter markers named after the original video titles (compatible with VLC, QuickTime, mpv, and browser players).
- **100% Local Processing**: All video downloads and encoding happen on localhost via bundled `yt-dlp` and `ffmpeg` binaries. No videos or URLs are uploaded to external servers.
- **Unlimited & Free**: Completely open source under the MIT license with zero quotas, device limits, or paid license keys.
- **Local History & Queue**: Track past merge jobs and queued operations stored locally in an embedded SQLite WAL database.

---

## Processing Pipeline

```
          [ YouTube Playlist URL ]
                     │
                     ▼
          [ Playlist Metadata Probe ]
          (yt-dlp extracts clip list & durations)
                     │
                     ▼
          [ Granular Clip Selection ]
          (User picks target videos in React UI)
                     │
                     ▼
          [ Local Segment Download ]
          (yt-dlp fetches raw video streams)
                     │
                     ▼
          [ Normalisation Engine ]
          (FFmpeg re-encodes to uniform resolution + AAC stereo)
                     │
                     ▼
          [ FFmpeg Concat Demuxer ]
          (Stitches normalised segments without frame drops)
                     │
                     ▼
          [ Chapter Metadata Mux ]
          (Embeds seekable chapter markers from video metadata)
                     │
                     ▼
             [ Final .mp4 Output ]
```

---

## Architecture

TubeMerge uses a modern decoupled architecture consisting of an embedded Python backend sidecar, a high-performance SQLite WAL storage engine, and a React 19 desktop interface wrapped via PyWebView.

### Tech Stack

| Layer | Component | Description |
|---|---|---|
| **Desktop Shell** | PyWebView 6 | Native desktop window (WebKitGTK on Linux, WKWebView on macOS, WebView2 on Windows) |
| **Sidecar Server** | FastAPI + Uvicorn | High-performance asynchronous HTTP & SSE daemon on localhost (`127.0.0.1:7842`) |
| **Download Engine** | yt-dlp | Local command-line YouTube extractor and stream downloader |
| **Media Pipeline** | FFmpeg 7.0+ (static) | Video scaling, canvas padding, audio normalisation, concat demuxing, and chapter muxing |
| **Local Cache** | SQLite WAL Mode | Thread-safe, non-blocking local storage for history and queues |
| **User Interface** | React 19 + Vite + Tailwind CSS | Desktop UI with real-time SSE progress streaming and playlist inspection |
| **Analytics** | Aptabase EU | Anonymous, GDPR-compliant volumetric counter telemetry |

### Directory Layout

```
quick-oppenheimer/
├── src/tubemerge/
│   ├── core/
│   │   ├── settings.py           # Application constants, paths, and canvas presets
│   │   └── config.py             # Feature flags, Aptabase key, and monetization config
│   ├── db/
│   │   └── connection.py         # SQLite WAL schema (history, queues, local logging)
│   ├── apps/
│   │   ├── binaries/             # yt-dlp & FFmpeg automatic resolution and validation
│   │   ├── playlists/            # Playlist probing and clip metadata extraction
│   │   ├── merger/
│   │   │   ├── services/
│   │   │   │   ├── engine.py     # Multi-stage orchestrator (download → normalise → stitch)
│   │   │   │   ├── normalizer.py # Per-clip FFmpeg normalisation (libx264 + AAC)
│   │   │   │   └── stitcher.py   # Concat demuxer and MP4 chapter embedding
│   │   │   ├── controllers/      # FastAPI controller with SSE progress queues
│   │   │   └── routes.py         # /api/start-merge, /api/progress (SSE), /api/cancel
│   │   ├── history/              # Local merge job history management
│   │   ├── queues/               # Merge job queue handling
│   │   ├── system/               # Native file revelation (xdg-open, explorer, open)
│   │   └── telemetry/            # Aptabase anonymous event reporting
│   ├── server/
│   │   └── app.py                # FastAPI factory mounting static frontend assets
│   └── app.py                    # PyWebView window manager and lifecycle handler
├── frontend/
│   ├── src/
│   │   ├── views/                # DiscoveryView, EmptyStateView, HistoryView, QueuesView
│   │   ├── components/           # Header, Sidebar, ProgressSpotlight, FloatingActionBar
│   │   ├── hooks/                # useMergeApp state orchestrator
│   │   └── services/             # Typed API client and Server-Sent Events subscriber
│   ├── vite.config.ts
│   └── package.json
├── main.py                       # Main application entry point
├── requirements.txt              # Python runtime dependencies
└── LICENSE                       # MIT License
```

---

## Privacy-Preserving Analytics (Aptabase)

TubeMerge incorporates privacy-first, GDPR-compliant volumetric telemetry via [Aptabase](https://aptabase.com).

- **App Key**: `A-EU-1063594697`
- **Region**: EU (`https://eu.aptabase.com`)

### Privacy Guarantees

1. **Zero Personally Identifiable Information (PII)**: No usernames, IP addresses, device identifiers, or hardware fingerprints are collected.
2. **No URLs or Titles**: YouTube URLs, playlist links, channel names, and video titles are **never transmitted** or logged.
3. **Clip Count Bucketing**: Raw numbers of selected clips are never sent; they are bucketed into generic categories (`small` for ≤ 20 clips, `large` for > 20 clips).
4. **Tracked Events**:
   - `app_started`: Anonymous ping on desktop app startup.
   - `playlist_merge_started`: Dispatched when a merge pipeline starts (with `size_bucket`).
   - `playlist_merge_completed`: Dispatched upon successful job finish (with duration bucket).

### Disabling Telemetry

Telemetry can be disabled at any time by setting `TELEMETRY_APP_KEY = ""` in `src/tubemerge/core/config.py`:

```python
# src/tubemerge/core/config.py
TELEMETRY_APP_KEY: str = ""  # Set to empty string to disable all telemetry
```

---

## Future Monetization

TubeMerge is 100% free and unlimited. The legacy proprietary licensing model (Ed25519 signature checks, hardware fingerprinting, Stripe billing) has been completely removed.

Future monetization will use an optional, lightweight web redirect during the FFmpeg processing wait:

```python
# src/tubemerge/core/config.py
MONETIZATION_ACTIVE: bool = False  # Toggle to True to enable ad-supported redirect
PRODUCTION_WEB_URL: str = "https://tubemerger.com"
```

- When `False` (default): Processing progress displays natively within the desktop app window.
- When `True`: The user's default browser is opened to the web status page while FFmpeg executes locally in the background.

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Linux, macOS, or Windows

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hashamtanveer/tubemerger.git
   cd tubemerger
   ```

2. **Install Python dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Build the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Launch the application:**
   ```bash
   PYTHONPATH=src python3 main.py
   ```

The application will start the FastAPI backend on `http://127.0.0.1:7842` and open the PyWebView desktop window.

---

## License

This project is licensed under the [MIT License](LICENSE).
