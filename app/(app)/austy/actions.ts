"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  austyActivityLogs,
  austyEmployees,
  austyIncentives,
  austyProviders,
  austyTransactions,
  settings,
  type AustyIncentiveStatus,
  type AustyProviderCategory,
  type AustyRevenueCategory,
  type AustyRole,
} from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import {
  AUSTY_PROVIDER_LABELS,
  AUSTY_REVENUE_LABELS,
  getAustyConfig,
  recalculateAustyIncentives,
} from "@/lib/austy";

export async function createAustyEmployeeAction(formData: FormData) {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const designation = String(formData.get("designation") ?? "").trim();
  const role = (String(formData.get("role") ?? "bde") as AustyRole) || "bde";
  const assignedState = String(formData.get("assignedState") ?? "Maharashtra").trim();
  const assignedDistrict = String(formData.get("assignedDistrict") ?? "Mumbai Suburban").trim();
  const assignedCity = String(formData.get("assignedCity") ?? "Mumbai").trim();
  const joiningDate = String(formData.get("joiningDate") ?? new Date().toISOString().slice(0, 10));
  const managerId = formData.get("managerId") ? Number(formData.get("managerId")) : null;
  const monthlyTargetRevenue = Number(formData.get("monthlyTargetRevenue") ?? 120000) || 120000;
  const monthlyTargetProviders = Number(formData.get("monthlyTargetProviders") ?? 12) || 12;

  if (!name || !email || !mobile) return;

  const [{ maxId }] = await db.select({ maxId: sql<number>`coalesce(max(${austyEmployees.id}), 0)::int` }).from(austyEmployees);
  const seq = maxId + 1;
  const employeeCode = `AUSTY-EMP-${String(seq).padStart(3, "0")}`;
  const referenceId = `AREF-IN-${1000 + seq}`;

  const [created] = await db
    .insert(austyEmployees)
    .values({
      employeeCode,
      referenceId,
      name,
      mobile,
      email,
      designation: designation || "Business Development Executive",
      role,
      assignedState,
      assignedDistrict,
      assignedCity,
      joiningDate,
      managerId,
      status: "active",
      monthlyTargetRevenue,
      monthlyTargetProviders,
      qualityScore: 9.0,
    })
    .onConflictDoNothing()
    .returning();

  if (created) {
    await db.insert(austyActivityLogs).values({
      employeeId: created.id,
      employeeReferenceId: created.referenceId,
      action: "target_achievement",
      description: `Employee ${created.name} (${created.employeeCode} / ${created.referenceId}) onboarded in ${created.assignedCity}, ${created.assignedState}`,
      amount: monthlyTargetRevenue,
      state: created.assignedState,
    });
    await recalculateAustyIncentives("2026-11");
  }

  revalidatePath("/austy");
}

