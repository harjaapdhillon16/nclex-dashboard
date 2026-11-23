import "server-only";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, exams, medicalImages, studyMaterials } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import type { ShellExam, ShellUser } from "@/components/app-shell";

export async function getShellData() {
  const user = await requireUser();

  const enrolledRows = await db
    .select({
      id: exams.id,
      slug: exams.slug,
      name: exams.name,
      shortName: exams.shortName,
      features: exams.features,
    })
    .from(enrollments)
    .innerJoin(exams, eq(exams.id, enrollments.examId))
    .where(and(eq(enrollments.userId, user.id), eq(exams.status, "published")))
    .orderBy(asc(exams.displayOrder));

  const toShell = (r: (typeof enrolledRows)[number]): ShellExam => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    shortName: r.shortName,
    hasCases: !!r.features?.caseStudies,
  });
  let enrolledExams: ShellExam[] = enrolledRows.map(toShell);
  if (enrolledExams.length === 0) {
    const defaults = await db
      .select({
        id: exams.id,
        slug: exams.slug,
        name: exams.name,
        shortName: exams.shortName,
        features: exams.features,
      })
      .from(exams)
      .where(eq(exams.status, "published"))
      .orderBy(asc(exams.displayOrder))
      .limit(4);
    enrolledExams = defaults.map(toShell);
  }

  // Which courses have cheat sheets / medical images (drives the study-tools links).
  const examIds = enrolledExams.map((e) => e.id);
  if (examIds.length) {
    const [sheets, images] = await Promise.all([
      db
        .select({ examId: studyMaterials.examId, n: sql<number>`count(*)::int` })
        .from(studyMaterials)
        .where(and(inArray(studyMaterials.examId, examIds), eq(studyMaterials.kind, "cheatsheet"), eq(studyMaterials.status, "published")))
        .groupBy(studyMaterials.examId),
      db
        .select({ examId: medicalImages.examId, n: sql<number>`count(*)::int` })
        .from(medicalImages)
        .where(and(inArray(medicalImages.examId, examIds), eq(medicalImages.status, "published")))
        .groupBy(medicalImages.examId),
    ]);
    const sheetSet = new Set(sheets.filter((r) => r.n > 0).map((r) => r.examId));
    const imageSet = new Set(images.filter((r) => r.n > 0).map((r) => r.examId));
    enrolledExams = enrolledExams.map((e) => ({ ...e, hasCheatSheets: sheetSet.has(e.id), hasImages: imageSet.has(e.id) }));
  }

  const shellUser: ShellUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    dailyGoal: user.dailyGoal,
    subscriptionStatus: user.subscriptionStatus,
  };

  return {
    user,
    shellUser,
    enrolledExams,
  };
}
