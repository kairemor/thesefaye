export interface Patient {
  id: string;
  date: string;
  investigateur: string;
  patientNo: string;

  // I. Données Socio-Démographiques
  age: number;
  profession: string;
  niveauEducation: 'Analphabète' | 'Primaire' | 'Secondaire' | 'Universitaire' | '';
  situationMatrimoniale: 'Mariée' | 'Célibataire' | 'Divorcée/Veuve' | '';
  origine: string;
  couvertureMedicale: boolean;
  typeCouverture?: string;

  // II. Antécédents
  antecedentsMedicaux: {
    hypertension: boolean;
    diabete: boolean;
    asthme: boolean;
    autres: boolean;
    autresDetails?: string;
  };
  antecedentsObstetricaux: {
    parite: number;
    gestite: number;
    prematurite: boolean;
    mortFoetale: boolean;
    cesarienneAnterieure: boolean;
  };
  allergies: boolean;
  allergiesAgent?: string;

  // III. Données sur la Grossesse Actuelle
  ageGestationnel: number;
  suiviPrenatal: 'Régulier' | 'Irrégulier' | '';
  nombreConsultations: number;
  pathologiesAssociees: {
    preEclampsie: boolean;
    diabeteGestationnel: boolean;
    anemie: boolean;
    hemoglobine?: number;
    autres: boolean;
    autresDetails?: string;
  };

  // IV. Données sur le Travail
  declenchementTravail: 'Spontané' | 'Médical' | '';
  methodesDeclenchement?: string;
  dureeTravail: {
    phaseLatente: number;
    phaseActive: number;
  };
  scoreBishop: number;
  monitoringFoetal: {
    rcfInitial: number;
    rassurant: boolean;
  };

  // V. Données sur l'Analgésie Péridurale
  demandeAnalgesie: 'Patient' | 'Équipe médicale' | '';
  delaiDemandePose: number;
  heurePose: string;
  produitsUtilises: {
    anesthesiqueLocal: string;
    doseAnesthesique: number;
    adjuvant: string;
    doseAdjuvant: number;
  };
  difficultesTechniques: {
    echecPonction: boolean;
    ponctionDureMerienne: boolean;
    autres: boolean;
    autresDetails?: string;
  };
  niveauBlocageSensitif: string;
  effetsSecondaires: {
    hypotension: boolean;
    prurit: boolean;
    nauseesVomissements: boolean;
    retentionUrinaire: boolean;
    autres: boolean;
    autresDetails?: string;
  };

  // VI. Données sur l'Accouchement
  modeAccouchement: 'Voie basse spontanée' | 'Extraction instrumentale' | 'Césarienne' | '';
  typeExtraction?: string;
  indicationCesarienne?: string;
  dureeDeuxiemePhase: number;
  etatNouveauNe: {
    apgar1: number;
    apgar5: number;
    phCordon: number;
    poids: number;
  };

  // VII. Satisfaction et Suivi
  satisfactionPatiente: 'Très satisfaite' | 'Satisfaite' | 'Neutre' | 'Insatisfaite' | '';
  complicationsPostPartum: {
    cephaleesPostPonction: boolean;
    infectionSitePonction: boolean;
    douleursLombairesPersistantes: boolean;
    autres: boolean;
    autresDetails?: string;
  };
}

export interface StepProps {
  data: Patient;
  updateFields: (fields: Partial<Patient>) => void;
}