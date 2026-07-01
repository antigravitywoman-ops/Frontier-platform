/** Official Frontier Biomed logotypes — sourced from /public/logos */

export const LOGO_ASSETS = {
  white: "/logos/Frontier%20logotype%20white.svg",
  primary: "/logos/Frontier%20logotype%20primary.svg",
  black: "/logos/Frontier%20logotype%20black.svg",
  secondary: "/logos/Frontier%20logotype%20secondary.svg",
} as const;

export type LogoVariant = keyof typeof LOGO_ASSETS;

export const LOGO_DIMENSIONS = {
  width: 1946,
  height: 448,
} as const;

export const LOGOMARK_ASSETS = {
  primary: "/logos/Frontier%20logomark%20primary.svg",
  white: "/logos/Frontier%20logomark%20white.svg",
  black: "/logos/Frontier%20logomark%20black.svg",
  secondary: "/logos/Frontier%20logomark%20secondary.svg",
} as const;

export type LogomarkVariant = keyof typeof LOGOMARK_ASSETS;

/** @deprecated Use LOGOMARK_ASSETS.primary */
export const LOGOMARK_ASSET = LOGOMARK_ASSETS.primary;

export const LOGOMARK_DIMENSIONS = {
  width: 1907,
  height: 1353,
} as const;
