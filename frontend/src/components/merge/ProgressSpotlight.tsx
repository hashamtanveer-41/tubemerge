import React from 'react';
import { ProgressEvent, VideoClip } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, Circle, PlayCircle, XCircle } from 'lucide-react';

interface ProgressSpotlightProps {
  progress: ProgressEvent;
  selectedClips: VideoClip[];
  onCancel: () => void;
}

export function ProgressSpotlight({ progress, selectedClips, onCancel }: ProgressSpotlightProps) {
  const currentIdx = progress.current_item || 1;
  const currentClip = selectedClips[currentIdx - 1];

  return (
    <Card className="p-6 space-y-6 border-stroke-card bg-theme-surface select-none shadow-2xl max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Spinner size="md" variant="red" />
          <div>
            <h2 className="text-base font-semibold text-content-primary leading-tight">
              Merge in Progress
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Encoding your selected clips into a single continuous video with chapters.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          icon={XCircle}
          className="text-xs border-stroke-light hover:text-red-400 hover:border-red-900"
        >
          Cancel
        </Button>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-content-secondary font-medium">Overall Progress</span>
          <span className="text-content-primary font-semibold text-sm">
            {progress.overall_percent}%
          </span>
        </div>
        <Progress value={progress.overall_percent} className="h-2" />
      </div>

      {/* Active Clip Spotlight Card */}
      <div className="rounded-xl border border-stroke-light bg-theme-elevated p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-20 h-12 rounded-lg bg-theme-card overflow-hidden shrink-0 border border-stroke-hover relative flex items-center justify-center">
            {currentClip?.thumbnail_url ? (
              <img
                src={currentClip.thumbnail_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <PlayCircle className="w-6 h-6 text-content-dim" />
            )}
            <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Spinner size="xs" variant="white" />
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <span className="text-xs text-content-muted font-medium">
              Clip {progress.current_item || 1} of {progress.total_items || selectedClips.length}
            </span>
            <p className="text-sm font-medium text-content-primary truncate max-w-lg">
              {progress.current_video_title || currentClip?.title || 'Preparing next segment…'}
            </p>
          </div>
        </div>

        <span className="text-xs text-content-dim shrink-0 font-medium">
          30 FPS · CFR · AAC
        </span>
      </div>

      {/* Live Clip Checklist */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-content-dim">
          Clip Queue
        </h4>
        <div className="rounded-xl border border-stroke-subtle bg-theme-input divide-y divide-stroke-subtle max-h-56 overflow-y-auto">
          {selectedClips.map((clip, idx) => {
            const clipNum = idx + 1;
            const isDone = clipNum < currentIdx || progress.status === 'done';
            const isActive = clipNum === currentIdx && progress.status !== 'done';
            const isError = progress.status === 'error' && clipNum === currentIdx;

            return (
              <div
                key={clip.id || idx}
                className="flex items-center justify-between p-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-content-dim text-[11px] font-medium w-4 text-center">
                    {String(clipNum).padStart(2, '0')}
                  </span>
                  <span
                    className={`truncate font-medium ${
                      isActive ? 'text-content-primary font-semibold' : isDone ? 'text-content-secondary' : 'text-content-muted'
                    }`}
                  >
                    {clip.title}
                  </span>
                </div>

                {/* Right: Duration + Status Icon */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-content-muted text-xs">{clip.duration_formatted}</span>
                  <div
                    className="w-5 h-5 flex items-center justify-center"
                    title={isDone ? 'Completed' : isActive ? 'Active' : isError ? 'Failed' : 'Pending'}
                  >
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
                    )}
                    {isActive && (
                      <Spinner size="xs" variant="red" />
                    )}
                    {isError && (
                      <XCircle className="w-4 h-4 text-brand-red stroke-[2.2]" />
                    )}
                    {!isDone && !isActive && !isError && (
                      <Circle className="w-3.5 h-3.5 text-content-dim stroke-[1.5]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
