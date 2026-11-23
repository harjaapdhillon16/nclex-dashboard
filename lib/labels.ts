/** Friendly names and one-line hints for NCLEX subjects, so they match how students talk about them. */
export const SUBJECT_DISPLAY: Record<string, { label: string; hint: string }> = {
  "Adult Health": { label: "Medical-Surgical", hint: "Cardiac, respiratory, renal, GI, neuro, endocrine" },
  Fundamentals: { label: "Fundamentals of Nursing", hint: "Nursing process, skills, safety, comfort" },
  Pharmacology: { label: "Pharmacology", hint: "Drug classes, side effects, calculations, teaching" },
  "Maternal and Newborn": { label: "Maternity & Newborn", hint: "Pregnancy, labor, postpartum, newborn care" },
  Pediatrics: { label: "Pediatrics", hint: "Growth, child illness, pediatric dosing" },
  "Mental Health": { label: "Mental Health", hint: "Disorders, communication, crisis, psychiatric drugs" },
  "Leadership and Management": { label: "Leadership & Management", hint: "Delegation, prioritization, ethics, quality" },
};

export const subjectLabel = (name: string) => SUBJECT_DISPLAY[name]?.label ?? name;
export const subjectHint = (name: string) => SUBJECT_DISPLAY[name]?.hint ?? "";

/** Question-focus tags students can filter by, in the order shown. */
export const FOCUS_TAGS: { tag: string; label: string }[] = [
  { tag: "priority", label: "Priority" },
  { tag: "delegation", label: "Delegation" },
  { tag: "pharmacology", label: "Pharmacology" },
  { tag: "calculation", label: "Calculations" },
  { tag: "safety", label: "Safety" },
  { tag: "education", label: "Patient teaching" },
  { tag: "clinical_judgment", label: "Clinical judgment" },
  { tag: "communication", label: "Communication" },
  { tag: "legal", label: "Legal & ethics" },
  { tag: "assessment", label: "Assessment" },
  { tag: "intervention", label: "Interventions" },
  { tag: "evaluation", label: "Evaluation" },
];
