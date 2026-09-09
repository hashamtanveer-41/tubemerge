import React from "react"
import appMockup from "@/imports/image-9.png"

function ShowcaseIcon({
  name,
  className = "",
}: {
  name: string
  className?: string
}) {
  const paths: Record<string, React.ReactNode> = {
    link: (
      <path
        d="M9.5 14.5 14.5 9.5M8 11l-1.7 1.7a3.1 3.1 0 0 0 4.4 4.4L12.5 15M11 8l1.7-1.7a3.1 3.1 0 0 1 4.4 4.4L15.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    layers: (
      <path
        d="M12 4 3.5 8.5 12 13l8.5-4.5L12 4Zm-8.5 8L12 16.5 20.5 12M3.5 15.5 12 20l8.5-4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    chip: (
      <>
        <rect
          x="7"
          y="7"
          width="10"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M10 4v2m4-2v2m-4 12v2m4-2v2M4 10h2m-2 4h2m12-4h2m-2 4h2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
    bookmark: (
      <path
        d="M7 5h10v14l-5-3.2L7 19V5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    shield: (
      <path
        d="M12 3.5 5.5 6v5c0 4 2.8 7.2 6.5 8.5 3.7-1.3 6.5-4.5 6.5-8.5V6L12 3.5Zm-2.4 8.2 1.8 1.8 3.4-3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function ShowcaseRow({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="group flex items-start gap-4 rounded-[14px] border border-transparent p-3 transition-colors hover:border-white/[0.08] hover:bg-white/[0.02]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.03] text-coral transition-colors group-hover:border-coral/40 group-hover:bg-coral/10">
        <ShowcaseIcon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-[17px] font-bold tracking-[-0.01em] text-white">
          {title}
        </h3>
        <p className="mt-1 text-[14px] leading-[1.5] text-white/45">{desc}</p>
      </div>
    </div>
  )
}

export default function Showcase() {
  return (
    <section
      id="showcase"
      className="relative overflow-hidden px-6 py-24 sm:px-10"
    >
      {/* Soft coral glow anchored behind laptop */}
      <div
        className="pointer-events-none absolute right-[-6%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-coral/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
            The whole thing, one window
          </span>
          <h2 className="mt-3 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[40px]">
            Paste a link.
            <br />
            <span className="text-coral">Everything else is one screen.</span>
          </h2>
          <div className="mt-8 space-y-1.5">
            <ShowcaseRow
              icon="link"
              title="Paste & analyze"
              desc="Drop any YouTube playlist URL — it reads every video, duration, and thumbnail in seconds."
            />
            <ShowcaseRow
              icon="layers"
              title="Merge queue you can see"
              desc="Line up merge jobs, reorder, and watch real-time download speed and progress live."
            />
            <ShowcaseRow
              icon="chip"
              title="Stitched or separate — your choice"
              desc="Get one seamless master video with chapters, or download each clip as its own separate file."
            />
            <ShowcaseRow
              icon="bookmark"
              title="Chapters, automatically"
              desc="Every source video becomes a clickable, named chapter embedded in the final MP4 file."
            />
            <ShowcaseRow
              icon="shield"
              title="Skip videos & pick your quality"
              desc="Exclude specific clips before downloading, choose quality from 360p to 4K, and track estimated file size."
            />
          </div>
        </div>

        <div className="relative">
          <div className="pop-hold">
            <img
              src={appMockup}
              alt="TubeMerger running on a laptop, showing the merge dashboard"
              loading="lazy"
              decoding="async"
              width="1309"
              height="667"
              className="w-full drop-shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
