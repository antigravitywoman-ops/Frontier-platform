"use client";

import { WmsSubNav } from "@/components/portal/admin/wms/WmsSubNav";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";

export function WmsLogisticsReports() {
  return (
    <PortalPageShell
      title="Logistics Reports"
      subtitle="Fulfillment performance and carrier analytics"
    >
      <WmsSubNav />

      <div className="grid gap-5 lg:grid-cols-2">
        {["Avg Fulfillment Time (30-day trend)", "Carrier Breakdown"].map((title) => (
          <section
            key={title}
            className="flex min-h-64 flex-col provider-dash-card p-5"
          >
            <h2 className="text-sm font-light text-deep-teal">{title}</h2>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-deep-teal/50">No logistics data available yet.</p>
            </div>
          </section>
        ))}
      </div>
    </PortalPageShell>
  );
}
