"use client";

import Link from "next/link";
import { Tooltip } from "@/components/ui/Tippy";
import {
  ProductCardActionRow,
  ProductCardNameRow,
  ProductCardStatsRow,
  productCardBodyClass,
  productStatValue,
} from "@/components/portal/shared/ProductCardLayout";
import { ProductCardHoverMedia } from "@/components/portal/shared/ProductCardHoverMedia";
import type { CatalogProduct, CatalogStockStatus } from "@/lib/products/catalog-types";
import { CATALOG_STOCK_STATUS_LABELS, getHoverImage, getPrimaryImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/products/catalog-types";

const STOCK_TIPS: Record<CatalogStockStatus, string> = {
  in_stock: "Available to order from the catalog.",
  low: "Limited inventory — order soon.",
  out_of_stock: "Currently unavailable.",
};

const STOCK_CLASS: Record<CatalogStockStatus, string> = {
  in_stock: "provider-product-stock--in",
  low: "provider-product-stock--low",
  out_of_stock: "provider-product-stock--out",
};

type ProductGridCardProps = {
  product: CatalogProduct;
  isFavorite: boolean;
  inMyStore: boolean;
  onToggleFavorite: () => void;
  onToggleStore: () => void;
  view: "grid" | "list";
  isStoreUpdating?: boolean;
  storeTourId?: string;
};

function StockBadge({ status }: { status: CatalogStockStatus }) {
  return (
    <Tooltip content={STOCK_TIPS[status]}>
      <span
        className={`cursor-help rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${STOCK_CLASS[status]}`}
      >
        {CATALOG_STOCK_STATUS_LABELS[status]}
      </span>
    </Tooltip>
  );
}

function formatClinicPrice(clinicCost: number | null) {
  return clinicCost != null ? `$${clinicCost.toFixed(2)}` : "—";
}

function StoreToggle({
  inMyStore,
  isStoreUpdating,
  onToggleStore,
  storeTourId,
}: {
  inMyStore: boolean;
  isStoreUpdating: boolean;
  onToggleStore: () => void;
  storeTourId?: string;
}) {
  return (
    <button
      type="button"
      disabled={isStoreUpdating}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggleStore();
      }}
      data-tour={storeTourId}
      className={`provider-product-toggle relative z-20 ${inMyStore ? "provider-product-toggle--on" : ""} disabled:opacity-50`}
    >
      <span
        className={`provider-product-toggle-dot size-2 rounded-full ${inMyStore ? "bg-pacific-teal" : "bg-deep-teal/25"}`}
        aria-hidden
      />
      {inMyStore ? "In My Store" : "Add to store"}
    </button>
  );
}

export function ProductGridCard({
  product,
  isFavorite,
  inMyStore,
  onToggleFavorite,
  onToggleStore,
  view,
  isStoreUpdating = false,
  storeTourId,
}: ProductGridCardProps) {
  const imageUrl = getPrimaryImage(product) ?? DEFAULT_PRODUCT_IMAGE;
  const hoverImageUrl = getHoverImage(product);
  const detailHref = `/portal/doctor/inventory/${product.slug ?? product.id}`;
  const category = product.category.name ?? "Uncategorized";

  const nameNode = (
    <span className="transition-colors group-hover:text-pacific-teal">{product.name}</span>
  );

  const storeToggle = (
    <StoreToggle
      inMyStore={inMyStore}
      isStoreUpdating={isStoreUpdating}
      onToggleStore={onToggleStore}
      storeTourId={storeTourId}
    />
  );

  const favoriteButton = (
    <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onToggleFavorite();
        }}
        className={`provider-product-icon-btn relative z-20 size-9 text-sm ${isFavorite ? "text-pacific-teal" : "text-deep-teal/55"}`}
        aria-label="Toggle favorite"
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </Tooltip>
  );

  const cardLink = (
    <Link
      href={detailHref}
      className="absolute inset-0 z-10 rounded-[inherit]"
      aria-label={`View ${product.name}`}
    />
  );

  if (view === "list") {
    return (
      <article className="provider-product-card group relative flex cursor-pointer gap-4 p-4">
        <ProductCardHoverMedia
          primarySrc={imageUrl}
          hoverSrc={hoverImageUrl}
          className="relative z-0 size-24 shrink-0 rounded-xl"
          imageClassName="object-contain p-2"
          sizes="96px"
        />
        <div className="relative z-0 flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <ProductCardNameRow name={nameNode} category={category} />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StockBadge status={product.stock_status} />
            </div>
          </div>

          <ProductCardStatsRow
            left={productStatValue(product.stock_count)}
            right={productStatValue(formatClinicPrice(product.clinic_cost))}
          />

          {product.description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-deep-teal/60">{product.description}</p>
          ) : null}

          <ProductCardActionRow label="My Store">{storeToggle}</ProductCardActionRow>
        </div>
        <div className="absolute right-4 top-4 z-20">{favoriteButton}</div>
        {cardLink}
      </article>
    );
  }

  return (
    <article className="provider-product-card group relative flex cursor-pointer flex-col">
      <ProductCardHoverMedia
        primarySrc={imageUrl}
        hoverSrc={hoverImageUrl}
        className="relative z-0 aspect-[4/3]"
        sizes="(max-width:768px) 100vw, 33vw"
        overlay={
          <div className="absolute left-3 top-3 z-0">
            <StockBadge status={product.stock_status} />
          </div>
        }
      />
      <div className="absolute right-3 top-3 z-20">{favoriteButton}</div>

      <div className={`${productCardBodyClass()} relative z-0`}>
        <ProductCardNameRow name={nameNode} category={category} />
        <ProductCardStatsRow
          left={productStatValue(product.stock_count)}
          right={productStatValue(formatClinicPrice(product.clinic_cost))}
        />

        {product.description ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-deep-teal/60">{product.description}</p>
        ) : null}

        <ProductCardActionRow label="My Store">{storeToggle}</ProductCardActionRow>
      </div>
      {cardLink}
    </article>
  );
}
