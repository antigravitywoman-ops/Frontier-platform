"use client";

import { useEffect, useState } from "react";

export type LandingNavTheme = "light" | "dark";

/** Section id → navbar surface theme (light = white sections, dark = black/teal) */
const SECTION_NAV_THEME: Record<string, LandingNavTheme> = {
  hero: "dark",
  problem: "dark",
  "why-frontier": "light",
  "how-it-works": "dark",
  "coa-certificate": "dark",
  catalog: "light",
  payouts: "dark",
  onboard: "light",
  faqs: "dark",
  "final-cta": "dark",
};

const OBSERVED_SECTION_IDS = Object.keys(SECTION_NAV_THEME);

export function useLandingNavTheme(enabled = true) {
  const [theme, setTheme] = useState<LandingNavTheme>("dark");

  useEffect(() => {
    if (!enabled) return;

    const elements = OBSERVED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (elements.length === 0) return;

    const updateTheme = () => {
      const navBand = 88;
      let bestId: string | null = null;
      let bestOverlap = 0;

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const overlapTop = Math.max(rect.top, navBand);
        const overlapBottom = Math.min(rect.bottom, navBand + 1);
        const overlap = Math.max(0, overlapBottom - overlapTop);

        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestId = element.id;
        }
      }

      if (!bestId) {
        const nearest = elements
          .map((element) => ({
            id: element.id,
            distance: Math.abs(element.getBoundingClientRect().top - navBand),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        bestId = nearest?.id ?? "hero";
      }

      setTheme(SECTION_NAV_THEME[bestId] ?? "dark");
    };

    updateTheme();

    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);

    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
    };
  }, [enabled]);

  return theme;
}
