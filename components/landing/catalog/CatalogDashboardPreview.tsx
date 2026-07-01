"use client";

import { Grid3x3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { IOSSegmentedControl } from "@/components/ui/IOSSegmentedControl";
import {
  CATALOG_PREVIEW_PRODUCTS,
  CATALOG_PREVIEW_TABS,
  filterCatalogPreviewProducts,
  type CatalogPreviewTab,
} from "@/lib/landing/catalog-section";
import { CatalogProductTile } from "./CatalogProductTile";

const TAB_SEGMENTS = CATALOG_PREVIEW_TABS.map((tab) => ({
  value: tab,
  label: tab,
}));

export function CatalogDashboardPreview() {
  const [activeTab, setActiveTab] = useState<CatalogPreviewTab>("Peptides");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(
    () => filterCatalogPreviewProducts(CATALOG_PREVIEW_PRODUCTS, activeTab, searchQuery),
    [activeTab, searchQuery],
  );

  const tabProductCount = useMemo(
    () => CATALOG_PREVIEW_PRODUCTS.filter((product) => product.tab === activeTab).length,
    [activeTab],
  );

  return (
    <div
      className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-pure-white shadow-[0_32px_80px_rgba(0,0,0,0.35)] sm:rounded-[1.75rem]"
      aria-label="Catalog dashboard preview"
    >
      <div className="flex items-center gap-2 border-b border-deep-teal/8 bg-surface-muted/80 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
        </div>
        <span className="ml-1.5 font-sans text-xs font-normal text-deep-teal/45">Inventory</span>
      </div>

      <div className="border-b border-deep-teal/8 px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-sans text-lg font-normal tracking-[-0.01em] text-deep-teal sm:text-xl">
              Inventory
            </h3>
            <p className="mt-0.5 font-sans text-xs font-normal text-deep-teal/55 sm:text-sm">
              {filteredProducts.length} of {tabProductCount} products · {activeTab}
            </p>
          </div>

          <IOSSegmentedControl
            value={activeTab}
            onChange={setActiveTab}
            segments={TAB_SEGMENTS}
            aria-label="Catalog product type"
            className="max-w-full"
          />
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search catalog</span>
            <Search
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-deep-teal/35"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products, SKUs, categories…"
              className="h-9 w-full rounded-full border border-deep-teal/10 bg-surface-muted/70 pl-9 pr-3 font-sans text-sm font-normal text-deep-teal outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-deep-teal/35 focus:border-pacific-teal/35 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-pacific-teal)_12%,transparent)]"
            />
          </label>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-deep-teal/10 bg-pure-white px-3.5 font-sans text-sm font-normal text-deep-teal/70 transition-[background-color,border-color] duration-200 hover:border-pacific-teal/20 hover:bg-surface-muted/60 active:scale-[0.98]"
            aria-pressed="true"
          >
            <Grid3x3 size={15} strokeWidth={1.5} className="text-pacific-teal" aria-hidden />
            Grid
          </button>
        </div>
      </div>

      <div className="bg-surface-muted/35 p-3 sm:p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {filteredProducts.map((product) => (
              <CatalogProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[9rem] flex-col items-center justify-center rounded-[1rem] border border-dashed border-deep-teal/12 bg-pure-white/70 px-4 py-6 text-center">
            <p className="font-sans text-sm font-normal text-deep-teal">No products match</p>
            <p className="mt-1.5 max-w-sm font-sans text-xs font-normal text-deep-teal/55">
              Try a different search term or switch to another catalog tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
