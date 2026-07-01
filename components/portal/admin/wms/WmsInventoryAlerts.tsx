"use client";

import Link from "next/link";
import { WmsSubNav } from "@/components/portal/admin/wms/WmsSubNav";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { toolbarBtnClass } from "@/components/portal/shared/PortalPageToolbar";
import { useShallow } from "@/lib/hooks/zustand";
import { useAdminPortalStore } from "@/stores/admin-portal-store";
import type { InventoryAlertLevel } from "@/lib/wms/types";
import { toast } from "@/lib/toast";

function AlertBadge({ level }: { level: InventoryAlertLevel }) {
  const styles: Record<InventoryAlertLevel, string> = {
    low_stock: "bg-coral-blush text-deep-teal",
    out_of_stock: "bg-coral-blush/60 text-deep-teal",
  };
  const labels: Record<InventoryAlertLevel, string> = {
    low_stock: "Low stock",
    out_of_stock: "Out of stock",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-light ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

export function WmsInventoryAlerts() {
  const { inventoryAlerts, isLoading, refreshInventoryAlerts } = useAdminPortalStore(
    useShallow((state) => ({
      inventoryAlerts: state.inventoryAlerts,
      isLoading: state.isLoading,
      refreshInventoryAlerts: state.refreshInventoryAlerts,
    })),
  );

  const lowStock = inventoryAlerts.filter((alert) => alert.level === "low_stock");
  const outOfStock = inventoryAlerts.filter((alert) => alert.level === "out_of_stock");

  return (
    <PortalPageShell
      title="Inventory Alerts"
      subtitle={
        isLoading ? "Loading inventory…" : `${inventoryAlerts.length} products need attention`
      }
      actions={
        <button
          type="button"
          onClick={() => void refreshInventoryAlerts()}
          className={toolbarBtnClass}
        >
          Refresh
        </button>
      }
    >
      <WmsSubNav />

      {isLoading ? (
        <p className="py-12 text-center text-sm text-deep-teal/50">Loading inventory alerts…</p>
      ) : inventoryAlerts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-deep-teal/15 px-6 py-16 text-center text-sm text-deep-teal/50">
          All products are adequately stocked.
        </p>
      ) : null}

      {outOfStock.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-light text-deep-teal">Out of stock</h2>
          {outOfStock.map((alert) => (
            <article key={alert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-coral-blush bg-coral-blush/40 p-4">
              <div>
                <p className="font-light text-deep-teal">{alert.productName}</p>
                <p className="text-xs text-deep-teal/45">{alert.sku} · 0 units (threshold {alert.threshold})</p>
              </div>
              <div className="flex items-center gap-3">
                <AlertBadge level={alert.level} />
                <button
                  type="button"
                  onClick={() => toast.success(`Restock request created for ${alert.productName}.`)}
                  className="rounded-full bg-deep-teal px-4 py-2 text-sm font-light text-pure-white hover:bg-pacific-teal"
                >
                  Restock
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {lowStock.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-light text-deep-teal">Low stock</h2>
          {lowStock.map((alert) => (
            <article key={alert.id} className="provider-dash-card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-light text-deep-teal">{alert.productName}</p>
                <p className="text-xs text-deep-teal/45">
                  {alert.sku} · {alert.currentStock} units (threshold {alert.threshold})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <AlertBadge level={alert.level} />
                <Link
                  href={`/portal/admin/products/${alert.productId}/stock`}
                  className="rounded-full border border-deep-teal/15 px-4 py-2 text-sm font-light text-deep-teal hover:bg-pacific-teal/12"
                >
                  Restock
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </PortalPageShell>
  );
}
