import type { ProductProfitRow } from "@/lib/finance/types";
import type { Order } from "@/lib/orders/types";
import {
  computeProviderMetrics,
  computeProviderTrend,
  getDemoPerformanceTrend,
  type ProviderTrendPoint,
} from "@/lib/provider/compute-metrics";
import type { MetricsDateRange, ProviderMetrics } from "@/lib/provider/types";

export type AdminClinicRevenueRow = {
  clinicId: string;
  clinicName: string;
  revenue: number;
  orders: number;
};

export type AdminPaymentMixSegment = {
  id: string;
  label: string;
  value: number;
};

const ADMIN_DEMO_ORDER_THRESHOLD = 6;

export { ADMIN_DEMO_ORDER_THRESHOLD };

const PAYMENT_SEGMENT_TONES = {
  paid: "teal",
  pending: "amber",
  failed: "coral",
  refunded: "slate",
} as const;

const DEMO_TOP_PRODUCTS: ProductProfitRow[] = [
  { productId: "demo-bpc157", productName: "BPC-157 5mg", profit: 4280, tier: "high" },
  { productId: "demo-sema", productName: "Semaglutide 2.5mg", profit: 3120, tier: "high" },
  { productId: "demo-tb500", productName: "TB-500 10mg", profit: 2450, tier: "medium" },
  { productId: "demo-ghk", productName: "GHK-Cu 50mg", profit: 1980, tier: "medium" },
  { productId: "demo-ipamorelin", productName: "Ipamorelin 10mg", profit: 1560, tier: "low" },
  { productId: "demo-cjc", productName: "CJC-1295 5mg", profit: 1240, tier: "low" },
];

const DEMO_TOP_CLINICS: AdminClinicRevenueRow[] = [
  { clinicId: "demo-summit", clinicName: "Summit Wellness Clinic", revenue: 28480, orders: 94 },
  { clinicId: "demo-pacific", clinicName: "Pacific Longevity Center", revenue: 22160, orders: 72 },
  { clinicId: "demo-north", clinicName: "North Shore Med Spa", revenue: 18940, orders: 61 },
  { clinicId: "demo-vertex", clinicName: "Vertex Health Partners", revenue: 15220, orders: 48 },
  { clinicId: "demo-coastal", clinicName: "Coastal Regenerative", revenue: 11860, orders: 39 },
];

export const DEMO_PAYMENT_MIX: AdminPaymentMixSegment[] = [
  { id: "paid", label: "Paid", value: 214 },
  { id: "pending", label: "Pending", value: 28 },
  { id: "failed", label: "Failed", value: 6 },
  { id: "refunded", label: "Refunded", value: 11 },
];

export function shouldUseAdminDemoOrders(orders: Order[]): boolean {
  return orders.length < ADMIN_DEMO_ORDER_THRESHOLD;
}

export function getDemoPaymentStatusSegments() {
  return DEMO_PAYMENT_MIX.map((segment) => ({
    id: segment.id,
    label: segment.label,
    count: segment.value,
    href: "/portal/admin/orders",
    tone: PAYMENT_SEGMENT_TONES[segment.id as keyof typeof PAYMENT_SEGMENT_TONES] ?? "slate",
  }));
}

function metricsFromTrend(trend: ProviderTrendPoint[]): ProviderMetrics {
  const orderCount = trend.reduce((sum, point) => sum + point.orders, 0);
  const totalSales = trend.reduce((sum, point) => sum + point.revenue, 0);
  const totalProfit = trend.reduce((sum, point) => sum + point.profit, 0);

  return {
    totalSales,
    totalProfit,
    orderCount,
    avgOrderValue: orderCount > 0 ? totalSales / orderCount : 0,
  };
}

function shouldUseAdminDemoAnalytics(orders: Order[], range: MetricsDateRange): boolean {
  return computeProviderMetrics(orders, range).orderCount < ADMIN_DEMO_ORDER_THRESHOLD;
}

export function isAdminAnalyticsDemo(orders: Order[], range: MetricsDateRange): boolean {
  return shouldUseAdminDemoAnalytics(orders, range);
}

function paidOrdersInRange(orders: Order[], range: MetricsDateRange) {
  const trend = computeProviderTrend(orders, range);
  const orderCount = trend.reduce((sum, point) => sum + point.orders, 0);
  if (orderCount === 0) return [];

  const start = trend[0]?.date;
  if (!start) return [];

  return orders.filter((order) => {
    if (order.paymentStatus !== "paid" || !order.paymentDate) return false;
    return order.paymentDate.slice(0, 10) >= start;
  });
}

