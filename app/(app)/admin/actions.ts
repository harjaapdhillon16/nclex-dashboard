"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  aiJobs,
  caseStudies,
  examCategories,
  exams,
  flashcards,
  questionReports,
  questionReviews,
  questions,
  questionVersions,
  studyMaterials,
  taxonomy,
  users,
  type QuestionStatus,
  type Role,
} from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { audit } from "@/lib/security";
import { generateQuestions } from "@/lib/ai";
import { importQuestions, TaxonomyResolver } from "@/lib/seed/importer";
import { FEATURE_KEYS, type FeatureKey } from "@/lib/seed/catalog";
import type { Difficulty, QuestionType, SeedQuestion } from "@/lib/questions/types";

export async function transitionQuestionWorkflowAction(formData: FormData) {
  const user = await requireUser(["admin", "reviewer", "instructor"]);
  const questionId = Number(formData.get("questionId"));
  const toStatus = String(formData.get("toStatus")) as QuestionStatus;
  const decision = String(formData.get("decision") || toStatus);
  const comments = String(formData.get("comments") ?? "").trim() || null;
  const clinicalValidation = formData.get("clinicalValidation") === "on" || formData.get("clinicalValidation") === "true";
  const editorialValidation = formData.get("editorialValidation") === "on" || formData.get("editorialValidation") === "true";

  const [q] = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
  if (!q) return;

  // Enforce separation of duties for non-admin reviewers publishing their own items
  if (toStatus === "published" && user.role === "reviewer" && q.createdBy === user.id) {
    throw new Error("Reviewers cannot publish items they authored themselves.");
  }

  await db
    .update(questions)
    .set({
      status: toStatus,
      reviewedBy: user.id,
      approvedAt: toStatus === "approved" || toStatus === "published" ? new Date() : q.approvedAt,
      updatedAt: new Date(),
    })
    .where(eq(questions.id, q.id));

  await db.insert(questionReviews).values({
    questionId: q.id,
    reviewerId: user.id,
    fromStatus: q.status,
    toStatus,
    decision,
    comments,
    clinicalValidation,
    editorialValidation,
  });

  await audit(user.id, `question.${decision}`, "question", q.id, { from: q.status, to: toStatus });
  revalidatePath("/admin");
  revalidatePath("/admin/questions");
}

