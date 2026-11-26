import type { QuestionType } from "@/lib/questions/types";
import { SYLLABUS as MEDICAL_CORE_SYLLABUS } from "./syllabus/medical-core";
import { SYLLABUS as BOARDS_PA_MCAT_SYLLABUS } from "./syllabus/boards-pa-mcat";
import { SYLLABUS as NURSING_PHARMACY_SYLLABUS } from "./syllabus/nursing-pharmacy";

/** Scoring model config. Every estimate is labelled a practice estimate in the UI. */
export type ScoringModel =
  | { type: "nclex"; passingStandard?: number } // readiness + clinical-judgment analysis
  | { type: "percent"; passPercent?: number } // percent correct + subject analysis
  | { type: "scaled"; sections?: { name: string; min: number; max: number }[]; min: number; max: number; step?: number; totalFromSections?: boolean; passMark?: number; label?: string }
  | { type: "band"; min: 0; max: 9; step: 0.5 } // IELTS
  | { type: "grade"; scale: { grade: string; min: number }[]; max: number } // OET 0-500 -> grades
  | { type: "passfail"; passPercent: number };

export const FEATURE_KEYS = [
  "videos",
  "notes",
  "qbank",
  "explanations",
  "flashcards",
  "guides",
  "practice",
  "timed",
  "mock",
  "diagnostic",
  "readiness",
  "analytics",
  "studyPlan",
  "weakAreas",
  "bookmarks",
  "incorrectReview",
  "aiAssistant",
  "caseStudies",
  "adaptive",
  "calculator",
  "labReference",
] as const;
export type FeatureKey = (typeof FEATURE_KEYS)[number];
export const FEATURE_LABELS: Record<FeatureKey, string> = {
  videos: "Video lectures",
  notes: "Topic-wise notes",
  qbank: "Question bank",
  explanations: "Detailed explanations",
  flashcards: "Flashcards",
  guides: "High-yield study guides",
  practice: "Practice tests",
  timed: "Timed tests",
  mock: "Full-length mock exams",
  diagnostic: "Diagnostic assessment",
  readiness: "Readiness assessment",
  analytics: "Performance analytics",
  studyPlan: "Personalized study plan",
  weakAreas: "Weak area practice",
  bookmarks: "Bookmarked questions",
  incorrectReview: "Incorrect question review",
  aiAssistant: "AI study assistant",
  caseStudies: "Clinical case studies",
  adaptive: "Adaptive testing simulation",
  calculator: "On-screen calculator",
  labReference: "Lab / normal values reference",
};

const ALL_ON: Record<FeatureKey, boolean> = Object.fromEntries(FEATURE_KEYS.map((k) => [k, true])) as Record<FeatureKey, boolean>;
const feats = (off: FeatureKey[] = []): Record<FeatureKey, boolean> => ({ ...ALL_ON, ...Object.fromEntries(off.map((k) => [k, false])) });
const NON_CLINICAL_OFF: FeatureKey[] = ["caseStudies", "labReference", "adaptive"];

export type TaxonomyKind = "category" | "subject" | "system" | "section" | "topic" | "subtopic";
export type SeedTaxonomy = { kind: TaxonomyKind; name: string; weight?: number; children?: string[] };

export type SeedExam = {
  slug: string;
  name: string;
  shortName: string;
  category: string; // category slug
  description: string;
  questionTypes: QuestionType[];
  scoring: ScoringModel;
  features: Record<FeatureKey, boolean>;
  durationMinutes: number;
  mockQuestionCount: number;
  /** Which taxonomy axes this exam uses, in display order. */
  axes: TaxonomyKind[];
  taxonomy: SeedTaxonomy[];
  blueprintNote: string;
  status?: "published" | "draft";
};

export const EXAM_CATEGORIES = [
  { slug: "nursing", name: "Nursing Examinations", icon: "stethoscope", description: "Licensure and advanced-practice nursing preparation." },
  { slug: "medical", name: "Medical Examinations", icon: "activity", description: "Medical licensing and board certification preparation." },
  { slug: "dental", name: "Dental Examinations", icon: "smile", description: "Dental admission and licensure preparation." },
  { slug: "pharmacy", name: "Pharmacy Examinations", icon: "pill", description: "Pharmacist licensure and jurisprudence preparation." },
  { slug: "physician-assistant", name: "Physician Assistant Examinations", icon: "user-round-check", description: "PA certification and recertification." },
  { slug: "english", name: "English Language Examinations", icon: "languages", description: "Academic and healthcare English proficiency." },
  { slug: "college", name: "College Entrance Examinations", icon: "graduation-cap", description: "Undergraduate admission tests." },
  { slug: "graduate", name: "Graduate Admission Examinations", icon: "school", description: "Graduate and professional school admission." },
  { slug: "professional", name: "Professional Certification Examinations", icon: "briefcase", description: "Accounting, finance and legal certification." },
] as const;

