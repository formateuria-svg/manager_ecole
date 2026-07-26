import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCapIcon, QuoteIcon } from 'lucide-react';

export function AuthShell({
  title,
  subtitle,
  children,
  footer





}: {title: string;subtitle: string;children: React.ReactNode;footer: React.ReactNode;}) {
  return (
    <div className="grid min-h-full w-full bg-canvas grain lg:grid-cols-2">
      {/* left showcase */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r-2 border-ink bg-ink p-12 text-paper lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-paper bg-lime">
            <GraduationCapIcon className="h-5 w-5 text-ink" />
          </span>
          <span className="font-display text-lg font-extrabold">School Manager Cloud</span>
        </Link>

        <div className="relative">
          <div className="absolute -left-6 -top-10 h-40 w-40 rounded-full bg-plum/40 blur-2xl" />
          <div className="absolute right-0 top-20 h-32 w-32 rounded-full bg-lime/20 blur-2xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-xl2 border-2 border-paper/30 bg-paper/5 p-6 backdrop-blur">
            
            <QuoteIcon className="h-8 w-8 text-lime" />
            <p className="mt-3 font-display text-2xl font-bold leading-snug">
              « On a remplacé cinq tableurs par une seule plateforme vivante. La direction respire enfin. »
            </p>
            <p className="mt-4 text-sm text-paper/70">
              Camille Rousseau — Directrice, Campus Lumière
            </p>
          </motion.div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
            { k: '2 400+', v: 'Apprenants' },
            { k: '120', v: 'Établissements' },
            { k: '99,9%', v: 'Disponibilité' }].
            map((s) =>
            <div key={s.v} className="rounded-xl border-2 border-paper/30 bg-paper/5 p-3">
                <p className="font-display text-2xl font-extrabold text-lime">{s.k}</p>
                <p className="text-xs text-paper/70">{s.v}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-paper/50">© {new Date().getFullYear()} School Manager Cloud</p>
      </div>

      {/* right form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md">
          
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-lime shadow-hard-sm">
              <GraduationCapIcon className="h-5 w-5 text-ink" />
            </span>
            <span className="font-display text-lg font-extrabold">School Manager Cloud</span>
          </Link>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-smoke">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-smoke">{footer}</div>
        </motion.div>
      </div>
    </div>);

}