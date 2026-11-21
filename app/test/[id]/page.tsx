import { notFound } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { labValues } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { loadRunner } from "@/lib/tests";
import { TestRunnerClient } from "./test-runner";

export default async function TestRunnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const testId = Number(id);
  if (!Number.isFinite(testId)) notFound();

  const data = await loadRunner(testId, user.id);
  if (!data) notFound();

  const labs = await db.select().from(labValues).orderBy(asc(labValues.grp), asc(labValues.name));

  return (
    <TestRunnerClient
      initialTest={{
        id: data.test.id,
        name: data.test.name,
        kind: data.test.kind,
        mode: data.test.mode as "tutor" | "timed" | "exam",
        status: data.test.status,
        timeLimitSec: data.test.timeLimitSec,
        elapsedSec: data.test.elapsedSec,
        currentIndex: data.test.currentIndex,
        adaptive: Boolean((data.test.config as { adaptive?: boolean })?.adaptive),
      }}
      exam={{
        id: data.exam.id,
        slug: data.exam.slug,
        name: data.exam.name,
        shortName: data.exam.shortName,
        features: data.exam.features,
      }}
      initialItems={data.items}
      initialCases={data.cases}
      labs={labs}
    />
  );
}
