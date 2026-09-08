import React, { useState, useEffect } from "react"

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27.4 3.12A3.52 3.52 0 0 0 24.93.63C22.75 0 14 0 14 0S5.25 0 3.07.63A3.52 3.52 0 0 0 .6 3.12 36.9 36.9 0 0 0 0 10a36.9 36.9 0 0 0 .6 6.88 3.52 3.52 0 0 0 2.47 2.49C5.25 20 14 20 14 20s8.75 0 10.93-.63a3.52 3.52 0 0 0 2.47-2.49A36.9 36.9 0 0 0 28 10a36.9 36.9 0 0 0-.6-6.88Z"
        fill="currentColor"
      />
      <path d="M11.2 14.29 18.51 10 11.2 5.71v8.58Z" fill="#fff" />
    </svg>
  )
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13L5 8l5-5" />
    </svg>
  )
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  )
}

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function WindowsIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 5.45l7.3-.99v7.09H3V5.45zm0 13.1l7.3 1v-7.1H3v6.1zm8.3 1.13L21 21v-8.46h-9.7v7.15zM21 3l-9.7 1.33v7.22H21V3z" />
    </svg>
  )
}

function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.01-.48 2.63-1.23Z" />
    </svg>
  )
}

// Official Ubuntu Circle of Friends SVG
function UbuntuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.61.455a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zM12.92.8C8.923.777 5.137 2.941 3.148 6.451a4.5 4.5 0 0 1 .26-.007 4.92 4.92 0 0 1 2.585.737A8.316 8.316 0 0 1 12.688 3.6 4.944 4.944 0 0 1 13.723.834 11.008 11.008 0 0 0 12.92.8zm9.226 4.994a4.915 4.915 0 0 1-1.918 2.246 8.36 8.36 0 0 1-.273 8.303 4.89 4.89 0 0 1 1.632 2.54 11.156 11.156 0 0 0 .559-13.089zM3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.908 4.908 0 0 1-2.915.358 11.1 11.1 0 0 0 7.991 6.698 11.234 11.234 0 0 0 2.422.249 4.879 4.879 0 0 1-.999-2.85 8.484 8.484 0 0 1-.836-.136 8.304 8.304 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41z" />
    </svg>
  )
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

interface DownloadPageProps {
  onNavigateHome: () => void
  onNavigateToCommunity?: () => void
}

interface DownloadedState {
  platformName: string
  filename: string
  url: string
}

