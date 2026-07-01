"use client";

import { useMemo, type ReactNode } from "react";
import { useShallow } from "@/lib/hooks/zustand";
import { mergeWithDemoOrders } from "@/lib/provider/demo-portal-data";
import { useAdminOrdersStore, useOrdersStore } from "@/stores/orders-store";

export function OrdersProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useOrders() {
  const rawOrders = useOrdersStore((state) => state.orders);
  const actions = useOrdersStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      refreshOrders: state.refreshOrders,
      getOrder: state.getOrder,
      fetchOrder: state.fetchOrder,
      approveOrder: state.approveOrder,
      rejectOrder: state.rejectOrder,
      updateTracking: state.updateTracking,
      applyRefund: state.applyRefund,
      applyTrackingImport: state.applyTrackingImport,
    })),
  );
  const orders = useMemo(() => mergeWithDemoOrders(rawOrders), [rawOrders]);

  return useMemo(
    () => ({
      orders,
      clinicOrders: orders,
      ...actions,
    }),
    [orders, actions],
  );
}

export function AdminOrdersProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useAdminOrders() {
  return useAdminOrdersStore(
    useShallow((state) => ({
      allOrders: state.allOrders,
      isLoading: state.isLoading,
      refreshOrders: state.refreshOrders,
      toggleFlag: state.toggleFlag,
      bulkUpdateStatus: state.bulkUpdateStatus,
      updateTracking: state.updateTracking,
      applyTrackingImport: state.applyTrackingImport,
    })),
  );
}
