"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import {
  FloatingToolbarAction,
  FloatingToolbarActions,
} from "@/components/portal/shared/FloatingIconAction";
import {
  PortalDetailCell,
} from "@/components/portal/shared/PortalDashboardCards";
import { PortalPageSection } from "@/components/portal/shared/PortalPageSection";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { ProviderDashboardCard } from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { Skeleton } from "@/components/ui/Skeleton";
import { resolveAdminPaymentMix } from "@/lib/admin/dashboard-charts";
import { useAdminOrdersStore } from "@/stores/orders-store";
import {
  computeAdminDashboardStats,
  resolveDashboardOrders,
  type AdminDashboardOrderFilter,
} from "@/lib/admin/dashboard-stats";
import { formatPrimaryContactName, isReviewableApplication } from "@/lib/admin/types";
import { formatCurrency } from "@/lib/format/currency";
import { PAYMENT_STATUS_LABELS, SHIPMENT_STATUS_LABELS } from "@/lib/orders/types";
import { useAdminPortalStore } from "@/stores/admin-portal-store";
import { AdminDashboardChartsSection } from "@/components/portal/admin/charts/AdminDashboardChartsSection";
import { toast } from "@/lib/toast";

const ADMIN_DETAIL_CELL = "px-1.5 py-1 [&_dd]:mt-0 [&_dd]:text-xs [&_dt]:text-[10px]";
const ADMIN_MUTED_ITEM = "px-2 py-1.5";

function AdminMiniStatGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-deep-teal/8 bg-deep-teal/[0.02] px-1.5 py-1"
        >
          <p className="text-[10px] leading-tight text-deep-teal/45">{item.label}</p>
          <p className="text-xs font-medium tabular-nums leading-tight text-deep-teal">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

const ORDER_FILTERS: { id: AdminDashboardOrderFilter; label: string }[] = [
  { id: "recent", label: "Recent" },
  { id: "pending_shipment", label: "Pending ship" },
  { id: "flagged", label: "Flagged" },
];

const AdminPaymentMixChart = dynamic(
  () =>
    import("@/components/portal/admin/charts/AdminPaymentMixChart").then(
      (mod) => mod.AdminPaymentMixChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-44 w-full rounded-lg" />,
  },
);

function AdminKpiStrip({
  items,
}: {
  items: { href: string; label: string; value: string | number; hint: string }[];
}) {
  return (
    <ProviderDashboardCard className="w-full max-w-sm p-2 sm:max-w-md">
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="provider-dash-card-muted provider-dash-card-muted--neutral min-w-0 rounded-lg px-2 py-1.5 transition-colors hover:border-pacific-teal/20"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-deep-teal/45">
              {item.label}
            </p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-deep-teal sm:text-base">
              {item.value}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-deep-teal/50">
              {item.hint}
            </p>
          </Link>
        ))}
      </div>
    </ProviderDashboardCard>
  );
}

