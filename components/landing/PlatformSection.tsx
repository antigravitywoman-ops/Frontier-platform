"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { PlatformDotGrid } from "@/components/landing/platform/PlatformDotGrid";
import { layoutContainerClass } from "@/lib/brand/design-system";
import { landingHeadline } from "@/lib/landing/landing-surfaces";
import { useScrollSectionProgress } from "@/hooks/use-scroll-section-progress";
import {
  getPlatformActiveIndex,
  PLATFORM_PANELS,
  PLATFORM_SECTION,
} from "@/lib/landing/platform-section";

export function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [maxOffset, setMaxOffset] = useState(0);

  const progress = useScrollSectionProgress(sectionRef);
  const activeIndex = getPlatformActiveIndex(progress);
  const translateX = progress * maxOffset;

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();

    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    if (viewportRef.current) observer.observe(viewportRef.current);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="why-frontier"
      ref={sectionRef}
      aria-labelledby="platform-section-heading"
      className="relative bg-pure-white"
      style={{ height: `${PLATFORM_SECTION.scrollHeightVh}vh` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-pure-white">
        <div
          className={`${layoutContainerClass} relative z-10 flex shrink-0 justify-center px-4 pt-20 pb-1 sm:pt-24 sm:pb-1.5 lg:pt-28 lg:pb-2`}
        >
          <h2
            id="platform-section-heading"
            className={`${landingHeadline} max-w-3xl text-center text-deep-teal`}
          >
            {PLATFORM_SECTION.heading}
          </h2>
        </div>

        <div
          ref={viewportRef}
          className="relative min-h-0 flex-1 overflow-hidden pb-2 pt-0 sm:pb-3"
          aria-label="Platform features"
        >
          <div
            ref={trackRef}
            className="flex h-full w-max items-center gap-5 pl-4 will-change-transform sm:gap-6 sm:pl-8 lg:pl-20"
            style={{ transform: `translate3d(-${translateX}px, 0, 0)` }}
          >
            {PLATFORM_PANELS.map((panel, index) => (
              <article
                key={panel.id}
                className="grid h-[min(72vh,560px)] w-[min(90vw,880px)] shrink-0 grid-cols-1 overflow-hidden rounded-[1.25rem] border border-deep-teal/10 bg-pure-white shadow-[0_20px_50px_rgba(1,26,36,0.06)] md:h-[min(58vh,520px)] md:grid-cols-2 md:items-stretch"
              >
                <div className="flex items-center border-deep-teal/10 p-5 sm:p-6 md:border-r lg:p-8">
                  <div className="w-full min-w-0">
                    <p className="text-pretty font-sans text-lg font-normal tracking-[-0.02em] text-deep-teal sm:text-xl lg:max-w-[22ch]">
                      {panel.lead}
                    </p>
                    <p className="mt-3 text-pretty font-sans text-sm font-normal leading-relaxed text-deep-teal/65 sm:text-base lg:max-w-[34ch]">
                      {panel.detail}
                    </p>

                    <Link
                      href={panel.cta.href}
                      className="group mt-5 inline-flex items-center gap-2 font-sans text-sm font-normal text-deep-teal transition-colors hover:text-pacific-teal sm:mt-6"
                    >
                      <span>{panel.cta.label}</span>
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>

                <div className="relative min-h-[min(32vh,240px)] w-full overflow-hidden md:min-h-0 md:h-full">
                  <PlatformDotGrid className="opacity-60" />
                  <Image
                    src={panel.asset}
                    alt={panel.lead}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 90vw, 440px"
                    priority={index === 0}
                    onLoad={() => {
                      const track = trackRef.current;
                      const viewport = viewportRef.current;
                      if (!track || !viewport) return;
                      setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth));
                    }}
                  />
                </div>
              </article>
            ))}

            <div className="w-4 shrink-0 sm:w-8 lg:w-20" aria-hidden />
          </div>
        </div>

        <div
          className="flex shrink-0 items-center justify-center gap-2 pb-5 pt-1 sm:pb-6"
          aria-hidden
        >
          {PLATFORM_PANELS.map((panel, index) => (
            <span
              key={panel.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 bg-pacific-teal"
                  : "w-1.5 bg-deep-teal/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
