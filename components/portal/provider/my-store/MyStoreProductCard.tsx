"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Tooltip } from "@/components/ui/Tippy";
import {
  ProductCardNameRow,
  ProductCardStatsRow,
  productCardBodyClass,
  productStatValue,
} from "@/components/portal/shared/ProductCardLayout";
import { ProductCardHoverMedia } from "@/components/portal/shared/ProductCardHoverMedia";
import { getStoreProductImages, type StoreProduct } from "@/lib/products/catalog-types";

type MyStoreProductCardProps = {
  product: StoreProduct;
  onRetailPriceChange: (price: number) => void;
  onVisibilityChange: (isVisible: boolean) => void;
  onRemove: () => void;
  isUpdating?: boolean;
  visibilityTourId?: string;
};

const springGentle = { type: "spring" as const, stiffness: 360, damping: 32, mass: 0.9 };

export function MyStoreProductCard({
  product,
  onRetailPriceChange,
  onVisibilityChange,
  onRemove,
  isUpdating = false,
  visibilityTourId,
}: MyStoreProductCardProps) {
  const reduceMotion = useReducedMotion();
  const [draftPrice, setDraftPrice] = useState(String(product.retail_price));
  const [priceDirty, setPriceDirty] = useState(false);

  useEffect(() => {
    setDraftPrice(String(product.retail_price));
    setPriceDirty(false);
  }, [product.retail_price]);

  function commitPrice() {
    const parsed = Number(draftPrice);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setDraftPrice(String(product.retail_price));
      setPriceDirty(false);
      return;
    }
    if (parsed !== product.retail_price) {
      onRetailPriceChange(parsed);
    }
    setPriceDirty(false);
  }

  const { primary: imageUrl, hover: hoverImageUrl } = getStoreProductImages(product);

  return (
    <motion.article
      layout
      className={`provider-product-card group flex flex-col ${isUpdating ? "provider-product-card--updating" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : springGentle}
    >
      <Tooltip content={`Remove ${product.name} from My Store`}>
        <motion.button
          type="button"
          onClick={onRemove}
          disabled={isUpdating}
          aria-label={`Remove ${product.name} from My Store`}
          className="provider-product-icon-btn absolute right-3 top-3 z-10 size-9 text-lg leading-none text-deep-teal/60 hover:text-deep-teal disabled:opacity-50"
          whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: -4 }}
          whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        >
          ×
        </motion.button>
      </Tooltip>
      {!product.is_visible ? (
        <Tooltip content="Hidden from your patient storefront">
          <span className="provider-product-hidden-badge absolute left-3 top-3 z-10 cursor-help rounded-full border border-deep-teal/15 bg-deep-teal/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pure-white">
            Hidden
          </span>
        </Tooltip>
      ) : null}

      <ProductCardHoverMedia
        primarySrc={imageUrl}
        hoverSrc={hoverImageUrl}
        className={`aspect-[4/3] ${product.is_visible ? "" : "opacity-55"}`}
        sizes="(max-width:768px) 100vw, 33vw"
      />

      <div className={productCardBodyClass()}>
        <ProductCardNameRow
          name={product.name}
          category={product.category.name ?? "Uncategorized"}
        />

        <ProductCardStatsRow
          left={productStatValue(product.stock_count ?? 0)}
          right={productStatValue(
            product.clinic_cost != null ? `$${product.clinic_cost.toFixed(2)}` : "—",
          )}
        />

        <div className="provider-product-card-footer space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-deep-teal/65">Retail price</span>
            <div className="flex items-center gap-2">
              <div className="provider-product-price-field w-full max-w-[8rem]">
                <span className="text-sm font-medium text-deep-teal/60">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftPrice}
                  disabled={isUpdating}
                  onChange={(e) => {
                    setDraftPrice(e.target.value);
                    setPriceDirty(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitPrice();
                  }}
                  className="w-full bg-transparent pl-1 text-sm font-medium text-deep-teal outline-none disabled:opacity-60"
                />
              </div>
              <AnimatePresence mode="popLayout">
                {priceDirty ? (
                  <motion.button
                    key="save"
                    type="button"
                    disabled={isUpdating}
                    onClick={commitPrice}
                    className="provider-product-save-btn shrink-0 rounded-full bg-deep-teal px-3 py-1.5 text-xs font-medium text-pure-white transition-colors hover:bg-pacific-teal disabled:opacity-60"
                    initial={reduceMotion ? false : { opacity: 0, x: 8, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: 8, scale: 0.9 }}
                    transition={reduceMotion ? { duration: 0 } : springGentle}
                    whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  >
                    Save
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-deep-teal/65">Visible to customers</span>
            <motion.button
              type="button"
              disabled={isUpdating}
              onClick={() => onVisibilityChange(!product.is_visible)}
              data-tour={visibilityTourId}
              className={`provider-product-toggle ${product.is_visible ? "provider-product-toggle--on" : ""} disabled:opacity-50`}
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            >
              <span
                className={`provider-product-toggle-dot size-2 rounded-full ${
                  product.is_visible ? "bg-pacific-teal" : "bg-deep-teal/25"
                }`}
                aria-hidden
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={product.is_visible ? "visible" : "hidden"}
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: reduceMotion ? 0 : 0.28 }}
                >
                  {product.is_visible ? "Visible" : "Hidden"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