export async function createQuestionAction(formData: FormData) {
  const user = await requireUser(["admin", "reviewer", "instructor"]);
  const examSlug = String(formData.get("examSlug") ?? "nclex-rn");
  const [exam] = await db.select().from(exams).where(eq(exams.slug, examSlug)).limit(1);
  if (!exam) return;

  const type = (String(formData.get("type") ?? "mcq") as QuestionType) || "mcq";
  const difficulty = (String(formData.get("difficulty") ?? "moderate") as Difficulty) || "moderate";
  const category = String(formData.get("category") ?? "").trim() || undefined;
  const subject = String(formData.get("subject") ?? "").trim() || undefined;
  const system = String(formData.get("system") ?? "").trim() || undefined;
  const topic = String(formData.get("topic") ?? "Clinical Judgment").trim() || "Clinical Judgment";
  const stem = String(formData.get("stem") ?? "").trim();
  const scenario = String(formData.get("scenario") ?? "").trim() || undefined;
  const rationale = String(formData.get("rationale") ?? "").trim();
  const strategy = String(formData.get("strategy") ?? "").trim();
  const keyTakeaway = String(formData.get("keyTakeaway") ?? "").trim();
  const priorityAction = String(formData.get("priorityAction") ?? "").trim();
  const safety = String(formData.get("safety") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  const references = String(formData.get("references") ?? "").trim() || undefined;

  if (!stem || !rationale) return;

  const optA = String(formData.get("optA") ?? "Option A").trim();
  const optB = String(formData.get("optB") ?? "Option B").trim();
  const optC = String(formData.get("optC") ?? "Option C").trim();
  const optD = String(formData.get("optD") ?? "Option D").trim();
  const expA = String(formData.get("expA") ?? "").trim();
  const expB = String(formData.get("expB") ?? "").trim();
  const expC = String(formData.get("expC") ?? "").trim();
  const expD = String(formData.get("expD") ?? "").trim();
  const correctKey = String(formData.get("correctKey") ?? "a").trim().toLowerCase();

  let item: SeedQuestion;
  if (type === "numeric") {
    const val = Number(formData.get("numericValue") ?? 0);
    const unit = String(formData.get("numericUnit") ?? "mL/hr").trim();
    item = {
      exam: exam.slug,
      category,
      subject,
      system,
      topic,
      type: "numeric",
      difficulty,
      stem,
      scenario,
      content: { unit, decimals: 1 },
      answer: { value: val, tolerance: 0.5 },
      rationale,
      extras: { whyCorrect: keyTakeaway, priorityAction, safety, education, strategy, keyTakeaway },
      references,
      tags: ["calculation"],
    };
  } else if (type === "sata" || type === "multiple_response") {
    const correctArr = correctKey.split(",").map((s) => s.trim()).filter(Boolean);
    item = {
      exam: exam.slug,
      category,
      subject,
      system,
      topic,
      type,
      difficulty,
      stem,
      scenario,
      content: {
        options: [
          { id: "a", text: optA },
          { id: "b", text: optB },
          { id: "c", text: optC },
          { id: "d", text: optD },
        ],
      },
      answer: { correct: correctArr.length ? correctArr : ["a", "b"] },
      rationale,
      optionExplanations: { a: expA, b: expB, c: expC, d: expD },
      extras: { whyCorrect: keyTakeaway, priorityAction, safety, education, strategy, keyTakeaway },
      references,
      tags: ["clinical_judgment"],
    };
  } else {
    item = {
      exam: exam.slug,
      category,
      subject,
      system,
      topic,
      type: "mcq",
      difficulty,
      stem,
      scenario,
      content: {
        options: [
          { id: "a", text: optA },
          { id: "b", text: optB },
          { id: "c", text: optC },
          { id: "d", text: optD },
        ],
      },
      answer: { correct: ["a", "b", "c", "d"].includes(correctKey) ? correctKey : "a" },
      rationale,
      optionExplanations: { a: expA, b: expB, c: expC, d: expD },
      extras: { whyCorrect: keyTakeaway, priorityAction, safety, education, strategy, keyTakeaway },
      references,
      tags: ["priority"],
    };
  }

  await importQuestions(exam, [item], {
    status: "draft",
    source: "manual",
    createdBy: user.id,
  });

  await audit(user.id, "question.create", "question", exam.slug, { topic, type });
  revalidatePath("/admin/questions");
  revalidatePath("/admin");
}

export async function duplicateQuestionAction(formData: FormData) {
  const user = await requireUser(["admin", "reviewer"]);
  const questionId = Number(formData.get("questionId"));
  const [q] = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
  if (!q) return;

  const newCode = `${q.code}-COPY-${Math.floor(100 + Math.random() * 900)}`;
  const [copy] = await db
    .insert(questions)
    .values({
      ...q,
      id: undefined,
      code: newCode,
      stem: `${q.stem} (Copy)`,
      status: "draft",
      source: "manual",
      contentHash: null,
      version: 1,
      createdBy: user.id,
      reviewedBy: null,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  await db.insert(questionVersions).values({
    questionId: copy.id,
    version: 1,
    snapshot: copy,
    editedBy: user.id,
    note: `Duplicated from ${q.code}`,
  });

  await audit(user.id, "question.duplicate", "question", copy.id, { from: q.code });
  revalidatePath("/admin/questions");
}

export async function deleteQuestionAction(formData: FormData) {
  const user = await requireUser(["admin"]);
  const questionId = Number(formData.get("questionId"));
  await db.delete(questions).where(eq(questions.id, questionId));
  await audit(user.id, "question.delete", "question", questionId);
  revalidatePath("/admin/questions");
}

export async function runAiGeneratorAction(formData: FormData) {
  const user = await requireUser(["admin", "reviewer"]);
  const examSlug = String(formData.get("examSlug") ?? "nclex-rn");
  const [exam] = await db.select().from(exams).where(eq(exams.slug, examSlug)).limit(1);
  if (!exam) return;

  const params = {
    examName: exam.name,
    examSlug: exam.slug,
    category: String(formData.get("category") ?? "").trim() || undefined,
    subject: String(formData.get("subject") ?? "").trim() || undefined,
    system: String(formData.get("system") ?? "").trim() || undefined,
    topic: String(formData.get("topic") ?? "Prioritization & Delegation").trim() || "Prioritization & Delegation",
    subtopic: String(formData.get("subtopic") ?? "").trim() || undefined,
    difficulty: (String(formData.get("difficulty") ?? "moderate") as Difficulty) || "moderate",
    type: (String(formData.get("type") ?? "mcq") as QuestionType) || "mcq",
    count: Math.max(1, Math.min(10, Number(formData.get("count") ?? 2) || 2)),
    patientAge: String(formData.get("patientAge") ?? "").trim() || undefined,
    setting: String(formData.get("setting") ?? "").trim() || undefined,
    includeLabs: formData.get("includeLabs") === "on",
    includeMeds: formData.get("includeMeds") === "on",
    clinicalJudgment: formData.get("clinicalJudgment") === "on",
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  };

  try {
    const generated = await generateQuestions(params);
    // CRITICAL REQUIREMENT: AI-generated content is ALWAYS saved as draft, never auto-published
    const imp = await importQuestions(exam, generated.items, {
      status: "draft",
      source: "ai",
      createdBy: user.id,
    });

    await db.insert(aiJobs).values({
      examId: exam.id,
      params,
      status: "completed",
      engine: generated.engine,
      createdCount: imp.created,
      duplicateCount: imp.duplicates,
      createdBy: user.id,
    });

    await audit(user.id, "ai.generate_questions", "exam", exam.slug, {
      engine: generated.engine,
      created: imp.created,
      duplicates: imp.duplicates,
    });
  } catch (e) {
    await db.insert(aiJobs).values({
      examId: exam.id,
      params,
      status: "failed",
      error: (e as Error).message,
      createdBy: user.id,
    });
  }

  revalidatePath("/admin/ai");
  revalidatePath("/admin/questions");
  revalidatePath("/admin");
}

export async function createOrUpdateExamCourseAction(formData: FormData) {
  const user = await requireUser(["admin"]);
  const mode = String(formData.get("actionMode") ?? "create");

  if (mode === "toggle_status") {
    const examId = Number(formData.get("examId"));
    const nextStatus = String(formData.get("status") ?? "published");
    await db
      .update(exams)
      .set({
        status: nextStatus,
        blueprint: {
          note: "Validated against current official examination outline.",
          version: "2026.2",
          validatedAt: new Date().toISOString().slice(0, 10),
        },
        updatedAt: new Date(),
      })
      .where(eq(exams.id, examId));
    await audit(user.id, "course.status_changed", "exam", examId, { status: nextStatus });
    revalidatePath("/admin/courses");
    revalidatePath("/dashboard");
    return;
  }

  if (mode === "add_taxonomy") {
    const examId = Number(formData.get("examId"));
    const kind = String(formData.get("kind") ?? "topic");
    const name = String(formData.get("name") ?? "").trim();
    const weight = formData.get("weight") ? Number(formData.get("weight")) : null;
    if (examId && name) {
      await db.insert(taxonomy).values({ examId, kind, name, weight });
      await audit(user.id, "course.add_taxonomy", "taxonomy", examId, { kind, name });
    }
    revalidatePath("/admin/courses");
    return;
  }

  if (mode === "add_material") {
    const examId = Number(formData.get("examId"));
    const kind = String(formData.get("kind") ?? "notes");
    const title = String(formData.get("title") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    if (examId && title) {
      await db.insert(studyMaterials).values({
        examId,
        kind,
        title,
        summary,
        body,
        status: "published",
        createdBy: user.id,
      });
    }
    revalidatePath("/admin/courses");
    return;
  }

  // Create new examination course
  const categoryId = Number(formData.get("categoryId"));
  const name = String(formData.get("name") ?? "").trim();
  const shortName = String(formData.get("shortName") ?? name).trim();
  const slug = String(formData.get("slug") ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
  const description = String(formData.get("description") ?? "").trim();
  const durationMinutes = Number(formData.get("durationMinutes") ?? 180) || 180;
  const mockQuestionCount = Number(formData.get("mockQuestionCount") ?? 100) || 100;

  if (!categoryId || !name || !slug) return;
  const features = Object.fromEntries(FEATURE_KEYS.map((k) => [k, true])) as Record<FeatureKey, boolean>;

  const [created] = await db
    .insert(exams)
    .values({
      categoryId,
      slug,
      name,
      shortName,
      description,
      status: "published",
      questionTypes: ["mcq", "sata", "numeric", "bowtie", "matrix", "cloze"],
      scoring: { type: "percent", passPercent: 70 },
      features,
      axes: ["section", "topic"],
      durationMinutes,
      mockQuestionCount,
      blueprint: {
        note: "Configured via Admin Exam Course Management.",
        version: "2026.1",
        validatedAt: new Date().toISOString().slice(0, 10),
      },
    })
    .onConflictDoNothing()
    .returning();

  if (created) {
    await audit(user.id, "course.create", "exam", created.slug);
  }
  revalidatePath("/admin/courses");
  revalidatePath("/dashboard");
}

export async function updateUserRoleOrStatusAction(formData: FormData) {
  const admin = await requireUser(["admin"]);
  const userId = String(formData.get("userId"));
  const role = String(formData.get("role") ?? "student") as Role;
  const status = String(formData.get("status") ?? "active");
  const subscriptionStatus = String(formData.get("subscriptionStatus") ?? "free");

  await db
    .update(users)
    .set({ role, status, subscriptionStatus })
    .where(eq(users.id, userId));

  await audit(admin.id, "user.update_access", "user", userId, { role, status, subscriptionStatus });
  revalidatePath("/admin");
}

export async function resolveQuestionReportAction(formData: FormData) {
  const staff = await requireUser(["admin", "reviewer"]);
  const reportId = Number(formData.get("reportId"));
  await db.update(questionReports).set({ status: "resolved" }).where(eq(questionReports.id, reportId));
  await audit(staff.id, "report.resolve", "question_report", reportId);
  revalidatePath("/admin");
}