export default function DownloadPage({
  onNavigateHome,
  onNavigateToCommunity,
}: DownloadPageProps) {
  const [downloadedState, setDownloadedState] =
    useState<DownloadedState | null>(null)
  const [redirectSeconds, setRedirectSeconds] = useState<number>(5)
  const [isRedirectPaused, setIsRedirectPaused] = useState<boolean>(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Auto-redirect to community section after download
  useEffect(() => {
    if (!downloadedState || isRedirectPaused) return

    if (redirectSeconds <= 0) {
      if (onNavigateToCommunity) {
        onNavigateToCommunity()
      } else {
        onNavigateHome()
      }
      return
    }

    const timer = setTimeout(() => {
      setRedirectSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [
    downloadedState,
    redirectSeconds,
    isRedirectPaused,
    onNavigateToCommunity,
    onNavigateHome,
  ])

  const platforms = {
    win: {
      name: "Windows",
      heading: "Download for Windows",
      versionInfo: "Windows 10 / 11 • 24.6 MB",
      icon: <WindowsIcon className="h-6 w-6 text-[#00adef]" />,
      file: "TubeMerge-Setup-v1.0.0.exe",
      url: "https://github.com/hashamtanveer-41/tubemerge/releases/latest/download/TubeMerge-Setup-v1.0.0.exe",
    },
    mac: {
      name: "macOS",
      heading: "Download for macOS",
      versionInfo: "Apple Silicon & Intel • 52.1 MB",
      icon: <AppleIcon className="h-6 w-6 text-white" />,
      file: "TubeMerge-macOS-x64.zip",
      url: "https://github.com/hashamtanveer-41/tubemerge/releases/latest/download/TubeMerge-macOS-x64.zip",
    },
    linux: {
      name: "Linux",
      heading: "Download for Linux",
      versionInfo: "Ubuntu / Debian / Fedora • 38.6 MB",
      icon: <UbuntuIcon className="h-6 w-6 text-[#E95420]" />,
      file: "TubeMerge-Linux-x64.tar.gz",
      url: "https://github.com/hashamtanveer-41/tubemerge/releases/latest/download/TubeMerge-Linux-x64.tar.gz",
    },
  }

  // Immediate browser download execution
  const triggerDownload = (
    platformName: string,
    filename: string,
    url: string,
  ) => {
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Switch to clean thank you view
    setDownloadedState({
      platformName,
      filename,
      url,
    })
    setRedirectSeconds(5)
    setIsRedirectPaused(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Consistent red outline for all download cards on hover, focus, and click
  const cardButtonClass =
    "flex items-center gap-4 p-5 rounded-2xl border border-white/[0.08] bg-[#12141D] hover:bg-[#171924] hover:border-coral/60 active:border-coral active:ring-1 active:ring-coral focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral active:scale-[0.99] transition-all cursor-pointer text-left group shadow-sm"

  return (
    <div className="min-h-screen bg-[#090A0F] text-white selection:bg-coral/30 selection:text-white flex flex-col font-sans">
      {/* ──────────────────────────────────────────────────────────────────────────
          CLEAN SOLID NAVBAR
         ────────────────────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/[0.08] bg-[#0E1017]">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6 sm:px-8">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
            aria-label="TubeMerge Home"
          >
            <YouTubeIcon className="h-6 w-auto text-coral" />
            <span className="text-[20px] font-bold tracking-tight text-white">
              TubeMerge
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[14px] text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer font-medium"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5 shrink-0" />
              <span>Back to Website</span>
            </button>
            <a
              href="https://github.com/hashamtanveer-41/tubemerge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 justify-center rounded-full bg-white/10 hover:bg-white/20 text-white h-9 px-4 text-[13.5px] font-medium transition-all cursor-pointer border border-white/10"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          MAIN CONTENT
         ────────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center py-16 sm:py-24 px-6 sm:px-8">
        {downloadedState ? (
          /* ───────────────────────────────────────────────────────────────────────
             MINIMAL THANK YOU VIEW
             ─────────────────────────────────────────────────────────────────────── */
          <div className="mx-auto max-w-[600px] w-full text-center space-y-6 animate-in fade-in duration-200">
            {/* Success Checkmark */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e]">
              <CheckIcon className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight">
                Thanks for downloading!
              </h1>
              <p className="text-[15px] text-white/70 max-w-[480px] mx-auto leading-relaxed">
                Your download of{" "}
                <strong className="text-white">
                  {downloadedState.filename}
                </strong>{" "}
                has started.
              </p>
            </div>

            {/* Manual Retry Link */}
            <p className="text-[13px] text-white/50">
              Didn't start?{" "}
              <a
                href={downloadedState.url}
                download={downloadedState.filename}
                className="text-coral underline font-medium hover:text-white transition-colors"
              >
                Click here to download directly
              </a>
            </p>

            {/* Actions Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#12141D] p-6 space-y-4 max-w-[480px] mx-auto text-center">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://github.com/hashamtanveer-41/tubemerge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-coral hover:brightness-110 h-11 px-5 text-[14px] font-semibold text-white transition-all cursor-pointer shadow-md"
                >
                  <StarIcon className="h-4 w-4" />
                  <span>Star on GitHub</span>
                </a>

                <button
                  onClick={() => {
                    if (onNavigateToCommunity) {
                      onNavigateToCommunity()
                    } else {
                      onNavigateHome()
                    }
                  }}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/10 text-white h-11 px-5 text-[14px] font-medium transition-all cursor-pointer"
                >
                  <span>Community Section →</span>
                </button>
              </div>

              {!isRedirectPaused ? (
                <div className="text-[12.5px] text-white/40 pt-1">
                  Redirecting to community in {redirectSeconds}s •{" "}
                  <button
                    onClick={() => setIsRedirectPaused(true)}
                    className="text-coral hover:underline cursor-pointer"
                  >
                    Stay on page
                  </button>
                </div>
              ) : (
                <div className="text-[12.5px] text-white/30 pt-1">
                  Auto-redirect paused
                </div>
              )}

              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => setDownloadedState(null)}
                  className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeftIcon className="h-3 w-3 shrink-0" />
                  <span>Download for another operating system</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ───────────────────────────────────────────────────────────────────────
             MINIMAL 3 DOWNLOAD BUTTONS (Consistent Red Outline, No Arrow Icon)
             ─────────────────────────────────────────────────────────────────────── */
          <div className="mx-auto max-w-[960px] w-full space-y-10">
            {/* Simple Minimal Title */}
            <div className="text-center max-w-[600px] mx-auto space-y-2">
              <h1 className="text-[32px] sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                Download TubeMerger
              </h1>
              <p className="text-[15px] sm:text-[16px] text-white/60">
                100% Free & open-source desktop app for all operating systems.
              </p>
            </div>

            {/* 3 Minimal Buttons in a Clean Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[920px] mx-auto w-full">
              {/* Windows Button */}
              <button
                onClick={() =>
                  triggerDownload(
                    platforms.win.name,
                    platforms.win.file,
                    platforms.win.url,
                  )
                }
                className={cardButtonClass}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                  {platforms.win.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15.5px] font-bold text-white group-hover:text-coral transition-colors">
                    {platforms.win.heading}
                  </div>
                  <div className="text-[13px] text-white/50 mt-0.5">
                    {platforms.win.versionInfo}
                  </div>
                </div>
              </button>

              {/* macOS Button */}
              <button
                onClick={() =>
                  triggerDownload(
                    platforms.mac.name,
                    platforms.mac.file,
                    platforms.mac.url,
                  )
                }
                className={cardButtonClass}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                  {platforms.mac.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15.5px] font-bold text-white group-hover:text-coral transition-colors">
                    {platforms.mac.heading}
                  </div>
                  <div className="text-[13px] text-white/50 mt-0.5">
                    {platforms.mac.versionInfo}
                  </div>
                </div>
              </button>

              {/* Linux Button (Official Ubuntu Circle of Friends Icon) */}
              <button
                onClick={() =>
                  triggerDownload(
                    platforms.linux.name,
                    platforms.linux.file,
                    platforms.linux.url,
                  )
                }
                className={cardButtonClass}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                  {platforms.linux.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15.5px] font-bold text-white group-hover:text-coral transition-colors">
                    {platforms.linux.heading}
                  </div>
                  <div className="text-[13px] text-white/50 mt-0.5">
                    {platforms.linux.versionInfo}
                  </div>
                </div>
              </button>
            </div>

            {/* Subtle GitHub Link */}
            <div className="text-center pt-2 text-[13px] text-white/40">
              Looking for source code?{" "}
              <a
                href="https://github.com/hashamtanveer-41/tubemerge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white underline transition-colors"
              >
                View repository on GitHub
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ──────────────────────────────────────────────────────────────────────────
          CLEAN MINIMAL FOOTER
         ────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#090A0F] py-6 px-6 sm:px-8">
        <div className="mx-auto max-w-[1120px] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/40">
          <div className="flex items-center gap-2">
            <YouTubeIcon className="h-4 w-auto text-coral" />
            <span className="font-semibold text-white/70">TubeMerger</span>
            <span>•</span>
            <span>MIT License</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>•</span>
            <a
              href="https://github.com/hashamtanveer-41/tubemerge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
