# Contributing to TubeMerger 🎬

Thank you for your interest in contributing to TubeMerger! As an open-source project, TubeMerger thrives on community feedback, bug reports, and code contributions.

This document outlines guidelines for reporting issues, contributing code, and setting up your local development environment.

---

## 🧭 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all discussions, issues, and pull requests.

---

## 🛠 Local Development Setup

### 1. Prerequisites
- **Python 3.10+** (Python 3.10 to 3.14 supported)
- **Node.js 18+ and npm** (if developing the frontend or website)
- **FFmpeg & yt-dlp** (TubeMerger auto-detects system binaries or downloads portable binaries to `~/.tubemerger/bin/` on initial launch)
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/hashamtanveer-41/tubemerger.git
cd tubemerger
```

### 3. Backend Setup
Create a virtual environment and install the required dependencies:

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Run the application:
```bash
python3 main.py
```
*The app will automatically launch a native desktop GUI window (via PyWebView) or open in your default browser at `http://127.0.0.1:7842`.*

### 4. Frontend SPA Development (Optional)
The desktop frontend is a React 19 + TypeScript + Tailwind CSS application located in `frontend/`:

```bash
cd frontend
npm install
npm run dev        # Starts Vite live dev server
npm run build      # Compiles production assets into frontend/dist/
```

### 5. Marketing Website Development (Optional)
The official landing page (`tubemerger.com`) is located in `website/`:

```bash
cd website
npm install
npm run dev        # Starts live dev server at http://localhost:5173
npm run build      # Verifies TypeScript and production build
```

---

## 🧪 Testing

Before submitting changes, ensure all unit tests pass:

```bash
# Run unit tests from repository root
python3 -m unittest discover tests
```

If adding new backend utilities, parsers, or format handlers, please add corresponding test cases in `tests/`.

---

## 🐛 Submitting Issues

We track all bugs, improvements, and feature requests via [GitHub Issues](https://github.com/hashamtanveer-41/tubemerger/issues).

### Before Opening an Issue:
1. **Check Existing Issues**: Search open and closed issues to avoid duplicates.
2. **Check App Version**: Ensure you are running the latest release of TubeMerger.

### When Reporting a Bug:
Please include:
- **Operating System** (e.g., Windows 11 64-bit, macOS Sonoma 14.5 Apple Silicon, Ubuntu 24.04).
- **TubeMerger Version** (e.g., v1.0.9).
- **Description & Reproduction Steps**: The exact sequence of actions that causes the bug.
- **Playlist / Video URL**: If applicable, a public test playlist URL that exhibits the issue.
- **Log Snippets**: Any error traces printed to the terminal console or stored in `~/.tubemerger/logs/`.

---

## 🚀 Creating Pull Requests (PRs)

1. **Fork the Repository** and create a feature branch off `master`:
   ```bash
   git checkout -b feature/my-cool-feature
   # or
   git checkout -b fix/playlist-resolution-parsing
   ```
2. **Commit Changes**:
   - Write concise, meaningful commit messages (e.g., `Fix chapter marker demuxing for unlisted playlists`).
   - Keep pull requests focused on a single change or fix.
3. **Verify Code Quality**:
   - Run `python3 -m unittest discover tests` to ensure zero regressions.
   - If working on TypeScript, ensure `npm run build` succeeds without type errors.
4. **Submit Pull Request**:
   - Open a PR against the `master` branch.
   - Provide a clear description of the problem solved and link to any related issues (e.g., `Closes #12`).

---

## 🏷 Version Management

If your PR prepares a new release, version numbers are atomically synchronized across all files (`pyproject.toml`, frontend, website, and app specs) using:

```bash
python3 scripts/bump_version.py <new_version>
```

---

## 📬 Questions & Community

Have questions or need guidance? Feel free to open a discussion or reach out at `support@tubemerger.com`.