export function AdminDashboard() {
  const allOrders = useAdminOrdersStore((state) => state.allOrders);
  const refreshOrders = useAdminOrdersStore((state) => state.refreshOrders);
  const applications = useAdminPortalStore((state) => state.applications);
  const clinics = useAdminPortalStore((state) => state.clinics);
  const affiliates = useAdminPortalStore((state) => state.affiliates);
  const catalogProducts = useAdminPortalStore((state) => state.catalogProducts);
  const categories = useAdminPortalStore((state) => state.categories);
  const inventoryAlerts = useAdminPortalStore((state) => state.inventoryAlerts);
  const platformSettings = useAdminPortalStore((state) => state.platformSettings);
  const isHydrated = useAdminPortalStore((state) => state.isHydrated);
  const isLoading = useAdminPortalStore((state) => state.isLoading);
  const bootstrap = useAdminPortalStore((state) => state.bootstrap);

  const [orderFilter, setOrderFilter] = useState<AdminDashboardOrderFilter>("recent");

  const stats = useMemo(
    () =>
      computeAdminDashboardStats({
        orders: allOrders,
        applications,
        clinics,
        affiliates,
        catalogProducts: catalogProducts.length,
        categories: categories.length,
        inventoryAlerts,
        platformSettings,
      }),
    [
      allOrders,
      applications,
      clinics,
      affiliates,
      catalogProducts.length,
      categories.length,
      inventoryAlerts,
      platformSettings,
    ],
  );

  const pendingApplications = useMemo(
    () => applications.filter(isReviewableApplication).slice(0, 3),
    [applications],
  );

  const filteredOrders = useMemo(
    () => resolveDashboardOrders(allOrders, orderFilter),
    [allOrders, orderFilter],
  );

  const paymentMix = useMemo(() => resolveAdminPaymentMix(allOrders), [allOrders]);

  const topAffiliates = useMemo(
    () =>
      [...affiliates]
        .sort((a, b) => b.clinic_referral_count - a.clinic_referral_count)
        .slice(0, 4),
    [affiliates],
  );

  const handleRefresh = useCallback(async () => {
    const toastId = toast.loading("Refreshing dashboard…");
    try {
      await Promise.all([bootstrap(true), refreshOrders({ force: true })]);
      toast.dismiss(toastId);
      toast.success("Dashboard updated.");
    } catch {
      toast.dismiss(toastId);
      toast.error("Unable to refresh dashboard.");
    }
  }, [bootstrap, refreshOrders]);

  const loading = !isHydrated || isLoading;

  return (
    <PortalPageShell
      title="Admin Dashboard"
      subtitle="Platform overview across orders, catalog, payouts, and affiliates"
      actions={
        <FloatingToolbarActions>
          <FloatingToolbarAction
            label="Refresh"
            icon={frontierSidebarIcons.refreshCw}
            onClick={() => void handleRefresh()}
          />
          <FloatingToolbarAction
            label="Approvals"
            icon={frontierSidebarIcons.clipboardCheck}
            href="/portal/admin/approvals"
            primary={stats.pendingApprovals > 0}
          />
          <FloatingToolbarAction
            label="Orders"
            icon={frontierSidebarIcons.shoppingCart}
            href="/portal/admin/orders"
          />
        </FloatingToolbarActions>
      }
    >
      {loading ? (
        <p className="py-10 text-center text-sm text-deep-teal/50">Loading platform dashboard…</p>
      ) : (
        <div className="space-y-3">
          <AdminKpiStrip
            items={[
              {
                href: "/portal/admin/reports",
                label: "GMV",
                value: formatCurrency(stats.gmv),
                hint: `${stats.paidOrders} paid orders`,
              },
              {
                href: "/portal/admin/orders",
                label: "Total Orders",
                value: stats.totalOrders.toLocaleString(),
                hint: `${stats.pendingReviewOrders} pending review`,
              },
              {
                href: "/portal/admin/users",
                label: "Active Clinics",
                value: stats.activeClinics,
                hint: `${stats.totalPatients.toLocaleString()} patients`,
              },
              {
                href: "/portal/admin/approvals",
                label: "Pending Approvals",
                value: stats.pendingApprovals,
                hint: "Clinic applications awaiting review",
              },
            ]}
          />

          <AdminDashboardChartsSection orders={allOrders} />

          <div className="grid gap-3 xl:grid-cols-3">
            <PortalPageSection
              icon={frontierSidebarIcons.shoppingCart}
              title="Orders"
              subtitle="Payment mix and recent activity"
              className="xl:col-span-2"
              dense
            >
              <AdminPaymentMixChart data={paymentMix} compact />

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {ORDER_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setOrderFilter(filter.id)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      orderFilter === filter.id
                        ? "border-pacific-teal/30 bg-pacific-teal/10 text-deep-teal"
                        : "border-deep-teal/10 bg-pure-white text-deep-teal/60 hover:border-pacific-teal/20 hover:text-deep-teal"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 overflow-hidden rounded-lg border border-deep-teal/10">
                {filteredOrders.length === 0 ? (
                  <p className="px-3 py-5 text-center text-xs text-deep-teal/50">
                    No orders in this view yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-deep-teal/8">
                    {filteredOrders.map((order) => (
                      <li key={order.id}>
                        <Link
                          href="/portal/admin/orders"
                          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 transition-colors hover:bg-deep-teal/[0.03]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-deep-teal">
                              {order.orderNumber ?? order.id}
                            </p>
                            <p className="truncate text-xs text-deep-teal/55">
                              {order.clinicName} · {order.customerName ?? order.doctorName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-deep-teal">
                              {formatCurrency(order.total)}
                            </p>
                            <p className="text-xs text-deep-teal/55">
                              {PAYMENT_STATUS_LABELS[order.paymentStatus]} ·{" "}
                              {SHIPMENT_STATUS_LABELS[order.shipmentStatus]}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PortalPageSection>

            <PortalPageSection
              icon={frontierSidebarIcons.clipboardCheck}
              title="Approvals"
              dense
              className="h-full"
            >
              {pendingApplications.length === 0 ? (
                <p className="text-[11px] text-deep-teal/50">No pending applications.</p>
              ) : (
                <ul className="space-y-1">
                  {pendingApplications.map((application) => (
                    <li key={application.id}>
                      <Link
                        href="/portal/admin/approvals"
                        className="flex items-center justify-between gap-2 rounded-md border border-deep-teal/8 px-2 py-1.5 transition-colors hover:border-pacific-teal/20 hover:bg-deep-teal/[0.02]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-deep-teal">
                            {application.clinic_name || "Unnamed clinic"}
                          </p>
                          <p className="truncate text-[10px] text-deep-teal/50">
                            {formatPrimaryContactName(application) ?? application.email}
                          </p>
                        </div>
                        <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-pacific-teal/75">
                          {application.application_status.replaceAll("_", " ")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/portal/admin/approvals"
                className="mt-1.5 inline-block text-[10px] font-medium text-pacific-teal hover:underline"
              >
                Open approval queue →
              </Link>
            </PortalPageSection>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <PortalPageSection
              icon={frontierSidebarIcons.layoutGrid}
              title="Catalog"
              dense
              className="h-full"
            >
              <AdminMiniStatGrid
                items={[
                  { label: "Products", value: stats.catalogProducts },
                  { label: "Categories", value: stats.catalogCategories },
                  { label: "Stock alerts", value: stats.inventoryAlerts },
                  { label: "Out of stock", value: stats.outOfStockCount },
                ]}
              />
              <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px]">
                <Link href="/portal/admin/catalog" className="font-medium text-pacific-teal hover:underline">
                  Manage catalog →
                </Link>
                <Link href="/portal/admin/wms/inventory" className="font-medium text-pacific-teal hover:underline">
                  Inventory alerts →
                </Link>
              </div>
            </PortalPageSection>

            <PortalPageSection
              icon={frontierSidebarIcons.wallet}
              title="Payouts"
              dense
              className="h-full"
            >
              <AdminMiniStatGrid
                items={[
                  { label: "Platform revenue", value: formatCurrency(stats.platformRevenue) },
                  { label: "Commission", value: `${stats.commissionPercent}%` },
                  { label: "Payout threshold", value: formatCurrency(stats.payoutThreshold) },
                  { label: "Frequency", value: stats.payoutFrequency.replaceAll("_", " ") },
                ]}
              />
              <Link
                href="/portal/admin/payouts"
                className="mt-1.5 inline-block text-[10px] font-medium text-pacific-teal hover:underline"
              >
                Open payouts →
              </Link>
            </PortalPageSection>

            <PortalPageSection
              icon={frontierSidebarIcons.handshake}
              title="Affiliates"
              subtitle="Referral network performance"
              dense
            >
              <div className="grid grid-cols-2 gap-1.5">
                <PortalDetailCell label="Affiliates" value={stats.affiliateCount} className={ADMIN_DETAIL_CELL} />
                <PortalDetailCell label="Clinic referrals" value={stats.totalReferrals} className={ADMIN_DETAIL_CELL} />
              </div>
              {topAffiliates.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {topAffiliates.map((affiliate) => (
                    <li
                      key={affiliate.id}
                      className={`provider-dash-card-muted provider-dash-card-muted--neutral flex items-center justify-between gap-2 ${ADMIN_MUTED_ITEM}`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-deep-teal">
                          {affiliate.affiliate_code}
                        </p>
                        <p className="truncate text-[11px] text-deep-teal/55">{affiliate.email}</p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-deep-teal">
                        {affiliate.clinic_referral_count}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Link
                href="/portal/admin/affiliates"
                className="mt-2 inline-block text-[11px] font-medium text-pacific-teal hover:underline"
              >
                Manage affiliates →
              </Link>
            </PortalPageSection>
          </div>
        </div>
      )}
    </PortalPageShell>
  );
}
