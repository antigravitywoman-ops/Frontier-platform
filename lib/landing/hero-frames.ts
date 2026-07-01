export const HERO_FRAME_MANIFEST = {
  frameCount: 78,
  fps: 12,
  extension: ".jpg",
  basePath: "/assets/herosection/frames/frame_",
  padding: 4,
} as const;

export const HERO_VIDEO_SRC = "/assets/herosection/hero.mp4";

export function getHeroFramePath(index: number) {
  const clamped = Math.max(0, Math.min(HERO_FRAME_MANIFEST.frameCount - 1, index));
  const frameNumber = String(clamped + 1).padStart(HERO_FRAME_MANIFEST.padding, "0");
  return `${HERO_FRAME_MANIFEST.basePath}${frameNumber}${HERO_FRAME_MANIFEST.extension}`;
}

export function progressToFrameIndex(progress: number) {
  const maxIndex = HERO_FRAME_MANIFEST.frameCount - 1;
  return Math.round(Math.min(1, Math.max(0, progress)) * maxIndex);
}

/** @deprecated Scroll transition uses PROBLEM_POINTS[0].image (Peptides panel) */
export const HERO_LAST_FRAME_SRC = getHeroFramePath(HERO_FRAME_MANIFEST.frameCount - 1);
