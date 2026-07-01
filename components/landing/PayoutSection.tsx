import { OrderBreakdownCard } from "@/components/landing/payout/OrderBreakdownCard";
import { PayoutHistoryPreview } from "@/components/landing/payout/PayoutHistoryPreview";
import { layoutContainerClass, layoutSectionYClass } from "@/lib/brand/design-system";
import { typeSectionLabel } from "@/lib/brand/typography";
import {
  landingHeadline,
  LANDING_SURFACE,
} from "@/lib/landing/landing-surfaces";
import {
  PAYOUT_SECTION,
} from "@/lib/landing/payout-section";

const surface = LANDING_SURFACE.teal;

export function PayoutSection() {
  return (
    <section
      id="payouts"
      aria-labelledby="payout-section-heading"
      className={`relative overflow-hidden ${surface.section} ${layoutSectionYClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--color-pacific-teal) 22%, transparent) 0%, transparent 48%)",
        }}
        aria-hidden
      />

      <div className={`${layoutContainerClass} relative`}>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className={`${typeSectionLabel} ${surface.label}`}>{PAYOUT_SECTION.label}</p>

            <h2
              id="payout-section-heading"
              className={`${landingHeadline} mt-5 max-w-2xl ${surface.heading}`}
            >
              {PAYOUT_SECTION.headline}
            </h2>

            <p className={`mt-5 max-w-2xl font-sans text-base font-normal leading-relaxed sm:mt-6 sm:text-lg ${surface.body}`}>
              {PAYOUT_SECTION.body}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-10 xl:gap-12">
            <div className="relative flex h-full min-h-[18.5rem] flex-col">
              <div
                className="pointer-events-none absolute -inset-x-2 -top-3 bottom-1 rounded-2xl bg-black/10 blur-2xl"
                aria-hidden
              />
              <PayoutHistoryPreview className="flex-1" />
            </div>

            <div className="relative flex h-full min-h-[18.5rem] flex-col">
              <div
                className="pointer-events-none absolute -inset-x-4 -top-6 bottom-4 rounded-[2rem] bg-black/15 blur-3xl"
                aria-hidden
              />
              <OrderBreakdownCard className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
