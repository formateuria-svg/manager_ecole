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
import type { Student, StudentStatus } from '../../store/types';
import { formatDate } from '../../utils/format';

const programs = ['Développement Web', 'Design UX/UI', 'Marketing Digital', 'Data & IA', 'Cybersécurité', 'Gestion de Projet'];
const statuses: {v: StudentStatus;l: string;}[] = [
{ v: 'actif', l: 'Actif' },
{ v: 'diplome', l: 'Diplômé' },
{ v: 'suspendu', l: 'Suspendu' },
{ v: 'sortie', l: 'Sortie' }];

const STATUS_TONE: Record<StudentStatus, 'lime' | 'plum' | 'gold' | 'smoke'> = {
  actif: 'lime',
  diplome: 'plum',
  suspendu: 'gold',
  sortie: 'smoke'
};
const AVATAR_COLORS = ['#5B3FA8', '#FF6B4A', '#1F9E8F', '#F5B301', '#8CC000'];

const empty = (): Omit<Student, 'id'> => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  program: programs[0],
  classGroup: '',
  status: 'actif',
  enrolledAt: new Date().toISOString().slice(0, 10),
  avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
});

export function Students() {
  const { students, addStudent, updateStudent, removeStudent } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState<{mode: 'add' | 'edit';student?: Student;} | null>(null);
  const [form, setForm] = useState<Omit<Student, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Student | null>(null);

  const openAdd = () => {
    setForm(empty());
    setModal({ mode: 'add' });
  };
  const openEdit = (s: Student) => {
    setForm({ ...s });
    setModal({ mode: 'edit', student: s });
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.mode === 'edit' && modal.student) {
      updateStudent(modal.student.id, form);
      toast('Apprenant mis à jour.');
    } else {
      addStudent(form);
      toast('Apprenant ajouté.');
    }
    setModal(null);
  };

  const set = (k: keyof Student, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const columns: Column<Student>[] = [
  {
    key: 'name',
    label: 'Apprenant',
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
  { key: 'program', label: 'Filière', sortValue: (r) => r.program, render: (r) => r.program },
  { key: 'classGroup', label: 'Classe', render: (r) => <span className="font-mono text-xs">{r.classGroup}</span>, exportValue: (r) => r.classGroup },
  {
    key: 'enrolledAt',
    label: 'Inscrit le',
    sortValue: (r) => r.enrolledAt,
    render: (r) => <span className="text-smoke">{formatDate(r.enrolledAt)}</span>,
    exportValue: (r) => r.enrolledAt
  },
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
          <button onClick={() => openEdit(r)} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
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
        eyebrow="Apprenants"
        title="Étudiants & apprenants"
        description="Gérez toutes les fiches de vos apprenants, créez et exportez en un clic."
        actions={
        <Button onClick={openAdd}>
            <PlusIcon className="h-4 w-4" /> Nouvel apprenant
          </Button>
        } />
      

      <DataTable
        rows={students}
        columns={columns}
        searchKeys={(r) => `${r.firstName} ${r.lastName} ${r.email} ${r.program} ${r.classGroup}`}
        exportName="apprenants"
        emptyTitle="Aucun apprenant"
        emptyDescription="Ajoutez votre premier apprenant pour commencer."
        emptyAction={<Button onClick={openAdd}><PlusIcon className="h-4 w-4" /> Ajouter</Button>} />
      

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier l\'apprenant' : 'Nouvel apprenant'} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom"><Input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} /></Field>
            <Field label="Nom"><Input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-mail"><Input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
            <Field label="Téléphone"><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date de naissance"><Input type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} /></Field>
            <Field label="Date d'inscription"><Input type="date" value={form.enrolledAt} onChange={(e) => set('enrolledAt', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Filière">
              <Select value={form.program} onChange={(e) => set('program', e.target.value)}>
                {programs.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="Classe"><Input required value={form.classGroup} onChange={(e) => set('classGroup', e.target.value)} placeholder="DW-A1" /></Field>
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
            <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            removeStudent(toDelete.id);
            toast('Apprenant supprimé.');
          }
        }}
        message={`Voulez-vous vraiment supprimer ${toDelete?.firstName} ${toDelete?.lastName} ? Cette action est irréversible.`} />
      
    </div>);

}