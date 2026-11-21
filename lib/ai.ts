import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { QUESTION_TYPE_LABELS, type QuestionType, type SeedQuestion, type Difficulty } from "@/lib/questions/types";
import { ieltsBand } from "@/lib/scoring";

const MODEL = "claude-opus-5-5";
export const aiEnabled = () => !!process.env.ANTHROPIC_API_KEY;
const client = () => new Anthropic();

/** Extract the final text from a response, guarding refusals. */
function textOf(res: Anthropic.Beta.BetaMessage): string {
  if (res.stop_reason === "refusal") throw new Error("The model declined this request.");
  return res.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("");
}

async function structured<T>(system: string, user: string, schema: Record<string, unknown>, effort: "low" | "medium" | "high" = "medium"): Promise<T> {
  const stream = client().beta.messages.stream({
    model: MODEL,
    max_tokens: 64000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    output_config: { effort, format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: user }],
  });
  const res = await stream.finalMessage();
  return JSON.parse(textOf(res)) as T;
}

/* ------------------------------------------------------------------ */
/* Question generation                                                 */
/* ------------------------------------------------------------------ */
export type GenParams = {
  examName: string;
  examSlug: string;
  category?: string;
  subject?: string;
  system?: string;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  type: QuestionType;
  count: number;
  patientAge?: string;
  setting?: string;
  includeLabs?: boolean;
  includeMeds?: boolean;
  clinicalJudgment?: boolean;
  notes?: string;
};

const SHAPES: Partial<Record<QuestionType, string>> = {
  mcq: `content {"options":[{"id":"a","text":"..."},…4-5]} answer {"correct":"b"}`,
  sata: `content {"options":[…5-6 options]} answer {"correct":["a","c","e"]} (2-4 correct)`,
  multiple_response: `content {"options":[…6-8]} answer {"correct":[…]}`,
  ordered: `content {"items":[{"id":"a","text":"…"},…4-5]} answer {"order":["c","a","d","b"]}`,
  matrix: `content {"rows":[{"id":"r1","text":"…"}],"columns":[{"id":"c1","text":"…"}]} answer {"map":{"r1":"c2",…}}`,
  bowtie: `content {"conditions":[…4],"actions":[…5],"parameters":[…5]} answer {"condition":"a","actions":["b","d"],"parameters":["a","e"]}`,
  highlight: `content {"segments":[{"id":"s1","text":"…","selectable":true},{"id":"s2","text":" and ","selectable":false},…]} answer {"correct":["s1",…]}`,
  cloze: `content {"template":"The client is at risk for {{b1}} as evidenced by {{b2}}.","blanks":{"b1":[{"id":"b1a","text":"…"}],"b2":[…]}} answer {"blanks":{"b1":"b1c","b2":"b2a"}}`,
  trend: `content {"options":[…]} answer {"correct":"a"} plus exhibitJson {"kind":"trend","columns":["0800","1200"],"rows":[["HR","88","112"]]}`,
  numeric: `content {"unit":"mL/hr","decimals":1} answer {"value":125,"tolerance":0.5}`,
  writing: `content {"prompt":"…","minWords":250,"taskLabel":"Task 2","rubric":["…"]} answer {"sample":"model answer"}`,
  speaking: `content {"prompt":"…","prepSeconds":60,"speakSeconds":120,"cueCard":["…"]} answer {"sample":"model answer"}`,
};

const GEN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["stem", "scenario", "contentJson", "answerJson", "exhibitJson", "rationale", "optionExplanationsJson", "whyCorrect", "priorityAction", "safety", "education", "strategy", "keyTakeaway", "clinicalConcept", "tags", "suggestedReferences"],
        properties: {
          stem: { type: "string" },
          scenario: { type: "string" },
          contentJson: { type: "string", description: "JSON string for the content object" },
          answerJson: { type: "string", description: "JSON string for the answer key object" },
          exhibitJson: { type: "string", description: "JSON string for an exhibit object, or empty string" },
          rationale: { type: "string" },
          optionExplanationsJson: { type: "string", description: "JSON object mapping each option id to why it is right/wrong, or {}" },
          whyCorrect: { type: "string" },
          priorityAction: { type: "string" },
          safety: { type: "string" },
          education: { type: "string" },
          strategy: { type: "string" },
          keyTakeaway: { type: "string" },
          clinicalConcept: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          suggestedReferences: { type: "string" },
        },
      },
    },
  },
};

type GenOut = { questions: { stem: string; scenario: string; contentJson: string; answerJson: string; exhibitJson: string; rationale: string; optionExplanationsJson: string; whyCorrect: string; priorityAction: string; safety: string; education: string; strategy: string; keyTakeaway: string; clinicalConcept: string; tags: string[]; suggestedReferences: string }[] };

