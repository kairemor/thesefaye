"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/lib/types";
import { FormHeader } from "@/components/patient-form/form-header";
import { FormStep1 } from "@/components/patient-form/form-step1";
import { FormStep2 } from "@/components/patient-form/form-step2";
import { FormStep3 } from "@/components/patient-form/form-step3";
import { FormStep4 } from "@/components/patient-form/form-step4";
import { FormStep5 } from "@/components/patient-form/form-step5";
import { FormStep6 } from "@/components/patient-form/form-step6";
import { FormStep7 } from "@/components/patient-form/form-step7";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { useData } from "@/lib/data-context";

const STEPS = [
  "Données Socio-Démographiques",
  "Antécédents",
  "Grossesse Actuelle",
  "Travail",
  "Analgésie Péridurale",
  "Accouchement",
  "Satisfaction et Suivi",
];

const formSchema = z.object({
  // Header fields
  date: z.string(),
  investigateur: z.string().min(1, "L'investigateur est requise"),
  patientNo: z.string().min(1, "Le numero du patient est requis"),

  // Step 1: Données Socio-Démographiques
  age: z
    .number()
    .min(12, "L'âge doit être d'au moins 12 ans")
    .max(50, "L'âge doit être au maximum de 50 ans"),
  profession: z.string().min(1, "La profession est requise"),
  niveauEducation: z.string().optional(),
  situationMatrimoniale: z.string().optional(),
  origine: z.string().min(1, "L'origine géographique est requise"),
  couvertureMedicale: z.boolean(),
  typeCouverture: z.string().optional(),

  // Step 2: Antécédents
  antecedentsMedicaux: z.object({
    hypertension: z.boolean(),
    diabete: z.boolean(),
    asthme: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
  antecedentsObstetricaux: z.object({
    parite: z.number().min(0, "La parité doit être un nombre positif"),
    gestite: z.number().min(0, "La gestité doit être un nombre positif"),
    prematurite: z.boolean(),
    mortFoetale: z.boolean(),
    cesarienneAnterieure: z.boolean(),
  }),
  allergies: z.boolean(),
  allergiesAgent: z.string().optional(),

  // Step 3: Grossesse Actuelle
  ageGestationnel: z
    .number()
    .min(22, "L'âge gestationnel doit être d'au moins 22 semaines")
    .max(42, "L'âge gestationnel doit être au maximum de 42 semaines"),
  suiviPrenatal: z.string(),
  nombreConsultations: z
    .number()
    .min(0, "Le nombre de consultations doit être un nombre positif"),
  pathologiesAssociees: z.object({
    preEclampsie: z.boolean(),
    diabeteGestationnel: z.boolean(),
    anemie: z.boolean(),
    hemoglobine: z
      .number()
      .min(4, "L'hémoglobine doit être d'au moins 4 g/dL")
      .max(18, "L'hémoglobine doit être au maximum de 18 g/dL")
      .optional(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),

  // Step 4: Travail
  declenchementTravail: z.string(),
  methodesDeclenchement: z.string().optional(),
  dureeTravail: z.object({
    phaseLatente: z.number().min(0, "La durée doit être un nombre positif"),
    phaseActive: z.number().min(0, "La durée doit être un nombre positif"),
  }),
  scoreBishop: z
    .number()
    .min(0, "Le score doit être au minimum de 0")
    .max(13, "Le score doit être au maximum de 13"),
  monitoringFoetal: z.object({
    rcfInitial: z
      .number()
      .min(60, "La fréquence cardiaque doit être d'au moins 60 bpm")
      .max(220, "La fréquence cardiaque doit être au maximum de 220 bpm"),
    rassurant: z.boolean(),
  }),

  // Step 5: Analgésie Péridurale
  demandeAnalgesie: z.string(),
  delaiDemandePose: z.number().min(0, "Le délai doit être un nombre positif"),
  heurePose: z.string().min(1, "L'heure de pose est requise"),
  produitsUtilises: z.object({
    anesthesiqueLocal: z.string().min(1, "L'anesthésique local est requis"),
    doseAnesthesique: z.number().min(0, "La dose doit être un nombre positif"),
    adjuvant: z.string().min(1, "L'adjuvant est requis"),
    doseAdjuvant: z.number().min(0, "La dose doit être un nombre positif"),
  }),
  difficultesTechniques: z.object({
    echecPonction: z.boolean(),
    ponctionDureMerienne: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
  niveauBlocageSensitif: z.string(),
  effetsSecondaires: z.object({
    hypotension: z.boolean(),
    prurit: z.boolean(),
    nauseesVomissements: z.boolean(),
    retentionUrinaire: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),

  // Step 6: Accouchement
  modeAccouchement: z.string(),
  typeExtraction: z.string().optional(),
  indicationCesarienne: z.string().optional(),
  dureeDeuxiemePhase: z.number().min(0, "La durée doit être un nombre positif"),
  etatNouveauNe: z.object({
    apgar1: z
      .number()
      .min(0, "Le score doit être au minimum de 0")
      .max(10, "Le score doit être au maximum de 10"),
    apgar5: z
      .number()
      .min(0, "Le score doit être au minimum de 0")
      .max(10, "Le score doit être au maximum de 10"),
    phCordon: z
      .number()
      .min(6.8, "Le pH doit être au minimum de 6.8")
      .max(7.5, "Le pH doit être au maximum de 7.5"),
    poids: z
      .number()
      .min(0.5, "Le poids doit être au minimum de 0.5 kg")
      .max(6.0, "Le poids doit être au maximum de 6.0 kg"),
  }),

  // Step 7: Satisfaction et Suivi
  satisfactionPatiente: z.string(),
  complicationsPostPartum: z.object({
    cephaleesPostPonction: z.boolean(),
    infectionSitePonction: z.boolean(),
    douleursLombairesPersistantes: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
  complicationsTardives: z.object({
    nevralgieOuDysesthesis: z.boolean(),
    syndromeQueueCheval: z.boolean(),
    adherencePeriduraleOuFibrose: z.boolean(),
    autres: z.boolean(),
    autresDetails: z.string().optional(),
  }),
});

export type PatientForm = z.infer<typeof formSchema>;

interface PatientFormProps {
  initialData: Patient;
  onSubmit: (data: Patient) => void;
}

export function PatientForm({ initialData, onSubmit }: PatientFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  // const [data, setData] = useState<Patient>(initialData);
  const { addPatient, getPatient, updatePatient } = useData();

  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0: // Header fields // Données Socio-Démographiques
        return [
          "date",
          "investigateur",
          "patientNo",
          "age",
          "profession",
          "niveauEducation",
          "situationMatrimoniale",
          "origine",
          "couvertureMedicale",
          "typeCouverture",
        ];
      case 1: // Antécédents
        return [
          "antecedentsMedicaux",
          "antecedentsObstetricaux",
          "allergies",
          "allergiesAgent",
        ];
      case 2: // Grossesse Actuelle
        return [
          "ageGestationnel",
          "suiviPrenatal",
          "nombreConsultations",
          "pathologiesAssociees",
        ];
      case 3: // Travail
        return [
          "declenchementTravail",
          "methodesDeclenchement",
          "dureeTravail",
          "scoreBishop",
          "monitoringFoetal",
        ];
      case 4: // Analgésie Péridurale
        return [
          "demandeAnalgesie",
          "delaiDemandePose",
          "heurePose",
          "produitsUtilises",
          "difficultesTechniques",
          "niveauBlocageSensitif",
          "effetsSecondaires",
        ];
      case 5: // Accouchement
        return [
          "modeAccouchement",
          "typeExtraction",
          "indicationCesarienne",
          "dureeDeuxiemePhase",
          "etatNouveauNe",
        ];
      case 6: // Satisfaction et Suivi
        return ["satisfactionPatiente", "complicationsPostPartum"];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);

    if (!isValid) {
      return;
    }
    const formData = methods.getValues() as Patient; // Cast to Patient type
    if (getPatient(formData.id)) {
      updatePatient(formData as Patient);
    } else {
      addPatient(formData as Patient);
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onSubmit(formData as Patient);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCancel = () => {
    router.push("/patients");
  };

  // const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  // Show different step components based on current step
  const StepComponent = () => {
    switch (currentStep) {
      case 0:
        return <FormStep1 />;
      case 1:
        return <FormStep2 />;
      case 2:
        return <FormStep3 />;
      case 3:
        return <FormStep4 />;
      case 4:
        return <FormStep5 />;
      case 5:
        return <FormStep6 />;
      case 6:
        return <FormStep7 />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => onSubmit(data as Patient))}>
          <FormHeader />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {currentStep + 1}. {STEPS[currentStep]}
            </h2>
            <div className="text-sm text-muted-foreground">
              Étape {currentStep + 1} / {STEPS.length}
            </div>
          </div>
          {/* 
          <Progress
            max={100}
            value={Math.min(Math.max(progressPercentage || 0, 0), 100)}
            className="h-2 mb-8"
          /> */}

          <Card className="p-6">
            <StepComponent />
          </Card>

          <div className="flex justify-between pt-4">
            <div>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
            </div>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Précédent
                </Button>
              )}
              {/* <Button onClick={handleNext}>
                {currentStep === STEPS.length - 1 ? "Soumettre" : "Suivant"}
              </Button> */}
              {currentStep < STEPS.length ? (
                <Button type="button" onClick={handleNext}>
                  {currentStep == STEPS.length - 1 ? "Soumettre" : "Suivant"}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {"Soumettre"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
