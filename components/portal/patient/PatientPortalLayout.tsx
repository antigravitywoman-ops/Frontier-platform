"use client";

import { useMemo } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { PatientOnboardingRouteSync } from "@/components/onboarding/patient/PatientOnboardingRouteSync";
import { RoleOnboardingJoyride } from "@/components/onboarding/RoleOnboardingJoyride";
import { PortalSidebarLayout, type SidebarLink } from "@/components/portal/shared/PortalSidebarLayout";
import type { PortalUserMenuConfig } from "@/components/portal/shared/PortalUserMenu";
import { usePatientUnreadTotal } from "@/context/ChatProvider";
import { useAuth } from "@/context/AuthProvider";
import { usePatientPortal } from "@/context/PatientPortalProvider";

const BASE_PATIENT_LINKS: Omit<SidebarLink, "badge">[] = [
  { href: "/portal/patient", label: "Dashboard", icon: frontierSidebarIcons.layoutDashboard, exact: true },
  { href: "/portal/patient/orders", label: "Orders", icon: frontierSidebarIcons.shoppingCart, exact: false },
  { href: "/portal/patient/products", label: "Products", icon: frontierSidebarIcons.shoppingBag, exact: false },
  { href: "/portal/patient/chat", label: "Chat", icon: frontierSidebarIcons.messageSquare, exact: false },
  { href: "/portal/patient/profile", label: "Account", icon: frontierSidebarIcons.user, exact: true },
];

function PatientPortalShell({ children }: { children: React.ReactNode }) {
  const patientUnreadTotal = usePatientUnreadTotal();
  const { session } = useAuth();
  const { profile, clinicName, clinicLogoUrl } = usePatientPortal();

  const links = useMemo(
    (): SidebarLink[] =>
      BASE_PATIENT_LINKS.map((link) =>
        link.href === "/portal/patient/chat"
          ? { ...link, badge: patientUnreadTotal }
          : link,
      ),
    [patientUnreadTotal],
  );

  const userMenu = useMemo(
    (): PortalUserMenuConfig => ({
      displayName: profile.name || session?.email || "Patient",
      subtitle: clinicName || profile.email,
      items: [
        {
          href: "/portal/patient/profile",
          label: "Account settings",
          icon: frontierSidebarIcons.user,
        },
        {
          href: "/portal/patient/products",
          label: "Browse products",
          icon: frontierSidebarIcons.shoppingBag,
        },
      ],
    }),
    [profile.name, profile.email, session?.email, clinicName],
  );

  const topBarBrand = useMemo(
    () => ({
      logoUrl: clinicLogoUrl,
      clinicName: clinicName ?? undefined,
      showPoweredBy: true as const,
    }),
    [clinicLogoUrl, clinicName],
  );

  return (
    <PortalSidebarLayout
      links={links}
      userMenu={userMenu}
      topBarBrand={topBarBrand}
    >
      <PatientOnboardingRouteSync />
      <RoleOnboardingJoyride role="patient" />
      {children}
    </PortalSidebarLayout>
  );
}

export function PatientPortalLayout({ children }: { children: React.ReactNode }) {
  return <PatientPortalShell>{children}</PatientPortalShell>;
}
