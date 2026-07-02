import type {
  AdminAffiliate,
  AdminApplication,
  AdminClinic,
  PlatformSettings,
} from "@/lib/admin/types";
import { isReviewableApplication } from "@/lib/admin/types";
import { getDemoPaymentStatusSegments, shouldUseAdminDemoOrders } from "@/lib/admin/dashboard-charts";
import { getAdminDashboardDemoOrders } from "@/lib/admin/demo-dashboard-orders";
import type { Order } from "@/lib/orders/types";
import type { InventoryAlert } from "@/lib/wms/types";

export type AdminDashboardOrderFilter = "recent" | "pending_shipment" | "flagged";

export type AdminDashboardStatusSegment = {
  id: string;
  label: string;
  count: number;
  href: string;
  tone: "teal" | "amber" | "coral" | "slate";
};

export type AdminDashboardStats = {
  gmv: number;
  platformRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingReviewOrders: number;
  flaggedOrders: number;
  pendingShipments: number;
  pendingApprovals: number;
  activeClinics: number;
  totalClinics: number;
  totalPatients: number;
  catalogProducts: number;
  catalogCategories: number;
  inventoryAlerts: number;
  outOfStockCount: number;
  affiliateCount: number;
  totalReferrals: number;
  commissionPercent: number;
  payoutThreshold: number;
  payoutFrequency: string;
  paymentSegments: AdminDashboardStatusSegment[];
};

export function computeAdminDashboardStats({
  orders,
  applications,
  clinics,
  affiliates,
  catalogProducts,
  categories,
  inventoryAlerts,
  platformSettings,
}: {
  orders: Order[];
  applications: AdminApplication[];
  clinics: AdminClinic[];
  affiliates: AdminAffiliate[];
  catalogProducts: number;
  categories: number;
  inventoryAlerts: InventoryAlert[];
  platformSettings: PlatformSettings | null;
}): AdminDashboardStats {
  const gmv = orders.reduce((sum, order) => sum + order.total, 0);
  const platformRevenue = orders.reduce((sum, order) => sum + order.profit, 0);
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const pendingReviewOrders = orders.filter(
    (order) => order.reviewStatus === "pending_review",
  ).length;
  const flaggedOrders = orders.filter((order) => order.flagged).length;
  const pendingShipments = orders.filter(
    (order) =>
      order.paymentStatus === "paid" &&
      (order.shipmentStatus === "not_shipped" || order.shipmentStatus === "processing"),
  ).length;

  const pendingApprovals = applications.filter(isReviewableApplication).length;
  const activeClinics = clinics.filter((clinic) => clinic.status === "active").length;
  const totalPatients = clinics.reduce((sum, clinic) => sum + clinic.patient_count, 0);
  const outOfStockCount = inventoryAlerts.filter((alert) => alert.level === "out_of_stock").length;
  const totalReferrals = affiliates.reduce(
    (sum, affiliate) => sum + affiliate.clinic_referral_count,
    0,
  );

  const paymentCounts = {
    paid: orders.filter((order) => order.paymentStatus === "paid").length,
    pending: orders.filter((order) => order.paymentStatus === "pending").length,
    failed: orders.filter((order) => order.paymentStatus === "failed").length,
    refunded: orders.filter(
      (order) =>
        order.paymentStatus === "refunded" || order.paymentStatus === "partial_refund",
    ).length,
  };

  const paymentSegments: AdminDashboardStatusSegment[] = shouldUseAdminDemoOrders(orders)
    ? getDemoPaymentStatusSegments()
    : [
        {
          id: "paid",
          label: "Paid",
          count: paymentCounts.paid,
          href: "/portal/admin/orders",
          tone: "teal",
        },
        {
          id: "pending",
          label: "Pending",
          count: paymentCounts.pending,
          href: "/portal/admin/orders",
          tone: "amber",
        },
        {
          id: "failed",
          label: "Failed",
          count: paymentCounts.failed,
          href: "/portal/admin/orders",
          tone: "coral",
        },
        {
          id: "refunded",
          label: "Refunded",
          count: paymentCounts.refunded,
          href: "/portal/admin/orders",
          tone: "slate",
        },
      ];

  return {
    gmv,
    platformRevenue,
    totalOrders: orders.length,
    paidOrders,
    pendingReviewOrders,
    flaggedOrders,
    pendingShipments,
    pendingApprovals,
    activeClinics,
    totalClinics: clinics.length,
    totalPatients,
    catalogProducts,
    catalogCategories: categories,
    inventoryAlerts: inventoryAlerts.length,
    outOfStockCount,
    affiliateCount: affiliates.length,
    totalReferrals,
    commissionPercent: platformSettings?.platform_commission_percent ?? 0,
    payoutThreshold: platformSettings?.minimum_payout_threshold ?? 0,
    payoutFrequency: platformSettings?.payout_frequency ?? "monthly",
    paymentSegments,
  };
}

export function filterDashboardOrders(
  orders: Order[],
  filter: AdminDashboardOrderFilter,
): Order[] {
  const sorted = [...orders].sort((a, b) => {
    const aDate = a.paymentDate ?? a.timeline[0]?.date ?? "";
    const bDate = b.paymentDate ?? b.timeline[0]?.date ?? "";
    return bDate.localeCompare(aDate);
  });

  if (filter === "pending_shipment") {
    return sorted
      .filter(
        (order) =>
          order.paymentStatus === "paid" &&
          (order.shipmentStatus === "not_shipped" || order.shipmentStatus === "processing"),
      )
      .slice(0, 6);
  }

  if (filter === "flagged") {
    return sorted.filter((order) => order.flagged).slice(0, 6);
  }

  return sorted.slice(0, 6);
}

export function resolveDashboardOrders(
  orders: Order[],
  filter: AdminDashboardOrderFilter,
): Order[] {
  const source = shouldUseAdminDemoOrders(orders) ? getAdminDashboardDemoOrders() : orders;
  return filterDashboardOrders(source, filter);
}
