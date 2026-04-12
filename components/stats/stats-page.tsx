'use client';

import { useMemo } from 'react';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { Users, TrendingUp, AlertTriangle, ThumbsUp } from 'lucide-react';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  blue:    '#3b82f6',
  emerald: '#10b981',
  amber:   '#f59e0b',
  rose:    '#f43f5e',
  violet:  '#8b5cf6',
  orange:  '#f97316',
  cyan:    '#06b6d4',
  slate:   '#94a3b8',
  teal:    '#14b8a6',
  pink:    '#ec4899',
};
const PIE_COLORS = [C.blue, C.emerald, C.amber, C.rose, C.violet, C.orange, C.cyan, C.slate];

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '13px',
  },
};

const AGE_BINS = [
  { label: '< 20 ans',  min: 0,  max: 19  },
  { label: '20–24 ans', min: 20, max: 24  },
  { label: '25–29 ans', min: 25, max: 29  },
  { label: '30–34 ans', min: 30, max: 34  },
  { label: '35–39 ans', min: 35, max: 39  },
  { label: '≥ 40 ans',  min: 40, max: 999 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const pct = (n: number, total: number) =>
  total > 0 ? `${Math.round((n / total) * 100)}%` : '0%';

const pctN = (n: number, total: number) =>
  total > 0 ? Math.round((n / total) * 100) : 0;

const count = (arr: boolean[]) => arr.filter(Boolean).length;

function countBy<T>(items: T[], key: (item: T) => string): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const k = key(item) || 'Non renseigné';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10;
}

function quantile(sorted: number[], q: number) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined)
    return Math.round((sorted[base] + rest * (sorted[base + 1] - sorted[base])) * 10) / 10;
  return Math.round(sorted[base] * 10) / 10;
}

/** Returns the item with the highest .value in an array */
function topVal<T extends { value: number }>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr.reduce((a, b) => b.value > a.value ? b : a);
}

/** Returns the item with the highest .count in an array */
function topCount<T extends { count: number }>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr.reduce((a, b) => b.count > a.count ? b : a);
}

const renderPieLabel = ({ percent }: { percent: number }) =>
  percent > 0.05 ? `${Math.round(percent * 100)}%` : '';

// ── UI Primitives ─────────────────────────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
      Pas encore de données
    </div>
  );
}

/** Highlighted analysis block rendered below each chart */
function Analysis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 text-sm">
      <span className="font-semibold text-blue-700 dark:text-blue-300">Analyse — </span>
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