/* ------------------------------------------------------------------ */
/* NCLEX-RN taxonomy (from the QREXq content specification)            */
/* ------------------------------------------------------------------ */
const NCLEX_CATEGORIES: SeedTaxonomy[] = [
  { kind: "category", name: "Management of Care", weight: 18, children: ["Prioritization", "Delegation", "Assignment of care", "Supervision", "Scope of practice", "Chain of command", "Client rights", "Informed consent", "Advance directives", "Confidentiality", "Privacy", "Ethical principles", "Legal responsibilities", "Incident reports", "Documentation", "Continuity of care", "Discharge planning", "Case management", "Referrals", "Interprofessional collaboration", "Communication with healthcare providers", "Handoff reports", "Emergency preparedness", "Disaster management", "Triage", "Quality improvement", "Patient safety", "Risk management", "Evidence-based practice", "Healthcare policies", "Advocacy", "End-of-life decisions", "Organ donation", "Cultural considerations", "Health insurance and healthcare access"] },
  { kind: "category", name: "Safety and Infection Control", weight: 13, children: ["Standard precautions", "Transmission-based precautions", "Contact precautions", "Droplet precautions", "Airborne precautions", "Protective environment", "Hand hygiene", "Personal protective equipment", "Sterile technique", "Medical asepsis", "Surgical asepsis", "Isolation procedures", "Infection prevention", "Healthcare-associated infections", "Catheter-associated urinary tract infection", "Central line-associated bloodstream infection", "Surgical site infection", "Ventilator-associated pneumonia", "Needlestick injuries", "Blood and body fluid exposure", "Sharps safety", "Fall prevention", "Seizure precautions", "Aspiration precautions", "Suicide precautions", "Restraints", "Fire safety", "Electrical safety", "Radiation safety", "Chemical exposure", "Poisoning", "Medication safety", "Patient identification", "Allergies", "Transfusion reactions", "Emergency response", "Disaster triage", "Workplace violence"] },
  { kind: "category", name: "Health Promotion and Maintenance", weight: 9, children: ["Growth and development", "Developmental milestones", "Newborn care", "Infant care", "Toddler care", "Preschool child care", "School-age child care", "Adolescent health", "Adult health promotion", "Older adult health", "Immunizations", "Screening guidelines", "Nutrition", "Exercise", "Sleep", "Sexual health", "Reproductive health", "Prenatal care", "Postpartum care", "Breastfeeding", "Family planning", "Genetic counseling", "Preventive care", "Health education", "Lifestyle modification", "Smoking cessation", "Alcohol and substance-use prevention", "Obesity prevention", "Chronic disease prevention", "Community health", "Environmental health", "Cultural health practices", "Patient teaching", "Health literacy", "Wellness promotion"] },
  { kind: "category", name: "Psychosocial Integrity", weight: 9, children: ["Therapeutic communication", "Nontherapeutic communication", "Anxiety", "Depression", "Suicide risk", "Self-harm", "Grief and loss", "Crisis intervention", "Coping mechanisms", "Stress management", "Post-traumatic stress disorder", "Panic disorder", "Phobias", "Obsessive-compulsive disorder", "Bipolar disorder", "Schizophrenia", "Psychosis", "Delusions", "Hallucinations", "Personality disorders", "Eating disorders", "Substance-use disorders", "Alcohol withdrawal", "Drug withdrawal", "Abuse and neglect", "Domestic violence", "Child abuse", "Elder abuse", "Human trafficking", "Anger management", "Aggression", "Seclusion", "Restraints in mental health", "Therapeutic milieu", "Psychiatric medications", "Mental health emergencies", "Cultural and spiritual care", "End-of-life psychosocial support", "Family support", "Patient advocacy"] },
  { kind: "category", name: "Basic Care and Comfort", weight: 9, children: ["Hygiene", "Bathing", "Oral care", "Hair care", "Skin care", "Pressure injury prevention", "Positioning", "Mobility", "Ambulation", "Range-of-motion exercises", "Transfer techniques", "Assistive devices", "Bed rest", "Sleep and rest", "Pain management", "Nonpharmacological pain relief", "Nutrition", "Feeding assistance", "Enteral feeding", "Nasogastric tubes", "Gastrostomy tubes", "Bowel elimination", "Constipation", "Diarrhea", "Enemas", "Ostomy care", "Urinary elimination", "Urinary catheterization", "Bladder training", "Incontinence", "Fluid balance", "Intake and output", "Comfort measures", "End-of-life comfort care", "Palliative care", "Mobility safety", "Fall prevention", "Patient positioning for procedures"] },
  { kind: "category", name: "Pharmacological and Parenteral Therapies", weight: 16, children: ["Medication administration", "Medication rights", "Medication reconciliation", "Oral medications", "Sublingual medications", "Buccal medications", "Topical medications", "Transdermal medications", "Ophthalmic medications", "Otic medications", "Nasal medications", "Inhaled medications", "Rectal medications", "Vaginal medications", "Intradermal injections", "Subcutaneous injections", "Intramuscular injections", "Intravenous medications", "IV fluids", "IV therapy", "Central venous access", "Peripheral IV access", "PICC lines", "Port access", "Blood products", "Transfusion reactions", "Medication calculations", "Dosage calculations", "Pediatric medication calculations", "Weight-based dosing", "Safe medication administration", "High-alert medications", "Anticoagulants", "Insulin", "Opioids", "Antibiotics", "Antivirals", "Antifungals", "Antihypertensives", "Cardiac medications", "Diuretics", "Electrolyte replacement", "Corticosteroids", "Anticonvulsants", "Psychotropic medications", "Sedatives", "Chemotherapy", "Antidotes", "Medication side effects", "Adverse reactions", "Drug interactions", "Contraindications", "Patient medication teaching", "Pharmacokinetics", "Pharmacodynamics", "Herbal and alternative medications"] },
  { kind: "category", name: "Reduction of Risk Potential", weight: 12, children: ["Vital signs", "Pain assessment", "Neurological assessment", "Cardiovascular assessment", "Respiratory assessment", "Gastrointestinal assessment", "Genitourinary assessment", "Musculoskeletal assessment", "Skin assessment", "Head-to-toe assessment", "Laboratory values", "Diagnostic tests", "ECG interpretation", "Cardiac monitoring", "Oxygen saturation", "Blood glucose monitoring", "Intake and output", "Fluid and electrolyte balance", "Fall risk assessment", "Pressure injury risk", "Bleeding risk", "Infection risk", "Aspiration risk", "Seizure risk", "Suicide risk", "Complication prevention", "Postoperative monitoring", "Preoperative preparation", "Procedural safety", "Sedation monitoring", "Biopsy care", "Endoscopy care", "Cardiac catheterization", "Central line monitoring", "Chest tube monitoring", "Drain management", "Wound assessment", "Cast and traction care", "Neurovascular assessment", "Compartment syndrome", "Shock monitoring", "Sepsis screening", "Early warning signs", "Rapid response criteria"] },
  { kind: "category", name: "Physiological Adaptation", weight: 14, children: ["Fluid and electrolyte imbalance", "Acid-base balance", "Respiratory failure", "Cardiovascular failure", "Shock", "Sepsis", "Multiple organ dysfunction", "Burns", "Trauma", "Emergency care", "Hemorrhage", "Anaphylaxis", "Acute kidney injury", "Chronic kidney disease", "Liver failure", "Pancreatitis", "Diabetes emergencies", "Hypoglycemia", "Hyperglycemia", "Diabetic ketoacidosis", "Hyperosmolar hyperglycemic state", "Neurological emergencies", "Increased intracranial pressure", "Stroke", "Seizures", "Spinal cord injury", "Head injury", "Respiratory distress", "Pulmonary embolism", "Pneumothorax", "Acute respiratory distress syndrome", "Myocardial infarction", "Heart failure", "Dysrhythmias", "Hypertensive crisis", "Endocrine emergencies", "Thyroid storm", "Myxedema coma", "Adrenal crisis", "Hematological disorders", "Sickle cell crisis", "Disseminated intravascular coagulation", "Immune disorders", "Cancer complications", "Postoperative complications", "Critical care nursing"] },
];

const NCLEX_SUBJECTS: SeedTaxonomy[] = [
  { kind: "subject", name: "Adult Health", children: ["Cardiovascular disorders", "Respiratory disorders", "Neurological disorders", "Gastrointestinal disorders", "Renal and urinary disorders", "Endocrine disorders", "Hematological disorders", "Musculoskeletal disorders", "Integumentary disorders", "Immune disorders", "Oncology", "Emergency nursing", "Critical care nursing", "Perioperative nursing"] },
  { kind: "subject", name: "Fundamentals", children: ["Nursing process", "Assessment", "Diagnosis", "Planning", "Implementation", "Evaluation", "Basic nursing skills", "Documentation", "Communication", "Patient safety", "Mobility", "Hygiene", "Nutrition", "Elimination", "Vital signs", "Pain", "Infection control", "Comfort care"] },
  { kind: "subject", name: "Pharmacology", children: ["Medication classes", "Indications", "Contraindications", "Side effects", "Adverse effects", "Monitoring parameters", "Drug interactions", "Antidotes", "Patient teaching"] },
  { kind: "subject", name: "Maternal and Newborn", children: ["Reproductive anatomy", "Conception", "Prenatal care", "Pregnancy complications", "High-risk pregnancy", "Labor and delivery", "Fetal monitoring", "Obstetric emergencies", "Postpartum care", "Postpartum complications", "Newborn assessment", "Newborn complications", "Neonatal resuscitation concepts", "Breastfeeding", "Formula feeding", "Maternal medications", "Newborn medications", "Rh incompatibility", "Preeclampsia", "Eclampsia", "Gestational diabetes", "Placenta previa", "Abruptio placentae", "Preterm labor", "Premature rupture of membranes", "Cesarean birth", "Postpartum hemorrhage", "Newborn respiratory distress"] },
  { kind: "subject", name: "Pediatrics", children: ["Growth and development", "Pediatric assessment", "Pediatric medication administration", "Pediatric dosage calculations", "Immunizations", "Respiratory disorders", "Cardiovascular disorders", "Neurological disorders", "Gastrointestinal disorders", "Renal disorders", "Endocrine disorders", "Infectious diseases", "Congenital disorders", "Pediatric emergencies", "Child safety", "Abuse and neglect", "Family-centered care", "Pediatric oncology", "Pediatric pain management", "Dehydration", "Fever", "Seizures", "Respiratory distress"] },
  { kind: "subject", name: "Mental Health", children: ["Therapeutic communication", "Psychiatric assessment", "Anxiety disorders", "Mood disorders", "Psychotic disorders", "Personality disorders", "Substance-use disorders", "Eating disorders", "Crisis intervention", "Suicide prevention", "Violence prevention", "Psychiatric medications", "Group therapy", "Milieu therapy", "Legal and ethical issues", "Mental health emergencies"] },
  { kind: "subject", name: "Leadership and Management", children: ["Delegation", "Prioritization", "Assignment", "Supervision", "Conflict resolution", "Leadership styles", "Staff development", "Performance evaluation", "Quality improvement", "Risk management", "Patient safety", "Legal issues", "Ethical issues", "Documentation", "Communication", "Staffing", "Scheduling", "Disaster management", "Triage", "Case management", "Care coordination"] },
];

