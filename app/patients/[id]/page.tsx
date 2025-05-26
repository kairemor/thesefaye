'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useData } from '@/lib/data-context';
import { SiteHeader } from '@/components/site-header';
import { PatientForm } from '@/components/patient-form/patient-form';
import { Patient } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const { getPatient, updatePatient } = useData();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundPatient = getPatient(params.id as string);
      if (foundPatient) {
        setPatient(foundPatient);
      } else {
        router.push('/patients');
        toast({
          variant: "destructive",
          title: "Patient introuvable",
          description: "Le patient demandé n'a pas été trouvé.",
        });
      }
      setLoading(false);
    }
  }, [params.id, getPatient, router, toast]);

  const handleSubmit = (updatedPatient: Patient) => {
    updatePatient(updatedPatient);
    toast({
      title: "Patient mis à jour",
      description: "Les données du patient ont été mises à jour avec succès.",
    });
    router.push('/patients');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container py-6">
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Modifier Patient #{patient.patientNo || 'N/A'}
          </h1>
          <PatientForm 
            initialData={patient}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  );
}