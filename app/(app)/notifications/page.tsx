import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Bell, Calendar, CheckCheck, Flame, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { notifications, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { markNotificationReadAction } from "../actions";

export default async function NotificationsPage() {
  const user = await requireUser();

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const inProgressTests = await db
    .select()
    .from(tests)
    .where(eq(tests.userId, user.id))
    .orderBy(desc(tests.startedAt))
    .limit(5);

  const incomplete = inProgressTests.filter((t) => t.status === "in_progress");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications &amp; Study Reminders</h1>
          <p className="text-xs sm:text-sm muted">
            Daily practice reminders, streak alerts, incomplete test sessions, weak-topic recommendations, and content updates.
          </p>
        </div>

        {rows.some((r) => !r.readAt) && (
          <form action={markNotificationReadAction}>
            <input type="hidden" name="id" value="all" />
            <button type="submit" className="btn btn-secondary btn-sm">
              <CheckCheck className="h-3.5 w-3.5" />
              Mark All Read
            </button>
          </form>
        )}
      </div>

      {/* Live Automated Smart Reminders */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <Flame className="h-4 w-4 text-amber-500" />
            Daily Practice Goal Reminder
          </div>
          <p className="text-xs muted">
            Your daily goal is set to <strong>{user.dailyGoal} questions/day</strong>. Complete a quick 25-question Tutor set to maintain your study streak.
          </p>
          <Link href="/exam/nclex-rn/create" className="text-xs font-semibold text-accent hover:underline inline-block">
            Start Today&apos;s Practice →
          </Link>
        </div>

        <div className="panel p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <Calendar className="h-4 w-4" />
            Incomplete Tests ({incomplete.length})
          </div>
          <p className="text-xs muted">
            {incomplete.length > 0
              ? `You have ${incomplete.length} paused test session(s) ready to resume with saved progress.`
              : "All started tests have been completed and scored."}
          </p>
          {incomplete[0] && (
            <Link href={`/test/${incomplete[0].id}`} className="text-xs font-semibold text-accent hover:underline inline-block">
              Resume {incomplete[0].name} →
            </Link>
          )}
        </div>

        <div className="panel p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <Sparkles className="h-4 w-4" />
            New NGN Case Studies Available
          </div>
          <p className="text-xs muted">
            8 unfolding 6-step NGN clinical judgment cases (Sepsis, DKA, Preeclampsia, PE, Stroke, Heart Failure) are ready in your bank.
          </p>
          <Link href="/exam/nclex-rn/cases" className="text-xs font-semibold text-accent hover:underline inline-block">
            Explore Case Studies →
          </Link>
        </div>
      </section>

      {/* Stored Notifications Feed */}
      <section className="panel panel-pad space-y-3">
        <h2 className="h-section flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent" />
          Account Notification Feed ({rows.length})
        </h2>

        {rows.length === 0 ? (
          <p className="text-xs muted py-4">You are all caught up — no unread notifications.</p>
        ) : (
          <div className="divide-y divide-border text-xs">
            {rows.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-4 py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{n.title}</span>
                    {!n.readAt && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </div>
                  {n.body && <p className="muted">{n.body}</p>}
                  <div className="text-[11px] faint">{n.createdAt.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  {n.href && (
                    <Link href={n.href} className="btn btn-secondary btn-sm">
                      Open
                    </Link>
                  )}
                  {!n.readAt && (
                    <form action={markNotificationReadAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <button type="submit" className="btn btn-secondary btn-sm">
                        Read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
