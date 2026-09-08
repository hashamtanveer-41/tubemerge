import React from 'react';
import { Files, Maximize2, BookmarkCheck, HardDrive, Volume2, Github, Check } from 'lucide-react';

const GITHUB_URL = 'https://github.com/hashamtanveer-41/tubemerge';

export function EmptyStateView() {
  const features = [
    {
      icon: Files,
      label: 'Unlimited Merges',
    },
    {
      icon: Maximize2,
      label: 'Auto Resolution',
    },
    {
      icon: BookmarkCheck,
      label: 'Automated Chapters',
    },
    {
      icon: HardDrive,
      label: '100% Local Processing',
    },
    {
      icon: Volume2,
      label: 'AAC Stereo Audio',
    },
    {
      icon: Github,
      label: 'Free & Open Source',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 select-none animate-in fade-in duration-200">
      {/* Main Feature Showcase Card (Matching Grid Layout) */}
      <div className="w-full max-w-2xl rounded-3xl border border-[#2E2E2E] bg-[#141414] p-8 sm:p-10 shadow-2xl space-y-9 text-center relative overflow-hidden">
        {/* Title Header */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Power Up Your Merges.
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#888888] uppercase">
            High Performance Offline Playlist Stitching
          </p>
        </div>

        {/* 3x2 Visual Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6 max-w-xl mx-auto pt-2">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center space-y-3 group">
              <div className="relative flex items-center justify-center transition-transform duration-150 group-hover:scale-105">
                <Icon className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
                <span className="absolute -top-1 -right-3.5 text-emerald-400">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-zinc-200 tracking-wide uppercase leading-tight max-w-[140px]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons & Subtext */}
        <div className="pt-2 space-y-3 max-w-md mx-auto">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 h-12 rounded-full bg-gradient-to-r from-[#D90412] via-[#F00A18] to-[#FF1E27] hover:brightness-110 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_24px_rgba(235,10,24,0.45)] hover:shadow-[0_0_32px_rgba(255,30,40,0.65)] transition-all cursor-pointer"
          >
            <Github className="w-4 h-4 text-white" />
            <span>Star on GitHub</span>
            <span className="text-yellow-300">★</span>
          </a>

          <p className="text-xs text-[#777777] font-medium">
            Paste any playlist URL above to get started · MIT License
          </p>
        </div>
      </div>
    </div>
  );
}
