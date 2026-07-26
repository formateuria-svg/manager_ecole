import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCapIcon, MenuIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';

const links = [
{ href: '#modules', label: 'Modules' },
{ href: '#pourquoi', label: 'Pourquoi' },
{ href: '#etablissements', label: 'Établissements' },
{ href: '#tarifs', label: 'Tarifs' }];


export function PublicNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-lime shadow-hard-sm">
            <GraduationCapIcon className="h-5 w-5 text-ink" />
          </span>
          <span className="font-display text-lg font-extrabold leading-none">
            School Manager<span className="text-plum"> Cloud</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) =>
          <a key={l.href} href={l.href} className="text-sm font-semibold text-ink/80 transition-colors hover:text-plum">
              {l.label}
            </a>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Essai gratuit</Button>
          </Link>
        </div>

        <button
          className="rounded-lg border-2 border-ink bg-paper p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu">
          
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open &&
      <div className="border-t-2 border-ink bg-paper px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((l) =>
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-ink">
            
                {l.label}
              </a>
          )}
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Essai gratuit
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      }
    </header>);

}