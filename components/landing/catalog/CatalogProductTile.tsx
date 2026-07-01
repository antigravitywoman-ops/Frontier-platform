import {
  ProductCardActionRow,
  ProductCardNameRow,
  ProductCardStatsRow,
  productCardBodyClass,
  productStatValue,
} from "@/components/portal/shared/ProductCardLayout";
import type { CatalogPreviewProduct } from "@/lib/landing/catalog-section";
import { CatalogProductFrameTurntable } from "./CatalogProductFrameTurntable";

const STATUS_LABELS = {
  in_stock: "In stock",
  low: "Low stock",
} as const;

const STATUS_CLASS = {
  in_stock: "provider-product-stock--in",
  low: "provider-product-stock--low",
} as const;

type CatalogProductTileProps = {
  product: CatalogPreviewProduct;
};

export function CatalogProductTile({ product }: CatalogProductTileProps) {
  return (
    <article className="provider-product-card catalog-preview-tile group relative flex flex-col">
      <div className="provider-product-card-media relative aspect-[5/3]">
        <div className="absolute inset-0 flex items-center justify-center px-2 py-1">
          <CatalogProductFrameTurntable
            productName={product.name}
            className="h-full max-h-[96%] w-full max-w-[72%]"
          />
        </div>
        <div className="absolute left-2.5 top-2.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-normal uppercase tracking-wide ${STATUS_CLASS[product.status]}`}
          >
            {STATUS_LABELS[product.status]}
          </span>
        </div>
      </div>

      <div className={productCardBodyClass(true)}>
        <ProductCardNameRow name={product.name} category={product.category} />
        <ProductCardStatsRow
          left={productStatValue(product.stock)}
          right={productStatValue(product.price)}
        />
        <ProductCardActionRow label="My Store" className="!pt-2.5">
          <span className="provider-product-toggle">
            <span className="provider-product-toggle-dot size-2 rounded-full bg-deep-teal/25" aria-hidden />
            Add to store
          </span>
        </ProductCardActionRow>
      </div>
    </article>
  );
}
