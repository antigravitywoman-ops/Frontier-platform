import Image from "next/image";
import {
  LOGO_ASSETS,
  LOGO_DIMENSIONS,
  LOGOMARK_ASSETS,
  LOGOMARK_DIMENSIONS,
  type LogoVariant,
  type LogomarkVariant,
} from "@/lib/brand/logos";

type FrontierLogoProps = {
  /** white — dark surfaces · primary — teal · black — light surfaces · secondary — coral accent */
  variant?: LogoVariant;
  /** Icon mark only — collapsed sidebar */
  compact?: boolean;
  className?: string;
  priority?: boolean;
};

function BrandImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) {
  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}

export function FrontierLogo({
  variant = "primary",
  compact = false,
  className = "",
  priority = false,
}: FrontierLogoProps) {
  const src = LOGO_ASSETS[variant];

  if (compact) {
    return (
      <span className={`inline-flex h-9 w-9 overflow-hidden ${className}`}>
        <BrandImage
          src={src}
          alt="Frontier Biomed"
          width={LOGO_DIMENSIONS.width}
          height={LOGO_DIMENSIONS.height}
          className="h-9 w-auto max-w-none shrink-0 object-left"
          priority={priority}
        />
      </span>
    );
  }

  return (
    <BrandImage
      src={src}
      alt="Frontier Biomed"
      width={LOGO_DIMENSIONS.width}
      height={LOGO_DIMENSIONS.height}
      className={`h-9 w-auto ${className}`}
      priority={priority}
    />
  );
}

type FrontierLogomarkProps = {
  variant?: LogomarkVariant;
  className?: string;
  priority?: boolean;
};

/** Frontier logomark SVG — compact brand surfaces */
export function FrontierLogomark({
  variant = "primary",
  className = "",
  priority = false,
}: FrontierLogomarkProps) {
  return (
    <span
      className={`inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-deep-teal/10 bg-pure-white p-1.5 shadow-[0_2px_8px_rgba(1,26,36,0.06)] ${className}`}
    >
      <BrandImage
        src={LOGOMARK_ASSETS[variant]}
        alt="Frontier Biomed"
        width={LOGOMARK_DIMENSIONS.width}
        height={LOGOMARK_DIMENSIONS.height}
        className="size-full object-contain"
        priority={priority}
      />
    </span>
  );
}
