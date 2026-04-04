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

// ── Palette ──────────────────────────────────────────────────────────────────
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

// ── Shared tooltip style ─────────────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    background: 'hsl(var(--background))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '13px',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const pct = (n: number, total: number) =>
  total > 0 ? `${Math.round((n / total) * 100)}%` : '0%';

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

// ── Custom Pie label ─────────────────────────────────────────────────────────
const renderPieLabel = ({ name, percent }: { name: string; percent: number }) =>
  percent > 0.05 ? `${Math.round(percent * 100)}%` : '';

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
      Pas encore de données
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  title, value, sub, icon: Icon, color,
}: {
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

// ── Section wrapper ───────────────────────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════════════════════
export function StatsPage() {
  const { patients } = useData();
  const n = patients.length;

  // ── Computed data ──────────────────────────────────────────────────────────

  const kpi = useMemo(() => {
    if (!n) return null;
    const ages = patients.map((p) => p.age).filter(Boolean);
    const satisfied = patients.filter((p) =>
      p.satisfactionPatiente === 'Très satisfaite' || p.satisfactionPatiente === 'Satisfaite'
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

  // Évolution temporelle — patients par mois
  const evolutionData = useMemo(() => {
    const map: Record<string, number> = {};
    patients.forEach((p) => {
      if (!p.date) return;
      const d = new Date(p.date);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mois, total], i, arr) => ({
        mois: mois.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
          const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
          return `${months[parseInt(m) - 1]} ${y}`;
        }),
        patients: total,
        cumul: arr.slice(0, i + 1).reduce((s, [, v]) => s + v, 0),
      }));
  }, [patients]);

  // Distribution d'âge par tranche
  const ageData = useMemo(() => {
    const bins = [
      { label: '< 20', min: 0, max: 19 },
      { label: '20–24', min: 20, max: 24 },
      { label: '25–29', min: 25, max: 29 },
      { label: '30–34', min: 30, max: 34 },
      { label: '35–39', min: 35, max: 39 },
      { label: '≥ 40', min: 40, max: 999 },
    ];
    return bins.map(({ label, min, max }) => ({
      tranche: label,
      count: patients.filter((p) => p.age >= min && p.age <= max).length,
    }));
  }, [patients]);

  // Niveau d'éducation
  const educationData = useMemo(() =>
    countBy(patients, (p) => p.niveauEducation || 'Non renseigné'), [patients]);

  // Situation matrimoniale
  const matrimonialeData = useMemo(() =>
    countBy(patients, (p) => p.situationMatrimoniale || 'Non renseigné'), [patients]);

  // Couverture médicale
  const couvertureData = useMemo(() => [
    { name: 'Avec couverture', value: patients.filter((p) => p.couvertureMedicale).length },
    { name: 'Sans couverture', value: patients.filter((p) => !p.couvertureMedicale).length },
  ].filter((d) => d.value > 0), [patients]);

  // Top origines
  const originesData = useMemo(() =>
    countBy(patients, (p) => p.origine || 'Non renseigné').slice(0, 10), [patients]);

  // Antécédents médicaux
  const antecedentsData = useMemo(() => [
    { name: 'Hypertension', value: count(patients.map((p) => p.antecedentsMedicaux?.hypertension)) },
    { name: 'Diabète', value: count(patients.map((p) => p.antecedentsMedicaux?.diabete)) },
    { name: 'Asthme', value: count(patients.map((p) => p.antecedentsMedicaux?.asthme)) },
    { name: 'Autres', value: count(patients.map((p) => p.antecedentsMedicaux?.autres)) },
  ], [patients]);

  // Antécédents obstétricaux
  const obstetricauxData = useMemo(() => [
    { name: 'Prématurité', value: count(patients.map((p) => p.antecedentsObstetricaux?.prematurite)) },
    { name: 'Mort fœtale', value: count(patients.map((p) => p.antecedentsObstetricaux?.mortFoetale)) },
    { name: 'Césa. ant.', value: count(patients.map((p) => p.antecedentsObstetricaux?.cesarienneAnterieure)) },
  ], [patients]);

  // Pathologies associées grossesse
  const pathologiesData = useMemo(() => [
    { name: 'Pré-éclampsie', value: count(patients.map((p) => p.pathologiesAssociees?.preEclampsie)) },
    { name: 'Diabète gest.', value: count(patients.map((p) => p.pathologiesAssociees?.diabeteGestationnel)) },
    { name: 'Anémie', value: count(patients.map((p) => p.pathologiesAssociees?.anemie)) },
    { name: 'Autres', value: count(patients.map((p) => p.pathologiesAssociees?.autres)) },
  ], [patients]);

  // Suivi prénatal
  const suiviData = useMemo(() =>
    countBy(patients, (p) => p.suiviPrenatal || 'Non renseigné'), [patients]);

  // Déclenchement du travail
  const declenchementData = useMemo(() =>
    countBy(patients, (p) => p.declenchementTravail || 'Non renseigné'), [patients]);

  // Durée travail moyenne
  const dureeTravailData = useMemo(() => {
    const latentes = patients.map((p) => p.dureeTravail?.phaseLatente).filter((v) => v > 0) as number[];
    const actives = patients.map((p) => p.dureeTravail?.phaseActive).filter((v) => v > 0) as number[];
    if (!latentes.length && !actives.length) return [];
    return [
      { phase: 'Phase latente', moyenne: avg(latentes), min: Math.min(...latentes), max: Math.max(...latentes) },
      { phase: 'Phase active', moyenne: avg(actives), min: Math.min(...actives), max: Math.max(...actives) },
    ];
  }, [patients]);

  // Délai demande-pose — distribution par tranches (minutes)
  const delaiData = useMemo(() => {
    const bins = [
      { label: '0–15 min', min: 0, max: 15 },
      { label: '15–30 min', min: 16, max: 30 },
      { label: '30–60 min', min: 31, max: 60 },
      { label: '1–2 h', min: 61, max: 120 },
      { label: '> 2 h', min: 121, max: 9999 },
    ];
    return bins.map(({ label, min, max }) => ({
      tranche: label,
      count: patients.filter((p) => {
        const d = p.delaiDemandePose;
        return typeof d === 'number' && d >= min && d <= max;
      }).length,
    }));
  }, [patients]);

  // Effets secondaires
  const effetsData = useMemo(() => [
    { name: 'Hypotension', value: count(patients.map((p) => p.effetsSecondaires?.hypotension)) },
    { name: 'Prurit', value: count(patients.map((p) => p.effetsSecondaires?.prurit)) },
    { name: 'Nausées/Vomis.', value: count(patients.map((p) => p.effetsSecondaires?.nauseesVomissements)) },
    { name: 'Rétention urin.', value: count(patients.map((p) => p.effetsSecondaires?.retentionUrinaire)) },
    { name: 'Autres', value: count(patients.map((p) => p.effetsSecondaires?.autres)) },
  ], [patients]);

  // Difficultés techniques
  const difficultesData = useMemo(() => [
    { name: 'Échec ponction', value: count(patients.map((p) => p.difficultesTechniques?.echecPonction)) },
    { name: 'Ponction dure-mér.', value: count(patients.map((p) => p.difficultesTechniques?.ponctionDureMerienne)) },
    { name: 'Autres', value: count(patients.map((p) => p.difficultesTechniques?.autres)) },
  ], [patients]);

  // Mode d'accouchement
  const modeAccouchementData = useMemo(() =>
    countBy(patients, (p) => p.modeAccouchement || 'Non renseigné'), [patients]);

  // Distribution Apgar 1min (0–10)
  const apgar1Data = useMemo(() => {
    const map: Record<string, number> = {};
    patients.forEach((p) => {
      const v = p.etatNouveauNe?.apgar1;
      if (!v) return;
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map)
      .map(([score, count]) => ({ score, count }))
      .sort((a, b) => Number(a.score) - Number(b.score));
  }, [patients]);

  // Poids naissance par tranche (grammes)
  const poidsData = useMemo(() => {
    const bins = [
      { label: '< 2500 g', min: 0, max: 2499 },
      { label: '2500–3000 g', min: 2500, max: 3000 },
      { label: '3000–3500 g', min: 3001, max: 3500 },
      { label: '3500–4000 g', min: 3501, max: 4000 },
      { label: '> 4000 g', min: 4001, max: 9999 },
    ];
    return bins.map(({ label, min, max }) => ({
      tranche: label,
      count: patients.filter((p) => {
        const w = parseFloat(p.etatNouveauNe?.poids);
        return !isNaN(w) && w >= min && w <= max;
      }).length,
    }));
  }, [patients]);

  // Courbe EVA — moyenne à chaque temps de mesure
  const evaData = useMemo(() => {
    const pts = patients.filter((p) => p.efficaciteAnalgesique);
    if (!pts.length) return [];
    const vals = (key: keyof NonNullable<(typeof pts)[0]['efficaciteAnalgesique']>) =>
      pts.map((p) => p.efficaciteAnalgesique?.[key] as number).filter((v) => typeof v === 'number' && !isNaN(v));
    return [
      { temps: 'Avant', moyenne: avg(vals('evaAvantAnalgesie')), label: 'Avant analgésie' },
      { temps: '15 min', moyenne: avg(vals('eva15MinApres')), label: '15 min après' },
      { temps: '30 min', moyenne: avg(vals('eva30MinApres')), label: '30 min après' },
      { temps: 'Réinjection', moyenne: avg(vals('evaDemandeReinjection')), label: 'Demande réinjection' },
    ].filter((d) => d.moyenne > 0);
  }, [patients]);

  // Efficacité globale
  const efficaciteData = useMemo(() => {
    const map: Record<string, number> = {};
    patients.forEach((p) => {
      const v = p.efficaciteAnalgesique?.efficaciteGlobale;
      if (!v) return;
      const label = v.charAt(0).toUpperCase() + v.slice(1);
      map[label] = (map[label] || 0) + 1;
    });
    const order = ['Excellente', 'Bonne', 'Modérée', 'Insuffisante'];
    return order.filter((k) => map[k]).map((name) => ({ name, value: map[name] }));
  }, [patients]);

  // Satisfaction
  const satisfactionData = useMemo(() =>
    countBy(patients, (p) => p.satisfactionPatiente || 'Non renseigné'), [patients]);

  // Complications post-partum
  const complicationsData = useMemo(() => [
    { name: 'Céphalées post-ponction', value: count(patients.map((p) => p.complicationsPostPartum?.cephaleesPostPonction)) },
    { name: 'Infection site', value: count(patients.map((p) => p.complicationsPostPartum?.infectionSitePonction)) },
    { name: 'Douleurs lombaires', value: count(patients.map((p) => p.complicationsPostPartum?.douleursLombairesPersistantes)) },
    { name: 'Autres', value: count(patients.map((p) => p.complicationsPostPartum?.autres)) },
  ], [patients]);

  // Complications tardives
  const complicationsTardivesData = useMemo(() => [
    { name: 'Névralgie/Dysesthésie', value: count(patients.map((p) => p.complicationsTardives?.nevralgieOuDysesthesis)) },
    { name: 'Synd. queue de cheval', value: count(patients.map((p) => p.complicationsTardives?.syndromeQueueCheval)) },
    { name: 'Adhérence péridurale', value: count(patients.map((p) => p.complicationsTardives?.adherencePeriduraleOuFibrose)) },
    { name: 'Autres', value: count(patients.map((p) => p.complicationsTardives?.autres)) },
  ], [patients]);

  // Parité distribution
  const pariteData = useMemo(() => {
    const bins = [
      { label: 'Primipare (0)', min: 0, max: 0 },
      { label: 'Bipare (1)', min: 1, max: 1 },
      { label: 'Tripare (2)', min: 2, max: 2 },
      { label: '≥ 3', min: 3, max: 99 },
    ];
    return bins.map(({ label, min, max }) => ({
      parite: label,
      count: patients.filter((p) => {
        const v = p.antecedentsObstetricaux?.parite;
        return typeof v === 'number' && v >= min && v <= max;
      }).length,
    }));
  }, [patients]);

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!n) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <TrendingUp className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucune donnée à analyser</h2>
        <p className="text-muted-foreground text-sm">
          Ajoutez des patients pour visualiser les statistiques.
        </p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
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
          <TabsTrigger value="travail">Travail & Analgésie</TabsTrigger>
          <TabsTrigger value="accouchement">Accouchement</TabsTrigger>
          <TabsTrigger value="efficacite">Efficacité & Résultats</TabsTrigger>
        </TabsList>

        {/* ══ TAB 1 : VUE D'ENSEMBLE ══════════════════════════════════════════ */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Total Patients" value={n} sub="Inclus dans la cohorte"
              icon={Users} color={C.blue} />
            <KpiCard title="Âge moyen" value={`${kpi?.agesMoy ?? '—'} ans`}
              sub="Moyenne de la cohorte" icon={TrendingUp} color={C.violet} />
            <KpiCard title="Taux de satisfaction" value={kpi?.tauxSatisfaction ?? '—'}
              sub="Satisfaite ou très satisfaite" icon={ThumbsUp} color={C.emerald} />
            <KpiCard title="Taux de complications" value={kpi?.tauxComplications ?? '—'}
              sub="Complications post-partum" icon={AlertTriangle} color={C.rose} />
          </div>

          {/* Évolution temporelle */}
          <Section title="Évolution de la cohorte" description="Nombre de patients inclus par mois (et total cumulé)">
            {evolutionData.length < 2 ? (
              <EmptyChart />
            ) : (
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
                  <Area type="monotone" dataKey="patients" name="Nouveaux patients"
                    stroke={C.blue} fill="url(#gradPatients)" strokeWidth={2} dot={{ r: 4 }} />
                  <Area type="monotone" dataKey="cumul" name="Total cumulé"
                    stroke={C.violet} fill="url(#gradCumul)" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Section>

          {/* Satisfaction + Mode accouchement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Satisfaction des patientes" description="Résultat global après analgésie">
              {satisfactionData.every((d) => d.value === 0) ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={satisfactionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {satisfactionData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patient${v > 1 ? 's' : ''} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Mode d'accouchement" description="Répartition des voies d'accouchement">
              {modeAccouchementData.every((d) => d.value === 0) ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={modeAccouchementData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {modeAccouchementData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patient${v > 1 ? 's' : ''} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>
        </TabsContent>

        {/* ══ TAB 2 : DÉMOGRAPHIE ═════════════════════════════════════════════ */}
        <TabsContent value="demographic" className="space-y-6 mt-6">
          {/* Distribution d'âge */}
          <Section title="Distribution d'âge" description="Nombre de patientes par tranche d'âge">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ageData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tranche" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patiente${v > 1 ? 's' : ''}`, 'Effectif']} />
                <Bar dataKey="count" name="Patientes" fill={C.blue} radius={[4, 4, 0, 0]}>
                  {ageData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${210 + i * 8}, 80%, ${50 + i * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Parité */}
          <Section title="Distribution de la parité" description="Répartition selon le nombre d'accouchements antérieurs">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pariteData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="parite" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patiente${v > 1 ? 's' : ''}`, 'Effectif']} />
                <Bar dataKey="count" name="Patientes" fill={C.violet} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Éducation + Matrimoniale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Niveau d'éducation" description="Répartition par niveau scolaire">
              {!educationData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={educationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {educationData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Situation matrimoniale">
              {!matrimonialeData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={matrimonialeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {matrimonialeData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* Couverture médicale + Origines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Couverture médicale">
              {!couvertureData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={couvertureData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={4} dataKey="value" labelLine={false} label={renderPieLabel}>
                      <Cell fill={C.emerald} />
                      <Cell fill={C.slate} />
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Top origines géographiques" description="10 premières origines">
              {!originesData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={originesData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={75} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Effectif']} />
                    <Bar dataKey="value" name="Patientes" fill={C.cyan} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* Antécédents médicaux + obstétricaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Antécédents médicaux" description="Nombre de patientes concernées">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={antecedentsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                  <Bar dataKey="value" name="Patientes" fill={C.rose} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <Section title="Antécédents obstétricaux" description="Nombre de patientes concernées">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={obstetricauxData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                  <Bar dataKey="value" name="Patientes" fill={C.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        </TabsContent>

        {/* ══ TAB 3 : TRAVAIL & ANALGÉSIE ════════════════════════════════════ */}
        <TabsContent value="travail" className="space-y-6 mt-6">
          {/* Suivi + Déclenchement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Suivi prénatal">
              {!suiviData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={suiviData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={4} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {suiviData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Déclenchement du travail">
              {!declenchementData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={declenchementData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={4} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {declenchementData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* Pathologies grossesse */}
          <Section title="Pathologies associées à la grossesse" description="Nombre de patientes concernées">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pathologiesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                <Bar dataKey="value" name="Patientes" fill={C.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Durée travail */}
          {dureeTravailData.length > 0 && (
            <Section title="Durée du travail" description="Durée moyenne des phases (en heures)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dureeTravailData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="phase" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit=" h" />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} h`, '']} />
                  <Legend />
                  <Bar dataKey="min" name="Min" fill={C.cyan} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="moyenne" name="Moyenne" fill={C.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Max" fill={C.violet} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* Délai demande-pose */}
          <Section title="Délai demande–pose de la péridurale"
            description="Distribution des délais entre la demande et la mise en place">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={delaiData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="tranche" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patiente${v > 1 ? 's' : ''}`, 'Effectif']} />
                <Bar dataKey="count" name="Patientes" fill={C.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Effets secondaires */}
          <Section title="Effets secondaires de l'analgésie" description="Nombre de cas déclarés">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={effetsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                <Bar dataKey="value" name="Patientes" fill={C.rose} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Difficultés techniques */}
          <Section title="Difficultés techniques" description="Complications lors de la pose">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={difficultesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Cas']} />
                <Bar dataKey="value" name="Cas" fill={C.amber} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </TabsContent>

        {/* ══ TAB 4 : ACCOUCHEMENT ════════════════════════════════════════════ */}
        <TabsContent value="accouchement" className="space-y-6 mt-6">
          {/* Mode d'accouchement */}
          <Section title="Mode d'accouchement" description="Répartition des voies d'accouchement">
            {!modeAccouchementData.length ? <EmptyChart /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={modeAccouchementData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                    labelLine>
                    {modeAccouchementData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} patiente${v > 1 ? 's' : ''} (${pct(v, n)})`, '']} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Section>

          {/* Score Apgar + Poids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Score Apgar à 1 minute" description="Distribution des scores (0–10)">
              {!apgar1Data.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={apgar1Data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="score" tick={{ fontSize: 12 }} label={{ value: 'Score', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} nouveau-né${v > 1 ? 's' : ''}`, 'Effectif']} />
                    <Bar dataKey="count" name="Nouveau-nés" fill={C.emerald} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Poids de naissance" description="Distribution par tranche (grammes)">
              {poidsData.every((d) => d.count === 0) ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={poidsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tranche" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} nouveau-né${v > 1 ? 's' : ''}`, 'Effectif']} />
                    <Bar dataKey="count" name="Nouveau-nés" fill={C.teal} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* Complications post-partum */}
          <Section title="Complications post-partum" description="Nombre de patientes concernées par type">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={complicationsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                <Bar dataKey="value" name="Patientes" fill={C.rose} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Complications tardives */}
          <Section title="Complications tardives" description="Nombre de patientes concernées par type">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complicationsTardivesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                <Bar dataKey="value" name="Patientes" fill={C.orange} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </TabsContent>

        {/* ══ TAB 5 : EFFICACITÉ & RÉSULTATS ════════════════════════════════ */}
        <TabsContent value="efficacite" className="space-y-6 mt-6">
          {/* Courbe EVA */}
          <Section
            title="Évolution de la douleur (EVA)"
            description="Moyenne de l'échelle visuelle analogique (0 = aucune douleur, 10 = douleur maximale) aux différents temps de mesure">
            {evaData.length < 2 ? (
              <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">
                Données EVA insuffisantes (renseignez l'étape «&nbsp;Efficacité analgésique&nbsp;»)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evaData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} ticks={[0, 2, 4, 6, 8, 10]}
                    label={{ value: 'EVA /10', angle: -90, position: 'insideLeft', fontSize: 11, offset: 10 }} />
                  <Tooltip {...tooltipStyle}
                    formatter={(v: number) => [`${v} / 10`, 'EVA moyen']}
                    labelFormatter={(l) => evaData.find((d) => d.temps === l)?.label ?? l} />
                  <Line type="monotone" dataKey="moyenne" name="EVA moyen"
                    stroke={C.rose} strokeWidth={3} dot={{ r: 6, fill: C.rose }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Section>

          {/* Efficacité globale + Satisfaction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Efficacité globale de l'analgésie">
              {!efficaciteData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={efficaciteData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, 'Patientes']} />
                    <Bar dataKey="value" name="Patientes" radius={[4, 4, 0, 0]}>
                      {efficaciteData.map((_, i) => (
                        <Cell key={i} fill={[C.emerald, C.blue, C.amber, C.rose][i % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Section>

            <Section title="Satisfaction des patientes" description="Répartition par niveau de satisfaction">
              {!satisfactionData.length ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={satisfactionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                      {satisfactionData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} (${pct(v, n)})`, '']} />
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Section>
          </div>

          {/* Satisfaction vs Mode accouchement croisé */}
          <Section
            title="Satisfaction par mode d'accouchement"
            description="Nombre de patientes satisfaites ou très satisfaites selon la voie d'accouchement">
            {(() => {
              const modes = ['Voie basse spontanée', 'Extraction instrumentale', 'Césarienne'];
              const data = modes.map((mode) => {
                const inMode = patients.filter((p) => p.modeAccouchement === mode);
                const sat = inMode.filter(
                  (p) => p.satisfactionPatiente === 'Très satisfaite' || p.satisfactionPatiente === 'Satisfaite'
                ).length;
                return { mode: mode === 'Voie basse spontanée' ? 'Voie basse' : mode, total: inMode.length, satisfaites: sat };
              }).filter((d) => d.total > 0);
              if (!data.length) return <EmptyChart />;
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mode" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill={C.slate} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="satisfaites" name="Satisfaites / Très satisfaites" fill={C.emerald} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
