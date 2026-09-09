import React, { useState } from 'react';
import { ArrowUpCircle, X } from 'lucide-react';
import { UpdateInfo } from '@/types';

interface UpdateBannerProps {
  updateInfo: UpdateInfo;
}

export function UpdateBanner({ updateInfo }: UpdateBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDownload = () => {
    window.open(updateInfo.website_download_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="status"
      className="flex items-center gap-3 px-4 py-2.5 bg-[#111111] border-b border-[#1E1E1E] text-[13px] shrink-0 select-none"
    >
      <ArrowUpCircle className="w-4 h-4 text-[#FF3B30] shrink-0" strokeWidth={2} />

      <p className="flex-1 text-[#AAAAAA]">
        <span className="text-white font-medium">
          TubeMerger v{updateInfo.latest_version}
        </span>{' '}
        is available.{' '}
        <button
          onClick={handleDownload}
          className="text-[#FF3B30] hover:text-[#FF5A52] underline underline-offset-2 cursor-pointer transition-colors"
        >
          Download update →
        </button>
      </p>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss update notification"
        className="shrink-0 p-1 rounded text-[#555555] hover:text-[#AAAAAA] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
