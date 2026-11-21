"use server";

import { redirect } from "next/navigation";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { authTokens, enrollments, exams, notifications, users } from "@/lib/db/schema";
import { clientIp, createSession, destroySession, getCurrentUser, hashPassword, newToken, sha256, verifyPassword } from "@/lib/auth";
import { audit, rateLimit } from "@/lib/security";
import { appOrigin, sendEmail } from "@/lib/email";

export type AuthActionState = {
  error?: string;
  success?: string;
  previewUrl?: string;
};

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  studyLevel: z.string().optional(),
  targetExamDate: z.string().optional(),
});

const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

const resetSchema = z.object({
  token: z.string().min(16, "Invalid or missing reset token."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export async function loginAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const ip = await clientIp();
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your sign-in details." };
  }
  const { email, password } = parsed.data;
  const allowed = await rateLimit(`login:${ip}:${email}`, 12, 300);
  if (!allowed) {
    return { error: "Too many sign-in attempts. Please wait a few minutes and try again." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    await audit(user?.id ?? null, "auth.login_failed", "user", email, null, ip);
    return { error: "Invalid email address or password." };
  }
  if (user.status !== "active") {
    return { error: "This account is currently suspended. Contact platform support." };
  }

  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await createSession({ id: user.id, role: user.role, name: user.name });
  await audit(user.id, "auth.login", "user", user.id, { role: user.role }, ip);

  const next = String(formData.get("next") ?? "").trim();
  if (next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }
  redirect(user.role === "admin" || user.role === "reviewer" ? "/admin" : "/dashboard");
}

export async function demoLoginAction(formData: FormData) {
  const role = String(formData.get("role") ?? "student");
  const emailMap: Record<string, string> = {
    student: "student@qrexq.test",
    reviewer: "reviewer@qrexq.test",
    admin: "admin@qrexq.test",
  };
  const email = emailMap[role] ?? "student@qrexq.test";
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || user.status !== "active") {
    redirect("/login?error=demo_missing");
  }
  const ip = await clientIp();
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  await createSession({ id: user.id, role: user.role, name: user.name });
  await audit(user.id, "auth.demo_login", "user", user.id, { role: user.role }, ip);
  redirect(user.role === "admin" || user.role === "reviewer" ? "/admin" : "/dashboard");
}

export async function registerAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const ip = await clientIp();
  const allowed = await rateLimit(`register:${ip}`, 10, 600);
  if (!allowed) {
    return { error: "Too many registration attempts. Please try again in a few minutes." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    studyLevel: formData.get("studyLevel") || undefined,
    targetExamDate: formData.get("targetExamDate") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your registration details." };
  }

  const { name, email, password, studyLevel, targetExamDate } = parsed.data;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { error: "An account with this email address already exists. Sign in instead." };
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: "student",
      studyLevel: studyLevel || "Nursing Student / Graduate",
      targetExamDate: targetExamDate || null,
      dailyGoal: 50,
      lastLoginAt: new Date(),
    })
    .returning();

  // Auto-enroll in NCLEX-RN so the student lands on a ready dashboard
  const [nclex] = await db.select({ id: exams.id }).from(exams).where(eq(exams.slug, "nclex-rn")).limit(1);
  if (nclex) {
    await db
      .insert(enrollments)
      .values({ userId: created.id, examId: nclex.id, targetDate: targetExamDate || null })
      .onConflictDoNothing();
  }

  const tok = newToken();
  await db.insert(authTokens).values({
    userId: created.id,
    tokenHash: tok.hash,
    kind: "verify_email",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  const verifyUrl = `${appOrigin()}/verify-email?token=${encodeURIComponent(tok.raw)}`;
  await sendEmail({
    to: created.email,
    subject: "Verify your QREXq email address",
    text: `Welcome to QREXq, ${created.name}! Verify your email address: ${verifyUrl}`,
    actionUrl: verifyUrl,
  });

  await db.insert(notifications).values({
    userId: created.id,
    kind: "welcome",
    title: "Welcome to QREXq — verify your email",
    body: "Your NCLEX-RN course is ready. Click to confirm your email address or start your first practice test.",
    href: `/verify-email?token=${encodeURIComponent(tok.raw)}`,
  });

  await createSession({ id: created.id, role: created.role, name: created.name });
  await audit(created.id, "auth.register", "user", created.id, null, ip);
  redirect("/dashboard");
}

export async function forgotPasswordAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const ip = await clientIp();
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }
  const { email } = parsed.data;
  const allowed = await rateLimit(`forgot:${ip}:${email}`, 6, 600);
  if (!allowed) {
    return { error: "Too many requests. Please wait a few minutes before trying again." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  let previewUrl: string | undefined;
  if (user && user.status === "active") {
    const tok = newToken();
    await db.insert(authTokens).values({
      userId: user.id,
      tokenHash: tok.hash,
      kind: "reset_password",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });
    const resetUrl = `${appOrigin()}/reset-password?token=${encodeURIComponent(tok.raw)}`;
    const mail = await sendEmail({
      to: user.email,
      subject: "Reset your QREXq password",
      text: `Use this one-time link within 60 minutes to reset your password: ${resetUrl}`,
      actionUrl: resetUrl,
    });
    previewUrl = mail.previewUrl;
    await audit(user.id, "auth.forgot_password", "user", user.id, null, ip);
  }

  return {
    success: "If an active account exists for that email address, a password reset link has been generated.",
    previewUrl,
  };
}

export async function resetPasswordAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const ip = await clientIp();
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password reset submission." };
  }
  const { token, password } = parsed.data;
  const hash = sha256(token);
  const [row] = await db
    .select()
    .from(authTokens)
    .where(and(eq(authTokens.tokenHash, hash), eq(authTokens.kind, "reset_password"), isNull(authTokens.usedAt), gt(authTokens.expiresAt, new Date())))
    .limit(1);

  if (!row) {
    return { error: "This reset link is invalid or has expired. Please request a new link." };
  }

  const passwordHash = await hashPassword(password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
  await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, row.id));
  await audit(row.userId, "auth.reset_password", "user", row.userId, null, ip);

  return { success: "Your password has been updated. You can now sign in with your new password." };
}

export async function resendVerificationAction(): Promise<AuthActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in first." };
  if (user.emailVerifiedAt) return { success: "Your email address is already verified." };

  const tok = newToken();
  await db.insert(authTokens).values({
    userId: user.id,
    tokenHash: tok.hash,
    kind: "verify_email",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  const verifyUrl = `${appOrigin()}/verify-email?token=${encodeURIComponent(tok.raw)}`;
  const mail = await sendEmail({
    to: user.email,
    subject: "Verify your QREXq email address",
    text: `Verify your email address: ${verifyUrl}`,
    actionUrl: verifyUrl,
  });
  return {
    success: "Verification link generated.",
    previewUrl: mail.previewUrl,
  };
}

export async function logoutAction() {
  const user = await getCurrentUser();
  const ip = await clientIp();
  if (user) {
    await audit(user.id, "auth.logout", "user", user.id, null, ip);
  }
  await destroySession();
  redirect("/login");
}
