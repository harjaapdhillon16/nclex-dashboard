/**
 * Shared import pipeline used by the seeder, the admin CSV/JSON/XLSX importer and the AI generator.
 * Resolves taxonomy names to ids (creating topics on demand), validates structure,
 * detects duplicates by content hash and writes questions with a version snapshot.
 */
import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { exams, questions, questionVersions, taxonomy, caseStudies } from "@/lib/db/schema";
import type { QuestionStatus } from "@/lib/db/schema";
import { QUESTION_TYPES, DIFFICULTIES, type SeedQuestion, type SeedCaseStudy, type McqAnswer, type SataAnswer, type OrderedAnswer, type MatrixAnswer, type BowtieAnswer, type ClozeAnswer, type HighlightAnswer, type TrendAnswer, type NumericAnswer, type MatrixContent, type BowtieContent, type ClozeContent, type HighlightContent, type OrderedContent, type McqContent, NCJMM_STEPS } from "@/lib/questions/types";

type Exam = typeof exams.$inferSelect;

export function contentHash(q: Pick<SeedQuestion, "stem" | "content" | "scenario">) {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const opts = JSON.stringify(q.content).toLowerCase().replace(/"id":"[^"]*"/g, "");
  return createHash("sha256").update(norm(q.stem) + "|" + norm(q.scenario ?? "") + "|" + norm(opts)).digest("hex");
}

/** Validate a question's structure. Returns a list of human-readable problems (empty = valid). */
export function validateQuestion(q: Partial<SeedQuestion>): string[] {
  const errs: string[] = [];
  if (!q.stem?.trim()) errs.push("Missing question text");
  if (!q.topic?.trim()) errs.push("Missing topic");
  if (!q.type || !QUESTION_TYPES.includes(q.type)) errs.push(`Invalid question type "${q.type ?? ""}"`);
  if (q.difficulty && !DIFFICULTIES.includes(q.difficulty)) errs.push(`Invalid difficulty "${q.difficulty}"`);
  if (!q.answer && q.type !== "writing" && q.type !== "speaking") errs.push("Missing answer");
  if (errs.length) return errs;
  const c = q.content as never;
  const a = q.answer as never;
  const ids = (arr?: { id: string }[]) => new Set((arr ?? []).map((o) => o.id));
  try {
    switch (q.type) {
      case "mcq": {
        const o = ids((c as McqContent).options);
        if (o.size < 2) errs.push("Incorrect option count (need ≥ 2)");
        if (!o.has((a as McqAnswer).correct)) errs.push("Correct answer is not one of the options");
        break;
      }
      case "sata":
      case "multiple_response": {
        const o = ids((c as McqContent).options);
        const k = (a as SataAnswer).correct ?? [];
        if (o.size < 3) errs.push("Incorrect option count (need ≥ 3)");
        if (!k.length) errs.push("Missing answer");
        if (k.some((x) => !o.has(x))) errs.push("Answer key references unknown option");
        break;
      }
      case "trend": {
        const o = ids((c as McqContent).options);
        const k = (a as TrendAnswer).correct;
        const arr = Array.isArray(k) ? k : [k];
        if (arr.some((x) => !o.has(x))) errs.push("Answer key references unknown option");
        break;
      }
      case "ordered": {
        const o = ids((c as OrderedContent).items);
        const k = (a as OrderedAnswer).order ?? [];
        if (k.length !== o.size || k.some((x) => !o.has(x))) errs.push("Order key must list every item exactly once");
        break;
      }
      case "matrix": {
        const m = c as MatrixContent;
        const cols = ids(m.columns);
        for (const r of m.rows ?? []) {
          const v = (a as MatrixAnswer).map?.[r.id];
          if (v == null) errs.push(`Matrix row ${r.id} has no key`);
          else if ([v].flat().some((x) => !cols.has(x))) errs.push(`Matrix row ${r.id} key not a column`);
        }
        break;
      }
      case "bowtie": {
        const b = c as BowtieContent;
        const k = a as BowtieAnswer;
        if (!ids(b.conditions).has(k.condition)) errs.push("Bow-tie condition key invalid");
        if (k.actions?.some((x) => !ids(b.actions).has(x))) errs.push("Bow-tie action key invalid");
        if (k.parameters?.some((x) => !ids(b.parameters).has(x))) errs.push("Bow-tie parameter key invalid");
        break;
      }
      case "highlight": {
        const segs = new Set((c as HighlightContent).segments?.filter((s) => s.selectable).map((s) => s.id));
        if ((a as HighlightAnswer).correct?.some((x) => !segs.has(x))) errs.push("Highlight key references non-selectable segment");
        break;
      }
      case "cloze": {
        const cz = c as ClozeContent;
        for (const [k, opts] of Object.entries(cz.blanks ?? {})) {
          if (!cz.template.includes(`{{${k}}}`)) errs.push(`Blank ${k} missing from template`);
          if (!ids(opts).has((a as ClozeAnswer).blanks?.[k])) errs.push(`Blank ${k} key invalid`);
        }
        break;
      }
      case "numeric":
        if (typeof (a as NumericAnswer).value !== "number") errs.push("Numeric answer must be a number");
        break;
    }
  } catch {
    errs.push("Formatting error in content/answer structure");
  }
  return errs;
}

