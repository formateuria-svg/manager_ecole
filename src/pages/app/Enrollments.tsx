import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, CheckIcon, XIcon, FileTextIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { Enrollment, EnrollmentStatus } from '../../store/types';
import { formatCurrency, formatDate } from '../../utils/format';

const programs = ['Développement Web', 'Design UX/UI', 'Marketing Digital', 'Data & IA', 'Cybersécurité', 'Gestion de Projet'];
const statuses: {v: EnrollmentStatus;l: string;}[] = [
{ v: 'en_attente', l: 'En attente' },
{ v: 'validee', l: 'Validée' },
{ v: 'liste_attente', l: 'Liste d\'attente' },
{ v: 'refusee', l: 'Refusée' }];

const TONE: Record<EnrollmentStatus, 'gold' | 'lime' | 'plum' | 'coral'> = {
  en_attente: 'gold',
  validee: 'lime',
  liste_attente: 'plum',
  refusee: 'coral'
};
const docOptions = ['CNI', 'Diplôme', 'CV', 'Photo', 'Justificatif domicile', 'Relevé de notes'];

const empty = (): Omit<Enrollment, 'id'> => ({
  studentName: '',
  program: programs[0],
  requestedAt: new Date().toISOString().slice(0, 10),
  status: 'en_attente',
  amount: 4500,
  documents: [],
  note: ''
});

export function Enrollments() {
  const { enrollments, addEnrollment, updateEnrollment, removeEnrollment, addStudent } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState<{mode: 'add' | 'edit';e?: Enrollment;} | null>(null);
  const [form, setForm] = useState<Omit<Enrollment, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Enrollment | null>(null);

  const set = (k: keyof Enrollment, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggleDoc = (d: string) =>
  setForm((f) => ({
    ...f,
    documents: f.documents.includes(d) ? f.documents.filter((x) => x !== d) : [...f.documents, d]
  }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal?.mode === 'edit' && modal.e) {
      updateEnrollment(modal.e.id, form);
      toast('Inscription mise à jour.');
    } else {
      addEnrollment(form);
      toast('Demande d\'inscription créée.');
    }
    setModal(null);
  };

  const validate = (e: Enrollment) => {
    updateEnrollment(e.id, { status: 'validee' });
    const [firstName, ...rest] = e.studentName.split(' ');
    addStudent({
      firstName,
      lastName: rest.join(' ') || '—',
      email: `${firstName.toLowerCase()}@campus-lumiere.fr`,
      phone: '',
      birthDate: '',
      program: e.program,
      classGroup: 'À affecter',
      status: 'actif',
      enrolledAt: new Date().toISOString().slice(0, 10),
      avatarColor: '#5B3FA8'
    });
    toast('Inscription validée — apprenant créé.');
  };

  const columns: Column<Enrollment>[] = [
  { key: 'studentName', label: 'Candidat', sortValue: (r) => r.studentName, render: (r) => <span className="font-semibold">{r.studentName}</span> },
  { key: 'program', label: 'Filière', sortValue: (r) => r.program, render: (r) => r.program },
  { key: 'requestedAt', label: 'Demande', sortValue: (r) => r.requestedAt, render: (r) => <span className="text-smoke">{formatDate(r.requestedAt)}</span>, exportValue: (r) => r.requestedAt },
  {
    key: 'documents', label: 'Pièces',
    render: (r) => <span className="inline-flex items-center gap-1 text-xs text-smoke"><FileTextIcon className="h-3.5 w-3.5" />{r.documents.length}</span>,
    exportValue: (r) => r.documents.join(', ')
  },
  { key: 'amount', label: 'Montant', sortValue: (r) => r.amount, render: (r) => <span className="font-mono font-semibold">{formatCurrency(r.amount)}</span>, exportValue: (r) => r.amount },
  { key: 'status', label: 'Statut', sortValue: (r) => r.status, render: (r) => <Badge tone={TONE[r.status]}>{statuses.find((s) => s.v === r.status)?.l}</Badge>, exportValue: (r) => r.status },
  {
    key: 'actions', label: '', className: 'text-right',
    render: (r) =>
    <div className="flex justify-end gap-1">
          {r.status !== 'validee' &&
      <button onClick={() => validate(r)} className="rounded-lg border-2 border-ink bg-lime p-1.5 hover:bg-lime-dark" aria-label="Valider" title="Valider">
              <CheckIcon className="h-3.5 w-3.5" />
            </button>
      }
          {r.status !== 'refusee' &&
      <button onClick={() => {updateEnrollment(r.id, { status: 'refusee' });toast('Inscription refusée.');}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-coral-soft" aria-label="Refuser" title="Refuser">
              <XIcon className="h-3.5 w-3.5" />
            </button>
      }
          <button onClick={() => {setForm({ ...r });setModal({ mode: 'edit', e: r });}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
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
        eyebrow="Inscriptions"
        title="Demandes d'inscription"
        description="Traitez les candidatures : validez, refusez et convertissez en apprenants."
        actions={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Nouvelle demande</Button>} />
      

      <DataTable
        rows={enrollments}
        columns={columns}
        searchKeys={(r) => `${r.studentName} ${r.program} ${r.status}`}
        exportName="inscriptions"
        emptyTitle="Aucune demande"
        emptyDescription="Créez une demande d'inscription pour démarrer." />
      

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier la demande' : 'Nouvelle demande'} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom du candidat"><Input required value={form.studentName} onChange={(e) => set('studentName', e.target.value)} placeholder="Prénom Nom" /></Field>
            <Field label="Filière">
              <Select value={form.program} onChange={(e) => set('program', e.target.value)}>
                {programs.map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date de demande"><Input type="date" value={form.requestedAt} onChange={(e) => set('requestedAt', e.target.value)} /></Field>
            <Field label="Montant (€)"><Input type="number" min={0} value={form.amount} onChange={(e) => set('amount', Number(e.target.value))} /></Field>
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </Field>
          </div>
          <div>
            <p className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-smoke">Pièces justificatives</p>
            <div className="flex flex-wrap gap-2">
              {docOptions.map((d) => {
                const on = form.documents.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDoc(d)}
                    className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors ${on ? 'border-ink bg-lime text-ink' : 'border-line bg-paper text-smoke hover:border-ink'}`}>
                    
                    {d}
                  </button>);

              })}
            </div>
          </div>
          <Field label="Note interne"><Textarea value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Commentaire sur la candidature…" /></Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
            <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {if (toDelete) {removeEnrollment(toDelete.id);toast('Demande supprimée.');}}}
        message={`Supprimer la demande de ${toDelete?.studentName} ?`} />
      
    </div>);

}