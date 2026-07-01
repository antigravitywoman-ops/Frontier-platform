export type ComplianceFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const COMPLIANCE_FAQ_SECTION = {
  heading: "Frequently Asked Questions",
} as const;

export const COMPLIANCE_FAQ_ITEMS: ComplianceFaqItem[] = [
  {
    id: "ruo-vs-pharmacy",
    question: "RUO vs. pharmacy?",
    answer:
      "Each product routes down its correct legal pathway. Compounded scripts are filled by licensed pharmacies against a valid prescription; RUO materials are supplied strictly under that designation.",
  },
  {
    id: "batch-tested",
    question: "How do I know a batch is tested?",
    answer:
      "Multi-panel testing before release, with every vial traceable to its batch record.",
  },
  {
    id: "telemedicine",
    question: "How does telemedicine work?",
    answer:
      "A licensed partner handles intake and the physician consult; approved scripts route into your catalog. No separate tool to run.",
  },
  {
    id: "payouts",
    question: "How do I get paid?",
    answer:
      "Set retail, margin auto-calculated, payouts on a predictable schedule — processed in-platform.",
  },
  {
    id: "migration",
    question: "How hard is migration?",
    answer:
      "Live in minutes. Most clinics run alongside existing vendors first, then consolidate.",
  },
];
