import React from 'react';
import { Playlist } from '@/types';
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
}

export function DiscoveryView({
  playlist,
  selectedIndices,
  onToggle,
  onSelectAll,
  onDeselectAll,
  mergeVideos = true,
  onToggleMergeVideos,
}: DiscoveryViewProps) {
  const isSingleVideo = selectedIndices.size <= 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      <PlaylistCard
        playlist={playlist}
        selectedCount={selectedIndices.size}
        totalCount={playlist.entries.length}
        selectedIndices={selectedIndices}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />

      {/* Download Mode Option — Solid background, uses identical Checkbox component, adapts to single vs multiple videos */}
      {onToggleMergeVideos && (
        <div className="p-4 rounded-2xl border border-stroke-card bg-[#161616] flex items-center justify-between gap-4">
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
        </div>
      )}

      <VideoTable
        videos={playlist.entries}
        selectedIndices={selectedIndices}
        onToggle={onToggle}
      />
    </div>
  );
}
