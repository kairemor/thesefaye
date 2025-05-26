'use client';

import { useData } from '@/lib/data-context';
import { PatientStats } from '@/components/dashboard/patient-stats';
import { PatientDistribution } from '@/components/dashboard/patient-distribution';
import { RecentPatients } from '@/components/dashboard/recent-patients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/storage';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { patients } = useData();

  const handleExport = () => {
    exportToCSV(patients, 'patients-analgesie-peridurale.csv');
  };

  return (
    <div className="container py-6 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Suivi de la collecte de données pour l'analgésie péridurale
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/patients/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nouveau Patient</span>
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExport} disabled={patients.length === 0}>
            <Download size={16} className="mr-2" />
            Exporter en CSV
          </Button>
        </div>
      </div>

      <PatientStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution par Satisfaction</CardTitle>
            <CardDescription>Satisfaction des patientes suite à l'analgésie</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientDistribution />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patients Récents</CardTitle>
            <CardDescription>Les 5 derniers patients ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPatients />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}