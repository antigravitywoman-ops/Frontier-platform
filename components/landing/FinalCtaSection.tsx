import { OnboardCtaLink } from "@/components/landing/OnboardCtaLink";
import { layoutContainerClass } from "@/lib/brand/design-system";
import { FINAL_CTA_SECTION } from "@/lib/landing/final-cta-section";
import { landingHeadline } from "@/lib/landing/landing-surfaces";

export function FinalCtaSection() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="relative bg-deep-teal py-20 sm:py-28 lg:py-36 xl:py-44"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--color-pacific-teal) 28%, transparent) 0%, transparent 52%), radial-gradient(circle at 82% 78%, color-mix(in srgb, var(--color-pacific-teal) 18%, transparent) 0%, transparent 48%), linear-gradient(180deg, #00161f 0%, var(--color-deep-teal) 42%, #00161f 100%)",
        }}
        aria-hidden
      />

      <div className={`${layoutContainerClass} relative z-[1]`}>
        <div className="relative overflow-visible rounded-[1.75rem] sm:rounded-[2rem] lg:rounded-[2.25rem]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-coral-blush shadow-[0_28px_80px_rgba(0,0,0,0.28)]"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 lg:min-h-[26rem] lg:grid-cols-2">
            <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 xl:px-16">
              <h2
                id="final-cta-heading"
                className={`${landingHeadline} text-deep-teal`}
              >
                <span className="block whitespace-nowrap">{FINAL_CTA_SECTION.headlineLine1}</span>
                <span className="block whitespace-nowrap">{FINAL_CTA_SECTION.headlineLine2}</span>
              </h2>

              <p className="mt-5 max-w-[38ch] font-sans text-base font-normal leading-relaxed text-deep-teal/70 sm:mt-6 sm:text-lg">
                <span className="whitespace-nowrap">{FINAL_CTA_SECTION.sublineLead}</span>{" "}
                {FINAL_CTA_SECTION.sublineRest}
              </p>

              <OnboardCtaLink
                href={FINAL_CTA_SECTION.cta.href}
                label={FINAL_CTA_SECTION.cta.label}
                variant="solid-light"
                className="mt-8 w-fit sm:mt-10"
              />
            </div>

            <div className="relative z-20 flex items-end justify-center px-6 pb-6 pt-2 sm:px-8 sm:pb-8 lg:min-h-[26rem] lg:justify-end lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0">
              <img
                src={FINAL_CTA_SECTION.image}
                alt={FINAL_CTA_SECTION.imageAlt}
                width={384}
                height={539}
                className="block h-auto w-full max-w-[260px] object-contain object-bottom sm:max-w-[300px] lg:absolute lg:bottom-0 lg:left-[2%] lg:w-[min(42vw,400px)] lg:max-w-none lg:translate-x-[18%]"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
