import Link from "next/link";
import type { ReactNode } from "react";

export const PORTAL_OPS_STAT_VARIANTS = [
  "pending",
  "shipments",
  "patients",
  "products",
] as const;

export type PortalOpsStatVariant = (typeof PORTAL_OPS_STAT_VARIANTS)[number];

type PortalStatCardProps = {
  label: string;
  value: ReactNode;
  footer?: ReactNode;
  centered?: boolean;
  className?: string;
};

export function PortalStatCard({
  label,
  value,
  footer,
  centered = false,
  className = "",
}: PortalStatCardProps) {
  return (
    <div
      className={`provider-dash-stat-pill px-4 py-5 ${centered ? "text-center" : ""} ${className}`}
    >
      <p className="provider-dash-ops-stat-label">{label}</p>
      <div className="provider-dash-ops-stat-value mt-1">{value}</div>
      {footer}
    </div>
  );
}

type PortalOpsStatCardProps = {
  label: string;
  value: ReactNode;
  variant: PortalOpsStatVariant;
  className?: string;
};

export function PortalOpsStatCard({
  label,
  value,
  variant,
  className = "",
}: PortalOpsStatCardProps) {
  return (
    <div className={`provider-dash-ops-stat provider-dash-ops-stat--${variant} ${className}`}>
      <div className="flex items-center gap-2 pl-1">
        <span className="provider-dash-ops-stat-dot" aria-hidden />
        <p className="provider-dash-ops-stat-label">{label}</p>
      </div>
      <div className="provider-dash-ops-stat-value pl-1">{value}</div>
    </div>
  );
}

type PortalDetailCellProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export function PortalDetailCell({ label, value, className = "" }: PortalDetailCellProps) {
  return (
    <div
      className={`provider-dash-card-muted provider-dash-card-muted--neutral min-w-0 px-3 py-2.5 ${className}`}
    >
      <dt className="provider-dash-ops-stat-label">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium text-deep-teal">{value}</dd>
    </div>
  );
}

type PortalContentCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
};

export function PortalContentCard({
  children,
  className = "",
  as: Tag = "div",
}: PortalContentCardProps) {
  return <Tag className={`provider-dash-card ${className}`}>{children}</Tag>;
}

type PortalLinkCardProps = {
  href: string;
  label: string;
  description?: string;
  className?: string;
};

export function PortalLinkCard({
  href,
  label,
  description,
  className = "",
}: PortalLinkCardProps) {
  return (
    <Link
      href={href}
      className={`provider-dash-card block p-5 transition-[border-color,box-shadow,transform] hover:border-pacific-teal/22 ${className}`}
    >
      <p className="font-medium text-deep-teal">{label}</p>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-deep-teal/55">{description}</p>
      ) : null}
    </Link>
  );
}

export function portalPanelCardClass(extra = "") {
  return `provider-dash-card overflow-hidden ${extra}`.trim();
}
