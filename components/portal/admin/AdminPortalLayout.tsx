"use client";

import { useMemo } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { PortalSidebarLayout, type SidebarLink } from "@/components/portal/shared/PortalSidebarLayout";
import type { PortalUserMenuConfig } from "@/components/portal/shared/PortalUserMenu";
import { PortalBootstrap } from "@/components/bootstrap/PortalBootstrap";
import { AdminOrdersProvider } from "@/context/OrdersProvider";
import { useAuth } from "@/context/AuthProvider";

const ADMIN_LINKS: SidebarLink[] = [
  { href: "/portal/admin/approvals", label: "Approval Queue", icon: frontierSidebarIcons.clipboardCheck },
  { href: "/portal/admin/users", label: "Users", icon: frontierSidebarIcons.users },
  { href: "/portal/admin/catalog", label: "Catalog", icon: frontierSidebarIcons.layoutGrid },
  { href: "/portal/admin/orders", label: "Orders", icon: frontierSidebarIcons.shoppingCart },
  { href: "/portal/admin/payouts", label: "Payouts", icon: frontierSidebarIcons.wallet },
  { href: "/portal/admin/affiliates", label: "Affiliates", icon: frontierSidebarIcons.handshake },
  { href: "/portal/admin/wms", label: "WMS", icon: frontierSidebarIcons.warehouse },
  { href: "/portal/admin/reports", label: "Reports", icon: frontierSidebarIcons.barChart },
  { href: "/portal/admin/compliance", label: "Compliance", icon: frontierSidebarIcons.shield },
  { href: "/portal/admin/settings", label: "Settings", icon: frontierSidebarIcons.settings },
];

export function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  const userMenu = useMemo(
    (): PortalUserMenuConfig => ({
      displayName: session?.email?.split("@")[0] ?? "Admin",
      subtitle: session?.email,
      items: [
        {
          href: "/portal/admin/settings",
          label: "Admin settings",
          icon: frontierSidebarIcons.settings,
        },
      ],
    }),
    [session?.email],
  );

  return (
    <AdminOrdersProvider>
      <PortalBootstrap role="admin" />
      <PortalSidebarLayout links={ADMIN_LINKS} userMenu={userMenu}>
        {children}
      </PortalSidebarLayout>
    </AdminOrdersProvider>
  );
}
