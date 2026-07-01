"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { HowItWorksHoverImage } from "@/components/landing/HowItWorksHoverImage";
import { layoutContainerClass, layoutSectionYClass } from "@/lib/brand/design-system";
import {
  HOW_IT_WORKS_SECTION,
  HOW_IT_WORKS_STEPS,
  type HowItWorksStep,
} from "@/lib/landing/how-it-works";
import { LANDING_SURFACE } from "@/lib/landing/landing-surfaces";

const surface = LANDING_SURFACE.teal;
const IMAGE_ROUNDING = "rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2rem]";
const CARDS_RAIL_CLASS =
  "mx-auto mt-10 hidden w-full max-w-[min(calc(100vw-2rem),96rem)] px-3 sm:mt-12 sm:px-4 lg:block lg:px-5 xl:px-6";

function StepCopyColumn({ step }: { step: HowItWorksStep }) {
  return (
    <article className="min-w-0 text-center">
      <h3 className="font-sans text-lg font-normal leading-snug text-pure-white sm:text-xl">
        {step.title}
      </h3>
      <p className="mt-3 font-sans text-base font-normal leading-relaxed text-pure-white/70">
        {step.description}
      </p>
    </article>
  );
}

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepCount = HOW_IT_WORKS_STEPS.length;

  const goPrev = () => setActiveIndex((index) => (index - 1 + stepCount) % stepCount);
  const goNext = () => setActiveIndex((index) => (index + 1) % stepCount);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={`${surface.section} overflow-x-clip ${layoutSectionYClass}`}
    >
      <div className={layoutContainerClass}>
        <h2
          id="how-it-works-heading"
          className={`type-h2 mx-auto w-full text-center font-sans font-normal leading-[1.12] tracking-[-0.01em] text-[clamp(1.0625rem,2.2vw+0.55rem,2.25rem)] ${surface.heading}`}
        >
          <span className="block whitespace-nowrap">{HOW_IT_WORKS_SECTION.headlineLine1}</span>
          <span className="block whitespace-nowrap">{HOW_IT_WORKS_SECTION.headlineLine2}</span>
        </h2>
      </div>

      <div className={CARDS_RAIL_CLASS}>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <article key={step.id} className="flex min-w-0 flex-col">
              <div className={`relative w-full overflow-hidden ${IMAGE_ROUNDING}`}>
                <div className="relative w-full pt-[100%] sm:pt-[105%] lg:pt-[110%]">
                  <div className="absolute inset-0">
                    <HowItWorksHoverImage
                      primarySrc={step.asset}
                      hoverSrc={step.hoverAsset}
                      alt={step.title}
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 32vw"
                      className="h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <StepCopyColumn step={step} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={`${layoutContainerClass} mt-10 sm:mt-12 lg:hidden`}>
        <div className={`relative aspect-[10/11] overflow-hidden sm:aspect-[10/12] ${IMAGE_ROUNDING}`}>
          <HowItWorksHoverImage
            primarySrc={HOW_IT_WORKS_STEPS[activeIndex].asset}
            hoverSrc={HOW_IT_WORKS_STEPS[activeIndex].hoverAsset}
            alt={HOW_IT_WORKS_STEPS[activeIndex].title}
            priority={activeIndex === 0}
            sizes="100vw"
            className="h-full"
          />

          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-pure-white/95 p-1 shadow-[0_8px_24px_rgba(1,26,36,0.18)]">
            <button
              type="button"
              onClick={goPrev}
              className="flex size-9 items-center justify-center rounded-full text-deep-teal/45 transition-colors hover:text-deep-teal"
              aria-label="Previous step"
            >
              <ChevronLeft className="size-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex size-9 items-center justify-center rounded-full bg-pacific-teal text-pure-white transition-colors hover:bg-deep-teal"
              aria-label="Next step"
            >
              <ChevronRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <StepCopyColumn step={HOW_IT_WORKS_STEPS[activeIndex]} />
        </div>
      </div>
    </section>
  );
}
