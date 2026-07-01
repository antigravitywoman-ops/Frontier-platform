import { ComplianceFaqAccordion } from "@/components/landing/compliance-faq/ComplianceFaqAccordion";
import { layoutContainerClass, layoutSectionYClass } from "@/lib/brand/design-system";
import { COMPLIANCE_FAQ_SECTION } from "@/lib/landing/compliance-faq-section";
import { LANDING_SURFACE, landingHeadline } from "@/lib/landing/landing-surfaces";

const surface = LANDING_SURFACE.black;

export function ComplianceFaqSection() {
  return (
    <section
      id="faqs"
      aria-labelledby="compliance-faq-heading"
      className={`${surface.section} ${layoutSectionYClass}`}
    >
      <div className={layoutContainerClass}>
        <h2
          id="compliance-faq-heading"
          className={`${landingHeadline} mx-auto text-center ${surface.heading}`}
        >
          {COMPLIANCE_FAQ_SECTION.heading}
        </h2>

        <div className="mx-auto mt-10 w-full max-w-3xl lg:mt-12">
          <ComplianceFaqAccordion />
        </div>
      </div>
    </section>
  );
}