export class TaxonomyResolver {
  private cache = new Map<string, number>();
  constructor(private exam: Exam) {}

  private async find(kind: string, name: string, parentId: number | null, create: boolean) {
    const key = `${kind}|${name.toLowerCase()}|${parentId ?? ""}`;
    if (this.cache.has(key)) return this.cache.get(key)!;
    const conds = [eq(taxonomy.examId, this.exam.id), eq(taxonomy.kind, kind), sql`lower(${taxonomy.name}) = ${name.toLowerCase()}`];
    if (parentId != null) conds.push(eq(taxonomy.parentId, parentId));
    let [row] = await db.select({ id: taxonomy.id }).from(taxonomy).where(and(...conds)).limit(1);
    if (!row && parentId != null && kind === "topic") {
      // fall back: topic with same name anywhere in this exam
      [row] = await db.select({ id: taxonomy.id }).from(taxonomy).where(and(eq(taxonomy.examId, this.exam.id), eq(taxonomy.kind, kind), sql`lower(${taxonomy.name}) = ${name.toLowerCase()}`)).limit(1);
    }
    if (!row && create) {
      [row] = await db.insert(taxonomy).values({ examId: this.exam.id, kind, name, parentId }).returning({ id: taxonomy.id });
    }
    if (row) this.cache.set(key, row.id);
    return row?.id ?? null;
  }

  async resolve(q: { category?: string; subject?: string; system?: string; topic?: string; subtopic?: string }) {
    const axes = this.exam.axes;
    const catKind = axes.includes("category") ? "category" : "section";
    let categoryId = q.category ? await this.find(catKind, q.category, null, false) : null;
    let subjectName = q.subject;
    if (q.category && !categoryId) {
      // a subject name supplied as category (e.g. "Maternal and Newborn") — treat it as the subject
      const asSubject = await this.find("subject", q.category, null, false);
      if (asSubject && !subjectName) subjectName = q.category;
      else if (!asSubject) categoryId = await this.find(catKind, q.category, null, true);
    }
    const subjectId = subjectName ? await this.find("subject", subjectName, null, true) : null;
    const systemId = q.system ? await this.find("system", q.system, null, true) : null;
    const topicParent = categoryId ?? subjectId ?? systemId;
    const topicId = q.topic ? await this.find("topic", q.topic, topicParent, true) : null;
    const subtopicId = q.subtopic && topicId ? await this.find("subtopic", q.subtopic, topicId, true) : null;
    return { categoryId, subjectId, systemId, topicId, subtopicId };
  }
}

async function nextCode(exam: Exam) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(questions).where(eq(questions.examId, exam.id));
  const prefix = exam.shortName.toUpperCase().replace(/[^A-Z0-9]+/g, "");
  return (offset: number) => `${prefix}-${String(n + offset + 1).padStart(5, "0")}`;
}

export type ImportOutcome = { created: number; duplicates: number; invalid: { index: number; errors: string[] }[]; ids: number[] };

