export type CatalogProductType = "peptides" | "pharmacy";

export type CatalogStockStatus = "in_stock" | "low" | "out_of_stock";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string | null;
  sku: string;
  product_type: CatalogProductType;
  description: string | null;
  directions: string | null;
  stock_status: CatalogStockStatus;
  stock_count: number;
  low_stock_threshold: number;
  status: "ACTIVE" | "INACTIVE";
  category: {
    id: string | null;
    name: string | null;
    slug: string | null;
  };
  images: { url: string; is_primary?: boolean }[];
  created_at: string;
  clinic_cost: number | null;
  in_my_store?: boolean;
  strength?: string | null;
  form?: string | null;
  best_use_within?: string | null;
  dea_schedule?: string | null;
};

export type StoreProduct = {
  store_id: string;
  product_id: string;
  name: string;
  sku: string;
  product_type: CatalogProductType | null;
  description: string | null;
  category: {
    id: string | null;
    name: string | null;
    slug: string | null;
  };
  stock_status: CatalogStockStatus | null;
  stock_count: number | null;
  clinic_cost: number | null;
  retail_price: number;
  image_url: string | null;
  is_visible: boolean;
  strength?: string | null;
  form?: string | null;
  dea_schedule?: string | null;
};

export type CatalogPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type PaginatedCatalogResponse = {
  status: boolean;
  products: CatalogProduct[];
  pagination: CatalogPagination;
};

export type CatalogProductResponse = {
  status: boolean;
  product: CatalogProduct;
};

export type PaginatedStoreResponse = {
  status: boolean;
  products: StoreProduct[];
  pagination: CatalogPagination;
  clinic_id: string;
  clinic_name: string;
};

export const CATALOG_PRODUCT_TYPE_LABELS: Record<CatalogProductType, string> = {
  peptides: "Peptides",
  pharmacy: "Pharmacy",
};

export const CATALOG_STOCK_STATUS_LABELS: Record<CatalogStockStatus, string> = {
  in_stock: "In stock",
  low: "Low stock",
  out_of_stock: "Out of stock",
};

export function defaultRetailPrice(clinicCost: number | null | undefined) {
  if (clinicCost == null || clinicCost <= 0) return 0;
  return Math.ceil(clinicCost * 1.35 * 100) / 100;
}

export const DEFAULT_PRODUCT_IMAGE = "/products/peptide-product.jpeg";
export const DEFAULT_PRODUCT_HOVER_IMAGE = "/products/pharmacy-medicine.jpeg";

export const PEPTIDE_PRODUCT_IMAGE = "/products/peptide-product.jpeg";
export const PEPTIDE_PRODUCT_HOVER_IMAGE = "/products/pharmacy-medicine.jpeg";
export const PHARMACY_PRODUCT_IMAGE = "/products/pharmacy-medicine.jpeg";
export const PHARMACY_PRODUCT_HOVER_IMAGE = "/products/peptide-product.jpeg";

const LEGACY_PRODUCT_PLACEHOLDER_IMAGES = new Set([
  "/brand/product-vial-2x-blend-hero.png",
  "/product-desktop-dashboard.png",
]);

export function isUsableCatalogImage(url: string | null | undefined) {
  if (!url?.trim()) return false;
  if (LEGACY_PRODUCT_PLACEHOLDER_IMAGES.has(url)) return false;
  return !Array.from(LEGACY_PRODUCT_PLACEHOLDER_IMAGES).some((placeholder) => url.endsWith(placeholder));
}

export function getDefaultProductImages(productType?: CatalogProductType | null) {
  if (productType === "pharmacy") {
    return {
      primary: PHARMACY_PRODUCT_IMAGE,
      hover: PHARMACY_PRODUCT_HOVER_IMAGE,
    };
  }

  return {
    primary: PEPTIDE_PRODUCT_IMAGE,
    hover: PEPTIDE_PRODUCT_HOVER_IMAGE,
  };
}

export function getPrimaryImage(product: Pick<CatalogProduct, "images" | "product_type">) {
  const fromCatalog =
    product.images.find((image) => image.is_primary && isUsableCatalogImage(image.url))?.url ??
    product.images.find((image) => isUsableCatalogImage(image.url))?.url ??
    null;
  if (fromCatalog) return fromCatalog;
  return getDefaultProductImages(product.product_type).primary;
}

export function resolveProductHoverSrc(
  primarySrc: string,
  catalogHover?: string | null,
  productType?: CatalogProductType | null,
) {
  if (catalogHover && catalogHover !== primarySrc) return catalogHover;

  const defaults = getDefaultProductImages(productType);
  const fallbacks = [defaults.hover, DEFAULT_PRODUCT_HOVER_IMAGE, DEFAULT_PRODUCT_IMAGE];
  return fallbacks.find((src) => src !== primarySrc) ?? null;
}

export function getHoverImage(product: Pick<CatalogProduct, "images" | "product_type">) {
  const primaryUrl = getPrimaryImage(product);

  let catalogHover: string | null = null;
  if (product.images.length >= 2) {
    catalogHover =
      product.images.find((image) => image.url && image.url !== primaryUrl && isUsableCatalogImage(image.url))
        ?.url ??
      (isUsableCatalogImage(product.images[1]?.url) ? product.images[1]?.url : null) ??
      null;
  }

  return resolveProductHoverSrc(primaryUrl, catalogHover, product.product_type);
}

export function getStoreProductImages(product: Pick<StoreProduct, "image_url" | "product_type">) {
  const defaults = getDefaultProductImages(product.product_type);
  const primary = isUsableCatalogImage(product.image_url) ? product.image_url! : defaults.primary;
  const hover = resolveProductHoverSrc(primary, defaults.hover, product.product_type);
  return { primary, hover };
}
