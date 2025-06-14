import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Patient } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyPatient() {
  return {
    __v: "",
    updatedAt: "",
    createdAt: "",
    _id: "",
    id: generateId(),
    date: getTodayDate(),
    investigateur: "",
    patientNo: "",

    // I. Données Socio-Démographiques
    age: 0,
    profession: "",
    niveauEducation: "Analphabète" as Patient["niveauEducation"],
    situationMatrimoniale: "Mariée" as Patient["situationMatrimoniale"],
    origine: "",
    couvertureMedicale: false,
    nom: "",

    // II. Antécédents
    antecedentsMedicaux: {
      hypertension: false,
      diabete: false,
      asthme: false,
      autres: false,
    },
    antecedentsObstetricaux: {
      parite: 0,
      gestite: 0,
      prematurite: false,
      mortFoetale: false,
      cesarienneAnterieure: false,
    },
    allergies: false,

    // III. Données sur la Grossesse Actuelle
    ageGestationnel: "",
    suiviPrenatal: "Régulier" as Patient["suiviPrenatal"],
    nombreConsultations: 0,
    pathologiesAssociees: {
      preEclampsie: false,
      diabeteGestationnel: false,
      anemie: false,
      autres: false,
    },

    // IV. Données sur le Travail
    declenchementTravail: "Spontané" as Patient["declenchementTravail"],
    dureeTravail: {
      phaseLatente: 0,
      phaseActive: 0,
    },
    scoreBishop: "",
    monitoringFoetal: {
      rcfInitial: 0,
      rassurant: true,
    },

    // V. Données sur l'Analgésie Péridurale
    demandeAnalgesie: "Première phase" as Patient["demandeAnalgesie"],
    delaiDemandePose: 0,
    heurePose: "",
    produitsUtilises: {
      anesthesiqueLocal: "",
      doseAnesthesique: 0,
      adjuvant: "",
      doseAdjuvant: 0,
    },
    difficultesTechniques: {
      echecPonction: false,
      ponctionDureMerienne: false,
      autres: false,
    },
    niveauBlocageSensitif: "",
    effetsSecondaires: {
      hypotension: false,
      prurit: false,
      nauseesVomissements: false,
      retentionUrinaire: false,
      autres: false,
    },

    // VI. Données sur l'Accouchement
    modeAccouchement: "Voie basse spontanée" as Patient["modeAccouchement"],
    dureeDeuxiemePhase: 0,
    etatNouveauNe: {
      apgar1: "",
      apgar5: "",
      phCordon: "",
      poids: "",
    },

    // VII. Anesthésie
    niveauPonction: "",
    espacePeridural: "",
    catheterFixe: "",
    bolusTest: "",
    dilution: "",
    dureeRealisation: "",
    niveauSensitif: "",
    blocMoteur: "",
    vitesseDebut: "",

    // VIII. Satisfaction et Suivi
    satisfactionPatiente: "Très satisfaite" as Patient["satisfactionPatiente"],
    complicationsPostPartum: {
      cephaleesPostPonction: false,
      infectionSitePonction: false,
      douleursLombairesPersistantes: false,
      autres: false,
    },
    complicationsTardives: {
      nevralgieOuDysesthesis: false,
      syndromeQueueCheval: false,
      adherencePeriduraleOuFibrose: false,
      autres: false,
    },
    complicationsPostNatalNouveauNe: "",
  };
}
