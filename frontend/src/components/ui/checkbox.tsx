import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange, className, disabled, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border border-[#444444] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
        checked ? 'bg-[#FF0000] border-[#FF0000] text-white' : 'bg-[#181818] hover:border-[#666666]',
        className
      )}
      {...props as any}
    >
      {checked && <Check className="h-3 w-3 stroke-[3]" />}
    </button>
  );
}
