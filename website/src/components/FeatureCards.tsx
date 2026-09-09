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
        title="Stitched or Separate Downloads"
        subtitle="Choose how you want your output — one master file or individual clips."
        bullets={[
          "Merge entire playlist into one seamless master video with auto-generated chapters",
          "Or save each selected video as a separate file in its own dedicated folder",
          "Auto-normalized resolution and audio levels — no jumpy cuts or black bars",
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
        title="Granular Playlist Control"
        subtitle="Pick exactly which videos to include — skip the rest."
        bullets={[
          "Toggle any individual video on or off before a single byte downloads",
          "Skip intros, ads, or irrelevant episodes with one click",
          "Clickable chapter per video embedded directly in the final MP4 container",
        ]}
        visual={
          <img
            src={chaptersTimeline}
            alt="Chapter timeline scrubber from the TubeMerger app"
            loading="lazy"
            decoding="async"
            width="1024"
            height="323"
            className="w-full h-auto"
          />
        }
      />

      <FeatureCard
        title="Multi-Quality Selection"
        subtitle="Download at the resolution you need — from 360p all the way to 4K."
        bullets={[
          "Choose 360p, 480p, 720p HD, 1080p Full HD, or 4K Ultra HD before download starts",
          "100% offline — no uploads, no cloud servers, no account required",
          "Complete privacy: yt-dlp and FFmpeg run entirely on your local machine",
        ]}
        visual={
          <img
            src={walStats}
            alt="TubeMerger merge history with stat blocks and completed job"
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
        title="Real-Time Metrics Dashboard"
        subtitle="Watch every merge happen live — speed, size, and progress in one place."
        bullets={[
          "Live download speed updated in real time via SSE — no guessing",
          "Total playlist duration calculated from metadata before download begins",
          "Estimated output file size shown upfront so you know what you're getting",
        ]}
        visual={
          <img
            src={mergeProgressImg}
            alt="TubeMerger real-time merge in progress queue screen"
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
