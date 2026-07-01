import type { ReactNode } from "react";

export function ProductCardNameRow({
  name,
  category,
}: {
  name: ReactNode;
  category: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5">
      <div className="min-w-0 font-sans text-base font-semibold leading-snug tracking-[-0.01em] text-deep-teal">
        {name}
      </div>
      <span className="provider-product-category">{category}</span>
    </div>
  );
}

export function ProductCardStatsRow({
  left,
  right,
  leftLabel = "Stock",
  rightLabel = "Clinic price",
}: {
  left: ReactNode;
  right: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="provider-product-stat">
        <p className="provider-product-stat-label">{leftLabel}</p>
        <p className="provider-product-stat-value">{left}</p>
      </div>
      <div className="provider-product-stat">
        <p className="provider-product-stat-label">{rightLabel}</p>
        <p className="provider-product-stat-value">{right}</p>
      </div>
    </div>
  );
}

export function ProductCardActionRow({
  label,
  children,
  className = "",
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`provider-product-card-footer flex items-center justify-between gap-3 ${className}`.trim()}>
      <span className="text-sm font-medium text-deep-teal/65">{label}</span>
      <div className="flex items-center justify-end gap-2">{children}</div>
    </div>
  );
}

export function productCardBodyClass(compact = false) {
  return compact
    ? "flex flex-1 flex-col gap-2.5 p-3.5 sm:p-4"
    : "flex flex-1 flex-col gap-4 p-5";
}

export function productStatValue(value: ReactNode) {
  return <>{value}</>;
}
