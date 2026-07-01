/** Landing section surface rhythm — black · white · deep teal */

export const LANDING_COLORS = {
  black: "#000000",
  white: "#ffffff",
  teal: "#011a24",
} as const;

export type LandingColor = keyof typeof LANDING_COLORS;

export const LANDING_SURFACE = {
  black: {
    section: "bg-black text-pure-white",
    heading: "text-pure-white",
    body: "text-pure-white/65",
    muted: "text-pure-white/45",
    border: "border-white/10",
    label: "text-pacific-teal",
  },
  white: {
    section: "bg-pure-white text-deep-teal",
    heading: "text-deep-teal",
    body: "text-deep-teal/65",
    muted: "text-deep-teal/45",
    border: "border-deep-teal/10",
    label: "text-pacific-teal",
  },
  teal: {
    section: "bg-deep-teal text-pure-white",
    heading: "text-pure-white",
    body: "text-pure-white/65",
    muted: "text-pure-white/45",
    border: "border-white/10",
    label: "text-pacific-teal",
  },
} as const;

/** Aspekta-only landing type tokens — normal weight throughout */
export const landingHeadline = "type-h2 font-sans font-normal text-balance";
export const landingDisplay = "type-display font-sans font-normal text-balance";
export const landingMicroLabel =
  "font-sans text-[0.6875rem] font-normal uppercase tracking-[0.14em]";
export const landingFieldLabel =
  "font-sans text-[0.65rem] font-normal uppercase tracking-[0.14em]";
export const landingDataText = "font-sans text-[0.8125rem]";
