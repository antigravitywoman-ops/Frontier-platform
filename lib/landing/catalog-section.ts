export type CatalogStat = {
  value: string;
  label: string;
};

export type CatalogPreviewTab = (typeof CATALOG_PREVIEW_TABS)[number];

export type CatalogPreviewProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  tab: CatalogPreviewTab;
  stock: number;
  price: string;
  status: "in_stock" | "low";
  vialTone: "teal" | "coral" | "sky";
};

export const CATALOG_SECTION = {
  label: "The catalog",
  categories: ["Peptides", "TRT", "HGH", "GLP-1s", "Hormones", "Compounded Rx"] as const,
  stats: [
    { value: "1,000+", label: "products" },
    { value: "100+", label: "peptides" },
    { value: "20+", label: "lab supplies" },
  ] satisfies CatalogStat[],
};

export const CATALOG_PREVIEW_TABS = ["Peptides", "Compounds", "Labs"] as const;

export const CATALOG_PREVIEW_PRODUCTS: CatalogPreviewProduct[] = [
  {
    id: "bpc-157",
    name: "BPC-157 5mg",
    sku: "PEP-BPC157-5",
    category: "Peptides",
    tab: "Peptides",
    stock: 248,
    price: "$42.00",
    status: "in_stock",
    vialTone: "teal",
  },
  {
    id: "nad-plus",
    name: "NAD+ 500mg",
    sku: "PEP-NAD500",
    category: "Peptides",
    tab: "Peptides",
    stock: 156,
    price: "$55.00",
    status: "in_stock",
    vialTone: "coral",
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin 2mg",
    sku: "PEP-IPA-2",
    category: "Peptides",
    tab: "Peptides",
    stock: 192,
    price: "$38.00",
    status: "in_stock",
    vialTone: "sky",
  },
  {
    id: "semaglutide",
    name: "Semaglutide 2.5mg",
    sku: "RX-SEMA-25",
    category: "GLP-1s",
    tab: "Compounds",
    stock: 112,
    price: "$89.00",
    status: "in_stock",
    vialTone: "sky",
  },
  {
    id: "test-cyp",
    name: "Testosterone Cypionate",
    sku: "RX-TCYP-200",
    category: "TRT",
    tab: "Compounds",
    stock: 34,
    price: "$28.50",
    status: "low",
    vialTone: "coral",
  },
  {
    id: "cbc-panel",
    name: "CBC Panel",
    sku: "LAB-CBC-001",
    category: "Lab supplies",
    tab: "Labs",
    stock: 420,
    price: "$18.00",
    status: "in_stock",
    vialTone: "teal",
  },
  {
    id: "cmp-panel",
    name: "CMP Comprehensive",
    sku: "LAB-CMP-001",
    category: "Lab supplies",
    tab: "Labs",
    stock: 312,
    price: "$24.00",
    status: "in_stock",
    vialTone: "sky",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D Panel",
    sku: "LAB-VTD-001",
    category: "Lab supplies",
    tab: "Labs",
    stock: 198,
    price: "$16.50",
    status: "in_stock",
    vialTone: "coral",
  },
];

export function filterCatalogPreviewProducts(
  products: CatalogPreviewProduct[],
  tab: CatalogPreviewTab,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    if (product.tab !== tab) return false;
    if (!normalizedQuery) return true;

    const haystack = [product.name, product.sku, product.category]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
