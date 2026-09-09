import React, { useState } from "react"

interface FaqItem {
  q: string
  a: string
}

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs: FaqItem[] = [
    {
      q: "How does TubeMerger download and merge playlists offline?",
      a: "TubeMerger runs entirely on your local computer. When you paste a YouTube playlist or video link, it downloads the streams directly to your machine and stitches them together into one unified file. Your media, links, and browsing data are never uploaded to any cloud server.",
    },
    {
      q: "Does TubeMerger automatically generate video chapters?",
      a: "Yes. Every individual video from the playlist is converted into a native, clickable chapter marker inside the final MP4 file. You can jump between clips seamlessly in VLC, QuickTime, YouTube, and any standard media player.",
    },
    {
      q: "Is TubeMerger completely free and open source?",
      a: "Yes! TubeMerger is 100% free under the permissive MIT license. There are no subscriptions, no locked features, no device caps, and no license keys. All source code is publicly accessible on GitHub.",
    },
    {
      q: "Can I skip specific videos in a playlist before downloading?",
      a: "Yes — this is one of TubeMerger's core capabilities. The Granular Playlist Control interface shows you every video's title, thumbnail, and duration before any download starts. You can toggle individual clips on or off with a single click, skipping intros, ads, or irrelevant episodes so only the videos you actually want are downloaded and merged.",
    },
    {
      q: "Can I download each video as a separate file instead of one merged video?",
      a: "Absolutely. TubeMerger supports two output modes. Stitched mode concatenates all selected videos into one seamless master MP4 with auto-generated chapter bookmarks at each clip boundary. Separate Downloads mode saves each chosen video as its own individual file in a dedicated folder — no merging, no extra steps. You choose before hitting Start.",
    },
    {
      q: "What video quality options can I select for downloading?",
      a: "TubeMerger's Multi-Quality Selection lets you pick your target resolution before the download begins: 360p, 480p, 720p HD, 1080p Full HD, and 4K Ultra HD are all supported. The normalization engine automatically re-encodes every clip to the selected canvas using libx264, eliminating black bars and resolution mismatches between clips.",
    },
    {
      q: "How can I support the project?",
      a: "Since TubeMerger is completely free, you can support development by starring the repository on GitHub, reporting bugs, suggesting improvements, or sharing the app with other creators.",
    },
    {
      q: "What should I do if a playlist fails to download or merge?",
      a: "YouTube frequently updates its video delivery formats. If a playlist encounters an issue, you can report it directly on our GitHub Issues page with the link or error log, or reach out to support@tubemerger.com.",
    },
    {
      q: "What operating systems are supported?",
      a: "TubeMerger is built to run reliably on all major operating systems, including macOS (Universal Apple Silicon & Intel), Windows 10/11, and modern 64-bit Linux distributions.",
    },
  ]

  return (
    <section
      id="faq"
      className="mx-auto max-w-[900px] px-6 py-24 sm:px-10 border-t border-white/[0.06]"
    >
      <div className="text-center max-w-[650px] mx-auto mb-12">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
          Questions & Answers
        </span>
        <h2 className="mt-3 font-display text-[34px] font-extrabold tracking-[-0.03em] sm:text-[42px] text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-2.5 text-[15px] text-white/45">
          Common questions about skipping specific videos, stitched vs separate
          downloads, quality selection, offline processing, and chapter compatibility.
        </p>
      </div>

      <div className="space-y-3.5">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i
          return (
            <div
              key={i}
              className={`rounded-[18px] border transition-colors overflow-hidden bg-card ${
                isOpen
                  ? "border-coral/40"
                  : "border-white/[0.08] hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-display text-[16.5px] font-bold text-white transition-colors cursor-pointer"
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
    </section>
  )
}
