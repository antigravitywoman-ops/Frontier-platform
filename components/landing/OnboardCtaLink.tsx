import Link from "next/link";
import {
  onboardCtaMediaClass,
  onboardCtaSolidDarkClass,
  onboardCtaSolidLightClass,
} from "@/lib/brand/design-system";
import { PortalCtaMark } from "@/components/landing/PortalCtaMark";

export type OnboardCtaVariant = "media" | "solid-dark" | "solid-light";

const VARIANT_CLASS = {
  media: onboardCtaMediaClass,
  "solid-dark": onboardCtaSolidDarkClass,
  "solid-light": onboardCtaSolidLightClass,
} as const;

const MARK_VARIANT = {
  media: "on-media",
  "solid-dark": "on-media",
  "solid-light": "on-light",
} as const;

type OnboardCtaLinkProps = {
  href?: string;
  label?: string;
  variant?: OnboardCtaVariant;
  className?: string;
};

export function OnboardCtaLink({
  href = "/apply",
  label = "Onboard now",
  variant = "solid-dark",
  className = "",
}: OnboardCtaLinkProps) {
  return (
    <Link href={href} className={`${VARIANT_CLASS[variant]} ${className}`.trim()}>
      <span>{label}</span>
      <PortalCtaMark variant={MARK_VARIANT[variant]} />
    </Link>
  );
}
