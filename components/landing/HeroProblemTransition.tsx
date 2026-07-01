"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { fadeInUp, motion, staggerContainer, transition } from "@/components/motion";
import { glassCtaGhostOnMediaClass } from "@/lib/brand/design-system";
import { OnboardCtaLink } from "@/components/landing/OnboardCtaLink";
import {
  getHeroScrollPhases,
  getProblemPointIndex,
  HERO_SCROLL_HEIGHT_VH,
  lerp,
} from "@/lib/landing/hero-scroll-phases";
import { PROBLEM_POINTS } from "@/lib/landing/problem-points";
import { ProblemPointImage, ProblemPointsPanel } from "@/components/landing/ProblemPointsPanel";
import { useScrollSectionProgress } from "@/hooks/use-scroll-section-progress";

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

type MorphRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function getFullscreenRect(): MorphRect {
  return {
    top: 0,
    left: 0,
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  };
}

function lerpRect(from: MorphRect, to: MorphRect, t: number): MorphRect {
  return {
    top: lerp(from.top, to.top, t),
    left: lerp(from.left, to.left, t),
    width: lerp(from.width, to.width, t),
    height: lerp(from.height, to.height, t),
  };
}

export function HeroProblemTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageTargetRef = useRef<HTMLDivElement>(null);
  const progress = useScrollSectionProgress(sectionRef);
  const phases = getHeroScrollPhases(progress);
  const [activePoint, setActivePoint] = useState(0);
  const [pointLockedByUser, setPointLockedByUser] = useState(false);
  const [targetRect, setTargetRect] = useState<MorphRect | null>(null);

  const measureTarget = useCallback(() => {
    const el = imageTargetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, { passive: true });
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget);
    };
  }, [measureTarget]);

  useEffect(() => {
    if (phases.morphActive) measureTarget();
  }, [phases.morphActive, phases.morphProgress, measureTarget]);

  useEffect(() => {
    if (pointLockedByUser) return;
    setActivePoint(getProblemPointIndex(progress, PROBLEM_POINTS.length));
  }, [pointLockedByUser, progress]);

  const heroTextHidden = phases.heroTextOpacity <= 0.02;
  const split = phases.splitProgress;
  const problemVisible = phases.problemInteractive;
  const morphT = phases.morphProgress;
  const morphImageSrc = PROBLEM_POINTS[0].image;

  const fullscreen = getFullscreenRect();
  const endRect = targetRect ?? fullscreen;
  const morphRect = lerpRect(fullscreen, endRect, morphT);
  const morphRadius = lerp(0, 24, morphT);
  const morphShadowOpacity = morphT;

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Hero"
      className="relative"
      style={{ height: `${HERO_SCROLL_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-black">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-black"
          style={{ opacity: phases.zoomBlackout }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-black"
          style={{ opacity: phases.backdropOpacity }}
        />

        <div
          className="absolute inset-0 z-[1] will-change-transform"
          style={{ opacity: phases.mediaOpacity }}
        >
          <HeroScrollWebGL
            progress={phases.frameProgress}
            className="absolute inset-0"
            backgroundClassName="bg-deep-teal"
          />
        </div>

        {phases.morphActive && !phases.morphComplete ? (
          <div
            className="pointer-events-none fixed z-[18] hidden overflow-hidden will-change-[top,left,width,height,border-radius] lg:block"
            style={{
              top: morphRect.top,
              left: morphRect.left,
              width: morphRect.width,
              height: morphRect.height,
              borderRadius: morphRadius,
              boxShadow: `0 ${lerp(0, 32, morphShadowOpacity)}px ${lerp(0, 80, morphShadowOpacity)}px rgba(0,0,0,${lerp(0, 0.45, morphShadowOpacity)})`,
            }}
            aria-hidden
          >
            <Image
              src={morphImageSrc}
              alt={PROBLEM_POINTS[0].title}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            {morphT > 0.85 ? (
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10" />
            ) : null}
          </div>
        ) : null}

        {/* Layout anchor for morph target — always measurable, never faded */}
        <div
          className="pointer-events-none absolute inset-0 z-[5] hidden h-full min-h-0 grid-cols-1 lg:grid lg:grid-cols-[minmax(0,42%)_1fr]"
          aria-hidden
        >
          <div />
          <div className="flex h-full w-full items-center justify-center px-4 xl:px-8">
            <div ref={imageTargetRef} className="h-[76vh] w-full rounded-3xl" />
          </div>
        </div>

        <div
          className="relative z-10 flex h-full items-start justify-center px-4 pt-24 sm:px-8 sm:pt-28 md:pt-32 lg:px-10 lg:pt-36"
          style={{
            opacity: phases.heroTextOpacity,
            pointerEvents: heroTextHidden ? "none" : "auto",
            visibility: heroTextHidden ? "hidden" : "visible",
          }}
          aria-hidden={heroTextHidden}
        >
          <motion.div
            className="mx-auto w-full max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="type-display mx-auto max-w-[22ch] text-balance font-normal text-pure-white drop-shadow-[0_2px_24px_rgba(1,26,36,0.45)] sm:max-w-[26ch]"
              variants={fadeInUp}
              transition={transition}
            >
              {HERO_COPY.headline}
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-3xl text-pretty font-sans text-base font-normal leading-snug text-pure-white drop-shadow-[0_1px_16px_rgba(1,26,36,0.4)] sm:mt-5 sm:text-lg sm:leading-relaxed lg:max-w-4xl"
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

        <div
          id="problem"
          className="pointer-events-none absolute inset-0 z-20 grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,42%)_1fr]"
          style={{
            opacity: phases.problemTextOpacity,
            transform: `translateY(${lerp(24, 0, split)}px)`,
          }}
          aria-hidden={!problemVisible}
        >
          <div
            className="flex items-center px-4 py-10 sm:px-8 lg:px-10 lg:py-0 xl:px-14"
            style={{ pointerEvents: problemVisible ? "auto" : "none" }}
          >
            <div className="w-full max-w-xl">
              <ProblemPointsPanel
                interactive={problemVisible}
                activeIndex={activePoint}
                onActiveIndexChange={(index) => {
                  setPointLockedByUser(true);
                  setActivePoint(index);
                }}
              />
              {problemVisible ? (
                <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10 lg:hidden">
                  <ProblemPointImage activeIndex={activePoint} className="h-full w-full" />
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="relative hidden h-full w-full items-center justify-center px-4 lg:flex xl:px-8"
            style={{ pointerEvents: problemVisible ? "auto" : "none" }}
          >
            <div className="relative h-[76vh] w-full overflow-hidden rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
              {phases.morphComplete ? (
                <ProblemPointImage activeIndex={activePoint} className="absolute inset-0 h-full w-full" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