const BODY_SYSTEMS = ["Cardiovascular", "Respiratory", "Neurological", "Gastrointestinal", "Renal and Urinary", "Endocrine", "Hematological", "Musculoskeletal", "Integumentary", "Immune", "Reproductive", "Psychiatric", "Multisystem"];
const NCLEX_SYSTEMS: SeedTaxonomy[] = BODY_SYSTEMS.map((name) => ({ kind: "system", name }));

const NCLEX_TYPES: QuestionType[] = ["mcq", "sata", "multiple_response", "ordered", "matrix", "bowtie", "highlight", "cloze", "trend", "numeric"];

const sections = (names: [string, number?, string[]?][]): SeedTaxonomy[] => names.map(([name, weight, children]) => ({ kind: "section", name, weight, children }));

/* ------------------------------------------------------------------ */
/* Medical & nursing-school exams: subject x system structure.         */
/* Subject / system filters follow the way major QBanks slice content, */
/* so a learner can build a test by discipline or by organ system.     */
/* ------------------------------------------------------------------ */
const subj = (name: string, children: string[] = []): SeedTaxonomy => ({ kind: "subject", name, children });
const systems = (names: string[]): SeedTaxonomy[] => names.map((name) => ({ kind: "system", name }));

const STEP1_SYSTEMS = systems([
  "Cardiovascular", "Respiratory", "Renal and Urinary", "Gastrointestinal", "Endocrine", "Reproductive",
  "Musculoskeletal and Connective Tissue", "Nervous System", "Hematology and Oncology", "Immune System", "Dermatology",
  "Ear, Nose and Throat", "Ophthalmology", "Behavioral Health", "Biochemistry and Nutrition", "Genetics", "Biostatistics and Epidemiology",
  "Ethics, Safety and Communication", "Multisystem Processes",
]);

const CLINICAL_SYSTEMS = systems([
  "Cardiovascular", "Respiratory", "Renal and Urinary", "Gastrointestinal and Nutrition", "Endocrine, Diabetes and Metabolism",
  "Reproductive and Endocrine", "Musculoskeletal and Rheumatology", "Nervous System and Special Senses", "Hematology and Oncology",
  "Infectious Diseases", "Dermatology", "Behavioral Health", "Pregnancy, Childbirth and the Puerperium", "Biostatistics and Epidemiology",
  "Ethics, Law and Patient Safety", "Multisystem Processes",
]);

const medExam = (o: {
  slug: string; name: string; shortName: string; category?: string; subjects: SeedTaxonomy[]; systems: SeedTaxonomy[];
  duration: number; mock: number; description?: string; scoring?: ScoringModel; features?: Record<FeatureKey, boolean>;
  note?: string;
}): SeedExam => ({
  slug: o.slug, name: o.name, shortName: o.shortName, category: o.category ?? "medical",
  description: o.description ?? `${o.name} preparation with clinical vignettes, image- and lab-based items, timed blocks, subject and system analytics and a built-in study schedule.`,
  questionTypes: ["mcq", "trend"],
  scoring: o.scoring ?? { type: "percent", passPercent: 65 },
  features: o.features ?? feats(["caseStudies", "adaptive"]),
  durationMinutes: o.duration, mockQuestionCount: o.mock,
  axes: ["subject", "system", "topic"], taxonomy: [...o.subjects, ...o.systems],
  blueprintNote: o.note ?? `Subjects and systems reflect the publicly described ${o.name} content outline at a high level; validate against the current official outline.`,
});

