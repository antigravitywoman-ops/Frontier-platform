export type ProblemPoint = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const PROBLEM_SECTION = {
  titleLine1: "You prescribe it.",
  titleLine2: "Someone else profits.",
  body: "Right now you're juggling a separate login, invoice, and vendor for peptides, compounds, and labs. And the moment a patient leaves, the refill happens somewhere else — you keep the liability, they keep the revenue.",
} as const;

export const PROBLEM_POINTS: ProblemPoint[] = [
  {
    id: "peptides",
    title: "Peptides",
    description:
      "A separate login, invoice, and vendor — just to source and track peptide therapies.",
    image: "/assets/problem/peptides.png",
  },
  {
    id: "compounds",
    title: "Compounds",
    description:
      "Custom compounds live in another portal with their own billing and fulfillment workflow.",
    image: "/assets/problem/compounds.png",
  },
  {
    id: "labs",
    title: "Labs",
    description:
      "Lab orders and results sit in a third system, disconnected from prescribing and dispensing.",
    image: "/assets/problem/labs.png",
  },
  {
    id: "refills",
    title: "Lost refills",
    description:
      "The moment a patient leaves, the refill happens somewhere else — you keep the liability, they keep the revenue.",
    image: "/assets/problem/refills.png",
  },
];
