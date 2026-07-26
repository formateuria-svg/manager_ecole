import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  UserPlusIcon,
  CreditCardIcon,
  GraduationCapIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClipboardCheckIcon,
  SparklesIcon,
  FileDownIcon,
  ShieldCheckIcon,
  BuildingIcon,
  SchoolIcon,
  LibraryIcon,
  BriefcaseIcon } from
'lucide-react';
import { PublicNav } from '../components/marketing/PublicNav';
import { Footer } from '../components/marketing/Footer';
import { Button } from '../components/ui/Button';

const modules = [
{ icon: UserPlusIcon, title: 'Inscriptions', text: 'Dossiers, pièces jointes et statuts de candidature centralisés.', tone: '#5B3FA8' },
{ icon: CreditCardIcon, title: 'Paiements & retards', text: 'Échéanciers, relances, reçus générés et suivi des impayés.', tone: '#FF6B4A' },
{ icon: GraduationCapIcon, title: 'Notes apprenant', text: 'Évaluations, coefficients et moyennes calculées en direct.', tone: '#1F9E8F' },
{ icon: CalendarDaysIcon, title: 'Emplois du temps', text: 'Calendrier dynamique apprenants et enseignants, sans conflit.', tone: '#F5B301' },
{ icon: UsersIcon, title: 'Enseignants', text: 'Fiches, matières, volumes horaires et statuts en un clic.', tone: '#8CC000' },
{ icon: ClipboardCheckIcon, title: 'Absences', text: 'Suivi des absences et retards, justifications et exports.', tone: '#5B3FA8' }];


const audiences = [
{ icon: SchoolIcon, label: 'Écoles' },
{ icon: LibraryIcon, label: 'Instituts' },
{ icon: BuildingIcon, label: 'Universités' },
{ icon: BriefcaseIcon, label: 'Centres de formation' }];


const perks = [
{ icon: SparklesIcon, title: 'Tout est modifiable', text: 'Créez, ajoutez et modifiez chaque donnée dans chaque module. Rien n\'est figé.' },
{ icon: FileDownIcon, title: 'Export à tout moment', text: 'Exportez vos données réelles en CSV ou JSON depuis n\'importe quelle vue.' },
{ icon: ShieldCheckIcon, title: 'Documents configurables', text: 'Reçus, certificats et bulletins : aperçu et personnalisation en temps réel.' }];