const MEDICAL_EXAMS: SeedExam[] = [
  medExam({
    slug: "usmle-step-1", name: "USMLE Step 1", shortName: "Step 1", duration: 480, mock: 280,
    subjects: [
      subj("Anatomy", ["Gross anatomy", "Neuroanatomy", "Embryology", "Histology and cell biology", "Imaging and surface anatomy"]),
      subj("Behavioral Science", ["Human development", "Learning and memory", "Sleep", "Psychopathology", "Substance use", "Sexuality and gender"]),
      subj("Biochemistry and Nutrition", ["Metabolism", "Vitamins and minerals", "Enzymes", "Molecular biology", "Lysosomal and glycogen storage diseases"]),
      subj("Biostatistics and Epidemiology", ["Study design", "Bias and confounding", "Test characteristics", "Hypothesis testing", "Risk measures"]),
      subj("Genetics", ["Inheritance patterns", "Population genetics", "Chromosomal disorders", "Trinucleotide repeats"]),
      subj("Immunology", ["Innate immunity", "Adaptive immunity", "Hypersensitivity", "Immunodeficiency", "Transplant and tolerance"]),
      subj("Microbiology", ["Bacteriology", "Virology", "Mycology", "Parasitology", "Antimicrobial therapy"]),
      subj("Pathology", ["Cell injury and inflammation", "Neoplasia", "Hemodynamics", "Environmental pathology", "Organ-system pathology"]),
      subj("Pharmacology", ["Pharmacokinetics", "Pharmacodynamics", "Autonomic drugs", "Drug toxicities", "Drug interactions"]),
      subj("Physiology", ["Cardiovascular physiology", "Respiratory physiology", "Renal physiology and acid-base", "Endocrine physiology", "Gastrointestinal physiology"]),
      subj("Ethics, Safety and Communication", ["Informed consent", "Confidentiality", "Medical errors", "Breaking bad news"]),
    ],
    systems: STEP1_SYSTEMS,
  }),
  medExam({
    slug: "usmle-step-2-ck", name: "USMLE Step 2 CK", shortName: "Step 2 CK", duration: 540, mock: 318,
    subjects: [
      subj("Internal Medicine", ["Cardiology", "Pulmonology", "Gastroenterology", "Nephrology", "Endocrinology", "Hematology and Oncology", "Infectious Diseases", "Rheumatology", "Geriatrics"]),
      subj("Surgery", ["Trauma", "Acute abdomen", "Perioperative care", "Vascular surgery", "Surgical oncology", "Burns"]),
      subj("Pediatrics", ["Neonatology", "Growth and development", "Congenital disorders", "Pediatric infections", "Pediatric emergencies"]),
      subj("Obstetrics and Gynecology", ["Prenatal care", "Obstetric complications", "Labor and delivery", "Gynecologic disorders", "Reproductive endocrinology"]),
      subj("Psychiatry", ["Mood disorders", "Psychotic disorders", "Anxiety disorders", "Substance use", "Psychopharmacology"]),
      subj("Neurology", ["Stroke", "Seizures", "Headache", "Neuromuscular disease", "Neurodegenerative disease"]),
      subj("Emergency Medicine", ["Resuscitation", "Toxicology", "Environmental emergencies", "Shock"]),
      subj("Family Medicine", ["Preventive care and screening", "Chronic disease management", "Musculoskeletal complaints"]),
      subj("Biostatistics, Ethics and Patient Safety", ["Study design", "Screening tests", "Medical ethics", "Quality improvement"]),
    ],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "usmle-step-3", name: "USMLE Step 3", shortName: "Step 3", duration: 900, mock: 413,
    subjects: [
      subj("Foundations of Independent Practice", ["Biostatistics and epidemiology", "Ethics and professionalism", "Patient safety", "Communication", "Health systems"]),
      subj("Advanced Clinical Medicine", ["Diagnosis", "Prognosis", "Management of chronic illness", "Acute care", "Prevention and screening"]),
      subj("Internal Medicine"), subj("Surgery"), subj("Pediatrics"), subj("Obstetrics and Gynecology"), subj("Psychiatry"), subj("Emergency Medicine"),
      subj("Computer-based Case Simulations (CCS)", ["Initial work-up", "Ongoing management", "Disposition"]),
    ],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "comlex-level-1", name: "COMLEX-USA Level 1", shortName: "COMLEX 1", duration: 480, mock: 352,
    subjects: [
      subj("Osteopathic Principles, Practice and Manipulation", ["Somatic dysfunction", "Muscle energy and HVLA", "Fascial and counterstrain techniques", "Cranial osteopathy", "Autonomic nervous system and viscerosomatic reflexes"]),
      subj("Anatomy", ["Gross anatomy", "Neuroanatomy", "Embryology", "Histology"]),
      subj("Biochemistry"), subj("Microbiology and Immunology"), subj("Pathology"), subj("Pharmacology"), subj("Physiology"), subj("Behavioral Science and Ethics"),
      subj("Biostatistics and Epidemiology"),
    ],
    systems: STEP1_SYSTEMS,
  }),
  medExam({
    slug: "comlex-level-2", name: "COMLEX-USA Level 2-CE", shortName: "COMLEX 2", duration: 480, mock: 352,
    subjects: [
      subj("Osteopathic Principles, Practice and Manipulation", ["Diagnosis of somatic dysfunction", "Manipulative treatment by region", "Indications and contraindications"]),
      subj("Internal Medicine"), subj("Surgery"), subj("Obstetrics and Gynecology"), subj("Pediatrics"), subj("Psychiatry"), subj("Emergency Medicine"),
      subj("Family Medicine and Community Health"), subj("Geriatrics and Palliative Care"),
    ],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "abim", name: "Internal Medicine (ABIM)", shortName: "ABIM", duration: 600, mock: 240,
    description: "ABIM Internal Medicine certification and MOC preparation with board-style vignettes, image- and ECG-based items and subspecialty analytics.",
    subjects: [
      subj("Cardiovascular Disease"), subj("Endocrinology, Diabetes and Metabolism"), subj("Gastroenterology"), subj("Infectious Disease"), subj("Nephrology"),
      subj("Pulmonary Disease and Critical Care"), subj("Hematology"), subj("Medical Oncology"), subj("Rheumatology"), subj("Allergy and Immunology"),
      subj("Neurology"), subj("Psychiatry"), subj("Dermatology"), subj("Geriatric Medicine"), subj("Women's Health"), subj("Ethics and Patient Safety"),
    ],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "abfm", name: "Family Medicine (ABFM)", shortName: "ABFM", duration: 480, mock: 300,
    description: "ABFM certification and Continuous Certification preparation across the whole lifespan, organised by clinical domain and organ system.",
    subjects: [
      subj("Acute Care and Diagnosis", ["Common presenting complaints", "Infections", "Injuries"]),
      subj("Chronic Care Management", ["Diabetes", "Hypertension", "COPD and asthma", "Heart failure", "Chronic kidney disease"]),
      subj("Emergent and Urgent Care"), subj("Preventive Care and Screening"), subj("Foundations of Care"),
      subj("Maternity and Newborn Care"), subj("Pediatrics and Adolescent Medicine"), subj("Geriatrics and Palliative Care"), subj("Mental Health and Substance Use"),
    ],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "preclinical-qbank", name: "Preclinical QBank", shortName: "Preclinical", duration: 240, mock: 160,
    description: "Course-aligned basic-science practice for the first two years of medical school: build quizzes by discipline or organ system and track mastery all year long.",
    subjects: [
      subj("Anatomy"), subj("Histology and Cell Biology"), subj("Embryology"), subj("Biochemistry"), subj("Genetics"), subj("Immunology"), subj("Microbiology"),
      subj("Pathology"), subj("Pharmacology"), subj("Physiology"), subj("Neuroscience"), subj("Behavioral Science"), subj("Biostatistics and Epidemiology"),
    ],
    systems: STEP1_SYSTEMS, scoring: { type: "percent", passPercent: 70 }, features: feats(["caseStudies", "adaptive"]),
    note: "Disciplines and systems follow the typical first-two-year medical curriculum; map to your school's own course list.",
  }),
  medExam({
    slug: "clinical-qbank", name: "Clinical QBank", shortName: "Clinical", duration: 240, mock: 160,
    description: "Clerkship and shelf-exam practice: build quizzes by rotation or organ system with clinical vignettes, management questions and next-best-step items.",
    subjects: [
      subj("Internal Medicine"), subj("Surgery"), subj("Pediatrics"), subj("Obstetrics and Gynecology"), subj("Psychiatry"), subj("Neurology"),
      subj("Family Medicine"), subj("Emergency Medicine"), subj("Ambulatory Care"),
    ],
    systems: CLINICAL_SYSTEMS, scoring: { type: "percent", passPercent: 70 },
    note: "Rotations mirror the usual third- and fourth-year clerkships; map to your school's shelf exam outlines.",
  }),
  medExam({
    slug: "ukmla", name: "UKMLA Applied Knowledge Test", shortName: "UKMLA AKT", duration: 360, mock: 200,
    subjects: [subj("Acute and Emergency"), subj("Cancer"), subj("Cardiovascular"), subj("Medicine of Older Adults"), subj("Mental Health"), subj("Child Health"), subj("Clinical Pharmacology"), subj("Ethics, Law and Professionalism")],
    systems: CLINICAL_SYSTEMS,
  }),
  medExam({
    slug: "plab", name: "PLAB 1", shortName: "PLAB 1", duration: 180, mock: 180,
    subjects: [subj("Acute Medicine"), subj("Surgery"), subj("General Practice"), subj("Obstetrics and Gynaecology"), subj("Paediatrics"), subj("Ethics and Law")],
    systems: CLINICAL_SYSTEMS, scoring: { type: "passfail", passPercent: 63 },
  }),
];

