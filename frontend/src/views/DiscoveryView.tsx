import React from 'react';
import { Playlist } from '@/types';
import { PlaylistCard } from '@/components/playlist/PlaylistCard';
import { VideoTable } from '@/components/playlist/VideoTable';

interface DiscoveryViewProps {
  playlist: Playlist;
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function DiscoveryView({
  playlist,
  selectedIndices,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: DiscoveryViewProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      <PlaylistCard
        playlist={playlist}
        selectedCount={selectedIndices.size}
        totalCount={playlist.entries.length}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      <VideoTable
        videos={playlist.entries}
        selectedIndices={selectedIndices}
        onToggle={onToggle}
      />
    </div>
  );
}
