import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCapIcon,
  CreditCardIcon,
  UsersIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  DownloadIcon,
  CalendarClockIcon } from
'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell } from
'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/app/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDate } from '../../utils/format';
import { exportToCSV, timestampedName } from '../../utils/export';

const PIE_COLORS = ['#5B3FA8', '#1F9E8F', '#F5B301', '#FF6B4A', '#8CC000', '#B6E82E'];

export function Dashboard() {
  const { students, teachers, payments, enrollments, absences, grades } = useStore();

  const stats = useMemo(() => {
    const active = students.filter((s) => s.status === 'actif').length;
    const collected = payments.filter((p) => p.status === 'paye').reduce((a, p) => a + p.amount, 0);
    const late = payments.filter((p) => p.status === 'en_retard').length;
    return { active, collected, late, teachers: teachers.length };
  }, [students, payments, teachers]);

  const revenueByMonth = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
    const map = new Map<number, number>();
    payments.
    filter((p) => p.status === 'paye' && p.paidDate).
    forEach((p) => {
      const m = new Date(p.paidDate!).getMonth();
      map.set(m, (map.get(m) ?? 0) + p.amount);
    });
    return months.map((label, i) => ({ label, montant: map.get(i) ?? 0 }));
  }, [payments]);

  const programDist = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => map.set(s.program, (map.get(s.program) ?? 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [students]);

  const recentEnroll = enrollments.slice(0, 5);
  const pendingAbs = absences.filter((a) => a.status === 'en_attente').slice(0, 4);
  const avgGrade =
  grades.length > 0 ?
  (grades.reduce((a, g) => a + g.score / g.outOf * 20, 0) / grades.length).toFixed(1) :
  '—';

  const exportOverview = () => {
    exportToCSV(
      [
      { indicateur: 'Apprenants actifs', valeur: stats.active },
      { indicateur: 'Encaissé (€)', valeur: stats.collected },
      { indicateur: 'Paiements en retard', valeur: stats.late },
      { indicateur: 'Enseignants', valeur: stats.teachers },
      { indicateur: 'Moyenne générale /20', valeur: avgGrade }],

      [
      { key: 'indicateur', label: 'Indicateur' },
      { key: 'valeur', label: 'Valeur' }],

      timestampedName('synthese_etablissement')
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        description="La santé de votre établissement en un coup d'œil, en temps réel."
        actions={
        <Button variant="outline" onClick={exportOverview}>
            <DownloadIcon className="h-4 w-4" /> Exporter la synthèse
          </Button>
        } />
      

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={GraduationCapIcon} label="Apprenants actifs" value={String(stats.active)} color="#5B3FA8" trend={{ dir: 'up', value: '+8%' }} delay={0} />
        <StatCard icon={CreditCardIcon} label="Encaissé cette année" value={formatCurrency(stats.collected)} color="#1F9E8F" trend={{ dir: 'up', value: '+12%' }} delay={0.05} />
        <StatCard icon={AlertTriangleIcon} label="Paiements en retard" value={String(stats.late)} color="#FF6B4A" trend={{ dir: 'down', value: '-3%' }} delay={0.1} />
        <StatCard icon={UsersIcon} label="Enseignants" value={String(stats.teachers)} color="#F5B301" delay={0.15} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Encaissements par mois</h2>
            <Badge tone="teal">Année en cours</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#E4DFD3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B675E' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B675E' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#EAF7C4' }}
                  contentStyle={{ borderRadius: 12, border: '2px solid #161512', fontSize: 13 }}
                  formatter={(v: number) => [formatCurrency(v), 'Montant']} />
                
                <Bar dataKey="montant" fill="#5B3FA8" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm">
          <h2 className="mb-2 font-display text-lg font-bold">Répartition par filière</h2>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="#161512" strokeWidth={2}>
                  {programDist.map((_, i) =>
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  )}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '2px solid #161512', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1">
            {programDist.slice(0, 4).map((p, i) =>
            <li key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-smoke">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {p.name}
                </span>
                <span className="font-bold">{p.value}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Dernières inscriptions</h2>
            <Link to="/app/inscriptions" className="inline-flex items-center gap-1 text-sm font-semibold text-plum hover:underline">
              Tout voir <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentEnroll.map((e) =>
            <li key={e.id} className="flex items-center gap-3">
                <Avatar name={e.studentName} color="#5B3FA8" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{e.studentName}</p>
                  <p className="truncate text-xs text-smoke">{e.program}</p>
                </div>
                <span className="text-xs text-smoke">{formatDate(e.requestedAt)}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-xl2 border-2 border-ink bg-paper p-6 shadow-hard-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Absences à traiter</h2>
            <Link to="/app/absences" className="inline-flex items-center gap-1 text-sm font-semibold text-plum hover:underline">
              Tout voir <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          {pendingAbs.length === 0 ?
          <p className="py-8 text-center text-sm text-smoke">Aucune absence en attente. 🎉</p> :

          <ul className="space-y-3">
              {pendingAbs.map((a) =>
            <li key={a.id} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-coral-soft">
                    <CalendarClockIcon className="h-4 w-4 text-coral" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.personName}</p>
                    <p className="truncate text-xs text-smoke">
                      {a.kind === 'retard' ? 'Retard' : 'Absence'} · {formatDate(a.date)}
                    </p>
                  </div>
                  <Badge tone="gold">En attente</Badge>
                </li>
            )}
            </ul>
          }
        </div>
      </div>
    </div>);

}