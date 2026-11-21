import { requireUser } from "@/lib/auth";
import { getAustyDashboardData, type AustyFilters } from "@/lib/austy";
import { AustyWorkspaceClient } from "./austy-client";

export default async function AustyHealthcareAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
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

  return (
    <AustyWorkspaceClient
      data={data}
      initialTab={sp.tab ?? "overview"}
      roleView={defaultRoleView}
      activeFilters={{
        state: sp.state,
        district: sp.district,
        city: sp.city,
        fromDate: sp.fromDate,
        toDate: sp.toDate,
      }}
    />
  );
}
