import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, FolderDown } from 'lucide-react';

interface FloatingActionBarProps {
  selectedCount: number;
  onMerge: () => void;
  onClear: () => void;
  loading: boolean;
  mergeVideos?: boolean;
  onToggleMergeVideos?: (val: boolean) => void;
}

export function FloatingActionBar({
  selectedCount,
  onMerge,
  onClear,
  loading,
  mergeVideos = true,
  onToggleMergeVideos,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 select-none max-w-[95vw]">
      <div className="bg-theme-elevated/95 backdrop-blur-md border border-stroke-hover shadow-2xl rounded-2xl md:rounded-full p-2 md:p-2.5 px-3 md:px-4 flex flex-col md:flex-row items-center gap-2.5 md:gap-4 transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
        
        {/* Toggle Option: Merge into single video (Default: ON) vs Individual videos */}
        {onToggleMergeVideos && (
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-content-secondary hover:text-content-primary transition-colors px-1 py-1 select-none group">
            <input
              type="checkbox"
              checked={mergeVideos}
              onChange={(e) => onToggleMergeVideos(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-stroke-hover bg-theme-panel text-red-600 focus:ring-red-500/20 focus:ring-offset-0 cursor-pointer accent-red-600"
            />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span>Merge into single video</span>
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border transition-colors ${
                mergeVideos
                  ? 'bg-red-950/40 border-red-800/60 text-red-400 font-semibold'
                  : 'bg-theme-card border-stroke-light text-content-dim'
              }`}>
                {mergeVideos ? 'Single File' : 'Folder in Downloads'}
              </span>
            </span>
          </label>
        )}

        <div className="h-5 w-px bg-stroke-light hidden md:block" />

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            size="lg"
            variant="default"
            onClick={onMerge}
            loading={loading}
            icon={mergeVideos ? Play : FolderDown}
            className="whitespace-nowrap shadow-lg shadow-red-950/30 px-6 font-semibold h-11 text-sm md:text-base flex-1 md:flex-initial"
          >
            {mergeVideos
              ? `Merge Selected (${selectedCount} ${selectedCount === 1 ? 'Video' : 'Videos'})`
              : `Download Separately (${selectedCount} ${selectedCount === 1 ? 'Video' : 'Videos'})`}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={loading}
            icon={RotateCcw}
            className="text-xs text-content-secondary hover:text-content-primary whitespace-nowrap px-3 h-10 rounded-full font-medium"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
