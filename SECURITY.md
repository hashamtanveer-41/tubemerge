# Security Policy 🔒

TubeMerger takes the privacy and security of our users and their data very seriously. Because TubeMerger handles media processing, external network connections to YouTube, and local file storage, we adhere to strict privacy-by-design and local-execution principles.

---

## 🛡 Architectural Security & Privacy Model

TubeMerger is designed from the ground up to operate with minimal trust requirements and zero cloud dependencies:

1. **100% Local Processing**:
   - All video downloads, audio extractions, FFmpeg normalizations, and container stitching take place entirely on your local computer.
   - Video media, audio streams, temporary clip workspaces, and final MP4 files **never** leave your machine.
   - TubeMerger does not operate any intermediate proxy, media server, or cloud transcoding infrastructure.

2. **Direct-to-Source Network Connections**:
   - Downloads occur via local execution of `yt-dlp` directly between your device and YouTube's media servers.
   - Playlist links, channel names, and video metadata are parsed locally and never sent to our servers.

3. **No Personally Identifiable Information (PII)**:
   - TubeMerger requires no account registration, login credentials, or email addresses.
   - Local database records (merge history and job statuses) are stored on your local disk in SQLite WAL format (`~/.tubemerger/`).

4. **Privacy-Preserving Volumetric Telemetry**:
   - We utilize [Aptabase](https://aptabase.com), an EU-hosted, privacy-first analytics provider.
   - Telemetry pings are strictly volumetric (e.g., anonymous app launch counts and generic clip buckets like `small` or `large`).
   - No IP addresses, device serials, hardware fingerprints, or video URLs are ever tracked.
   - Telemetry can be disabled at any time by setting `TELEMETRY_APP_KEY = ""` in `src/tubemerge/core/config.py`.

---

## 📦 Supported Versions

Security updates and patches are actively maintained on the latest stable version line:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

We strongly encourage all users and maintainers to run the latest released version of TubeMerger.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or privacy concern in TubeMerger, please report it responsibly so we can remediate it before public disclosure.

### How to Report:
- **GitHub Security Advisory**: Open a private report through the [GitHub Security Advisory page](https://github.com/hashamtanveer-41/tubemerger/security/advisories/new) for this repository.
- **Email**: Alternatively, send an encrypted or direct email to **`support@tubemerger.com`** with the subject line `[SECURITY] TubeMerger Vulnerability Report`.

### What to Include in Your Report:
To help us triage and resolve the issue quickly, please provide:
1. **Description**: Summary of the vulnerability or security weakness.
2. **Affected Component**: e.g., FastAPI backend endpoints, yt-dlp argument handling, subprocess execution, or desktop shell integration.
3. **Step-by-Step Proof of Concept (PoC)**: Detailed instructions or scripts demonstrating how the issue can be reproduced.
4. **Impact Assessment**: Potential risk, exploitability, and affected platforms (Windows, macOS, Linux).

---

## ⏱ Response & Remediation Process

- **Initial Response**: We aim to acknowledge receipt of security vulnerability reports within **48 hours**.
- **Investigation**: We will validate the report, determine severity, and propose a remediation plan.
- **Resolution & Release**: Once a patch is developed and verified, we will release an emergency patch release and publish a coordinated security advisory crediting the reporter (unless you prefer to remain anonymous).
