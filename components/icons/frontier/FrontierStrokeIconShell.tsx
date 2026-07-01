"use client";

import type { FrontierIconProps } from "@/lib/icons/types";

type FrontierStrokeIconShellProps = FrontierIconProps & {
  paths: string | readonly string[];
  strokeWidth?: number;
};

export function FrontierStrokeIconShell({
  paths,
  className = "",
  size = 24,
  strokeWidth = 1.5,
  "aria-hidden": ariaHidden = true,
  role,
}: FrontierStrokeIconShellProps) {
  const hidden = ariaHidden === true || ariaHidden === "true";
  const pathList = Array.isArray(paths) ? paths : [paths];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={hidden}
      role={role}
    >
      {pathList.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
