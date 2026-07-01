export type PayoutHistoryEntry = {
  batchId: string;
  amount: number;
  status: "paid" | "processing";
  dateLabel: string;
};

export type PayoutPreviewTab = (typeof PAYOUT_PREVIEW_TABS)[number];

export const PAYOUT_PREVIEW_TABS = ["All", "Paid", "Processing"] as const;

export type FeaturedOrderBreakdown = {
  orderId: string;
  product: string;
  quantity: number;
  retail: number;
  margin: number;
  payoutDate: string;
};

export const PAYOUT_SECTION = {
  label: "Payouts",
  headline: "Get paid for every order",
  body: "You set retail, your margin is calculated automatically, and payouts settle on a clear schedule — all processed in-platform. No third-party processor, no surprise markups.",
  scheduleNote: "Biweekly settlement",
} as const;

/** Mirrors demo portal order HV-10468 — BPC-157 5mg × 3 */
export const FEATURED_ORDER: FeaturedOrderBreakdown = {
  orderId: "HV-10468",
  product: "BPC-157 5mg",
  quantity: 3,
  retail: 267,
  margin: 102,
  payoutDate: "Mar 7, 2026",
};

export const PAYOUT_HISTORY: PayoutHistoryEntry[] = [
  { batchId: "PAY-2026-0301", amount: 1842, status: "paid", dateLabel: "Mar 1" },
  { batchId: "PAY-2026-0215", amount: 2265, status: "paid", dateLabel: "Feb 15" },
  { batchId: "PAY-2026-0201", amount: 1590, status: "processing", dateLabel: "Feb 1" },
  { batchId: "PAY-2026-0115", amount: 980, status: "paid", dateLabel: "Jan 15" },
];

export function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatUsdCents(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function filterPayoutHistory(
  entries: PayoutHistoryEntry[],
  tab: PayoutPreviewTab,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return entries.filter((entry) => {
    if (tab === "Paid" && entry.status !== "paid") return false;
    if (tab === "Processing" && entry.status !== "processing") return false;
    if (!normalizedQuery) return true;

    const haystack = [entry.batchId, entry.dateLabel, entry.status]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
