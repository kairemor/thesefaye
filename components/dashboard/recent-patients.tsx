'use client';

import Link from 'next/link';
import { useData } from '@/lib/data-context';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { FileEdit } from 'lucide-react';

export function RecentPatients() {
  const { patients } = useData();
  
  // Get the 5 most recent patients
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-8">
        <p className="text-muted-foreground text-center">
          Aucun patient n'a encore été ajouté
        </p>
        <Link href="/patients/new">
          <Button>Ajouter un patient</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {recentPatients.map(patient => (
        <div key={patient.id} className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1">
            <p className="font-medium">
              Patient #{patient.patientNo || 'N/A'}
            </p>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <span>{formatDate(patient.date)}</span>
              <span>•</span>
              <span>{patient.age} ans</span>
            </div>
          </div>
          <Link href={`/patients/${patient.id}`}>
            <Button variant="ghost" size="sm">
              <FileEdit className="h-4 w-4 mr-1" />
              Voir
            </Button>
          </Link>
        </div>
      ))}
      {patients.length > 5 && (
        <div className="pt-2 text-center">
          <Link href="/patients">
            <Button variant="link">Voir tous les patients</Button>
          </Link>
        </div>
      )}
    </div>
  );
}