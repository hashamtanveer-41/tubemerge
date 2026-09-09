import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { quitApp } from '@/services/api';

interface NoInternetModalProps {
  onRetry: () => Promise<boolean>;
}

export function NoInternetModal({ onRetry }: NoInternetModalProps) {
  const [retrying, setRetrying] = useState(false);
  const [dotCount, setDotCount] = useState(0);

  // Animated dots while retrying
  useEffect(() => {
    if (!retrying) return;
    const id = setInterval(() => setDotCount((c) => (c + 1) % 4), 380);
    return () => clearInterval(id);
  }, [retrying]);

  // Block keyboard Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') e.preventDefault();
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, []);

  const handleRetry = useCallback(async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }, [retrying, onRetry]);

  const handleExit = useCallback(async () => {
    await quitApp();
    window.close();
  }, []);

  const dots = '.'.repeat(dotCount);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center px-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="no-internet-title"
      aria-describedby="no-internet-desc"
    >
      <div className="w-full max-w-[420px] flex flex-col items-center text-center gap-8">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
            <WifiOff className="w-9 h-9 text-[#666666]" strokeWidth={1.5} />
          </div>
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF3B30] border-2 border-[#0A0A0A] flex items-center justify-center"
            aria-hidden="true"
          >
            <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </span>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1
            id="no-internet-title"
            className="text-[22px] font-bold text-white tracking-tight"
          >
            Unable to Connect
          </h1>
          <p
            id="no-internet-desc"
            className="text-[14px] text-[#666666] leading-relaxed max-w-[340px]"
          >
            TubeMerger requires an internet connection to download videos.
            Please check your connection and try again.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full h-11 rounded-xl bg-white text-black text-[14px] font-semibold flex items-center justify-center gap-2.5 hover:bg-[#E5E5E5] active:bg-[#CCCCCC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {retrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting{dots}</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </>
            )}
          </button>

          <button
            onClick={handleExit}
            disabled={retrying}
            className="w-full h-11 rounded-xl bg-transparent border border-[#2A2A2A] text-[#666666] text-[14px] font-medium hover:bg-[#141414] hover:text-[#999999] hover:border-[#333333] active:bg-[#1A1A1A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Exit TubeMerger
          </button>
        </div>

        {/* Status hint */}
        <p className="text-[11px] text-[#333333] -mt-3">
          Press Try Again after checking your Wi-Fi or Ethernet connection.
        </p>
      </div>
    </div>
  );
}
