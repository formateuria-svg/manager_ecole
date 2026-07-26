import React from 'react';
import { classNames } from '../../utils/format';

type Tone = 'lime' | 'plum' | 'coral' | 'teal' | 'gold' | 'ink' | 'smoke';

const TONES: Record<Tone, string> = {
  lime: 'bg-lime-soft text-lime-dark border-lime-dark',
  plum: 'bg-plum-soft text-plum border-plum',
  coral: 'bg-coral-soft text-coral border-coral',
  teal: 'bg-teal-soft text-teal border-teal',
  gold: 'bg-gold-soft text-[#9a6f00] border-gold',
  ink: 'bg-ink text-paper border-ink',
  smoke: 'bg-line text-smoke border-[#cfc9bb]'
};

export function Badge({
  children,
  tone = 'smoke',
  className




}: {children: React.ReactNode;tone?: Tone;className?: string;}) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        TONES[tone],
        className
      )}>
      
      {children}
    </span>);

}