import React, { useState } from 'react';
import { SaveIcon, FileTextIcon, DownloadIcon, RotateCcwIcon, ImageIcon, PenLineIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Field, Input, Select, Textarea } from '../../components/ui/Field';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { useStore } from '../../store/useStore';
import type { DocumentTemplate, Establishment } from '../../store/types';
import { exportToJSON, timestampedName } from '../../utils/export';

const TYPE_OPTIONS = [
{ v: 'ecole', l: 'École' },
{ v: 'institut', l: 'Institut' },
{ v: 'universite', l: 'Université' },
{ v: 'centre', l: 'Centre de formation' }];

const HEADER_COLORS = ['#5B3FA8', '#1F9E8F', '#FF6B4A', '#F5B301', '#8CC000', '#161512'];

export function Settings() {
  const store = useStore();
  const { establishment, templates, updateEstablishment, updateTemplate, resetData } = store;
  const toast = useToast();
  const [est, setEst] = useState<Establishment>(establishment);
  const [activeTpl, setActiveTpl] = useState<string>(templates[0]?.id ?? '');
  const [reset, setReset] = useState(false);

  const tpl = templates.find((t) => t.id === activeTpl);

  const saveEst = (e: React.FormEvent) => {
    e.preventDefault();
    updateEstablishment(est);
    toast('Établissement mis à jour.');
  };

  const patchTpl = (patch: Partial<DocumentTemplate>) => {
    if (tpl) updateTemplate(tpl.id, patch);
  };

  const exportAll = () => {
    exportToJSON(
      {
        establishment: store.establishment,
        students: store.students,
        teachers: store.teachers,
        enrollments: store.enrollments,
        payments: store.payments,
        grades: store.grades,
        events: store.events,
        absences: store.absences,
        templates: store.templates
      } as never,
      timestampedName('sauvegarde_complete')
    );
    toast('Sauvegarde complète exportée.');
  };

  return (
    <div>
      <PageHeader
        eyebrow="Paramètres"
        title="Paramètres & documents"
        description="Configurez votre établissement et personnalisez vos modèles de documents."
        actions={<Button variant="outline" onClick={exportAll}><DownloadIcon className="h-4 w-4" /> Sauvegarde complète</Button>} />
      

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Establishment */}
        <form onSubmit={saveEst} className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm">
          <h2 className="mb-4 font-display text-lg font-bold">Établissement</h2>
          <div className="space-y-4">
            <Field label="Nom"><Input value={est.name} onChange={(e) => setEst({ ...est, name: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type">
                <Select value={est.type} onChange={(e) => setEst({ ...est, type: e.target.value as never })}>
                  {TYPE_OPTIONS.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                </Select>
              </Field>
              <Field label="Ville"><Input value={est.city} onChange={(e) => setEst({ ...est, city: e.target.value })} /></Field>
            </div>
            <Field label="Directeur / Directrice"><Input value={est.director} onChange={(e) => setEst({ ...est, director: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail"><Input type="email" value={est.email} onChange={(e) => setEst({ ...est, email: e.target.value })} /></Field>
              <Field label="Téléphone"><Input value={est.phone} onChange={(e) => setEst({ ...est, phone: e.target.value })} /></Field>
            </div>
          </div>
          <div className="mt-5">
            <Button type="submit"><SaveIcon className="h-4 w-4" /> Enregistrer</Button>
          </div>
        </form>

        {/* Document config */}
        <div className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm">
          <h2 className="mb-1 font-display text-lg font-bold">Modèles de documents</h2>
          <p className="mb-4 text-sm text-smoke">Personnalisez l'aperçu de vos documents officiels.</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {templates.map((t) =>
            <button
              key={t.id}
              onClick={() => setActiveTpl(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors ${activeTpl === t.id ? 'border-ink bg-lime' : 'border-line bg-paper text-smoke hover:border-ink'}`}>
              
                <FileTextIcon className="h-3.5 w-3.5" /> {t.name}
              </button>
            )}
          </div>

          {tpl &&
          <div className="space-y-4">
              <Field label="Nom du modèle"><Input value={tpl.name} onChange={(e) => patchTpl({ name: e.target.value })} /></Field>
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-smoke">Couleur d'en-tête</p>
                <div className="flex flex-wrap gap-2">
                  {HEADER_COLORS.map((c) =>
                <button
                  key={c}
                  onClick={() => patchTpl({ headerColor: c })}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${tpl.headerColor === c ? 'border-ink ring-2 ring-plum ring-offset-2' : 'border-ink'}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Couleur ${c}`} />

                )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <ToggleChip icon={ImageIcon} label="Afficher le logo" on={tpl.showLogo} onClick={() => patchTpl({ showLogo: !tpl.showLogo })} />
                <ToggleChip icon={PenLineIcon} label="Zone de signature" on={tpl.showSignature} onClick={() => patchTpl({ showSignature: !tpl.showSignature })} />
              </div>
              <Field label="Texte de pied de page"><Textarea value={tpl.footerText} onChange={(e) => patchTpl({ footerText: e.target.value })} /></Field>

              {/* live preview */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-smoke">Aperçu en direct</p>
                <div className="overflow-hidden rounded-xl border-2 border-ink bg-white">
                  <div className="flex items-center justify-between px-4 py-3 text-white" style={{ backgroundColor: tpl.headerColor }}>
                    <span className="flex items-center gap-2 font-display text-sm font-bold">
                      {tpl.showLogo && <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/50 bg-white/20 text-[10px]">◆</span>}
                      {establishment.name}
                    </span>
                    <Badge tone="ink">{tpl.type}</Badge>
                  </div>
                  <div className="space-y-1.5 px-4 py-4">
                    <p className="font-display text-sm font-bold">{tpl.name}</p>
                    {tpl.fields.map((f) =>
                  <div key={f} className="flex justify-between border-b border-line pb-1 text-xs">
                        <span className="text-smoke">{f}</span>
                        <span className="font-mono text-ink">—</span>
                      </div>
                  )}
                    <div className="flex items-end justify-between pt-2">
                      <p className="max-w-[60%] text-[10px] text-smoke">{tpl.footerText}</p>
                      {tpl.showSignature && <div className="h-8 w-24 rounded border-2 border-line" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-xl2 border-2 border-coral bg-coral-soft p-6">
        <h2 className="font-display text-lg font-bold">Réinitialiser les données</h2>
        <p className="mt-1 text-sm text-ink/80">
          Restaure les données de démonstration. Toutes vos modifications seront perdues.
        </p>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setReset(true)}><RotateCcwIcon className="h-4 w-4" /> Réinitialiser</Button>
        </div>
      </div>

      <ConfirmDialog
        open={reset}
        onClose={() => setReset(false)}
        onConfirm={() => {resetData();setEst(useStore.getState().establishment);toast('Données réinitialisées.');}}
        title="Réinitialiser toutes les données"
        message="Cette action restaure les données de démonstration et efface toutes vos saisies. Continuer ?" />
      
    </div>);

}

function ToggleChip({ icon: Icon, label, on, onClick }: {icon: React.ElementType;label: string;on: boolean;onClick: () => void;}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors ${on ? 'border-ink bg-lime text-ink' : 'border-line bg-paper text-smoke hover:border-ink'}`}>
      
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>);

}