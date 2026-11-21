/**
 * Question engine type definitions shared by the DB layer, the renderers,
 * the grader, the importer and the seed content.
 *
 * Every question stores a `content` object (what the student sees) and an
 * `answer` object (the key — never sent to the browser before grading in exam mode).
 */

export const QUESTION_TYPES = [
  "mcq", // single best answer (also: priority, delegation, image, ECG, lab-based, passage-based, chart/exhibit)
  "sata", // select all that apply (classic, all-or-nothing)
  "multiple_response", // NGN extended multiple response (+/- scoring)
  "ordered", // ordered response / drag-and-drop ordering
  "matrix", // matrix / grid (single choice per row) or multiple-response matrix (content.multi)
  "bowtie", // NGN bow-tie
  "highlight", // highlight text / highlight table
  "cloze", // drop-down cloze / drop-down rationale / drop-down table
  "trend", // trend item — exhibit over time + mcq/sata style options
  "numeric", // calculation / dosage / quantitative numeric entry
  "writing", // essay / letter / analytical writing — rubric or AI feedback
  "speaking", // speaking prompt — transcript/recording, rubric or AI feedback
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Single best answer",
  sata: "Select all that apply",
  multiple_response: "Extended multiple response",
  ordered: "Ordered response",
  matrix: "Matrix / grid",
  bowtie: "Bow-tie",
  highlight: "Highlight text",
  cloze: "Drop-down cloze",
  trend: "Trend",
  numeric: "Calculation / numeric entry",
  writing: "Writing task",
  speaking: "Speaking task",
};

export const DIFFICULTIES = ["easy", "moderate", "difficult", "advanced", "challenge"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  difficult: "Difficult",
  advanced: "Advanced",
  challenge: "Challenge",
};

/** NCSBN Clinical Judgment Measurement Model steps, used for NGN case studies. */
export const NCJMM_STEPS = [
  "recognize_cues",
  "analyze_cues",
  "prioritize_hypotheses",
  "generate_solutions",
  "take_action",
  "evaluate_outcomes",
] as const;
export type NcjmmStep = (typeof NCJMM_STEPS)[number];
export const NCJMM_LABELS: Record<NcjmmStep, string> = {
  recognize_cues: "Recognize cues",
  analyze_cues: "Analyze cues",
  prioritize_hypotheses: "Prioritize hypotheses",
  generate_solutions: "Generate solutions",
  take_action: "Take action",
  evaluate_outcomes: "Evaluate outcomes",
};

export type Option = { id: string; text: string };

/* ---------- content shapes (student-visible) ---------- */
export type McqContent = { options: Option[] };
export type SataContent = { options: Option[] };
export type OrderedContent = { items: Option[] };
export type MatrixContent = { rows: Option[]; columns: Option[]; multi?: boolean };
export type BowtieContent = {
  conditionLabel?: string; // default "Condition most likely experiencing"
  actionsLabel?: string; // default "Actions to take" (pick 2)
  parametersLabel?: string; // default "Parameters to monitor" (pick 2)
  conditions: Option[];
  actions: Option[];
  parameters: Option[];
};
/** Highlight: a passage split into segments; only segments with selectable:true can be highlighted. */
export type HighlightContent = { segments: { id: string; text: string; selectable?: boolean }[] };
/** Cloze: template contains {{blankId}} tokens; each blank has its own option list. */
export type ClozeContent = { template: string; blanks: Record<string, Option[]> };
export type TrendContent = { options: Option[]; multi?: boolean };
export type NumericContent = { unit?: string; decimals?: number };
export type WritingContent = { prompt: string; minWords?: number; maxWords?: number; taskLabel?: string; rubric?: string[] };
export type SpeakingContent = { prompt: string; prepSeconds?: number; speakSeconds?: number; cueCard?: string[]; rubric?: string[] };

export type QuestionContent =
  | McqContent
  | SataContent
  | OrderedContent
  | MatrixContent
  | BowtieContent
  | HighlightContent
  | ClozeContent
  | TrendContent
  | NumericContent
  | WritingContent
  | SpeakingContent;

