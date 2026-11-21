import type { QuestionType } from "@/lib/questions/types";

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
  // MEDICAL
  ...(
    [
      ["usmle-step-1", "USMLE Step 1", "Step 1", ["Anatomy", "Biochemistry", "Microbiology", "Pathology", "Pharmacology", "Physiology", "Behavioral Science", "Immunology"], 480, 280],
      ["usmle-step-2-ck", "USMLE Step 2 CK", "Step 2 CK", ["Internal Medicine", "Surgery", "Pediatrics", "Obstetrics and Gynecology", "Psychiatry", "Neurology", "Emergency Medicine", "Preventive Medicine"], 540, 318],
      ["usmle-step-3", "USMLE Step 3", "Step 3", ["Foundations of Independent Practice", "Advanced Clinical Medicine", "Biostatistics and Epidemiology", "Patient Safety"], 900, 413],
      ["comlex-level-1", "COMLEX-USA Level 1", "COMLEX L1", ["Osteopathic Principles and Practice", "Foundational Biomedical Sciences", "Health Promotion", "Patient Presentations"], 480, 352],
      ["comlex-level-2", "COMLEX-USA Level 2-CE", "COMLEX L2", ["Osteopathic Principles and Practice", "Clinical Medicine", "Surgery", "Women's Health", "Pediatrics"], 480, 352],
      ["ukmla", "UKMLA Applied Knowledge Test", "UKMLA AKT", ["Acute and Emergency", "Cancer", "Cardiovascular", "Medicine of Older Adults", "Mental Health", "Child Health", "Clinical Pharmacology"], 360, 200],
      ["plab", "PLAB 1", "PLAB 1", ["Acute Medicine", "Surgery", "General Practice", "Obstetrics and Gynaecology", "Paediatrics", "Ethics and Law"], 180, 180],
      ["abim", "ABIM Internal Medicine Certification", "ABIM", ["Cardiovascular Disease", "Endocrinology", "Gastroenterology", "Infectious Disease", "Nephrology", "Pulmonary and Critical Care", "Hematology and Oncology", "Rheumatology"], 600, 240],
      ["abfm", "ABFM Family Medicine Certification", "ABFM", ["Acute Care", "Chronic Care", "Emergent and Urgent Care", "Preventive Care", "Foundations of Care"], 480, 300],
    ] as [string, string, string, string[], number, number][]
  ).map(([slug, name, shortName, secs, duration, mock]) => ({
    slug, name, shortName, category: "medical",
    description: `${name} preparation with clinical vignettes, single-best-answer items, image- and lab-based questions, timed blocks and subject analytics.`,
    questionTypes: ["mcq", "trend"] as QuestionType[],
    scoring: (slug.startsWith("usmle") || slug.startsWith("comlex") || slug.startsWith("ab") ? { type: "percent", passPercent: 65 } : { type: "passfail", passPercent: 63 }) as ScoringModel,
    features: feats(["caseStudies", "adaptive"]), durationMinutes: duration, mockQuestionCount: mock,
    axes: ["subject", "system", "topic"] as TaxonomyKind[],
    taxonomy: [...secs.map((n) => ({ kind: "subject" as const, name: n })), ...NCLEX_SYSTEMS],
    blueprintNote: `Subjects reflect the publicly described ${name} content outline at a high level; validate against the current official outline.`,
  })),
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
