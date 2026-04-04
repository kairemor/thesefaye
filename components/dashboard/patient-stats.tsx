'use client';

import { useData } from '@/lib/data-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Check, AlertCircle, FilePlus } from 'lucide-react';

export function PatientStats() {
  const { patients } = useData();

  // Calculate statistics
  const totalPatients = patients.length;
  const successfulDeliveries = patients.filter(p => 
    p.modeAccouchement === 'Voie basse spontanée' || 
    p.modeAccouchement === 'Extraction instrumentale'
  ).length;
  const caesareanDeliveries = patients.filter(p => 
    p.modeAccouchement === 'Césarienne'
  ).length;
  const complicationsCount = patients.filter(p => 
    p.complicationsPostPartum?.cephaleesPostPonction || 
    p.complicationsPostPartum?.infectionSitePonction || 
    p.complicationsPostPartum?.douleursLombairesPersistantes ||
    p.complicationsPostPartum?.autres
  ).length;

  const pct = (n: number) =>
    totalPatients > 0 ? `${Math.round((n / totalPatients) * 100)}%` : '—';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5" aria-hidden="true">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">Patientes incluses dans l'étude</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Voie Basse</CardTitle>
          <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-1.5" aria-hidden="true">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successfulDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 ? `${pct(successfulDeliveries)} des accouchements` : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Césariennes</CardTitle>
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-1.5" aria-hidden="true">
            <FilePlus className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{caesareanDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 ? `${pct(caesareanDeliveries)} des accouchements` : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-rose-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complications</CardTitle>
          <div className="rounded-full bg-rose-100 dark:bg-rose-900/30 p-1.5" aria-hidden="true">
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complicationsCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 ? `${pct(complicationsCount)} des patientes` : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}