export async function importQuestions(
  exam: Exam,
  items: (SeedQuestion & { caseStudyId?: number; caseStep?: number; ncjmmStep?: string })[],
  opts: { status: QuestionStatus; source: "seed" | "import" | "ai" | "manual"; createdBy?: string | null; skipDuplicates?: boolean },
): Promise<ImportOutcome> {
  const resolver = new TaxonomyResolver(exam);
  const code = await nextCode(exam);
  const out: ImportOutcome = { created: 0, duplicates: 0, invalid: [], ids: [] };
  let offset = 0;
  for (const [index, q] of items.entries()) {
    const errors = validateQuestion(q);
    if (errors.length) {
      out.invalid.push({ index, errors });
      continue;
    }
    const hash = contentHash(q);
    if (opts.skipDuplicates !== false) {
      const [dup] = await db.select({ id: questions.id }).from(questions).where(and(eq(questions.examId, exam.id), eq(questions.contentHash, hash))).limit(1);
      if (dup) {
        out.duplicates++;
        continue;
      }
    }
    const tax = await resolver.resolve(q);
    const values = {
      code: code(offset++),
      examId: exam.id,
      ...tax,
      caseStudyId: q.caseStudyId ?? null,
      caseStep: q.caseStep ?? null,
      ncjmmStep: q.ncjmmStep ?? null,
      type: q.type,
      difficulty: q.difficulty ?? "moderate",
      stem: q.stem,
      scenario: q.scenario ?? null,
      patient: q.patient ?? null,
      exhibit: q.exhibit ?? null,
      content: q.content,
      answer: q.answer,
      rationale: q.rationale ?? "",
      optionExplanations: q.optionExplanations ?? null,
      extras: q.extras ?? null,
      clinicalConcept: q.clinicalConcept ?? null,
      clinicalSetting: q.clinicalSetting ?? null,
      tags: q.tags ?? [],
      references: q.references ?? null,
      status: opts.status,
      source: opts.source,
      contentHash: hash,
      createdBy: opts.createdBy ?? null,
      approvedAt: opts.status === "published" ? new Date() : null,
    };
    const [row] = await db.insert(questions).values(values).returning({ id: questions.id });
    await db.insert(questionVersions).values({ questionId: row.id, version: 1, snapshot: values, editedBy: opts.createdBy ?? null, note: `Created via ${opts.source}` });
    out.created++;
    out.ids.push(row.id);
  }
  return out;
}

export async function importCaseStudy(exam: Exam, cs: SeedCaseStudy, opts: { status: QuestionStatus; source: "seed" | "import" | "ai" | "manual"; createdBy?: string | null }) {
  const [existing] = await db.select({ id: caseStudies.id }).from(caseStudies).where(and(eq(caseStudies.examId, exam.id), eq(caseStudies.title, cs.title))).limit(1);
  if (existing) return { id: existing.id, created: false };
  if (cs.questions.length < 1 || cs.questions.length > 6) throw new Error(`Invalid case-study structure: ${cs.title} must have 1–6 questions`);
  const resolver = new TaxonomyResolver(exam);
  const tax = await resolver.resolve(cs);
  const [row] = await db.insert(caseStudies).values({
    examId: exam.id, title: cs.title, summary: cs.summary, categoryId: tax.categoryId, subjectId: tax.subjectId, systemId: tax.systemId, topicId: tax.topicId,
    difficulty: cs.difficulty, patient: cs.patient, sections: cs.sections, status: opts.status, createdBy: opts.createdBy ?? null,
  }).returning({ id: caseStudies.id });
  const qs = cs.questions.map((q, i) => ({
    ...q, exam: cs.exam, topic: q.topic ?? cs.topic, category: q.category ?? cs.category, subject: q.subject ?? cs.subject, system: q.system ?? cs.system,
    caseStudyId: row.id, caseStep: i + 1, ncjmmStep: q.step ?? NCJMM_STEPS[i], tags: [...new Set([...(q.tags ?? []), "case_study", "clinical_judgment"])],
  }));
  const res = await importQuestions(exam, qs, { ...opts, skipDuplicates: false });
  if (res.invalid.length) console.warn(`case ${cs.title}: invalid`, JSON.stringify(res.invalid));
  return { id: row.id, created: true, questions: res.created };
}
