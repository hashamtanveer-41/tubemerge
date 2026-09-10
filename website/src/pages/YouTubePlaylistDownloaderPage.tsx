import React, { useEffect, useRef } from "react"

/* ─────────────────────────────────────────────
   Icon components (clean inline SVGs)
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
   Navbar (Clean, solid background, no glassmorphism)
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
   Footer (Clean solid layout)
───────────────────────────────────────────── */
function MiniFooter({
  onNavigateHome,
  onNavigateDownload,
  onNavigatePlaylistGuide,
}: {
  onNavigateHome: () => void
  onNavigateDownload: () => void
  onNavigatePlaylistGuide?: () => void
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
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={onNavigateDownload}
            className="font-sans text-[14px] text-white/50 transition-colors hover:text-white cursor-pointer"
          >
            Download
          </button>
          {onNavigatePlaylistGuide && (
            <button
              onClick={onNavigatePlaylistGuide}
              className="font-sans text-[14px] text-white/50 transition-colors hover:text-white cursor-pointer"
            >
              Merge Playlist Guide
            </button>
          )}
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
        <span className="text-[13px] text-white/35">100% free and open source offline downloader.</span>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   Step Component
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
    <div className="reveal flex gap-5 rounded-[18px] border border-white/[0.08] bg-card p-6 sm:p-7 transition-colors hover:border-white/[0.14]">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-display font-extrabold text-coral"
        style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.22)" }}
      >
        {number}
      </div>
      <div>
        <h3 className="font-display text-[16.5px] font-bold text-white">{title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  )
}

function ComparisonRow({
  feature,
  desktopApp,
  webDownloaders,
}: {
  feature: string
  desktopApp: string
  webDownloaders: string
}) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] py-4 text-[14px]">
      <span className="text-white/65 font-medium">{feature}</span>
      <span className="flex items-center gap-2 text-white/90">
        <CheckIcon className="h-5 w-5 shrink-0" />
        {desktopApp}
      </span>
      <span className="flex items-center gap-2 text-white/35">
        <CrossIcon className="h-5 w-5 shrink-0" />
        {webDownloaders}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   JSON-LD Structured Data
───────────────────────────────────────────── */
const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://tubemerger.com/youtube-playlist-downloader#software",
      name: "TubeMerger",
      operatingSystem: "Windows, macOS, Linux",
      applicationCategory: "MultimediaApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free and open-source desktop YouTube playlist downloader. Download entire playlists into separate files or merged MP4s offline with granular clip selection and quality control.",
      url: "https://tubemerger.com/youtube-playlist-downloader",
    },
    {
      "@type": "HowTo",
      "@id": "https://tubemerger.com/youtube-playlist-downloader#howto",
      name: "How to Download a YouTube Playlist Offline with TubeMerger",
      description:
        "Download full YouTube playlists to your computer into separate video files with custom quality and clip selection.",
      totalTime: "PT2M",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Paste the Playlist Link",
          text: "Open TubeMerger and paste any public YouTube playlist URL. The app inspects each video title, thumbnail, and duration.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Select Desired Videos",
          text: "Review the playlist list and uncheck any videos you want to skip, such as teasers or already watched episodes.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Choose Separate Files Mode & Resolution",
          text: "Select Separate Files mode to keep each clip independent, and pick your preferred video resolution up to 4K.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Download Directly to Disk",
          text: "Click Start. TubeMerger downloads each video stream directly to your chosen local folder with no cloud relay.",
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://tubemerger.com/youtube-playlist-downloader#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://tubemerger.com/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "YouTube Playlist Downloader",
          item: "https://tubemerger.com/youtube-playlist-downloader",
        },
      ],
    },
  ],
}

