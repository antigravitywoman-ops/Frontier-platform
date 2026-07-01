/** Multi-stop section blends — 4 colors for natural transitions */

export const LANDING_GRADIENT_PRESETS = {
  "black-white": [
    "#000000",
    "#061318",
    "#8eb5bb",
    "#ffffff",
  ],
  "white-teal": [
    "#ffffff",
    "#dcebec",
    "#2a6b73",
    "#011a24",
  ],
  "teal-black": [
    "#011a24",
    "#010e12",
    "#020608",
    "#000000",
  ],
  "teal-white": [
    "#011a24",
    "#0d4f57",
    "#b9d5d9",
    "#ffffff",
  ],
  "white-black": [
    "#ffffff",
    "#c8dde0",
    "#243a42",
    "#000000",
  ],
  "black-teal": [
    "#000000",
    "#020608",
    "#010e12",
    "#011a24",
  ],
} as const;

export type LandingGradientPreset = keyof typeof LANDING_GRADIENT_PRESETS;

export function buildLandingGradient(stops: readonly string[]) {
  if (stops.length < 2) return stops[0] ?? "transparent";

  const colorStops = stops
    .map((color, index) => {
      const position = (index / (stops.length - 1)) * 100;
      return `${color} ${position}%`;
    })
    .join(", ");

  return `linear-gradient(to bottom, ${colorStops})`;
}
