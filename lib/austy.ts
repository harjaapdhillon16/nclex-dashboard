import { and, desc, eq, gte, lte, sql, type SQL } from "drizzle-orm";
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

export type AustyConfig = {
  epsWeights: {
    onboarding: number; // default 30
    revenue: number; // default 30
    transactions: number; // default 20
    retention: number; // default 10
    quality: number; // default 10
  };
  slabs: { minPct: number; maxPct: number | null; amount: number; label: string }[];
  txTargetPerMonth: number; // default 60
  eligibleRevenueFactor: number; // default 0.85 of net platform revenue
};

export const DEFAULT_AUSTY_CONFIG: AustyConfig = {
  epsWeights: {
    onboarding: 30,
    revenue: 30,
    transactions: 20,
    retention: 10,
    quality: 10,
  },
  slabs: [
    { minPct: 0, maxPct: 49.99, amount: 0, label: "Below 50% — No incentive" },
    { minPct: 50, maxPct: 74.99, amount: 1000, label: "50–74% — ₹1,000" },
    { minPct: 75, maxPct: 89.99, amount: 2500, label: "75–89% — ₹2,500" },
    { minPct: 90, maxPct: 99.99, amount: 4000, label: "90–99% — ₹4,000" },
    { minPct: 100, maxPct: null, amount: 6000, label: "100% or above — ₹6,000" },
  ],
  txTargetPerMonth: 60,
  eligibleRevenueFactor: 0.85,
};

export const AUSTY_ROLE_LABELS: Record<AustyRole, string> = {
  state_manager: "State Business Manager",
  district_manager: "District Business Manager",
  team_leader: "Team Leader",
  bde: "Business Development Executive",
  field_executive: "Field Executive",
};

export const AUSTY_PROVIDER_LABELS: Record<AustyProviderCategory, string> = {
  doctor: "Doctors",
  pharmacy: "Pharmacies",
  lab: "Diagnostic Laboratories",
  hospital: "Hospitals",
  ambulance: "Ambulance Providers",
  rental_equipment: "Rental Equipment Vendors",
};

export const AUSTY_REVENUE_LABELS: Record<AustyRevenueCategory, string> = {
  doctor_consultation: "Doctor Consultation",
  pharmacy_orders: "Pharmacy Orders",
  diagnostic_lab_tests: "Diagnostic Lab Tests",
  ct_mri_bookings: "CT/MRI Bookings",
  ambulance_bookings: "Ambulance Bookings",
  hospital_surgery: "Hospital and Surgery Services",
  rental_medical_equipment: "Rental Medical Equipment",
};

export async function getAustyConfig(): Promise<AustyConfig> {
  const [row] = await db.select().from(settings).where(eq(settings.key, "austy_config")).limit(1);
  if (!row) return DEFAULT_AUSTY_CONFIG;
  const val = row.value as Partial<AustyConfig>;
  return {
    epsWeights: { ...DEFAULT_AUSTY_CONFIG.epsWeights, ...(val.epsWeights ?? {}) },
    slabs: val.slabs?.length ? val.slabs : DEFAULT_AUSTY_CONFIG.slabs,
    txTargetPerMonth: val.txTargetPerMonth ?? DEFAULT_AUSTY_CONFIG.txTargetPerMonth,
    eligibleRevenueFactor: val.eligibleRevenueFactor ?? DEFAULT_AUSTY_CONFIG.eligibleRevenueFactor,
  };
}

export function calculateIncentiveForPct(pct: number, slabs: AustyConfig["slabs"]): number {
  const sorted = [...slabs].sort((a, b) => b.minPct - a.minPct);
  for (const s of sorted) {
    if (pct >= s.minPct && (s.maxPct === null || pct <= s.maxPct + 0.01)) {
      return s.amount;
    }
  }
  return 0;
}

export function computeEps(
  input: {
    achievedProviders: number;
    targetProviders: number;
    achievedEligibleRevenue: number;
    targetRevenue: number;
    completedTxCount: number;
    verifiedActiveRatio: number; // 0..1
    qualityScore10: number; // 0..10
  },
  cfg: AustyConfig,
) {
  const w = cfg.epsWeights;
  const pRatio = input.targetProviders > 0 ? Math.min(1, input.achievedProviders / input.targetProviders) : 0;
  const rRatio = input.targetRevenue > 0 ? Math.min(1, input.achievedEligibleRevenue / input.targetRevenue) : 0;
  const tRatio = cfg.txTargetPerMonth > 0 ? Math.min(1, input.completedTxCount / cfg.txTargetPerMonth) : 0;
  const retRatio = Math.max(0, Math.min(1, input.verifiedActiveRatio));
  const qRatio = Math.max(0, Math.min(1, input.qualityScore10 / 10));

  const onboarding = Math.round(pRatio * w.onboarding * 10) / 10;
  const revenue = Math.round(rRatio * w.revenue * 10) / 10;
  const transactions = Math.round(tRatio * w.transactions * 10) / 10;
  const retention = Math.round(retRatio * w.retention * 10) / 10;
  const quality = Math.round(qRatio * w.quality * 10) / 10;
  const total = Math.min(100, Math.round((onboarding + revenue + transactions + retention + quality) * 10) / 10);

  return {
    total,
    breakdown: { onboarding, revenue, transactions, retention, quality },
  };
}

