import React from 'react';
import { VideoClip } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Youtube } from 'lucide-react';
import { VIDEO_CARD_GRADIENTS } from '@/data/gradients';

interface VideoTableProps {
  videos: VideoClip[];
  selectedIndices: Set<number>;
  onToggle: (index: number) => void;
}

export function VideoTable({ videos, selectedIndices, onToggle }: VideoTableProps) {
  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-red">
            Merge Your Playlists
          </h3>
          <p className="text-xs text-content-muted">
            Select the video clips you want to include in the merged output.
          </p>
        </div>
        <span className="text-xs font-medium text-content-dim">
          {selectedIndices.size} / {videos.length} selected
        </span>
      </div>

      <div className="rounded-2xl border border-stroke-card bg-theme-surface divide-y divide-stroke-subtle overflow-hidden shadow-lg">
        {videos.map((video, idx) => {
          const isSelected = selectedIndices.has(idx);
          const gradient = VIDEO_CARD_GRADIENTS[idx % VIDEO_CARD_GRADIENTS.length];
          const thumbUrl = video.thumbnail_url || video.thumbnail || '';

          return (
            <div
              key={video.id || idx}
              onClick={() => onToggle(idx)}
              className="flex items-center gap-3.5 p-3.5 hover:bg-theme-hover transition-colors cursor-pointer group"
            >
              {/* Checkbox */}
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(idx)}
                />
              </div>

              {/* Thumbnail with Resolution Badge */}
              <div
                className="w-16 h-10 rounded-lg flex items-center justify-center text-[10px] shrink-0 relative overflow-hidden border border-stroke-light"
                style={{ background: gradient }}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-full h-full object-cover absolute inset-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <Badge variant="overlay" className="relative z-10 text-[9px] font-semibold tracking-wide">
                  {video.resolution_label || '1080p'}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-content-primary font-medium truncate leading-tight group-hover:text-red-100 transition-colors">
                  {video.title}
                </p>
                <p className="text-xs mt-0.5 text-content-secondary">
                  {video.duration_formatted} &nbsp;·&nbsp; AAC 192kbps
                </p>
              </div>

              {/* Right: Index & YouTube red icon */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-content-dim">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <Youtube className="w-4 h-4 text-brand-red opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