/** Nursing programme courses (pre-licensure exam prep alongside the licensure exams). */
const NURSING_SCHOOL_EXAM: SeedExam = {
  slug: "nursing-school", name: "Nursing School Exam Prep", shortName: "Nursing School", category: "nursing",
  description: "Course-by-course practice for pre-licensure nursing programmes: fundamentals, med-surg, pharmacology, maternity, paediatrics, mental health, community health and leadership, with ATI/HESI-style test items.",
  questionTypes: NCLEX_TYPES, scoring: { type: "percent", passPercent: 80 }, features: feats(), durationMinutes: 180, mockQuestionCount: 100,
  axes: ["subject", "system", "topic"],
  taxonomy: [
    subj("Fundamentals of Nursing", ["Nursing process", "Vital signs and assessment", "Safety and infection control", "Hygiene and comfort", "Documentation", "Basic skills"]),
    subj("Medical-Surgical Nursing", ["Cardiovascular", "Respiratory", "Neurological", "Renal and urinary", "Gastrointestinal", "Endocrine", "Musculoskeletal", "Oncology", "Perioperative care"]),
    subj("Pharmacology", ["Drug classes", "Medication administration", "Dosage calculations", "Adverse effects", "Patient teaching"]),
    subj("Maternal and Newborn Nursing", ["Antepartum", "Intrapartum", "Postpartum", "Newborn care", "Obstetric complications"]),
    subj("Pediatric Nursing", ["Growth and development", "Paediatric assessment", "Common childhood illness", "Immunisations", "Child safety"]),
    subj("Mental Health Nursing", ["Therapeutic communication", "Mood and anxiety disorders", "Psychosis", "Substance use", "Crisis care"]),
    subj("Community and Public Health Nursing", ["Epidemiology", "Health promotion", "Screening", "Environmental health", "Disaster preparedness"]),
    subj("Gerontological Nursing", ["Ageing changes", "Falls and safety", "Dementia and delirium", "Polypharmacy", "End-of-life care"]),
    subj("Leadership and Management", ["Delegation", "Prioritisation", "Ethics and legal issues", "Quality improvement", "Conflict resolution"]),
    subj("Anatomy, Physiology and Pathophysiology", ["Body systems", "Fluid and electrolytes", "Acid-base balance", "Disease processes"]),
    subj("Nutrition and Dietetics", ["Macronutrients and micronutrients", "Therapeutic diets", "Enteral and parenteral nutrition"]),
    subj("Nursing Research and Evidence-Based Practice", ["Study designs", "Critical appraisal", "Applying evidence"]),
    ...NCLEX_SYSTEMS,
  ],
  blueprintNote: "Course list follows the typical pre-licensure nursing curriculum; map to your own programme's syllabus.",
};

const UMPJE_EXAM: SeedExam = {
  slug: "umpje", name: "UMPJE (Uniform MPJE)", shortName: "UMPJE", category: "pharmacy",
  description: "Multi-state pharmacy jurisprudence preparation covering federal and state law, dispensing, compounding, controlled substances and pharmacy operations.",
  questionTypes: ["mcq", "sata", "numeric", "ordered"], scoring: { type: "scaled", min: 0, max: 100, passMark: 75, label: "Scaled score" },
  features: feats(["caseStudies", "adaptive"]), durationMinutes: 120, mockQuestionCount: 100,
  axes: ["section", "topic"],
  taxonomy: sections([
    ["Pharmacy Practice", 35, ["Dispensing", "Counselling", "Compounding", "Immunisation authority"]],
    ["Licensure, Registration and Operations", 30, ["Licensure", "Facilities and permits", "Technicians and staffing", "Records"]],
    ["Controlled Substances", 20, ["Schedules", "DEA requirements", "Prescription rules", "Diversion and reporting"]],
    ["General Regulatory Processes", 15, ["FDA regulation", "Recalls", "Adverse event reporting", "Privacy law"]],
  ]),
  blueprintNote: "Areas reflect the publicly described NABP competency statements at a high level; validate against the current version.",
};

