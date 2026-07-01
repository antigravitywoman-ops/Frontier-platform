import {
  isDateInRange,
  type AccountingTimeRange,
  type PaidOrderRow,
  type ProductProfitRow,
  type ProviderPayout,
  type TrendPoint,
} from "@/lib/finance/types";
import type { Order, OrderLineItem } from "@/lib/orders/types";
import { DEMO_CLINIC_DISPLAY_NAME } from "@/lib/provider/resolve-display-profile";

export const DEMO_ORDER_ID_PREFIX = "demo-order-";

const CLINIC_ID = "demo-clinic-harborview";
const DOCTOR_NAME = "John";

function daysAgo(days: number) {
  const date = new Date("2026-03-06T14:00:00Z");
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function dayKey(daysAgoCount: number) {
  return daysAgo(daysAgoCount).slice(0, 10);
}

function lineItem(
  id: string,
  productId: string,
  productName: string,
  sku: string,
  qty: number,
  unitPrice: number,
): OrderLineItem {
  return {
    id,
    productId,
    productName,
    sku,
    qty,
    unitPrice,
    total: unitPrice * qty,
  };
}

function buildDemoOrder(
  suffix: string,
  orderNumber: string,
  patient: { name: string; email: string },
  reviewStatus: Order["reviewStatus"],
  paymentStatus: Order["paymentStatus"],
  shipmentStatus: Order["shipmentStatus"],
  createdDaysAgo: number,
  lineItems: OrderLineItem[],
  options: {
    reviewedDaysAgo?: number;
    rejectionReason?: string;
    tracking?: Order["tracking"];
  } = {},
): Order {
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const netCost = Math.round(total * 0.62);
  const profit = total - netCost;
  const createdAt = daysAgo(createdDaysAgo);
  const reviewedAt =
    options.reviewedDaysAgo !== undefined ? daysAgo(options.reviewedDaysAgo) : undefined;

  const timeline: Order["timeline"] = [
    {
      id: `created-${suffix}`,
      date: createdAt,
      status: "Order placed",
      note: `Order ${orderNumber} submitted by patient.`,
    },
  ];

  if (reviewStatus === "approved" && reviewedAt) {
    timeline.unshift({
      id: `approved-${suffix}`,
      date: reviewedAt,
      status: "Approved",
      note: "Approved for fulfillment.",
    });
  }

  if (reviewStatus === "rejected") {
    timeline.unshift({
      id: `rejected-${suffix}`,
      date: reviewedAt ?? createdAt,
      status: "Rejected",
      note: options.rejectionReason ?? "Order declined by physician.",
    });
  }

  if (options.tracking) {
    timeline.unshift({
      id: `shipped-${suffix}`,
      date: reviewedAt ?? createdAt,
      status: "Shipped",
      note: `${options.tracking.carrier} ${options.tracking.trackingNumber}`,
    });
  }

  return {
    id: `${DEMO_ORDER_ID_PREFIX}${suffix}`,
    orderNumber,
    orderType: "customer",
    reviewStatus,
    customerId: `demo-patient-${suffix}`,
    customerName: patient.name,
    doctorName: DOCTOR_NAME,
    paymentDate:
      paymentStatus === "paid" ? (reviewedAt?.slice(0, 10) ?? dayKey(createdDaysAgo)) : null,
    paymentStatus,
    shipmentStatus,
    itemsCount: lineItems.reduce((sum, item) => sum + item.qty, 0),
    total,
    netCost,
    profit,
    lineItems,
    patientEmail: patient.email,
    patientPhone: "(503) 555-0142",
    tracking: options.tracking,
    timeline,
    clinicId: CLINIC_ID,
    clinicName: DEMO_CLINIC_DISPLAY_NAME,
    rejectionReason: options.rejectionReason,
  };
}

const DEMO_ORDERS: Order[] = [
  buildDemoOrder(
    "001",
    "HV-10482",
    { name: "Marcus Harris", email: "marcus.harris@email.com" },
    "pending_review",
    "pending",
    "not_shipped",
    1,
    [lineItem("li-001", "prod-bpc157", "BPC-157 5mg", "BPC-157-5", 2, 89)],
  ),
  buildDemoOrder(
    "002",
    "HV-10479",
    { name: "Taylor Brooks", email: "taylor.brooks@email.com" },
    "pending_review",
    "paid",
    "not_shipped",
    2,
    [
      lineItem("li-002a", "prod-tb500", "TB-500 10mg", "TB-500-10", 1, 129),
      lineItem("li-002b", "prod-nad", "NAD+ 500mg", "NAD-500", 1, 74),
    ],
  ),
  buildDemoOrder(
    "003",
    "HV-10475",
    { name: "Zoe Reeves", email: "zoe.reeves@email.com" },
    "pending_review",
    "paid",
    "processing",
    3,
    [lineItem("li-003", "prod-sema", "Semaglutide 2.5mg", "SEMA-2.5", 1, 249)],
  ),
  buildDemoOrder(
    "004",
    "HV-10468",
    { name: "Michael Chen", email: "michael.chen@email.com" },
    "approved",
    "paid",
    "shipped",
    6,
    [lineItem("li-004", "prod-bpc157", "BPC-157 5mg", "BPC-157-5", 3, 89)],
    {
      reviewedDaysAgo: 5,
      tracking: {
        carrier: "FedEx",
        trackingNumber: "794612345678",
        shippedDate: dayKey(4),
        trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=794612345678",
      },
    },
  ),
  buildDemoOrder(
    "005",
    "HV-10461",
    { name: "Sarah Mitchell", email: "sarah.mitchell@email.com" },
    "approved",
    "paid",
    "delivered",
    10,
    [
      lineItem("li-005a", "prod-ghk", "GHK-Cu 50mg", "GHK-50", 1, 95),
      lineItem("li-005b", "prod-mots", "MOTS-c 10mg", "MOTS-10", 1, 118),
    ],
    {
      reviewedDaysAgo: 9,
      tracking: {
        carrier: "UPS",
        trackingNumber: "1Z999AA10123456784",
        shippedDate: dayKey(8),
        trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
      },
    },
  ),
  buildDemoOrder(
    "006",
    "HV-10455",
    { name: "David Park", email: "david.park@email.com" },
    "approved",
    "paid",
    "shipped",
    14,
    [lineItem("li-006", "prod-ipamorelin", "Ipamorelin 10mg", "IPA-10", 2, 79)],
    {
      reviewedDaysAgo: 13,
      tracking: {
        carrier: "USPS",
        trackingNumber: "9400111899223344556677",
        shippedDate: dayKey(12),
        trackingUrl:
          "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556677",
      },
    },
  ),
  buildDemoOrder(
    "007",
    "HV-10448",
    { name: "Emily Watson", email: "emily.watson@email.com" },
    "approved",
    "paid",
    "delivered",
    21,
    [lineItem("li-007", "prod-tesamorelin", "Tesamorelin 10mg", "TESA-10", 1, 189)],
    { reviewedDaysAgo: 20 },
  ),
  buildDemoOrder(
    "008",
    "HV-10441",
    { name: "James Ortiz", email: "james.ortiz@email.com" },
    "rejected",
    "refunded",
    "cancelled",
    8,
    [lineItem("li-008", "prod-sema", "Semaglutide 2.5mg", "SEMA-2.5", 1, 249)],
    {
      reviewedDaysAgo: 7,
      rejectionReason: "Duplicate order — patient confirmed existing supply on hand.",
    },
  ),
  buildDemoOrder(
    "009",
    "HV-10436",
    { name: "Rachel Kim", email: "rachel.kim@email.com" },
    "approved",
    "paid",
    "delivered",
    18,
    [lineItem("li-009", "prod-bpc157", "BPC-157 5mg", "BPC-157-5", 2, 89)],
    { reviewedDaysAgo: 17 },
  ),
  buildDemoOrder(
    "010",
    "HV-10431",
    { name: "Andrew Lewis", email: "andrew.lewis@email.com" },
    "approved",
    "paid",
    "shipped",
    22,
    [lineItem("li-010", "prod-tb500", "TB-500 10mg", "TB-500-10", 1, 129)],
    { reviewedDaysAgo: 21 },
  ),
];

const DEMO_PAID_ORDERS: PaidOrderRow[] = [
  {
    id: "paid-001",
    orderId: "HV-10468",
    date: dayKey(5),
    product: "BPC-157 5mg",
    customer: "Michael Chen",
    qty: 3,
    basePrice: 267,
    netProfit: 102,
    total: 267,
    status: "paid",
  },
  {
    id: "paid-002",
    orderId: "HV-10461",
    date: dayKey(9),
    product: "GHK-Cu 50mg",
    customer: "Sarah Mitchell",
    qty: 1,
    basePrice: 95,
    netProfit: 36,
    total: 95,
    status: "paid",
  },
  {
    id: "paid-003",
    orderId: "HV-10461",
    date: dayKey(9),
    product: "MOTS-c 10mg",
    customer: "Sarah Mitchell",
    qty: 1,
    basePrice: 118,
    netProfit: 45,
    total: 118,
    status: "paid",
  },
  {
    id: "paid-004",
    orderId: "HV-10455",
    date: dayKey(13),
    product: "Ipamorelin 10mg",
    customer: "David Park",
    qty: 2,
    basePrice: 158,
    netProfit: 60,
    total: 158,
    status: "paid",
  },
  {
    id: "paid-005",
    orderId: "HV-10448",
    date: dayKey(20),
    product: "Tesamorelin 10mg",
    customer: "Emily Watson",
    qty: 1,
    basePrice: 189,
    netProfit: 72,
    total: 189,
    status: "paid",
  },
  {
    id: "paid-006",
    orderId: "HV-10432",
    date: dayKey(28),
    product: "BPC-157 5mg",
    customer: "Rachel Kim",
    qty: 2,
    basePrice: 178,
    netProfit: 68,
    total: 178,
    status: "paid",
  },
  {
    id: "paid-007",
    orderId: "HV-10428",
    date: dayKey(35),
    product: "TB-500 10mg",
    customer: "Andrew Lewis",
    qty: 1,
    basePrice: 129,
    netProfit: 49,
    total: 129,
    status: "paid",
  },
  {
    id: "paid-008",
    orderId: "HV-10419",
    date: dayKey(42),
    product: "NAD+ 500mg",
    customer: "Priya Shah",
    qty: 2,
    basePrice: 148,
    netProfit: 56,
    total: 148,
    status: "paid",
  },
  {
    id: "paid-009",
    orderId: "HV-10412",
    date: dayKey(52),
    product: "Semaglutide 2.5mg",
    customer: "Chris Nguyen",
    qty: 1,
    basePrice: 249,
    netProfit: 95,
    total: 249,
    status: "partial_refund",
  },
  {
    id: "paid-010",
    orderId: "HV-10405",
    date: dayKey(61),
    product: "GHK-Cu 50mg",
    customer: "Laura Bennett",
    qty: 1,
    basePrice: 95,
    netProfit: 36,
    total: 95,
    status: "paid",
  },
];

const DEMO_TREND: TrendPoint[] = [
  { date: dayKey(56), revenue: 420, profit: 158 },
  { date: dayKey(49), revenue: 680, profit: 256 },
  { date: dayKey(42), revenue: 540, profit: 204 },
  { date: dayKey(35), revenue: 890, profit: 338 },
  { date: dayKey(28), revenue: 720, profit: 272 },
  { date: dayKey(21), revenue: 960, profit: 364 },
  { date: dayKey(14), revenue: 810, profit: 306 },
  { date: dayKey(7), revenue: 1120, profit: 424 },
  { date: dayKey(0), revenue: 940, profit: 356 },
];

const DEMO_TOP_PRODUCTS: ProductProfitRow[] = [
  { productId: "prod-bpc157", productName: "BPC-157 5mg", profit: 428, tier: "high" },
  { productId: "prod-sema", productName: "Semaglutide 2.5mg", profit: 312, tier: "high" },
  { productId: "prod-tb500", productName: "TB-500 10mg", profit: 245, tier: "medium" },
  { productId: "prod-ghk", productName: "GHK-Cu 50mg", profit: 198, tier: "medium" },
  { productId: "prod-ipamorelin", productName: "Ipamorelin 10mg", profit: 156, tier: "low" },
];

const DEMO_PAYOUTS: ProviderPayout[] = [
  {
    id: "payout-001",
    batchId: "PAY-2026-0301",
    date: dayKey(5),
    amount: 1842,
    status: "paid",
    orderCount: 6,
    clinicId: CLINIC_ID,
    clinicName: DEMO_CLINIC_DISPLAY_NAME,
  },
  {
    id: "payout-002",
    batchId: "PAY-2026-0215",
    date: dayKey(19),
    amount: 2265,
    status: "paid",
    orderCount: 8,
    clinicId: CLINIC_ID,
    clinicName: DEMO_CLINIC_DISPLAY_NAME,
  },
  {
    id: "payout-003",
    batchId: "PAY-2026-0201",
    date: dayKey(33),
    amount: 1590,
    status: "processing",
    orderCount: 5,
    clinicId: CLINIC_ID,
    clinicName: DEMO_CLINIC_DISPLAY_NAME,
  },
  {
    id: "payout-004",
    batchId: "PAY-2026-0115",
    date: dayKey(50),
    amount: 980,
    status: "paid",
    orderCount: 4,
    clinicId: CLINIC_ID,
    clinicName: DEMO_CLINIC_DISPLAY_NAME,
  },
];

export function isDemoOrderId(id: string) {
  return id.startsWith(DEMO_ORDER_ID_PREFIX);
}

export function getDemoOrders(): Order[] {
  return DEMO_ORDERS.map((order) => ({
    ...order,
    lineItems: order.lineItems.map((item) => ({ ...item })),
    timeline: order.timeline.map((entry) => ({ ...entry })),
    tracking: order.tracking ? { ...order.tracking } : undefined,
  }));
}

export function getDemoOrder(id: string): Order | undefined {
  return getDemoOrders().find((order) => order.id === id || order.orderNumber === id);
}

export function mergeWithDemoOrders(orders: Order[]): Order[] {
  const demo = getDemoOrders();
  const existingIds = new Set(orders.map((order) => order.id));
  const existingNumbers = new Set(
    orders.map((order) => order.orderNumber).filter((value): value is string => Boolean(value)),
  );
  const missing = demo.filter(
    (order) =>
      !existingIds.has(order.id) &&
      (!order.orderNumber || !existingNumbers.has(order.orderNumber)),
  );
  return [...missing, ...orders];
}

function filterByRange<T extends { date: string }>(
  rows: T[],
  range: AccountingTimeRange,
  customStart?: string,
  customEnd?: string,
) {
  return rows.filter((row) => isDateInRange(row.date, range, customStart, customEnd));
}

export function getDemoAccountingData(
  range: AccountingTimeRange,
  customStart?: string,
  customEnd?: string,
) {
  const paidOrders = filterByRange(DEMO_PAID_ORDERS, range, customStart, customEnd);
  const trendData = filterByRange(DEMO_TREND, range, customStart, customEnd);
  const payouts = filterByRange(DEMO_PAYOUTS, range, customStart, customEnd);

  return {
    paidOrders,
    trendData: trendData.length > 0 ? trendData : DEMO_TREND.slice(-6),
    topProducts: DEMO_TOP_PRODUCTS,
    payouts,
  };
}

export function patchDemoOrder(order: Order, patch: Partial<Order>): Order {
  return {
    ...order,
    ...patch,
    lineItems: patch.lineItems ?? order.lineItems,
    timeline: patch.timeline ?? order.timeline,
    tracking: patch.tracking ?? order.tracking,
  };
}
