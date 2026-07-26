import React, { useMemo, useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, BookOpenCheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Field, Input, Select } from '../../components/ui/Field';
import { StatCard } from '../../components/app/StatCard';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { Grade } from '../../store/types';
import { formatDate } from '../../utils/format';

const subjects = ['Algorithmique', 'Design System', 'SEO & SEA', 'Machine Learning', 'Réseaux', 'Management Agile', 'Bases de données', 'Communication'];
const assessments = ['Contrôle continu', 'Partiel', 'Projet', 'Oral', 'TP noté'];

const empty = (): Omit<Grade, 'id'> => ({
  studentId: '',
  studentName: '',
  subject: subjects[0],
  assessment: assessments[0],
  score: 12,
  outOf: 20,
  coefficient: 1,
  date: new Date().toISOString().slice(0, 10)
});

function scoreTone(ratio: number): 'lime' | 'teal' | 'gold' | 'coral' {
  if (ratio >= 0.8) return 'lime';
  if (ratio >= 0.6) return 'teal';
  if (ratio >= 0.5) return 'gold';
  return 'coral';
}

export function Grades() {
  const { grades, students, addGrade, updateGrade, removeGrade } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState<{mode: 'add' | 'edit';g?: Grade;} | null>(null);
  const [form, setForm] = useState<Omit<Grade, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Grade | null>(null);

  const set = (k: keyof Grade, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const stats = useMemo(() => {
    if (grades.length === 0) return { avg: '—', best: '—', pass: '0%' };
    const norm = grades.map((g) => g.score / g.outOf * 20);
    const avg = norm.reduce((a, b) => a + b, 0) / norm.length;
    const pass = norm.filter((n) => n >= 10).length / norm.length * 100;
    return { avg: avg.toFixed(1), best: Math.max(...norm).toFixed(1), pass: `${pass.toFixed(0)}%` };
  }, [grades]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === form.studentId);
    const payload = { ...form, studentName: student ? `${student.firstName} ${student.lastName}` : form.studentName };
    if (modal?.mode === 'edit' && modal.g) {
      updateGrade(modal.g.id, payload);
      toast('Note mise à jour.');
    } else {
      addGrade(payload);
      toast('Note ajoutée.');
    }
    setModal(null);
  };

  const columns: Column<Grade>[] = [
  { key: 'studentName', label: 'Apprenant', sortValue: (r) => r.studentName, render: (r) => <span className="font-semibold">{r.studentName}</span> },
  { key: 'subject', label: 'Matière', sortValue: (r) => r.subject, render: (r) => r.subject },
  { key: 'assessment', label: 'Évaluation', render: (r) => <span className="text-smoke">{r.assessment}</span> },
  {
    key: 'score', label: 'Note', sortValue: (r) => r.score / r.outOf,
    render: (r) => <Badge tone={scoreTone(r.score / r.outOf)}>{r.score}/{r.outOf}</Badge>,
    exportValue: (r) => `${r.score}/${r.outOf}`
  },
  { key: 'coefficient', label: 'Coeff.', sortValue: (r) => r.coefficient, render: (r) => <span className="font-mono">×{r.coefficient}</span>, exportValue: (r) => r.coefficient },
  { key: 'date', label: 'Date', sortValue: (r) => r.date, render: (r) => <span className="text-smoke">{formatDate(r.date)}</span>, exportValue: (r) => r.date },
  {
    key: 'actions', label: '', className: 'text-right',
    render: (r) =>
    <div className="flex justify-end gap-1">
          <button onClick={() => {setForm({ ...r });setModal({ mode: 'edit', g: r });}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
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
        eyebrow="Notes"
        title="Notes des apprenants"
        description="Saisissez les évaluations, les coefficients et suivez les moyennes."
        actions={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Nouvelle note</Button>} />
      

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={BookOpenCheckIcon} label="Moyenne générale /20" value={stats.avg} color="#5B3FA8" delay={0} />
        <StatCard icon={BookOpenCheckIcon} label="Meilleure note /20" value={stats.best} color="#1F9E8F" delay={0.05} />
        <StatCard icon={BookOpenCheckIcon} label="Taux de réussite" value={stats.pass} color="#8CC000" delay={0.1} />
      </div>

      <DataTable
        rows={grades}
        columns={columns}
        searchKeys={(r) => `${r.studentName} ${r.subject} ${r.assessment}`}
        exportName="notes"
        emptyTitle="Aucune note"
        emptyDescription="Ajoutez une note pour un apprenant." />
      

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier la note' : 'Nouvelle note'} wide>
        <form onSubmit={save} className="space-y-4">
          <Field label="Apprenant">
            <Select value={form.studentId} onChange={(e) => set('studentId', e.target.value)} required>
              <option value="">Sélectionner…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Matière">
              <Select value={form.subject} onChange={(e) => set('subject', e.target.value)}>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Type d'évaluation">
              <Select value={form.assessment} onChange={(e) => set('assessment', e.target.value)}>
                {assessments.map((a) => <option key={a}>{a}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Note"><Input type="number" min={0} step="0.5" required value={form.score} onChange={(e) => set('score', Number(e.target.value))} /></Field>
            <Field label="Sur"><Input type="number" min={1} required value={form.outOf} onChange={(e) => set('outOf', Number(e.target.value))} /></Field>
            <Field label="Coefficient"><Input type="number" min={1} value={form.coefficient} onChange={(e) => set('coefficient', Number(e.target.value))} /></Field>
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></Field>
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
        onConfirm={() => {if (toDelete) {removeGrade(toDelete.id);toast('Note supprimée.');}}}
        message={`Supprimer la note de ${toDelete?.studentName} en ${toDelete?.subject} ?`} />
      
    </div>);

}