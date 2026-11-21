import Link from "next/link";
import {
  Activity,
  Award,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Filter,
  IndianRupee,
  MapPin,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  AUSTY_PROVIDER_LABELS,
  AUSTY_REVENUE_LABELS,
  AUSTY_ROLE_LABELS,
  getAustyDashboardData,
  type AustyFilters,
} from "@/lib/austy";
import {
  AUSTY_INCENTIVE_STATUSES,
  AUSTY_PROVIDER_CATEGORIES,
  AUSTY_REVENUE_CATEGORIES,
  AUSTY_ROLES,
} from "@/lib/db/schema";
import {
  createAustyEmployeeAction,
  onboardAustyProviderAction,
  recordAustyTransactionAction,
  updateAustyConfigAction,
  updateAustyIncentiveWorkflowAction,
} from "./actions";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default async function AustyHealthcareAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    state?: string;
    district?: string;
    city?: string;
    fromDate?: string;
    toDate?: string;
    roleView?: AustyFilters["roleView"];
    employeeId?: string;
  }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();

  const defaultRoleView: AustyFilters["roleView"] =
    sp.roleView ?? (user.role === "admin" ? "super_admin" : "employee");

  const data = await getAustyDashboardData({
    state: sp.state || undefined,
    district: sp.district || undefined,
    city: sp.city || undefined,
    fromDate: sp.fromDate || undefined,
    toDate: sp.toDate || undefined,
    roleView: defaultRoleView,
    employeeId: sp.employeeId ? Number(sp.employeeId) : defaultRoleView === "employee" ? 6 : 1,
  });

  const isEmployeeOnlyView = defaultRoleView === "employee";
  const personalPerf = data.employeePerformance[0] ?? data.rankings[0];

  return (
    <div className="space-y-8">
      {/* Enterprise Header Banner */}
      <section
        className="rounded-2xl p-6 sm:p-8 text-white shadow-lg space-y-5"
        style={{ background: "var(--hero)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Building2 className="h-3.5 w-3.5" />
              AUSTY Health Care Private Limited — Enterprise Business &amp; Revenue ERP
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Employee Performance, Business Development &amp; Revenue Analytics
            </h1>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Pan-India state, district, and city business tracking, provider onboarding attribution, 100-point Employee Performance Score (EPS), 7-category revenue ledger, Team Leader supervision, and 6-stage incentive payment workflow.
            </p>
          </div>

          {/* Role-Based Access Control (RBAC) View Switcher */}
          <div className="rounded-2xl bg-white/12 p-4 backdrop-blur space-y-2 min-w-[290px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              Active Access Control Scope (RBAC)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["super_admin", "Super Admin (All India)"],
                  ["state_manager", "State Manager"],
                  ["district_manager", "District Manager"],
                  ["team_leader", "Team Leader"],
                  ["employee", "My Employee Portal"],
                ] as const
              ).map(([rv, label]) => (
                <Link
                  key={rv}
                  href={`/austy?roleView=${rv}${rv === "employee" ? "&employeeId=6" : rv === "team_leader" ? "&employeeId=4" : rv === "district_manager" ? "&employeeId=3" : "&employeeId=1"}`}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    defaultRoleView === rv
                      ? "bg-white text-slate-900 shadow"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Statutory & Business Model Compliance Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-4 border-t border-white/15 text-[11px] text-white/90">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>100% Ownership Retained by AUSTY Health Care Pvt. Ltd. (No Equity Shares)</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>Zero Recruitment-Based Commission or Multi-Level Attribution</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>Zero Joining Fee or Mandatory Employee Investment</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>Incentives Based Strictly on Approved Eligible Revenue Formula</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>Unique Reference ID Attribution &amp; Duplicate Registration Lock</span>
          </div>
        </div>
      </section>

      {/* SECTION 10: PERSONAL EMPLOYEE DASHBOARD (Shown prominently when in Employee View, or as an inspectable card) */}
      {personalPerf && (
        <section className="panel panel-pad space-y-5 border-2 border-accent/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="chip bg-accent-subtle text-accent font-bold">
                  Section 10 · Personal Employee Dashboard
                </span>
                <span className="chip font-mono font-bold">
                  {personalPerf.employee.employeeCode}
                </span>
                <span className="chip bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                  Ref: {personalPerf.employee.referenceId}
                </span>
              </div>
              <h2 className="text-xl font-bold mt-1.5">
                {personalPerf.employee.name} — {personalPerf.employee.designation}
              </h2>
              <p className="text-xs muted">
                Assigned Territory: <strong>{personalPerf.employee.assignedCity}</strong>, District{" "}
                <strong>{personalPerf.employee.assignedDistrict}</strong>,{" "}
                <strong>{personalPerf.employee.assignedState}</strong> · Reporting Manager:{" "}
                <strong>{personalPerf.managerName}</strong> · Joined {personalPerf.employee.joiningDate}
              </p>
            </div>

            {/* Switch employee to inspect personal dashboard */}
            {!isEmployeeOnlyView && (
              <form method="get" action="/austy" className="flex items-center gap-2 text-xs">
                <input type="hidden" name="roleView" value={defaultRoleView} />
                <select
                  name="employeeId"
                  defaultValue={personalPerf.employee.id}
                  aria-label="Inspect employee profile"
                  className="field py-1.5 text-xs"
                >
                  {data.allEmployeesList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.referenceId})
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-secondary btn-sm">
                  View Profile
                </button>
              </form>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">My Total Providers</div>
              <div className="text-lg font-bold mt-0.5">{personalPerf.totalProviders}</div>
              <div className="text-[10px] muted">{personalPerf.activeProviders} active</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">My Total Business</div>
              <div className="text-lg font-bold mt-0.5">{inr(personalPerf.grossTxValue)}</div>
              <div className="text-[10px] muted">Gross transaction value</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">Eligible Revenue</div>
              <div className="text-lg font-bold text-accent mt-0.5">{inr(personalPerf.eligibleRevenue)}</div>
              <div className="text-[10px] muted">Net: {inr(personalPerf.netRevenue)}</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">Successful Tx</div>
              <div className="text-lg font-bold mt-0.5">{personalPerf.successfulTransactions}</div>
              <div className="text-[10px] muted">Verified orders</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">Monthly Target</div>
              <div className="text-lg font-bold mt-0.5">{inr(personalPerf.employee.monthlyTargetRevenue)}</div>
              <div className="text-[10px] muted">{personalPerf.employee.monthlyTargetProviders} providers</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">Target Achievement</div>
              <div className="text-lg font-bold text-emerald-600 mt-0.5">{personalPerf.achievementPercent}%</div>
              <div className="text-[10px] muted">Monthly weighted</div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">My EPS Score</div>
              <div className="text-lg font-bold text-accent mt-0.5">{personalPerf.epsScore} / 100</div>
              <div className="text-[10px] muted">
                O:{personalPerf.epsBreakdown.onboarding} R:{personalPerf.epsBreakdown.revenue} T:{personalPerf.epsBreakdown.transactions}
              </div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="muted">My Incentive</div>
              <div className="text-lg font-bold text-emerald-600 mt-0.5">{inr(personalPerf.incentiveAmount)}</div>
              <div className="text-[10px] uppercase font-semibold muted">{personalPerf.incentiveStatus}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-xs">
            <div className="muted">
              Confidentiality Lock: Employees only access their personal metrics and territory records. Other employees&apos; financial payouts are restricted to Super Admin.
            </div>
            <div className="flex items-center gap-2">
              <a href="/api/admin/export?entity=austy_employees&format=csv" className="btn btn-secondary btn-sm">
                <Download className="h-3.5 w-3.5" />
                My Monthly Report (CSV)
              </a>
              <a href="/api/admin/export?entity=austy_annual&format=xlsx" className="btn btn-secondary btn-sm">
                My Yearly Report (Excel)
              </a>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 9: SUPER ADMIN KPI DASHBOARD */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Section 9 · Super Admin Executive KPI Overview
            </h2>
            <p className="text-xs muted">
              Real-time database aggregations across all Indian states, provider verticals, and revenue categories.
            </p>
          </div>

          {/* State / District / City / Date Filters */}
          <form method="get" action="/austy" className="flex flex-wrap items-center gap-2 text-xs">
            <input type="hidden" name="roleView" value={defaultRoleView} />
            <select name="state" defaultValue={sp.state ?? ""} aria-label="Filter by state" className="field py-1.5 text-xs w-36">
              <option value="">All India States</option>
              {data.allStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select name="district" defaultValue={sp.district ?? ""} aria-label="Filter by district" className="field py-1.5 text-xs w-36">
              <option value="">All Districts</option>
              {data.allDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select name="city" defaultValue={sp.city ?? ""} aria-label="Filter by city" className="field py-1.5 text-xs w-32">
              <option value="">All Cities</option>
              {data.allCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input type="date" name="fromDate" defaultValue={sp.fromDate ?? ""} aria-label="From date" className="field py-1 text-xs w-34" />
            <input type="date" name="toDate" defaultValue={sp.toDate ?? ""} aria-label="To date" className="field py-1 text-xs w-34" />
            <button type="submit" className="btn btn-primary btn-sm">
              <Filter className="h-3.5 w-3.5" />
              Apply
            </button>
            {(sp.state || sp.district || sp.city || sp.fromDate || sp.toDate) && (
              <Link href="/austy" className="btn btn-secondary btn-sm">
                Reset
              </Link>
            )}
          </form>
        </div>

        {/* 14 Executive KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Total / Active Employees</div>
            <div className="text-xl font-bold">
              {data.summary.totalEmployees}{" "}
              <span className="text-xs font-normal text-emerald-600">({data.summary.activeEmployees} active)</span>
            </div>
            <div className="text-[11px] muted">5 hierarchy levels</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Providers Onboarded</div>
            <div className="text-xl font-bold text-accent">{data.summary.totalProviders}</div>
            <div className="text-[11px] muted">
              {data.summary.totalDoctors} Dr · {data.summary.totalPharmacies} Pharm
            </div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Labs &amp; Hospitals</div>
            <div className="text-xl font-bold">
              {data.summary.totalLabs} <span className="text-sm font-normal muted">/</span> {data.summary.totalHospitals}
            </div>
            <div className="text-[11px] muted">
              {data.summary.totalAmbulances} Amb · {data.summary.totalRentals} Rental
            </div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Total Transaction Value</div>
            <div className="text-xl font-bold">{inr(data.summary.totalTransactionValue)}</div>
            <div className="text-[11px] muted">Gross Rev: {inr(data.summary.grossPlatformRevenue)}</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Monthly Net Revenue</div>
            <div className="text-xl font-bold text-emerald-600">{inr(data.summary.netPlatformRevenue)}</div>
            <div className="text-[11px] muted">Eligible: {inr(data.summary.eligibleRevenue)}</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Total Incentives</div>
            <div className="text-xl font-bold text-accent">{inr(data.summary.totalIncentives)}</div>
            <div className="text-[11px] muted">Paid: {inr(data.summary.paidIncentives)}</div>
          </div>

          <div className="panel p-4 space-y-1">
            <div className="text-xs muted">Pending Incentives</div>
            <div className="text-xl font-bold text-amber-600">{inr(data.summary.pendingIncentives)}</div>
            <div className="text-[11px] muted">Subject to verification</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STATE-WISE BUSINESS TRACKING */}
      <section className="panel panel-pad space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="h-section flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Section 3 · State-Wise Business Expansion &amp; Provider Onboarding Across India
            </h2>
            <p className="text-xs muted">
              Doctors, pharmacies, diagnostic laboratories, hospitals, ambulance providers, rental equipment vendors, transactions, and net platform revenue by state.
            </p>
          </div>
          <a href="/api/admin/export?entity=austy_state&format=xlsx" className="btn btn-secondary btn-sm">
            <Download className="h-3.5 w-3.5" />
            Export State Report (Excel)
          </a>
        </div>

        <div className="table-wrapper" tabIndex={0} role="region" aria-label="State-wise business tracking">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>State</th>
                <th>Doctors</th>
                <th>Pharmacies</th>
                <th>Diagnostic Labs</th>
                <th>Hospitals</th>
                <th>Ambulances</th>
                <th>Equipment Rentals</th>
                <th>Total Providers</th>
                <th>Transactions</th>
                <th>Net Revenue</th>
                <th>Eligible Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.stateBreakdown.map((s) => (
                <tr key={s.state}>
                  <th className="font-bold text-left">{s.state}</th>
                  <td>{s.doctors}</td>
                  <td>{s.pharmacies}</td>
                  <td>{s.labs}</td>
                  <td>{s.hospitals}</td>
                  <td>{s.ambulances}</td>
                  <td>{s.rentals}</td>
                  <td className="font-bold text-accent">{s.totalProviders}</td>
                  <td>{s.transactions}</td>
                  <td className="font-semibold">{inr(s.netRevenue)}</td>
                  <td className="font-bold text-emerald-600">{inr(s.eligibleRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4, 5, 6 & 14: EMPLOYEE-WISE PERFORMANCE, EPS SCORE (100 PT), TOP 10 RANKINGS & INCENTIVE WORKFLOW */}
      <section className="panel panel-pad space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="h-section flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              Sections 4, 5, 6 &amp; 14 · Employee Performance Score (EPS / 100), Rankings &amp; Incentive Approval Workflow
            </h2>
            <p className="text-xs muted">
              Tracked by unique Employee Reference ID (`AREF-IN-*`). EPS Weights: Onboarding ({data.config.epsWeights.onboarding}) + Revenue ({data.config.epsWeights.revenue}) + Transactions ({data.config.epsWeights.transactions}) + Activation/Retention ({data.config.epsWeights.retention}) + Quality ({data.config.epsWeights.quality}) = 100.
            </p>
          </div>
          <a href="/api/admin/export?entity=austy_employees&format=xlsx" className="btn btn-secondary btn-sm">
            <Download className="h-3.5 w-3.5" />
            Export Rankings (Excel)
          </a>
        </div>

        <div className="table-wrapper" tabIndex={0} role="region" aria-label="Employee performance rankings and incentive approval">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee &amp; Reference ID</th>
                <th>Territory &amp; Role</th>
                <th>Providers (Dr/Ph/Lab/Hosp/Amb/Rent)</th>
                <th>Verified / Active</th>
                <th>Tx</th>
                <th>Eligible Rev / Target</th>
                <th>Target %</th>
                <th>EPS (0–100)</th>
                <th>Incentive (INR)</th>
                <th>Payment Workflow Status</th>
              </tr>
            </thead>
            <tbody>
              {data.rankings.map((r, idx) => (
                <tr key={r.employee.id}>
                  <th className="font-mono font-bold text-left">#{idx + 1}</th>
                  <td>
                    <div className="font-bold">{r.employee.name}</div>
                    <div className="font-mono text-[11px] text-accent">
                      {r.employee.employeeCode} · {r.employee.referenceId}
                    </div>
                    <div className="text-[11px] muted">{r.employee.mobile}</div>
                  </td>
                  <td>
                    <div className="font-medium">{r.employee.assignedCity}, {r.employee.assignedState}</div>
                    <div className="text-[11px] muted">
                      {AUSTY_ROLE_LABELS[r.employee.role]} · Mgr: {r.managerName}
                    </div>
                  </td>
                  <td className="font-mono">
                    <strong>{r.totalProviders}</strong> ({r.counts.doctor}/{r.counts.pharmacy}/{r.counts.lab}/{r.counts.hospital}/{r.counts.ambulance}/{r.counts.rental_equipment})
                  </td>
                  <td>
                    {r.verifiedProviders}V / {r.activeProviders}A
                  </td>
                  <td className="font-bold">{r.successfulTransactions}</td>
                  <td>
                    <div className="font-bold text-emerald-600">{inr(r.eligibleRevenue)}</div>
                    <div className="text-[11px] muted">Target: {inr(r.employee.monthlyTargetRevenue)}</div>
                  </td>
                  <td>
                    <span
                      className={`chip font-bold ${
                        r.achievementPercent >= 90
                          ? "bg-emerald-500/15 text-emerald-700"
                          : r.achievementPercent >= 50
                            ? "bg-amber-500/15 text-amber-700"
                            : "bg-rose-500/15 text-rose-700"
                      }`}
                    >
                      {r.achievementPercent}%
                    </span>
                  </td>
                  <td>
                    <div className="font-bold text-accent text-sm">{r.epsScore}</div>
                    <div className="text-[10px] font-mono muted">
                      {r.epsBreakdown.onboarding}+{r.epsBreakdown.revenue}+{r.epsBreakdown.transactions}+{r.epsBreakdown.retention}+{r.epsBreakdown.quality}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold">{inr(r.incentiveAmount)}</div>
                    {r.teamBonus > 0 && (
                      <div className="text-[10px] text-emerald-600">Incl. {inr(r.teamBonus)} Mgmt Work</div>
                    )}
                  </td>
                  <td>
                    {r.incentiveRow && !isEmployeeOnlyView ? (
                      <form action={updateAustyIncentiveWorkflowAction} className="flex items-center gap-1.5">
                        <input type="hidden" name="incentiveId" value={r.incentiveRow.id} />
                        <select
                          name="status"
                          defaultValue={r.incentiveStatus}
                          aria-label={`Incentive status for ${r.employee.name}`}
                          className="field py-1 px-2 text-[11px] w-36"
                        >
                          {AUSTY_INCENTIVE_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace("_", " ").toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="btn btn-secondary btn-sm px-2">
                          Save
                        </button>
                      </form>
                    ) : (
                      <span className="chip uppercase text-[10px]">{r.incentiveStatus}</span>
                    )}
                    {r.incentiveRow?.transactionReference && (
                      <div className="text-[10px] font-mono muted mt-0.5">
                        Ref: {r.incentiveRow.transactionReference}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 8: 7-CATEGORY REVENUE ANALYTICS */}
      <section className="panel panel-pad space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="h-section flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-accent" />
              Section 8 · 7-Category Healthcare Revenue Analytics Ledger
            </h2>
            <p className="text-xs muted">
              Separate tracking for Doctor Consultation, Pharmacy Orders, Diagnostic Lab Tests, CT/MRI Bookings, Ambulance Bookings, Hospital &amp; Surgery Services, and Rental Medical Equipment.
            </p>
          </div>
          <a href="/api/admin/export?entity=austy_revenue&format=xlsx" className="btn btn-secondary btn-sm">
            <Download className="h-3.5 w-3.5" />
            Export Revenue Ledger (Excel)
          </a>
        </div>

        <div className="table-wrapper" tabIndex={0} role="region" aria-label="7-category revenue analytics">
          <table className="table text-xs">
            <thead>
              <tr>
                <th>Business Category</th>
                <th>Total / Completed Tx</th>
                <th>Total Transaction Value</th>
                <th>Gross Platform Revenue</th>
                <th>Platform Service Fee</th>
                <th>Discounts</th>
                <th>Refunds</th>
                <th>Cancelled Tx</th>
                <th>Net Platform Revenue</th>
                <th>Approved Eligible Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.revenueCategories.map((c) => (
                <tr key={c.category}>
                  <th className="font-bold text-left">{c.label}</th>
                  <td>
                    {c.count} <span className="muted">({c.completedCount} ok)</span>
                  </td>
                  <td className="font-mono">{inr(c.totalTransactionValue)}</td>
                  <td className="font-mono">{inr(c.grossPlatformRevenue)}</td>
                  <td className="font-mono">{inr(c.platformServiceFee)}</td>
                  <td className="font-mono text-amber-600">{inr(c.discounts)}</td>
                  <td className="font-mono text-rose-600">{inr(c.refunds)}</td>
                  <td className="font-mono text-rose-600">
                    {c.cancelledCount} ({inr(c.cancelledValue)})
                  </td>
                  <td className="font-mono font-bold">{inr(c.netPlatformRevenue)}</td>
                  <td className="font-mono font-bold text-emerald-600">{inr(c.eligibleRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 7: TEAM LEADER PERFORMANCE DASHBOARD */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Section 7 · Team Leader Supervision &amp; Team Performance Dashboard
          </h2>
          <p className="text-xs muted">
            Team Leaders do not receive commission merely for recruiting or adding employees. Management bonuses require documented management supervision and ≥80% verified team target achievement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.teamPerformance.map((tp) => (
            <div key={tp.leader.id} className="panel panel-pad space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div>
                  <div className="font-bold text-sm">{tp.leader.name}</div>
                  <div className="muted">
                    {tp.leader.designation} · Ref: <span className="font-mono">{tp.leader.referenceId}</span>
                  </div>
                </div>
                <span className="chip bg-accent-subtle text-accent font-bold">
                  Team Target Achievement: {tp.achievementPct}%
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center rounded-xl bg-muted/50 p-2.5">
                <div>
                  <div className="font-bold text-sm">{tp.totalAssigned}</div>
                  <div className="text-[10px] muted">Assigned</div>
                </div>
                <div>
                  <div className="font-bold text-sm text-emerald-600">
                    {tp.activeCount} / {tp.inactiveCount}
                  </div>
                  <div className="text-[10px] muted">Active / Inactive</div>
                </div>
                <div>
                  <div className="font-bold text-sm">{tp.teamOnboarding}</div>
                  <div className="text-[10px] muted">Team Providers</div>
                </div>
                <div>
                  <div className="font-bold text-sm text-accent">{inr(tp.teamRevenue)}</div>
                  <div className="text-[10px] muted">Team Eligible Rev</div>
                </div>
              </div>

              {tp.members.length > 0 && (
                <div className="space-y-1">
                  <div className="font-semibold muted">Supervised Team Rankings:</div>
                  {tp.members.map((m, idx) => (
                    <div key={m.employee.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-2.5 py-1.5">
                      <span>
                        #{idx + 1} <strong>{m.employee.name}</strong> ({m.employee.assignedCity})
                      </span>
                      <span className="font-mono">
                        EPS <strong>{m.epsScore}</strong> · {inr(m.eligibleRevenue)} ({m.achievementPercent}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2, 4 & 5 OPERATIONS: ADD EMPLOYEE, ONBOARD PROVIDER (DUPLICATE-LOCKED), RECORD TRANSACTION & CUSTOMIZE EPS/SLABS */}
      {!isEmployeeOnlyView && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* 1. Add Employee Form */}
          <form action={createAustyEmployeeAction} className="panel panel-pad space-y-3 text-xs">
            <h3 className="h-section flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-accent" />
              Section 2 · Register New AUSTY Employee (Auto Reference ID)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input name="name" required placeholder="Full Name" className="field text-xs" />
              <input name="mobile" required placeholder="Mobile (+91 98...)" className="field text-xs" />
              <input name="email" type="email" required placeholder="Email Address" className="field text-xs" />
              <input name="designation" required placeholder="Designation (e.g. District Manager)" className="field text-xs" />
              <select name="role" defaultValue="bde" aria-label="Employee role" className="field text-xs">
                {AUSTY_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {AUSTY_ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
              <select name="managerId" aria-label="Reporting manager" className="field text-xs">
                <option value="">Reporting Manager (Super Admin)</option>
                {data.allEmployeesList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({AUSTY_ROLE_LABELS[e.role]})
                  </option>
                ))}
              </select>
              <input name="assignedState" required placeholder="Assigned State (e.g. Maharashtra)" className="field text-xs" />
              <input name="assignedDistrict" required placeholder="Assigned District (e.g. Nagpur)" className="field text-xs" />
              <input name="assignedCity" required placeholder="Assigned City (e.g. Nagpur)" className="field text-xs" />
              <input name="joiningDate" type="date" defaultValue="2026-11-21" className="field text-xs" />
              <input name="monthlyTargetRevenue" type="number" defaultValue={120000} placeholder="Monthly Target (INR)" className="field text-xs" />
              <input name="monthlyTargetProviders" type="number" defaultValue={12} placeholder="Monthly Provider Target" className="field text-xs" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-full">
              Generate Employee ID &amp; Reference ID
            </button>
          </form>

          {/* 2. Onboard Provider + Record Transaction */}
          <div className="space-y-4">
            <form action={onboardAustyProviderAction} className="panel panel-pad space-y-3 text-xs">
              <h3 className="h-section flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" />
                Section 4 · Onboard Healthcare Provider (Duplicate-Prevented)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input name="name" required placeholder="Provider / Hospital / Lab Name" className="field text-xs" />
                <input
                  name="registrationNumber"
                  required
                  placeholder="Unique Registration No. (e.g. MCI-2026-991)"
                  className="field text-xs font-mono"
                />
                <select name="category" defaultValue="doctor" aria-label="Provider category" className="field text-xs">
                  {AUSTY_PROVIDER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {AUSTY_PROVIDER_LABELS[c]}
                    </option>
                  ))}
                </select>
                <select name="employeeId" aria-label="Responsible onboarding employee" className="field text-xs">
                  {data.allEmployeesList.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.referenceId})
                    </option>
                  ))}
                </select>
                <input name="state" placeholder="State (defaults to employee territory)" className="field text-xs" />
                <input name="city" placeholder="City (defaults to employee territory)" className="field text-xs" />
              </div>
              <button type="submit" className="btn btn-secondary btn-sm w-full">
                Verify &amp; Attribute Provider to Employee Reference ID
              </button>
            </form>

            <form action={recordAustyTransactionAction} className="panel panel-pad space-y-3 text-xs">
              <h3 className="h-section flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Section 8 · Record Healthcare Platform Transaction
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select name="providerId" aria-label="Healthcare provider" className="field text-xs">
                  {data.providers.slice(0, 30).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.employeeReferenceId})
                    </option>
                  ))}
                </select>
                <select name="category" defaultValue="doctor_consultation" aria-label="Revenue category" className="field text-xs">
                  {AUSTY_REVENUE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {AUSTY_REVENUE_LABELS[c]}
                    </option>
                  ))}
                </select>
                <input
                  name="transactionValue"
                  type="number"
                  defaultValue={25000}
                  placeholder="Gross Customer Transaction Value (INR)"
                  className="field text-xs"
                />
                <select name="status" defaultValue="completed" aria-label="Transaction status" className="field text-xs">
                  <option value="completed">Completed (Eligible for EPS &amp; Incentive)</option>
                  <option value="refunded">Refunded (Deducted from Net Revenue)</option>
                  <option value="cancelled">Cancelled (Zero Eligible Attribution)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-secondary btn-sm w-full">
                Post Transaction &amp; Recalculate EPS + Incentives
              </button>
            </form>
          </div>
        </section>
      )}

      {/* SECTION 5 & 6: SUPER ADMIN EPS SCORING WEIGHTS & INCENTIVE SLABS CUSTOMIZER */}
      {!isEmployeeOnlyView && (
        <section className="panel panel-pad space-y-4">
          <h2 className="h-section">
            Sections 5 &amp; 6 · Super Admin EPS Weighting (Max 100) &amp; Monthly Incentive Slabs Configuration
          </h2>
          <form action={updateAustyConfigAction} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2.5">
              <div className="font-bold text-accent uppercase tracking-wider">
                1. Customize EPS Scoring Weights (Default 30 / 30 / 20 / 10 / 10 = 100)
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="block text-[11px] muted mb-1">Onboarding</label>
                  <input
                    name="w_onboarding"
                    type="number"
                    defaultValue={data.config.epsWeights.onboarding}
                    className="field text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">Revenue</label>
                  <input
                    name="w_revenue"
                    type="number"
                    defaultValue={data.config.epsWeights.revenue}
                    className="field text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">Transactions</label>
                  <input
                    name="w_transactions"
                    type="number"
                    defaultValue={data.config.epsWeights.transactions}
                    className="field text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">Retention</label>
                  <input
                    name="w_retention"
                    type="number"
                    defaultValue={data.config.epsWeights.retention}
                    className="field text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">Quality</label>
                  <input
                    name="w_quality"
                    type="number"
                    defaultValue={data.config.epsWeights.quality}
                    className="field text-xs font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="font-bold text-accent uppercase tracking-wider">
                2. Customize Monthly Target Achievement Incentive Slabs (INR)
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] muted mb-1">50–74% Slab</label>
                  <input
                    name="slab_50"
                    type="number"
                    defaultValue={data.config.slabs[1]?.amount ?? 1000}
                    className="field text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">75–89% Slab</label>
                  <input
                    name="slab_75"
                    type="number"
                    defaultValue={data.config.slabs[2]?.amount ?? 2500}
                    className="field text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">90–99% Slab</label>
                  <input
                    name="slab_90"
                    type="number"
                    defaultValue={data.config.slabs[3]?.amount ?? 4000}
                    className="field text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] muted mb-1">100%+ Slab</label>
                  <input
                    name="slab_100"
                    type="number"
                    defaultValue={data.config.slabs[4]?.amount ?? 6000}
                    className="field text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-end">
              <button type="submit" className="btn btn-primary btn-sm">
                Save Weights &amp; Slabs and Recalculate All Employee Scores
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SECTION 11 & 12: ALL 8 ENTERPRISE REPORTS EXPORT & COMPLETE ACTIVITY AUDIT LOG */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="panel panel-pad lg:col-span-7 space-y-4">
          <div>
            <h2 className="h-section flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-accent" />
              Section 11 · Enterprise Reports &amp; Multi-Format Download Center (Excel, CSV, Print/PDF)
            </h2>
            <p className="text-xs muted">
              Download any of the 8 required AUSTY Health Care business, employee, incentive, and team reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {(
              [
                ["austy_all_india", "1. All India Business Report"],
                ["austy_state", "2. State-Wise Business Report"],
                ["austy_district", "3. District-Wise Business Report"],
                ["austy_employees", "4. Employee-Wise Performance Report"],
                ["austy_revenue", "5. Revenue Generation Report"],
                ["austy_incentives", "6. Monthly Incentive Report"],
                ["austy_annual", "7. Annual Performance Report"],
                ["austy_teams", "8. Team Performance Report"],
              ] as const
            ).map(([entity, title]) => (
              <div key={entity} className="rounded-xl border border-border p-3 flex items-center justify-between gap-2">
                <span className="font-semibold">{title}</span>
                <div className="flex items-center gap-1">
                  <a href={`/api/admin/export?entity=${entity}&format=xlsx`} className="btn btn-secondary btn-sm px-2">
                    Excel
                  </a>
                  <a href={`/api/admin/export?entity=${entity}&format=csv`} className="btn btn-secondary btn-sm px-2">
                    CSV
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel panel-pad lg:col-span-5 space-y-3">
          <h2 className="h-section flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" />
            Section 12 · Employee Activity &amp; Attribution Audit Log
          </h2>
          <div className="divide-y divide-border text-xs max-h-96 overflow-y-auto">
            {data.activityLogs.map((log) => (
              <div key={log.id} className="py-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-accent">{log.employeeReferenceId}</span>
                  <span className="chip text-[10px] uppercase">{log.action.replace("_", " ")}</span>
                </div>
                <p className="leading-snug">{log.description}</p>
                <div className="flex items-center justify-between text-[11px] muted">
                  <span>
                    {log.state} {log.transactionCode ? `· Tx: ${log.transactionCode}` : ""}
                  </span>
                  <span>{log.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
