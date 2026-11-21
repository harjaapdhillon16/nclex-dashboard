"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Building2,
  Download,
  FileSpreadsheet,
  Filter,
  IndianRupee,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import type { getAustyDashboardData } from "@/lib/austy";
import {
  AUSTY_INCENTIVE_STATUSES,
  AUSTY_PROVIDER_CATEGORIES,
  AUSTY_REVENUE_CATEGORIES,
  AUSTY_ROLES,
  type AustyProviderCategory,
  type AustyRevenueCategory,
  type AustyRole,
} from "@/lib/db/schema";
import {
  createAustyEmployeeAction,
  onboardAustyProviderAction,
  recordAustyTransactionAction,
  updateAustyConfigAction,
  updateAustyIncentiveWorkflowAction,
} from "./actions";

type DashboardData = Awaited<ReturnType<typeof getAustyDashboardData>>;

const ROLE_LABELS: Record<AustyRole, string> = {
  state_manager: "State Business Manager",
  district_manager: "District Business Manager",
  team_leader: "Team Leader",
  bde: "Business Development Executive",
  field_executive: "Field Executive",
};

const PROVIDER_LABELS: Record<AustyProviderCategory, string> = {
  doctor: "Doctors",
  pharmacy: "Pharmacies",
  lab: "Diagnostic Laboratories",
  hospital: "Hospitals",
  ambulance: "Ambulance Providers",
  rental_equipment: "Rental Equipment Vendors",
};

