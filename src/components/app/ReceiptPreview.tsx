import React from 'react';
import { GraduationCapIcon } from 'lucide-react';
import type { Payment, DocumentTemplate, Establishment } from '../../store/types';
import { formatCurrency, formatDate } from '../../utils/format';

const METHOD_LABEL: Record<string, string> = {
  carte: 'Carte bancaire',
  virement: 'Virement',
  especes: 'Espèces',
  cheque: 'Chèque'
};

export function ReceiptPreview({
  payment,
  template,
  establishment




}: {payment: Payment;template: DocumentTemplate;establishment: Establishment;}) {
  return (
    <div className="overflow-hidden rounded-xl2 border-2 border-ink bg-white">
      <div className="flex items-center justify-between px-6 py-5 text-white" style={{ backgroundColor: template.headerColor }}>
        <div className="flex items-center gap-3">
          {template.showLogo &&
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white/60 bg-white/15">
              <GraduationCapIcon className="h-5 w-5" />
            </span>
          }
          <div>
            <p className="font-display text-lg font-extrabold leading-none">{establishment.name}</p>
            <p className="text-xs opacity-80">{establishment.city} · {establishment.email}</p>
          </div>
        </div>
        <span className="rounded-full border-2 border-white/60 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          Reçu
        </span>
      </div>

      <div className="px-6 py-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-bold text-ink">Reçu de paiement</h3>
          <span className="font-mono text-sm text-smoke">{payment.receiptNo}</span>
        </div>

        <dl className="space-y-2.5 text-sm">
          <Row label="Émis à" value={payment.studentName} />
          <Row label="Libellé" value={payment.label} />
          <Row label="Montant" value={<span className="font-display text-lg font-extrabold text-ink">{formatCurrency(payment.amount)}</span>} />
          <Row label="Date de paiement" value={payment.paidDate ? formatDate(payment.paidDate) : '—'} />
          <Row label="Méthode" value={payment.method ? METHOD_LABEL[payment.method] : '—'} />
        </dl>

        <div className="mt-6 flex items-end justify-between border-t-2 border-dashed border-line pt-4">
          <p className="max-w-[60%] text-xs text-smoke">{template.footerText}</p>
          {template.showSignature &&
          <div className="text-right">
              <div className="mb-1 h-10 w-32 rounded-lg border-2 border-line" />
              <p className="text-[11px] font-semibold text-smoke">Signature & cachet</p>
            </div>
          }
        </div>
      </div>
    </div>);

}

function Row({ label, value }: {label: string;value: React.ReactNode;}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-2">
      <dt className="text-xs font-bold uppercase tracking-wide text-smoke">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>);

}