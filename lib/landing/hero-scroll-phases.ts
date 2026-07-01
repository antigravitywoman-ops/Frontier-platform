export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

/** Smoothstep easing for scroll segments */
export function easeInOut(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
) {
  if (inMax === inMin) return outMin;
  const t = clamp01((value - inMin) / (inMax - inMin));
  return lerp(outMin, outMax, t);
}

/** Total sticky scroll height (vh) */
export const HERO_SCROLL_HEIGHT_VH = 720;

/** Scroll progress breakpoints (0–1) */
export const SCROLL_TIMELINE = {
  heroTextEnd: 0.12,
  frameEnd: 0.36,
  zoomStart: 0.36,
  zoomEnd: 0.5,
  splitStart: 0.5,
  splitEnd: 0.62,
  problemStart: 0.62,
  pointsStart: 0.68,
} as const;

export type HeroScrollPhases = {
  frameProgress: number;
  heroTextOpacity: number;
  mediaScale: number;
  mediaTranslateY: number;
  mediaOpacity: number;
  splitProgress: number;
  morphProgress: number;
  morphActive: boolean;
  morphComplete: boolean;
  problemTextOpacity: number;
  problemInteractive: boolean;
  backdropOpacity: number;
  zoomBlackout: number;
};

/** Scroll choreography: hero frames → laptop zoom → split problem layout */
export function getHeroScrollPhases(progress: number): HeroScrollPhases {
  const { frameEnd, zoomStart, splitStart, splitEnd, problemStart } =
    SCROLL_TIMELINE;

  const frameProgress = easeInOut(mapRange(progress, 0, frameEnd, 0, 1));
  const heroTextOpacity =
    progress < SCROLL_TIMELINE.heroTextEnd
      ? clamp01(1 - progress / SCROLL_TIMELINE.heroTextEnd)
      : 0;

  const mediaScale = 1;
  const mediaTranslateY = 0;
  const zoomBlackout = progress >= zoomStart ? 1 : 0;

  const splitProgress = easeInOut(mapRange(progress, splitStart, splitEnd, 0, 1));
  const morphProgress = easeInOut(mapRange(progress, zoomStart, splitEnd, 0, 1));
  const morphActive = progress >= zoomStart;
  const morphComplete = morphProgress >= 0.999;
  const mediaOpacity = progress < zoomStart ? 1 : 0;
  const problemTextOpacity = easeInOut(mapRange(progress, problemStart, splitEnd + 0.04, 0, 1));
  const backdropOpacity = problemTextOpacity;
  const problemInteractive = progress >= problemStart;

  return {
    frameProgress,
    heroTextOpacity,
    mediaScale,
    mediaTranslateY,
    mediaOpacity,
    splitProgress,
    morphProgress,
    morphActive,
    morphComplete,
    problemTextOpacity,
    problemInteractive,
    backdropOpacity,
    zoomBlackout,
  };
}

export function getProblemPointIndex(progress: number, pointCount: number) {
  if (progress < SCROLL_TIMELINE.pointsStart) return 0;
  const segment = mapRange(progress, SCROLL_TIMELINE.pointsStart, 1, 0, pointCount);
  return Math.min(pointCount - 1, Math.floor(segment));
}
