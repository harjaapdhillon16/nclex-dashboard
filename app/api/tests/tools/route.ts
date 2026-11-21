import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookmarks, notes, questionReports } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as
      | { action: "bookmark"; questionId: number }
      | { action: "note"; questionId: number; body: string }
      | { action: "report"; questionId: number; reason: string; body?: string };

    const questionId = Number(body.questionId);
    if (!Number.isFinite(questionId)) {
      return NextResponse.json({ error: "Invalid question id" }, { status: 400 });
    }

    if (body.action === "bookmark") {
      const [exists] = await db
        .select()
        .from(bookmarks)
        .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.questionId, questionId)))
        .limit(1);
      if (exists) {
        await db
          .delete(bookmarks)
          .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.questionId, questionId)));
        return NextResponse.json({ bookmarked: false });
      } else {
        await db.insert(bookmarks).values({ userId: user.id, questionId }).onConflictDoNothing();
        return NextResponse.json({ bookmarked: true });
      }
    }

    if (body.action === "note") {
      const text = String(body.body ?? "").trim();
      if (!text) {
        await db
          .delete(notes)
          .where(and(eq(notes.userId, user.id), eq(notes.questionId, questionId)));
        return NextResponse.json({ note: "" });
      }
      await db
        .insert(notes)
        .values({ userId: user.id, questionId, body: text, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: [notes.userId, notes.questionId],
          set: { body: text, updatedAt: new Date() },
        });
      return NextResponse.json({ note: text });
    }

    if (body.action === "report") {
      await db.insert(questionReports).values({
        userId: user.id,
        questionId,
        reason: String(body.reason || "Content issue"),
        body: body.body ? String(body.body).slice(0, 2000) : null,
      });
      return NextResponse.json({ reported: true });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