/* ------------------------------------------------------------------ */
/* Exam catalogue. Admins can edit/disable/remove any of these in-app. */
/* ------------------------------------------------------------------ */
export const EXAMS: SeedExam[] = [
  // NURSING
  {
    slug: "nclex-rn", name: "NCLEX-RN", shortName: "NCLEX-RN", category: "nursing",
    description: "Complete NCLEX-RN-style preparation: client-needs categories, NGN clinical judgment case studies, bow-tie, matrix, cloze and trend items, 100-question assessments and adaptive mock exams.",
    questionTypes: NCLEX_TYPES, scoring: { type: "nclex", passingStandard: 0 }, features: feats(), durationMinutes: 300, mockQuestionCount: 150,
    axes: ["category", "subject", "system", "topic"], taxonomy: [...NCLEX_CATEGORIES, ...NCLEX_SUBJECTS, ...NCLEX_SYSTEMS],
    blueprintNote: "Mapped to the publicly described NCLEX-RN client-needs categories and NCSBN Clinical Judgment Measurement Model. Weights are approximate midpoints and must be validated against the current NCSBN test plan before each release.",
  },
  {
    slug: "nclex-pn", name: "NCLEX-PN", shortName: "NCLEX-PN", category: "nursing",
    description: "Practical/vocational nursing licensure preparation organised by PN client-needs categories, including NGN items.",
    questionTypes: NCLEX_TYPES, scoring: { type: "nclex", passingStandard: 0 }, features: feats(), durationMinutes: 300, mockQuestionCount: 125,
    axes: ["category", "topic"], taxonomy: [
      { kind: "category", name: "Coordinated Care", weight: 21, children: ["Advocacy", "Client rights", "Delegation", "Confidentiality", "Informed consent", "Prioritization", "Continuity of care"] },
      { kind: "category", name: "Safety and Infection Prevention and Control", weight: 13, children: ["Standard precautions", "Fall prevention", "Restraints", "Medication safety", "Transmission-based precautions"] },
      { kind: "category", name: "Health Promotion and Maintenance", weight: 9, children: ["Growth and development", "Immunizations", "Prenatal care", "Health screening"] },
      { kind: "category", name: "Psychosocial Integrity", weight: 10, children: ["Therapeutic communication", "Coping mechanisms", "Grief and loss", "Substance-use disorders"] },
      { kind: "category", name: "Basic Care and Comfort", weight: 9, children: ["Hygiene", "Mobility", "Nutrition", "Elimination", "Rest and sleep"] },
      { kind: "category", name: "Pharmacological Therapies", weight: 15, children: ["Medication administration", "Dosage calculations", "Adverse effects", "Expected actions"] },
      { kind: "category", name: "Reduction of Risk Potential", weight: 12, children: ["Laboratory values", "Diagnostic tests", "Vital signs", "Potential complications"] },
      { kind: "category", name: "Physiological Adaptation", weight: 11, children: ["Fluid and electrolyte imbalance", "Medical emergencies", "Alterations in body systems"] },
    ],
    blueprintNote: "Mapped to NCLEX-PN client-needs categories; validate weights against the current NCSBN PN test plan.",
  },
  {
    slug: "fnp", name: "Family Nurse Practitioner (FNP)", shortName: "FNP", category: "nursing",
    description: "FNP board certification preparation across the lifespan: assessment, diagnosis, clinical management and professional role.",
    questionTypes: ["mcq", "sata"], scoring: { type: "scaled", min: 200, max: 800, passMark: 500, label: "Scaled score" }, features: feats(["caseStudies", "adaptive"]), durationMinutes: 210, mockQuestionCount: 150,
    axes: ["section", "topic"], taxonomy: sections([["Assessment", 20, ["History taking", "Physical examination", "Diagnostic testing"]], ["Diagnosis", 20, ["Differential diagnosis", "Clinical reasoning"]], ["Plan and Management", 35, ["Pharmacotherapeutics", "Chronic disease management", "Acute care", "Pediatrics", "Women's health", "Geriatrics"]], ["Evaluation", 15, ["Outcome evaluation", "Follow-up"]], ["Professional Role", 10, ["Scope of practice", "Ethics", "Health policy"]]]),
    blueprintNote: "Domains reflect the general structure of FNP certification blueprints; validate against the certifying body's current content outline.",
  },
  {
    slug: "clinical-math", name: "Clinical Medical Mathematics", shortName: "Clin Math", category: "nursing",
    description: "Dosage calculations, IV flow rates, weight-based and pediatric dosing, unit conversions and titrations.",
    questionTypes: ["numeric", "mcq"], scoring: { type: "percent", passPercent: 90 }, features: feats(["caseStudies", "videos", "adaptive"]), durationMinutes: 60, mockQuestionCount: 40,
    axes: ["section", "topic"], taxonomy: sections([["Unit Conversions", 15, ["Metric conversions", "Household to metric"]], ["Oral Dosage", 20, ["Tablets", "Liquids"]], ["Parenteral Dosage", 20, ["Injections", "Reconstitution"]], ["IV Calculations", 25, ["Flow rates (mL/hr)", "Drip rates (gtt/min)", "Infusion time"]], ["Weight-Based and Pediatric Dosing", 20, ["mg/kg dosing", "Safe dose range", "Titrations"]]]),
    blueprintNote: "Internal competency course; no external blueprint.",
  },
  NURSING_SCHOOL_EXAM,
  // MEDICAL
  ...MEDICAL_EXAMS,
  // DENTAL
  {
    slug: "dat", name: "Dental Admission Test (DAT)", shortName: "DAT", category: "dental",
    description: "Survey of natural sciences, perceptual ability, reading comprehension and quantitative reasoning with full-length practice tests.",
    questionTypes: ["mcq", "numeric"], scoring: { type: "scaled", min: 1, max: 30, sections: [{ name: "Survey of Natural Sciences", min: 1, max: 30 }, { name: "Perceptual Ability", min: 1, max: 30 }, { name: "Reading Comprehension", min: 1, max: 30 }, { name: "Quantitative Reasoning", min: 1, max: 30 }], label: "Academic average" },
    features: feats(NON_CLINICAL_OFF), durationMinutes: 270, mockQuestionCount: 280,
    axes: ["section", "topic"], taxonomy: sections([["Survey of Natural Sciences", 40, ["Biology", "General Chemistry", "Organic Chemistry"]], ["Perceptual Ability", 20, ["Angle ranking", "Hole punching", "Cube counting", "Pattern folding"]], ["Reading Comprehension", 20, ["Scientific passages"]], ["Quantitative Reasoning", 20, ["Algebra", "Data analysis", "Probability and statistics"]]]),
    blueprintNote: "Sections follow the publicly described DAT structure; validate against the current ADA DAT guide.",
  },
  ...(
    [
      ["inbde", "Integrated National Board Dental Examination (INBDE)", "INBDE", ["Foundation Knowledge", "Clinical Content", "Patient Management", "Oral Diagnosis"]],
      ["nbde", "National Board Dental Examination (NBDE)", "NBDE", ["Anatomic Sciences", "Biochemistry and Physiology", "Microbiology and Pathology", "Dental Anatomy and Occlusion"]],
      ["dental-anatomy", "Dental Anatomy", "Dental Anatomy", ["Tooth Morphology", "Occlusion", "Tooth Development", "Head and Neck Anatomy"]],
      ["dental-sciences", "Dental Sciences", "Dental Sciences", ["Oral Pathology", "Periodontics", "Endodontics", "Prosthodontics", "Dental Materials"]],
    ] as [string, string, string, string[]][]
  ).map(([slug, name, shortName, secs]) => ({
    slug, name, shortName, category: "dental",
    description: `${name} preparation with topic-wise question banks, case-based items and timed practice.`,
    questionTypes: ["mcq", "sata"] as QuestionType[], scoring: { type: "percent", passPercent: 70 } as ScoringModel,
    features: feats(["caseStudies", "adaptive", "labReference"]), durationMinutes: 210, mockQuestionCount: 150,
    axes: ["section", "topic"] as TaxonomyKind[], taxonomy: sections(secs.map((s) => [s])),
    blueprintNote: "High-level structure only; validate against the current JCNDE specification.",
  })),
  // PHARMACY
  ...(
    [
      ["naplex", "NAPLEX", "NAPLEX", ["Foundational Knowledge", "Medication Use Process", "Person-Centered Assessment and Treatment Planning"], 360, 225, { type: "scaled", min: 0, max: 150, passMark: 75, label: "Scaled score" }],
      ["mpje", "MPJE", "MPJE", ["Pharmacy Practice", "Licensure and Operations", "General Regulatory Processes"], 150, 120, { type: "scaled", min: 0, max: 100, passMark: 75, label: "Scaled score" }],
      ["cpje", "CPJE (California)", "CPJE", ["Patient Medication Profiles", "Prescriptions and Dispensing", "Pharmacy Operations"], 120, 90, { type: "passfail", passPercent: 75 }],
    ] as [string, string, string, string[], number, number, ScoringModel][]
  ).map(([slug, name, shortName, secs, duration, mock, scoring]) => ({
    slug, name, shortName, category: "pharmacy",
    description: `${name} preparation: calculations, therapeutics and law with timed practice exams.`,
    questionTypes: ["mcq", "sata", "numeric", "ordered"] as QuestionType[], scoring,
    features: feats(["caseStudies", "adaptive"]), durationMinutes: duration, mockQuestionCount: mock,
    axes: ["section", "topic"] as TaxonomyKind[], taxonomy: sections(secs.map((s) => [s])),
    blueprintNote: "Areas reflect the publicly described NABP competency statements at a high level; validate against the current version.",
  })),
  UMPJE_EXAM,
  // PA
  ...(
    [
      ["pance", "PANCE", "PANCE"],
      ["panre", "PANRE", "PANRE"],
    ] as [string, string, string][]
  ).map(([slug, name, shortName]) => ({
    slug, name, shortName, category: "physician-assistant",
    description: `${name} preparation by organ system and task area with clinical vignettes.`,
    questionTypes: ["mcq"] as QuestionType[], scoring: { type: "scaled", min: 200, max: 800, passMark: 350, label: "Scaled score" } as ScoringModel,
    features: feats(["caseStudies", "adaptive"]), durationMinutes: 300, mockQuestionCount: 300,
    axes: ["system", "section", "topic"] as TaxonomyKind[],
    taxonomy: [...NCLEX_SYSTEMS, ...sections([["History Taking and Physical Examination"], ["Diagnostic Studies"], ["Diagnosis"], ["Health Maintenance"], ["Clinical Intervention"], ["Pharmaceutical Therapeutics"], ["Applying Basic Science Concepts"]])],
    blueprintNote: "Organ systems and task areas reflect the NCCPA blueprint structure at a high level; validate against the current blueprint.",
  })),
  // ENGLISH
  {
    slug: "ielts-academic", name: "IELTS Academic", shortName: "IELTS Ac", category: "english",
    description: "Listening, Reading, Writing and Speaking practice with band-score estimates and AI-assisted writing/speaking feedback.",
    questionTypes: ["mcq", "sata", "cloze", "writing", "speaking"], scoring: { type: "band", min: 0, max: 9, step: 0.5 }, features: feats(NON_CLINICAL_OFF.concat(["calculator"])), durationMinutes: 165, mockQuestionCount: 82,
    axes: ["section", "topic"], taxonomy: sections([["Listening", 25, ["Conversations", "Lectures"]], ["Reading", 25, ["Academic passages", "True/False/Not Given"]], ["Writing", 25, ["Task 1 (data description)", "Task 2 (essay)"]], ["Speaking", 25, ["Part 1 interview", "Part 2 cue card", "Part 3 discussion"]]]),
    blueprintNote: "Four skills structure; band descriptors simplified for practice estimates only.",
  },
  {
    slug: "ielts-general", name: "IELTS General Training", shortName: "IELTS GT", category: "english",
    description: "General Training reading and letter writing plus shared Listening/Speaking practice with band-score estimates.",
    questionTypes: ["mcq", "sata", "cloze", "writing", "speaking"], scoring: { type: "band", min: 0, max: 9, step: 0.5 }, features: feats(NON_CLINICAL_OFF.concat(["calculator"])), durationMinutes: 165, mockQuestionCount: 82,
    axes: ["section", "topic"], taxonomy: sections([["Listening", 25, ["Social contexts", "Training contexts"]], ["Reading", 25, ["Everyday texts", "Workplace texts"]], ["Writing", 25, ["Task 1 (letter)", "Task 2 (essay)"]], ["Speaking", 25, ["Part 1 interview", "Part 2 cue card", "Part 3 discussion"]]]),
    blueprintNote: "Four skills structure; band descriptors simplified for practice estimates only.",
  },
  ...(
    [
      ["oet-nursing", "OET Nursing", "OET Nursing", "nurses"],
      ["oet-medicine", "OET Medicine", "OET Medicine", "doctors"],
    ] as [string, string, string, string][]
  ).map(([slug, name, shortName, who]) => ({
    slug, name, shortName, category: "english",
    description: `Healthcare English for ${who}: profession-specific listening, reading, referral-letter writing and role-play speaking with grade estimates.`,
    questionTypes: ["mcq", "cloze", "writing", "speaking"] as QuestionType[],
    scoring: { type: "grade", max: 500, scale: [{ grade: "A", min: 450 }, { grade: "B", min: 350 }, { grade: "C+", min: 300 }, { grade: "C", min: 200 }, { grade: "D", min: 100 }, { grade: "E", min: 0 }] } as ScoringModel,
    features: feats(NON_CLINICAL_OFF.concat(["calculator"])), durationMinutes: 180, mockQuestionCount: 84,
    axes: ["section", "topic"] as TaxonomyKind[], taxonomy: sections([["Listening", 25, ["Consultation extracts", "Workplace extracts", "Presentations"]], ["Reading", 25, ["Expeditious reading", "Careful reading"]], ["Writing", 25, ["Referral letter", "Discharge letter"]], ["Speaking", 25, ["Role-play"]]]),
    blueprintNote: "Profession-specific four-skill structure; grades are practice estimates only.",
  })),
  {
    slug: "pte-academic", name: "PTE Academic", shortName: "PTE", category: "english",
    description: "Integrated speaking, writing, reading and listening tasks with practice score analysis.",
    questionTypes: ["mcq", "sata", "ordered", "cloze", "writing", "speaking", "highlight"], scoring: { type: "scaled", min: 10, max: 90, label: "Overall score" }, features: feats(NON_CLINICAL_OFF.concat(["calculator"])), durationMinutes: 120, mockQuestionCount: 70,
    axes: ["section", "topic"], taxonomy: sections([["Speaking and Writing", 40, ["Read aloud", "Describe image", "Summarize written text", "Essay"]], ["Reading", 30, ["Reorder paragraphs", "Fill in the blanks", "Multiple choice"]], ["Listening", 30, ["Summarize spoken text", "Highlight incorrect words", "Write from dictation"]]]),
    blueprintNote: "Integrated-skills structure; scores are practice estimates only.",
  },
  {
    slug: "toefl-ibt", name: "TOEFL iBT", shortName: "TOEFL", category: "english",
    description: "Academic reading, listening, speaking and writing with section score estimates.",
    questionTypes: ["mcq", "sata", "ordered", "writing", "speaking"], scoring: { type: "scaled", min: 0, max: 120, sections: [{ name: "Reading", min: 0, max: 30 }, { name: "Listening", min: 0, max: 30 }, { name: "Speaking", min: 0, max: 30 }, { name: "Writing", min: 0, max: 30 }], totalFromSections: true, label: "Total score" },
    features: feats(NON_CLINICAL_OFF.concat(["calculator"])), durationMinutes: 120, mockQuestionCount: 60,
    axes: ["section", "topic"], taxonomy: sections([["Reading", 25, ["Academic passages"]], ["Listening", 25, ["Lectures", "Conversations"]], ["Speaking", 25, ["Independent", "Integrated"]], ["Writing", 25, ["Integrated", "Academic discussion"]]]),
    blueprintNote: "Four-section structure; validate against current ETS format.",
  },
  // COLLEGE & GRADUATE
  {
    slug: "mcat", name: "MCAT", shortName: "MCAT", category: "graduate",
    description: "Passage-based science sections and CARS with section scores (118–132) and total-score simulation (472–528).",
    questionTypes: ["mcq"], scoring: { type: "scaled", min: 472, max: 528, sections: [{ name: "Chemical and Physical Foundations", min: 118, max: 132 }, { name: "Critical Analysis and Reasoning Skills", min: 118, max: 132 }, { name: "Biological and Biochemical Foundations", min: 118, max: 132 }, { name: "Psychological, Social, and Biological Foundations", min: 118, max: 132 }], totalFromSections: true, label: "Total score" },
    features: feats(NON_CLINICAL_OFF), durationMinutes: 375, mockQuestionCount: 230,
    axes: ["section", "subject", "topic"], taxonomy: [...sections([["Chemical and Physical Foundations", 25], ["Critical Analysis and Reasoning Skills", 25], ["Biological and Biochemical Foundations", 25], ["Psychological, Social, and Biological Foundations", 25]]), ...["Biology", "Biochemistry", "General Chemistry", "Organic Chemistry", "Physics", "Psychology", "Sociology", "CARS"].map((n) => ({ kind: "subject" as const, name: n }))],
    blueprintNote: "Four sections per AAMC public description; validate against the current AAMC content outline.",
  },
  {
    slug: "sat", name: "SAT", shortName: "SAT", category: "college",
    description: "Reading and Writing plus Math with section-based practice and timed mock tests (400–1600 estimate).",
    questionTypes: ["mcq", "numeric"], scoring: { type: "scaled", min: 400, max: 1600, sections: [{ name: "Reading and Writing", min: 200, max: 800 }, { name: "Math", min: 200, max: 800 }], totalFromSections: true, label: "Total score" },
    features: feats(NON_CLINICAL_OFF), durationMinutes: 134, mockQuestionCount: 98,
    axes: ["section", "topic"], taxonomy: sections([["Reading and Writing", 50, ["Information and Ideas", "Craft and Structure", "Expression of Ideas", "Standard English Conventions"]], ["Math", 50, ["Algebra", "Advanced Math", "Problem-Solving and Data Analysis", "Geometry and Trigonometry"]]]),
    blueprintNote: "Digital SAT domains per College Board public description; validate annually.",
  },
  {
    slug: "act", name: "ACT", shortName: "ACT", category: "college",
    description: "English, Math, Reading and Science with composite score estimates (1–36).",
    questionTypes: ["mcq", "numeric"], scoring: { type: "scaled", min: 1, max: 36, sections: [{ name: "English", min: 1, max: 36 }, { name: "Math", min: 1, max: 36 }, { name: "Reading", min: 1, max: 36 }, { name: "Science", min: 1, max: 36 }], label: "Composite" },
    features: feats(NON_CLINICAL_OFF), durationMinutes: 125, mockQuestionCount: 171,
    axes: ["section", "topic"], taxonomy: sections([["English", 25], ["Math", 25], ["Reading", 25], ["Science", 25]]),
    blueprintNote: "Validate section structure against the current ACT format.",
  },
  {
    slug: "gre", name: "GRE General Test", shortName: "GRE", category: "graduate",
    description: "Verbal Reasoning, Quantitative Reasoning and Analytical Writing with 130–170 section estimates.",
    questionTypes: ["mcq", "sata", "numeric", "cloze", "writing"], scoring: { type: "scaled", min: 260, max: 340, sections: [{ name: "Verbal Reasoning", min: 130, max: 170 }, { name: "Quantitative Reasoning", min: 130, max: 170 }], totalFromSections: true, label: "V + Q" },
    features: feats(NON_CLINICAL_OFF), durationMinutes: 118, mockQuestionCount: 54,
    axes: ["section", "topic"], taxonomy: sections([["Verbal Reasoning", 40, ["Text completion", "Sentence equivalence", "Reading comprehension"]], ["Quantitative Reasoning", 40, ["Arithmetic", "Algebra", "Geometry", "Data analysis"]], ["Analytical Writing", 20, ["Analyze an Issue"]]]),
    blueprintNote: "Validate against current ETS GRE structure.",
  },
  {
    slug: "gmat", name: "GMAT Focus", shortName: "GMAT", category: "graduate",
    description: "Quantitative Reasoning, Verbal Reasoning and Data Insights with total-score estimates.",
    questionTypes: ["mcq", "numeric", "matrix"], scoring: { type: "scaled", min: 205, max: 805, label: "Total score" }, features: feats(NON_CLINICAL_OFF), durationMinutes: 135, mockQuestionCount: 64,
    axes: ["section", "topic"], taxonomy: sections([["Quantitative Reasoning", 33], ["Verbal Reasoning", 33], ["Data Insights", 34]]),
    blueprintNote: "Validate against current GMAC format.",
  },
  {
    slug: "ap-exams", name: "AP Examinations", shortName: "AP", category: "college",
    description: "Advanced Placement subject practice with 1–5 score estimates.",
    questionTypes: ["mcq", "writing"], scoring: { type: "scaled", min: 1, max: 5, step: 1, label: "AP score" }, features: feats(NON_CLINICAL_OFF), durationMinutes: 180, mockQuestionCount: 60,
    axes: ["subject", "topic"], taxonomy: ["AP Biology", "AP Chemistry", "AP Calculus AB", "AP Psychology", "AP English Language"].map((n) => ({ kind: "subject" as const, name: n })),
    blueprintNote: "Subject list is configurable; validate each course against current College Board CED.",
  },
  // PROFESSIONAL
  {
    slug: "cpa", name: "CPA Exam", shortName: "CPA", category: "professional",
    description: "Core and discipline sections with topic-wise MCQs, task-based simulations and practice exams (0–99 scale estimate).",
    questionTypes: ["mcq", "numeric", "matrix", "cloze"], scoring: { type: "scaled", min: 0, max: 99, passMark: 75, label: "Scaled score" }, features: feats(NON_CLINICAL_OFF), durationMinutes: 240, mockQuestionCount: 80,
    axes: ["section", "topic"], taxonomy: sections([["Auditing and Attestation (AUD)", 25], ["Financial Accounting and Reporting (FAR)", 25], ["Taxation and Regulation (REG)", 25], ["Discipline", 25]]),
    blueprintNote: "Validate against the current AICPA blueprint.",
  },
  ...(
    [
      ["cfa", "CFA Program", "CFA", ["Ethical and Professional Standards", "Quantitative Methods", "Economics", "Financial Statement Analysis", "Equity Investments", "Fixed Income", "Portfolio Management"], { type: "passfail", passPercent: 70 }],
      ["cma", "CMA", "CMA", ["Financial Planning, Performance, and Analytics", "Strategic Financial Management"], { type: "scaled", min: 0, max: 500, passMark: 360, label: "Scaled score" }],
      ["lsat", "LSAT", "LSAT", ["Logical Reasoning", "Reading Comprehension", "Argumentative Writing"], { type: "scaled", min: 120, max: 180, label: "Scaled score" }],
      ["mbe", "Multistate Bar Examination (MBE)", "MBE", ["Civil Procedure", "Constitutional Law", "Contracts", "Criminal Law and Procedure", "Evidence", "Real Property", "Torts"], { type: "scaled", min: 0, max: 200, passMark: 135, label: "Scaled score" }],
    ] as [string, string, string, string[], ScoringModel][]
  ).map(([slug, name, shortName, secs, scoring]) => ({
    slug, name, shortName, category: "professional",
    description: `${name} preparation with topic-wise questions, timed sets and practice exams.`,
    questionTypes: ["mcq", "numeric"] as QuestionType[], scoring,
    features: feats(NON_CLINICAL_OFF), durationMinutes: 240, mockQuestionCount: 100,
    axes: ["section", "topic"] as TaxonomyKind[], taxonomy: sections(secs.map((s) => [s])),
    blueprintNote: `Validate against the current ${shortName} official outline.`,
  })),
];

