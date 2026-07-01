"use client";

import Image from "next/image";
import Link from "next/link";
import { FrontierLogo, FrontierLogomark } from "@/components/FrontierLogo";

export type PortalTopBarBrandConfig = {
  logoUrl?: string | null;
  clinicName?: string;
  /** Patient portal — always show clinic slot + powered-by line */
  showPoweredBy?: boolean;
};

type PortalTopBarBrandProps = PortalTopBarBrandConfig & {
  homeHref: string;
  variant?: "desktop" | "mobile";
  priority?: boolean;
};

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:");
}

export function PortalTopBarBrand({
  homeHref,
  logoUrl,
  clinicName,
  showPoweredBy = false,
  variant = "desktop",
  priority = false,
}: PortalTopBarBrandProps) {
  const useClinicBrand = showPoweredBy || Boolean(logoUrl?.trim() || clinicName?.trim());

  if (!useClinicBrand) {
    return (
      <Link href={homeHref} className="portal-top-bar-brand" aria-label="Frontier Biomed">
        {variant === "mobile" ? (
          <FrontierLogomark priority={priority} />
        ) : (
          <FrontierLogo variant="primary" priority={priority} className="h-10 w-auto sm:h-11" />
        )}
      </Link>
    );
  }

  const label = clinicName?.trim() || "Your clinic";

  return (
    <Link
      href={homeHref}
      className={`portal-top-bar-brand portal-top-bar-brand--clinic ${
        variant === "mobile" ? "portal-top-bar-brand--mobile" : ""
      }`}
      aria-label={label}
    >
      <div className="portal-top-bar-clinic-logo">
        {logoUrl?.trim() ? (
          <Image
            src={logoUrl}
            alt={`${label} logo`}
            width={variant === "mobile" ? 96 : 160}
            height={variant === "mobile" ? 40 : 48}
            className="portal-top-bar-clinic-logo-image"
            priority={priority}
            unoptimized={isRemoteImage(logoUrl)}
          />
        ) : (
          <span className="portal-top-bar-clinic-name">{label}</span>
        )}
      </div>
      <p className="portal-top-bar-powered-by">
        Powered by <span className="portal-top-bar-powered-by-brand">Frontier Biomed</span>
      </p>
    </Link>
  );
}
