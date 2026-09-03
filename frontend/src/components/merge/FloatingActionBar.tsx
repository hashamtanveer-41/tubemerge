import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface FloatingActionBarProps {
  selectedCount: number;
  onMerge: () => void;
  onClear: () => void;
  loading: boolean;
}

export function FloatingActionBar({
  selectedCount,
  onMerge,
  onClear,
  loading,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="bg-theme-elevated/95 backdrop-blur-md border border-stroke-hover shadow-2xl rounded-full p-2 pl-2.5 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
        <Button
          size="lg"
          variant="default"
          onClick={onMerge}
          loading={loading}
          icon={Play}
          className="whitespace-nowrap shadow-lg shadow-red-950/30 px-7 font-semibold h-12 text-sm md:text-base"
        >
          Merge Selected ({selectedCount} {selectedCount === 1 ? 'Video' : 'Videos'})
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={loading}
          icon={RotateCcw}
          className="text-sm text-content-secondary hover:text-content-primary whitespace-nowrap px-4 h-10 rounded-full mr-1 font-medium"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
