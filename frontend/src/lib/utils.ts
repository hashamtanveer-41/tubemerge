import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats raw bytes into human-readable string (e.g. 850 MB, 1.4 GB).
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 MB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(0)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

/**
 * Accurately estimates download size based on video duration and resolution.
 * YouTube standard average stream bitrates (Video + AAC audio):
 * - 1080p: ~3.0 Mbps (~375 KB/s ≈ 22.5 MB/min ≈ 1.35 GB/hr)
 * - 720p:  ~1.8 Mbps (~225 KB/s ≈ 13.5 MB/min ≈ 810 MB/hr)
 * - 480p:  ~1.0 Mbps (~125 KB/s ≈ 7.5 MB/min)
 * - 4K/2160p: ~6.5 Mbps (~812 KB/s)
 */
export function estimateVideoSizeBytes(durationSeconds: number, resolutionLabel: string = '1080p'): number {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  const label = (resolutionLabel || '').toLowerCase();
  let bytesPerSec = 375 * 1024;
  if (label.includes('720')) {
    bytesPerSec = 225 * 1024;
  } else if (label.includes('480') || label.includes('360')) {
    bytesPerSec = 125 * 1024;
  } else if (label.includes('4k') || label.includes('2160') || label.includes('1440')) {
    bytesPerSec = 812 * 1024;
  }
  return durationSeconds * bytesPerSec;
}
