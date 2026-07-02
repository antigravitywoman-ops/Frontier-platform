import type { Order, OrderLineItem } from "@/lib/orders/types";

export const ADMIN_DEMO_ORDER_ID_PREFIX = "admin-demo-order-";

function daysAgo(days: number) {
  const date = new Date();
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

function buildAdminDemoOrder(
  suffix: string,
  orderNumber: string,
  clinic: { id: string; name: string },
  patient: { name: string; email: string },
  reviewStatus: Order["reviewStatus"],
  paymentStatus: Order["paymentStatus"],
  shipmentStatus: Order["shipmentStatus"],
  createdDaysAgo: number,
  lineItems: OrderLineItem[],
  options: { flagged?: boolean; reviewedDaysAgo?: number } = {},
): Order {
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const netCost = Math.round(total * 0.62);
  const profit = total - netCost;
  const createdAt = daysAgo(createdDaysAgo);
  const reviewedAt =
    options.reviewedDaysAgo !== undefined ? daysAgo(options.reviewedDaysAgo) : undefined;

  return {
    id: `${ADMIN_DEMO_ORDER_ID_PREFIX}${suffix}`,
    orderNumber,
    orderType: "customer",
    reviewStatus,
    customerId: `admin-demo-patient-${suffix}`,
    customerName: patient.name,
    doctorName: "Dr. Chen",
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
    timeline: [
      {
        id: `created-${suffix}`,
        date: createdAt,
        status: "Order placed",
        note: `Order ${orderNumber} submitted by patient.`,
      },
    ],
    clinicId: clinic.id,
    clinicName: clinic.name,
    flagged: options.flagged,
  };
}

const ADMIN_DEMO_ORDERS: Order[] = [
  buildAdminDemoOrder(
    "001",
    "FN-20841",
    { id: "demo-summit", name: "Summit Wellness Clinic" },
    { name: "Marcus Harris", email: "marcus.harris@email.com" },
    "approved",
    "paid",
    "shipped",
    1,
    [lineItem("ali-001", "prod-bpc157", "BPC-157 5mg", "BPC-157-5", 2, 89)],
    { reviewedDaysAgo: 1 },
  ),
  buildAdminDemoOrder(
    "002",
    "FN-20838",
    { id: "demo-pacific", name: "Pacific Longevity Center" },
    { name: "Taylor Brooks", email: "taylor.brooks@email.com" },
    "approved",
    "paid",
    "processing",
    2,
    [
      lineItem("ali-002a", "prod-tb500", "TB-500 10mg", "TB-500-10", 1, 129),
      lineItem("ali-002b", "prod-nad", "NAD+ 500mg", "NAD-500", 1, 74),
    ],
    { reviewedDaysAgo: 2 },
  ),
  buildAdminDemoOrder(
    "003",
    "FN-20835",
    { id: "demo-north", name: "North Shore Med Spa" },
    { name: "Zoe Reeves", email: "zoe.reeves@email.com" },
    "approved",
    "paid",
    "not_shipped",
    3,
    [lineItem("ali-003", "prod-sema", "Semaglutide 2.5mg", "SEMA-2.5", 1, 249)],
    { reviewedDaysAgo: 3 },
  ),
  buildAdminDemoOrder(
    "004",
    "FN-20829",
    { id: "demo-vertex", name: "Vertex Health Partners" },
    { name: "Michael Chen", email: "michael.chen@email.com" },
    "approved",
    "paid",
    "delivered",
    5,
    [lineItem("ali-004", "prod-bpc157", "BPC-157 5mg", "BPC-157-5", 3, 89)],
    { reviewedDaysAgo: 5 },
  ),
  buildAdminDemoOrder(
    "005",
    "FN-20822",
    { id: "demo-coastal", name: "Coastal Regenerative" },
    { name: "Sarah Mitchell", email: "sarah.mitchell@email.com" },
    "pending_review",
    "pending",
    "not_shipped",
    6,
    [lineItem("ali-005", "prod-ghk", "GHK-Cu 50mg", "GHK-50", 1, 95)],
  ),
  buildAdminDemoOrder(
    "006",
    "FN-20815",
    { id: "demo-summit", name: "Summit Wellness Clinic" },
    { name: "David Park", email: "david.park@email.com" },
    "approved",
    "paid",
    "shipped",
    8,
    [lineItem("ali-006", "prod-ipamorelin", "Ipamorelin 10mg", "IPA-10", 2, 79)],
    { reviewedDaysAgo: 8, flagged: true },
  ),
];

export function getAdminDashboardDemoOrders(): Order[] {
  return ADMIN_DEMO_ORDERS.map((order) => ({
    ...order,
    lineItems: order.lineItems.map((item) => ({ ...item })),
    timeline: order.timeline.map((entry) => ({ ...entry })),
  }));
}

export function isAdminDemoDashboardOrderId(id: string) {
  return id.startsWith(ADMIN_DEMO_ORDER_ID_PREFIX);
}
