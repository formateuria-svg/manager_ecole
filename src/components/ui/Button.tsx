import React from 'react';
import { classNames } from '../../utils/format';

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const VARIANTS: Record<Variant, string> = {
  primary:
  'bg-lime text-ink border-ink shadow-hard-sm hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none',
  dark:
  'bg-ink text-paper border-ink shadow-hard-sm hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none',
  outline: 'bg-paper text-ink border-ink hover:bg-canvas',
  ghost: 'bg-transparent text-ink border-transparent hover:bg-line/60',
  danger: 'bg-coral text-ink border-ink shadow-hard-sm hover:shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none'
};

const SIZES: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2'
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}>
      
      {children}
    </button>);

}