function assignProfitTiers(rows: ProductProfitRow[]): ProductProfitRow[] {
  const sorted = [...rows].sort((a, b) => b.profit - a.profit);
  const count = sorted.length;

  return sorted.map((row, index) => ({
    ...row,
    tier: index < count / 3 ? "high" : index < (2 * count) / 3 ? "medium" : "low",
  }));
}

export function computeAdminTrend(orders: Order[], range: MetricsDateRange): ProviderTrendPoint[] {
  return computeProviderTrend(orders, range);
}

export function resolveAdminTrend(orders: Order[], range: MetricsDateRange): ProviderTrendPoint[] {
  if (shouldUseAdminDemoAnalytics(orders, range)) {
    return getDemoPerformanceTrend(range);
  }
  return computeAdminTrend(orders, range);
}

export function computeAdminMetrics(orders: Order[], range: MetricsDateRange) {
  return computeProviderMetrics(orders, range);
}

export function resolveAdminMetrics(orders: Order[], range: MetricsDateRange): ProviderMetrics {
  if (shouldUseAdminDemoAnalytics(orders, range)) {
    return metricsFromTrend(getDemoPerformanceTrend(range));
  }
  return computeAdminMetrics(orders, range);
}

export function computeAdminTopProducts(
  orders: Order[],
  range: MetricsDateRange,
): ProductProfitRow[] {
  const filtered = paidOrdersInRange(orders, range);
  const byProduct = new Map<string, { productName: string; profit: number }>();

  for (const order of filtered) {
    const lineTotal = order.lineItems.reduce((sum, item) => sum + item.total, 0);
    if (lineTotal <= 0) continue;

    for (const item of order.lineItems) {
      const existing = byProduct.get(item.productId) ?? {
        productName: item.productName,
        profit: 0,
      };
      existing.profit += (item.total / lineTotal) * order.profit;
      byProduct.set(item.productId, existing);
    }
  }

  const rows = Array.from(byProduct.entries()).map(([productId, data]) => ({
    productId,
    productName: data.productName,
    profit: Math.round(data.profit),
    tier: "medium" as const,
  }));

  return assignProfitTiers(rows.filter((row) => row.profit > 0));
}

export function resolveAdminTopProducts(
  orders: Order[],
  range: MetricsDateRange,
): ProductProfitRow[] {
  const computed = computeAdminTopProducts(orders, range);
  if (shouldUseAdminDemoAnalytics(orders, range)) {
    return DEMO_TOP_PRODUCTS;
  }
  return computed;
}

export function computeAdminTopClinics(
  orders: Order[],
  range: MetricsDateRange,
): AdminClinicRevenueRow[] {
  const filtered = paidOrdersInRange(orders, range);
  const byClinic = new Map<string, AdminClinicRevenueRow>();

  for (const order of filtered) {
    const existing = byClinic.get(order.clinicId) ?? {
      clinicId: order.clinicId,
      clinicName: order.clinicName,
      revenue: 0,
      orders: 0,
    };
    existing.revenue += order.total;
    existing.orders += 1;
    byClinic.set(order.clinicId, existing);
  }

  return [...byClinic.values()].sort((a, b) => b.revenue - a.revenue);
}

export function resolveAdminTopClinics(
  orders: Order[],
  range: MetricsDateRange,
): AdminClinicRevenueRow[] {
  const computed = computeAdminTopClinics(orders, range);
  if (shouldUseAdminDemoAnalytics(orders, range)) {
    return DEMO_TOP_CLINICS;
  }
  return computed;
}

export function computeAdminPaymentMix(orders: Order[]): AdminPaymentMixSegment[] {
  const counts = {
    paid: orders.filter((order) => order.paymentStatus === "paid").length,
    pending: orders.filter((order) => order.paymentStatus === "pending").length,
    failed: orders.filter((order) => order.paymentStatus === "failed").length,
    refunded: orders.filter(
      (order) =>
        order.paymentStatus === "refunded" || order.paymentStatus === "partial_refund",
    ).length,
  };

  return [
    { id: "paid", label: "Paid", value: counts.paid },
    { id: "pending", label: "Pending", value: counts.pending },
    { id: "failed", label: "Failed", value: counts.failed },
    { id: "refunded", label: "Refunded", value: counts.refunded },
  ].filter((segment) => segment.value > 0);
}

export function resolveAdminPaymentMix(orders: Order[]): AdminPaymentMixSegment[] {
  const computed = computeAdminPaymentMix(orders);
  if (computed.length === 0 || shouldUseAdminDemoOrders(orders)) {
    return DEMO_PAYMENT_MIX;
  }
  return computed;
}

export function hasAdminChartData(trend: ProviderTrendPoint[]): boolean {
  return trend.some((point) => point.revenue > 0 || point.profit > 0 || point.orders > 0);
}
