import type { ReactNode } from "react";

type ProviderDashboardCardProps = {
  children: ReactNode;
  className?: string;
  "data-tour"?: string;
  muted?: "teal" | "warm" | "neutral" | false;
  noPadding?: boolean;
};

export function ProviderDashboardCard({
  children,
  className = "",
  "data-tour": dataTour,
  muted = false,
  noPadding = false,
}: ProviderDashboardCardProps) {
  const surfaceClass = muted
    ? `provider-dash-card-muted provider-dash-card-muted--${muted}`
    : "provider-dash-card";

  return (
    <section
      data-tour={dataTour}
      className={`${surfaceClass} ${noPadding ? "" : "p-4 sm:p-5"} ${className}`}
    >
      {children}
    </section>
  );
}

type ProviderDashboardSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function ProviderDashboardSectionHeader({
  title,
  subtitle,
  action,
  className = "mb-3",
}: ProviderDashboardSectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.02em] text-deep-teal sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-base leading-relaxed text-deep-teal/55 sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** @deprecated Use ProviderDashboardCard */
export const ProviderDashboardGlassCard = ProviderDashboardCard;
/** @deprecated Use ProviderDashboardSectionHeader */
export const ProviderDashboardGlassHeader = ProviderDashboardSectionHeader;
