"use client";

import Link from "next/link";
import { frontierStrokeSidebarIcons } from "@/components/icons/frontier/frontier-stroke-sidebar-icons";
import type { ProviderDashboardStats } from "@/lib/provider/dashboard-stats";

type ProviderDashboardMetricTilesProps = {
  stats: ProviderDashboardStats;
};

const TILES = [
  {
    key: "pendingReviewCount",
    label: "Pending review",
    icon: frontierStrokeSidebarIcons.shoppingCart,
    accent: "bg-coral-blush/80 text-deep-teal",
    href: "/portal/doctor/orders",
  },
  {
    key: "activeShipments",
    label: "Active shipments",
    icon: frontierStrokeSidebarIcons.layoutGrid,
    accent: "bg-surface-subtle text-deep-teal",
    href: "/portal/doctor/orders",
  },
  {
    key: "patientCount",
    label: "Patients",
    icon: frontierStrokeSidebarIcons.users,
    accent: "bg-pacific-teal/15 text-deep-teal",
    href: "/portal/doctor/customers",
  },
  {
    key: "visibleStoreProducts",
    label: "Store products",
    icon: frontierStrokeSidebarIcons.myStore,
    accent: "bg-surface-warm text-deep-teal",
    href: "/portal/doctor/my-store",
  },
] as const;

export function ProviderDashboardMetricTiles({ stats }: ProviderDashboardMetricTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TILES.map((tile) => {
        const Icon = tile.icon;
        const value = stats[tile.key];

        return (
          <Link
            key={tile.key}
            href={tile.href}
            className="portal-glass-metric group flex flex-col gap-3 p-3.5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span
              className={`flex size-10 items-center justify-center rounded-full ${tile.accent} transition-colors group-hover:bg-deep-teal group-hover:text-pure-white`}
            >
              <Icon size={20} aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-light uppercase tracking-wide text-deep-teal/45">
                {tile.label}
              </p>
              <p className="mt-0.5 font-sans text-2xl font-light leading-none text-deep-teal">
                {value}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
