import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { caseStudies, exams, questions, results, users } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getAustyDashboardData } from "@/lib/austy";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const entity = url.searchParams.get("entity") ?? "questions";
  const format = url.searchParams.get("format") ?? "csv";

  let rows: Record<string, unknown>[] = [];
  let filename = `qrexq-${entity}`;

  if (entity === "template") {
    rows = [
      {
        exam: "nclex-rn",
        category: "Management of Care",
        subject: "Leadership and Management",
        system: "Cardiovascular",
        topic: "Prioritization",
        type: "mcq",
        difficulty: "moderate",
        stem: "Which client should the nurse assess first after change-of-shift report?",
        optA: "Client with acute stridor and restlessness",
        optB: "Client with stable chronic hypertension",
        optC: "Client requesting routine PRN stool softener",
        optD: "Client awaiting discharge education",
        correct: "a",
        rationale: "Acute stridor indicates airway compromise and takes highest priority under the ABC framework.",
      },
    ];
  } else if (entity === "questions" || entity === "approved") {
    const qRows = await db
      .select()
      .from(questions)
      .where(entity === "approved" ? eq(questions.status, "published") : undefined)
      .orderBy(asc(questions.id))
      .limit(1000);
    rows = qRows.map((q) => ({
      code: q.code,
      examId: q.examId,
      type: q.type,
      difficulty: q.difficulty,
      status: q.status,
      source: q.source,
      stem: q.stem,
      rationale: q.rationale,
      content: JSON.stringify(q.content),
      answer: JSON.stringify(q.answer),
    }));
  } else if (entity === "cases") {
    const cRows = await db.select().from(caseStudies).orderBy(asc(caseStudies.id));
    rows = cRows.map((c) => ({
      id: c.id,
      examId: c.examId,
      title: c.title,
      difficulty: c.difficulty,
      status: c.status,
      summary: c.summary,
    }));
  } else if (entity === "results") {
    const rRows = await db.select().from(results).orderBy(desc(results.completedAt)).limit(500);
    rows = rRows.map((r) => ({
      id: r.id,
      testId: r.testId,
      examId: r.examId,
      total: r.total,
      correct: r.correct,
      incorrect: r.incorrect,
      unanswered: r.unanswered,
      percent: Math.round(r.percent * 10) / 10,
      totalTimeSec: r.totalTimeSec,
      completedAt: r.completedAt.toISOString(),
    }));
  } else if (entity.startsWith("austy_")) {
    const austy = await getAustyDashboardData({
      state: url.searchParams.get("state") || undefined,
      district: url.searchParams.get("district") || undefined,
    });
    filename = entity;
    if (entity === "austy_state" || entity === "austy_all_india" || entity === "austy_district") {
      rows = austy.stateBreakdown.map((s) => ({
        State: s.state,
        Doctors: s.doctors,
        Pharmacies: s.pharmacies,
        Labs: s.labs,
        Hospitals: s.hospitals,
        Ambulances: s.ambulances,
        RentalVendors: s.rentals,
        TotalProviders: s.totalProviders,
        Transactions: s.transactions,
        NetPlatformRevenueINR: s.netRevenue,
        EligibleRevenueINR: s.eligibleRevenue,
      }));
    } else if (entity === "austy_employees" || entity === "austy_annual") {
      rows = austy.rankings.map((r, idx) => ({
        Rank: idx + 1,
        EmployeeID: r.employee.employeeCode,
        ReferenceID: r.employee.referenceId,
        Name: r.employee.name,
        Designation: r.employee.designation,
        State: r.employee.assignedState,
        District: r.employee.assignedDistrict,
        City: r.employee.assignedCity,
        DoctorsAdded: r.counts.doctor,
        PharmaciesAdded: r.counts.pharmacy,
        LabsAdded: r.counts.lab,
        HospitalsAdded: r.counts.hospital,
        AmbulancesAdded: r.counts.ambulance,
        RentalsAdded: r.counts.rental_equipment,
        TotalProviders: r.totalProviders,
        VerifiedProviders: r.verifiedProviders,
        ActiveProviders: r.activeProviders,
        SuccessfulTransactions: r.successfulTransactions,
        MonthlyTargetINR: r.employee.monthlyTargetRevenue,
        EligibleRevenueINR: r.eligibleRevenue,
        TargetAchievementPct: r.achievementPercent,
        EPSScore100: r.epsScore,
        IncentiveINR: r.incentiveAmount,
        IncentiveStatus: r.incentiveStatus,
      }));
    } else if (entity === "austy_revenue") {
      rows = austy.revenueCategories.map((c) => ({
        BusinessCategory: c.label,
        TotalTransactions: c.count,
        CompletedTransactions: c.completedCount,
        CancelledTransactions: c.cancelledCount,
        TotalTransactionValueINR: c.totalTransactionValue,
        GrossPlatformRevenueINR: c.grossPlatformRevenue,
        PlatformServiceFeeINR: c.platformServiceFee,
        DiscountsINR: c.discounts,
        RefundsINR: c.refunds,
        NetPlatformRevenueINR: c.netPlatformRevenue,
        EligibleIncentiveRevenueINR: c.eligibleRevenue,
      }));
    } else if (entity === "austy_incentives") {
      rows = austy.rankings.map((r) => ({
        Period: "2026-11",
        EmployeeID: r.employee.employeeCode,
        ReferenceID: r.employee.referenceId,
        EmployeeName: r.employee.name,
        State: r.employee.assignedState,
        TargetINR: r.employee.monthlyTargetRevenue,
        EligibleRevenueINR: r.eligibleRevenue,
        AchievementPct: r.achievementPercent,
        EPSScore: r.epsScore,
        BaseIncentiveINR: r.baseIncentive,
        TeamManagementBonusINR: r.teamBonus,
        TotalIncentiveINR: r.incentiveAmount,
        ApprovalStatus: r.incentiveStatus,
        TransactionReference: r.incentiveRow?.transactionReference ?? "Pending",
      }));
    } else if (entity === "austy_teams") {
      rows = austy.teamPerformance.map((tp) => ({
        TeamLeader: tp.leader.name,
        ReferenceID: tp.leader.referenceId,
        State: tp.leader.assignedState,
        TotalAssignedEmployees: tp.totalAssigned,
        ActiveEmployees: tp.activeCount,
        InactiveEmployees: tp.inactiveCount,
        TeamOnboarding: tp.teamOnboarding,
        TeamEligibleRevenueINR: tp.teamRevenue,
        TeamTargetINR: tp.teamTarget,
        TeamAchievementPct: tp.achievementPct,
      }));
    }
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.json"`,
      },
    });
  }

  if (format === "xlsx") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
