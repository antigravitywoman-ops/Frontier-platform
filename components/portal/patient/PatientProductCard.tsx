"use client";

import { Tooltip } from "@/components/ui/Tippy";
import {
  ProductCardNameRow,
  ProductCardStatsRow,
  productCardBodyClass,
  productStatValue,
} from "@/components/portal/shared/ProductCardLayout";
import { ProductCardHoverMedia } from "@/components/portal/shared/ProductCardHoverMedia";
import type { BrowseProduct } from "@/lib/patient-portal/types";
import { STOCK_STATUS_LABELS, type StockStatus } from "@/lib/products/types";

const PATIENT_STOCK_TIPS: Record<StockStatus, string> = {
  in_stock: "Ready to order from your clinic.",
  low_stock: "Limited stock — order soon.",
  out_of_stock: "Currently unavailable to order.",
};

const STOCK_CLASS: Record<StockStatus, string> = {
  in_stock: "provider-product-stock--in",
  low_stock: "provider-product-stock--low",
  out_of_stock: "provider-product-stock--out",
};

type PatientProductCardProps = {
  product: BrowseProduct;
  view: "grid" | "list";
  onRequest: () => void;
  onOrder: () => void;
  onInfo: () => void;
};

function StockBadge({ product }: { product: BrowseProduct }) {
  const status = product.stockStatus;
  return (
    <Tooltip content={PATIENT_STOCK_TIPS[status]}>
      <span
        className={`cursor-help rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${STOCK_CLASS[status]}`}
      >
        {STOCK_STATUS_LABELS[status]}
      </span>
    </Tooltip>
  );
}

export function PatientProductCard({
  product,
  view,
  onRequest,
  onOrder,
  onInfo,
}: PatientProductCardProps) {
  const nameNode = (
    <span className="transition-colors group-hover:text-pacific-teal">{product.name}</span>
  );
  const statsLeft = productStatValue(`$${product.price}`);
  const statsRight = <StockBadge product={product} />;

  const actionButtons = (
    <>
      <Tooltip content="View product details">
        <button
          type="button"
          onClick={onInfo}
          aria-label="Product details"
          className="provider-product-icon-btn relative z-20 px-2 py-1 text-sm text-deep-teal/60"
        >
          ℹ
        </button>
      </Tooltip>
      <button
        type="button"
        disabled={product.stockStatus === "out_of_stock"}
        onClick={onOrder}
        className="provider-product-toggle relative z-20 disabled:opacity-50"
      >
        Order
      </button>
      <button
        type="button"
        onClick={onRequest}
        className="provider-product-toggle relative z-20"
      >
        Request
      </button>
    </>
  );

  if (view === "list") {
    return (
      <article className="provider-product-card group relative flex cursor-pointer gap-4 p-4">
        <ProductCardHoverMedia
          primarySrc={product.image}
          className="relative z-0 size-24 shrink-0 rounded-xl"
          imageClassName="object-contain p-2"
          sizes="96px"
        />
        <div className="relative z-0 flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <ProductCardNameRow name={nameNode} category={product.category} />
            </div>
            <div className="shrink-0">
              <StockBadge product={product} />
            </div>
          </div>
          <ProductCardStatsRow
            left={statsLeft}
            right={statsRight}
            leftLabel="Price"
            rightLabel="Stock"
          />
          <p className="line-clamp-2 text-sm leading-relaxed text-deep-teal/60">
            {product.shortDescription}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">{actionButtons}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="provider-product-card group relative flex cursor-pointer flex-col">
      <ProductCardHoverMedia
        primarySrc={product.image}
        className="relative z-0 aspect-[4/3]"
        sizes="(max-width:768px) 50vw, 33vw"
        overlay={
          <div className="absolute left-3 top-3 z-0">
            <StockBadge product={product} />
          </div>
        }
      />
      <div className="absolute right-3 top-3 z-20">
        <Tooltip content="View product details">
          <button
            type="button"
            onClick={onInfo}
            aria-label="Product details"
            className="provider-product-icon-btn size-9 text-sm text-deep-teal/70"
          >
            ℹ
          </button>
        </Tooltip>
      </div>

      <div className={`${productCardBodyClass()} relative z-0`}>
        <ProductCardNameRow name={nameNode} category={product.category} />
        <ProductCardStatsRow
          left={statsLeft}
          right={statsRight}
          leftLabel="Price"
          rightLabel="Stock"
        />
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-deep-teal/60">
          {product.shortDescription}
        </p>
        <div className="provider-product-card-footer flex flex-col gap-2">
          <button
            type="button"
            disabled={product.stockStatus === "out_of_stock"}
            onClick={onOrder}
            className="provider-product-toggle w-full justify-center disabled:opacity-50"
          >
            Order
          </button>
          <button
            type="button"
            onClick={onRequest}
            className="provider-product-toggle w-full justify-center"
          >
            Request from Doctor
          </button>
        </div>
      </div>
    </article>
  );
}
