import React from "react"

function Pill({
  children,
  tone = "coralSolid",
}: {
  children: React.ReactNode
  tone?: "coralSolid"
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] bg-coral text-white">
      {children}
    </span>
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

interface OpenSourceCardProps {
  name: string
  badge: string
  period: string
  features: string[]
  cta: React.ReactNode
  onClick: () => void
  featured?: boolean
  isExternal?: boolean
  href?: string
}

function OpenSourceCard({
  name,
  badge,
  period,
  features,
  cta,
  onClick,
  featured = false,
  isExternal = false,
  href,
}: OpenSourceCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[24px] p-7 transition-all duration-300 ${
        featured
          ? "border-2 border-coral/60 bg-[#12131A] shadow-[0_0_50px_rgba(255,59,48,0.1)] hover:border-coral"
          : "border border-white/[0.08] bg-card hover:border-white/[0.15]"
      }`}
    >
      {featured && (
        <span className="absolute -top-3.5 left-7">
          <Pill tone="coralSolid">MIT Licensed</Pill>
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <span className="font-display text-[16px] font-semibold text-white">
          {name}
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1.5">
        <span className="font-display text-[38px] font-extrabold tracking-[-0.03em] text-white">
          {badge}
        </span>
        <span className="mb-2 text-[12px] text-white/40">{period}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3" role="list">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2.5 text-[14px] text-white/65"
          >
            <svg
              viewBox="0 0 12 12"
              className="mt-1 h-3.5 w-3.5 shrink-0"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3L4.5 8.5L2 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-coral"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-4 border-t border-white/[0.06]">
        {isExternal && href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center rounded-full h-11 px-5 text-[14px] font-display font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
              featured
                ? "bg-coral text-white shadow-[0_4px_16px_rgba(255,59,48,0.4)] hover:brightness-110"
                : "border border-white/15 bg-white/[0.02] text-white hover:border-white/30 hover:bg-white/[0.05]"
            }`}
          >
            {cta}
          </a>
        ) : (
          <button
            onClick={onClick}
            className={`w-full inline-flex items-center justify-center rounded-full h-11 px-5 text-[14px] font-display font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
              featured
                ? "bg-coral text-white shadow-[0_4px_16px_rgba(255,59,48,0.4)] hover:brightness-110"
                : "border border-white/15 bg-white/[0.02] text-white hover:border-white/30 hover:bg-white/[0.05]"
            }`}
          >
            {cta}
          </button>
        )}
      </div>
    </div>
  )
}

interface PricingSectionProps {
  onOpenDownload: () => void
  onOpenCheckout?: (plan: string) => void
}

export default function PricingSection({
  onOpenDownload,
}: PricingSectionProps) {
  return (
    <section
      id="community"
      className="mx-auto max-w-[1160px] px-6 py-24 sm:px-8"
    >
      <div className="text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
          Open Source Pledge
        </span>
        <h2 className="mt-2 font-display text-[32px] sm:text-[40px] font-extrabold text-white tracking-[-0.03em]">
          100% Free. No Paywalls. No Subscriptions.
        </h2>
        <p className="mt-3 mx-auto max-w-[620px] text-[15px] text-white/50">
          TubeMerger is built for creators. All features are unlocked and execute
          completely on your own machine.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        <OpenSourceCard
          name="Desktop Application"
          badge="$0"
          period="free forever"
          features={[
            "Single-file merge or batch folder download",
            "Auto master canvas scaling",
            "Embedded MP4 chapter markers",
            "Saved directly to your Downloads folder",
            "Zero quotas or artificial limits",
          ]}
          cta="Download Free App"
          onClick={onOpenDownload}
        />
        <OpenSourceCard
          name="Community & Codebase"
          badge="MIT"
          period="open license"
          featured
          features={[
            "100% transparent open source",
            "Inspect, audit & contribute",
            "Active issue tracker on GitHub",
            "No telemetry paywalls or locks",
            "Free for personal & commercial use",
          ]}
          cta={
            <span className="inline-flex items-center gap-2">
              <StarIcon className="h-4 w-4" />
              <span>Star on GitHub</span>
            </span>
          }
          onClick={() => {}}
          isExternal
          href="https://github.com/hashamtanveer-41/tubemerger"
        />
        <OpenSourceCard
          name="Privacy & Architecture"
          badge="100%"
          period="on-device processing"
          features={[
            "Bundled yt-dlp & FFmpeg binaries",
            "FastAPI localhost sidecar",
            "Zero cloud video uploads",
            "No user account required",
            "SQLite WAL local history",
          ]}
          cta="View Documentation"
          onClick={() => {}}
          isExternal
          href="https://github.com/hashamtanveer-41/tubemerger#readme"
        />
      </div>
    </section>
  )
}
