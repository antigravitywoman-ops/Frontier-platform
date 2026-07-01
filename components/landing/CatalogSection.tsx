import { layoutContainerClass, layoutSectionYClass } from "@/lib/brand/design-system";
import { typeSectionLabel } from "@/lib/brand/typography";
import { CATALOG_SECTION } from "@/lib/landing/catalog-section";
import { LANDING_SURFACE } from "@/lib/landing/landing-surfaces";
import { CatalogDashboardPreview } from "@/components/landing/catalog/CatalogDashboardPreview";

const surface = LANDING_SURFACE.white;

export function CatalogSection() {
  return (
    <section
      id="catalog"
      aria-labelledby="catalog-section-heading"
      className={`relative overflow-hidden ${surface.section} ${layoutSectionYClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 72% 18%, color-mix(in srgb, var(--color-coral-blush) 40%, transparent) 0%, transparent 48%)",
        }}
        aria-hidden
      />

      <div className={`${layoutContainerClass} relative`}>
        <div className="mx-auto max-w-4xl text-center">
          <p className={`${typeSectionLabel} ${surface.label}`}>{CATALOG_SECTION.label}</p>

          <h2
            id="catalog-section-heading"
            className="sr-only"
          >
            The Frontier catalog
          </h2>

          <p className={`mt-5 font-sans text-base font-normal leading-relaxed sm:mt-6 sm:text-lg ${surface.body}`}>
            {CATALOG_SECTION.categories.join(" · ")}
          </p>
        </div>

        <div
          className={`mx-auto mt-12 grid max-w-4xl grid-cols-1 divide-y sm:mt-14 sm:grid-cols-3 sm:divide-x sm:divide-y-0 ${surface.border}`}
          aria-label="Catalog statistics"
        >
          {CATALOG_SECTION.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-6 py-8 text-center sm:py-10"
            >
              <p className={`font-sans text-4xl font-normal tracking-[-0.03em] sm:text-5xl ${surface.heading}`}>
                {stat.value}
              </p>
              <p className={`mt-2 font-sans text-sm font-normal sm:text-base ${surface.muted}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          <div
            className="pointer-events-none absolute -inset-x-6 -top-10 bottom-8 rounded-[2rem] bg-pacific-teal/8 blur-3xl"
            aria-hidden
          />
          <CatalogDashboardPreview />
        </div>
      </div>
    </section>
  );
}