export async function recalculateAustyIncentives(periodMonth = "2026-11") {
  const cfg = await getAustyConfig();
  const emps = await db.select().from(austyEmployees);
  const provs = await db.select().from(austyProviders);
  const txs = await db.select().from(austyTransactions);
  const existingIncs = await db.select().from(austyIncentives).where(eq(austyIncentives.periodMonth, periodMonth));
  const incByEmp = new Map(existingIncs.map((i) => [i.employeeId, i]));

  for (const emp of emps) {
    const myProvs = provs.filter((p) => p.onboardedByEmployeeId === emp.id);
    const activeVerified = myProvs.filter((p) => p.verified && p.active).length;
    const retRatio = myProvs.length > 0 ? activeVerified / myProvs.length : 0.85;

    const myCompletedTxs = txs.filter((t) => t.employeeId === emp.id && t.status === "completed");
    const eligibleRev = myCompletedTxs.reduce((sum, t) => sum + t.eligibleRevenue, 0);

    const revAch = emp.monthlyTargetRevenue > 0 ? (eligibleRev / emp.monthlyTargetRevenue) * 100 : 0;
    const provAch = emp.monthlyTargetProviders > 0 ? (myProvs.length / emp.monthlyTargetProviders) * 100 : 0;
    // Weighted target achievement: 60% eligible revenue + 40% provider onboarding
    const achievementPercent = Math.round((revAch * 0.6 + provAch * 0.4) * 10) / 10;

    const eps = computeEps(
      {
        achievedProviders: myProvs.length,
        targetProviders: emp.monthlyTargetProviders,
        achievedEligibleRevenue: eligibleRev,
        targetRevenue: emp.monthlyTargetRevenue,
        completedTxCount: myCompletedTxs.length,
        verifiedActiveRatio: retRatio,
        qualityScore10: emp.qualityScore,
      },
      cfg,
    );

    const incentiveAmount = calculateIncentiveForPct(achievementPercent, cfg.slabs);

    // Team Leaders earn documented management work incentive ONLY if their supervised team achieves >= 80% average target (never for recruiting employees)
    let teamManagementBonus = 0;
    if (emp.role === "team_leader") {
      const teamMembers = emps.filter((m) => m.managerId === emp.id && m.status === "active");
      if (teamMembers.length > 0) {
        const teamRev = txs
          .filter((t) => teamMembers.some((m) => m.id === t.employeeId) && t.status === "completed")
          .reduce((a, b) => a + b.eligibleRevenue, 0);
        const teamTarget = teamMembers.reduce((a, b) => a + b.monthlyTargetRevenue, 0);
        if (teamTarget > 0 && teamRev / teamTarget >= 0.8) {
          teamManagementBonus = 1500;
        }
      }
    }

    const existing = incByEmp.get(emp.id);
    if (!existing) {
      await db.insert(austyIncentives).values({
        employeeId: emp.id,
        periodMonth,
        targetRevenue: emp.monthlyTargetRevenue,
        achievedEligibleRevenue: Math.round(eligibleRev),
        targetProviders: emp.monthlyTargetProviders,
        achievedProviders: myProvs.length,
        achievementPercent,
        epsScore: eps.total,
        epsBreakdown: eps.breakdown,
        incentiveAmount,
        teamManagementBonus,
        status: "calculated",
        history: [{ status: "calculated", by: "System Formula", at: new Date().toISOString(), note: "Auto-calculated from verified DB records" }],
      });
    } else if (existing.status === "calculated" || existing.status === "pending_verification") {
      await db
        .update(austyIncentives)
        .set({
          targetRevenue: emp.monthlyTargetRevenue,
          achievedEligibleRevenue: Math.round(eligibleRev),
          targetProviders: emp.monthlyTargetProviders,
          achievedProviders: myProvs.length,
          achievementPercent,
          epsScore: eps.total,
          epsBreakdown: eps.breakdown,
          incentiveAmount,
          teamManagementBonus,
          updatedAt: new Date(),
        })
        .where(eq(austyIncentives.id, existing.id));
    }
  }
}

