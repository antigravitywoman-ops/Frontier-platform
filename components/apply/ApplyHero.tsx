"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { ApplyNavbar } from "@/components/apply/ApplyNavbar";
import { fadeInUp, motion, staggerContainer, transition } from "@/components/motion";
import {
  glassCtaGhostOnMediaClass,
} from "@/lib/brand/design-system";
import { OnboardCtaLink } from "@/components/landing/OnboardCtaLink";
import { useScrollSectionProgress } from "@/hooks/use-scroll-section-progress";
import { SCROLL_TIMELINE } from "@/lib/landing/hero-scroll-phases";

const HeroScrollWebGL = dynamic(
  () => import("@/components/landing/HeroScrollWebGL").then((mod) => mod.HeroScrollWebGL),
  { ssr: false },
);

const HERO_COPY = {
  headline: "Single platform for all modern clinic needs",
  subhead: [
    "FrontierBioMed brings your suppliers, pharmacy, labs, and telemedicine onto one rail —",
    "so patients get prescribed and dispensed in one place, and you know every vial was tested before it shipped.",
  ],
  onboard: { label: "Onboard now", href: "/apply" },
  browseCatalog: { label: "Browse the catalog", href: "#catalog" },
} as const;

export function ApplyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollSectionProgress(sectionRef);
  const textHidden = progress >= SCROLL_TIMELINE.heroTextEnd;
  const textOpacity = textHidden
    ? 0
    : Math.max(0, 1 - progress / SCROLL_TIMELINE.heroTextEnd);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero"
      className="relative h-[260vh]"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <HeroScrollWebGL progress={progress} className="absolute inset-0" />

        <ApplyNavbar />

        <div
          className="relative z-10 flex h-full items-start justify-center px-4 pt-24 sm:px-8 sm:pt-28 md:pt-32 lg:px-10 lg:pt-36"
          style={{
            opacity: textOpacity,
            pointerEvents: textHidden ? "none" : "auto",
            visibility: textHidden ? "hidden" : "visible",
          }}
          aria-hidden={textHidden}
        >
          <motion.div
            className="mx-auto w-full max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="type-display mx-auto max-w-[22ch] text-balance text-pure-white sm:max-w-[26ch]"
              variants={fadeInUp}
              transition={transition}
            >
              {HERO_COPY.headline}
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-3xl text-pretty font-sans text-base font-light leading-snug text-pure-white/82 sm:mt-5 sm:text-lg sm:leading-relaxed lg:max-w-4xl"
              variants={fadeInUp}
              transition={transition}
            >
              {HERO_COPY.subhead[0]}
              <br />
              {HERO_COPY.subhead[1]}
            </motion.p>

            <motion.div
              className="pointer-events-auto mt-5 flex flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row sm:flex-wrap"
              variants={fadeInUp}
              transition={transition}
            >
              <OnboardCtaLink
                href={HERO_COPY.onboard.href}
                label={HERO_COPY.onboard.label}
                variant="media"
              />
              <Link href={HERO_COPY.browseCatalog.href} className={glassCtaGhostOnMediaClass}>
                {HERO_COPY.browseCatalog.label}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
