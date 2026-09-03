import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
}

export function Progress({ value, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-[#282828]', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full w-full flex-1 transition-all duration-300 ease-out rounded-full"
        style={{
          background: 'linear-gradient(90deg, #CC0000 0%, #FF0000 100%)',
          transform: `translateX(-${100 - clamped}%)`,
        }}
      />
    </div>
  );
}