export function Home() {
  return (
    <div className="min-h-full w-full bg-canvas grain">
      <PublicNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-hard-sm">
              
              <span className="h-2 w-2 rounded-full bg-lime" /> Plateforme de gestion scolaire
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              
              Pilotez toute votre{' '}
              <span className="relative inline-block">
                <span className="relative z-10">école</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-lime" />
              </span>{' '}
              depuis un seul endroit.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-lg text-lg text-smoke">
              
              Inscriptions, paiements, notes, emplois du temps, enseignants et absences.
              Un outil conçu pour les directions d'établissement — vivant, complet et exportable.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3">
              
              <Link to="/register">
                <Button size="md" className="text-base">
                  Démarrer l'essai gratuit <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="outline" size="md" className="text-base">
                  Voir la démo
                </Button>
              </Link>
            </motion.div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-smoke">
              <span>Aucune carte requise</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>Données exportables</span>
              <span className="h-1 w-1 rounded-full bg-smoke" />
              <span>Prêt en 2 minutes</span>
            </div>
          </div>

          {/* Offbeat stacked preview */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, rotate: -6, y: 30 }}
                animate={{ opacity: 1, rotate: -4, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 16 }}
                className="absolute -left-2 top-6 w-40 rounded-xl2 border-2 border-ink bg-plum p-4 text-paper shadow-hard">
                
                <CreditCardIcon className="h-6 w-6" />
                <p className="mt-3 font-display text-2xl font-extrabold">128 400 €</p>
                <p className="text-xs text-paper/80">Encaissé ce trimestre</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 5, y: 40 }}
                animate={{ opacity: 1, rotate: 3, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 16 }}
                className="ml-auto w-72 rounded-xl2 border-2 border-ink bg-paper p-5 shadow-hard-lg">
                
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-bold">Emploi du temps</span>
                  <CalendarDaysIcon className="h-4 w-4 text-plum" />
                </div>
                <div className="space-y-2">
                  {[
                  { c: '#5B3FA8', t: 'Algorithmique · 08h' },
                  { c: '#1F9E8F', t: 'Design System · 10h' },
                  { c: '#F5B301', t: 'TP Réseaux · 14h' }].
                  map((r) =>
                  <div key={r.t} className="flex items-center gap-2 rounded-lg border-2 border-ink bg-canvas px-2.5 py-2">
                      <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: r.c }} />
                      <span className="text-xs font-semibold">{r.t}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 120, damping: 16 }}
                className="-mt-4 ml-6 w-56 rounded-xl2 border-2 border-ink bg-lime p-4 shadow-hard">
                
                <div className="flex items-center gap-2">
                  <GraduationCapIcon className="h-5 w-5 text-ink" />
                  <span className="font-display text-sm font-bold">Réussite</span>
                </div>
                <p className="mt-2 font-display text-3xl font-extrabold">94%</p>
                <p className="text-xs font-semibold text-ink/70">Taux de validation</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* audiences marquee */}
        <div id="etablissements" className="border-y-2 border-ink bg-ink py-4 text-paper">
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee items-center gap-12 whitespace-nowrap pr-12">
              {[...audiences, ...audiences, ...audiences, ...audiences].map((a, i) =>
              <span key={i} className="flex items-center gap-2 font-display text-lg font-bold">
                  <a.icon className="h-5 w-5 text-lime" /> {a.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <span className="inline-block rounded-full border-2 border-ink bg-coral px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-ink">
            Les modules
          </span>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Six modules. Une seule direction : la vôtre.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) =>
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i % 3 * 0.06 }}
            className="group rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-hard">
            
              <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink text-paper transition-transform duration-200 group-hover:rotate-6"
              style={{ backgroundColor: m.tone }}>
              
                <m.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold">{m.title}</h3>
              <p className="mt-1.5 text-sm text-smoke">{m.text}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* WHY */}
      <section id="pourquoi" className="border-y-2 border-ink bg-plum-soft">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full border-2 border-ink bg-lime px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                Pourquoi
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                Rien de figé. Tout est réel, tout s'exporte.
              </h2>
              <p className="mt-4 max-w-md text-smoke">
                Chaque module vous laisse créer, modifier et supprimer vos données. Les aperçus de
                documents sont configurables, et vous exportez vos données réelles quand vous voulez.
              </p>
              <Link to="/register" className="mt-6 inline-block">
                <Button>
                  Créer mon établissement <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4">
              {perks.map((p, i) =>
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 rounded-xl2 border-2 border-ink bg-paper p-5 shadow-hard-sm">
                
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-teal-soft">
                    <p.icon className="h-5 w-5 text-teal" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                    <p className="text-sm text-smoke">{p.text}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section id="tarifs" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="rounded-xl2 border-2 border-ink bg-ink p-8 text-paper shadow-hard-lg sm:p-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-block rounded-full border-2 border-paper bg-lime px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-ink">
                Essai gratuit
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
                Prêt à reprendre le contrôle de votre établissement ?
              </h2>
              <p className="mt-4 text-paper/70">
                Créez votre compte directeur, invitez votre équipe et commencez à gérer vos
                apprenants dès aujourd'hui.
              </p>
            </div>
            <div className="rounded-xl2 border-2 border-paper bg-paper p-6 text-ink">
              <p className="font-display text-5xl font-extrabold">
                0€<span className="text-base font-semibold text-smoke"> / 14 jours</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {['Tous les modules inclus', 'Apprenants illimités', 'Exports CSV & JSON', 'Documents configurables'].map(
                  (f) =>
                  <li key={f} className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-lime">
                        <ArrowRightIcon className="h-3 w-3" />
                      </span>
                      {f}
                    </li>

                )}
              </ul>
              <Link to="/register" className="mt-6 block">
                <Button className="w-full">Commencer maintenant</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>);

}