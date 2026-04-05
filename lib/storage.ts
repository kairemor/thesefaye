import { Patient } from "./types";

export const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const loadFromLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const oui = (v: boolean | undefined) => (v ? "Oui" : "Non");

/**
 * Format a raw date string (YYYY-MM-DD or ISO) to DD/MM/YYYY for Excel readability.
 * Returns the original string unchanged if it cannot be parsed.
 */
const formatDateCell = (raw: string | undefined): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/**
 * Escape and quote a single CSV cell value.
 *
 * Rules (RFC 4180 + Excel safe):
 *  - Always wrap in double-quotes so that semicolons, newlines and accents
 *    inside values are never mistaken for delimiters.
 *  - Escape any literal double-quote inside the value by doubling it ("").
 *  - Convert null/undefined to an empty string.
 */
const cell = (value: string | number | boolean | null | undefined): string => {
  if (value === null || value === undefined) return '""';
  // Use a straight toString — numbers keep their dot decimal separator which
  // is what Excel expects when the surrounding context is already quoted.
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

// ── Column definitions ────────────────────────────────────────────────────────
//
// Each entry is [French header label, value extractor].
// Columns follow the same order as the collection form sections I–IX.

type Col = [string, (p: Patient) => string | number | boolean | null | undefined];

const COLUMNS: Col[] = [
  // ── Identifiant ────────────────────────────────────────────────────────────
  ["N° Patient",                        (p) => p.patientNo],
  ["Date",                              (p) => formatDateCell(p.date)],
  ["Investigateur",                     (p) => p.investigateur],
  ["Nom",                               (p) => p.nom],

  // ── I. Socio-démographique ─────────────────────────────────────────────────
  ["Âge (ans)",                         (p) => p.age],
  ["Profession",                        (p) => p.profession],
  ["Niveau d'éducation",               (p) => p.niveauEducation ?? ""],
  ["Situation matrimoniale",            (p) => p.situationMatrimoniale ?? ""],
  ["Origine géographique",             (p) => p.origine],
  ["Couverture médicale",              (p) => oui(p.couvertureMedicale)],
  ["Type de couverture",               (p) => p.typeCouverture ?? ""],

  // ── II. Antécédents médicaux ───────────────────────────────────────────────
  ["ATCD: Hypertension",               (p) => oui(p.antecedentsMedicaux?.hypertension)],
  ["ATCD: Diabète",                    (p) => oui(p.antecedentsMedicaux?.diabete)],
  ["ATCD: Asthme",                     (p) => oui(p.antecedentsMedicaux?.asthme)],
  ["ATCD: Autres médicaux",            (p) => oui(p.antecedentsMedicaux?.autres)],
  ["ATCD: Autres médicaux (détails)",  (p) => p.antecedentsMedicaux?.autresDetails ?? ""],

  // ── II. Antécédents obstétricaux ───────────────────────────────────────────
  ["Parité",                           (p) => p.antecedentsObstetricaux?.parite ?? ""],
  ["Gestité",                          (p) => p.antecedentsObstetricaux?.gestite ?? ""],
  ["ATCD: Prématurité",               (p) => oui(p.antecedentsObstetricaux?.prematurite)],
  ["ATCD: Mort fœtale in utero",       (p) => oui(p.antecedentsObstetricaux?.mortFoetale)],
  ["ATCD: Césarienne antérieure",     (p) => oui(p.antecedentsObstetricaux?.cesarienneAnterieure)],

  // ── II. Allergies ─────────────────────────────────────────────────────────
  ["Allergies",                        (p) => oui(p.allergies)],
  ["Agent allergène",                  (p) => p.allergiesAgent ?? ""],

  // ── III. Grossesse actuelle ────────────────────────────────────────────────
  ["Âge gestationnel (SA)",            (p) => p.ageGestationnel],
  ["Suivi prénatal",                   (p) => p.suiviPrenatal],
  ["Nombre de consultations",          (p) => p.nombreConsultations ?? ""],
  ["Pathologie: Pré-éclampsie",        (p) => oui(p.pathologiesAssociees?.preEclampsie)],
  ["Pathologie: Diabète gestationnel", (p) => oui(p.pathologiesAssociees?.diabeteGestationnel)],
  ["Pathologie: Anémie",              (p) => oui(p.pathologiesAssociees?.anemie)],
  ["Hémoglobine (g/dL)",              (p) => p.pathologiesAssociees?.hemoglobine ?? ""],
  ["Pathologie: Autres",              (p) => oui(p.pathologiesAssociees?.autres)],
  ["Pathologie: Autres (détails)",    (p) => p.pathologiesAssociees?.autresDetails ?? ""],

  // ── IV. Travail ───────────────────────────────────────────────────────────
  ["Déclenchement du travail",         (p) => p.declenchementTravail],
  ["Méthode de déclenchement",         (p) => p.methodesDeclenchement ?? ""],
  ["Durée phase latente (h)",          (p) => p.dureeTravail?.phaseLatente ?? ""],
  ["Durée phase active (h)",           (p) => p.dureeTravail?.phaseActive ?? ""],
  ["Score de Bishop",                  (p) => p.scoreBishop],
  ["RCF initial (bpm)",                (p) => p.monitoringFoetal?.rcfInitial ?? ""],
  ["RCF rassurant",                    (p) => oui(p.monitoringFoetal?.rassurant)],

  // ── V. Analgésie péridurale ────────────────────────────────────────────────
  ["Demande d'analgésie",              (p) => p.demandeAnalgesie],
  ["Délai demande–pose (min)",         (p) => p.delaiDemandePose ?? ""],
  ["Heure de pose",                    (p) => p.heurePose],
  ["Anesthésique local",              (p) => p.produitsUtilises?.anesthesiqueLocal ?? ""],
  ["Dose anesthésique (mg)",          (p) => p.produitsUtilises?.doseAnesthesique ?? ""],
  ["Adjuvant",                        (p) => p.produitsUtilises?.adjuvant ?? ""],
  ["Dose adjuvant (µg)",              (p) => p.produitsUtilises?.doseAdjuvant ?? ""],
  ["Difficulté: Échec ponction",       (p) => oui(p.difficultesTechniques?.echecPonction)],
  ["Difficulté: Ponction dure-mérienne", (p) => oui(p.difficultesTechniques?.ponctionDureMerienne)],
  ["Difficulté: Autres",              (p) => oui(p.difficultesTechniques?.autres)],
  ["Difficulté: Autres (détails)",    (p) => p.difficultesTechniques?.autresDetails ?? ""],
  ["Niveau de blocage sensitif",       (p) => p.niveauBlocageSensitif],
  ["Effet secondaire: Hypotension",   (p) => oui(p.effetsSecondaires?.hypotension)],
  ["Effet secondaire: Prurit",        (p) => oui(p.effetsSecondaires?.prurit)],
  ["Effet secondaire: Nausées/Vomissements", (p) => oui(p.effetsSecondaires?.nauseesVomissements)],
  ["Effet secondaire: Rétention urinaire",   (p) => oui(p.effetsSecondaires?.retentionUrinaire)],
  ["Effet secondaire: Autres",        (p) => oui(p.effetsSecondaires?.autres)],
  ["Effet secondaire: Autres (détails)", (p) => p.effetsSecondaires?.autresDetails ?? ""],

  // ── VI. Accouchement ──────────────────────────────────────────────────────
  ["Mode d'accouchement",             (p) => p.modeAccouchement],
  ["Type d'extraction",               (p) => p.typeExtraction ?? ""],
  ["Indication césarienne",           (p) => p.indicationCesarienne ?? ""],
  ["Durée 2ème phase (min)",          (p) => p.dureeDeuxiemePhase ?? ""],
  ["Apgar 1re minute",                (p) => p.etatNouveauNe?.apgar1 ?? ""],
  ["Apgar 5e minute",                 (p) => p.etatNouveauNe?.apgar5 ?? ""],
  ["pH cordon",                       (p) => p.etatNouveauNe?.phCordon ?? ""],
  ["Poids naissance (g)",             (p) => p.etatNouveauNe?.poids ?? ""],

  // ── VII. Anesthésie ───────────────────────────────────────────────────────
  ["Niveau de ponction",              (p) => p.niveauPonction],
  ["Espace péridural",                (p) => p.espacePeridural],
  ["Cathéter fixé (cm)",              (p) => p.catheterFixe],
  ["Bolus test",                      (p) => p.bolusTest],
  ["Dilution",                        (p) => p.dilution],
  ["Durée de réalisation (min)",      (p) => p.dureeRealisation],
  ["Niveau sensitif",                 (p) => p.niveauSensitif],
  ["Bloc moteur",                     (p) => p.blocMoteur],
  ["Vitesse de début",                (p) => p.vitesseDebut],

  // ── VIII. Satisfaction & suivi ────────────────────────────────────────────
  ["Satisfaction patiente",                         (p) => p.satisfactionPatiente],
  ["Complication: Céphalées post-ponction",          (p) => oui(p.complicationsPostPartum?.cephaleesPostPonction)],
  ["Complication: Infection site ponction",          (p) => oui(p.complicationsPostPartum?.infectionSitePonction)],
  ["Complication: Douleurs lombaires persistantes",  (p) => oui(p.complicationsPostPartum?.douleursLombairesPersistantes)],
  ["Complication: Autres",                           (p) => oui(p.complicationsPostPartum?.autres)],
  ["Complication: Autres (détails)",                 (p) => p.complicationsPostPartum?.autresDetails ?? ""],
  ["Complication tardive: Névralgie/Dysesthésie",    (p) => oui(p.complicationsTardives?.nevralgieOuDysesthesis)],
  ["Complication tardive: Synd. queue de cheval",    (p) => oui(p.complicationsTardives?.syndromeQueueCheval)],
  ["Complication tardive: Adhérence péridurale",     (p) => oui(p.complicationsTardives?.adherencePeriduraleOuFibrose)],
  ["Complication tardive: Autres",                   (p) => oui(p.complicationsTardives?.autres)],
  ["Complication tardive: Autres (détails)",         (p) => p.complicationsTardives?.autresDetails ?? ""],
  ["Complication néonatale",                         (p) => p.complicationsPostNatalNouveauNe ?? ""],

  // ── IX. Efficacité analgésique ────────────────────────────────────────────
  ["EVA avant analgésie (/10)",        (p) => p.efficaciteAnalgesique?.evaAvantAnalgesie ?? ""],
  ["EVA 15 min après (/10)",           (p) => p.efficaciteAnalgesique?.eva15MinApres ?? ""],
  ["EVA 30 min après (/10)",           (p) => p.efficaciteAnalgesique?.eva30MinApres ?? ""],
  ["EVA à la réinjection (/10)",       (p) => p.efficaciteAnalgesique?.evaDemandeReinjection ?? ""],
  ["Délai d'action (min)",             (p) => p.efficaciteAnalgesique?.delaiActionMinutes ?? ""],
  ["Nécessité de réinjection",         (p) => p.efficaciteAnalgesique?.necessiteReinjection ?? ""],
  ["Nombre de réinjections",           (p) => p.efficaciteAnalgesique?.nombreReinjections ?? ""],
  ["Efficacité globale",               (p) => p.efficaciteAnalgesique?.efficaciteGlobale ?? ""],
  ["Nombre de ponctions",              (p) => p.nombrePonction ?? ""],
];

// ── Export function ───────────────────────────────────────────────────────────

export const exportToCSV = (data: Patient[], filename: string) => {
  if (!data?.length) return;

  /**
   * Separator choice:
   *   French Excel (and most European locales) uses ";" as the default CSV
   *   field separator because "," is already the decimal separator.
   *   Using ";" prevents Excel from lumping all columns into column A.
   */
  const SEP = ";";

  const headerRow = COLUMNS.map(([label]) => cell(label)).join(SEP);
  const dataRows  = data.map((patient) =>
    COLUMNS.map(([, extract]) => cell(extract(patient))).join(SEP)
  );

  /**
   * UTF-8 BOM (\uFEFF):
   *   Without it, Excel mis-reads the encoding and garbles accented characters
   *   (é → é, etc.).  The BOM signals "this file is UTF-8" to Excel on
   *   double-click open.
   */
  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href              = url;
  link.download          = filename;
  link.style.visibility  = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the object URL to free browser memory
  URL.revokeObjectURL(url);
};
