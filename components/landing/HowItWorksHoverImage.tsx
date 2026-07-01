"use client";

import Image from "next/image";

type HowItWorksHoverImageProps = {
  primarySrc: string;
  hoverSrc: string;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
};

export function HowItWorksHoverImage({
  primarySrc,
  hoverSrc,
  alt,
  priority = false,
  sizes,
  className = "",
}: HowItWorksHoverImageProps) {
  return (
    <div className={`group relative h-full w-full overflow-hidden bg-deep-teal/5 ${className}`.trim()}>
      <Image
        src={primarySrc}
        alt={alt}
        fill
        priority={priority}
        className="how-it-works-media-primary object-cover object-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-0"
        sizes={sizes}
      />
      <Image
        src={hoverSrc}
        alt=""
        fill
        aria-hidden
        className="how-it-works-media-hover object-cover object-center opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-100"
        sizes={sizes}
      />
    </div>
  );
}
