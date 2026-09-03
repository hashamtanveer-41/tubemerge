import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium font-sans transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-theme-elevated text-content-primary border border-stroke-card',
        red: 'bg-red-950/50 text-red-400 border border-red-900/50',
        green: 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50',
        amber: 'bg-amber-950/50 text-amber-400 border border-amber-900/50',
        overlay: 'bg-black/80 text-white/90 backdrop-blur-xs text-[10px] px-1.5 py-0.5 rounded font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
