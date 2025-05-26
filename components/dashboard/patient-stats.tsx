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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            Patientes incluses dans l'étude
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accouchements par Voie Basse</CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successfulDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 
              ? `${Math.round((successfulDeliveries / totalPatients) * 100)}% du total`
              : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Césariennes</CardTitle>
          <FilePlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{caesareanDeliveries}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 
              ? `${Math.round((caesareanDeliveries / totalPatients) * 100)}% du total`
              : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complications</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{complicationsCount}</div>
          <p className="text-xs text-muted-foreground">
            {totalPatients > 0 
              ? `${Math.round((complicationsCount / totalPatients) * 100)}% du total`
              : 'Aucune donnée'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}