/* Run with: npm run db:seed   (idempotent — safe to re-run) */
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { examCategories, exams, taxonomy, users, plans, enrollments, studyMaterials, flashcards, medicalImages, labValues, settings } from "@/lib/db/schema";
import { EXAM_CATEGORIES, EXAMS } from "./catalog";
import { importQuestions, importCaseStudy, TaxonomyResolver } from "./importer";
import type { SeedQuestion, SeedCaseStudy } from "@/lib/questions/types";

async function optional<T>(path: string, name: string): Promise<T | undefined> {
  try {
    const mod = await import(path);
    return mod[name] as T;
  } catch (e) {
    console.warn(`  (skipping ${path}: ${(e as Error).message.split("\n")[0]})`);
    return undefined;
  }
}

/** Starter content for the thinner courses: [file, export-name suffix]. Missing files are skipped. */
const STARTER_FILES: [string, string][] = [
  ["nursing-pa", "NURSING_PA"],
  ["medical", "MEDICAL"],
  ["dental-pharmacy", "DENTAL_PHARMACY"],
  ["english", "ENGLISH"],
  ["academic-professional", "ACADEMIC"],
];

async function main() {
  console.log("Seeding categories & exams…");
  for (const [i, c] of EXAM_CATEGORIES.entries()) {
    await db.insert(examCategories).values({ slug: c.slug, name: c.name, description: c.description, icon: c.icon, displayOrder: i }).onConflictDoNothing();
  }
  const cats = Object.fromEntries((await db.select().from(examCategories)).map((c) => [c.slug, c.id]));

  for (const [i, e] of EXAMS.entries()) {
    const [row] = await db.insert(exams).values({
      categoryId: cats[e.category], slug: e.slug, name: e.name, shortName: e.shortName, description: e.description,
      status: e.status ?? "published", questionTypes: e.questionTypes, scoring: e.scoring, features: e.features, axes: e.axes,
      durationMinutes: e.durationMinutes, mockQuestionCount: e.mockQuestionCount, blueprint: { note: e.blueprintNote, version: "2026.1" }, displayOrder: i,
    }).onConflictDoNothing().returning();
    if (!row) {
      // Already seeded: never overwrite admin edits, but additively backfill any subjects/systems/topics
      // that the catalogue now defines and the exam does not have yet.
      const [existing] = await db.select().from(exams).where(eq(exams.slug, e.slug)).limit(1);
      if (!existing) continue;
      const have = await db.select().from(taxonomy).where(eq(taxonomy.examId, existing.id));
      const key = (kind: string, name: string) => `${kind}|${name.toLowerCase()}`;
      const haveKeys = new Set(have.map((t) => key(t.kind, t.name)));
      let order = have.length;
      for (const node of e.taxonomy) {
        let parentId = have.find((t) => key(t.kind, t.name) === key(node.kind, node.name))?.id;
        if (!parentId) {
          [{ id: parentId }] = await db.insert(taxonomy).values({ examId: existing.id, kind: node.kind, name: node.name, weight: node.weight ?? null, displayOrder: order++ }).returning({ id: taxonomy.id });
          haveKeys.add(key(node.kind, node.name));
        }
        // One batched insert per node (a round trip per topic is far too slow on a remote database).
        const fresh = (node.children ?? []).filter((child) => !haveKeys.has(key("topic", child)));
        for (let i = 0; i < fresh.length; i += 400) {
          const chunk = fresh.slice(i, i + 400);
          await db.insert(taxonomy).values(chunk.map((name) => ({ examId: existing.id, kind: "topic", name, parentId, displayOrder: order++ })));
          for (const name of chunk) haveKeys.add(key("topic", name));
        }
      }
      continue;
    }
    for (const [j, node] of e.taxonomy.entries()) {
      const [parent] = await db.insert(taxonomy).values({ examId: row.id, kind: node.kind, name: node.name, weight: node.weight ?? null, displayOrder: j }).returning();
      if (node.children?.length) {
        await db.insert(taxonomy).values(node.children.map((name, k) => ({ examId: row.id, kind: "topic", name, parentId: parent.id, displayOrder: k })));
      }
    }
  }
  const examBySlug = Object.fromEntries((await db.select().from(exams)).map((e) => [e.slug, e]));

  console.log("Seeding questions…");
  const sources: [string, string][] = [
    ["./content/nclex-a", "NCLEX_A"],
    ["./content/nclex-b", "NCLEX_B"],
    ["./content/clinical-exams", "CLINICAL_EXAMS"],
    ["./content/academic-exams", "ACADEMIC_EXAMS"],
    ...STARTER_FILES.map(([file, suffix]) => [`./content/starter/${file}`, `STARTER_QUESTIONS_${suffix}`] as [string, string]),
  ];
  for (const [path, name] of sources) {
    const items = await optional<SeedQuestion[]>(path, name);
    if (!items) continue;
    const byExam = new Map<string, SeedQuestion[]>();
    for (const q of items) byExam.set(q.exam, [...(byExam.get(q.exam) ?? []), q]);
    for (const [slug, qs] of byExam) {
      const exam = examBySlug[slug];
      if (!exam) { console.warn(`  unknown exam ${slug}`); continue; }
      const r = await importQuestions(exam, qs, { status: "published", source: "seed" });
      console.log(`  ${slug}: +${r.created} (dupes ${r.duplicates}, invalid ${r.invalid.length})`);
      if (r.invalid.length) console.log("   ", JSON.stringify(r.invalid.slice(0, 5)));
    }
  }

  const cases = [
    ...((await optional<SeedCaseStudy[]>("./content/nclex-cases", "NCLEX_CASES")) ?? []),
    ...((await optional<SeedCaseStudy[]>("./content/nclex-cases-2", "NCLEX_CASES_2")) ?? []),
    ...((await optional<SeedCaseStudy[]>("./content/nclex-cases-3", "NCLEX_CASES_3")) ?? []),
  ];
  for (const cs of cases ?? []) {
    const r = await importCaseStudy(examBySlug[cs.exam], cs, { status: "published", source: "seed" });
    if (r.created) console.log(`  case: ${cs.title} (+${r.questions})`);
  }

  console.log("Seeding study materials…");
  type M = { exam: string; topic: string; category?: string; kind: string; title: string; summary: string; body: string; durationMinutes?: number; videoUrl?: string };
  type F = { exam: string; topic: string; category?: string; front: string; back: string };
  type L = { group: string; name: string; range: string; unit: string; note?: string };
  const mats = [...((await optional<M[]>("./content/materials", "MATERIALS")) ?? [])];
  const cards = [...((await optional<F[]>("./content/materials", "FLASHCARDS")) ?? [])];
  for (const [file, suffix] of STARTER_FILES) {
    mats.push(...((await optional<M[]>(`./content/starter/${file}`, `STARTER_MATERIALS_${suffix}`)) ?? []));
    cards.push(...((await optional<F[]>(`./content/starter/${file}`, `STARTER_FLASHCARDS_${suffix}`)) ?? []));
  }
  // Cheat sheets are stored as study materials of kind "cheatsheet".
  type CS = { exam: string; category: string; topic: string; title: string; summary: string; body: string; readMinutes: number };
  for (const c of (await optional<CS[]>("./content/cheatsheets", "CHEATSHEETS")) ?? []) {
    mats.push({ exam: c.exam, category: c.category, topic: c.topic, kind: "cheatsheet", title: c.title, summary: c.summary, body: c.body, durationMinutes: c.readMinutes });
  }
  const labs = await optional<L[]>("./content/materials", "LAB_VALUES");
  const resolvers = new Map<string, TaxonomyResolver>();
  const res = (slug: string) => {
    if (!resolvers.has(slug)) resolvers.set(slug, new TaxonomyResolver(examBySlug[slug]));
    return resolvers.get(slug)!;
  };
  for (const m of mats ?? []) {
    const exam = examBySlug[m.exam];
    if (!exam) continue;
    const [exists] = await db.select({ id: studyMaterials.id }).from(studyMaterials).where(and(eq(studyMaterials.examId, exam.id), eq(studyMaterials.title, m.title))).limit(1);
    if (exists) continue;
    const { topicId } = await res(m.exam).resolve({ category: m.category, topic: m.topic });
    await db.insert(studyMaterials).values({ examId: exam.id, topicId, kind: m.kind, title: m.title, summary: m.summary, body: m.body, url: m.videoUrl, durationMinutes: m.durationMinutes });
  }
  for (const f of cards ?? []) {
    const exam = examBySlug[f.exam];
    if (!exam) continue;
    const [exists] = await db.select({ id: flashcards.id }).from(flashcards).where(and(eq(flashcards.examId, exam.id), eq(flashcards.front, f.front))).limit(1);
    if (exists) continue;
    const { topicId } = await res(f.exam).resolve({ category: f.category, topic: f.topic });
    await db.insert(flashcards).values({ examId: exam.id, topicId, front: f.front, back: f.back });
  }
  if (labs?.length) {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(labValues);
    if (n === 0) await db.insert(labValues).values(labs.map((l) => ({ grp: l.group, name: l.name, range: l.range, unit: l.unit, note: l.note })));
  }

  console.log("Seeding medical images…");
  type MI = { key: string; exam: string; category: string; title: string; summary: string; body: string; tags: string[] };
  const { FIGURE_BY_KEY } = await import("@/lib/medical-figures/registry");
  const figs = (await optional<MI[]>("./content/medical-images", "MEDICAL_IMAGES")) ?? [];
  for (const [i, m] of figs.entries()) {
    const exam = examBySlug[m.exam];
    const def = FIGURE_BY_KEY[m.key];
    if (!exam || !def) { console.warn(`  skipped image ${m.key}`); continue; }
    await db.insert(medicalImages).values({
      examId: exam.id, figureKey: m.key, category: m.category, title: m.title, summary: m.summary, body: m.body, altText: def.alt,
      credit: "Original illustration generated by QREXq", tags: m.tags, displayOrder: i,
    }).onConflictDoNothing();
  }

  console.log("Seeding plans…");
  const nclex = examBySlug["nclex-rn"];
  const ielts = examBySlug["ielts-academic"];
  const planRows = [
    { slug: "free", name: "Free", kind: "free", description: "Try every course with daily question limits.", priceCents: 0, limits: { questionsPerDay: 25, mockExams: false, caseStudies: true, analytics: true, ai: false, downloads: false }, displayOrder: 0 },
    { slug: "single-course", name: "Single Course", kind: "single", description: "Full access to one examination course.", priceCents: 3900, limits: { mockExams: true, caseStudies: true, analytics: true, ai: true, downloads: true }, displayOrder: 1 },
    { slug: "nclex-ielts-bundle", name: "Nurse Abroad Bundle", kind: "bundle", description: "NCLEX-RN + IELTS Academic.", priceCents: 5900, examIds: [nclex?.id, ielts?.id].filter(Boolean) as number[], limits: { mockExams: true, caseStudies: true, analytics: true, ai: true, downloads: true }, displayOrder: 2 },
    { slug: "all-access", name: "All-Access Premium", kind: "all_access", description: "Every course on the platform.", priceCents: 9900, limits: { mockExams: true, caseStudies: true, analytics: true, ai: true, downloads: true }, displayOrder: 3 },
    { slug: "institution", name: "Institution", kind: "institution", description: "Seat-based licensing with instructor dashboards.", priceCents: 0, limits: { seats: 50, mockExams: true, caseStudies: true, analytics: true, ai: true, downloads: true }, displayOrder: 4 },
  ];
  for (const p of planRows) await db.insert(plans).values(p).onConflictDoNothing();
  await db.insert(settings).values({ key: "payments", value: { enabled: false, provider: null } }).onConflictDoNothing();

  console.log("Seeding test accounts…");
  const pw = process.env.SEED_PASSWORD;
  if (!pw) throw new Error("Set SEED_PASSWORD in .env.local");
  const hash = await bcrypt.hash(pw, 12);
  const accounts = [
    { email: "admin@qrexq.test", name: "Platform Admin", role: "admin" as const },
    { email: "reviewer@qrexq.test", name: "Clinical Reviewer", role: "reviewer" as const },
    { email: "student@qrexq.test", name: "Demo Student", role: "student" as const },
  ];
  for (const a of accounts) {
    await db.insert(users).values({ ...a, passwordHash: hash, emailVerifiedAt: new Date() }).onConflictDoNothing();
  }
  const [student] = await db.select().from(users).where(eq(users.email, "student@qrexq.test"));
  for (const e of [nclex, ielts]) if (e) await db.insert(enrollments).values({ userId: student.id, examId: e.id }).onConflictDoNothing();

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
