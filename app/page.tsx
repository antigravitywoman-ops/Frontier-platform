import { ApplyNavbar } from "@/components/apply/ApplyNavbar";
import { CatalogSection } from "@/components/landing/CatalogSection";
import { CoaCertificateSection } from "@/components/landing/CoaCertificateSection";
import { ComplianceFaqSection } from "@/components/landing/ComplianceFaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { HeroProblemTransition } from "@/components/landing/HeroProblemTransition";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { OnboardCtaSection } from "@/components/landing/OnboardCtaSection";
import { PayoutSection } from "@/components/landing/PayoutSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { SectionGradient } from "@/components/landing/SectionGradient";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <ApplyNavbar fixed />
      <HeroProblemTransition />
      <PlatformSection />
      <HowItWorksSection />
      <SectionGradient variant="teal-black" />
      <CoaCertificateSection />
      <CatalogSection />
      <PayoutSection />
      <OnboardCtaSection />
      <ComplianceFaqSection />
      <SectionGradient variant="black-teal" />
      <FinalCtaSection />
      <SectionGradient variant="teal-black" />
      <LandingFooter />
    </main>
  );
}
