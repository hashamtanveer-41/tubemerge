import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'red' | 'white' | 'muted';
}

export function Spinner({ size = 'md', variant = 'red', className, ...props }: SpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const colorClasses = {
    red: 'text-[#FF0000]',
    white: 'text-white',
    muted: 'text-[#AAAAAA]',
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], colorClasses[variant], className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