const REVENUE_LABELS: Record<AustyRevenueCategory, string> = {
  doctor_consultation: "Doctor Consultation",
  pharmacy_orders: "Pharmacy Orders",
  diagnostic_lab_tests: "Diagnostic Lab Tests",
  ct_mri_bookings: "CT/MRI Bookings",
  ambulance_bookings: "Ambulance Bookings",
  hospital_surgery: "Hospital and Surgery Services",
  rental_medical_equipment: "Rental Medical Equipment",
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const TABS = [
  { id: "overview", label: "Overview & Leaderboard", icon: LayoutDashboard },
  { id: "states", label: "States & Providers", icon: MapPin },
  { id: "employees", label: "Employees & EPS Score", icon: Award },
  { id: "revenue", label: "Revenue & Incentives", icon: IndianRupee },
  { id: "teams", label: "Teams & My Portal", icon: Users },
  { id: "reports", label: "Reports & Audit Log", icon: FileSpreadsheet },
] as const;
type TabId = (typeof TABS)[number]["id"];

export function AustyWorkspaceClient({
  data,
  initialTab,
  roleView,
  activeFilters,
}: {
  data: DashboardData;
  initialTab: string;
  roleView: string;
  activeFilters: { state?: string; district?: string; city?: string; fromDate?: string; toDate?: string };
}) {
  const validTab = TABS.some((t) => t.id === initialTab) ? (initialTab as TabId) : "overview";
  const [tab, setTab] = useState<TabId>(validTab);

  const empModalRef = useRef<HTMLDialogElement>(null);
  const provModalRef = useRef<HTMLDialogElement>(null);
  const txModalRef = useRef<HTMLDialogElement>(null);
  const cfgModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (TABS.some((t) => t.id === initialTab)) {
      setTab(initialTab as TabId);
    }
  }, [initialTab]);

  useEffect(() => {
    const handler = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (TABS.some((t) => t.id === next)) setTab(next as TabId);
    };
    window.addEventListener("austy-tab", handler);
    return () => window.removeEventListener("austy-tab", handler);
  }, []);

  const isEmployeeOnlyView = roleView === "employee";
  const personalPerf = data.employeePerformance[0] ?? data.rankings[0];

  return (
    <div className="space-y-6">
      {/* Compact Executive Header */}
      <section
        className="rounded-2xl p-6 text-white shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
        style={{ background: "var(--hero)" }}
      >
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold">
            <Building2 className="h-3.5 w-3.5" />
            AUSTY Health Care Private Limited
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Business Expansion, Employee EPS &amp; Revenue Console
          </h1>
          <p className="text-xs sm:text-sm text-white/85 max-w-2xl">
            Pan-India provider onboarding, 100-point Employee Performance Score (EPS), 7-category healthcare revenue ledger, and monthly incentive approvals.
          </p>
        </div>

        {/* Role View Switcher + Quick Action Triggers */}
        <div className="flex flex-col sm:items-end gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-white/12 p-1.5 backdrop-blur text-xs">
            <span className="px-2 text-[11px] font-semibold text-white/80">View as:</span>
            {(
              [
                ["super_admin", "Super Admin"],
                ["state_manager", "State Mgr"],
                ["district_manager", "District Mgr"],
                ["team_leader", "Team Leader"],
                ["employee", "Employee"],
              ] as const
            ).map(([rv, label]) => (
              <Link
                key={rv}
                href={`/austy?tab=${tab}&roleView=${rv}${rv === "employee" ? "&employeeId=6" : rv === "team_leader" ? "&employeeId=4" : rv === "district_manager" ? "&employeeId=3" : "&employeeId=1"}`}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  roleView === rv ? "bg-white text-slate-900 shadow" : "text-white/85 hover:bg-white/15"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {!isEmployeeOnlyView && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => empModalRef.current?.showModal()}
                className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow hover:bg-white/95 inline-flex items-center gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5 text-accent" />
                Add Employee
              </button>
              <button
                type="button"
                onClick={() => provModalRef.current?.showModal()}
                className="rounded-xl border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 inline-flex items-center gap-1.5"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Onboard Provider
              </button>
              <button
                type="button"
                onClick={() => txModalRef.current?.showModal()}
                className="rounded-xl border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/25 inline-flex items-center gap-1.5"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Record Transaction
              </button>
              <button
                type="button"
                onClick={() => cfgModalRef.current?.showModal()}
                className="rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 inline-flex items-center gap-1.5"
              >
                <Settings className="h-3.5 w-3.5" />
                EPS &amp; Slabs
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Single-Row Scrollable Tab Bar (per modern-web-guidance `tabs`: aria-selected + 3px bottom border indicator) */}
      <div
        role="tablist"
        aria-label="AUSTY Health Care modules"
        className="flex overflow-x-auto border-b border-border bg-surface rounded-t-2xl px-2"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`relative flex-none inline-flex items-center gap-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selected
                  ? "text-accent after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:border-b-3 after:border-accent"
                  : "muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW & LEADERBOARD */}
      <div role="tabpanel" aria-labelledby="tab-overview" hidden={tab !== "overview"}>
        <div className="space-y-6">
          {/* 4 High-Signal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="panel p-5 space-y-1.5">
              <div className="text-xs font-medium muted">Workforce &amp; Territories</div>
              <div className="text-2xl font-bold">
                {data.summary.totalEmployees} Employees{" "}
                <span className="text-xs font-semibold text-emerald-600">({data.summary.activeEmployees} active)</span>
              </div>
              <div className="text-xs muted">Across {data.stateBreakdown.length} active Indian states</div>
            </div>

            <div className="panel p-5 space-y-1.5">
              <div className="text-xs font-medium muted">Healthcare Providers Onboarded</div>
              <div className="text-2xl font-bold text-accent">{data.summary.totalProviders} Verified</div>
              <div className="text-xs muted">
                {data.summary.totalDoctors} Doctors · {data.summary.totalPharmacies} Pharmacies · {data.summary.totalLabs} Labs · {data.summary.totalHospitals} Hospitals
              </div>
            </div>

            <div className="panel p-5 space-y-1.5">
              <div className="text-xs font-medium muted">Monthly Net &amp; Eligible Revenue</div>
              <div className="text-2xl font-bold text-emerald-600">{inr(data.summary.netPlatformRevenue)}</div>
              <div className="text-xs muted">
                Eligible for Incentives: <strong>{inr(data.summary.eligibleRevenue)}</strong> (Gross: {inr(data.summary.totalTransactionValue)})
              </div>
            </div>

            <div className="panel p-5 space-y-1.5">
              <div className="text-xs font-medium muted">Monthly Employee Incentives</div>
              <div className="text-2xl font-bold text-accent">{inr(data.summary.totalIncentives)}</div>
              <div className="text-xs muted">
                Paid: <span className="text-emerald-600 font-semibold">{inr(data.summary.paidIncentives)}</span> · Pending:{" "}
                <span className="text-amber-600 font-semibold">{inr(data.summary.pendingIncentives)}</span>
              </div>
            </div>
          </div>

          {/* Top 10 Performing Employees & State Revenue Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="panel panel-pad lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="h-section">Top 10 Performing Employees (EPS / 100)</h2>
                  <p className="text-xs muted">Ranked by verified Employee Performance Score and eligible platform revenue</p>
                </div>
                <button type="button" onClick={() => setTab("employees")} className="text-xs font-semibold text-accent hover:underline">
                  Full Roster →
                </button>
              </div>

              <div className="table-wrapper" tabIndex={0} role="region" aria-label="Top 10 performing employees">
                <table className="table text-xs">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Employee &amp; Reference ID</th>
                      <th>Territory</th>
                      <th>Providers</th>
                      <th>Eligible Revenue</th>
                      <th>EPS</th>
                      <th>Incentive</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top10Employees.map((r, i) => (
                      <tr key={r.employee.id}>
                        <th className="font-mono font-bold text-left">#{i + 1}</th>
                        <td>
                          <div className="font-bold">{r.employee.name}</div>
                          <div className="font-mono text-[11px] text-accent">{r.employee.referenceId}</div>
                        </td>
                        <td>{r.employee.assignedCity}, {r.employee.assignedState}</td>
                        <td className="font-bold">{r.totalProviders}</td>
                        <td className="font-semibold text-emerald-600">{inr(r.eligibleRevenue)}</td>
                        <td>
                          <span className="chip bg-accent-subtle text-accent font-bold">{r.epsScore}</span>
                        </td>
                        <td className="font-bold">{inr(r.incentiveAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel panel-pad lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="h-section">State-Wise Revenue Distribution</h2>
                  <p className="text-xs muted">Net platform revenue and onboarded providers by state</p>
                </div>
                <button type="button" onClick={() => setTab("states")} className="text-xs font-semibold text-accent hover:underline">
                  All States →
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {data.stateBreakdown.map((s) => {
                  const maxRev = Math.max(...data.stateBreakdown.map((x) => x.netRevenue), 1);
                  const pct = Math.round((s.netRevenue / maxRev) * 100);
                  return (
                    <div key={s.state} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{s.state}</span>
                        <span className="muted">
                          {s.totalProviders} providers · <strong className="text-foreground">{inr(s.netRevenue)}</strong>
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 2: STATE-WISE BUSINESS & PROVIDER TRACKING */}
      <div role="tabpanel" aria-labelledby="tab-states" hidden={tab !== "states"}>
        <div className="space-y-5">
          {/* Territory & Date Filter Bar */}
          <div className="panel panel-pad flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="h-section">Pan-India Territory Filters</h2>
              <p className="text-xs muted">Filter providers and revenue by State, District, City, and Date Range</p>
            </div>
            <form method="get" action="/austy" className="flex flex-wrap items-center gap-2 text-xs">
              <input type="hidden" name="tab" value="states" />
              <input type="hidden" name="roleView" value={roleView} />
              <select name="state" defaultValue={activeFilters.state ?? ""} aria-label="Filter by state" className="field py-1.5 text-xs w-36">
                <option value="">All States</option>
                {data.allStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select name="district" defaultValue={activeFilters.district ?? ""} aria-label="Filter by district" className="field py-1.5 text-xs w-36">
                <option value="">All Districts</option>
                {data.allDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select name="city" defaultValue={activeFilters.city ?? ""} aria-label="Filter by city" className="field py-1.5 text-xs w-32">
                <option value="">All Cities</option>
                {data.allCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input type="date" name="fromDate" defaultValue={activeFilters.fromDate ?? ""} aria-label="From date" className="field py-1 text-xs w-34" />
              <input type="date" name="toDate" defaultValue={activeFilters.toDate ?? ""} aria-label="To date" className="field py-1 text-xs w-34" />
              <button type="submit" className="btn btn-primary btn-sm">
                <Filter className="h-3.5 w-3.5" />
                Apply
              </button>
              <Link href="/austy?tab=states" className="btn btn-secondary btn-sm">
                Reset
              </Link>
            </form>
          </div>

          {/* State-wise table */}
          <div className="panel panel-pad space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="h-section">State-Wise Provider Onboarding &amp; Revenue</h3>
              <div className="flex items-center gap-2">
                {!isEmployeeOnlyView && (
                  <button type="button" onClick={() => provModalRef.current?.showModal()} className="btn btn-primary btn-sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Onboard Provider
                  </button>
                )}
                <a href="/api/admin/export?entity=austy_state&format=xlsx" className="btn btn-secondary btn-sm">
                  <Download className="h-3.5 w-3.5" />
                  Export Excel
                </a>
              </div>
            </div>

            <div className="table-wrapper" tabIndex={0} role="region" aria-label="State-wise provider breakdown">
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
          </div>
        </div>
      </div>

      {/* TAB 3: EMPLOYEES & EPS (100-POINT) */}
      <div role="tabpanel" aria-labelledby="tab-employees" hidden={tab !== "employees"}>
        <div className="panel panel-pad space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="h-section">
                Employee Performance Tracking &amp; 100-Point EPS Rankings ({data.rankings.length})
              </h2>
              <p className="text-xs muted">
                EPS Formula: Onboarding ({data.config.epsWeights.onboarding} pts) + Revenue ({data.config.epsWeights.revenue} pts) + Transactions ({data.config.epsWeights.transactions} pts) + Activation &amp; Retention ({data.config.epsWeights.retention} pts) + Quality ({data.config.epsWeights.quality} pts) = 100 Max.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!isEmployeeOnlyView && (
                <>
                  <button type="button" onClick={() => empModalRef.current?.showModal()} className="btn btn-primary btn-sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Register Employee
                  </button>
                  <button type="button" onClick={() => cfgModalRef.current?.showModal()} className="btn btn-secondary btn-sm">
                    <Settings className="h-3.5 w-3.5" />
                    Customize EPS Weights
                  </button>
                </>
              )}
              <a href="/api/admin/export?entity=austy_employees&format=xlsx" className="btn btn-secondary btn-sm">
                <Download className="h-3.5 w-3.5" />
                Export Excel
              </a>
            </div>
          </div>

          <div className="table-wrapper" tabIndex={0} role="region" aria-label="Employee performance rankings">
            <table className="table text-xs">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee &amp; Reference ID</th>
                  <th>Role &amp; Territory</th>
                  <th>Providers (Dr/Ph/Lab/Hosp/Amb/Rent)</th>
                  <th>Verified / Active</th>
                  <th>Tx</th>
                  <th>Eligible Rev / Target</th>
                  <th>Target %</th>
                  <th>EPS (0–100)</th>
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
                      <div className="font-medium">
                        {r.employee.assignedCity}, {r.employee.assignedState}
                      </div>
                      <div className="text-[11px] muted">
                        {ROLE_LABELS[r.employee.role]} · Mgr: {r.managerName}
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
                      <div className="font-bold text-accent text-sm">{r.epsScore} / 100</div>
                      <div className="text-[10px] font-mono muted">
                        {r.epsBreakdown.onboarding}+{r.epsBreakdown.revenue}+{r.epsBreakdown.transactions}+{r.epsBreakdown.retention}+{r.epsBreakdown.quality}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAB 4: 7-CATEGORY REVENUE & INCENTIVE APPROVAL WORKFLOW */}
      <div role="tabpanel" aria-labelledby="tab-revenue" hidden={tab !== "revenue"}>
        <div className="space-y-6">
          {/* 7-Category Revenue Ledger */}
          <div className="panel panel-pad space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="h-section">7-Category Healthcare Revenue Analytics Ledger</h2>
                <p className="text-xs muted">
                  Incentives are calculated strictly on approved eligible platform revenue, never on raw customer transaction value.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isEmployeeOnlyView && (
                  <button type="button" onClick={() => txModalRef.current?.showModal()} className="btn btn-primary btn-sm">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Record Transaction
                  </button>
                )}
                <a href="/api/admin/export?entity=austy_revenue&format=xlsx" className="btn btn-secondary btn-sm">
                  <Download className="h-3.5 w-3.5" />
                  Export Ledger
                </a>
              </div>
            </div>

            <div className="table-wrapper" tabIndex={0} role="region" aria-label="7-category revenue ledger">
              <table className="table text-xs">
                <thead>
                  <tr>
                    <th>Business Category</th>
                    <th>Total / Completed Tx</th>
                    <th>Transaction Value</th>
                    <th>Gross Revenue</th>
                    <th>Service Fee</th>
                    <th>Discounts</th>
                    <th>Refunds</th>
                    <th>Cancelled</th>
                    <th>Net Revenue</th>
                    <th>Eligible Revenue</th>
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
          </div>

          {/* 6-Stage Monthly Incentive Payment Approval Workflow */}
          <div className="panel panel-pad space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="h-section">Monthly Performance Incentive &amp; 6-Stage Payment Approval Workflow</h2>
                <p className="text-xs muted">
                  Slabs: {data.config.slabs.map((s) => s.label).join(" · ")}
                </p>
              </div>
              {!isEmployeeOnlyView && (
                <button type="button" onClick={() => cfgModalRef.current?.showModal()} className="btn btn-secondary btn-sm">
                  <Settings className="h-3.5 w-3.5" />
                  Customize Slabs
                </button>
              )}
            </div>

            <div className="table-wrapper" tabIndex={0} role="region" aria-label="Monthly incentive approval workflow">
              <table className="table text-xs">
                <thead>
                  <tr>
                    <th>Employee &amp; Ref ID</th>
                    <th>Target Achievement</th>
                    <th>EPS Score</th>
                    <th>Slab Incentive</th>
                    <th>Team Mgmt Bonus</th>
                    <th>Total Payout</th>
                    <th>UTR / Payment Ref</th>
                    <th>Approval Workflow Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rankings.map((r) => (
                    <tr key={r.employee.id}>
                      <th className="text-left">
                        <div className="font-bold">{r.employee.name}</div>
                        <div className="font-mono text-[11px] text-accent">{r.employee.referenceId}</div>
                      </th>
                      <td>
                        <span className="font-bold">{r.achievementPercent}%</span>{" "}
                        <span className="muted">({inr(r.eligibleRevenue)})</span>
                      </td>
                      <td className="font-bold text-accent">{r.epsScore}</td>
                      <td className="font-mono">{inr(r.baseIncentive)}</td>
                      <td className="font-mono text-emerald-600">{r.teamBonus > 0 ? inr(r.teamBonus) : "—"}</td>
                      <td className="font-mono font-bold">{inr(r.incentiveAmount)}</td>
                      <td className="font-mono text-[11px] muted">
                        {r.incentiveRow?.transactionReference ?? "Pending NEFT"}
                      </td>
                      <td>
                        {r.incentiveRow && !isEmployeeOnlyView ? (
                          <form action={updateAustyIncentiveWorkflowAction} className="flex items-center gap-1.5">
                            <input type="hidden" name="incentiveId" value={r.incentiveRow.id} />
                            <select
                              name="status"
                              defaultValue={r.incentiveStatus}
                              aria-label={`Incentive status for ${r.employee.name}`}
                              className="field py-1 px-2 text-[11px] w-40"
                            >
                              {AUSTY_INCENTIVE_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st.replace("_", " ").toUpperCase()}
                                </option>
                              ))}
                            </select>
                            <button type="submit" className="btn btn-secondary btn-sm px-2.5">
                              Update
                            </button>
                          </form>
                        ) : (
                          <span className="chip uppercase text-[10px]">{r.incentiveStatus}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 5: TEAM LEADERS & PERSONAL EMPLOYEE PORTAL */}
      <div role="tabpanel" aria-labelledby="tab-teams" hidden={tab !== "teams"}>
        <div className="space-y-6">
          {/* Personal Employee Portal */}
          {personalPerf && (
            <div className="panel panel-pad space-y-5 border-2 border-accent/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip bg-accent-subtle text-accent font-bold">Personal Employee Portal</span>
                    <span className="chip font-mono font-bold">{personalPerf.employee.employeeCode}</span>
                    <span className="chip bg-emerald-500/15 text-emerald-700 font-mono font-bold">
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
                    <strong>{personalPerf.managerName}</strong>
                  </p>
                </div>

                {!isEmployeeOnlyView && (
                  <form method="get" action="/austy" className="flex items-center gap-2 text-xs">
                    <input type="hidden" name="tab" value="teams" />
                    <input type="hidden" name="roleView" value={roleView} />
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
                      Inspect Portal
                    </button>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">My Providers</div>
                  <div className="text-lg font-bold mt-0.5">{personalPerf.totalProviders}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">Total Business</div>
                  <div className="text-lg font-bold mt-0.5">{inr(personalPerf.grossTxValue)}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">Eligible Revenue</div>
                  <div className="text-lg font-bold text-accent mt-0.5">{inr(personalPerf.eligibleRevenue)}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">Transactions</div>
                  <div className="text-lg font-bold mt-0.5">{personalPerf.successfulTransactions}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">Monthly Target</div>
                  <div className="text-lg font-bold mt-0.5">{inr(personalPerf.employee.monthlyTargetRevenue)}</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">Target %</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">{personalPerf.achievementPercent}%</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">My EPS Score</div>
                  <div className="text-lg font-bold text-accent mt-0.5">{personalPerf.epsScore} / 100</div>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="muted">My Incentive</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">{inr(personalPerf.incentiveAmount)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Team Leader Supervision Cards */}
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
                    Team Target: {tp.achievementPct}%
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
        </div>
      </div>

      {/* TAB 6: REPORTS, EXPORTS & ACTIVITY LOG */}
      <div role="tabpanel" aria-labelledby="tab-reports" hidden={tab !== "reports"}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="panel panel-pad lg:col-span-7 space-y-4">
              <div>
                <h2 className="h-section">Enterprise Reports Download Center (Excel &amp; CSV)</h2>
                <p className="text-xs muted">Generate and export all 8 AUSTY Health Care management reports</p>
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
                      <a href={`/api/admin/export?entity=${entity}&format=xlsx`} className="btn btn-secondary btn-sm px-2.5">
                        Excel
                      </a>
                      <a href={`/api/admin/export?entity=${entity}&format=csv`} className="btn btn-secondary btn-sm px-2.5">
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
                Employee Activity &amp; Attribution Audit Log
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
          </div>

          {/* Statutory Business Model & Compliance Verification */}
          <div className="panel panel-pad space-y-2 text-xs">
            <div className="font-bold text-sm flex items-center gap-2 text-accent">
              <ShieldCheck className="h-4 w-4" />
              AUSTY Health Care Private Limited — Legal &amp; Incentive Compliance Policy
            </div>
            <p className="muted leading-relaxed">
              100% company ownership and final business control remain with AUSTY Health Care Private Limited. No equity shares, no recruitment-based commissions, no compulsory joining fees, and no multi-level commissions are permitted. All employee incentives are calculated strictly on verified performance and approved eligible platform revenue.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: REGISTER NEW EMPLOYEE */}
      <dialog
        ref={empModalRef}
        aria-labelledby="modal-emp-title"
        className="m-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-emp-title" className="text-base font-bold flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-accent" />
            Register New AUSTY Employee
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close modal" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <form
          action={async (fd) => {
            await createAustyEmployeeAction(fd);
            empModalRef.current?.close();
          }}
          className="space-y-3 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" required placeholder="Full Name" className="field text-xs" />
            <input name="mobile" required placeholder="Mobile (+91 98...)" className="field text-xs" />
            <input name="email" type="email" required placeholder="Email Address" className="field text-xs" />
            <input name="designation" required placeholder="Designation" className="field text-xs" />
            <select name="role" defaultValue="bde" aria-label="Employee role" className="field text-xs">
              {AUSTY_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <select name="managerId" aria-label="Reporting manager" className="field text-xs">
              <option value="">Reporting Manager (Super Admin)</option>
              {data.allEmployeesList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <input name="assignedState" required placeholder="State (e.g. Maharashtra)" className="field text-xs" />
            <input name="assignedDistrict" required placeholder="District (e.g. Pune)" className="field text-xs" />
            <input name="assignedCity" required placeholder="City (e.g. Pune)" className="field text-xs" />
            <input name="joiningDate" type="date" defaultValue="2026-11-21" className="field text-xs" />
            <input name="monthlyTargetRevenue" type="number" defaultValue={120000} placeholder="Target Revenue (INR)" className="field text-xs" />
            <input name="monthlyTargetProviders" type="number" defaultValue={12} placeholder="Target Providers" className="field text-xs" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => empModalRef.current?.close()} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Generate Employee ID &amp; Reference ID
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL 2: ONBOARD HEALTHCARE PROVIDER */}
      <dialog
        ref={provModalRef}
        aria-labelledby="modal-prov-title"
        className="m-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-prov-title" className="text-base font-bold flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-accent" />
            Onboard Healthcare Provider (Duplicate-Locked)
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close modal" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <form
          action={async (fd) => {
            await onboardAustyProviderAction(fd);
            provModalRef.current?.close();
          }}
          className="space-y-3 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  {PROVIDER_LABELS[c]}
                </option>
              ))}
            </select>
            <select name="employeeId" aria-label="Onboarding employee" className="field text-xs">
              {data.allEmployeesList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.referenceId})
                </option>
              ))}
            </select>
            <input name="state" placeholder="State (optional override)" className="field text-xs" />
            <input name="city" placeholder="City (optional override)" className="field text-xs" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => provModalRef.current?.close()} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Verify &amp; Attribute Provider
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL 3: RECORD TRANSACTION */}
      <dialog
        ref={txModalRef}
        aria-labelledby="modal-tx-title"
        className="m-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-tx-title" className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Record Healthcare Platform Transaction
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close modal" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <form
          action={async (fd) => {
            await recordAustyTransactionAction(fd);
            txModalRef.current?.close();
          }}
          className="space-y-3 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select name="providerId" aria-label="Healthcare provider" className="field text-xs">
              {data.providers.slice(0, 35).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.employeeReferenceId})
                </option>
              ))}
            </select>
            <select name="category" defaultValue="doctor_consultation" aria-label="Revenue category" className="field text-xs">
              {AUSTY_REVENUE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {REVENUE_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              name="transactionValue"
              type="number"
              defaultValue={25000}
              placeholder="Transaction Value (INR)"
              className="field text-xs"
            />
            <select name="status" defaultValue="completed" aria-label="Transaction status" className="field text-xs">
              <option value="completed">Completed (Eligible for EPS)</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => txModalRef.current?.close()} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Post Transaction &amp; Recalculate EPS
            </button>
          </div>
        </form>
      </dialog>

      {/* MODAL 4: CUSTOMIZE EPS WEIGHTS & INCENTIVE SLABS */}
      <dialog
        ref={cfgModalRef}
        aria-labelledby="modal-cfg-title"
        className="m-auto w-full max-w-xl rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-cfg-title" className="text-base font-bold flex items-center gap-2">
            <Settings className="h-4 w-4 text-accent" />
            Customize EPS Weights (100 Pts) &amp; Monthly Incentive Slabs
          </h2>
          <form method="dialog">
            <button type="submit" aria-label="Close modal" className="rounded-lg p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
        <form
          action={async (fd) => {
            await updateAustyConfigAction(fd);
            cfgModalRef.current?.close();
          }}
          className="space-y-4 text-xs"
        >
          <div className="space-y-2">
            <div className="font-bold text-accent">1. EPS Component Weights (Max 100 Points)</div>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="block text-[11px] muted mb-1">Onboarding</label>
                <input name="w_onboarding" type="number" defaultValue={data.config.epsWeights.onboarding} className="field text-xs font-bold text-center" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">Revenue</label>
                <input name="w_revenue" type="number" defaultValue={data.config.epsWeights.revenue} className="field text-xs font-bold text-center" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">Transactions</label>
                <input name="w_transactions" type="number" defaultValue={data.config.epsWeights.transactions} className="field text-xs font-bold text-center" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">Retention</label>
                <input name="w_retention" type="number" defaultValue={data.config.epsWeights.retention} className="field text-xs font-bold text-center" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">Quality</label>
                <input name="w_quality" type="number" defaultValue={data.config.epsWeights.quality} className="field text-xs font-bold text-center" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-accent">2. Monthly Target Achievement Incentive Slabs (INR)</div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] muted mb-1">50–74% Slab</label>
                <input name="slab_50" type="number" defaultValue={data.config.slabs[1]?.amount ?? 1000} className="field text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">75–89% Slab</label>
                <input name="slab_75" type="number" defaultValue={data.config.slabs[2]?.amount ?? 2500} className="field text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">90–99% Slab</label>
                <input name="slab_90" type="number" defaultValue={data.config.slabs[3]?.amount ?? 4000} className="field text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[11px] muted mb-1">100%+ Slab</label>
                <input name="slab_100" type="number" defaultValue={data.config.slabs[4]?.amount ?? 6000} className="field text-xs font-bold" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => cfgModalRef.current?.close()} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save &amp; Recalculate All Scores
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
