import React from 'react';
import { initials } from '../../utils/format';

export function Avatar({
  name,
  color,
  size = 'md'




}: {name: string;color: string;size?: 'sm' | 'md' | 'lg';}) {
  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm';
  return (
    <span
      className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-full border-2 border-ink font-display font-bold text-paper`}
      style={{ backgroundColor: color }}
      aria-hidden>
      
      {initials(name)}
    </span>);

}