function StatTable({
  rows, total, categoryLabel = 'Modalité',
}: {
  rows: { name: string; value: number }[];
  total: number;
  categoryLabel?: string;
}) {
  return (
    <div className="overflow-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-b">
            <th className="text-left px-3 py-2 font-medium">{categoryLabel}</th>
            <th className="text-right px-3 py-2 font-medium">n</th>
            <th className="text-right px-3 py-2 font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
              <td className="px-3 py-1.5">{row.name}</td>
              <td className="text-right px-3 py-1.5">{row.value}</td>
              <td className="text-right px-3 py-1.5">{pct(row.value, total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-muted/50 font-semibold border-t">
            <td className="px-3 py-1.5">Total</td>
            <td className="text-right px-3 py-1.5">{total}</td>
            <td className="text-right px-3 py-1.5">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function KpiCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: string | number; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <Card style={{ borderLeftColor: color }} className="border-l-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full p-1.5" style={{ background: color + '22' }} aria-hidden>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function Section({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TableAndPie({
  data, total, categoryLabel, colors,
}: {
  data: { name: string; value: number }[];
  total: number;
  categoryLabel?: string;
  colors?: string[];
}) {
  const cls = colors ?? PIE_COLORS;
  const hasData = data.some((d) => d.value > 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <StatTable rows={data} total={total} categoryLabel={categoryLabel} />
      {!hasData ? <EmptyChart /> : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
              paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
              {data.map((_, i) => <Cell key={i} fill={cls[i % cls.length]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, total)})`, '']} />
            <Legend iconType="circle" iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function TableAndBar({
  data, total, xKey, valueKey = 'value', categoryLabel, fill = C.blue,
}: {
  data: Record<string, any>[];
  total: number;
  xKey: string;
  valueKey?: string;
  categoryLabel?: string;
  fill?: string;
}) {
  const rows = data.map((d) => ({ name: String(d[xKey]), value: Number(d[valueKey]) }));
  const hasData = rows.some((d) => d.value > 0);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <StatTable rows={rows} total={total} categoryLabel={categoryLabel} />
      {!hasData ? <EmptyChart /> : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, total)})`, 'Effectif']} />
            <Bar dataKey={valueKey} name="Effectif" fill={fill} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export function StatsPage() {
  const { patients } = useData();
  const n = patients.length;

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const kpi = useMemo(() => {
    if (!n) return null;
    const ages = patients.map((p) => p.age).filter(Boolean);
    const satisfied = patients.filter(
      (p) => p.satisfactionPatiente === 'Très satisfaite' || p.satisfactionPatiente === 'Satisfaite'
    ).length;
    const withComplication = patients.filter(
      (p) =>
        p.complicationsPostPartum?.cephaleesPostPonction ||
        p.complicationsPostPartum?.infectionSitePonction ||
        p.complicationsPostPartum?.douleursLombairesPersistantes ||
        p.complicationsPostPartum?.autres
    ).length;
    return {
      agesMoy: avg(ages),
      tauxSatisfaction: pct(satisfied, n),
      tauxComplications: pct(withComplication, n),
    };
  }, [patients, n]);

  // ── Évolution temporelle ───────────────────────────────────────────────────
  const evolutionData = useMemo(() => {
    const map: Record<string, number> = {};
    patients.forEach((p) => {
      if (!p.date) return;
      const d = new Date(p.date);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mois, total], i, arr) => ({
        mois: mois.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => `${months[parseInt(m) - 1]} ${y}`),
        patients: total,
        cumul: arr.slice(0, i + 1).reduce((s, [, v]) => s + v, 0),
      }));
  }, [patients]);

  // ══ DÉMOGRAPHIE ════════════════════════════════════════════════════════════
  const ageData = useMemo(() =>
    AGE_BINS.map(({ label, min, max }) => ({
      tranche: label,
      count: patients.filter((p) => p.age >= min && p.age <= max).length,
    })), [patients]);

  const gestiteData = useMemo(() => [
    { gestite: 'Primigeste (G1)', count: patients.filter((p) => p.antecedentsObstetricaux?.gestite === 1).length },
    { gestite: 'Deuxigeste (G2)', count: patients.filter((p) => p.antecedentsObstetricaux?.gestite === 2).length },
    { gestite: 'Troisigeste (G3)', count: patients.filter((p) => p.antecedentsObstetricaux?.gestite === 3).length },
    { gestite: '≥ G4', count: patients.filter((p) => (p.antecedentsObstetricaux?.gestite ?? 0) >= 4).length },
  ], [patients]);

  const pariteData = useMemo(() => [
    { parite: 'Primipare (P0)',          count: patients.filter((p) => p.antecedentsObstetricaux?.parite === 0).length },
    { parite: 'Paucipare (P1)',          count: patients.filter((p) => p.antecedentsObstetricaux?.parite === 1).length },
    { parite: 'Multipare (P2)',          count: patients.filter((p) => p.antecedentsObstetricaux?.parite === 2).length },
    { parite: 'Grande multipare (≥ P3)', count: patients.filter((p) => (p.antecedentsObstetricaux?.parite ?? -1) >= 3).length },
  ], [patients]);

  const antecedentsPresenceData = useMemo(() => {
    const avec = patients.filter(
      (p) => p.antecedentsMedicaux?.hypertension || p.antecedentsMedicaux?.diabete ||
             p.antecedentsMedicaux?.asthme || p.antecedentsMedicaux?.autres
    ).length;
    return [
      { name: 'Avec antécédents',  value: avec     },
      { name: 'Sans antécédents', value: n - avec  },
    ];
  }, [patients, n]);

  const antecedentsData = useMemo(() => [
    { name: 'Hypertension', value: count(patients.map((p) => p.antecedentsMedicaux?.hypertension)) },
    { name: 'Diabète',      value: count(patients.map((p) => p.antecedentsMedicaux?.diabete))      },
    { name: 'Asthme',       value: count(patients.map((p) => p.antecedentsMedicaux?.asthme))       },
    { name: 'Autres',       value: count(patients.map((p) => p.antecedentsMedicaux?.autres))       },
  ], [patients]);

  // ══ TRAVAIL & ANALGÉSIE ════════════════════════════════════════════════════
  const bishopData = useMemo(() =>
    countBy(patients.filter((p) => p.scoreBishop), (p) => p.scoreBishop), [patients]);
  const nBishop = useMemo(() => patients.filter((p) => p.scoreBishop).length, [patients]);

  const evsAvantData = useMemo(() => [
    { tranche: 'EVS 0–2', count: patients.filter((p) => { const v = p.efficaciteAnalgesique?.evaAvantAnalgesie; return typeof v === 'number' && v <= 2; }).length },
    { tranche: 'EVS 3–4', count: patients.filter((p) => { const v = p.efficaciteAnalgesique?.evaAvantAnalgesie; return typeof v === 'number' && v >= 3 && v <= 4; }).length },
    { tranche: 'EVS 5–6', count: patients.filter((p) => { const v = p.efficaciteAnalgesique?.evaAvantAnalgesie; return typeof v === 'number' && v >= 5 && v <= 6; }).length },
    { tranche: 'EVS 7–8', count: patients.filter((p) => { const v = p.efficaciteAnalgesique?.evaAvantAnalgesie; return typeof v === 'number' && v >= 7 && v <= 8; }).length },
    { tranche: 'EVS 9–10', count: patients.filter((p) => { const v = p.efficaciteAnalgesique?.evaAvantAnalgesie; return typeof v === 'number' && v >= 9; }).length },
  ], [patients]);
  const nEvsAvant = useMemo(() => patients.filter((p) => p.efficaciteAnalgesique?.evaAvantAnalgesie !== undefined).length, [patients]);

  const delaiData = useMemo(() => [
    { tranche: '0–15 min',  count: patients.filter((p) => { const d = p.delaiDemandePose; return typeof d === 'number' && d <= 15; }).length },
    { tranche: '15–30 min', count: patients.filter((p) => { const d = p.delaiDemandePose; return typeof d === 'number' && d >= 16 && d <= 30; }).length },
    { tranche: '30–60 min', count: patients.filter((p) => { const d = p.delaiDemandePose; return typeof d === 'number' && d >= 31 && d <= 60; }).length },
    { tranche: '1–2 h',     count: patients.filter((p) => { const d = p.delaiDemandePose; return typeof d === 'number' && d >= 61 && d <= 120; }).length },
    { tranche: '> 2 h',     count: patients.filter((p) => { const d = p.delaiDemandePose; return typeof d === 'number' && d >= 121; }).length },
  ], [patients]);
  const nDelai = useMemo(() => patients.filter((p) => typeof p.delaiDemandePose === 'number').length, [patients]);

  const niveauPonctionData = useMemo(() =>
    countBy(patients.filter((p) => p.niveauPonction), (p) => p.niveauPonction), [patients]);
  const nNiveauPonction = useMemo(() => patients.filter((p) => p.niveauPonction).length, [patients]);

  const nombrePonctionData = useMemo(() => {
    const withData = patients.filter((p) => typeof p.nombrePonction === 'number');
    return [
      { label: '1 ponction',  count: withData.filter((p) => p.nombrePonction === 1).length },
      { label: '2 ponctions', count: withData.filter((p) => p.nombrePonction === 2).length },
      { label: '3 ponctions', count: withData.filter((p) => p.nombrePonction === 3).length },
    ];
  }, [patients]);
  const nPonctions = useMemo(() => patients.filter((p) => typeof p.nombrePonction === 'number').length, [patients]);

  const niveauSensitifData = useMemo(() =>
    countBy(patients.filter((p) => p.niveauSensitif), (p) => p.niveauSensitif), [patients]);
  const nNiveauSensitif = useMemo(() => patients.filter((p) => p.niveauSensitif).length, [patients]);

  const entretienData = useMemo(() =>
    countBy(patients.filter((p) => p.vitesseDebut), (p) => p.vitesseDebut), [patients]);
  const nEntretien = useMemo(() => patients.filter((p) => p.vitesseDebut).length, [patients]);

  const nombreReinjectionData = useMemo(() => {
    const withData = patients.filter((p) => p.efficaciteAnalgesique?.nombreReinjections !== undefined);
    return [
      { label: '0 réinjection',    count: withData.filter((p) => p.efficaciteAnalgesique?.nombreReinjections === 0).length },
      { label: '1 réinjection',    count: withData.filter((p) => p.efficaciteAnalgesique?.nombreReinjections === 1).length },
      { label: '2 réinjections',   count: withData.filter((p) => p.efficaciteAnalgesique?.nombreReinjections === 2).length },
      { label: '≥ 3 réinjections', count: withData.filter((p) => (p.efficaciteAnalgesique?.nombreReinjections ?? 0) >= 3).length },
    ];
  }, [patients]);
  const nReinjections = useMemo(() =>
    patients.filter((p) => p.efficaciteAnalgesique?.nombreReinjections !== undefined).length, [patients]);

  const succesEchecData = useMemo(() => {
    const echec  = patients.filter((p) => p.difficultesTechniques?.echecPonction).length;
    return [
      { name: 'Succès',            value: n - echec },
      { name: 'Échec de ponction', value: echec     },
    ];
  }, [patients, n]);

  const effetsData = useMemo(() => [
    { name: 'Hypotension',          value: count(patients.map((p) => p.effetsSecondaires?.hypotension))         },
    { name: 'Prurit',               value: count(patients.map((p) => p.effetsSecondaires?.prurit))              },
    { name: 'Nausées/Vomissements', value: count(patients.map((p) => p.effetsSecondaires?.nauseesVomissements)) },
    { name: 'Rétention urinaire',   value: count(patients.map((p) => p.effetsSecondaires?.retentionUrinaire))   },
    { name: 'Autres',               value: count(patients.map((p) => p.effetsSecondaires?.autres))              },
  ], [patients]);

  // ══ ACCOUCHEMENT & NÉONATAL ════════════════════════════════════════════════
  const modeAccouchementData = useMemo(() =>
    countBy(patients, (p) => p.modeAccouchement || 'Non renseigné'), [patients]);

  const nCesarienne = useMemo(() => patients.filter((p) => p.modeAccouchement === 'Césarienne').length, [patients]);
  const nInstrumental = useMemo(() => patients.filter((p) => p.modeAccouchement === 'Extraction instrumentale').length, [patients]);

  const cesarienneData = useMemo(() => [
    { name: 'Conversion en césarienne', value: nCesarienne     },
    { name: 'Accouchement voie basse',  value: n - nCesarienne },
  ], [nCesarienne, n]);

  const indicationCesData = useMemo(() => {
    const cesPatients = patients.filter((p) => p.modeAccouchement === 'Césarienne' && p.indicationCesarienne);
    return countBy(cesPatients, (p) => p.indicationCesarienne || 'Non précisée');
  }, [patients]);

  const manoeuvresData = useMemo(() => {
    const instrPatients = patients.filter((p) => p.modeAccouchement === 'Extraction instrumentale' && p.typeExtraction);
    return countBy(instrPatients, (p) => p.typeExtraction || 'Non précisée');
  }, [patients]);

  const phase1Data = useMemo(() => [
    { tranche: '< 2 h',  count: patients.filter((p) => { const v = p.dureeTravail?.phaseLatente; return typeof v === 'number' && v > 0 && v < 2; }).length },
    { tranche: '2–4 h',  count: patients.filter((p) => { const v = p.dureeTravail?.phaseLatente; return typeof v === 'number' && v >= 2 && v <= 4; }).length },
    { tranche: '4–6 h',  count: patients.filter((p) => { const v = p.dureeTravail?.phaseLatente; return typeof v === 'number' && v > 4 && v <= 6; }).length },
    { tranche: '6–8 h',  count: patients.filter((p) => { const v = p.dureeTravail?.phaseLatente; return typeof v === 'number' && v > 6 && v <= 8; }).length },
    { tranche: '> 8 h',  count: patients.filter((p) => { const v = p.dureeTravail?.phaseLatente; return typeof v === 'number' && v > 8; }).length },
  ], [patients]);
  const nPhase1 = useMemo(() => patients.filter((p) => (p.dureeTravail?.phaseLatente ?? 0) > 0).length, [patients]);

  const phase2Data = useMemo(() => [
    { tranche: '< 15 min',  count: patients.filter((p) => { const v = p.dureeDeuxiemePhase; return typeof v === 'number' && v > 0 && v < 15; }).length },
    { tranche: '15–30 min', count: patients.filter((p) => { const v = p.dureeDeuxiemePhase; return typeof v === 'number' && v >= 15 && v <= 30; }).length },
    { tranche: '30–60 min', count: patients.filter((p) => { const v = p.dureeDeuxiemePhase; return typeof v === 'number' && v > 30 && v <= 60; }).length },
    { tranche: '1–2 h',     count: patients.filter((p) => { const v = p.dureeDeuxiemePhase; return typeof v === 'number' && v > 60 && v <= 120; }).length },
    { tranche: '> 2 h',     count: patients.filter((p) => { const v = p.dureeDeuxiemePhase; return typeof v === 'number' && v > 120; }).length },
  ], [patients]);
  const nPhase2 = useMemo(() => patients.filter((p) => (p.dureeDeuxiemePhase ?? 0) > 0).length, [patients]);

  const blocMoteurData = useMemo(() =>
    countBy(patients.filter((p) => p.blocMoteur), (p) => p.blocMoteur), [patients]);
  const nBlocMoteur = useMemo(() => patients.filter((p) => p.blocMoteur).length, [patients]);

  const apgar1Data = useMemo(() => [
    { tranche: '0–3 (sévère)',  count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar1); return !isNaN(v) && v <= 3; }).length },
    { tranche: '4–6 (modéré)', count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar1); return !isNaN(v) && v >= 4 && v <= 6; }).length },
    { tranche: '7–10 (normal)',count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar1); return !isNaN(v) && v >= 7; }).length },
  ], [patients]);
  const nApgar1 = useMemo(() => patients.filter((p) => p.etatNouveauNe?.apgar1 && !isNaN(parseFloat(p.etatNouveauNe.apgar1))).length, [patients]);

  const apgar5Data = useMemo(() => [
    { tranche: '0–3 (sévère)',  count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar5); return !isNaN(v) && v <= 3; }).length },
    { tranche: '4–6 (modéré)', count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar5); return !isNaN(v) && v >= 4 && v <= 6; }).length },
    { tranche: '7–10 (normal)',count: patients.filter((p) => { const v = parseFloat(p.etatNouveauNe?.apgar5); return !isNaN(v) && v >= 7; }).length },
  ], [patients]);
  const nApgar5 = useMemo(() => patients.filter((p) => p.etatNouveauNe?.apgar5 && !isNaN(parseFloat(p.etatNouveauNe.apgar5))).length, [patients]);

  const poidsStats = useMemo(() => {
    const vals = patients.map((p) => parseFloat(p.etatNouveauNe?.poids)).filter((v) => !isNaN(v) && v > 0).sort((a, b) => a - b);
    if (!vals.length) return null;
    return { n: vals.length, min: vals[0], q1: quantile(vals, 0.25), median: quantile(vals, 0.5), mean: avg(vals), q3: quantile(vals, 0.75), max: vals[vals.length - 1] };
  }, [patients]);

  const poidsData = useMemo(() => [
    { tranche: '< 2500 g',    count: patients.filter((p) => { const w = parseFloat(p.etatNouveauNe?.poids); return !isNaN(w) && w < 2500; }).length },
    { tranche: '2500–3000 g', count: patients.filter((p) => { const w = parseFloat(p.etatNouveauNe?.poids); return !isNaN(w) && w >= 2500 && w <= 3000; }).length },
    { tranche: '3000–3500 g', count: patients.filter((p) => { const w = parseFloat(p.etatNouveauNe?.poids); return !isNaN(w) && w > 3000 && w <= 3500; }).length },
    { tranche: '3500–4000 g', count: patients.filter((p) => { const w = parseFloat(p.etatNouveauNe?.poids); return !isNaN(w) && w > 3500 && w <= 4000; }).length },
    { tranche: '> 4000 g',    count: patients.filter((p) => { const w = parseFloat(p.etatNouveauNe?.poids); return !isNaN(w) && w > 4000; }).length },
  ], [patients]);
  const nPoids = useMemo(() => patients.filter((p) => !isNaN(parseFloat(p.etatNouveauNe?.poids)) && parseFloat(p.etatNouveauNe?.poids) > 0).length, [patients]);

  const complicationsNeoData = useMemo(() =>
    countBy(patients.filter((p) => p.complicationsPostNatalNouveauNe), (p) => p.complicationsPostNatalNouveauNe), [patients]);
  const nComplicationsNeo = useMemo(() => patients.filter((p) => p.complicationsPostNatalNouveauNe).length, [patients]);

  // ══ SATISFACTION & CONNAISSANCES ══════════════════════════════════════════
  const connaissanceData = useMemo(() => [
    { name: 'Connaissait la péridurale (demande patient)',   value: patients.filter((p) => p.demandeAnalgesie === 'Patient').length        },
    { name: "Ne connaissait pas (proposé par l'équipe)",    value: patients.filter((p) => p.demandeAnalgesie === 'Équipe médicale').length },
  ].filter((d) => d.value > 0), [patients]);
  const nConnaissance = useMemo(() =>
    patients.filter((p) => p.demandeAnalgesie === 'Patient' || p.demandeAnalgesie === 'Équipe médicale').length, [patients]);

  const connaissancePariteData = useMemo(() => {
    const bins = [{ label: 'P0', min:0,max:0 },{ label:'P1',min:1,max:1 },{ label:'P2',min:2,max:2 },{ label:'≥P3',min:3,max:99 }];
    return bins.map(({ label, min, max }) => {
      const g = patients.filter((p) => { const v = p.antecedentsObstetricaux?.parite; return typeof v === 'number' && v >= min && v <= max; });
      return { parite: label, connaissait: g.filter((p) => p.demandeAnalgesie === 'Patient').length, neConnaissaitPas: g.filter((p) => p.demandeAnalgesie === 'Équipe médicale').length, total: g.length };
    }).filter((d) => d.total > 0);
  }, [patients]);

  const acceptabiliteData = useMemo(() => [
    { name: 'À la demande du patient',  value: patients.filter((p) => p.demandeAnalgesie === 'Patient').length         },
    { name: 'Acceptée sur proposition', value: patients.filter((p) => p.demandeAnalgesie === 'Équipe médicale').length },
  ].filter((d) => d.value > 0), [patients]);

  const acceptabiliteAgeData = useMemo(() =>
    AGE_BINS.map(({ label, min, max }) => {
      const g = patients.filter((p) => p.age >= min && p.age <= max);
      return { tranche: label, demande: g.filter((p) => p.demandeAnalgesie === 'Patient').length, proposition: g.filter((p) => p.demandeAnalgesie === 'Équipe médicale').length, total: g.length };
    }).filter((d) => d.total > 0), [patients]);

  const evsEvolutionData = useMemo(() => {
    const pts = patients.filter((p) => p.efficaciteAnalgesique);
    if (!pts.length) return [];
    const vals = (key: keyof NonNullable<(typeof pts)[0]['efficaciteAnalgesique']>) =>
      pts.map((p) => p.efficaciteAnalgesique?.[key] as number).filter((v) => typeof v === 'number' && !isNaN(v));
    return [
      { temps: 'Avant',       moyenne: avg(vals('evaAvantAnalgesie')),    label: 'Avant analgésie'     },
      { temps: '15 min',      moyenne: avg(vals('eva15MinApres')),         label: '15 min après'        },
      { temps: '30 min',      moyenne: avg(vals('eva30MinApres')),         label: '30 min après'        },
      { temps: 'Réinjection', moyenne: avg(vals('evaDemandeReinjection')),label: 'Demande réinjection' },
    ].filter((d) => d.moyenne > 0);
  }, [patients]);

  const efficaciteData = useMemo(() => {
    const map: Record<string, number> = {};
    patients.forEach((p) => {
      const v = p.efficaciteAnalgesique?.efficaciteGlobale;
      if (!v) return;
      const label = v.charAt(0).toUpperCase() + v.slice(1);
      map[label] = (map[label] || 0) + 1;
    });
    return ['Excellente','Bonne','Modérée','Insuffisante'].filter((k) => map[k]).map((name) => ({ name, value: map[name] }));
  }, [patients]);
  const nEfficacite = useMemo(() => patients.filter((p) => p.efficaciteAnalgesique?.efficaciteGlobale).length, [patients]);

  const satisfactionData = useMemo(() =>
    countBy(patients, (p) => p.satisfactionPatiente || 'Non renseigné'), [patients]);

  const satisfactionPariteData = useMemo(() => {
    const bins = [{ label:'P0',min:0,max:0 },{ label:'P1',min:1,max:1 },{ label:'P2',min:2,max:2 },{ label:'≥P3',min:3,max:99 }];
    return bins.map(({ label, min, max }) => {
      const g = patients.filter((p) => { const v = p.antecedentsObstetricaux?.parite; return typeof v === 'number' && v >= min && v <= max; });
      return {
        parite: label,
        'Très satisfaite': g.filter((p) => p.satisfactionPatiente === 'Très satisfaite').length,
        'Satisfaite':      g.filter((p) => p.satisfactionPatiente === 'Satisfaite').length,
        'Neutre':          g.filter((p) => p.satisfactionPatiente === 'Neutre').length,
        'Insatisfaite':    g.filter((p) => p.satisfactionPatiente === 'Insatisfaite').length,
        total:             g.length,
      };
    }).filter((d) => d.total > 0);
  }, [patients]);

  // ══ ANALYSES DYNAMIQUES ════════════════════════════════════════════════════
  const analyses = useMemo(() => {
    if (!n) return {} as Record<string, string>;

    // helpers
    const tC = <T extends { count: number }>(arr: T[]) => arr.length ? arr.reduce((a, b) => b.count > a.count ? b : a) : null;
    const tV = <T extends { value: number }>(arr: T[]) => arr.length ? arr.reduce((a, b) => b.value > a.value ? b : a) : null;

    // Âge
    const topAge = tC(ageData);
    const ageRange2034 = ageData.filter((d) => ['20–24 ans','25–29 ans','30–34 ans'].includes(d.tranche)).reduce((s, d) => s + d.count, 0);
    const ageMoy = avg(patients.map((p) => p.age).filter(Boolean));

    // Gestité
    const primigeste = gestiteData[0].count;
    const topGestite = tC(gestiteData);
    const gestVals = patients.map((p) => p.antecedentsObstetricaux?.gestite).filter((v): v is number => typeof v === 'number' && v > 0);

    // Parité
    const primipare = pariteData[0].count;

    // Antécédents
    const avecAnt = antecedentsPresenceData[0].value;
    const topAnt = tV(antecedentsData.filter((d) => d.name !== 'Autres'));

    // Bishop
    const topBishop = tV(bishopData);

    // EVS avant
    const evsHaute = (evsAvantData.find((d) => d.tranche === 'EVS 7–8')?.count ?? 0) + (evsAvantData.find((d) => d.tranche === 'EVS 9–10')?.count ?? 0);
    const topEvsAvant = tC(evsAvantData);

    // Délai
    const topDelai = tC(delaiData);
    const delai30 = (delaiData.find((d) => d.tranche === '0–15 min')?.count ?? 0) + (delaiData.find((d) => d.tranche === '15–30 min')?.count ?? 0);

    // Ponctions
    const premiereTentative = nombrePonctionData[0].count;

    // Réinjections
    const sansReinjection = nombreReinjectionData[0].count;

    // Succès
    const succes = succesEchecData[0].value;

    // Effets secondaires
    const totalEffets = effetsData.reduce((s, d) => s + d.value, 0);
    const topEffet = tV(effetsData);

    // Césarienne
    const tauxCesar = pctN(nCesarienne, n);

    // Indications
    const topIndic = tV(indicationCesData);

    // Phases travail
    const topPhase1 = tC(phase1Data);
    const topPhase2 = tC(phase2Data);

    // Bloc moteur
    const avecBloc = nBlocMoteur;

    // Apgar
    const apgar1Normal = apgar1Data.find((d) => d.tranche === '7–10 (normal)')?.count ?? 0;
    const apgar5Normal = apgar5Data.find((d) => d.tranche === '7–10 (normal)')?.count ?? 0;

    // EVS évolution
    const evsAvant30 = evsEvolutionData.find((d) => d.temps === 'Avant')?.moyenne ?? 0;
    const evs30min   = evsEvolutionData.find((d) => d.temps === '30 min')?.moyenne ?? 0;
    const reduction  = evsAvant30 > 0 ? Math.round(((evsAvant30 - evs30min) / evsAvant30) * 100) : 0;

    // Efficacité
    const bonneExcellente = (efficaciteData.find((d) => d.name === 'Excellente')?.value ?? 0) + (efficaciteData.find((d) => d.name === 'Bonne')?.value ?? 0);

    // Satisfaction
    const satis = patients.filter((p) => p.satisfactionPatiente === 'Très satisfaite' || p.satisfactionPatiente === 'Satisfaite').length;

    // Connaissance
    const connaissait = patients.filter((p) => p.demandeAnalgesie === 'Patient').length;
    const neConnaissait = patients.filter((p) => p.demandeAnalgesie === 'Équipe médicale').length;

    // Satisfaction / parité — trouver le groupe le plus satisfait
    const bestSatParite = satisfactionPariteData.length
      ? satisfactionPariteData.reduce((a, b) => {
          const rA = (a['Très satisfaite'] + a['Satisfaite']) / (a.total || 1);
          const rB = (b['Très satisfaite'] + b['Satisfaite']) / (b.total || 1);
          return rB > rA ? b : a;
        })
      : null;

    return {
      age: topAge
        ? `La tranche d'âge la plus représentée est "${topAge.tranche}" (n = ${topAge.count}, ${pct(topAge.count, n)}). ${ageRange2034 > 0 ? `Les femmes âgées de 20 à 34 ans constituent ${pct(ageRange2034, n)} de la cohorte, ce qui correspond à la tranche de fertilité maximale. L'âge moyen est de ${ageMoy} ans.` : ''} Ces données sont comparables aux profils habituellement décrits dans les études sur l'analgésie péridurale obstétricale.`
        : '',

      gestite: topGestite
        ? `Les primigestes (G1) représentent ${pct(primigeste, n)} de la population (n = ${primigeste})${gestVals.length ? `, avec une gestité moyenne de ${avg(gestVals)}` : ''}. ${primigeste > n / 2 ? "La prédominance des primigestes est cohérente avec une population de primo-parturientes particulièrement demandeuses d'analgésie péridurale." : "La proportion significative de multigestes suggère que l'analgésie péridurale est également bien acceptée chez les femmes ayant déjà accouché."}` : '',

      parite: `Les primipares (P0) représentent ${pct(primipare, n)} de l'effectif (n = ${primipare}). ${primipare > n / 2 ? "Cette prédominance des primipares est classiquement retrouvée dans les études sur l'analgésie péridurale, car la primipare est souvent plus demandeuse d'analgésie en raison d'un travail plus long et d'une méconnaissance de la douleur obstétricale." : "La présence notable de multipares indique une bonne acceptabilité de la péridurale quel que soit l'antécédent obstétrical."}`,

      antecedentsPresence: `${pct(avecAnt, n)} des patientes (n = ${avecAnt}) présentaient au moins un antécédent médical. ${avecAnt > 0 ? "La présence d'antécédents ne contre-indique pas l'analgésie péridurale mais doit être prise en compte dans la prise en charge anesthésique." : "L'absence d'antécédents chez la grande majorité des patientes témoigne d'une population globalement saine."}`,

      antecedentsMedicaux: topAnt && topAnt.value > 0
        ? `L'antécédent médical le plus fréquemment retrouvé est "${topAnt.name}" (n = ${topAnt.value}, ${pct(topAnt.value, n)}). Ces antécédents ont pu orienter la conduite anesthésique et nécessiter une surveillance renforcée per et post-partum.`
        : "Aucun antécédent médical significatif n'a été enregistré dans cette cohorte.",

      bishop: topBishop
        ? `Le score de Bishop "${topBishop.name}" est le plus fréquemment enregistré à l'admission (n = ${topBishop.value}, ${pct(topBishop.value, nBishop)}). Ce paramètre reflète l'état du col utérin et conditionne la progression du travail ainsi que le moment optimal de mise en place de l'analgésie.`
        : '',

      evsAvant: nEvsAvant > 0
        ? `${pct(evsHaute, nEvsAvant)} des patientes (n = ${evsHaute}) présentaient une douleur intense (EVS ≥ 7) avant la mise en place de la péridurale. ${topEvsAvant ? `La classe EVS la plus représentée est "${topEvsAvant.tranche}" (${pct(topEvsAvant.count, nEvsAvant)}).` : ''} Ces niveaux de douleur élevés soulignent l'importance de l'analgésie péridurale comme réponse à une souffrance maternelle réelle.`
        : '',

      delai: topDelai
        ? `La tranche de délai la plus fréquente entre la demande et la pose est "${topDelai.tranche}" (n = ${topDelai.count}, ${pct(topDelai.count, nDelai)}). ${nDelai > 0 ? `${pct(delai30, nDelai)} des patientes ont bénéficié de la péridurale dans les 30 minutes suivant la demande.` : ''} Un délai court témoigne d'une organisation efficiente du bloc obstétrical.`
        : '',

      niveauPonction: niveauPonctionData.length > 0
        ? `Le niveau de ponction le plus utilisé est "${niveauPonctionData[0].name}" (n = ${niveauPonctionData[0].value}, ${pct(niveauPonctionData[0].value, nNiveauPonction)}). Le choix du niveau de ponction est guidé par l'anatomie de la patiente et les conditions opératoires afin d'optimiser la diffusion de l'analgésique.`
        : '',

      nombrePonctions: nPonctions > 0
        ? `La première tentative de ponction a été suffisante chez ${pct(premiereTentative, nPonctions)} des patientes (n = ${premiereTentative}). Un nombre réduit de tentatives est associé à moins d'inconfort pour la patiente et à un risque moindre de complications (ponction dure-mérienne, hématome).`
        : '',

      niveauSensitif: niveauSensitifData.length > 0
        ? `Le niveau sensitif le plus souvent obtenu est "${niveauSensitifData[0].name}" (n = ${niveauSensitifData[0].value}, ${pct(niveauSensitifData[0].value, nNiveauSensitif)}). L'étendue du bloc sensitif conditionne la qualité de l'analgésie et doit être équilibrée pour éviter un bloc moteur excessif.`
        : '',

      entretien: nEntretien > 0 && entretienData.length > 0
        ? `Le mode d'entretien "${entretienData[0].name}" est utilisé chez ${pct(entretienData[0].value, nEntretien)} des patientes. Le choix entre PSE et bolus influence la consommation totale d'anesthésique local et le confort maternel au cours du travail.`
        : '',

      reinjections: nReinjections > 0
        ? `${pct(sansReinjection, nReinjections)} des patientes (n = ${sansReinjection}) n'ont nécessité aucune réinjection complémentaire, témoignant d'une bonne durée d'action de la posologie initiale. Les patientes ayant requis des réinjections méritent une analyse de la cause (mobilisation, progression rapide du travail, fenêtres analgésiques).`
        : '',

      succesEchec: `Le taux de succès de la technique est de ${pct(succes, n)} (n = ${succes}). ${succes < n ? `${n - succes} échec(s) de ponction ont été enregistrés, soit ${pct(n - succes, n)} de la cohorte. Ces cas doivent être analysés en termes de facteurs techniques (obésité, cyphoscoliose, calcifications) ou d'expérience de l'opérateur.` : "L'absence d'échec de ponction dans cette cohorte reflète une bonne maîtrise technique."}`,

      effetsSecondaires: totalEffets > 0 && topEffet
        ? `${totalEffets} effets secondaires ont été enregistrés au total. L'effet le plus fréquent est "${topEffet.name}" (n = ${topEffet.value}, ${pct(topEffet.value, n)}). Ces effets, généralement bénins et transitoires, doivent être anticipés et traités rapidement pour garantir le confort et la sécurité maternelle.`
        : "Aucun effet secondaire n'a été rapporté dans cette cohorte.",

      cesarienne: `Le taux de conversion en césarienne est de ${tauxCesar}% (n = ${nCesarienne}). ${tauxCesar < 20 ? "Ce taux est dans les limites acceptables décrites dans la littérature (15–25% dans les populations sous analgésie péridurale)." : "Ce taux relativement élevé mérite d'être mis en contexte avec les caractéristiques obstétricales de la population étudiée."} Il convient de vérifier si l'analgésie péridurale a pu influencer ce taux comparativement aux données sans péridurale.`,

      indicationCesarienne: topIndic
        ? `L'indication de césarienne la plus fréquente est "${topIndic.name}" (n = ${topIndic.value}, ${pct(topIndic.value, nCesarienne)}). L'analyse des indications permet d'identifier les situations obstétricales à risque et d'évaluer l'impact éventuel de l'analgésie péridurale sur le déroulement du travail.`
        : '',

      phase1: topPhase1
        ? `La durée de 1ère phase la plus fréquente est "${topPhase1.tranche}" (n = ${topPhase1.count}, ${pct(topPhase1.count, nPhase1)}). Une phase latente prolongée peut être associée à une demande plus précoce d'analgésie, tandis qu'une phase active longue peut témoigner d'une dystocie ou d'un effet de l'analgésie sur la dynamique utérine.`
        : '',

      phase2: topPhase2
        ? `La durée de 2ème phase la plus fréquente est "${topPhase2.tranche}" (n = ${topPhase2.count}, ${pct(topPhase2.count, nPhase2)}). L'analgésie péridurale peut allonger la 2ème phase du travail en diminuant le réflexe de poussée ; ce phénomène, bien documenté dans la littérature, ne majore pas le taux de césarienne lorsque la surveillance est adéquate.`
        : '',

      blocMoteur: `Un bloc moteur a été observé chez ${pct(avecBloc, nBlocMoteur || 1)} des patientes renseignées (n = ${avecBloc}). La présence d'un bloc moteur, évaluée par l'échelle de Bromage, est un indicateur important de la profondeur du bloc péridural et de son retentissement sur la mobilisation maternelle.`,

      apgar1: nApgar1 > 0
        ? `${pct(apgar1Normal, nApgar1)} des nouveau-nés (n = ${apgar1Normal}) présentaient un score d'Apgar normal (≥ 7) à 1 minute de vie. ${apgar1Normal < nApgar1 ? "Les nouveau-nés avec un score initial abaissé nécessitent une prise en charge immédiate en salle de naissance et une surveillance rapprochée." : "Ces résultats témoignent d'un bon état de vitalité néonatale à la naissance."}`
        : '',

      apgar5: nApgar5 > 0
        ? `À 5 minutes de vie, ${pct(apgar5Normal, nApgar5)} des nouveau-nés (n = ${apgar5Normal}) avaient un score d'Apgar ≥ 7. ${apgar5Normal >= apgar1Normal && apgar5Normal > 0 ? "L'amélioration (ou le maintien) du score entre 1 et 5 minutes reflète une adaptation néonatale favorable." : "La persistance d'un score abaissé à 5 minutes doit alerter sur une éventuelle souffrance néonatale nécessitant une prise en charge spécialisée."} Un score d'Apgar ≥ 7 à 5 min est associé à un pronostic néonatal favorable.`
        : '',

      poids: poidsStats
        ? `Le poids médian de naissance est de ${poidsStats.median} g [IQR : ${poidsStats.q1}–${poidsStats.q3} g], avec une moyenne de ${poidsStats.mean} g. ${poidsStats.min < 2500 ? `${pct(poidsData[0].count, nPoids)} des nouveau-nés présentent un faible poids de naissance (< 2500 g), ce qui peut influencer l'adaptation néonatale immédiate.` : "Aucun cas de faible poids de naissance n'a été enregistré dans cette cohorte."} Ces données sont conformes aux normes habituelles pour des grossesses à terme.`
        : '',

      complicationsNeo: nComplicationsNeo > 0
        ? `${nComplicationsNeo} complication(s) néonatale(s) ont été enregistrées sur ${n} nouveau-nés (${pct(nComplicationsNeo, n)}). Ces complications doivent être mises en relation avec les antécédents obstétricaux et les paramètres per-partum afin d'établir une causalité éventuelle avec l'analgésie péridurale.`
        : "Aucune complication néonatale n'a été enregistrée dans cette cohorte, ce qui est en faveur d'une bonne tolérance foeto-néonatale de l'analgésie péridurale.",

      connaissance: nConnaissance > 0
        ? `${pct(connaissait, nConnaissance)} des patientes (n = ${connaissait}) connaissaient déjà l'analgésie péridurale avant leur prise en charge et l'ont demandée d'elles-mêmes, tandis que ${pct(neConnaissait, nConnaissance)} (n = ${neConnaissait}) ne la connaissaient pas et l'ont acceptée sur proposition de l'équipe soignante. Ce résultat souligne l'importance de l'information anténatale sur les méthodes d'analgésie obstétricale.`
        : '',

      connaissanceParite: connaissancePariteData.length > 0
        ? `L'analyse croisée montre que la connaissance préalable de la péridurale tend à ${connaissancePariteData.length > 1 && connaissancePariteData[0].connaissait / (connaissancePariteData[0].total || 1) < connaissancePariteData[connaissancePariteData.length - 1].connaissait / (connaissancePariteData[connaissancePariteData.length - 1].total || 1) ? 'augmenter' : 'varier'} avec la parité. Les primipares, n'ayant pas eu d'expérience antérieure du travail, sont naturellement moins informées. Les multipares bénéficient souvent d'une information transmise lors des grossesses précédentes.`
        : '',

      acceptabilite: nConnaissance > 0
        ? `${pct(connaissait, nConnaissance)} des patientes ont sollicité la péridurale de leur propre initiative (à la demande), témoignant d'une bonne connaissance préalable. ${pct(neConnaissait, nConnaissance)} ont accepté la proposition de l'équipe médicale (acceptabilité induite). Ces données permettent d'évaluer le niveau d'information des parturientes et d'orienter les programmes de préparation à la naissance.`
        : '',

      acceptabiliteAge: acceptabiliteAgeData.length > 0
        ? (() => {
            const bestGroup = acceptabiliteAgeData.reduce((a, b) =>
              b.demande / (b.total || 1) > a.demande / (a.total || 1) ? b : a);
            return `La demande spontanée de péridurale est proportionnellement plus fréquente dans la tranche "${bestGroup.tranche}" (${pct(bestGroup.demande, bestGroup.total)}). Les femmes plus jeunes ou moins informées tendent à nécessiter davantage de proposition de l'équipe soignante, ce qui plaide pour un renforcement de l'éducation anténatale dans toutes les tranches d'âge.`;
          })()
        : '',

      evsEvolution: evsEvolutionData.length >= 2
        ? `L'EVS moyen est passé de ${evsAvant30}/10 avant la péridurale à ${evs30min}/10 à 30 minutes, soit une réduction de ${reduction}%. ${reduction >= 50 ? "Cette diminution importante de la douleur confirme l'efficacité analgésique de la péridurale." : "Cette réduction, bien que réelle, suggère que certaines patientes pourraient bénéficier d'un ajustement de la posologie ou d'une réinjection."} La courbe décroissante de l'EVS illustre la cinétique d'action de l'anesthésique local utilisé.`
        : '',

      efficacite: nEfficacite > 0
        ? `${pct(bonneExcellente, nEfficacite)} des patientes (n = ${bonneExcellente}) ont qualifié l'analgésie de bonne ou excellente. ${bonneExcellente / (nEfficacite || 1) >= 0.7 ? "Ce taux élevé témoigne de la qualité de la technique et de l'adéquation de la prise en charge analgésique dans cette cohorte." : "Ce résultat incite à analyser les facteurs associés aux cas d'efficacité insuffisante (positionnement du cathéter, variabilité anatomique, niveau de ponction)."}` : '',

      satisfaction: `${pct(satis, n)} des patientes (n = ${satis}) se déclarent satisfaites ou très satisfaites de leur analgésie péridurale. ${satis / n >= 0.8 ? "Ce taux de satisfaction élevé constitue un indicateur de qualité majeur de la prise en charge, reflétant l'efficacité technique et la qualité de la relation soignant-patiente." : "Ce taux de satisfaction, bien que positif, laisse entrevoir des axes d'amélioration concernant la gestion de la douleur résiduelle et l'information délivrée aux patientes."}`,

      satisfactionParite: bestSatParite
        ? `Le taux de satisfaction (satisfaite + très satisfaite) le plus élevé est observé chez les patientes de parité "${bestSatParite.parite}" (${pct(bestSatParite['Très satisfaite'] + bestSatParite['Satisfaite'], bestSatParite.total)}). Cette variation selon la parité peut refléter des attentes différentes vis-à-vis de la douleur, une meilleure préparation psychologique des multipares ou une modification de la réponse analgésique selon les antécédents obstétricaux.`
        : '',
    };
  }, [n, patients, ageData, gestiteData, pariteData, antecedentsPresenceData, antecedentsData,
      bishopData, nBishop, evsAvantData, nEvsAvant, delaiData, nDelai,
      niveauPonctionData, nNiveauPonction, nombrePonctionData, nPonctions,
      niveauSensitifData, nNiveauSensitif, entretienData, nEntretien,
      nombreReinjectionData, nReinjections, succesEchecData, effetsData,
      nCesarienne, indicationCesData, phase1Data, nPhase1, phase2Data, nPhase2,
      nBlocMoteur, apgar1Data, nApgar1, apgar5Data, nApgar5,
      poidsStats, poidsData, nPoids, nComplicationsNeo,
      connaissancePariteData, nConnaissance, acceptabiliteAgeData,
      evsEvolutionData, efficaciteData, nEfficacite, satisfactionPariteData]);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!n) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <TrendingUp className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucune donnée à analyser</h2>
        <p className="text-muted-foreground text-sm">Ajoutez des patients pour visualiser les statistiques.</p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">Analyse des données de la cohorte</p>
        </div>
        <Badge variant="secondary" className="w-fit text-sm px-3 py-1">
          {n} patient{n > 1 ? 's' : ''} inclus
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto gap-1 w-full justify-start">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="demographic">Démographie</TabsTrigger>
          <TabsTrigger value="analgesie">Travail & Analgésie</TabsTrigger>
          <TabsTrigger value="accouchement">Accouchement & Néonatal</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction & Connaissances</TabsTrigger>
        </TabsList>

        {/* ══ TAB 1 : VUE D'ENSEMBLE ══════════════════════════════════════════ */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Total Patients" value={n} sub="Inclus dans la cohorte" icon={Users} color={C.blue} />
            <KpiCard title="Âge moyen" value={`${kpi?.agesMoy ?? '—'} ans`} sub="Moyenne de la cohorte" icon={TrendingUp} color={C.violet} />
            <KpiCard title="Taux de satisfaction" value={kpi?.tauxSatisfaction ?? '—'} sub="Satisfaite ou très satisfaite" icon={ThumbsUp} color={C.emerald} />
            <KpiCard title="Taux de complications" value={kpi?.tauxComplications ?? '—'} sub="Complications post-partum" icon={AlertTriangle} color={C.rose} />
          </div>

          <Section title="Évolution de la cohorte" description="Nombre de patients inclus par mois (et total cumulé)">
            {evolutionData.length < 2 ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={evolutionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCumul" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.violet} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={C.violet} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="patients" name="Nouveaux patients" stroke={C.blue} fill="url(#gradPatients)" strokeWidth={2} dot={{ r: 4 }} />
                  <Area type="monotone" dataKey="cumul" name="Total cumulé" stroke={C.violet} fill="url(#gradCumul)" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {evolutionData.length >= 2 && (
              <Analysis>
                La cohorte comprend {n} patiente{n > 1 ? 's' : ''} réparties sur {evolutionData.length} mois de collecte.
                {evolutionData.length > 1 && ` Le mois le plus actif est "${evolutionData.reduce((a, b) => b.patients > a.patients ? b : a).mois}" avec ${evolutionData.reduce((a, b) => b.patients > a.patients ? b : a).patients} inclusion(s).`}{' '}
                La courbe cumulée permet d'évaluer la vitesse de recrutement et d'anticiper la fin de la période de collecte.
              </Analysis>
            )}
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Mode d'accouchement" description="Répartition des voies d'accouchement">
              <TableAndPie data={modeAccouchementData} total={n} categoryLabel="Mode" />
              {analyses.cesarienne && <Analysis>{analyses.cesarienne}</Analysis>}
            </Section>
            <Section title="Satisfaction des patientes" description="Résultat global après analgésie">
              <TableAndPie data={satisfactionData} total={n} categoryLabel="Satisfaction"
                colors={[C.emerald, C.blue, C.amber, C.rose, C.slate]} />
              {analyses.satisfaction && <Analysis>{analyses.satisfaction}</Analysis>}
            </Section>
          </div>
        </TabsContent>

        {/* ══ TAB 2 : DÉMOGRAPHIE ═════════════════════════════════════════════ */}
        <TabsContent value="demographic" className="space-y-6 mt-6">

          <Section title="Répartition de la population selon les tranches d'âge"
            description="Distribution par tranche d'âge (années)">
            <TableAndBar data={ageData} total={n} xKey="tranche" valueKey="count" categoryLabel="Tranche d'âge" fill={C.blue} />
            {analyses.age && <Analysis>{analyses.age}</Analysis>}
          </Section>

          <Section title="Répartition de la population selon la gestité"
            description="Distribution selon le nombre de grossesses">
            <TableAndBar data={gestiteData} total={n} xKey="gestite" valueKey="count" categoryLabel="Gestité" fill={C.violet} />
            {analyses.gestite && <Analysis>{analyses.gestite}</Analysis>}
          </Section>

          <Section title="Répartition de la population selon la parité"
            description="Distribution selon le nombre d'accouchements antérieurs">
            <TableAndBar data={pariteData} total={n} xKey="parite" valueKey="count" categoryLabel="Parité" fill={C.teal} />
            {analyses.parite && <Analysis>{analyses.parite}</Analysis>}
          </Section>

          <Section title="Répartition selon la présence ou non d'antécédents médicaux"
            description="Population avec ou sans antécédents médicaux">
            <TableAndPie data={antecedentsPresenceData} total={n} categoryLabel="Antécédents" colors={[C.rose, C.emerald]} />
            {analyses.antecedentsPresence && <Analysis>{analyses.antecedentsPresence}</Analysis>}
          </Section>

          <Section title="Répartition selon les antécédents médicaux des parturientes"
            description="Nombre de patientes concernées par type (plusieurs antécédents possibles)">
            <TableAndBar data={antecedentsData} total={n} xKey="name" valueKey="value" categoryLabel="Antécédent" fill={C.rose} />
            {analyses.antecedentsMedicaux && <Analysis>{analyses.antecedentsMedicaux}</Analysis>}
          </Section>
        </TabsContent>

        {/* ══ TAB 3 : TRAVAIL & ANALGÉSIE ════════════════════════════════════ */}
        <TabsContent value="analgesie" className="space-y-6 mt-6">

          <Section title="Dilatation cervicale (Score de Bishop) à l'admission"
            description="Score de Bishop enregistré à l'admission en salle d'accouchement">
            {!bishopData.length ? <EmptyChart /> : (
              <TableAndPie data={bishopData} total={nBishop} categoryLabel="Score de Bishop" />
            )}
            {analyses.bishop && <Analysis>{analyses.bishop}</Analysis>}
          </Section>

          <Section title="EVS de référence avant mise en péridurale"
            description="Répartition selon l'échelle verbale simple (EVS) avant analgésie (0 = pas de douleur, 10 = douleur maximale)">
            <TableAndBar data={evsAvantData} total={nEvsAvant} xKey="tranche" valueKey="count" categoryLabel="EVS" fill={C.orange} />
            {analyses.evsAvant && <Analysis>{analyses.evsAvant}</Analysis>}
          </Section>

          <Section title="Délai de mise en place de l'analgésie péridurale"
            description="Délai entre la demande et la pose de la péridurale">
            <TableAndBar data={delaiData} total={nDelai} xKey="tranche" valueKey="count" categoryLabel="Délai" fill={C.teal} />
            {analyses.delai && <Analysis>{analyses.delai}</Analysis>}
          </Section>

          <Section title="Niveaux de ponction au repérage de l'espace péridural"
            description="Répartition des niveaux intervertébraux utilisés">
            {!niveauPonctionData.length ? <EmptyChart /> : (
              <TableAndPie data={niveauPonctionData} total={nNiveauPonction} categoryLabel="Niveau de ponction" />
            )}
            {analyses.niveauPonction && <Analysis>{analyses.niveauPonction}</Analysis>}
          </Section>

          <Section title="Nombre de ponctions"
            description="Répartition selon le nombre de tentatives réalisées">
            <TableAndBar data={nombrePonctionData} total={nPonctions} xKey="label" valueKey="count" categoryLabel="Ponctions" fill={C.amber} />
            {analyses.nombrePonctions && <Analysis>{analyses.nombrePonctions}</Analysis>}
          </Section>

          <Section title="Répartition selon le niveau sensitif obtenu"
            description="Niveau sensitif atteint après mise en place de l'analgésie péridurale">
            {!niveauSensitifData.length ? <EmptyChart /> : (
              <TableAndPie data={niveauSensitifData} total={nNiveauSensitif} categoryLabel="Niveau sensitif" />
            )}
            {analyses.niveauSensitif && <Analysis>{analyses.niveauSensitif}</Analysis>}
          </Section>

          <Section title="Entretien de l'analgésie péridurale"
            description="Répartition selon le mode d'entretien : vitesse PSE (pousse-seringue électrique) ou bolus seul">
            {!entretienData.length ? <EmptyChart /> : (
              <TableAndPie data={entretienData} total={nEntretien} categoryLabel="Mode d'entretien" colors={[C.blue, C.violet]} />
            )}
            {analyses.entretien && <Analysis>{analyses.entretien}</Analysis>}
          </Section>

          <Section title="Nombre de réinjections"
            description="Répartition selon le nombre de réinjections supplémentaires réalisées">
            <TableAndBar data={nombreReinjectionData} total={nReinjections} xKey="label" valueKey="count" categoryLabel="Réinjections" fill={C.cyan} />
            {analyses.reinjections && <Analysis>{analyses.reinjections}</Analysis>}
          </Section>

          <Section title="Succès et échec de la technique"
            description="Résultat de la ponction péridurale : succès ou échec de ponction">
            <TableAndPie data={succesEchecData} total={n} categoryLabel="Résultat" colors={[C.emerald, C.rose]} />
            {analyses.succesEchec && <Analysis>{analyses.succesEchec}</Analysis>}
          </Section>

          <Section title="Effets secondaires enregistrés selon les patientes"
            description="Nombre de patientes concernées par type d'effet (plusieurs effets possibles par patiente)">
            <TableAndBar data={effetsData} total={n} xKey="name" valueKey="value" categoryLabel="Effet secondaire" fill={C.rose} />
            {analyses.effetsSecondaires && <Analysis>{analyses.effetsSecondaires}</Analysis>}
          </Section>
        </TabsContent>

        {/* ══ TAB 4 : ACCOUCHEMENT & NÉONATAL ════════════════════════════════ */}
        <TabsContent value="accouchement" className="space-y-6 mt-6">

          <Section title="Taux de conversion en césarienne"
            description="Répartition voie basse vs conversion en césarienne">
            <TableAndPie data={cesarienneData} total={n} categoryLabel="Mode" colors={[C.rose, C.emerald]} />
            {analyses.cesarienne && <Analysis>{analyses.cesarienne}</Analysis>}
          </Section>

          <Section title="Répartition selon les indications de conversion en césarienne"
            description={`Indications enregistrées (${nCesarienne} césarienne${nCesarienne > 1 ? 's' : ''})`}>
            {!indicationCesData.length ? (
              <p className="text-sm text-muted-foreground">
                {nCesarienne === 0 ? 'Aucune césarienne enregistrée.' : 'Indications non précisées.'}
              </p>
            ) : (
              <TableAndPie data={indicationCesData} total={nCesarienne} categoryLabel="Indication" />
            )}
            {analyses.indicationCesarienne && <Analysis>{analyses.indicationCesarienne}</Analysis>}
          </Section>

          <Section title="Manœuvres instrumentales utilisées au cours des accouchements par voie basse"
            description={`Type d'instrument (${nInstrumental} extraction${nInstrumental > 1 ? 's' : ''} instrumentale${nInstrumental > 1 ? 's' : ''})`}>
            {!manoeuvresData.length ? (
              <p className="text-sm text-muted-foreground">
                {nInstrumental === 0 ? 'Aucune extraction instrumentale enregistrée.' : 'Type non précisé.'}
              </p>
            ) : (
              <StatTable rows={manoeuvresData} total={nInstrumental} categoryLabel="Type d'instrument" />
            )}
            {nInstrumental > 0 && (
              <Analysis>
                {pct(nInstrumental, n)} des accouchements ont nécessité une extraction instrumentale (n = {nInstrumental}).
                Le recours aux instruments (forceps, ventouse) est lié aux conditions obstétricales (anomalie du rythme cardiaque fœtal, efforts expulsifs inefficaces) et peut être facilité par l'analgésie péridurale qui permet une bonne coopération maternelle.
              </Analysis>
            )}
          </Section>

          <Section title="1ère phase du travail (phase latente)"
            description="Distribution de la durée de la phase latente (en heures)">
            <TableAndBar data={phase1Data} total={nPhase1} xKey="tranche" valueKey="count" categoryLabel="Durée" fill={C.blue} />
            {analyses.phase1 && <Analysis>{analyses.phase1}</Analysis>}
          </Section>

          <Section title="2ème phase du travail (phase expulsive)"
            description="Distribution de la durée de la 2ème phase (en minutes)">
            <TableAndBar data={phase2Data} total={nPhase2} xKey="tranche" valueKey="count" categoryLabel="Durée" fill={C.violet} />
            {analyses.phase2 && <Analysis>{analyses.phase2}</Analysis>}
          </Section>

          <Section title="Présence ou non de bloc moteur"
            description="Grade de bloc moteur observé sous analgésie péridurale">
            {!blocMoteurData.length ? <EmptyChart /> : (
              <TableAndPie data={blocMoteurData} total={nBlocMoteur} categoryLabel="Bloc moteur" colors={[C.amber, C.emerald, C.rose]} />
            )}
            {analyses.blocMoteur && <Analysis>{analyses.blocMoteur}</Analysis>}
          </Section>

          <Section title="Score d'Apgar à 1 minute de vie"
            description="Répartition des scores d'Apgar à la naissance">
            <TableAndBar data={apgar1Data} total={nApgar1} xKey="tranche" valueKey="count" categoryLabel="Score Apgar 1 min" fill={C.emerald} />
            {analyses.apgar1 && <Analysis>{analyses.apgar1}</Analysis>}
          </Section>

          <Section title="Score d'Apgar à 5 minutes de vie"
            description="Répartition des scores d'Apgar à 5 minutes de vie">
            <TableAndBar data={apgar5Data} total={nApgar5} xKey="tranche" valueKey="count" categoryLabel="Score Apgar 5 min" fill={C.teal} />
            {analyses.apgar5 && <Analysis>{analyses.apgar5}</Analysis>}
          </Section>

          <Section title="Poids de naissance (en grammes)"
            description="Statistiques descriptives et distribution par tranche de poids">
            {!poidsStats ? <EmptyChart /> : (
              <div className="space-y-4">
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Statistique</th>
                        <th className="text-right px-3 py-2 font-medium">Valeur (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Minimum',           value: poidsStats.min    },
                        { label: '1er quartile (Q1)', value: poidsStats.q1     },
                        { label: 'Médiane',           value: poidsStats.median },
                        { label: 'Moyenne',           value: poidsStats.mean   },
                        { label: '3ème quartile (Q3)',value: poidsStats.q3     },
                        { label: 'Maximum',           value: poidsStats.max    },
                      ].map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-1.5">{row.label}</td>
                          <td className="text-right px-3 py-1.5 font-mono">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TableAndBar data={poidsData} total={nPoids} xKey="tranche" valueKey="count" categoryLabel="Tranche de poids" fill={C.amber} />
              </div>
            )}
            {analyses.poids && <Analysis>{analyses.poids}</Analysis>}
          </Section>

          <Section title="Complications néonatales"
            description="Complications post-natales enregistrées chez le nouveau-né">
            {!complicationsNeoData.length ? (
              <p className="text-sm text-muted-foreground">Aucune complication néonatale enregistrée.</p>
            ) : (
              <StatTable rows={complicationsNeoData} total={nComplicationsNeo} categoryLabel="Complication" />
            )}
            {analyses.complicationsNeo && <Analysis>{analyses.complicationsNeo}</Analysis>}
          </Section>
        </TabsContent>

        {/* ══ TAB 5 : SATISFACTION & CONNAISSANCES ════════════════════════════ */}
        <TabsContent value="satisfaction" className="space-y-6 mt-6">

          <Section title="Répartition de la population selon la connaissance ou non de l'analgésie péridurale"
            description="«Patient» = la patiente connaissait et a demandé elle-même ; «Équipe médicale» = ne connaissait pas et a accepté sur proposition">
            <TableAndPie data={connaissanceData} total={nConnaissance} categoryLabel="Connaissance" colors={[C.blue, C.amber]} />
            {analyses.connaissance && <Analysis>{analyses.connaissance}</Analysis>}
          </Section>

          <Section title="Répartition de la connaissance de la péridurale selon la parité"
            description="Croisement connaissance / parité">
            {!connaissancePariteData.length ? <EmptyChart /> : (
              <div className="space-y-4">
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Parité</th>
                        <th className="text-right px-3 py-2 font-medium">Connaissait — n (%)</th>
                        <th className="text-right px-3 py-2 font-medium">Ne connaissait pas — n (%)</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connaissancePariteData.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-1.5">{row.parite}</td>
                          <td className="text-right px-3 py-1.5">{row.connaissait} ({pct(row.connaissait, row.total)})</td>
                          <td className="text-right px-3 py-1.5">{row.neConnaissaitPas} ({pct(row.neConnaissaitPas, row.total)})</td>
                          <td className="text-right px-3 py-1.5 font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={connaissancePariteData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="parite" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Bar dataKey="connaissait"      name="Connaissait"        fill={C.blue}  radius={[4,4,0,0]} />
                    <Bar dataKey="neConnaissaitPas" name="Ne connaissait pas" fill={C.amber} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {analyses.connaissanceParite && <Analysis>{analyses.connaissanceParite}</Analysis>}
          </Section>

          <Section title="Acceptabilité de l'analgésie péridurale par les parturientes"
            description="À la demande du patient ou acceptée sur proposition de l'équipe médicale">
            <TableAndPie data={acceptabiliteData} total={nConnaissance} categoryLabel="Mode d'acceptation" colors={[C.blue, C.violet]} />
            {analyses.acceptabilite && <Analysis>{analyses.acceptabilite}</Analysis>}
          </Section>

          <Section title="Acceptabilité de l'analgésie péridurale selon l'âge"
            description="Croisement mode d'acceptation / tranche d'âge">
            {!acceptabiliteAgeData.length ? <EmptyChart /> : (
              <div className="space-y-4">
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Tranche d'âge</th>
                        <th className="text-right px-3 py-2 font-medium">À la demande — n (%)</th>
                        <th className="text-right px-3 py-2 font-medium">Sur proposition — n (%)</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {acceptabiliteAgeData.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-1.5">{row.tranche}</td>
                          <td className="text-right px-3 py-1.5">{row.demande} ({pct(row.demande, row.total)})</td>
                          <td className="text-right px-3 py-1.5">{row.proposition} ({pct(row.proposition, row.total)})</td>
                          <td className="text-right px-3 py-1.5 font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={acceptabiliteAgeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tranche" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Bar dataKey="demande"     name="À la demande"    fill={C.blue}   radius={[4,4,0,0]} />
                    <Bar dataKey="proposition" name="Sur proposition" fill={C.violet} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {analyses.acceptabiliteAge && <Analysis>{analyses.acceptabiliteAge}</Analysis>}
          </Section>

          <Section title="Évolution de l'échelle verbale simple (EVS) sous analgésie péridurale"
            description="Moyenne EVS (0 = aucune douleur, 10 = douleur maximale) aux différents temps de mesure">
            {evsEvolutionData.length < 2 ? (
              <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
                Données EVS insuffisantes — renseignez l'étape «&nbsp;Efficacité analgésique&nbsp;»
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Temps de mesure</th>
                        <th className="text-right px-3 py-2 font-medium">EVS moyen / 10</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evsEvolutionData.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-1.5">{row.label}</td>
                          <td className="text-right px-3 py-1.5 font-mono">{row.moyenne}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={evsEvolutionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} ticks={[0,2,4,6,8,10]}
                      label={{ value: 'EVS /10', angle: -90, position: 'insideLeft', fontSize: 11, offset: 10 }} />
                    <Tooltip {...tooltipStyle}
                      formatter={(v: number) => [`${v} / 10`, 'EVS moyen']}
                      labelFormatter={(l) => evsEvolutionData.find((d) => d.temps === l)?.label ?? l} />
                    <Line type="monotone" dataKey="moyenne" name="EVS moyen"
                      stroke={C.rose} strokeWidth={3} dot={{ r: 6, fill: C.rose }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            {analyses.evsEvolution && <Analysis>{analyses.evsEvolution}</Analysis>}
          </Section>

          <Section title="Efficacité globale de l'analgésie péridurale"
            description="Répartition de l'efficacité globale évaluée par la patiente">
            {!efficaciteData.length ? <EmptyChart /> : (
              <TableAndPie data={efficaciteData} total={nEfficacite} categoryLabel="Efficacité"
                colors={[C.emerald, C.blue, C.amber, C.rose]} />
            )}
            {analyses.efficacite && <Analysis>{analyses.efficacite}</Analysis>}
          </Section>

          <Section title="Satisfaction maternelle après réalisation de l'analgésie péridurale"
            description="Niveau de satisfaction globale exprimé par les patientes">
            <TableAndPie data={satisfactionData} total={n} categoryLabel="Satisfaction"
              colors={[C.emerald, C.blue, C.amber, C.rose, C.slate]} />
            {analyses.satisfaction && <Analysis>{analyses.satisfaction}</Analysis>}
          </Section>

          <Section title="Satisfaction des parturientes selon la parité"
            description="Croisement satisfaction / parité">
            {!satisfactionPariteData.length ? <EmptyChart /> : (
              <div className="space-y-4">
                <div className="overflow-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 font-medium">Parité</th>
                        <th className="text-right px-3 py-2 font-medium">Très satisfaite</th>
                        <th className="text-right px-3 py-2 font-medium">Satisfaite</th>
                        <th className="text-right px-3 py-2 font-medium">Neutre</th>
                        <th className="text-right px-3 py-2 font-medium">Insatisfaite</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {satisfactionPariteData.map((row, i) => (
                        <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-1.5">{row.parite}</td>
                          <td className="text-right px-3 py-1.5">{row['Très satisfaite']} ({pct(row['Très satisfaite'], row.total)})</td>
                          <td className="text-right px-3 py-1.5">{row['Satisfaite']} ({pct(row['Satisfaite'], row.total)})</td>
                          <td className="text-right px-3 py-1.5">{row['Neutre']} ({pct(row['Neutre'], row.total)})</td>
                          <td className="text-right px-3 py-1.5">{row['Insatisfaite']} ({pct(row['Insatisfaite'], row.total)})</td>
                          <td className="text-right px-3 py-1.5 font-medium">{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={satisfactionPariteData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="parite" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Bar dataKey="Très satisfaite" fill={C.emerald} radius={[4,4,0,0]} />
                    <Bar dataKey="Satisfaite"      fill={C.blue}    radius={[4,4,0,0]} />
                    <Bar dataKey="Neutre"          fill={C.amber}   radius={[4,4,0,0]} />
                    <Bar dataKey="Insatisfaite"    fill={C.rose}    radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {analyses.satisfactionParite && <Analysis>{analyses.satisfactionParite}</Analysis>}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