/* ─────────────────────────────────────────────
   Reveal Hook
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
   FAQ Accordion
───────────────────────────────────────────── */
function FaqList() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0)

  const faqs = [
    {
      q: "Can I download playlist videos as separate files instead of one merged file?",
      a: "Yes. TubeMerger provides a Separate Downloads toggle. When enabled, each selected video in the playlist is downloaded into its own clean file (numbered in playlist sequence), stored directly in your local destination folder.",
    },
    {
      q: "Can I skip specific episodes or videos I don't want?",
      a: "Yes. When you enter a playlist URL, TubeMerger fetches and displays the complete list of videos with thumbnails, titles, and runtimes. You can individually uncheck any video you do not need, or select and deselect all with one click.",
    },
    {
      q: "Is there any limit on the number of videos or playlist size?",
      a: "No artificial limits. You can download long series, full course libraries, or music collections. The only constraint is your computer's local disk capacity and internet connection.",
    },
    {
      q: "Do I need to install yt-dlp, FFmpeg, or Python manually?",
      a: "No. TubeMerger packages yt-dlp and FFmpeg binaries internally. There is no terminal configuration, no Python requirement, and no environment variable setup needed.",
    },
    {
      q: "What video resolutions and formats can I download?",
      a: "TubeMerger supports standard resolutions including 360p, 480p, 720p HD, 1080p Full HD, 1440p 2K, and 2160p 4K UHD. Video streams are saved in MP4 or MKV containers with clear audio.",
    },
    {
      q: "Why use a desktop downloader instead of an online web converter?",
      a: "Web-based downloaders rely on third-party servers that inject redirect ads, throttle transfer speeds, restrict video lengths, and collect browsing telemetry. A desktop app communicates directly between your machine and YouTube with complete privacy.",
    },
    {
      q: "Is TubeMerger free and open source?",
      a: "Yes. TubeMerger is licensed under the MIT license and is 100% open source. You can inspect the source code, verify privacy claims, or contribute directly on GitHub.",
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
              isOpen ? "border-coral/40" : "border-white/[0.08] hover:border-white/16"
            }`}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left font-display text-[15.5px] font-bold text-white transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <span
                className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[15px] transition-colors ${
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
   Main Page Component
───────────────────────────────────────────── */
interface YouTubePlaylistDownloaderPageProps {
  onNavigateHome: () => void
  onNavigateDownload: () => void
  onNavigatePlaylistGuide?: () => void
}

export default function YouTubePlaylistDownloaderPage({
  onNavigateHome,
  onNavigateDownload,
  onNavigatePlaylistGuide,
}: YouTubePlaylistDownloaderPageProps) {
  const contentRef = useReveal()

  useEffect(() => {
    document.title = "YouTube Playlist Downloader for Desktop — Free & Open Source | TubeMerger"

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
      "Download YouTube playlists offline into separate MP4 or MKV files with TubeMerger. Pick your video quality, skip unwanted episodes, and download locally with zero ads or limits."
    )
    setMeta(
      "og:title",
      "YouTube Playlist Downloader for Desktop — Free & Open Source | TubeMerger",
      true
    )
    setMeta(
      "og:description",
      "Download YouTube playlists offline into separate MP4 or MKV files. Granular video selection, up to 4K quality, open-source and ad-free.",
      true
    )
    setMeta("og:url", "https://tubemerger.com/youtube-playlist-downloader", true)
    setMeta(
      "twitter:title",
      "YouTube Playlist Downloader for Desktop — Free & Open Source | TubeMerger"
    )
    setMeta(
      "twitter:description",
      "Download YouTube playlists offline into separate MP4 or MKV files with granular clip selection and quality control."
    )

    let canonical = document.querySelector<HTMLLinkElement>("link[rel='canonical']")
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = "https://tubemerger.com/youtube-playlist-downloader"

    if (!document.getElementById("jsonld-yt-downloader-page")) {
      const script = document.createElement("script")
      script.type = "application/ld+json"
      script.id = "jsonld-yt-downloader-page"
      script.textContent = JSON.stringify(JSONLD)
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById("jsonld-yt-downloader-page")?.remove()
    }
  }, [])

  const steps = [
    {
      number: "1",
      title: "Paste the Playlist Link",
      description:
        "Copy any public or unlisted YouTube playlist URL and paste it into TubeMerger. The app immediately parses all videos, titles, and durations.",
    },
    {
      number: "2",
      title: "Pick Your Episodes",
      description:
        "Every video is listed with a preview thumbnail and checkbox. Keep only the episodes or clips you need, and uncheck filler or trailers.",
    },
    {
      number: "3",
      title: "Set Output Mode & Resolution",
      description:
        "Choose Separate Downloads to keep each video as an independent file, or Stitched mode to merge them. Pick your target resolution from 360p up to 4K.",
    },
    {
      number: "4",
      title: "Save Directly to Your Computer",
      description:
        "Select your destination folder and click Download. Videos are fetched and saved directly to your hard drive with live progress metrics.",
    },
  ]

  const featurePillars = [
    {
      title: "Separate Files or Merged Output",
      desc: "Save every video as an independent file numbered in order, or merge them into a single master MP4. Switch modes with a single toggle.",
    },
    {
      title: "Granular Video Selection",
      desc: "Check and uncheck individual videos before downloading starts. Skip intros, watched lectures, or bonus clips without downloading the full set.",
    },
    {
      title: "Resolution Control (Up to 4K)",
      desc: "Select the quality that suits your storage and display: 360p, 480p, 720p HD, 1080p Full HD, or 4K Ultra HD with synchronized audio.",
    },
    {
      title: "Zero Ads, Zero Trackers",
      desc: "Unlike web downloaders loaded with deceptive ads and popups, TubeMerger is a clean native desktop application with no advertisements.",
    },
    {
      title: "Direct Local Processing",
      desc: "Network transfers connect directly from your machine to YouTube. No middleman cloud servers, no link logging, and no file uploads.",
    },
    {
      title: "No Arbitrary File Limits",
      desc: "Download playlists of any length. There are no 10-minute video duration limits, file size caps, or required user accounts.",
    },
  ]

  return (
    <div className="min-h-screen bg-canvas text-white selection:bg-coral/30 selection:text-white flex flex-col">
      <MiniNavbar onNavigateHome={onNavigateHome} onNavigateDownload={onNavigateDownload} />

      <main id="main-content" role="main" className="flex-1" ref={contentRef as React.RefObject<HTMLElement>}>
        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-white/[0.06] px-6 py-20 sm:px-10 sm:py-26">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 45% at 50% -5%, rgba(255,59,48,0.1) 0%, transparent 65%)",
            }}
          />
          <div className="relative mx-auto max-w-[840px] text-center">
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
                  YouTube Playlist Downloader
                </li>
              </ol>
            </nav>

            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
              Open Source Desktop App
            </span>

            <h1 className="rise-in mt-4 font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] text-white sm:text-[54px] lg:text-[62px]">
              YouTube Playlist Downloader
              <br />
              <span className="text-coral">for Your Desktop</span>
            </h1>

            <p
              className="rise-in mx-auto mt-6 max-w-[660px] text-[16px] leading-relaxed text-white/60 sm:text-[18px]"
              style={{ "--rise-delay": "120ms" } as React.CSSProperties}
            >
              Download entire YouTube playlists offline into separate MP4 or MKV files.
              Select only the clips you want, choose your resolution up to 4K, and save cleanly to your local drive without web ads or video length caps.
            </p>

            <div
              className="rise-in mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ "--rise-delay": "220ms" } as React.CSSProperties}
            >
              <button
                onClick={onNavigateDownload}
                id="yt-downloader-cta-download"
                className="inline-flex items-center justify-center rounded-full bg-coral h-14 px-9 text-[15.5px] font-display font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,59,48,0.65)] hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              >
                Download for Desktop — Free
              </button>
              <a
                href="https://github.com/hashamtanveer-41/tubemerger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] h-14 px-7 text-[15px] font-sans font-medium text-white/75 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <GitHubIcon className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            <p
              className="rise-in mt-7 font-sans text-[13px] text-white/35"
              style={{ "--rise-delay": "320ms" } as React.CSSProperties}
            >
              Windows · macOS · Linux &nbsp;•&nbsp; 100% Free &amp; Open Source &nbsp;•&nbsp; No Ads or Signups
            </p>
          </div>
        </section>

        {/* ── Key Capabilities (Granular focus) ────── */}
        <section
          className="mx-auto max-w-[1040px] px-6 py-20 sm:px-10 sm:py-26"
          aria-labelledby="features-heading"
        >
          <div className="mb-12 text-center">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
              Granular Control
            </span>
            <h2
              id="features-heading"
              className="reveal mt-3 font-display text-[30px] font-extrabold tracking-[-0.03em] text-white sm:text-[38px]"
            >
              Clean Playlist Downloads Without the Fluff
            </h2>
            <p className="reveal mt-3 max-w-[600px] mx-auto text-[15px] leading-relaxed text-white/45">
              Built for people who want offline archives without being forced into all-or-nothing downloads or ad-heavy converter sites.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featurePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="reveal rounded-[18px] border border-white/[0.08] bg-card p-6 transition-colors hover:border-white/[0.16]"
              >
                <h3 className="font-display text-[16px] font-bold text-white">{pillar.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/50">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-26"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-[1000px]">
            <div className="mb-12 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                Workflow
              </span>
              <h2
                id="how-it-works-heading"
                className="reveal mt-3 font-display text-[30px] font-extrabold tracking-[-0.03em] text-white sm:text-[38px]"
              >
                How to Download YouTube Playlists
              </h2>
              <p className="reveal mt-3 text-[15px] text-white/45">
                Four quick steps from playlist link to offline files on your disk.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Desktop vs Web Downloaders ───────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-26"
          aria-labelledby="comparison-heading"
        >
          <div className="mx-auto max-w-[960px]">
            <div className="mb-10 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                Direct Comparison
              </span>
              <h2
                id="comparison-heading"
                className="reveal mt-3 font-display text-[30px] font-extrabold tracking-[-0.03em] text-white sm:text-[38px]"
              >
                Desktop Application vs Web Downloaders
              </h2>
              <p className="reveal mt-3 max-w-[560px] mx-auto text-[15px] text-white/45">
                Why a dedicated local desktop tool is faster, safer, and cleaner than browser converters.
              </p>
            </div>

            <div className="reveal rounded-[18px] border border-white/[0.08] bg-card overflow-hidden">
              <div className="grid grid-cols-3 gap-4 border-b border-white/[0.08] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.12em]">
                <span className="text-white/30">Feature</span>
                <span className="text-coral">TubeMerger (Desktop)</span>
                <span className="text-white/30">Web Downloaders</span>
              </div>
              <div className="px-6">
                <ComparisonRow
                  feature="Adware & Popups"
                  desktopApp="Zero ads (clean GUI)"
                  webDownloaders="Intrusive ads & redirects"
                />
                <ComparisonRow
                  feature="Separate Files or Merged"
                  desktopApp="Both supported"
                  webDownloaders="Usually single file only"
                />
                <ComparisonRow
                  feature="Granular Video Selection"
                  desktopApp="Checkbox per video"
                  webDownloaders="All or nothing"
                />
                <ComparisonRow
                  feature="Video Duration Limits"
                  desktopApp="No limit"
                  webDownloaders="10–30 min cap"
                />
                <ComparisonRow
                  feature="Resolution Support"
                  desktopApp="Up to 4K Ultra HD"
                  webDownloaders="Often capped at 720p"
                />
                <ComparisonRow
                  feature="Privacy & Tracking"
                  desktopApp="100% local, no telemetry"
                  webDownloaders="Logs URLs & IP addresses"
                />
                <ComparisonRow
                  feature="Cost"
                  desktopApp="Free & Open Source (MIT)"
                  webDownloaders="Paid upgrades & throttles"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────── */}
        <section
          className="border-t border-white/[0.06] px-6 py-20 sm:px-10 sm:py-26"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-[760px]">
            <div className="mb-10 text-center">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
                Questions & Answers
              </span>
              <h2
                id="faq-heading"
                className="reveal mt-3 font-display text-[30px] font-extrabold tracking-[-0.03em] text-white sm:text-[38px]"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <FaqList />
          </div>
        </section>

        {/* ── Final Call to Action ─────────────────── */}
        <section className="border-t border-white/[0.06] px-6 py-20 text-center sm:px-10 sm:py-26">
          <div className="mx-auto max-w-[600px]">
            <YouTubeIcon className="reveal mx-auto mb-6 h-10 w-auto text-coral drop-shadow-[0_0_16px_rgba(255,59,48,0.5)]" />
            <h2 className="reveal font-display text-[32px] font-extrabold tracking-[-0.03em] text-white sm:text-[40px]">
              Download Playlists on Your Terms
            </h2>
            <p className="reveal mt-3.5 text-[15.5px] leading-relaxed text-white/55">
              Available for Windows, macOS, and Linux. No subscriptions, no ads, and full offline control.
            </p>
            <button
              onClick={onNavigateDownload}
              id="yt-downloader-cta-download-bottom"
              className="reveal mt-8 inline-flex items-center justify-center rounded-full bg-coral h-14 px-9 text-[15.5px] font-display font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,59,48,0.65)] hover:brightness-110 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            >
              Download TubeMerger
            </button>
          </div>
        </section>
      </main>

      <MiniFooter
        onNavigateHome={onNavigateHome}
        onNavigateDownload={onNavigateDownload}
        onNavigatePlaylistGuide={onNavigatePlaylistGuide}
      />
    </div>
  )
}
