export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  asset: string;
  hoverAsset: string;
};

export const HOW_IT_WORKS_SECTION = {
  headlineLine1: "Curate your catalog, consult patients, and ship —",
  headlineLine2: "without leaving the platform.",
} as const;

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: "catalog",
    title: "Curate your catalog.",
    description: "Choose your products, set your retail pricing.",
    asset: "/assets/how-it-works/how-it-works-catalog.png",
    hoverAsset: "/assets/how-it-works/how-it-works-catalog-hover.png",
  },
  {
    id: "consult",
    title: "Patients consult & order.",
    description:
      "Intake and a physician consult happen on the platform; approved scripts route in automatically.",
    asset: "/assets/how-it-works/how-it-works-consult.png",
    hoverAsset: "/assets/how-it-works/how-it-works-consult-hover.png",
  },
  {
    id: "ship",
    title: "We compound, label, and ship.",
    description:
      "Cold-chain, straight to the patient’s door. You never touch logistics.",
    asset: "/assets/how-it-works/how-it-works-ship.png",
    hoverAsset: "/assets/how-it-works/how-it-works-ship-hover.png",
  },
];
