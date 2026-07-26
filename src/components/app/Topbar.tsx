import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuIcon, ChevronDownIcon, LogOutIcon, BellIcon, SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../store/useAuth';
import { useStore } from '../../store/useStore';

const TYPE_LABEL: Record<string, string> = {
  ecole: 'École',
  institut: 'Institut',
  universite: 'Université',
  centre: 'Centre de formation'
};

export function Topbar({ onMenu }: {onMenu: () => void;}) {
  const navigate = useNavigate();
  const user = useAuth((s) => s.currentUser)();
  const logout = useAuth((s) => s.logout);
  const est = useStore((s) => s.establishment);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const name = user?.name ?? est.director;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b-2 border-ink bg-canvas/90 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-lg border-2 border-ink bg-paper p-2 lg:hidden" aria-label="Menu">
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <p className="font-display text-base font-bold leading-none">{est.name}</p>
          <p className="text-xs text-smoke">
            {TYPE_LABEL[est.type]} · {est.city}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-full border-2 border-ink bg-paper p-2 transition-colors hover:bg-lime-soft" aria-label="Notifications">
          <BellIcon className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-coral" />
        </button>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper py-1 pl-1 pr-2.5 transition-shadow hover:shadow-hard-sm">
            
            <Avatar name={name} color="#5B3FA8" size="sm" />
            <span className="hidden text-sm font-semibold sm:inline">{name}</span>
            <ChevronDownIcon className="h-4 w-4 text-smoke" />
          </button>

          <AnimatePresence>
            {open &&
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl2 border-2 border-ink bg-paper shadow-hard">
              
                <div className="border-b-2 border-ink bg-canvas px-4 py-3">
                  <p className="text-sm font-bold">{name}</p>
                  <p className="truncate text-xs text-smoke">{user?.email ?? est.email}</p>
                </div>
                <button
                onClick={() => {
                  setOpen(false);
                  navigate('/app/parametres');
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-lime-soft">
                
                  <SettingsIcon className="h-4 w-4" /> Paramètres
                </button>
                <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-sm font-medium text-coral hover:bg-coral-soft">
                
                  <LogOutIcon className="h-4 w-4" /> Se déconnecter
                </button>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </header>);

}