export async function generateQuestions(p: GenParams): Promise<{ engine: string; items: SeedQuestion[] }> {
  if (!aiEnabled()) return { engine: "template", items: templateQuestions(p) };
  const system = `You are an expert item writer and subject-matter educator creating ORIGINAL ${p.examName}-style practice questions for an independent exam-prep platform.
Rules: write entirely original items (never reproduce items from UWorld, Kaplan, Archer, ATI, Bootcamp, official sample items or any copyrighted bank); be accurate and consistent with current evidence-based guidelines; one defensible key; plausible distractors; no unsafe instructions. Every item will be reviewed by a qualified expert before publication.`;
  const user = `Create ${p.count} ${QUESTION_TYPE_LABELS[p.type]} question(s) for ${p.examName}.
Topic: ${p.topic}${p.subtopic ? ` › ${p.subtopic}` : ""}${p.category ? `\nCategory/section: ${p.category}` : ""}${p.subject ? `\nSubject: ${p.subject}` : ""}${p.system ? `\nBody system: ${p.system}` : ""}
Difficulty: ${p.difficulty}${p.patientAge ? `\nPatient age: ${p.patientAge}` : ""}${p.setting ? `\nClinical setting: ${p.setting}` : ""}
${p.includeLabs ? "Include relevant laboratory values in the scenario.\n" : ""}${p.includeMeds ? "Include medication information.\n" : ""}${p.clinicalJudgment ? "Emphasise clinical judgment (recognize/analyze cues, prioritize, act, evaluate).\n" : ""}${p.notes ? `Author notes: ${p.notes}\n` : ""}
Use this exact JSON shape for contentJson/answerJson: ${SHAPES[p.type] ?? SHAPES.mcq}
Option ids must match between content and answer. Return empty strings for fields that do not apply.`;
  const out = await structured<GenOut>(system, user, GEN_SCHEMA, "high");
  const items: SeedQuestion[] = out.questions.map((q) => {
    const parse = (s: string) => (s && s.trim() ? JSON.parse(s) : undefined);
    return {
      exam: p.examSlug, category: p.category, subject: p.subject, system: p.system, topic: p.topic, subtopic: p.subtopic,
      type: p.type, difficulty: p.difficulty, stem: q.stem, scenario: q.scenario || undefined,
      content: parse(q.contentJson), answer: parse(q.answerJson), exhibit: parse(q.exhibitJson),
      rationale: q.rationale, optionExplanations: parse(q.optionExplanationsJson),
      extras: { whyCorrect: q.whyCorrect, priorityAction: q.priorityAction, safety: q.safety, education: q.education, strategy: q.strategy, keyTakeaway: q.keyTakeaway },
      clinicalConcept: q.clinicalConcept, clinicalSetting: p.setting, tags: q.tags, references: q.suggestedReferences,
    };
  });
  return { engine: MODEL, items };
}

/** Offline fallback: produces clearly-marked skeleton drafts so the review workflow can be exercised without an API key. */
function templateQuestions(p: GenParams): SeedQuestion[] {
  return Array.from({ length: p.count }, (_, i): SeedQuestion => {
    const base = {
      exam: p.examSlug, category: p.category, subject: p.subject, system: p.system, topic: p.topic, subtopic: p.subtopic, difficulty: p.difficulty,
      stem: `[TEMPLATE DRAFT ${i + 1}] ${p.topic}: write an original ${QUESTION_TYPE_LABELS[p.type].toLowerCase()} item here.`,
      rationale: "Template draft generated without an AI provider. A subject expert must author the stem, options, key and rationale before review.",
      extras: { keyTakeaway: "Replace with expert-authored content.", strategy: "" },
      tags: ["template"],
    };
    const opts = ["a", "b", "c", "d"].map((id) => ({ id, text: `Option ${id.toUpperCase()}` }));
    switch (p.type) {
      case "sata":
      case "multiple_response":
        return { ...base, type: p.type, content: { options: [...opts, { id: "e", text: "Option E" }] }, answer: { correct: ["a", "c"] } };
      case "numeric":
        return { ...base, type: p.type, content: { unit: "mL/hr" }, answer: { value: 0, tolerance: 0 } };
      case "writing":
        return { ...base, type: p.type, content: { prompt: `Write about ${p.topic}.`, minWords: 250 }, answer: { sample: "" } };
      case "speaking":
        return { ...base, type: p.type, content: { prompt: `Talk about ${p.topic}.`, prepSeconds: 60, speakSeconds: 120 }, answer: { sample: "" } };
      default:
        return { ...base, type: "mcq" as const, content: { options: opts }, answer: { correct: "a" } };
    }
  });
}

/* ------------------------------------------------------------------ */
/* Writing / speaking feedback (IELTS, OET, PTE, TOEFL, GRE AWA)       */
/* ------------------------------------------------------------------ */
export type ProductiveFeedback = {
  engine: string;
  criteria: { name: string; score: number; max: number; comment: string }[];
  overall: string; // e.g. "Band 6.5" / "B (380)" / "4.0 / 6"
  normalized: number; // 0..1
  strengths: string[];
  improvements: string[];
  wordCount: number;
};

const FB_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["criteria", "overall", "normalized", "strengths", "improvements"],
  properties: {
    criteria: { type: "array", items: { type: "object", additionalProperties: false, required: ["name", "score", "max", "comment"], properties: { name: { type: "string" }, score: { type: "number" }, max: { type: "number" }, comment: { type: "string" } } } },
    overall: { type: "string" },
    normalized: { type: "number", description: "overall performance 0..1" },
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
  },
};

