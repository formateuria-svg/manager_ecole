import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, Trash2Icon, PencilIcon, DownloadIcon, UsersIcon, GraduationCapIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Field, Input, Select } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { TimetableEvent, EventKind } from '../../store/types';
import { exportToCSV, timestampedName } from '../../utils/export';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i); // 8h -> 18h
const START = 8;
const PX_PER_HOUR = 64;

const KIND_COLOR: Record<EventKind, string> = {
  cours: '#5B3FA8',
  td: '#1F9E8F',
  tp: '#F5B301',
  examen: '#FF6B4A',
  reunion: '#8CC000'
};
const KIND_LABEL: Record<EventKind, string> = {
  cours: 'Cours',
  td: 'TD',
  tp: 'TP',
  examen: 'Examen',
  reunion: 'Réunion'
};

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const empty = (teacherName: string, teacherId: string): Omit<TimetableEvent, 'id'> => ({
  title: '',
  kind: 'cours',
  teacherId,
  teacherName,
  classGroup: '',
  room: '',
  day: 0,
  start: '08:00',
  end: '10:00',
  color: KIND_COLOR.cours
});

export function Timetable() {
  const { events, teachers, addEvent, updateEvent, removeEvent } = useStore();
  const toast = useToast();
  const [view, setView] = useState<'apprenant' | 'enseignant'>('apprenant');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');
  const [modal, setModal] = useState<{mode: 'add' | 'edit';e?: TimetableEvent;} | null>(null);
  const [form, setForm] = useState<Omit<TimetableEvent, 'id'>>(
    empty(teachers[0] ? `${teachers[0].firstName} ${teachers[0].lastName}` : '', teachers[0]?.id ?? '')
  );

  const visible = useMemo(() => {
    if (view === 'enseignant' && teacherFilter !== 'all') {
      return events.filter((e) => e.teacherId === teacherFilter);
    }
    return events;
  }, [events, view, teacherFilter]);

  const set = (k: keyof TimetableEvent, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = (day?: number) => {
    const t = teachers[0];
    setForm({ ...empty(t ? `${t.firstName} ${t.lastName}` : '', t?.id ?? ''), day: day ?? 0 });
    setModal({ mode: 'add' });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const t = teachers.find((x) => x.id === form.teacherId);
    const payload: Omit<TimetableEvent, 'id'> = {
      ...form,
      teacherName: t ? `${t.firstName} ${t.lastName}` : form.teacherName,
      color: KIND_COLOR[form.kind]
    };
    if (modal?.mode === 'edit' && modal.e) {
      updateEvent(modal.e.id, payload);
      toast('Créneau mis à jour.');
    } else {
      addEvent(payload);
      toast('Créneau ajouté.');
    }
    setModal(null);
  };

  const exportTimetable = () => {
    exportToCSV(
      visible,
      [
      { key: 'day', label: 'Jour', value: (r) => DAYS[r.day] },
      { key: 'start', label: 'Début' },
      { key: 'end', label: 'Fin' },
      { key: 'title', label: 'Matière' },
      { key: 'kind', label: 'Type', value: (r) => KIND_LABEL[r.kind] },
      { key: 'teacherName', label: 'Enseignant' },
      { key: 'classGroup', label: 'Classe' },
      { key: 'room', label: 'Salle' }],

      timestampedName('emploi_du_temps')
    );
    toast('Emploi du temps exporté.');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Emploi du temps"
        title="Calendrier hebdomadaire"
        description="Un planning vivant pour vos apprenants et enseignants, sans conflit d'horaire."
        actions={
        <>
            <Button variant="outline" onClick={exportTimetable}><DownloadIcon className="h-4 w-4" /> Exporter</Button>
            <Button onClick={() => openAdd()}><PlusIcon className="h-4 w-4" /> Nouveau créneau</Button>
          </>
        } />
      

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border-2 border-ink bg-paper p-1">
          <button onClick={() => setView('apprenant')} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'apprenant' ? 'bg-ink text-paper' : 'text-smoke hover:text-ink'}`}>
            <GraduationCapIcon className="h-4 w-4" /> Apprenants
          </button>
          <button onClick={() => setView('enseignant')} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${view === 'enseignant' ? 'bg-ink text-paper' : 'text-smoke hover:text-ink'}`}>
            <UsersIcon className="h-4 w-4" /> Enseignants
          </button>
        </div>
        {view === 'enseignant' &&
        <select
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="rounded-full border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-plum">
          
            <option value="all">Tous les enseignants</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
          </select>
        }
        <div className="ml-auto flex flex-wrap gap-2">
          {(Object.keys(KIND_LABEL) as EventKind[]).map((k) =>
          <span key={k} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-xs font-semibold">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: KIND_COLOR[k] }} /> {KIND_LABEL[k]}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl2 border-2 border-ink bg-paper shadow-hard-sm">
        <div className="min-w-[820px]">
          {/* Header row */}
          <div className="grid border-b-2 border-ink" style={{ gridTemplateColumns: `64px repeat(${DAYS.length}, 1fr)` }}>
            <div className="border-r-2 border-ink bg-canvas" />
            {DAYS.map((d) =>
            <div key={d} className="border-r border-line bg-canvas px-3 py-2.5 text-center font-display text-sm font-bold last:border-r-0">
                {d}
              </div>
            )}
          </div>

          {/* Grid body */}
          <div className="grid" style={{ gridTemplateColumns: `64px repeat(${DAYS.length}, 1fr)` }}>
            {/* Hour gutter */}
            <div className="border-r-2 border-ink bg-canvas">
              {HOURS.map((h) =>
              <div key={h} style={{ height: PX_PER_HOUR }} className="relative border-b border-line">
                  <span className="absolute -top-2 right-1.5 font-mono text-[11px] text-smoke">{h}h</span>
                </div>
              )}
            </div>

            {/* Day columns */}
            {DAYS.map((_, day) => {
              const dayEvents = visible.filter((e) => e.day === day);
              return (
                <div key={day} className="relative border-r border-line last:border-r-0" style={{ height: HOURS.length * PX_PER_HOUR }}>
                  {HOURS.map((h) =>
                  <button
                    key={h}
                    onClick={() => openAdd(day)}
                    className="group absolute inset-x-0 border-b border-line/70 hover:bg-lime-soft/40"
                    style={{ top: (h - START) * PX_PER_HOUR, height: PX_PER_HOUR }}
                    aria-label={`Ajouter un créneau ${DAYS[day]} à ${h}h`}>
                    
                      <PlusIcon className="mx-auto h-4 w-4 text-transparent group-hover:text-plum" />
                    </button>
                  )}
                  <AnimatePresence>
                    {dayEvents.map((ev) => {
                      const top = (toMin(ev.start) - START * 60) / 60 * PX_PER_HOUR;
                      const height = (toMin(ev.end) - toMin(ev.start)) / 60 * PX_PER_HOUR;
                      return (
                        <motion.button
                          key={ev.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => {setForm({ ...ev });setModal({ mode: 'edit', e: ev });}}
                          className="absolute inset-x-1 overflow-hidden rounded-xl border-2 border-ink p-2 text-left text-white shadow-hard-sm transition-transform hover:-translate-y-0.5 hover:z-10"
                          style={{ top: top + 2, height: Math.max(height - 4, 34), backgroundColor: ev.color }}>
                          
                          <p className="truncate text-xs font-bold leading-tight">{ev.title}</p>
                          <p className="truncate text-[10px] opacity-90">{ev.start}–{ev.end} · {ev.room}</p>
                          {height > 60 &&
                          <p className="mt-0.5 truncate text-[10px] opacity-80">
                              {view === 'apprenant' ? ev.teacherName : ev.classGroup}
                            </p>
                          }
                        </motion.button>);

                    })}
                  </AnimatePresence>
                </div>);

            })}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier le créneau' : 'Nouveau créneau'} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Matière / Titre"><Input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Algorithmique" /></Field>
            <Field label="Type">
              <Select value={form.kind} onChange={(e) => set('kind', e.target.value)}>
                {(Object.keys(KIND_LABEL) as EventKind[]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Enseignant">
            <Select value={form.teacherId} onChange={(e) => set('teacherId', e.target.value)} required>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Classe"><Input value={form.classGroup} onChange={(e) => set('classGroup', e.target.value)} placeholder="DW-A1" /></Field>
            <Field label="Salle"><Input value={form.room} onChange={(e) => set('room', e.target.value)} placeholder="Salle 101" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Jour">
              <Select value={form.day} onChange={(e) => set('day', Number(e.target.value))}>
                {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Début"><Input type="time" value={form.start} onChange={(e) => set('start', e.target.value)} /></Field>
            <Field label="Fin"><Input type="time" value={form.end} onChange={(e) => set('end', e.target.value)} /></Field>
          </div>
          <div className="flex items-center justify-between pt-2">
            {modal?.mode === 'edit' && modal.e ?
            <Button type="button" variant="danger" onClick={() => {removeEvent(modal.e!.id);toast('Créneau supprimé.');setModal(null);}}>
                <Trash2Icon className="h-4 w-4" /> Supprimer
              </Button> :
            <span />}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
              <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>);

}