"use client";

import type { ReactNode } from "react";
import type { FrontierIconComponent } from "@/lib/icons/types";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";

type PortalPageSectionProps = {
  icon?: FrontierIconComponent;
  title: string;
  subtitle?: string;
  children: ReactNode;
  noPadding?: boolean;
  compact?: boolean;
  className?: string;
  "data-tour"?: string;
};

export function PortalPageSection({
  icon: Icon,
  title,
  subtitle,
  children,
  noPadding = false,
  compact = false,
  className = "",
  "data-tour": dataTour,
}: PortalPageSectionProps) {
  const header = (
    <div className={`flex items-center ${Icon ? (compact ? "gap-3" : "gap-3.5 sm:gap-4") : ""}`}>
      {Icon ? (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl border border-deep-teal/15 bg-deep-teal/5 ${
            compact ? "size-10 sm:size-11" : "size-12 sm:size-[3.25rem]"
          }`}
          aria-hidden="true"
        >
          <Icon size={compact ? 20 : 24} />
        </div>
      ) : null}
      <ProviderDashboardSectionHeader
        title={title}
        subtitle={subtitle}
        className={`mb-0 min-w-0 flex-1 ${compact ? "[&_h2]:text-lg [&_p]:text-sm" : ""}`}
      />
    </div>
  );

  if (noPadding) {
    return (
      <ProviderDashboardCard noPadding data-tour={dataTour} className={className}>
        <div
          className={`border-b border-deep-teal/8 ${compact ? "px-4 py-2.5" : "px-4 py-3 sm:px-5"}`}
        >
          {header}
        </div>
        {children}
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderDashboardCard
      data-tour={dataTour}
      className={`${compact ? "p-3.5 sm:p-4" : ""} ${className}`}
    >
      {header}
      <div className={compact ? "mt-3" : "mt-4"}>{children}</div>
    </ProviderDashboardCard>
  );
}
