import React from 'react';
import { motion } from 'framer-motion';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions





}: {eyebrow: string;title: string;description?: string;actions?: React.ReactNode;}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      
      <div>
        <span className="mb-2 inline-block rounded-full border-2 border-ink bg-lime px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
          {eyebrow}
        </span>
        <h1 className="font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-xl text-sm text-smoke">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.header>);

}