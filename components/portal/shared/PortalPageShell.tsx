"use client";

import type { ReactNode } from "react";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";

type PortalPageShellProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  "data-tour"?: string;
};

export function PortalPageShell({
  title,
  subtitle,
  actions,
  children,
  className = "",
  contentClassName = "",
  "data-tour": dataTour,
}: PortalPageShellProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="provider-dashboard-shell">
        <div
          className="provider-dashboard-panel relative z-0 space-y-4 p-4 sm:space-y-5 sm:p-5 lg:p-6"
          data-tour={dataTour}
        >
          <div className="relative z-10 flex flex-col gap-3 border-b border-deep-teal/8 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <ProviderDashboardSectionHeader
              title={title}
              subtitle={subtitle}
              className="mb-0 min-w-0 flex-1"
            />
            {actions ? (
              <div className="flex flex-wrap items-center justify-end gap-2 sm:shrink-0">
                {actions}
              </div>
            ) : null}
          </div>
          <div className={`relative z-10 space-y-4 ${contentClassName}`}>{children ?? null}</div>
        </div>
      </div>
    </div>
  );
}

type PortalInnerCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  noPadding?: boolean;
  "data-tour"?: string;
};

export function PortalInnerCard({
  title,
  subtitle,
  children,
  noPadding = false,
  "data-tour": dataTour,
}: PortalInnerCardProps) {
  if (noPadding) {
    return (
      <ProviderDashboardCard noPadding data-tour={dataTour}>
        <div className="border-b border-deep-teal/8 px-4 py-3 sm:px-5">
          <ProviderDashboardSectionHeader title={title} subtitle={subtitle} className="mb-0" />
        </div>
        {children}
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderDashboardCard data-tour={dataTour}>
      <ProviderDashboardSectionHeader title={title} subtitle={subtitle} />
      {children}
    </ProviderDashboardCard>
  );
}
