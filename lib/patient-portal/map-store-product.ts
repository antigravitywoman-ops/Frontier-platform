import type { BrowseProduct } from "@/lib/patient-portal/types";
import type { PatientStoreProduct } from "@/lib/patient-portal/store-types";
import { getDefaultProductImages, isUsableCatalogImage } from "@/lib/products/catalog-types";
import type { StockStatus } from "@/lib/products/types";

function mapStockStatus(status: PatientStoreProduct["stock_status"]): StockStatus {
  if (status === "low") return "low_stock";
  if (status === "out_of_stock") return "out_of_stock";
  return "in_stock";
}

function primaryImage(product: PatientStoreProduct) {
  const fromCatalog =
    product.images.find((image) => image.is_primary && isUsableCatalogImage(image.url))?.url ??
    product.images.find((image) => isUsableCatalogImage(image.url))?.url ??
    null;
  if (fromCatalog) return fromCatalog;
  if (isUsableCatalogImage(product.image_url)) return product.image_url!;
  return getDefaultProductImages(product.product_type).primary;
}

export function mapPatientStoreProduct(product: PatientStoreProduct): BrowseProduct {
  const description = product.description?.trim() ?? "";
  const shortDescription =
    description.length > 120 ? `${description.slice(0, 117).trimEnd()}…` : description;

  return {
    id: product.store_id,
    productId: product.product_id,
    name: product.name,
    category: product.category.name ?? "Uncategorized",
    shortDescription: shortDescription || "No description available.",
    description: description || "No description available.",
    directions: product.directions?.trim() || "Follow your physician's directions.",
    image: primaryImage(product),
    price: product.retail_price,
    stock: product.stock_count ?? 0,
    lowStockThreshold: product.low_stock_threshold,
    stockStatus: mapStockStatus(product.stock_status),
    productType: product.product_type,
  };
}
