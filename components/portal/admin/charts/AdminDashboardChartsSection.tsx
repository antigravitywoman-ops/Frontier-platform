"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { PortalPageSection } from "@/components/portal/shared/PortalPageSection";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  isAdminAnalyticsDemo,
  resolveAdminMetrics,
  resolveAdminPaymentMix,
  resolveAdminTopClinics,
  resolveAdminTopProducts,
  resolveAdminTrend,
} from "@/lib/admin/dashboard-charts";
import { formatCurrency } from "@/lib/format/currency";
import type { Order } from "@/lib/orders/types";
import { METRICS_RANGE_LABELS, type MetricsDateRange } from "@/lib/provider/types";

const RANGE_OPTIONS: MetricsDateRange[] = ["7d", "30d", "90d", "ytd"];

const RevenueProfitChart = dynamic(
  () =>
    import("@/components/portal/provider/accounting/RevenueProfitChart").then(
      (mod) => mod.RevenueProfitChart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const TopProductsChart = dynamic(
  () =>
    import("@/components/portal/provider/accounting/TopProductsChart").then(
      (mod) => mod.TopProductsChart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const AdminOrderVolumeChart = dynamic(
  () =>
    import("@/components/portal/admin/charts/AdminOrderVolumeChart").then(
      (mod) => mod.AdminOrderVolumeChart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const AdminClinicRevenueChart = dynamic(
  () =>
    import("@/components/portal/admin/charts/AdminClinicRevenueChart").then(
      (mod) => mod.AdminClinicRevenueChart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const AdminPaymentMixChart = dynamic(
  () =>
    import("@/components/portal/admin/charts/AdminPaymentMixChart").then(
      (mod) => mod.AdminPaymentMixChart,
    ),
  {
    ssr: false,
    loading: () => <ChartSkeleton short />,
  },
);

function ChartSkeleton({ short = false }: { short?: boolean }) {
  return <Skeleton className={`w-full rounded-lg ${short ? "h-44" : "h-52"}`} />;
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-deep-teal/10 bg-pure-white/70 p-2.5">
      <h3 className="text-xs font-medium text-deep-teal">{title}</h3>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

type AdminDashboardChartsSectionProps = {
  orders: Order[];
};

export function AdminDashboardChartsSection({ orders }: AdminDashboardChartsSectionProps) {
  const [range, setRange] = useState<MetricsDateRange>("30d");

  const trendData = useMemo(() => resolveAdminTrend(orders, range), [orders, range]);
  const metrics = useMemo(() => resolveAdminMetrics(orders, range), [orders, range]);
  const topProducts = useMemo(() => resolveAdminTopProducts(orders, range), [orders, range]);
  const topClinics = useMemo(() => resolveAdminTopClinics(orders, range), [orders, range]);
  const paymentMix = useMemo(() => resolveAdminPaymentMix(orders), [orders]);
  const usingDemo = useMemo(() => isAdminAnalyticsDemo(orders, range), [orders, range]);

  return (
    <PortalPageSection
      icon={frontierSidebarIcons.barChart}
      title="Platform Analytics"
      subtitle={`GMV, order volume, and clinic performance · ${METRICS_RANGE_LABELS[range]}${usingDemo ? " · Sample data" : ""}`}
      className="xl:col-span-full"
      dense
    >
      <div className="flex flex-wrap gap-1.5">
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              range === option
                ? "border-pacific-teal/30 bg-pacific-teal/10 text-deep-teal"
                : "border-deep-teal/10 bg-pure-white text-deep-teal/60 hover:border-pacific-teal/20 hover:text-deep-teal"
            }`}
          >
            {METRICS_RANGE_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-1.5 xl:grid-cols-4">
        {[
          { label: "GMV", value: formatCurrency(metrics.totalSales) },
          { label: "Platform revenue", value: formatCurrency(metrics.totalProfit) },
          { label: "Paid orders", value: metrics.orderCount.toLocaleString() },
          { label: "Avg order", value: formatCurrency(metrics.avgOrderValue) },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="provider-dash-card-muted provider-dash-card-muted--neutral px-2 py-1.5"
          >
            <p className="text-[10px] uppercase tracking-wide text-deep-teal/50">{kpi.label}</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-deep-teal">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 grid gap-2 lg:grid-cols-2">
        <ChartCard title="Revenue vs profit">
          <RevenueProfitChart data={trendData} compact />
        </ChartCard>

        <ChartCard title="Order volume">
          <AdminOrderVolumeChart data={trendData} compact />
        </ChartCard>

        <ChartCard title="Top products">
          <TopProductsChart data={topProducts} compact />
        </ChartCard>

        <ChartCard title="Top clinics by GMV">
          <AdminClinicRevenueChart data={topClinics} compact />
        </ChartCard>

        <ChartCard title="Payment mix">
          <AdminPaymentMixChart data={paymentMix} compact />
        </ChartCard>
      </div>

      <Link
        href="/portal/admin/reports"
        className="mt-2 inline-block text-[11px] font-medium text-pacific-teal hover:underline"
      >
        Open full reports →
      </Link>
    </PortalPageSection>
  );
}
