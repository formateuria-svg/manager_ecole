import React, { useMemo, useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, ReceiptIcon, CheckCircle2Icon, PrinterIcon, DownloadIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Field, Input, Select } from '../../components/ui/Field';
import { StatCard } from '../../components/app/StatCard';
import { ReceiptPreview } from '../../components/app/ReceiptPreview';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { Payment, PaymentStatus, PaymentMethod } from '../../store/types';
import { formatCurrency, formatDate } from '../../utils/format';
import { exportToCSV, timestampedName } from '../../utils/export';

const statuses: {v: PaymentStatus;l: string;}[] = [
{ v: 'paye', l: 'Payé' },
{ v: 'en_attente', l: 'En attente' },
{ v: 'en_retard', l: 'En retard' }];

const TONE: Record<PaymentStatus, 'lime' | 'gold' | 'coral'> = {
  paye: 'lime',
  en_attente: 'gold',
  en_retard: 'coral'
};
const methods: {v: PaymentMethod;l: string;}[] = [
{ v: 'carte', l: 'Carte bancaire' },
{ v: 'virement', l: 'Virement' },
{ v: 'especes', l: 'Espèces' },
{ v: 'cheque', l: 'Chèque' }];


const empty = (): Omit<Payment, 'id'> => ({
  studentId: '',
  studentName: '',
  label: 'Frais de scolarité',
  amount: 1200,
  dueDate: new Date().toISOString().slice(0, 10),
  paidDate: null,
  method: null,
  status: 'en_attente',
  receiptNo: '—'
});

