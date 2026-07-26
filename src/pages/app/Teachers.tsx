import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Field, Input, Select } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { Teacher, TeacherStatus } from '../../store/types';

const subjects = ['Algorithmique', 'Design System', 'SEO & SEA', 'Machine Learning', 'Réseaux', 'Management Agile', 'Bases de données', 'Communication'];
const statuses: {v: TeacherStatus;l: string;}[] = [
{ v: 'titulaire', l: 'Titulaire' },
{ v: 'vacataire', l: 'Vacataire' },
{ v: 'conge', l: 'En congé' }];

const STATUS_TONE: Record<TeacherStatus, 'teal' | 'plum' | 'gold'> = {
  titulaire: 'teal',
  vacataire: 'plum',
  conge: 'gold'
};
const AVATAR_COLORS = ['#5B3FA8', '#FF6B4A', '#1F9E8F', '#F5B301', '#8CC000'];

const empty = (): Omit<Teacher, 'id'> => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: subjects[0],
  status: 'titulaire',
  weeklyHours: 16,
  hiredAt: new Date().toISOString().slice(0, 10),
  avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
});

export function Teachers() {
  const { teachers, addTeacher, updateTeacher, removeTeacher } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState<{mode: 'add' | 'edit';teacher?: Teacher;} | null>(null);
  const [form, setForm] = useState<Omit<Teacher, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Teacher | null>(null);

  const set = (k: keyof Teacher, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.mode === 'edit' && modal.teacher) {
      updateTeacher(modal.teacher.id, form);
      toast('Enseignant mis à jour.');
    } else {
      addTeacher(form);
      toast('Enseignant ajouté.');
    }
    setModal(null);
  };

  const columns: Column<Teacher>[] = [
  {
    key: 'name',
    label: 'Enseignant',
    sortValue: (r) => r.lastName,
    exportValue: (r) => `${r.firstName} ${r.lastName}`,
    render: (r) =>
    <div className="flex items-center gap-3">
          <Avatar name={`${r.firstName} ${r.lastName}`} color={r.avatarColor} size="sm" />
          <div>
            <p className="font-semibold">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-smoke">{r.email}</p>
          </div>
        </div>

  },
  { key: 'subject', label: 'Matière', sortValue: (r) => r.subject, render: (r) => r.subject },
  { key: 'weeklyHours', label: 'Heures / sem.', sortValue: (r) => r.weeklyHours, render: (r) => <span className="font-mono">{r.weeklyHours}h</span>, exportValue: (r) => r.weeklyHours },
  {
    key: 'status',
    label: 'Statut',
    sortValue: (r) => r.status,
    render: (r) => <Badge tone={STATUS_TONE[r.status]}>{statuses.find((s) => s.v === r.status)?.l}</Badge>,
    exportValue: (r) => r.status
  },
  {
    key: 'actions',
    label: '',
    className: 'text-right',
    render: (r) =>
    <div className="flex justify-end gap-1">
          <button onClick={() => {setForm({ ...r });setModal({ mode: 'edit', teacher: r });}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setToDelete(r)} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-coral-soft" aria-label="Supprimer">
            <Trash2Icon className="h-3.5 w-3.5" />
          </button>
        </div>

  }];


  return (
    <div>
      <PageHeader
        eyebrow="Enseignants"
        title="Gestion des enseignants"
        description="Fiches, matières et volumes horaires de votre corps enseignant."
        actions={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Nouvel enseignant</Button>} />
      

      <DataTable
        rows={teachers}
        columns={columns}
        searchKeys={(r) => `${r.firstName} ${r.lastName} ${r.email} ${r.subject}`}
        exportName="enseignants"
        emptyTitle="Aucun enseignant"
        emptyDescription="Ajoutez votre premier enseignant."
        emptyAction={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Ajouter</Button>} />
      

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier l\'enseignant' : 'Nouvel enseignant'} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom"><Input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} /></Field>
            <Field label="Nom"><Input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-mail"><Input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
            <Field label="Téléphone"><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Matière">
              <Select value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Heures / semaine"><Input type="number" min={0} value={form.weeklyHours} onChange={(e) => set('weeklyHours', Number(e.target.value))} /></Field>
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Date d'embauche"><Input type="date" value={form.hiredAt} onChange={(e) => set('hiredAt', e.target.value)} /></Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
            <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {if (toDelete) {removeTeacher(toDelete.id);toast('Enseignant supprimé.');}}}
        message={`Supprimer ${toDelete?.firstName} ${toDelete?.lastName} du corps enseignant ?`} />
      
    </div>);

}