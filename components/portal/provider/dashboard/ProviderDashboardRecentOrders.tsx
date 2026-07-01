"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { useOrders } from "@/context/OrdersProvider";
import { getPatientInitials } from "@/lib/patients/types";
import { REVIEW_STATUS_LABELS, type Order, type ReviewStatus } from "@/lib/orders/types";

const RECENT_ORDER_LIMIT = 8;

function orderSortDate(order: Order) {
  const placed = order.timeline.find((entry) => entry.status === "Order placed")?.date;
  if (placed) return new Date(placed).getTime();
  if (order.paymentDate) return new Date(order.paymentDate).getTime();
  return 0;
}

function formatOrderLabel(order: Order) {
  const label = order.orderNumber ?? order.id;
  if (label.length <= 18) return label;
  return `${label.slice(0, 10)}…${label.slice(-4)}`;
}

function formatDisplayName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function ReviewStatusPill({ status }: { status?: ReviewStatus }) {
  if (!status) {
    return <span className="text-sm text-deep-teal/40">—</span>;
  }

  const styles: Record<ReviewStatus, string> = {
    pending_review: "bg-coral-blush/90 text-deep-teal/80 ring-1 ring-coral-blush",
    approved: "bg-pacific-teal/12 text-pacific-teal ring-1 ring-pacific-teal/15",
    rejected: "bg-deep-teal/6 text-deep-teal/55 ring-1 ring-deep-teal/8",
    cancelled: "bg-deep-teal/5 text-deep-teal/45 ring-1 ring-deep-teal/6",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide sm:text-xs ${styles[status]}`}
    >
      {REVIEW_STATUS_LABELS[status]}
    </span>
  );
}

export function ProviderDashboardRecentOrders() {
  const { orders, isLoading } = useOrders();

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => orderSortDate(b) - orderSortDate(a)).slice(0, RECENT_ORDER_LIMIT),
    [orders],
  );

  const pendingCount = useMemo(
    () => orders.filter((order) => order.reviewStatus === "pending_review").length,
    [orders],
  );

  return (
    <ProviderDashboardCard
      noPadding
      data-tour="doctor-dashboard-recent-orders"
      className="provider-dash-recent-orders-card flex h-full min-h-0 flex-col overflow-hidden"
    >
      <div className="shrink-0 border-b border-deep-teal/6 px-4 py-3 sm:px-5">
        <ProviderDashboardSectionHeader
          title="Recent orders"
          subtitle={
            isLoading
              ? "Loading…"
              : `${orders.length} total${pendingCount > 0 ? ` · ${pendingCount} pending review` : ""}`
          }
          action={
            <Link
              href="/portal/doctor/orders"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-pacific-teal transition-colors hover:bg-pacific-teal/10 hover:text-deep-teal"
            >
              View all
            </Link>
          }
          className="mb-0"
        />
      </div>

      <div className="provider-dash-recent-orders flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <p className="flex flex-1 items-center justify-center text-sm text-deep-teal/50">
            Loading orders…
          </p>
        ) : recentOrders.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-sm text-deep-teal/50">
            No orders yet.
          </p>
        ) : (
          <>
            <div className="provider-dash-recent-orders-head grid shrink-0 grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,0.95fr)_4.5rem] gap-3 px-4 py-2.5 sm:px-5">
              <span>Order</span>
              <span>Patient</span>
              <span>Status</span>
              <span className="text-right">Total</span>
            </div>

            <div className="provider-dash-recent-orders-body flex min-h-0 flex-1 flex-col">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/portal/doctor/orders/${order.id}`}
                  className="provider-dash-recent-orders-row grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_minmax(0,0.95fr)_4.5rem] items-center gap-3 px-4 py-2.5 sm:px-5"
                  title={order.orderNumber ?? order.id}
                >
                  <span className="truncate font-mono text-xs font-medium text-deep-teal/75 sm:text-sm">
                    {formatOrderLabel(order)}
                  </span>

                  {order.customerName ? (
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pacific-teal/12 text-[11px] font-semibold text-pacific-teal ring-1 ring-pacific-teal/10">
                        {getPatientInitials(formatDisplayName(order.customerName))}
                      </span>
                      <span className="truncate text-sm font-medium text-deep-teal">
                        {formatDisplayName(order.customerName)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-deep-teal/40">—</span>
                  )}

                  <span className="min-w-0">
                    <ReviewStatusPill status={order.reviewStatus} />
                  </span>

                  <span className="text-right text-sm font-semibold tabular-nums text-deep-teal">
                    ${order.total.toFixed(0)}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {!isLoading && recentOrders.length > 0 ? (
        <div className="mt-auto shrink-0 border-t border-deep-teal/6 bg-surface-muted/30 px-4 py-2.5 sm:px-5">
          <Link
            href="/portal/doctor/orders"
            className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-deep-teal/65 transition-colors hover:bg-pacific-teal/8 hover:text-pacific-teal"
          >
            <span>Open orders workspace</span>
            <span className="text-pacific-teal/70" aria-hidden>
              →
            </span>
          </Link>
        </div>
      ) : null}
    </ProviderDashboardCard>
  );
}