export async function evaluateProductive(args: { examName: string; scoringType: string; kind: "writing" | "speaking"; prompt: string; rubric?: string[]; response: string; minWords?: number }): Promise<ProductiveFeedback> {
  const wordCount = args.response.trim().split(/\s+/).filter(Boolean).length;
  if (!aiEnabled()) return heuristicFeedback(args, wordCount);
  const system = `You are an experienced ${args.examName} ${args.kind} examiner-trainer giving formative practice feedback. Be specific, constructive and honest. You are producing a PRACTICE ESTIMATE, not an official score.`;
  const scale = args.scoringType === "band" ? "Score each criterion on the 0-9 band scale (0.5 steps); overall as 'Band X.X'." : args.scoringType === "grade" ? "Score each criterion 0-6 (OET-style); overall as a grade A/B/C+/C/D/E with a 0-500 equivalent." : "Score each criterion 0-6; overall as 'X.X / 6'.";
  const user = `Task prompt:\n${args.prompt}\n\nRubric criteria: ${(args.rubric?.length ? args.rubric : ["Task achievement", "Coherence and cohesion", "Vocabulary", "Grammar"]).join(", ")}\n${scale}\n${args.kind === "speaking" ? "The response is a transcript of the candidate's spoken answer; ignore punctuation and judge fluency, vocabulary, grammar and pronunciation cues from the text." : ""}\n\nCandidate response (${wordCount} words${args.minWords ? `, minimum ${args.minWords}` : ""}):\n"""${args.response}"""`;
  const out = await structured<Omit<ProductiveFeedback, "engine" | "wordCount">>(system, user, FB_SCHEMA, "medium");
  return { ...out, normalized: Math.max(0, Math.min(1, out.normalized)), engine: MODEL, wordCount };
}

function heuristicFeedback(args: { scoringType: string; minWords?: number; response: string; rubric?: string[] }, wordCount: number): ProductiveFeedback {
  const text = args.response;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const lexical = words.length ? new Set(words).size / words.length : 0;
  const linkers = (text.match(/\b(however|therefore|moreover|furthermore|in addition|consequently|whereas|although|for example|in conclusion|on the other hand)\b/gi) ?? []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lengthOk = args.minWords ? Math.min(1, wordCount / args.minWords) : Math.min(1, wordCount / 150);
  const avgLen = wordCount / sentences;
  const scores = [
    { name: "Task response / length", v: lengthOk, comment: args.minWords && wordCount < args.minWords ? `Under the ${args.minWords}-word minimum (${wordCount}).` : "Length meets the requirement." },
    { name: "Coherence and cohesion", v: Math.min(1, 0.4 + linkers * 0.08 + Math.min(paragraphs, 4) * 0.08), comment: `${linkers} linking expressions, ${paragraphs} paragraph(s).` },
    { name: "Lexical resource", v: Math.min(1, lexical * 1.6), comment: `Type/token ratio ${(lexical * 100).toFixed(0)}%.` },
    { name: "Grammatical range", v: Math.min(1, avgLen >= 12 && avgLen <= 25 ? 0.75 : 0.55), comment: `Average sentence length ${avgLen.toFixed(1)} words.` },
  ];
  const normalized = scores.reduce((a, s) => a + s.v, 0) / scores.length;
  const band = ieltsBand(normalized);
  return {
    engine: "heuristic",
    criteria: scores.map((s) => ({ name: s.name, score: args.scoringType === "band" ? ieltsBand(s.v) : Math.round(s.v * 60) / 10, max: args.scoringType === "band" ? 9 : 6, comment: s.comment })),
    overall: args.scoringType === "band" ? `Band ${band.toFixed(1)}` : `${(normalized * 6).toFixed(1)} / 6`,
    normalized,
    strengths: [lexical > 0.5 ? "Varied vocabulary" : "Clear basic vocabulary", linkers > 2 ? "Good use of linking words" : "Readable structure"],
    improvements: ["Automated surface-level feedback only — configure ANTHROPIC_API_KEY for examiner-style AI feedback.", linkers < 3 ? "Use more cohesive devices to connect ideas." : "Develop each main idea with a specific example."],
    wordCount,
  };
}

/* ------------------------------------------------------------------ */
/* AI study assistant                                                  */
/* ------------------------------------------------------------------ */
export async function studyAssistant(examName: string, history: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  if (!aiEnabled()) return "The AI study assistant isn't configured yet. An administrator can enable it by setting ANTHROPIC_API_KEY on the server.";
  const res = await client().beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "low" },
    system: `You are a concise, encouraging study tutor for ${examName} preparation on the QREXq platform. Explain concepts clearly, use the platform's terminology, give memory aids and test-taking strategy. For clinical topics, teach for exam preparation only and remind learners to follow local protocols in practice. Never claim to know actual exam questions. Keep answers under 250 words unless asked for more.`,
    messages: history.slice(-12),
  });
  return textOf(res);
}
