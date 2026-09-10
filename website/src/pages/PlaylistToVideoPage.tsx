import React, { useEffect, useRef } from "react"

/* ─────────────────────────────────────────────
   Icon components
───────────────────────────────────────────── */
function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 20" className={className} fill="none" aria-hidden="true">
      <path
        d="M27.4 3.12A3.52 3.52 0 0 0 24.93.63C22.75 0 14 0 14 0S5.25 0 3.07.63A3.52 3.52 0 0 0 .6 3.12 36.9 36.9 0 0 0 0 10a36.9 36.9 0 0 0 .6 6.88 3.52 3.52 0 0 0 2.47 2.49C5.25 20 14 20 14 20s8.75 0 10.93-.63a3.52 3.52 0 0 0 2.47-2.49A36.9 36.9 0 0 0 28 10a36.9 36.9 0 0 0-.6-6.88Z"
        fill="currentColor"
      />
      <path d="M11.2 14.29 18.51 10 11.2 5.71v8.58Z" fill="#fff" />
    </svg>
  )
}

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#ff3b30" fillOpacity="0.12" />
      <path
        d="M6 10.5l2.5 2.5 5-5"
        stroke="#ff3b30"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.04)" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Inline Navbar
───────────────────────────────────────────── */
function MiniNavbar({
  onNavigateHome,
  onNavigateDownload,
}: {
  onNavigateHome: () => void
  onNavigateDownload: () => void
}) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b border-white/[0.08]"
      style={{ backgroundColor: "#090A0F" }}
    >
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-6 sm:px-10">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer"
          aria-label="TubeMerger home"
        >
          <YouTubeIcon className="h-6 w-auto text-coral drop-shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
          <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-white">
            TubeMerger
          </span>
        </button>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/hashamtanveer-41/tubemerger"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] h-10 px-4 text-[13.5px] font-sans font-medium text-white/80 hover:text-white hover:border-white/30 hover:bg-white/[0.06] transition-all"
          >
            <GitHubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <button
            onClick={onNavigateDownload}
            className="inline-flex items-center justify-center rounded-full bg-coral h-10 px-5 text-[14px] font-display font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,59,48,0.65)] hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          >
            Download Free
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────────────────────────────
   Mini Footer
───────────────────────────────────────────── */
function MiniFooter({
  onNavigateHome,
  onNavigateDownload,
}: {
  onNavigateHome: () => void
  onNavigateDownload: () => void
}) {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.06] px-6 py-12 sm:px-10 bg-[#090A0F]"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <YouTubeIcon className="h-6 w-auto text-coral drop-shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
          <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-white">
            TubeMerger
          </span>
        </button>
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3" aria-label="Footer links">
          <button
            onClick={onNavigateHome}
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white"
          >
            Home
          </button>
          <button
            onClick={onNavigateDownload}
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white"
          >
            Download
          </button>
          <a
            href="https://github.com/hashamtanveer-41/tubemerger"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://github.com/hashamtanveer-41/tubemerger/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white"
          >
            Support
          </a>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1280px] flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
        <span className="text-[13px] text-white/35">© 2026 tubemerger.com</span>
        <span className="text-[13px] text-white/35">Made for people who hate re-uploading.</span>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="reveal relative flex gap-5 rounded-[20px] border border-white/[0.08] bg-card p-6 sm:p-8 transition-colors hover:border-white/[0.16]">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-display font-extrabold text-coral"
        style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.25)" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-display text-[17px] font-bold text-white">{title}</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  )
}

function CompRow({
  feature,
  tubemerger,
  cloudTools,
}: {
  feature: string
  tubemerger: string
  cloudTools: string
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] py-4 text-[14px]">
      <span className="text-white/60 font-medium">{feature}</span>
      <span className="flex items-center gap-2 text-white/85">
        <CheckIcon className="h-5 w-5 shrink-0" />
        {tubemerger}
      </span>
      <span className="flex items-center gap-2 text-white/35">
        <CrossIcon className="h-5 w-5 shrink-0" />
        {cloudTools}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   JSON-LD structured data
───────────────────────────────────────────── */
const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "@id": "https://tubemerger.com/playlist-to-single-video#howto",
      name: "How to Turn a YouTube Playlist into One Video",
      description:
        "Download and merge a full YouTube playlist into a single MP4 file locally using TubeMerger — free, open-source, and private.",
      totalTime: "PT2M",
      tool: {
        "@type": "SoftwareApplication",
        name: "TubeMerger",
        url: "https://tubemerger.com/",
      },
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Paste the Playlist URL",
          text: "Open TubeMerger and paste any public YouTube playlist link into the URL field.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Choose Your Clips",
          text: "Browse every video's title, thumbnail, and duration. Toggle off anything you don't want.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Select Output Quality",
          text: "Pick your target resolution: 360p, 480p, 720p, 1080p, or 4K Ultra HD.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Export as One MP4",
          text: "Hit Start. TubeMerger downloads, normalizes, levels audio, embeds chapter markers, and outputs a single master video entirely on your machine.",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://tubemerger.com/playlist-to-single-video#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://tubemerger.com/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "YouTube Playlist to One Video",
          item: "https://tubemerger.com/playlist-to-single-video",
        },
      ],
    },
  ],
}

