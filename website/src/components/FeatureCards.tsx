import React from "react"
import videoCards from "@/imports/image-4.png"
import chaptersTimeline from "@/imports/image-3.png"
import walStats from "@/imports/image-1.png"
import mergeProgressImg from "@/imports/image.png"

interface FeatureCardProps {
  title: string
  subtitle: string
  bullets: string[]
  visual: React.ReactNode
  reverse?: boolean
}

function FeatureCard({
  title,
  subtitle,
  bullets,
  visual,
  reverse = false,
}: FeatureCardProps) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 rounded-[20px] border border-white/[0.08] bg-card p-8 lg:grid-cols-2 lg:p-12">
      <div
        className={`overflow-hidden rounded-[14px] ${
          reverse ? "lg:order-2" : ""
        }`}
      >
        <div className="pop-hold">{visual}</div>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>
        <h3 className="inline-block font-display text-[30px] font-bold uppercase leading-[1.05] tracking-[-0.02em] underline decoration-white/20 decoration-2 underline-offset-[6px] sm:text-[34px]">
          {title}
        </h3>
        <p className="mt-5 text-[16px] font-semibold text-white/80">
          {subtitle}
        </p>
        <ul className="mt-5 space-y-3" role="list">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 text-[15px] text-white/50"
            >
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/30" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function FeatureCards() {
  return (
    <section
      id="features"
      className="mx-auto max-w-[1200px] space-y-10 px-6 py-24 sm:px-10"
    >
      <FeatureCard
        title="Tired of Merging Clips One by One?"
        subtitle="Drop in a playlist. Get back one clean video."
        bullets={[
          "No manual stitching",
          "Auto-aligned — no jumpy cuts",
          "Even audio throughout",
        ]}
        visual={
          <img
            src={videoCards}
            alt="Video clips stitched along a timeline into one master"
            loading="lazy"
            decoding="async"
            width="1835"
            height="773"
            className="w-full h-auto"
          />
        }
      />

      <FeatureCard
        reverse
        title="Can't Skip to the Part You Want?"
        subtitle="Every video gets clickable chapters, built in."
        bullets={[
          "Jump to any section instantly",
          "Works in any player",
          "No extra files",
        ]}
        visual={
          <img
            src={chaptersTimeline}
            alt="Chapter timeline scrubber from the TubeMerge app"
            loading="lazy"
            decoding="async"
            width="1024"
            height="323"
            className="w-full h-auto"
          />
        }
      />

      <FeatureCard
        title="Worried About Uploading Your Videos?"
        subtitle="Everything runs on your computer. Nothing leaves it."
        bullets={[
          "No uploads, no waiting",
          "No account needed",
          "Works fully offline",
        ]}
        visual={
          <img
            src={walStats}
            alt="TubeMerge merge history with stat blocks and completed job"
            loading="lazy"
            decoding="async"
            width="1356"
            height="692"
            className="w-full h-auto"
          />
        }
      />

      <FeatureCard
        reverse
        title="Never Sure If It's Actually Working?"
        subtitle="Watch every merge happen in real time."
        bullets={[
          "Live progress, no guessing",
          "Fast download and merge speeds",
          "Direct on your machine — no waiting in line",
        ]}
        visual={
          <img
            src={mergeProgressImg}
            alt="TubeMerge real-time merge in progress queue screen"
            loading="lazy"
            decoding="async"
            width="1064"
            height="579"
            className="w-full h-auto rounded-lg"
          />
        }
      />
    </section>
  )
}
