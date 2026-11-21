"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  bookmarks,
  enrollments,
  exams,
  flashcardProgress,
  notes,
  notifications,
  questionReports,
  users,
  type TestKind,
} from "@/lib/db/schema";
import { hashPassword, requireUser, verifyPassword } from "@/lib/auth";
import { createTest, type TestConfig } from "@/lib/tests";
import { audit } from "@/lib/security";

export async function enrollExamAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "").trim();
  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) redirect("/dashboard");

  await db
    .insert(enrollments)
    .values({
      userId: user.id,
      examId: exam.id,
      targetDate: user.targetExamDate,
      dailyGoal: user.dailyGoal,
      lastActiveAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [enrollments.userId, enrollments.examId],
      set: { status: "active", lastActiveAt: new Date() },
    });

  revalidatePath("/dashboard");
  redirect(redirectTo || `/exam/${exam.slug}`);
}

export async function startCustomTestAction(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("examSlug") ?? "nclex-rn");
  const [exam] = await db.select().from(exams).where(eq(exams.slug, slug)).limit(1);
  if (!exam) redirect("/dashboard");

  const kind = (String(formData.get("kind") ?? "custom") as TestKind) || "custom";
  const mode = (String(formData.get("mode") ?? "tutor") as "tutor" | "timed" | "exam") || "tutor";
  const pool = (String(formData.get("pool") ?? "all") as TestConfig["pool"]) || "all";
  const count = Math.max(1, Math.min(250, Number(formData.get("count") ?? 25) || 25));
  const timeLimitRaw = formData.get("timeLimitMin");
  const timeLimitMin = timeLimitRaw && String(timeLimitRaw).trim() !== "" ? Number(timeLimitRaw) : null;

  const parseNums = (key: string) =>
    formData
      .getAll(key)
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n) && n > 0);
  const parseStrs = (key: string) =>
    formData
      .getAll(key)
      .map((v) => String(v).trim())
      .filter(Boolean);

  const cfg: TestConfig = {
    categoryIds: parseNums("categoryIds"),
    subjectIds: parseNums("subjectIds"),
    systemIds: parseNums("systemIds"),
    topicIds: parseNums("topicIds"),
    difficulties: parseStrs("difficulties"),
    types: parseStrs("types"),
    tags: parseStrs("tags"),
    count,
    mode,
    pool,
    includeCases: formData.get("includeCases") === "on" || formData.get("includeCases") === "true",
    randomizeOptions: formData.get("randomizeOptions") !== "false",
    timeLimitMin,
    adaptive: formData.get("adaptive") === "on" || formData.get("adaptive") === "true",
    caseStudyId: formData.get("caseStudyId") ? Number(formData.get("caseStudyId")) : undefined,
  };

  const customName = String(formData.get("name") ?? "").trim() || undefined;
  let created = await createTest(user.id, exam, kind, cfg, customName);
  // Fallback to "all" pool if a filtered pool (e.g. incorrect/marked/unused) has 0 matching items yet
  if (!created && cfg.pool && cfg.pool !== "all") {
    created = await createTest(user.id, exam, kind, { ...cfg, pool: "all", categoryIds: [], subjectIds: [], systemIds: [], topicIds: [], difficulties: [], types: [], tags: [] }, customName);
  }
  if (!created) {
    redirect(`/exam/${exam.slug}/create?empty=1`);
  }
  redirect(`/test/${created.id}`);
}

export async function gradeFlashcardAction(formData: FormData) {
  const user = await requireUser();
  const flashcardId = Number(formData.get("flashcardId"));
  const rating = String(formData.get("rating") ?? "good");
  const slug = String(formData.get("examSlug") ?? "nclex-rn");
  if (!flashcardId) return;

  const [existing] = await db
    .select()
    .from(flashcardProgress)
    .where(and(eq(flashcardProgress.userId, user.id), eq(flashcardProgress.flashcardId, flashcardId)))
    .limit(1);

  const currentBox = existing?.box ?? 0;
  const nextBox =
    rating === "again" ? 0 : rating === "easy" ? Math.min(4, currentBox + 2) : Math.min(4, currentBox + 1);

  const intervalsHours = [0.2, 24, 72, 168, 336];
  const dueAt = new Date(Date.now() + (intervalsHours[nextBox] ?? 24) * 3600 * 1000);

  await db
    .insert(flashcardProgress)
    .values({ userId: user.id, flashcardId, box: nextBox, dueAt, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [flashcardProgress.userId, flashcardProgress.flashcardId],
      set: { box: nextBox, dueAt, updatedAt: new Date() },
    });

  revalidatePath(`/exam/${slug}/flashcards`);
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? user.name).trim() || user.name;
  const studyLevel = String(formData.get("studyLevel") ?? "").trim() || null;
  const targetExamDate = String(formData.get("targetExamDate") ?? "").trim() || null;
  const dailyGoal = Math.max(5, Math.min(300, Number(formData.get("dailyGoal") ?? user.dailyGoal) || 50));
  const preferredSubjects = formData
    .getAll("preferredSubjects")
    .map((s) => String(s).trim())
    .filter(Boolean);

  await db
    .update(users)
    .set({
      name,
      studyLevel,
      targetExamDate,
      dailyGoal,
      preferredSubjects,
    })
    .where(eq(users.id, user.id));

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  if (currentPassword && newPassword.length >= 8) {
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (ok) {
      const passwordHash = await hashPassword(newPassword);
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
      await audit(user.id, "profile.password_changed", "user", user.id);
    }
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser();
  const id = formData.get("id");
  if (id === "all") {
    await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.userId, user.id));
  } else if (id) {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.id, Number(id)), eq(notifications.userId, user.id)));
  }
  revalidatePath("/notifications");
}
