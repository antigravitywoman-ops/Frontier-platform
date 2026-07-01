"use client";

import { formatCurrency } from "@/lib/format/currency";
import { PortalContentCard, PortalStatCard } from "@/components/portal/shared/PortalDashboardCards";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";

const EMPTY_KPIS = {
  gmv: 0,
  activeClinics: 0,
  totalOrders: 0,
  platformRevenue: 0,
};

export function AdminReportsDashboard() {
  return (
    <PortalPageShell
      title="Reports"
      subtitle="Platform performance and revenue analytics"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "GMV", value: formatCurrency(EMPTY_KPIS.gmv) },
          { label: "Active Clinics", value: EMPTY_KPIS.activeClinics.toString() },
          { label: "Total Orders", value: EMPTY_KPIS.totalOrders.toLocaleString() },
          { label: "Platform Revenue", value: formatCurrency(EMPTY_KPIS.platformRevenue) },
        ].map((kpi) => (
          <PortalStatCard key={kpi.label} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {[
          "Revenue vs Profit",
          "Channel Split",
          "Top Products",
          "Revenue by Region",
        ].map((title) => (
          <PortalContentCard key={title} as="section" className="flex min-h-64 flex-col p-5">
            <h2 className="text-sm font-medium text-deep-teal">{title}</h2>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-deep-teal/50">No report data available yet.</p>
            </div>
          </PortalContentCard>
        ))}
      </div>
    </PortalPageShell>
  );
}
