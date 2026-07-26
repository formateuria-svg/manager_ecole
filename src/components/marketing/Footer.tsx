import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCapIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-paper bg-lime">
                <GraduationCapIcon className="h-5 w-5 text-ink" />
              </span>
              <span className="font-display text-lg font-extrabold">School Manager Cloud</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-paper/70">
              La plateforme de gestion pour écoles, instituts, universités et centres de formation.
            </p>
          </div>
          <FooterCol
            title="Produit"
            items={['Modules', 'Emplois du temps', 'Paiements', 'Notes & bulletins']} />
          
          <FooterCol title="Établissements" items={['Écoles', 'Instituts', 'Universités', 'Centres de formation']} />
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-lime">Commencer</h4>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>
                <Link to="/register" className="hover:text-lime">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-lime">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/app" className="hover:text-lime">
                  Accéder au tableau de bord
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-paper/20 pt-6 text-xs text-paper/60 sm:flex-row">
          <span>© {new Date().getFullYear()} School Manager Cloud — Tous droits réservés.</span>
          <span className="font-mono">Conçu pour les directions d'établissement.</span>
        </div>
      </div>
    </footer>);

}

function FooterCol({ title, items }: {title: string;items: string[];}) {
  return (
    <div>
      <h4 className="font-display text-sm font-bold uppercase tracking-wide text-lime">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-paper/80">
        {items.map((i) =>
        <li key={i}>
            <a href="#modules" className="hover:text-lime">
              {i}
            </a>
          </li>
        )}
      </ul>
    </div>);

}