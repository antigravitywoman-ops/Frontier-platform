export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  id: string;
  title: string;
  links: FooterLink[];
};

export const LANDING_FOOTER = {
  tagline:
    "One platform for sourcing, telemedicine, and verified dispensing — built for clinics.",
  contact: {
    email: "info@frontierbiomedlabs.com",
    entity: "Frontier BioMed LLC",
    address: "2810 N Church St, Ste 88564, Wilmington, DE 19802",
  },
  disclaimer:
    "RUO products are for laboratory research only, not for human or veterinary use. Compounded medications are dispensed only by licensed pharmacies pursuant to a valid prescription. Frontier BioMed is a Delaware LLC.",
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "RUO Policy", href: "/ruo-policy" },
  ] as const satisfies readonly FooterLink[],
  copyright: "Frontier BioMed LLC",
} as const;

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "platform",
    title: "Platform",
    links: [
      { label: "Why Frontier", href: "#why-frontier" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Telemedicine", href: "#why-frontier" },
      { label: "Payouts", href: "#payouts" },
      { label: "Clinic onboarding", href: "/apply" },
    ],
  },
  {
    id: "catalog",
    title: "Catalog",
    links: [
      { label: "Browse catalog", href: "#catalog" },
      { label: "Peptides", href: "#catalog" },
      { label: "Compounds", href: "#catalog" },
      { label: "Lab supplies", href: "#catalog" },
    ],
  },
  {
    id: "safety",
    title: "Safety",
    links: [
      { label: "Batch verification", href: "#coa-certificate" },
      { label: "COA standards", href: "#coa-certificate" },
      { label: "Multi-panel testing", href: "#coa-certificate" },
      { label: "Cold-chain", href: "#faqs" },
    ],
  },
  {
    id: "compliance",
    title: "Compliance",
    links: [
      { label: "FAQs", href: "#faqs" },
      { label: "RUO vs. pharmacy", href: "#faqs" },
      { label: "Licensed pharmacies", href: "#faqs" },
      { label: "RUO Policy", href: "/ruo-policy" },
    ],
  },
  {
    id: "company",
    title: "Company",
    links: [
      { label: "Clinic onboarding", href: "/apply" },
      { label: "Contact", href: "mailto:info@frontierbiomedlabs.com" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];