export async function onboardAustyProviderAction(formData: FormData) {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const registrationNumber = String(formData.get("registrationNumber") ?? "").trim().toUpperCase();
  const category = (String(formData.get("category") ?? "doctor") as AustyProviderCategory) || "doctor";
  const mobile = String(formData.get("mobile") ?? "").trim();
  const employeeId = Number(formData.get("employeeId"));
  const state = String(formData.get("state") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (!name || !registrationNumber || !employeeId) return;

  // Duplicate registration & duplicate attribution prevention
  const [dup] = await db
    .select()
    .from(austyProviders)
    .where(eq(austyProviders.registrationNumber, registrationNumber))
    .limit(1);
  if (dup) {
    return;
  }

  const [emp] = await db.select().from(austyEmployees).where(eq(austyEmployees.id, employeeId)).limit(1);
  if (!emp) return;

  const [{ maxId }] = await db.select({ maxId: sql<number>`coalesce(max(${austyProviders.id}), 0)::int` }).from(austyProviders);
  const providerCode = `APRV-${String(maxId + 1).padStart(4, "0")}`;

  const [prov] = await db
    .insert(austyProviders)
    .values({
      providerCode,
      registrationNumber,
      name,
      category,
      mobile: mobile || "+91 98000 00000",
      state: state || emp.assignedState,
      district: district || emp.assignedDistrict,
      city: city || emp.assignedCity,
      onboardedByEmployeeId: emp.id,
      employeeReferenceId: emp.referenceId,
      verified: true,
      active: true,
      satisfactionRating: 4.8,
    })
    .returning();

  await db.insert(austyActivityLogs).values({
    employeeId: emp.id,
    employeeReferenceId: emp.referenceId,
    action: "provider_registration",
    providerCode: prov.providerCode,
    description: `Onboarded & verified ${prov.name} (${AUSTY_PROVIDER_LABELS[category]}, Reg: ${registrationNumber}) in ${prov.city}, ${prov.state}`,
    state: prov.state,
  });

  await recalculateAustyIncentives("2026-11");
  revalidatePath("/austy");
}

export async function recordAustyTransactionAction(formData: FormData) {
  await requireUser();

  const providerId = Number(formData.get("providerId"));
  const category = (String(formData.get("category") ?? "doctor_consultation") as AustyRevenueCategory) || "doctor_consultation";
  const transactionValue = Math.max(100, Number(formData.get("transactionValue") ?? 25000) || 25000);
  const discountAmount = Math.max(0, Number(formData.get("discountAmount") ?? 500) || 0);
  const status = String(formData.get("status") ?? "completed");

  const [prov] = await db.select().from(austyProviders).where(eq(austyProviders.id, providerId)).limit(1);
  if (!prov) return;

  const cfg = await getAustyConfig();
  const [{ maxId }] = await db.select({ maxId: sql<number>`coalesce(max(${austyTransactions.id}), 0)::int` }).from(austyTransactions);
  const transactionCode = `ATX-202611-${String(maxId + 1).padStart(4, "0")}`;

  const grossPlatformRevenue = Math.round(transactionValue * 0.22);
  const platformServiceFee = Math.round(transactionValue * 0.18);
  const refundAmount = status === "refunded" ? Math.round(grossPlatformRevenue * 0.5) : 0;
  const netPlatformRevenue = status === "cancelled" ? 0 : Math.max(0, grossPlatformRevenue - discountAmount - refundAmount);
  const eligibleRevenue = status === "completed" ? Math.round(netPlatformRevenue * cfg.eligibleRevenueFactor) : 0;

  await db.insert(austyTransactions).values({
    transactionCode,
    providerId: prov.id,
    employeeId: prov.onboardedByEmployeeId,
    employeeReferenceId: prov.employeeReferenceId,
    category,
    state: prov.state,
    district: prov.district,
    city: prov.city,
    transactionValue,
    grossPlatformRevenue,
    platformServiceFee,
    discountAmount,
    refundAmount,
    netPlatformRevenue,
    eligibleRevenue,
    status,
  });

  await db.insert(austyActivityLogs).values({
    employeeId: prov.onboardedByEmployeeId,
    employeeReferenceId: prov.employeeReferenceId,
    action: "transaction_generation",
    transactionCode,
    providerCode: prov.providerCode,
    description: `${AUSTY_REVENUE_LABELS[category]} via ${prov.name} — Net Platform Rev: ₹${netPlatformRevenue.toLocaleString("en-IN")} (Eligible: ₹${eligibleRevenue.toLocaleString("en-IN")})`,
    amount: eligibleRevenue,
    state: prov.state,
  });

  await recalculateAustyIncentives("2026-11");
  revalidatePath("/austy");
}

export async function updateAustyIncentiveWorkflowAction(formData: FormData) {
  const user = await requireUser();
  const incentiveId = Number(formData.get("incentiveId"));
  const nextStatus = String(formData.get("status") ?? "approved") as AustyIncentiveStatus;
  const transactionReference = String(formData.get("transactionReference") ?? "").trim() || null;
  const note = String(formData.get("note") ?? "").trim() || undefined;

  const [inc] = await db.select().from(austyIncentives).where(eq(austyIncentives.id, incentiveId)).limit(1);
  if (!inc) return;

  const [emp] = await db.select().from(austyEmployees).where(eq(austyEmployees.id, inc.employeeId)).limit(1);

  const nextHistory = [
    ...(inc.history ?? []),
    {
      status: nextStatus,
      by: `${user.name} (Super Admin)`,
      at: new Date().toISOString(),
      note: note ?? `Moved from ${inc.status} to ${nextStatus}`,
    },
  ];

  await db
    .update(austyIncentives)
    .set({
      status: nextStatus,
      approvedBy: `${user.name} (Super Admin)`,
      paymentDate: nextStatus === "paid" ? new Date() : inc.paymentDate,
      transactionReference: transactionReference ?? (nextStatus === "paid" ? `NEFT-AUSTY-${Date.now().toString().slice(-6)}` : inc.transactionReference),
      history: nextHistory,
      updatedAt: new Date(),
    })
    .where(eq(austyIncentives.id, inc.id));

  if (emp) {
    await db.insert(austyActivityLogs).values({
      employeeId: emp.id,
      employeeReferenceId: emp.referenceId,
      action: nextStatus === "paid" ? "payment_status" : "incentive_approval",
      transactionCode: transactionReference ?? undefined,
      description: `Monthly incentive (₹${(inc.incentiveAmount + inc.teamManagementBonus).toLocaleString("en-IN")}) status updated to ${nextStatus.toUpperCase()} by ${user.name}`,
      amount: inc.incentiveAmount + inc.teamManagementBonus,
      state: emp.assignedState,
    });
  }

  revalidatePath("/austy");
}

export async function updateAustyConfigAction(formData: FormData) {
  await requireUser();
  const current = await getAustyConfig();

  const onboarding = Number(formData.get("w_onboarding") ?? current.epsWeights.onboarding);
  const revenue = Number(formData.get("w_revenue") ?? current.epsWeights.revenue);
  const transactions = Number(formData.get("w_transactions") ?? current.epsWeights.transactions);
  const retention = Number(formData.get("w_retention") ?? current.epsWeights.retention);
  const quality = Number(formData.get("w_quality") ?? current.epsWeights.quality);

  const s50 = Number(formData.get("slab_50") ?? 1000);
  const s75 = Number(formData.get("slab_75") ?? 2500);
  const s90 = Number(formData.get("slab_90") ?? 4000);
  const s100 = Number(formData.get("slab_100") ?? 6000);

  const nextConfig = {
    ...current,
    epsWeights: { onboarding, revenue, transactions, retention, quality },
    slabs: [
      { minPct: 0, maxPct: 49.99, amount: 0, label: "Below 50% — No incentive" },
      { minPct: 50, maxPct: 74.99, amount: s50, label: `50–74% — ₹${s50.toLocaleString("en-IN")}` },
      { minPct: 75, maxPct: 89.99, amount: s75, label: `75–89% — ₹${s75.toLocaleString("en-IN")}` },
      { minPct: 90, maxPct: 99.99, amount: s90, label: `90–99% — ₹${s90.toLocaleString("en-IN")}` },
      { minPct: 100, maxPct: null, amount: s100, label: `100% or above — ₹${s100.toLocaleString("en-IN")}` },
    ],
  };

  await db
    .insert(settings)
    .values({ key: "austy_config", value: nextConfig, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: nextConfig, updatedAt: new Date() },
    });

  await recalculateAustyIncentives("2026-11");
  revalidatePath("/austy");
}