/* ------------------------------------------------------------------ */
/* Deep syllabi: replace the compact starter taxonomies above.         */
/* Published weights are dropped where they were not verified against  */
/* the official outline, so the UI never shows an unchecked "% of exam". */
/* ------------------------------------------------------------------ */
const DEEP_SYLLABUS: Record<string, SeedTaxonomy[]> = {
  ...MEDICAL_CORE_SYLLABUS,
  ...BOARDS_PA_MCAT_SYLLABUS,
  ...NURSING_PHARMACY_SYLLABUS,
};
/** Exams whose published category weights come from the official test plan and are kept. */
const KEEP_WEIGHTS = new Set(["nclex-pn"]);
for (const exam of EXAMS) {
  const deep = DEEP_SYLLABUS[exam.slug];
  if (!deep?.length) continue;
  const nodes = deep.map((n) => (KEEP_WEIGHTS.has(exam.slug) ? n : { ...n, weight: undefined }));
  // NCLEX-RN keeps its client-needs categories (with weights); the deep syllabus adds subjects and systems.
  exam.taxonomy = exam.slug === "nclex-rn" ? [...exam.taxonomy.filter((n) => n.kind === "category"), ...nodes] : nodes;
  exam.axes = Array.from(new Set(exam.taxonomy.map((n) => n.kind))).sort(
    (a, b) => (["category", "subject", "section", "system"].indexOf(a) + 1 || 9) - (["category", "subject", "section", "system"].indexOf(b) + 1 || 9),
  ) as TaxonomyKind[];
  if (!exam.axes.includes("topic")) exam.axes.push("topic");
}
