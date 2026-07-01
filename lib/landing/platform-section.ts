export type PlatformPanel = {
  id: string;
  lead: string;
  detail: string;
  cta: { label: string; href: string };
  asset: string;
};

export const PLATFORM_PANELS: PlatformPanel[] = [
  {
    id: "source",
    lead: "Source everything in one place",
    detail: "1,000+ pharmacy products, 100+ peptides, 20+ lab supplies.",
    cta: { label: "Explore catalog", href: "#catalog" },
    asset: "/assets/platform/platform-catalog.png",
  },
  {
    id: "telemedicine",
    lead: "Telemedicine built in",
    detail:
      "Patients consult a licensed physician; approved scripts flow straight to fulfillment.",
    cta: { label: "Explore telemedicine", href: "#telemedicine" },
    asset: "/assets/platform/platform-telemedicine.png",
  },
  {
    id: "verified",
    lead: "Every batch verified",
    detail:
      "Multi-panel tested for purity, potency, heavy metals, and sterility before it ships.",
    cta: { label: "View quality standards", href: "#catalog" },
    asset: "/assets/platform/platform-verified.png",
  },
  {
    id: "margin",
    lead: "The reorder stays yours",
    detail: "Your retail price, your margin, your patient.",
    cta: { label: "Request early access", href: "/apply" },
    asset: "/assets/platform/platform-margin.png",
  },
];

export const PLATFORM_SECTION = {
  heading: "One platform that replaces all of it:",
  /** One viewport height of vertical scroll per card */
  scrollHeightVh: PLATFORM_PANELS.length * 100,
  /** Matches card image container aspect ratio */
  imageAspect: "3 / 2" as const,
  imageWidth: 1536,
  imageHeight: 1024,
} as const;

export function getPlatformActiveIndex(
  progress: number,
  panelCount = PLATFORM_PANELS.length,
) {
  if (panelCount <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(panelCount - 1, Math.floor(clamped * panelCount));
}
