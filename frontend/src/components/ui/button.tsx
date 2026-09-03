import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-red text-white hover:bg-brand-redHover shadow-sm',
        secondary: 'bg-theme-elevated text-content-primary hover:bg-theme-hover border border-stroke-subtle',
        outline: 'border border-stroke-light bg-transparent text-content-secondary hover:text-content-primary hover:bg-theme-elevated',
        ghost: 'hover:bg-theme-elevated text-content-secondary hover:text-content-primary',
        destructive: 'bg-red-900/80 text-red-100 hover:bg-red-900 border border-red-700',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-8 text-base font-semibold',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ElementType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, icon: Icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current shrink-0" />
        ) : Icon ? (
          <Icon className="mr-2 h-4 w-4 shrink-0" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
