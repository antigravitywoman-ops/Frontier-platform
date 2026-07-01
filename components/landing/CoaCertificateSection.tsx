import { layoutContainerClass, layoutSectionYClass } from "@/lib/brand/design-system";
import { COA_CERTIFICATIONS, COA_SECTION } from "@/lib/landing/coa-section";
import { landingHeadline, landingMicroLabel, LANDING_SURFACE } from "@/lib/landing/landing-surfaces";
import { CoaCertificateVisual } from "@/components/landing/coa/CoaCertificateVisual";

const surface = LANDING_SURFACE.black;

export function CoaCertificateSection() {
  return (
    <section
      id="coa-certificate"
      aria-labelledby="coa-certificate-heading"
      className={`relative overflow-hidden ${surface.section} ${layoutSectionYClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 58%, color-mix(in srgb, var(--color-pacific-teal) 14%, transparent) 0%, transparent 42%)",
        }}
        aria-hidden
      />

      <div className={`${layoutContainerClass} relative`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="coa-certificate-heading"
            className={`${landingHeadline} ${surface.heading}`}
          >
            {COA_SECTION.headline}
          </h2>
          <p className={`mx-auto mt-5 max-w-2xl font-sans text-base font-normal leading-relaxed sm:mt-6 sm:text-lg ${surface.body}`}>
            {COA_SECTION.body}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-20">
          <CoaCertificateVisual />
        </div>

        <div className={`mt-14 border-t ${surface.border} pt-8 sm:mt-16`}>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
            {COA_CERTIFICATIONS.map((label, index) => (
              <li key={label} className="flex items-center gap-x-6 sm:gap-x-10">
                <span className={`${landingMicroLabel} ${surface.muted}`}>
                  {label}
                </span>
                {index < COA_CERTIFICATIONS.length - 1 ? (
                  <span className="hidden size-1 rounded-full bg-pacific-teal/35 sm:block" aria-hidden />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
