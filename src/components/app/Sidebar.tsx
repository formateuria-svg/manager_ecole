import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  UsersIcon,
  GraduationCapIcon,
  UserPlusIcon,
  CreditCardIcon,
  BookOpenCheckIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  SettingsIcon,
  XIcon } from
'lucide-react';
import { classNames } from '../../utils/format';

const nav = [
{ to: '/app', label: 'Tableau de bord', icon: LayoutDashboardIcon, end: true },
{ to: '/app/inscriptions', label: 'Inscriptions', icon: UserPlusIcon },
{ to: '/app/apprenants', label: 'Apprenants', icon: GraduationCapIcon },
{ to: '/app/enseignants', label: 'Enseignants', icon: UsersIcon },
{ to: '/app/paiements', label: 'Paiements', icon: CreditCardIcon },
{ to: '/app/notes', label: 'Notes', icon: BookOpenCheckIcon },
{ to: '/app/emploi-du-temps', label: 'Emploi du temps', icon: CalendarDaysIcon },
{ to: '/app/absences', label: 'Absences', icon: ClipboardCheckIcon },
{ to: '/app/parametres', label: 'Paramètres & documents', icon: SettingsIcon }];


export function Sidebar({ open, onClose }: {open: boolean;onClose: () => void;}) {
  return (
    <>
      {open &&
      <div className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      }
      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r-2 border-ink bg-paper transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
        
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-lime shadow-hard-sm">
              <GraduationCapIcon className="h-5 w-5 text-ink" />
            </span>
            <span className="font-display text-base font-extrabold leading-none">
              School Manager
              <span className="block text-xs font-bold text-plum">Cloud</span>
            </span>
          </Link>
          <button onClick={onClose} className="rounded-lg border-2 border-ink p-1.5 lg:hidden" aria-label="Fermer">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
            classNames(
              'group flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all',
              isActive ?
              'border-ink bg-lime text-ink shadow-hard-sm' :
              'border-transparent text-smoke hover:border-line hover:bg-canvas hover:text-ink'
            )
            }>
            
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </NavLink>
          )}
        </nav>

        <div className="border-t-2 border-ink p-4">
          <div className="rounded-xl2 border-2 border-ink bg-plum p-4 text-paper">
            <p className="font-display text-sm font-bold">Essai gratuit</p>
            <p className="mt-0.5 text-xs text-paper/80">11 jours restants sur votre période d'essai.</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper/30">
              <div className="h-full w-[78%] rounded-full bg-lime" />
            </div>
          </div>
        </div>
      </aside>
    </>);

}