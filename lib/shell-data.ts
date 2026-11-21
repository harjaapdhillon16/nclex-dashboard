import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, exams } from "@/lib/db/schema";
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
