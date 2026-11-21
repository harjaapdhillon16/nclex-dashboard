import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { finishTest, saveAnswer } from "@/lib/tests";
import type { QuestionResponse } from "@/lib/questions/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const testId = Number(id);
  if (!Number.isFinite(testId)) {
    return NextResponse.json({ error: "Invalid test id" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as {
      questionId: number;
      response?: QuestionResponse | null;
      timeSpentSec?: number;
      marked?: boolean;
      submit?: boolean;
      currentIndex?: number;
      elapsedSec?: number;
    };
    const out = await saveAnswer(user.id, testId, Number(body.questionId), {
      response: body.response,
      timeSpentSec: body.timeSpentSec,
      marked: body.marked,
      submit: body.submit,
      currentIndex: body.currentIndex,
      elapsedSec: body.elapsedSec,
    });
    if (out.finished) {
      await finishTest(user.id, testId, body.elapsedSec);
    }
    return NextResponse.json(out);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const testId = Number(id);
  if (!Number.isFinite(testId)) {
    return NextResponse.json({ error: "Invalid test id" }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { elapsedSec?: number };
    await finishTest(user.id, testId, body.elapsedSec);
    return NextResponse.json({ ok: true, testId });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