export function Payments() {
  const { payments, students, templates, establishment, addPayment, updatePayment, removePayment, markPaid } = useStore();
  const toast = useToast();
  const [modal, setModal] = useState<{mode: 'add' | 'edit';p?: Payment;} | null>(null);
  const [form, setForm] = useState<Omit<Payment, 'id'>>(empty());
  const [toDelete, setToDelete] = useState<Payment | null>(null);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [payTarget, setPayTarget] = useState<Payment | null>(null);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('carte');

  const receiptTpl = templates.find((t) => t.type === 'recu') ?? templates[0];

  const totals = useMemo(() => {
    const paid = payments.filter((p) => p.status === 'paye').reduce((a, p) => a + p.amount, 0);
    const pending = payments.filter((p) => p.status === 'en_attente').reduce((a, p) => a + p.amount, 0);
    const late = payments.filter((p) => p.status === 'en_retard').reduce((a, p) => a + p.amount, 0);
    return { paid, pending, late };
  }, [payments]);

  const set = (k: keyof Payment, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === form.studentId);
    const payload = { ...form, studentName: student ? `${student.firstName} ${student.lastName}` : form.studentName };
    if (modal?.mode === 'edit' && modal.p) {
      updatePayment(modal.p.id, payload);
      toast('Paiement mis à jour.');
    } else {
      addPayment(payload);
      toast('Paiement enregistré.');
    }
    setModal(null);
  };

  const confirmPay = () => {
    if (payTarget) {
      markPaid(payTarget.id, payMethod);
      toast('Paiement encaissé — reçu généré.');
      setPayTarget(null);
    }
  };

  const exportReceipt = (p: Payment) => {
    exportToCSV(
      [p],
      [
      { key: 'receiptNo', label: 'N° reçu' },
      { key: 'studentName', label: 'Apprenant' },
      { key: 'label', label: 'Libellé' },
      { key: 'amount', label: 'Montant' },
      { key: 'paidDate', label: 'Date paiement' },
      { key: 'method', label: 'Méthode' }],

      timestampedName(`recu_${p.receiptNo}`)
    );
    toast('Reçu exporté.');
  };

  const columns: Column<Payment>[] = [
  { key: 'studentName', label: 'Apprenant', sortValue: (r) => r.studentName, render: (r) => <span className="font-semibold">{r.studentName}</span> },
  { key: 'label', label: 'Libellé', render: (r) => <span className="text-smoke">{r.label}</span> },
  { key: 'amount', label: 'Montant', sortValue: (r) => r.amount, render: (r) => <span className="font-mono font-semibold">{formatCurrency(r.amount)}</span>, exportValue: (r) => r.amount },
  { key: 'dueDate', label: 'Échéance', sortValue: (r) => r.dueDate, render: (r) => <span className="text-smoke">{formatDate(r.dueDate)}</span>, exportValue: (r) => r.dueDate },
  { key: 'status', label: 'Statut', sortValue: (r) => r.status, render: (r) => <Badge tone={TONE[r.status]}>{statuses.find((s) => s.v === r.status)?.l}</Badge>, exportValue: (r) => r.status },
  {
    key: 'actions', label: '', className: 'text-right',
    render: (r) =>
    <div className="flex justify-end gap-1">
          {r.status !== 'paye' ?
      <button onClick={() => {setPayTarget(r);setPayMethod('carte');}} className="rounded-lg border-2 border-ink bg-lime p-1.5 hover:bg-lime-dark" aria-label="Encaisser" title="Encaisser">
              <CheckCircle2Icon className="h-3.5 w-3.5" />
            </button> :

      <button onClick={() => setReceipt(r)} className="rounded-lg border-2 border-ink bg-plum-soft p-1.5 hover:bg-plum hover:text-paper" aria-label="Reçu" title="Voir le reçu">
              <ReceiptIcon className="h-3.5 w-3.5" />
            </button>
      }
          <button onClick={() => {setForm({ ...r });setModal({ mode: 'edit', p: r });}} className="rounded-lg border-2 border-ink bg-paper p-1.5 hover:bg-lime-soft" aria-label="Modifier">
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
        eyebrow="Paiements"
        title="Paiements & reçus"
        description="Suivez les encaissements, relancez les retards et générez les reçus."
        actions={<Button onClick={() => {setForm(empty());setModal({ mode: 'add' });}}><PlusIcon className="h-4 w-4" /> Nouveau paiement</Button>} />
      

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={CheckCircle2Icon} label="Encaissé" value={formatCurrency(totals.paid)} color="#1F9E8F" delay={0} />
        <StatCard icon={ReceiptIcon} label="En attente" value={formatCurrency(totals.pending)} color="#F5B301" delay={0.05} />
        <StatCard icon={DownloadIcon} label="En retard" value={formatCurrency(totals.late)} color="#FF6B4A" delay={0.1} />
      </div>

      <DataTable
        rows={payments}
        columns={columns}
        searchKeys={(r) => `${r.studentName} ${r.label} ${r.status} ${r.receiptNo}`}
        exportName="paiements"
        emptyTitle="Aucun paiement"
        emptyDescription="Enregistrez un premier paiement." />
      

      {/* Add / edit */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Modifier le paiement' : 'Nouveau paiement'} wide>
        <form onSubmit={save} className="space-y-4">
          <Field label="Apprenant">
            <Select value={form.studentId} onChange={(e) => set('studentId', e.target.value)} required>
              <option value="">Sélectionner…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Libellé"><Input required value={form.label} onChange={(e) => set('label', e.target.value)} /></Field>
            <Field label="Montant (€)"><Input type="number" min={0} required value={form.amount} onChange={(e) => set('amount', Number(e.target.value))} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Échéance"><Input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} /></Field>
            <Field label="Statut">
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                {statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModal(null)}>Annuler</Button>
            <Button type="submit">{modal?.mode === 'edit' ? 'Enregistrer' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>

      {/* Encaisser */}
      <Modal open={!!payTarget} onClose={() => setPayTarget(null)} title="Encaisser le paiement">
        <p className="text-sm text-smoke">
          {payTarget?.studentName} — <span className="font-semibold text-ink">{payTarget && formatCurrency(payTarget.amount)}</span>
        </p>
        <Field label="Méthode de paiement" className="mt-4">
          <Select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}>
            {methods.map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
          </Select>
        </Field>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPayTarget(null)}>Annuler</Button>
          <Button onClick={confirmPay}><CheckCircle2Icon className="h-4 w-4" /> Valider l'encaissement</Button>
        </div>
      </Modal>

      {/* Receipt preview */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Aperçu du reçu" wide>
        {receipt && receiptTpl &&
        <>
            <ReceiptPreview payment={receipt} template={receiptTpl} establishment={establishment} />
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => window.print()}><PrinterIcon className="h-4 w-4" /> Imprimer</Button>
              <Button onClick={() => exportReceipt(receipt)}><DownloadIcon className="h-4 w-4" /> Exporter</Button>
            </div>
          </>
        }
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {if (toDelete) {removePayment(toDelete.id);toast('Paiement supprimé.');}}}
        message={`Supprimer le paiement de ${toDelete?.studentName} (${toDelete && formatCurrency(toDelete.amount)}) ?`} />
      
    </div>);

}