import { layoutContainerClass } from "@/lib/brand/design-system";
import { OnboardCtaLink } from "@/components/landing/OnboardCtaLink";
import { LANDING_SURFACE } from "@/lib/landing/landing-surfaces";
import { ONBOARD_CTA_SECTION } from "@/lib/landing/onboard-cta-section";

const surface = LANDING_SURFACE.white;

export function OnboardCtaSection() {
  return (
    <section
      id="onboard"
      aria-labelledby="onboard-cta-heading"
      className={`${surface.section} py-28 sm:py-36 lg:py-44`}
    >
      <div className={`${layoutContainerClass} text-center`}>
        <h2
          id="onboard-cta-heading"
          className={`mx-auto text-center font-sans text-[clamp(1.75rem,5.5vw+0.75rem,5rem)] font-normal leading-[1.02] tracking-[-0.035em] ${surface.heading}`}
        >
          <span className="block whitespace-nowrap">{ONBOARD_CTA_SECTION.headlineLine1}</span>
          <span className="block whitespace-nowrap">{ONBOARD_CTA_SECTION.headlineLine2}</span>
        </h2>

        <p className={`mx-auto mt-5 max-w-2xl text-balance font-sans text-base font-normal leading-relaxed sm:mt-6 sm:text-lg ${surface.body}`}>
          {ONBOARD_CTA_SECTION.subline}
        </p>

        <OnboardCtaLink
          href={ONBOARD_CTA_SECTION.cta.href}
          label={ONBOARD_CTA_SECTION.cta.label}
          variant="solid-dark"
          className="mt-10 sm:mt-12"
        />
      </div>
    </section>
  );
}
