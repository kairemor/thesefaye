"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import { PatientForm } from "@/components/patient-form/patient-form";
import { createEmptyPatient } from "@/lib/utils";
import { Patient } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function NewPatientPage() {
  const router = useRouter();
  const { addPatient } = useData();
  const { toast } = useToast();
  const [patient] = useState<Patient>(createEmptyPatient());

  const handleSubmit = (completedPatient: Patient) => {
    addPatient(completedPatient);
    toast({
      title: "Patient ajouté",
      description: "Les données du patient ont été enregistrées avec succès.",
    });
    router.push("/patients");
  };

  return (
    <div className="flex-1">
      <div className="container py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Nouveau Patient
        </h1>
        <PatientForm initialData={patient} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
