"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { authInputClassName } from "@/components/auth/AuthShell";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { toolbarBtnClass } from "@/components/portal/shared/PortalPageToolbar";
import { listProducts, updateProductStock } from "@/lib/admin/inventory/api";
import type { InventoryProduct } from "@/lib/admin/inventory/types";
import { STOCK_STATUS_LABELS } from "@/lib/admin/inventory/types";
import { showError, toast } from "@/lib/toast";

export function AdminStockOverview() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { stock: string; threshold: string }>>({});

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listProducts({ page: 1, limit: 100 });
      setProducts(response.products);
      setDrafts(
        Object.fromEntries(
          response.products.map((product) => [
            product.id,
            {
              stock: String(product.stock_count),
              threshold: String(product.low_stock_threshold),
            },
          ]),
        ),
      );
    } catch (error) {
      showError(error, "Unable to load stock overview.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateDraft(productId: string, field: "stock" | "threshold", value: string) {
    setDrafts((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }));
  }

  async function handleSaveStock(product: InventoryProduct) {
    const draft = drafts[product.id];
    if (!draft) return;

    setSavingId(product.id);
    try {
      const response = await updateProductStock(product.id, {
        stock_count: Number(draft.stock),
        low_stock_threshold: Number(draft.threshold),
      });
      toast.success(response.message ?? "Stock updated.");
      await loadProducts();
    } catch (error) {
      showError(error, "Unable to update stock.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <PortalPageShell
      title="Stock Management"
      subtitle="Update inventory levels directly from the catalog"
      actions={
        <button
          type="button"
          onClick={() => void loadProducts()}
          className={toolbarBtnClass}
        >
          Refresh
        </button>
      }
    >
      <div className="overflow-x-auto provider-dash-card">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-deep-teal/10 bg-deep-teal/[0.02] text-xs uppercase tracking-wide text-deep-teal/45">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock count</th>
              <th className="px-4 py-3">Threshold</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-deep-teal/50">
                  Loading stock data…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-deep-teal/50">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-deep-teal/5">
                  <td className="px-4 py-3 font-light text-deep-teal">{product.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={drafts[product.id]?.stock ?? product.stock_count}
                      onChange={(e) => updateDraft(product.id, "stock", e.target.value)}
                      className={`${authInputClassName} w-24 py-1.5`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={drafts[product.id]?.threshold ?? product.low_stock_threshold}
                      onChange={(e) => updateDraft(product.id, "threshold", e.target.value)}
                      className={`${authInputClassName} w-24 py-1.5`}
                    />
                  </td>
                  <td className="px-4 py-3">{STOCK_STATUS_LABELS[product.stock_status]}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={savingId === product.id}
                      onClick={() => void handleSaveStock(product)}
                      className="text-xs text-deep-teal hover:underline disabled:opacity-50"
                    >
                      {savingId === product.id ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Link href="/portal/admin/catalog" className="text-sm text-deep-teal hover:underline">
        ← Back to catalog
      </Link>
    </PortalPageShell>
  );
}
