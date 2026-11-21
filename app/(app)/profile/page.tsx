import { eq, sql } from "drizzle-orm";
import { CheckCircle2, Mail, ShieldCheck, User } from "lucide-react";
import { db } from "@/lib/db";
import { results, tests } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { updateProfileAction } from "../actions";

const NURSING_SUBJECTS = [
  "Adult Health",
  "Fundamentals",
  "Pharmacology",
  "Maternal and Newborn",
  "Pediatrics",
  "Mental Health",
  "Leadership and Management",
];

export default async function ProfilePage() {
  const user = await requireUser();

  const [{ completedCount }] = await db
    .select({ completedCount: sql<number>`count(*)::int` })
    .from(tests)
    .where(eq(tests.userId, user.id));

  const [{ avgScore }] = await db
    .select({ avgScore: sql<number>`coalesce(avg(${results.percent}), 0)::float` })
    .from(results)
    .where(eq(results.userId, user.id));

  const preferred = new Set(user.preferredSubjects ?? []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Profile &amp; Study Settings</h1>
        <p className="text-xs sm:text-sm muted">
          Configure your target exam date, daily study goal, preferred subjects, and security credentials.
        </p>
      </div>

      {/* Overview Header Card */}
      <div className="panel panel-pad flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle text-accent text-xl font-bold">
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{user.name}</h2>
              <span className="chip bg-accent-subtle text-accent capitalize">{user.role}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs muted mt-0.5">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </span>
              {user.emailVerifiedAt ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="text-amber-600">Verification pending</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <div className="text-base font-bold">{completedCount}</div>
            <div className="muted">Tests Taken</div>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <div className="text-base font-bold text-accent">{Math.round(avgScore)}%</div>
            <div className="muted">Avg Score</div>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <div className="text-base font-bold capitalize">{user.subscriptionStatus}</div>
            <div className="muted">Plan</div>
          </div>
        </div>
      </div>

      {/* Profile Update Form */}
      <form action={updateProfileAction} className="panel panel-pad space-y-5">
        <h3 className="h-section flex items-center gap-2">
          <User className="h-4 w-4 text-accent" />
          Personal Details &amp; Study Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="label text-xs">
              Full Name
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={user.name}
              required
              className="field text-xs"
            />
          </div>

          <div>
            <label htmlFor="profile-study-level" className="label text-xs">
              Current Study Level
            </label>
            <input
              id="profile-study-level"
              name="studyLevel"
              type="text"
              defaultValue={user.studyLevel ?? "Final-year Nursing Student"}
              className="field text-xs"
            />
          </div>

          <div>
            <label htmlFor="profile-target-date" className="label text-xs">
              Target Exam Date
            </label>
            <input
              id="profile-target-date"
              name="targetExamDate"
              type="date"
              defaultValue={user.targetExamDate ?? ""}
              className="field text-xs"
            />
          </div>

          <div>
            <label htmlFor="profile-daily-goal" className="label text-xs">
              Daily Practice Goal (Questions / Day)
            </label>
            <input
              id="profile-daily-goal"
              name="dailyGoal"
              type="number"
              min={5}
              max={300}
              defaultValue={user.dailyGoal}
              className="field text-xs"
            />
          </div>
        </div>

        <div>
          <span className="label text-xs">Preferred Nursing &amp; Exam Subjects</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {NURSING_SUBJECTS.map((subj) => (
              <label
                key={subj}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs cursor-pointer hover:bg-muted"
              >
                <input
                  type="checkbox"
                  name="preferredSubjects"
                  value={subj}
                  defaultChecked={preferred.has(subj)}
                  className="rounded"
                />
                <span>{subj}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-accent" />
            Change Password (Optional)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentPassword" className="label text-xs">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Leave blank to keep existing"
                className="field text-xs"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="label text-xs">
                New Password (minimum 8 characters)
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="Enter new password"
                className="field text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary btn-sm">
            Save Profile &amp; Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
