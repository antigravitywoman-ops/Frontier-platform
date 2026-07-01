"use client";

import { useMemo } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { PortalSidebarLayout, type SidebarLink } from "@/components/portal/shared/PortalSidebarLayout";
import type { PortalUserMenuConfig } from "@/components/portal/shared/PortalUserMenu";
import { OrdersProvider } from "@/context/OrdersProvider";
import { ChatProvider, useProviderUnreadTotal } from "@/context/ChatProvider";
import { PatientsProvider } from "@/context/PatientsProvider";
import { PortalBootstrap } from "@/components/bootstrap/PortalBootstrap";
import { ProviderPortalProvider, useProviderDashboard } from "@/context/ProviderPortalProvider";
import { DoctorOnboardingProvider } from "@/context/DoctorOnboardingProvider";
import { useAuth } from "@/context/AuthProvider";

const BASE_PROVIDER_LINKS: Omit<SidebarLink, "badge">[] = [
  { href: "/portal/doctor", label: "Dashboard", icon: frontierSidebarIcons.layoutDashboard, exact: true },
  { href: "/portal/doctor/inventory", label: "Inventory", icon: frontierSidebarIcons.inventory, exact: false },
  { href: "/portal/doctor/my-store", label: "My Store", icon: frontierSidebarIcons.myStore, exact: false },
  { href: "/portal/doctor/customers", label: "Customers", icon: frontierSidebarIcons.users, exact: false },
  { href: "/portal/doctor/orders", label: "Orders", icon: frontierSidebarIcons.shoppingCart, exact: false },
  { href: "/portal/doctor/accounting", label: "Accounting", icon: frontierSidebarIcons.calculator, exact: false },
  { href: "/portal/doctor/messages", label: "Messages", icon: frontierSidebarIcons.messageSquare, exact: false },
  { href: "/portal/doctor/users", label: "Organization Users", icon: frontierSidebarIcons.usersRound, exact: false },
  { href: "/portal/doctor/settings", label: "Settings", icon: frontierSidebarIcons.settings, exact: false },
  { href: "/portal/doctor/help", label: "Help / Support", icon: frontierSidebarIcons.helpCircle, exact: false },
];

function ProviderPortalShell({ children }: { children: React.ReactNode }) {
  const providerUnreadTotal = useProviderUnreadTotal();
  const { session } = useAuth();
  const { branding, providerDisplayName } = useProviderDashboard();

  const links = useMemo(
    (): SidebarLink[] =>
      BASE_PROVIDER_LINKS.map((link) =>
        link.href === "/portal/doctor/messages"
          ? { ...link, badge: providerUnreadTotal }
          : link,
      ),
    [providerUnreadTotal],
  );

  const userMenu = useMemo(
    (): PortalUserMenuConfig => ({
      displayName: providerDisplayName ?? session?.email ?? "Provider",
      subtitle: branding.clinicName,
      items: [
        {
          href: "/portal/doctor/settings",
          label: "Clinic settings",
          icon: frontierSidebarIcons.settings,
        },
        {
          href: "/portal/doctor/help",
          label: "Help & support",
          icon: frontierSidebarIcons.helpCircle,
        },
      ],
    }),
    [providerDisplayName, session?.email, branding.clinicName],
  );

  return (
    <PortalSidebarLayout links={links} userMenu={userMenu}>
      {children}
    </PortalSidebarLayout>
  );
}

export function ProviderPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProviderPortalProvider>
      <PortalBootstrap role="doctor" />
      <OrdersProvider>
        <PatientsProvider>
          <ChatProvider>
            <DoctorOnboardingProvider>
              <ProviderPortalShell>{children}</ProviderPortalShell>
            </DoctorOnboardingProvider>
          </ChatProvider>
        </PatientsProvider>
      </OrdersProvider>
    </ProviderPortalProvider>
  );
}
