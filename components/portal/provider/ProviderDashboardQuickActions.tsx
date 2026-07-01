"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { frontierStrokeSidebarIcons } from "@/components/icons/frontier/frontier-stroke-sidebar-icons";
import type { FrontierIconComponent } from "@/lib/icons/types";

type QuickAction = {
  href: string;
  label: string;
  icon: FrontierIconComponent;
  exact?: boolean;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: "/portal/doctor/inventory",
    label: "Inventory",
    icon: frontierStrokeSidebarIcons.inventory,
    accent: "provider-dash-card-muted--teal",
  },
  {
    href: "/portal/doctor/my-store",
    label: "My Store",
    icon: frontierStrokeSidebarIcons.myStore,
    accent: "provider-dash-card-muted--warm",
  },
  {
    href: "/portal/doctor/customers",
    label: "Customers",
    icon: frontierStrokeSidebarIcons.users,
    accent: "provider-dash-card-muted--neutral",
  },
  {
    href: "/portal/doctor/orders",
    label: "Orders",
    icon: frontierStrokeSidebarIcons.shoppingCart,
    accent: "provider-dash-card-muted--teal",
  },
  {
    href: "/portal/doctor/messages",
    label: "Messages",
    icon: frontierStrokeSidebarIcons.messageSquare,
    accent: "provider-dash-card-muted--warm",
  },
  {
    href: "/portal/doctor/accounting",
    label: "Accounting",
    icon: frontierStrokeSidebarIcons.calculator,
    accent: "provider-dash-card-muted--neutral",
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProviderDashboardQuickActions() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {QUICK_ACTIONS.map((action) => {
        const active = isActive(pathname, action.href, action.exact);
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className={`provider-dash-action group flex flex-col items-center gap-2 px-2.5 py-3 text-center ${
              active ? "ring-2 ring-pacific-teal/30" : ""
            }`}
          >
            <span
              className={`provider-dash-action-icon flex size-12 items-center justify-center rounded-2xl ${action.accent} text-deep-teal`}
            >
              <Icon size={22} aria-hidden />
            </span>
            <span className="text-sm font-medium text-deep-teal sm:text-base">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
