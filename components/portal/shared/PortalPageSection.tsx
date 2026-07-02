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
  dense?: boolean;
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
  dense = false,
  className = "",
  "data-tour": dataTour,
}: PortalPageSectionProps) {
  const iconSize = dense ? 18 : compact ? 20 : 24;
  const iconBoxClass = dense
    ? "size-8 sm:size-9"
    : compact
      ? "size-10 sm:size-11"
      : "size-12 sm:size-[3.25rem]";
  const headerGap = dense ? "gap-2.5" : compact ? "gap-3" : "gap-3.5 sm:gap-4";
  const titleClass = dense
    ? "[&_h2]:text-base [&_p]:text-xs [&_p]:leading-snug"
    : compact
      ? "[&_h2]:text-lg [&_p]:text-sm"
      : "";
  const bodyMt = dense ? "mt-2" : compact ? "mt-3" : "mt-4";
  const cardPadding = dense ? "p-2.5 sm:p-3" : compact ? "p-3.5 sm:p-4" : "";
  const headerPadding = dense ? "px-3 py-2" : compact ? "px-4 py-2.5" : "px-4 py-3 sm:px-5";

  const header = (
    <div className={`flex items-center ${Icon ? headerGap : ""}`}>
      {Icon ? (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl border border-deep-teal/15 bg-deep-teal/5 ${iconBoxClass}`}
          aria-hidden="true"
        >
          <Icon size={iconSize} />
        </div>
      ) : null}
      <ProviderDashboardSectionHeader
        title={title}
        subtitle={subtitle}
        className={`mb-0 min-w-0 flex-1 ${titleClass}`}
      />
    </div>
  );

  if (noPadding) {
    return (
      <ProviderDashboardCard noPadding data-tour={dataTour} className={className}>
        <div className={`border-b border-deep-teal/8 ${headerPadding}`}>{header}</div>
        {children}
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderDashboardCard data-tour={dataTour} className={`${cardPadding} ${className}`}>
      {header}
      <div className={bodyMt}>{children}</div>
    </ProviderDashboardCard>
  );
}