/* ---------- answer key shapes (server only) ---------- */
export type McqAnswer = { correct: string };
export type SataAnswer = { correct: string[] };
export type OrderedAnswer = { order: string[] };
export type MatrixAnswer = { map: Record<string, string | string[]> };
export type BowtieAnswer = { condition: string; actions: string[]; parameters: string[] };
export type HighlightAnswer = { correct: string[] };
export type ClozeAnswer = { blanks: Record<string, string> };
export type TrendAnswer = { correct: string | string[] };
export type NumericAnswer = { value: number; tolerance?: number };
export type WritingAnswer = { sample?: string };
export type SpeakingAnswer = { sample?: string };

export type QuestionAnswer =
  | McqAnswer
  | SataAnswer
  | OrderedAnswer
  | MatrixAnswer
  | BowtieAnswer
  | HighlightAnswer
  | ClozeAnswer
  | TrendAnswer
  | NumericAnswer
  | WritingAnswer
  | SpeakingAnswer;

/* ---------- student response shapes ---------- */
export type QuestionResponse =
  | { kind: "single"; value: string }
  | { kind: "multi"; values: string[] }
  | { kind: "order"; order: string[] }
  | { kind: "matrix"; map: Record<string, string | string[]> }
  | { kind: "bowtie"; condition?: string; actions: string[]; parameters: string[] }
  | { kind: "cloze"; blanks: Record<string, string> }
  | { kind: "numeric"; value: string }
  | { kind: "text"; text: string };

/* ---------- clinical / scenario data ---------- */
export type LabValue = { name: string; value: string; unit?: string; range?: string; flag?: "H" | "L" | "C" };
export type PatientInfo = {
  age?: string;
  gender?: string;
  history?: string;
  allergies?: string;
  vitals?: Record<string, string>;
  labs?: LabValue[];
  meds?: string[];
};

/** Exhibit shown beside the stem: reading passage, data table, trend table, ECG strip description, image. */
export type Exhibit = {
  kind: "passage" | "table" | "trend" | "ecg" | "image" | "audio";
  title?: string;
  text?: string;
  columns?: string[];
  rows?: string[][];
  url?: string;
  alt?: string;
};

/** Rich teaching content shown after submission. All optional. */
export type QuestionExtras = {
  whyCorrect?: string;
  priorityAction?: string;
  safety?: string;
  assessmentFindings?: string;
  expectedOutcomes?: string;
  interventions?: string;
  education?: string;
  labs?: string;
  medications?: string;
  diseaseProcess?: string;
  strategy?: string; // test-taking tip
  keyTakeaway?: string;
  relatedTopics?: string[];
  priorityConcept?: string;
};

/**
 * Seed / import format. Taxonomy fields are names (not ids); the seeder resolves
 * or creates them under the exam.
 */
export type SeedQuestion = {
  exam: string; // exam slug, e.g. "nclex-rn"
  subject?: string; // e.g. "Adult Health" / "Chemical & Physical Foundations"
  category?: string; // e.g. "Management of Care" (NCLEX client-needs category) or exam section
  system?: string; // body system, e.g. "Cardiovascular"
  topic: string;
  subtopic?: string;
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  scenario?: string;
  patient?: PatientInfo;
  exhibit?: Exhibit;
  content: QuestionContent;
  answer: QuestionAnswer;
  rationale: string;
  optionExplanations?: Record<string, string>;
  extras?: QuestionExtras;
  clinicalConcept?: string;
  clinicalSetting?: string;
  tags?: string[]; // e.g. ["priority","delegation","pharmacology","calculation","safety","education"]
  references?: string;
};

export type CaseSection = {
  /** question step (1-based) at which this tab becomes visible; 1 = visible from the start */
  revealAt: number;
  tab: "Nurses' Notes" | "History and Physical" | "Vital Signs" | "Laboratory Results" | "Orders" | "Medications" | "Progress Notes" | "Diagnostics";
  title?: string;
  time?: string;
  text?: string;
  table?: { columns: string[]; rows: string[][] };
};

export type SeedCaseStudy = {
  exam: string;
  title: string;
  subject?: string;
  category?: string;
  system?: string;
  topic: string;
  difficulty: Difficulty;
  summary: string; // patient introduction / chief complaint
  patient: PatientInfo & { name?: string; setting?: string; chiefComplaint?: string; socialHistory?: string; surgicalHistory?: string; familyHistory?: string };
  sections: CaseSection[];
  /** exactly 6 questions, one per NCJMM step in order */
  questions: (Omit<SeedQuestion, "exam" | "topic"> & { step: NcjmmStep; topic?: string })[];
};
