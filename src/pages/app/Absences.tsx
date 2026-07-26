import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, CheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Field, Input, Select } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { Absence, AbsenceStatus, AbsenceKind } from '../../store/types';
import { formatDate } from '../../utils/format';

const statuses: {v: AbsenceStatus;l: string;}[] = [
{ v: 'justifiee', l: 'Justifiée' },
{ v: 'non_justifiee', l: 'Non justifiée' },
{ v: 'en_attente', l: 'En attente' }];

const TONE: Record<AbsenceStatus, 'lime' | 'coral' | 'gold'> = {
  justifiee: 'lime',
  non_justifiee: 'coral',
  en_attente: 'gold'
};
const kinds: {v: AbsenceKind;l: string;}[] = [
{ v: 'absence', l: 'Absence' },
{ v: 'retard', l: 'Retard' }];


const empty = (): Omit<Absence, 'id'> => ({
  personName: '',
  role: 'apprenant',
  classGroup: '',
  date: new Date().toISOString().slice(0, 10),
  kind: 'absence',
  duration: 'Journée',
  status: 'en_attente',
  reason: ''
});

export function Absences() {
  const { absences, addAbsence, updateAbsence, removeAbsence } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState<'tous' | 'apprenant' | 'enseignant'>('tous');
  const [modal, setModal] = useState<{mode: 'add' | 'edit';a?: Absence;} | null>(null);
  const [form, setForm] = useState<Omit<Absence, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Absence | null>(null);

  const set = (k: keyof Absence, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const filtered = tab === 'tous' ? absences : absences.filter((a) => a.role === tab);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.mode === 'edit' && modal.a) {
      updateAbsence(modal.a.id, form);
      toast('Absence mise à jour.');
    } else {
      addAbsence(form);
      toast('Absence enregistrée.');
    }
    setModal(null);
  };

  const columns: Column<Absence>[] = [
  { key: 'personName', label: 'Personne', sortValue: (r) => r.personName, render: (r) => <span className="font-semibold">{r.personName}</span> },
  { key: 'role', label: 'Rôle', render: (r) => <Badge tone={r.role === 'apprenant' ? 'plum' : 'teal'}>{r.role === 'apprenant' ? 'Apprenant' : 'Enseignant'}</Badge>, exportValue: (r) => r.role },
  { key: 'kind', label: 'Type', sortValue: (r) => r.kind, render: (r) => <span>{kinds.find((k) => k.v === r.kind)?.l}</span>, exportValue: (r) => r.kind },
  { key: 'date', label: 'Date', sortValue: (r) => r.date, render: (r) => <span className="text-smoke">{formatDate(r.date)}</span>, exportValue: (r) => r.date },
  { key: 'duration', label: 'Durée', render: (r) => <span className="font-mono text-xs">{r.duration}</span> },
  { key: 'status', label: 'Statut', sortValue: (r) => r.status, render: (r) => <Badge tone={TONE[r.status]}>{statuses.find((s) => s.v === r.status)?.l}</Badge>, exportValue: (r) => r.status },
  {
    key: 'actions', label: '', className: 'text-right',
    render: (r) =>
    <div className="flex justify-end gap-1">
          {r.status !== 'justifiee' &&
      <button onClick={() => {updateAbsence(r.id, { status: 'justifiee' });toast('Absence justifiée.');}} className="rounded-lg border-2 border-ink bg-lime p-1.5 hover:bg-lime-dark" aria-label="Justifier" title="Justifier">
              <CheckIcon className="h-3.5 w-3.5" />
            </button>
      }
          <button onClick={() => {setForm({ ...r });setModal({ mode: 'edit', a: r });}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setToDelete(r)} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-coral-soft" aria-label="Supprimer">
            <Trash2Icon className="h-3.5 w-3.5" />
          </button>
        </div>

  }];


  const tabs: {v: typeof tab;l: string;}[] = [
  { v: 'tous', l: 'Tous' },
  { v: 'apprenant', l: 'Apprenants' },
  { v: 'enseignant', l: 'Enseignants' }];


  return (
    <div>
      <PageHeader
        eyebrow="Absences"
        title="Suivi des absences & retards"
        description="Enregistrez, justifiez et exportez les absences des apprenants et enseignants."
        actions={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Nouvelle absence</Button>} />
      

      <div className="mb-4 inline-flex rounded-full border-2 border-ink bg-paper p-1">
        {tabs.map((t) =>
        <button
          key={t.v}
          onClick={() => setTab(t.v)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === t.v ? 'bg-ink text-paper' : 'text-smoke hover:text-ink'}`}>
          
            {t.l}
          </button>
        )}
      </div>

      <DataTable
        rows={filtered}
        columns={columns}
        searchKeys={(r) => `${r.personName} ${r.classGroup} ${r.reason}`}
        exportName="absences"
        emptyTitle="Aucune absence"
        emptyDescription="Aucune absence enregistrée pour ce filtre." />
      

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier l\'absence' : 'Nouvelle absence'} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la personne"><Input required value={form.personName} onChange={(e) => set('personName', e.target.value)} /></Field>
            <Field label="Rôle">
              <Select value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="apprenant">Apprenant</option>
                <option value="enseignant">Enseignant</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Classe / Matière"><Input value={form.classGroup} onChange={(e) => set('classGroup', e.target.value)} /></Field>
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <Select value={form.kind} onChange={(e) => set('kind', e.target.value)}>
                {kinds.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
              </Select>
            </Field>
            <Field label="Durée"><Input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="Journée, 30 min…" /></Field>
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Motif"><Input value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder="Rendez-vous médical…" /></Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
            <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {if (toDelete) {removeAbsence(toDelete.id);toast('Absence supprimée.');}}}
        message={`Supprimer l'absence de ${toDelete?.personName} ?`} />
      
    </div>);

}