/* ─────────────────────────────────────────────
   Reveal hook
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add("is-visible")
          }
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    )
    if (!ref.current) return
    ref.current
      .querySelectorAll<HTMLElement>(".reveal")
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ─────────────────────────────────────────────
   FAQ accordion
───────────────────────────────────────────── */
function FaqList() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0)

  const faqs = [
    {
      q: "Can TubeMerger download an entire YouTube playlist into one MP4?",
      a: "Yes. Paste a playlist URL, select the clips you want, choose a quality, and TubeMerger downloads and merges them all into a single MP4 file — with chapter markers at every clip boundary — entirely on your local machine.",
    },
    {
      q: "Does TubeMerger work without an internet connection during merging?",
      a: "The merge and encoding stage is fully offline. TubeMerger only needs the internet to download the video streams from YouTube. Once clips are downloaded, FFmpeg stitches them together locally with zero network traffic.",
    },
    {
      q: "What is the maximum playlist length TubeMerger supports?",
      a: "There is no artificial limit. Playlist length is only constrained by your available disk space and download time. Cloud tools typically cap at 10–30 minutes; TubeMerger has no such restriction.",
    },
    {
      q: "Does the final merged MP4 work in VLC, QuickTime, and standard players?",
      a: "Yes. TubeMerger outputs a standard H.264/AAC MP4 container that plays natively in VLC, QuickTime, Windows Media Player, and any browser-based player. Chapter markers are embedded using the MP4 chapter atom format.",
    },
    {
      q: "Can I skip specific videos in the middle of a playlist?",
      a: "Absolutely. Before any download starts, TubeMerger displays every video's title, thumbnail, and duration. You toggle individual clips on or off — then only the selected videos are downloaded and merged, in order.",
    },
    {
      q: "Is TubeMerger safe to use? Does it upload my data anywhere?",
      a: "TubeMerger is 100% open-source (MIT license) — you can inspect every line of code on GitHub. It is powered by yt-dlp and FFmpeg running locally. No data, links, or files ever leave your device.",
    },
  ]

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={i}
            className={`reveal rounded-[18px] border overflow-hidden bg-card transition-colors ${
              isOpen ? "border-coral/40" : "border-white/[0.08] hover:border-white/20"
            }`}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left font-display text-[16px] font-bold text-white transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <span
                className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[16px] transition-colors ${
                  isOpen
                    ? "bg-coral text-white border-coral"
                    : "border-white/10 text-white/40"
                }`}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-white/55 border-t border-white/[0.04] pt-3">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page component
───────────────────────────────────────────── */
interface PlaylistToVideoPageProps {
  onNavigateHome: () => void
  onNavigateDownload: () => void
}

export default function PlaylistToVideoPage({
  onNavigateHome,
  onNavigateDownload,
}: PlaylistToVideoPageProps) {
  const contentRef = useReveal()

  useEffect(() => {
    document.title = "YouTube Playlist to One Video — Free Desktop Tool | TubeMerger"

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name"
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    setMeta(
      "description",
      "Turn any YouTube playlist into a single MP4 in minutes. TubeMerger downloads, merges, and chapter-marks your selected videos entirely on your machine — free, open-source, no cloud."
    )
    setMeta("og:title", "YouTube Playlist to One Video — Free Desktop Tool | TubeMerger", true)
    setMeta(
      "og:description",
      "Turn any YouTube playlist into a single MP4 in minutes. TubeMerger downloads, merges, and chapter-marks your selected videos entirely on your machine — free, open-source, no cloud.",
      true
    )
    setMeta("og:url", "https://tubemerger.com/playlist-to-single-video", true)
    setMeta("twitter:title", "YouTube Playlist to One Video — Free Desktop Tool | TubeMerger")
    setMeta(
      "twitter:description",
      "Turn any YouTube playlist into a single MP4 in minutes. TubeMerger downloads, merges, and chapter-marks your selected videos — free, open-source."
    )

    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']")
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = "https://tubemerger.com/playlist-to-single-video"

    if (!document.getElementById("jsonld-playlist-page")) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.id = "jsonld-playlist-page"
      script.textContent = JSON.stringify(JSONLD)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById("jsonld-playlist-page")?.remove()
    }
  }, [])

  const steps = [
    {
      number: "1",
      title: "Paste the Playlist URL",
      description:
        "Open TubeMerger and drop any public YouTube playlist link into the URL field. The app immediately probes every video's title, thumbnail, and duration.",
    },
    {
      number: "2",
      title: "Select Your Clips",
      description:
        "Toggle individual videos on or off with a single click. Skip intros, ad reads, or irrelevant episodes — only the clips you choose get downloaded.",
    },
    {
      number: "3",
      title: "Choose Output Quality",
      description:
        "Pick your target resolution: 360p, 480p, 720p HD, 1080p Full HD, or 4K Ultra HD. The engine normalizes every clip to a consistent canvas — no black bars.",
    },
    {
      number: "4",
      title: "Export as One Master MP4",
      description:
        "Hit Start. TubeMerger downloads, normalizes, levels audio, embeds chapter bookmarks at every clip boundary, and writes a single seamless MP4 — all locally on your machine.",
    },
  ]

  return (
    <div className="min-h-screen bg-canvas text-white selection:bg-coral/30 selection:text-white flex flex-col">
      <MiniNavbar onNavigateHome={onNavigateHome} onNavigateDownload={onNavigateDownload} />

      <main id="main-content" role="main" className="flex-1" ref={contentRef as React.RefObject<HTMLElement>}>
        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/[0.06] px-6 py-20 sm:px-10 sm:py-28">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255,59,48,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[820px] text-center">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-white/35">
              <ol className="inline-flex items-center gap-2">
                <li>
                  <button
                    onClick={onNavigateHome}
                    className="hover:text-white/70 transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li aria-hidden="true" className="text-white/20">/</li>
                <li className="text-white/55 font-medium" aria-current="page">
                  YouTube Playlist to One Video
                </li>
              </ol>
            </nav>

            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
              Free Desktop Tool
            </span>

            <h1 className="rise-in mt-4 font-display text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-[58px] lg:text-[64px]">
              Turn a YouTube Playlist
              <br />
              <span className="text-coral">into One Single Video</span>
            </h1>

            <p
              className="rise-in mx-auto mt-6 max-w-[640px] text-[16px] leading-relaxed text-white/60 sm:text-[18px]"
              style={{ "--rise-delay": "120ms" } as React.CSSProperties}
            >
              Most tools make you download clips one-by-one and stitch them manually. TubeMerger
              automates the entire pipeline locally — select your videos, choose quality, and get
              one chapter-marked MP4. No cloud. No subscription. No limits.
            </p>

            <div
              className="rise-in mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ "--rise-delay": "220ms" } as React.CSSProperties}
            >
              <button
                onClick={onNavigateDownload}
                id="playlist-page-cta-download"
                className="inline-flex items-center justify-center rounded-full bg-coral h-14 px-9 text-[16px] font-display font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,59,48,0.65)] hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              >
                Download TubeMerger — Free
              </button>
              <a
                href="https://github.com/hashamtanveer-41/tubemerger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] h-14 px-7 text-[15px] font-sans font-medium text-white/75 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <GitHubIcon className="h-4 w-4" />
                View Source
              </a>
            </div>

            <p
              className="rise-in mt-7 font-sans text-[13px] text-white/35"
              style={{ "--rise-delay": "320ms" } as React.CSSProperties}
            >
              Windows · macOS · Linux &nbsp;•&nbsp; 100% Free &amp; Open Source &nbsp;•&nbsp; Fully Offline
            </p>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────── */}
        <section
          className="mx-auto max-w-[1000px] px-6 py-20 sm:px-10 sm:py-28"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mb-12 text-center">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
              Step-by-Step
            </span>
            <h2
              id="how-it-works-heading"
              className="reveal mt-3 font-display text-[32px] font-extrabold tracking-[-0.03em] text-white sm:text-[42px]"
            >
              How to Merge a YouTube Playlist into One Video
            </h2>
            <p className="reveal mt-3 text-[15px] text-white/45">
              Four steps from URL to finished MP4. Everything runs on your hardware — nothing
              leaves your machine.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </div>
        </section>

        {/* ── Why Local vs Cloud ───────────────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-28"
          aria-labelledby="why-local-heading"
        >
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-10 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                TubeMerger vs Cloud Tools
              </span>
              <h2
                id="why-local-heading"
                className="reveal mt-3 font-display text-[32px] font-extrabold tracking-[-0.03em] text-white sm:text-[42px]"
              >
                Why Merge Locally?
              </h2>
              <p className="reveal mt-3 max-w-[560px] mx-auto text-[15px] text-white/45">
                Cloud downloaders cap lengths, require accounts, and upload your watch history.
                TubeMerger runs entirely on your hardware.
              </p>
            </div>
            <div className="reveal rounded-[20px] border border-white/[0.08] bg-card overflow-hidden">
              <div className="grid grid-cols-3 gap-4 border-b border-white/[0.08] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em]">
                <span className="text-white/30">Feature</span>
                <span className="text-coral">TubeMerger</span>
                <span className="text-white/30">Cloud Tools</span>
              </div>
              <div className="px-6">
                <CompRow feature="Playlist length limit" tubemerger="Unlimited" cloudTools="10–30 min cap" />
                <CompRow feature="Account required" tubemerger="None" cloudTools="Sign-up required" />
                <CompRow feature="Subscription cost" tubemerger="Free forever" cloudTools="$5–20 / month" />
                <CompRow feature="Data privacy" tubemerger="100% local" cloudTools="Uploads to server" />
                <CompRow feature="Chapter bookmarks" tubemerger="Auto-embedded" cloudTools="Not supported" />
                <CompRow feature="Output quality" tubemerger="Up to 4K Ultra HD" cloudTools="Often capped at 1080p" />
                <CompRow feature="Offline processing" tubemerger="Fully offline" cloudTools="Requires internet" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Features ─────────────────────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-28"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-12 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                What You Get
              </span>
              <h2
                id="features-heading"
                className="reveal mt-3 font-display text-[32px] font-extrabold tracking-[-0.03em] text-white sm:text-[42px]"
              >
                Everything in One Tool
              </h2>
            </div>
            <dl className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  term: "Granular Playlist Control",
                  desc: "Cherry-pick individual videos before the download starts. Every clip shows title, thumbnail, and duration.",
                },
                {
                  term: "Auto Chapter Bookmarks",
                  desc: "Each video becomes a native, clickable chapter inside the final MP4 — compatible with VLC, QuickTime, and YouTube.",
                },
                {
                  term: "Multi-Quality Selection",
                  desc: "Choose 360p, 480p, 720p, 1080p, or 4K. The normalizer re-encodes all clips to a consistent canvas.",
                },
                {
                  term: "Separate Download Mode",
                  desc: "Prefer individual files? Toggle Separate Downloads to save each clip on its own — no merging required.",
                },
                {
                  term: "Real-Time Metrics",
                  desc: "Watch live download speed, total playlist duration, and estimated output file size as the job runs.",
                },
                {
                  term: "Zero Dependencies",
                  desc: "yt-dlp and FFmpeg are bundled inside the app. No PATH setup, no Homebrew installs, no terminal commands.",
                },
              ].map(({ term, desc }) => (
                <div
                  key={term}
                  className="rounded-[18px] border border-white/[0.08] bg-card p-6 transition-colors hover:border-white/[0.16]"
                >
                  <dt className="font-display text-[15.5px] font-bold text-white">{term}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-white/50">{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-[760px]">
            <div className="mb-10 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                Common Questions
              </span>
              <h2
                id="faq-heading"
                className="reveal mt-3 font-display text-[32px] font-extrabold tracking-[-0.03em] text-white sm:text-[40px]"
              >
                FAQ — YouTube Playlist to MP4
              </h2>
            </div>
            <FaqList />
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────── */}
        <section className="border-t border-white/[0.06] px-6 py-20 text-center sm:px-10 sm:py-28">
          <div className="mx-auto max-w-[580px]">
            <YouTubeIcon className="reveal mx-auto mb-6 h-10 w-auto text-coral drop-shadow-[0_0_18px_rgba(255,59,48,0.55)]" />
            <h2 className="reveal font-display text-[34px] font-extrabold tracking-[-0.03em] text-white sm:text-[44px]">
              Ready to turn your playlist into one video?
            </h2>
            <p className="reveal mt-4 text-[16px] leading-relaxed text-white/55">
              Download TubeMerger — free, open-source, and private. Works on Windows, macOS, and
              Linux with no setup.
            </p>
            <button
              onClick={onNavigateDownload}
              id="playlist-page-cta-download-bottom"
              className="reveal mt-9 inline-flex items-center justify-center rounded-full bg-coral h-14 px-10 text-[16px] font-display font-semibold text-white shadow-[0_8px_32px_-8px_rgba(255,59,48,0.7)] hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            >
              Download Free App
            </button>
          </div>
        </section>
      </main>

      <MiniFooter onNavigateHome={onNavigateHome} onNavigateDownload={onNavigateDownload} />
    </div>
  )
}
