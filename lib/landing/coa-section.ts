export const COA_SECTION = {
  headline: 'Most "COAs" in this space are one cheap panel — or faked.',
  body: "We test every batch on a full multi-panel screen, tie every vial back to it, and source only from FDA-registered cGMP facilities. So when a patient asks what's in it, you have a real answer.",
} as const;

export type CoaAnnotation = {
  id: string;
  label: string;
  value: string;
  /** y anchor on vial diagram (local SVG coords) */
  y: number;
  /** JSON field highlighted when this annotation is active */
  jsonKey: string;
};

export const COA_ANNOTATIONS: CoaAnnotation[] = [
  { id: "batch", label: "Batch ID", value: "2026-04-19-A", y: 58, jsonKey: "batch_id" },
  { id: "hscrp", label: "hs-CRP", value: "pass", y: 102, jsonKey: "hs-CRP" },
  { id: "metals", label: "Heavy metals", value: "pass", y: 146, jsonKey: "heavy_metals" },
  { id: "potency", label: "Potency", value: "99.4%", y: 190, jsonKey: "potency" },
];

export const COA_JSON_SPEC = {
  batch_id: "2026-04-19-A",
  facility: "FDA-registered cGMP",
  vial_linked: true,
  panels: {
    "hs-CRP": "pass",
    heavy_metals: "pass",
    purity: "pass",
    sterility: "pass",
    potency: "99.4%",
  },
} as const;

export const COA_CERTIFICATIONS = [
  "FDA-registered cGMP",
  "Multi-panel screened",
  "Batch-linked COA",
  "Third-party verified",
] as const;
