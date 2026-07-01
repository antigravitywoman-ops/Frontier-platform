"use client";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

type PortalTopBarUserChipProps = {
  displayName: string;
  subtitle?: string;
  className?: string;
};

export function PortalTopBarUserChip({
  displayName,
  subtitle,
  className = "",
}: PortalTopBarUserChipProps) {
  const initials = initialsFromName(displayName);

  return (
    <div className={`portal-top-bar-user ${className}`.trim()}>
      <span className="portal-top-bar-user-avatar" aria-hidden>
        {initials}
      </span>
      <div className="min-w-0 text-left">
        <p className="portal-top-bar-user-name">{displayName}</p>
        {subtitle ? <p className="portal-top-bar-user-subtitle">{subtitle}</p> : null}
      </div>
    </div>
  );
}
