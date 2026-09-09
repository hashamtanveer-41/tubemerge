import React from "react"

export default function ComparisonTable() {
  const rows = [
    {
      feature: "100% Offline & Local Privacy",
      tubemerge: true,
      premiere: true,
      cloud: false,
      ffmpeg: true,
      detail: "Zero video frames or personal metadata leave your hardware.",
    },
    {
      feature: "1-Click Full Playlist URL Parsing",
      tubemerge: true,
      premiere: false,
      cloud: "Limited",
      ffmpeg: false,
      detail: "Paste link once; instantly reads every video in the playlist.",
    },
    {
      feature: "Automated Chapters from Video Titles",
      tubemerge: true,
      premiere: false,
      cloud: false,
      ffmpeg: "Manual CLI",
      detail: "Embeds clickable bookmarks for VLC, QuickTime & YouTube.",
    },
    {
      feature: "Fixes Mismatched Video Sizes & Black Bars",
      tubemerge: true,
      premiere: "Manual Filter",
      cloud: "Distorts",
      ffmpeg: "Complex Flag",
      detail:
        "Automatically aligns mixed resolutions so clips don't stretch or jump.",
    },
    {
      feature: "Smart Audio Leveling & Balanced Sound",
      tubemerge: true,
      premiere: "Manual Filter",
      cloud: false,
      ffmpeg: "Complex Flag",
      detail: "Eliminates fluctuating volume spikes between different clips.",
    },
    {
      feature: "High Definition & Smooth Playback",
      tubemerge: true,
      premiere: true,
      cloud: false,
      ffmpeg: true,
      detail: "Crisp picture quality and smooth motion with no watermarks.",
    },
    {
      feature: "100% Free & Open Source Forever",
      tubemerge: true,
      premiere: "Costly Subscription",
      cloud: "Paid limits",
      ffmpeg: true,
      detail:
        "No monthly subscriptions, no locked features, and no credit card required.",
    },
  ]

  return (
    <section className="relative px-6 py-24 sm:px-10 border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center max-w-[700px] mx-auto mb-14">
          <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.22em] text-coral">
            Competitive Matrix
          </span>
          <h2 className="mt-3 font-display text-[34px] font-extrabold tracking-[-0.03em] sm:text-[44px]">
            Why Creators Choose TubeMerger
          </h2>
          <p className="mt-3 text-[15px] text-white/50">
            Compare TubeMerger to manual NLE editing workflows, cloud converter
            sites, and bare-metal command line utilities.
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto rounded-[20px] border border-white/[0.08] bg-[#12131A] shadow-2xl">
          <table className="w-full min-w-[700px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#090A0F]">
                <th className="p-5 font-display font-semibold text-white/60">
                  Feature Capability
                </th>
                <th className="p-5 font-display font-bold text-coral text-[16px] bg-coral/[0.06] border-x border-coral/20">
                  TubeMerger
                </th>
                <th className="p-5 font-display font-semibold text-white/60">
                  Premiere Pro / NLEs
                </th>
                <th className="p-5 font-display font-semibold text-white/60">
                  Cloud Converters
                </th>
                <th className="p-5 font-display font-semibold text-white/60">
                  Raw FFmpeg CLI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-5">
                    <span className="block font-semibold text-white">
                      {row.feature}
                    </span>
                    <span className="text-[12px] text-white/40">
                      {row.detail}
                    </span>
                  </td>

                  {/* TubeMerger Col */}
                  <td className="p-5 bg-coral/[0.04] border-x border-coral/20 font-semibold text-coral">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white text-[11px] font-bold">
                        ✓
                      </span>
                      <span>Native</span>
                    </div>
                  </td>

                  {/* Premiere Col */}
                  <td className="p-5 text-white/60">
                    {row.premiere === true ? (
                      <span className="text-white/80">✓ Yes</span>
                    ) : row.premiere === false ? (
                      <span className="text-white/30">✕ No</span>
                    ) : (
                      <span className="text-white/50">{row.premiere}</span>
                    )}
                  </td>

                  {/* Cloud Col */}
                  <td className="p-5 text-white/60">
                    {row.cloud === true ? (
                      <span className="text-white/80">✓ Yes</span>
                    ) : row.cloud === false ? (
                      <span className="text-white/30">✕ No</span>
                    ) : (
                      <span className="text-white/50">{row.cloud}</span>
                    )}
                  </td>

                  {/* FFmpeg Col */}
                  <td className="p-5 text-white/60">
                    {row.ffmpeg === true ? (
                      <span className="text-white/80">✓ Yes</span>
                    ) : row.ffmpeg === false ? (
                      <span className="text-white/30">✕ No</span>
                    ) : (
                      <span className="text-white/50">{row.ffmpeg}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
