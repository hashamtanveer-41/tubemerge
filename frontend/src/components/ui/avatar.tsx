import React from 'react';
import { cn } from '@/lib/utils';
import { CircleUserRound } from 'lucide-react';

interface AvatarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, size = 'md', className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      type="button"
      aria-label="User Account"
      className={cn(
        'relative rounded-full border border-stroke-light bg-gradient-to-b from-[#282828] to-[#161616] flex items-center justify-center text-content-secondary hover:text-content-primary hover:border-brand-red active:scale-95 transition-all duration-150 cursor-pointer shadow-sm overflow-hidden select-none shrink-0',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt="User" className="w-full h-full object-cover" />
      ) : (
        <CircleUserRound
          className={cn(
            iconSizes[size],
            'stroke-[1.6] text-content-secondary hover:text-white transition-colors'
          )}
        />
      )}
    </button>
  );
}
