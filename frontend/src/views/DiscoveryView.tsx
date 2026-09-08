import React from 'react';
import { Playlist, VideoQuality } from '@/types';
import { ChevronDown } from 'lucide-react';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { VideoTable } from '@/components/playlist/VideoTable';
import { Checkbox } from '@/components/ui/checkbox';

interface DiscoveryViewProps {
  playlist: Playlist;
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  mergeVideos?: boolean;
  onToggleMergeVideos?: (checked: boolean) => void;
  quality?: VideoQuality;
  onQualityChange?: (quality: VideoQuality) => void;
}

export function DiscoveryView({
  playlist,
  selectedIndices,
  onToggle,
  onSelectAll,
  onDeselectAll,
  mergeVideos = true,
  onToggleMergeVideos,
  quality = '1080p',
  onQualityChange,
}: DiscoveryViewProps) {
  const isSingleVideo = selectedIndices.size <= 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      <PlaylistCard
        playlist={playlist}
        selectedCount={selectedIndices.size}
        totalCount={playlist.entries.length}
        selectedIndices={selectedIndices}
        quality={quality}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />

      {/* Download Mode & Resolution Quality Selector */}
      <div className="p-4 rounded-2xl border border-stroke-card bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {onToggleMergeVideos && (
          <div
            onClick={() => {
              if (!isSingleVideo) onToggleMergeVideos(!mergeVideos);
            }}
            className={`flex items-center gap-3.5 select-none ${
              isSingleVideo ? 'opacity-70 cursor-default' : 'cursor-pointer group flex-1'
            }`}
          >
            <Checkbox
              checked={isSingleVideo ? false : mergeVideos}
              onCheckedChange={(val) => {
                if (!isSingleVideo) onToggleMergeVideos(val);
              }}
              disabled={isSingleVideo}
            />
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-content-primary group-hover:text-white transition-colors block">
                {isSingleVideo ? 'Direct video download' : 'Merge into single video'}
              </span>
              <p className="text-xs text-content-muted">
                {isSingleVideo
                  ? 'Only 1 video selected — will be downloaded directly to ~/Downloads without re-encoding'
                  : mergeVideos
                  ? 'Stitches all selected clips into a single continuous video with chapter markers'
                  : 'Downloads each video separately into a dedicated playlist folder in ~/Downloads'}
              </p>
            </div>
          </div>
        )}

        {/* Quality Selector */}
        {onQualityChange && (
          <div className="flex items-center gap-2.5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#262626] w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-semibold text-content-secondary">Quality:</span>
            <div className="relative">
              <select
                value={quality}
                onChange={(e) => onQualityChange(e.target.value as VideoQuality)}
                className="bg-[#202020] hover:bg-[#252525] border border-stroke-light hover:border-[#444] text-white text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-brand-red cursor-pointer transition-colors appearance-none shadow-sm"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD</option>
                <option value="4k">4K Ultra HD</option>
                <option value="480p">480p SD</option>
                <option value="360p">360p Low</option>
                <option value="auto">Auto (Best Match)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-content-secondary pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      <VideoTable
        videos={playlist.entries}
        selectedIndices={selectedIndices}
        onToggle={onToggle}
        quality={quality}
      />
    </div>
  );
}