export async function seedAustyIfEmpty() {
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(austyEmployees);
  if (count > 0) return;

  await db
    .insert(settings)
    .values({ key: "austy_config", value: DEFAULT_AUSTY_CONFIG })
    .onConflictDoNothing();

  const empSeeds: (typeof austyEmployees.$inferInsert)[] = [
    {
      employeeCode: "AUSTY-EMP-001",
      referenceId: "AREF-IN-1001",
      name: "Rajeshwari Deshmukh",
      mobile: "+91 98201 44110",
      email: "rajeshwari.d@austyhealthcare.in",
      designation: "State Head — Maharashtra",
      role: "state_manager",
      assignedState: "Maharashtra",
      assignedDistrict: "Mumbai Suburban",
      assignedCity: "Mumbai",
      joiningDate: "2025-02-10",
      status: "active",
      monthlyTargetRevenue: 250000,
      monthlyTargetProviders: 18,
      qualityScore: 9.5,
    },
    {
      employeeCode: "AUSTY-EMP-002",
      referenceId: "AREF-IN-1002",
      name: "Karthik Subramanian",
      mobile: "+91 98450 31290",
      email: "karthik.s@austyhealthcare.in",
      designation: "State Business Manager — Karnataka",
      role: "state_manager",
      assignedState: "Karnataka",
      assignedDistrict: "Bengaluru Urban",
      assignedCity: "Bengaluru",
      joiningDate: "2025-03-01",
      status: "active",
      monthlyTargetRevenue: 240000,
      monthlyTargetProviders: 16,
      qualityScore: 9.3,
    },
    {
      employeeCode: "AUSTY-EMP-003",
      referenceId: "AREF-IN-1003",
      name: "Vikramaditya Kulkarni",
      mobile: "+91 98220 77812",
      email: "vikram.k@austyhealthcare.in",
      designation: "District Business Manager — Pune",
      role: "district_manager",
      assignedState: "Maharashtra",
      assignedDistrict: "Pune",
      assignedCity: "Pune",
      joiningDate: "2025-04-15",
      managerId: 1,
      status: "active",
      monthlyTargetRevenue: 180000,
      monthlyTargetProviders: 15,
      qualityScore: 9.1,
    },
    {
      employeeCode: "AUSTY-EMP-004",
      referenceId: "AREF-IN-1004",
      name: "Ananya Nair",
      mobile: "+91 94470 55123",
      email: "ananya.nair@austyhealthcare.in",
      designation: "Regional Team Leader — West & South",
      role: "team_leader",
      assignedState: "Maharashtra",
      assignedDistrict: "Mumbai Suburban",
      assignedCity: "Mumbai",
      joiningDate: "2025-05-01",
      managerId: 1,
      status: "active",
      monthlyTargetRevenue: 150000,
      monthlyTargetProviders: 14,
      qualityScore: 9.4,
    },
    {
      employeeCode: "AUSTY-EMP-005",
      referenceId: "AREF-IN-1005",
      name: "Saurabh Chatterjee",
      mobile: "+91 98111 90341",
      email: "saurabh.c@austyhealthcare.in",
      designation: "Team Leader — North & NCR",
      role: "team_leader",
      assignedState: "Delhi",
      assignedDistrict: "New Delhi",
      assignedCity: "New Delhi",
      joiningDate: "2025-05-12",
      status: "active",
      monthlyTargetRevenue: 160000,
      monthlyTargetProviders: 14,
      qualityScore: 8.9,
    },
    {
      employeeCode: "AUSTY-EMP-006",
      referenceId: "AREF-IN-1006",
      name: "Priya Sharma",
      mobile: "+91 97654 22109",
      email: "student@qrexq.test", // linked to demo student email so Employee View works out of the box too
      designation: "Senior Business Development Executive",
      role: "bde",
      assignedState: "Maharashtra",
      assignedDistrict: "Pune",
      assignedCity: "Pune",
      joiningDate: "2025-06-01",
      managerId: 4,
      status: "active",
      monthlyTargetRevenue: 120000,
      monthlyTargetProviders: 12,
      qualityScore: 9.6,
    },
    {
      employeeCode: "AUSTY-EMP-007",
      referenceId: "AREF-IN-1007",
      name: "Arjun Reddy",
      mobile: "+91 90001 88412",
      email: "arjun.reddy@austyhealthcare.in",
      designation: "Business Development Executive — Hyderabad",
      role: "bde",
      assignedState: "Telangana",
      assignedDistrict: "Hyderabad",
      assignedCity: "Hyderabad",
      joiningDate: "2025-06-18",
      managerId: 4,
      status: "active",
      monthlyTargetRevenue: 125000,
      monthlyTargetProviders: 12,
      qualityScore: 9.0,
    },
    {
      employeeCode: "AUSTY-EMP-008",
      referenceId: "AREF-IN-1008",
      name: "Meenakshi Sundaram",
      mobile: "+91 98401 67234",
      email: "meenakshi.s@austyhealthcare.in",
      designation: "Business Development Executive — Chennai",
      role: "bde",
      assignedState: "Tamil Nadu",
      assignedDistrict: "Chennai",
      assignedCity: "Chennai",
      joiningDate: "2025-07-03",
      managerId: 2,
      status: "active",
      monthlyTargetRevenue: 130000,
      monthlyTargetProviders: 12,
      qualityScore: 9.2,
    },
    {
      employeeCode: "AUSTY-EMP-009",
      referenceId: "AREF-IN-1009",
      name: "Rohan Verma",
      mobile: "+91 98180 41255",
      email: "rohan.verma@austyhealthcare.in",
      designation: "Field Executive — Delhi NCR",
      role: "field_executive",
      assignedState: "Delhi",
      assignedDistrict: "South Delhi",
      assignedCity: "New Delhi",
      joiningDate: "2025-08-01",
      managerId: 5,
      status: "active",
      monthlyTargetRevenue: 95000,
      monthlyTargetProviders: 10,
      qualityScore: 8.7,
    },
    {
      employeeCode: "AUSTY-EMP-010",
      referenceId: "AREF-IN-1010",
      name: "Harshvardhan Patel",
      mobile: "+91 98250 11982",
      email: "harsh.patel@austyhealthcare.in",
      designation: "Field Executive — Ahmedabad",
      role: "field_executive",
      assignedState: "Gujarat",
      assignedDistrict: "Ahmedabad",
      assignedCity: "Ahmedabad",
      joiningDate: "2025-08-19",
      managerId: 4,
      status: "active",
      monthlyTargetRevenue: 90000,
      monthlyTargetProviders: 10,
      qualityScore: 8.5,
    },
    {
      employeeCode: "AUSTY-EMP-011",
      referenceId: "AREF-IN-1011",
      name: "Divya Krishnan",
      mobile: "+91 98801 52019",
      email: "divya.k@austyhealthcare.in",
      designation: "Field Executive — Mysuru",
      role: "field_executive",
      assignedState: "Karnataka",
      assignedDistrict: "Mysuru",
      assignedCity: "Mysuru",
      joiningDate: "2025-09-05",
      managerId: 2,
      status: "active",
      monthlyTargetRevenue: 85000,
      monthlyTargetProviders: 10,
      qualityScore: 8.8,
    },
    {
      employeeCode: "AUSTY-EMP-012",
      referenceId: "AREF-IN-1012",
      name: "Manish Tiwari",
      mobile: "+91 94150 67320",
      email: "manish.t@austyhealthcare.in",
      designation: "Field Executive — Lucknow",
      role: "field_executive",
      assignedState: "Uttar Pradesh",
      assignedDistrict: "Lucknow",
      assignedCity: "Lucknow",
      joiningDate: "2025-09-20",
      managerId: 5,
      status: "inactive",
      monthlyTargetRevenue: 80000,
      monthlyTargetProviders: 10,
      qualityScore: 7.8,
    },
  ];

  const insertedEmps = await db.insert(austyEmployees).values(empSeeds).returning();

  const providerTemplates: {
    name: string;
    category: AustyProviderCategory;
    empIdx: number;
    verified: boolean;
    active: boolean;
  }[] = [
    { name: "Dr. Aditi Gokhale MD (Internal Medicine)", category: "doctor", empIdx: 0, verified: true, active: true },
    { name: "Sahyadri Care Superspeciality Hospital", category: "hospital", empIdx: 0, verified: true, active: true },
    { name: "LifeLine 24x7 Cardiac Ambulance Mumbai", category: "ambulance", empIdx: 0, verified: true, active: true },
    { name: "Apollo Wellness Pharmacy Andheri", category: "pharmacy", empIdx: 0, verified: true, active: true },
    { name: "Metropolis Advanced Diagnostics Mumbai", category: "lab", empIdx: 0, verified: true, active: true },
    { name: "MedEquip Home ICU & Oxygen Rentals", category: "rental_equipment", empIdx: 0, verified: true, active: true },

    { name: "Dr. Naveen Gowda MS (Orthopaedics)", category: "doctor", empIdx: 1, verified: true, active: true },
    { name: "Narayana Multispeciality Clinic Indiranagar", category: "hospital", empIdx: 1, verified: true, active: true },
    { name: "Bengaluru MedPlus Pharmacy Hub", category: "pharmacy", empIdx: 1, verified: true, active: true },
    { name: "Anand Diagnostic Laboratory Bengaluru", category: "lab", empIdx: 1, verified: true, active: true },
    { name: "Kaveri Rapid Response Ambulance", category: "ambulance", empIdx: 1, verified: true, active: true },

    { name: "Dr. Sandeep Joshi DM (Cardiology)", category: "doctor", empIdx: 2, verified: true, active: true },
    { name: "Ruby Hall Diagnostic Centre Pune", category: "lab", empIdx: 2, verified: true, active: true },
    { name: "Deccan Wellness Pharmacy Kothrud", category: "pharmacy", empIdx: 2, verified: true, active: true },
    { name: "Pune Rehab & Mobility Equipment Rentals", category: "rental_equipment", empIdx: 2, verified: true, active: true },

    { name: "Dr. Farhan Siddiqui MBBS DNB", category: "doctor", empIdx: 3, verified: true, active: true },
    { name: "Kokilaben Community Care Centre", category: "hospital", empIdx: 3, verified: true, active: true },
    { name: "Suburban PathLabs Dadar", category: "lab", empIdx: 3, verified: true, active: true },
    { name: "WestCoast Medical Equipment Rentals", category: "rental_equipment", empIdx: 3, verified: true, active: true },

    { name: "Dr. Ritu Malhotra MD (Pediatrics)", category: "doctor", empIdx: 4, verified: true, active: true },
    { name: "MaxCare Diagnostics Connaught Place", category: "lab", empIdx: 4, verified: true, active: true },
    { name: "Capital Emergency Ambulance Services", category: "ambulance", empIdx: 4, verified: true, active: true },
    { name: "Delhi Jan Aushadhi & Care Pharmacy", category: "pharmacy", empIdx: 4, verified: true, active: true },

    { name: "Dr. Snehal Patil MD (Obstetrics & Gynaecology)", category: "doctor", empIdx: 5, verified: true, active: true },
    { name: "Dr. Omkar Kulkarni MS (General Surgery)", category: "doctor", empIdx: 5, verified: true, active: true },
    { name: "baner Prime Pharmacy & Surgical", category: "pharmacy", empIdx: 5, verified: true, active: true },
    { name: "Precision MRI & CT Scan Centre Wakad", category: "lab", empIdx: 5, verified: true, active: true },
    { name: "Jehangir Partner Specialty Hospital", category: "hospital", empIdx: 5, verified: true, active: true },
    { name: "RapidAid ICU Ambulance Pune", category: "ambulance", empIdx: 5, verified: true, active: true },
    { name: "CareHome BiPAP & Hospital Bed Rentals", category: "rental_equipment", empIdx: 5, verified: true, active: true },

    { name: "Dr. Srinivas Rao MD", category: "doctor", empIdx: 6, verified: true, active: true },
    { name: "Yashoda Partner Diagnostics Banjara Hills", category: "lab", empIdx: 6, verified: true, active: true },
    { name: "Hyderabad MedCare Pharmacy", category: "pharmacy", empIdx: 6, verified: true, active: true },
    { name: "Telangana Trauma Ambulance Network", category: "ambulance", empIdx: 6, verified: true, active: true },
    { name: "Nizam Medical Equipment Rentals", category: "rental_equipment", empIdx: 6, verified: true, active: true },

    { name: "Dr. Lakshmi Narayanan MD", category: "doctor", empIdx: 7, verified: true, active: true },
    { name: "Kauvery Partner Hospital Adyar", category: "hospital", empIdx: 7, verified: true, active: true },
    { name: "Chennai Metro Diagnostics", category: "lab", empIdx: 7, verified: true, active: true },
    { name: "Marina Health Pharmacy", category: "pharmacy", empIdx: 7, verified: true, active: true },

    { name: "Dr. Gaurav Khanna MBBS", category: "doctor", empIdx: 8, verified: true, active: true },
    { name: "South Delhi Imaging & PathLab", category: "lab", empIdx: 8, verified: true, active: true },
    { name: "Saket Care Pharmacy", category: "pharmacy", empIdx: 8, verified: true, active: false },

    { name: "Dr. Chirag Mehta MD", category: "doctor", empIdx: 9, verified: true, active: true },
    { name: "Karnavati Superspeciality Hospital", category: "hospital", empIdx: 9, verified: true, active: true },
    { name: "Sabarmati Home Medical Rentals", category: "rental_equipment", empIdx: 9, verified: true, active: true },

    { name: "Dr. Pavithra Urs MBBS", category: "doctor", empIdx: 10, verified: true, active: true },
    { name: "Mysuru Royal Pharmacy", category: "pharmacy", empIdx: 10, verified: true, active: true },
    { name: "Chamundi Diagnostic Lab", category: "lab", empIdx: 10, verified: false, active: false },

    { name: "Dr. Alok Srivastava MD", category: "doctor", empIdx: 11, verified: true, active: true },
    { name: "Gomti Nagar Pharmacy", category: "pharmacy", empIdx: 11, verified: false, active: false },
  ];

  const provRows = await db
    .insert(austyProviders)
    .values(
      providerTemplates.map((pt, idx) => {
        const emp = insertedEmps[pt.empIdx]!;
        return {
          providerCode: `APRV-${String(idx + 1).padStart(4, "0")}`,
          registrationNumber: `REG-IN-2026-${String(idx + 101).padStart(4, "0")}`,
          name: pt.name,
          category: pt.category,
          mobile: `+91 98${String(10000000 + idx * 7919).slice(0, 8)}`,
          state: emp.assignedState,
          district: emp.assignedDistrict,
          city: emp.assignedCity,
          onboardedByEmployeeId: emp.id,
          employeeReferenceId: emp.referenceId,
          verified: pt.verified,
          active: pt.active,
          satisfactionRating: 4.5 + ((idx % 5) * 0.1),
        };
      }),
    )
    .returning();

  const revCats: AustyRevenueCategory[] = [
    "doctor_consultation",
    "pharmacy_orders",
    "diagnostic_lab_tests",
    "ct_mri_bookings",
    "ambulance_bookings",
    "hospital_surgery",
    "rental_medical_equipment",
  ];

  const txSeeds: (typeof austyTransactions.$inferInsert)[] = [];
  let txCounter = 1;
  for (const [idx, prov] of provRows.entries()) {
    const emp = insertedEmps.find((e) => e.id === prov.onboardedByEmployeeId)!;
    const countForProv = prov.active ? 3 : 1;
    for (let k = 0; k < countForProv; k++) {
      const cat = revCats[(idx + k) % revCats.length]!;
      const baseValue =
        cat === "hospital_surgery"
          ? 185000
          : cat === "ct_mri_bookings"
            ? 42000
            : cat === "rental_medical_equipment"
              ? 36000
              : cat === "diagnostic_lab_tests"
                ? 28000
                : cat === "pharmacy_orders"
                  ? 32000
                  : cat === "ambulance_bookings"
                    ? 24000
                    : 22000;
      const transactionValue = baseValue + ((idx * 1300 + k * 2500) % 18000);
      const isCancelled = txCounter % 19 === 0;
      const isRefunded = !isCancelled && txCounter % 17 === 0;
      const status = isCancelled ? "cancelled" : isRefunded ? "refunded" : "completed";

      const grossPlatformRevenue = Math.round(transactionValue * 0.22);
      const platformServiceFee = Math.round(transactionValue * 0.18);
      const discountAmount = Math.round(transactionValue * 0.02);
      const refundAmount = isRefunded ? Math.round(grossPlatformRevenue * 0.5) : 0;
      const netPlatformRevenue = isCancelled ? 0 : Math.max(0, grossPlatformRevenue - discountAmount - refundAmount);
      const eligibleRevenue = status === "completed" ? Math.round(netPlatformRevenue * 0.85) : 0;

      txSeeds.push({
        transactionCode: `ATX-202611-${String(txCounter++).padStart(4, "0")}`,
        providerId: prov.id,
        employeeId: emp.id,
        employeeReferenceId: emp.referenceId,
        category: cat,
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
        transactedAt: new Date(Date.now() - ((idx * 12 + k * 5) % 25) * 86400000),
      });
    }
  }

  await db.insert(austyTransactions).values(txSeeds);
  await recalculateAustyIncentives("2026-11");

  // Advance some incentives across the approval workflow so all statuses are demonstrated
  const allIncs = await db.select().from(austyIncentives);
  const demoStatuses: AustyIncentiveStatus[] = ["paid", "approved", "payment_processing", "pending_verification", "calculated"];
  for (const [i, inc] of allIncs.entries()) {
    const st = demoStatuses[i % demoStatuses.length]!;
    await db
      .update(austyIncentives)
      .set({
        status: st,
        approvedBy: st === "paid" || st === "approved" || st === "payment_processing" ? "Super Admin (AUSTY HQ)" : null,
        paymentDate: st === "paid" ? new Date() : null,
        transactionReference: st === "paid" ? `NEFT-AUSTY-2611-${1000 + inc.id}` : null,
        history: [
          ...inc.history,
          ...(st !== "calculated"
            ? [{ status: st, by: "Super Admin (AUSTY HQ)", at: new Date().toISOString(), note: `Workflow status updated to ${st}` }]
            : []),
        ],
      })
      .where(eq(austyIncentives.id, inc.id));
  }

  // Activity logs
  const actSeeds: (typeof austyActivityLogs.$inferInsert)[] = provRows.slice(0, 18).map((p, i) => ({
    employeeId: p.onboardedByEmployeeId,
    employeeReferenceId: p.employeeReferenceId,
    action: i % 3 === 0 ? "provider_registration" : i % 3 === 1 ? "provider_verification" : "transaction_generation",
    providerCode: p.providerCode,
    transactionCode: txSeeds[i]?.transactionCode,
    description:
      i % 3 === 0
        ? `Onboarded ${p.name} (${AUSTY_PROVIDER_LABELS[p.category]}) in ${p.city}, ${p.state}`
        : i % 3 === 1
          ? `Verified credentials & registration (${p.registrationNumber}) for ${p.name}`
          : `Generated eligible platform revenue via ${p.name}`,
    amount: txSeeds[i]?.eligibleRevenue ?? 0,
    state: p.state,
  }));
  await db.insert(austyActivityLogs).values(actSeeds);
}

