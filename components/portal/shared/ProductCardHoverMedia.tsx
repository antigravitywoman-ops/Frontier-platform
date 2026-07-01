"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type ProductCardHoverMediaProps = {
  primarySrc: string;
  hoverSrc?: string | null;
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  overlay?: ReactNode;
};

export function ProductCardHoverMedia({
  primarySrc,
  hoverSrc,
  alt = "",
  className = "",
  imageClassName = "object-contain p-4",
  sizes,
  overlay,
}: ProductCardHoverMediaProps) {
  const hasAlternate = Boolean(hoverSrc && hoverSrc !== primarySrc);
  const unoptimizedPrimary = primarySrc.startsWith("http");
  const unoptimizedHover = hoverSrc?.startsWith("http") ?? false;

  return (
    <div className={`provider-product-card-media relative overflow-hidden ${className}`}>
      <Image
        src={primarySrc}
        alt={alt}
        fill
        className={`provider-product-card-media-primary ${imageClassName} ${
          hasAlternate
            ? "group-hover:scale-[1.02] group-hover:opacity-0"
            : "group-hover:scale-[1.05]"
        }`}
        sizes={sizes}
        unoptimized={unoptimizedPrimary}
      />
      {hasAlternate && hoverSrc ? (
        <Image
          src={hoverSrc}
          alt=""
          fill
          aria-hidden
          className={`provider-product-card-media-hover ${imageClassName} opacity-0 group-hover:scale-[1.05] group-hover:opacity-100`}
          sizes={sizes}
          unoptimized={unoptimizedHover}
        />
      ) : null}
      {overlay}
    </div>
  );
}
