import React, { useState, useRef } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
  Search,
  Check,
  Files,
  Maximize2,
  Cpu,
  Workflow,
  Headphones,
  BookmarkCheck,
  Play,
} from 'lucide-react';

interface EmptyStateViewProps {
  fetching: boolean;
  onSearch: (url: string) => void;
  onUpgradeClick: () => void;
}

export function EmptyStateView({
  fetching,
  onSearch,
  onUpgradeClick,
}: EmptyStateViewProps) {
  const [inputUrl, setInputUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim() && !fetching) {
      onSearch(inputUrl.trim());
    }
  };

  const handleStayFree = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 animate-in fade-in duration-150">
        <Spinner size="lg" variant="red" />
        <div className="space-y-1">
          <p className="text-base font-semibold text-content-primary">
            Inspecting YouTube Playlist
          </p>
          <p className="text-xs text-content-muted">
            Extracting clip durations, audio streams, and thumbnail canvases…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none animate-in fade-in duration-200 py-4">
      {/* Sleek Minimal URL Input Bar */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center w-full shadow-lg">
          <input
            ref={inputRef}
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=...)"
            className="w-full h-12 pl-5 pr-28 rounded-2xl bg-[#181818] border border-[#2E2E2E] text-sm text-white placeholder-[#666666] focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
          />
          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={!inputUrl.trim() || fetching}
            icon={Play}
            className="absolute right-1.5 h-9 px-4 font-semibold text-xs rounded-xl"
          >
            Analyze
          </Button>
        </div>
      </form>

      {/* Main Feature Showcase Card (Matching Reference Design) */}
      <div className="rounded-3xl border border-[#2E2E2E] bg-[#141414] p-8 sm:p-10 shadow-2xl space-y-8 text-center relative overflow-hidden">
        {/* Title Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            POWER UP YOUR MERGES.
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#888888] uppercase">
            UNLEASH CREATOR PRO PERFORMANCE.
          </p>
        </div>

        {/* 3x2 Visual Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4 max-w-2xl mx-auto pt-2">
          {/* Item 1: Unlimited Merges */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <Files className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide uppercase">
              Unlimited Merges
            </span>
          </div>

          {/* Item 2: 8K Output */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <Maximize2 className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide uppercase">
              8K Output
            </span>
          </div>

          {/* Item 3: Full GPU Acceleration */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <Cpu className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
              Full GPU Acceleration
            </span>
          </div>

          {/* Item 4: Multi-threaded Processing */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <Workflow className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
              Multi-threaded Processing
            </span>
          </div>

          {/* Item 5: Priority Creator Support */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <Headphones className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
              Priority Creator Support
            </span>
          </div>

          {/* Item 6: Automated Chapter Generation */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <BookmarkCheck className="w-10 h-10 text-zinc-300 stroke-[1.5]" />
              <span className="absolute -top-1 -right-4 text-emerald-400">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
              Automated Chapter Generation
            </span>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="pt-2 space-y-3 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* STAY FREE Button */}
            <button
              type="button"
              onClick={handleStayFree}
              className="w-full sm:w-auto min-w-[170px] h-12 px-7 rounded-full bg-[#241718] hover:bg-[#301C1E] border border-[#3E2225] text-xs sm:text-sm font-bold tracking-wider text-[#CCCCCC] hover:text-white uppercase transition-all cursor-pointer"
            >
              Stay Free
            </button>

            {/* GO PRO NOW Button with glowing red accent */}
            <button
              type="button"
              onClick={onUpgradeClick}
              className="w-full sm:w-auto flex-1 h-12 px-8 rounded-full bg-gradient-to-r from-[#D90412] via-[#F00A18] to-[#FF1E27] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_28px_rgba(235,10,24,0.55)] hover:shadow-[0_0_36px_rgba(255,30,40,0.75)] transition-all cursor-pointer"
            >
              GO PRO - $49 LIFETIME (OR $4.99/MO)
            </button>
          </div>

          {/* Guarantee Subtext */}
          <p className="text-xs text-[#777777] font-medium">
            30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
