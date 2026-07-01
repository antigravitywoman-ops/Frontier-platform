"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { ProviderPageSection } from "@/components/portal/provider/shared/ProviderPageSection";
import { useOrders } from "@/context/OrdersProvider";
import { useProviderPortal } from "@/context/ProviderPortalProvider";
import { resolveProviderTrend } from "@/lib/provider/compute-metrics";
import { METRICS_RANGE_LABELS } from "@/lib/provider/types";

const ProviderPerformanceChart = dynamic(
  () =>
    import("@/components/portal/provider/ProviderPerformanceChart").then(
      (mod) => mod.ProviderPerformanceChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="provider-dash-chart-kpi provider-dash-chart-kpi--sales">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-7 w-20" />
            </div>
          ))}
        </div>
        <div className="provider-dash-chart-canvas">
          <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:px-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-72 w-full min-w-0 rounded-xl sm:h-[300px]" />
        </div>
      </div>
    ),
  },
);

type ProviderMetricsBarProps = {
  glass?: boolean;
};

export function ProviderMetricsBar({ glass = false }: ProviderMetricsBarProps) {
  const { orders } = useOrders();
  const { metricsRange, metrics } = useProviderPortal();

  const trendData = useMemo(
    () => resolveProviderTrend(orders, metricsRange),
    [orders, metricsRange],
  );

  const rangeLabel = METRICS_RANGE_LABELS[metricsRange];

  const chart = (
    <ProviderPerformanceChart data={trendData} metrics={metrics} rangeLabel={rangeLabel} />
  );

  if (glass) {
    return (
      <ProviderDashboardCard noPadding data-tour="doctor-dashboard-performance">
        <div className="border-b border-deep-teal/8 px-4 py-3 sm:px-5">
          <ProviderDashboardSectionHeader
            title="Performance"
            subtitle={`Order trends · ${rangeLabel}`}
          />
        </div>
        <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">{chart}</div>
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderPageSection title="Performance" noPadding data-tour="doctor-dashboard-performance">
      <div className="p-5 sm:p-6">{chart}</div>
    </ProviderPageSection>
  );
}
