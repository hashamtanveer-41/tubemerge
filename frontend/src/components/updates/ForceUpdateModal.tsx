import React, { useEffect, useCallback } from 'react';
import { ShieldAlert, Download, X as ExitIcon } from 'lucide-react';
import { UpdateInfo } from '@/types';
import { quitApp } from '@/services/api';

interface ForceUpdateModalProps {
  updateInfo: UpdateInfo;
}

export function ForceUpdateModal({ updateInfo }: ForceUpdateModalProps) {
  // Block keyboard Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, []);

  const handleDownload = useCallback(() => {
    // Open native OS download first, then the download page as fallback
    if (updateInfo.download_url) {
      const a = document.createElement('a');
      a.href = updateInfo.download_url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Also open the download page for visibility
    window.open(updateInfo.website_download_url, '_blank', 'noopener,noreferrer');
  }, [updateInfo]);

  const handleExit = useCallback(async () => {
    await quitApp();
    window.close();
  }, []);

  // Format published date
  const releaseDateStr = updateInfo.published_at
    ? new Date(updateInfo.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    // Solid dark backdrop — no glassmorphism
    <div
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center px-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="force-update-title"
      aria-describedby="force-update-desc"
      // Intentionally NOT stopping backdrop click — there's nothing behind to click
    >
      <div className="w-full max-w-[460px] flex flex-col gap-7">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5">
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#1C0A0A] border border-[#FF3B30]/30 flex items-center justify-center">
              <ShieldAlert
                className="w-10 h-10 text-[#FF3B30]"
                strokeWidth={1.5}
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(255,59,48,0.5))',
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h1
              id="force-update-title"
              className="text-[22px] font-bold text-white tracking-tight"
            >
              Major Update Required
            </h1>
            <p
              id="force-update-desc"
              className="text-[14px] text-[#666666] leading-relaxed"
            >
              A major update is required to maintain YouTube pipeline
              compatibility and security. You must update before continuing.
            </p>
          </div>
        </div>

        {/* Version comparison pill */}
        <div className="flex items-center justify-center gap-3 bg-[#141414] border border-[#222222] rounded-xl px-5 py-3.5">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#555555]">
              Installed
            </span>
            <span className="text-[15px] font-mono font-semibold text-[#666666] line-through decoration-[#FF3B30]/60">
              v{updateInfo.current_version}
            </span>
          </div>

          <div className="flex-1 flex items-center gap-1.5 justify-center">
            <div className="flex-1 h-px bg-[#222222]" />
            <div className="w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.6)]" />
            <div className="flex-1 h-px bg-[#222222]" />
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#FF3B30]">
              Required
            </span>
            <span className="text-[15px] font-mono font-semibold text-white">
              v{updateInfo.latest_version}
            </span>
          </div>
        </div>

        {/* Release name + date */}
        {(updateInfo.release_name || releaseDateStr) && (
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl px-4 py-3 space-y-1">
            {updateInfo.release_name && (
              <p className="text-[13px] font-semibold text-[#CCCCCC]">
                {updateInfo.release_name}
              </p>
            )}
            {releaseDateStr && (
              <p className="text-[12px] text-[#555555]">
                Released {releaseDateStr}
              </p>
            )}
            {updateInfo.release_notes && (
              <p className="text-[12px] text-[#555555] pt-1 line-clamp-3">
                {updateInfo.release_notes
                  .replace(/#{1,6}\s/g, '')
                  .substring(0, 200)}
                {updateInfo.release_notes.length > 200 && '…'}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            className="w-full h-12 rounded-xl bg-[#FF3B30] hover:bg-[#E02D22] active:bg-[#C2251D] text-white text-[14px] font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-[0_4px_20px_rgba(255,59,48,0.3)]"
          >
            <Download className="w-4.5 h-4.5" strokeWidth={2.2} />
            Download Update Now
          </button>

          <button
            onClick={handleExit}
            className="w-full h-11 rounded-xl bg-transparent border border-[#222222] text-[#555555] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#141414] hover:text-[#888888] hover:border-[#2A2A2A] active:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <ExitIcon className="w-3.5 h-3.5" />
            Exit TubeMerger
          </button>
        </div>

        <p className="text-center text-[11px] text-[#2D2D2D]">
          TubeMerger v{updateInfo.current_version} · Update to continue
        </p>
      </div>
    </div>
  );
}
