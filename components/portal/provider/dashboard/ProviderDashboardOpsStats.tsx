"use client";

import type { ProviderDashboardStats } from "@/lib/provider/dashboard-stats";

const SEGMENTS = [
  {
    key: "pendingReviewCount",
    label: "Pending reviews",
    variant: "pending",
    demoFallback: 3,
  },
  {
    key: "activeShipments",
    label: "Shipments",
    variant: "shipments",
  },
  {
    key: "patientCount",
    label: "Patients",
    variant: "patients",
  },
  {
    key: "visibleStoreProducts",
    label: "Products",
    variant: "products",
  },
] as const satisfies ReadonlyArray<{
  key: keyof ProviderDashboardStats;
  label: string;
  variant: string;
  demoFallback?: number;
}>;

type ProviderDashboardOpsStatsProps = {
  stats: ProviderDashboardStats;
};

function displayStatValue(
  key: (typeof SEGMENTS)[number]["key"],
  value: number,
  demoFallback?: number,
) {
  if (value > 0) return value;
  return demoFallback ?? value;
}

export function ProviderDashboardOpsStats({ stats }: ProviderDashboardOpsStatsProps) {
  const segments = SEGMENTS.map((segment) => ({
    ...segment,
    value: displayStatValue(
      segment.key,
      stats[segment.key],
      "demoFallback" in segment ? segment.demoFallback : undefined,
    ),
  }));

  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="space-y-3">
      <div className="provider-dash-ops-bar" role="img" aria-label="Operations activity breakdown">
        {segments.map((segment) => {
          const share = Math.max((segment.value / total) * 100, segment.value > 0 ? 8 : 0);
          return (
            <div
              key={segment.label}
              className={`provider-dash-ops-bar-segment provider-dash-ops-bar-segment--${segment.variant}`}
              style={{ flexGrow: share }}
              title={`${segment.label}: ${segment.value}`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`provider-dash-ops-stat provider-dash-ops-stat--${segment.variant}`}
          >
            <div className="flex items-center gap-2 pl-1">
              <span className="provider-dash-ops-stat-dot" aria-hidden />
              <p className="provider-dash-ops-stat-label">{segment.label}</p>
            </div>
            <p className="provider-dash-ops-stat-value pl-1">{segment.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