export type AustyFilters = {
  state?: string;
  district?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
  roleView?: "super_admin" | "state_manager" | "district_manager" | "team_leader" | "employee";
  employeeId?: number;
};

export async function getAustyDashboardData(filters: AustyFilters = {}) {
  await seedAustyIfEmpty();
  const cfg = await getAustyConfig();

  const allEmps = await db.select().from(austyEmployees).orderBy(austyEmployees.id);
  const allProvs = await db.select().from(austyProviders).orderBy(desc(austyProviders.onboardedAt));
  const allTxs = await db.select().from(austyTransactions).orderBy(desc(austyTransactions.transactedAt));
  const allIncs = await db.select().from(austyIncentives).where(eq(austyIncentives.periodMonth, "2026-11"));
  const allLogs = await db.select().from(austyActivityLogs).orderBy(desc(austyActivityLogs.createdAt)).limit(50);

  // Determine RBAC scope if viewing as a specific role/employee
  let scopedEmps = allEmps;
  let scopedProvs = allProvs;
  let scopedTxs = allTxs;

  const activeViewerEmp = filters.employeeId ? allEmps.find((e) => e.id === filters.employeeId) : allEmps[0];
  if (filters.roleView && filters.roleView !== "super_admin" && activeViewerEmp) {
    if (filters.roleView === "state_manager") {
      scopedEmps = allEmps.filter((e) => e.assignedState === activeViewerEmp.assignedState);
      scopedProvs = allProvs.filter((p) => p.state === activeViewerEmp.assignedState);
      scopedTxs = allTxs.filter((t) => t.state === activeViewerEmp.assignedState);
    } else if (filters.roleView === "district_manager") {
      scopedEmps = allEmps.filter((e) => e.assignedDistrict === activeViewerEmp.assignedDistrict);
      scopedProvs = allProvs.filter((p) => p.district === activeViewerEmp.assignedDistrict);
      scopedTxs = allTxs.filter((t) => t.district === activeViewerEmp.assignedDistrict);
    } else if (filters.roleView === "team_leader") {
      const teamIds = new Set(allEmps.filter((e) => e.id === activeViewerEmp.id || e.managerId === activeViewerEmp.id).map((e) => e.id));
      scopedEmps = allEmps.filter((e) => teamIds.has(e.id));
      scopedProvs = allProvs.filter((p) => teamIds.has(p.onboardedByEmployeeId));
      scopedTxs = allTxs.filter((t) => teamIds.has(t.employeeId));
    } else if (filters.roleView === "employee") {
      scopedEmps = allEmps.filter((e) => e.id === activeViewerEmp.id);
      scopedProvs = allProvs.filter((p) => p.onboardedByEmployeeId === activeViewerEmp.id);
      scopedTxs = allTxs.filter((t) => t.employeeId === activeViewerEmp.id);
    }
  }

  // Apply explicit location/date filters
  if (filters.state) {
    scopedEmps = scopedEmps.filter((e) => e.assignedState === filters.state);
    scopedProvs = scopedProvs.filter((p) => p.state === filters.state);
    scopedTxs = scopedTxs.filter((t) => t.state === filters.state);
  }
  if (filters.district) {
    scopedEmps = scopedEmps.filter((e) => e.assignedDistrict === filters.district);
    scopedProvs = scopedProvs.filter((p) => p.district === filters.district);
    scopedTxs = scopedTxs.filter((t) => t.district === filters.district);
  }
  if (filters.city) {
    scopedEmps = scopedEmps.filter((e) => e.assignedCity === filters.city);
    scopedProvs = scopedProvs.filter((p) => p.city === filters.city);
    scopedTxs = scopedTxs.filter((t) => t.city === filters.city);
  }
  if (filters.fromDate) {
    const from = new Date(filters.fromDate);
    scopedTxs = scopedTxs.filter((t) => new Date(t.transactedAt) >= from);
  }
  if (filters.toDate) {
    const to = new Date(`${filters.toDate}T23:59:59`);
    scopedTxs = scopedTxs.filter((t) => new Date(t.transactedAt) <= to);
  }

  const incByEmp = new Map(allIncs.map((i) => [i.employeeId, i]));
  const empById = new Map(allEmps.map((e) => [e.id, e]));

  // Employee-wise performance rows
  const employeePerformance = scopedEmps.map((emp) => {
    const myProvs = scopedProvs.filter((p) => p.onboardedByEmployeeId === emp.id);
    const myTxs = scopedTxs.filter((t) => t.employeeId === emp.id);
    const completedTxs = myTxs.filter((t) => t.status === "completed");
    const inc = incByEmp.get(emp.id);

    const byCat = {
      doctor: myProvs.filter((p) => p.category === "doctor").length,
      pharmacy: myProvs.filter((p) => p.category === "pharmacy").length,
      lab: myProvs.filter((p) => p.category === "lab").length,
      hospital: myProvs.filter((p) => p.category === "hospital").length,
      ambulance: myProvs.filter((p) => p.category === "ambulance").length,
      rental_equipment: myProvs.filter((p) => p.category === "rental_equipment").length,
    };

    const eligibleRevenue = completedTxs.reduce((s, t) => s + t.eligibleRevenue, 0);
    const netRevenue = completedTxs.reduce((s, t) => s + t.netPlatformRevenue, 0);
    const grossTxValue = completedTxs.reduce((s, t) => s + t.transactionValue, 0);

    return {
      employee: emp,
      managerName: emp.managerId ? empById.get(emp.managerId)?.name ?? "—" : "AUSTY Super Admin",
      counts: byCat,
      totalProviders: myProvs.length,
      verifiedProviders: myProvs.filter((p) => p.verified).length,
      activeProviders: myProvs.filter((p) => p.active).length,
      successfulTransactions: completedTxs.length,
      grossTxValue,
      netRevenue,
      eligibleRevenue,
      epsScore: inc?.epsScore ?? 0,
      epsBreakdown: inc?.epsBreakdown ?? { onboarding: 0, revenue: 0, transactions: 0, retention: 0, quality: 0 },
      achievementPercent: inc?.achievementPercent ?? 0,
      incentiveAmount: (inc?.incentiveAmount ?? 0) + (inc?.teamManagementBonus ?? 0),
      baseIncentive: inc?.incentiveAmount ?? 0,
      teamBonus: inc?.teamManagementBonus ?? 0,
      incentiveStatus: inc?.status ?? "calculated",
      incentiveRow: inc ?? null,
    };
  });

  // Sort rankings by EPS score desc, then eligible revenue desc
  const rankings = [...employeePerformance].sort((a, b) => b.epsScore - a.epsScore || b.eligibleRevenue - a.eligibleRevenue);

  // State-wise tracking
  const statesSet = new Set([...scopedProvs.map((p) => p.state), ...scopedEmps.map((e) => e.assignedState)]);
  const stateBreakdown = [...statesSet].sort().map((state) => {
    const sp = scopedProvs.filter((p) => p.state === state);
    const stx = scopedTxs.filter((t) => t.state === state && t.status === "completed");
    return {
      state,
      doctors: sp.filter((p) => p.category === "doctor").length,
      pharmacies: sp.filter((p) => p.category === "pharmacy").length,
      labs: sp.filter((p) => p.category === "lab").length,
      hospitals: sp.filter((p) => p.category === "hospital").length,
      ambulances: sp.filter((p) => p.category === "ambulance").length,
      rentals: sp.filter((p) => p.category === "rental_equipment").length,
      totalProviders: sp.length,
      transactions: stx.length,
      netRevenue: stx.reduce((s, t) => s + t.netPlatformRevenue, 0),
      eligibleRevenue: stx.reduce((s, t) => s + t.eligibleRevenue, 0),
    };
  });

  // 7 Revenue Categories breakdown
  const revenueCategories = (Object.keys(AUSTY_REVENUE_LABELS) as AustyRevenueCategory[]).map((cat) => {
    const ctx = scopedTxs.filter((t) => t.category === cat);
    const completed = ctx.filter((t) => t.status === "completed");
    const cancelled = ctx.filter((t) => t.status === "cancelled");
    const refunded = ctx.filter((t) => t.status === "refunded");

    const totalTransactionValue = ctx.reduce((s, t) => s + t.transactionValue, 0);
    const grossPlatformRevenue = ctx.reduce((s, t) => s + t.grossPlatformRevenue, 0);
    const platformServiceFee = ctx.reduce((s, t) => s + t.platformServiceFee, 0);
    const discounts = ctx.reduce((s, t) => s + t.discountAmount, 0);
    const refunds = ctx.reduce((s, t) => s + t.refundAmount, 0);
    const cancelledValue = cancelled.reduce((s, t) => s + t.transactionValue, 0);
    const netPlatformRevenue = completed.reduce((s, t) => s + t.netPlatformRevenue, 0) + refunded.reduce((s, t) => s + t.netPlatformRevenue, 0);
    const eligibleRevenue = completed.reduce((s, t) => s + t.eligibleRevenue, 0);

    return {
      category: cat,
      label: AUSTY_REVENUE_LABELS[cat],
      count: ctx.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      totalTransactionValue,
      grossPlatformRevenue,
      platformServiceFee,
      discounts,
      refunds,
      cancelledValue,
      netPlatformRevenue,
      eligibleRevenue,
    };
  });

  // Team Leader performance summaries
  const teamLeaders = allEmps.filter((e) => e.role === "team_leader" || e.role === "state_manager");
  const teamPerformance = teamLeaders.map((tl) => {
    const members = employeePerformance.filter((ep) => ep.employee.managerId === tl.id);
    const activeCount = members.filter((m) => m.employee.status === "active").length;
    const inactiveCount = members.length - activeCount;
    const teamRevenue = members.reduce((s, m) => s + m.eligibleRevenue, 0);
    const teamTarget = members.reduce((s, m) => s + m.employee.monthlyTargetRevenue, 0);
    const teamOnboarding = members.reduce((s, m) => s + m.totalProviders, 0);
    const teamOnboardingTarget = members.reduce((s, m) => s + m.employee.monthlyTargetProviders, 0);
    const achievementPct = teamTarget > 0 ? Math.round((teamRevenue / teamTarget) * 1000) / 10 : 0;

    return {
      leader: tl,
      totalAssigned: members.length,
      activeCount,
      inactiveCount,
      teamRevenue,
      teamTarget,
      teamOnboarding,
      teamOnboardingTarget,
      achievementPct,
      members: [...members].sort((a, b) => b.epsScore - a.epsScore),
    };
  });

  const scopedEmpIds = new Set(scopedEmps.map((e) => e.id));
  const scopedIncs = allIncs.filter((i) => scopedEmpIds.has(i.employeeId));
  const totalIncentives = scopedIncs.reduce((s, i) => s + i.incentiveAmount + i.teamManagementBonus, 0);
  const paidIncentives = scopedIncs
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.incentiveAmount + i.teamManagementBonus, 0);
  const pendingIncentives = scopedIncs
    .filter((i) => i.status !== "paid" && i.status !== "rejected")
    .reduce((s, i) => s + i.incentiveAmount + i.teamManagementBonus, 0);

  const summary = {
    totalEmployees: scopedEmps.length,
    activeEmployees: scopedEmps.filter((e) => e.status === "active").length,
    totalProviders: scopedProvs.length,
    totalDoctors: scopedProvs.filter((p) => p.category === "doctor").length,
    totalPharmacies: scopedProvs.filter((p) => p.category === "pharmacy").length,
    totalLabs: scopedProvs.filter((p) => p.category === "lab").length,
    totalHospitals: scopedProvs.filter((p) => p.category === "hospital").length,
    totalAmbulances: scopedProvs.filter((p) => p.category === "ambulance").length,
    totalRentals: scopedProvs.filter((p) => p.category === "rental_equipment").length,
    totalTransactionValue: revenueCategories.reduce((s, c) => s + c.totalTransactionValue, 0),
    grossPlatformRevenue: revenueCategories.reduce((s, c) => s + c.grossPlatformRevenue, 0),
    netPlatformRevenue: revenueCategories.reduce((s, c) => s + c.netPlatformRevenue, 0),
    eligibleRevenue: revenueCategories.reduce((s, c) => s + c.eligibleRevenue, 0),
    totalIncentives,
    pendingIncentives,
    paidIncentives,
  };

  return {
    config: cfg,
    summary,
    employeePerformance,
    rankings,
    top10Employees: rankings.slice(0, 10),
    stateBreakdown,
    revenueCategories,
    teamPerformance,
    providers: scopedProvs,
    transactions: scopedTxs,
    activityLogs: allLogs.filter((l) => scopedEmpIds.has(l.employeeId)),
    allStates: [...new Set(allEmps.map((e) => e.assignedState))].sort(),
    allDistricts: [...new Set(allEmps.map((e) => e.assignedDistrict))].sort(),
    allCities: [...new Set(allEmps.map((e) => e.assignedCity))].sort(),
    allEmployeesList: allEmps,
  };
}
