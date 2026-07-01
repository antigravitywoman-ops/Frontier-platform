export const BOTTLE_FRAME_MANIFEST = {
  frameCount: 72,
  fps: 12,
  extension: ".webp",
  basePath: "/assets/platform/bottle-frames/frame_",
  padding: 4,
} as const;

export const BOTTLE_VIDEO_SRC = "/assets/platform/bottle.mp4";

export function getBottleFramePath(index: number) {
  const maxIndex = BOTTLE_FRAME_MANIFEST.frameCount - 1;
  const clamped = Math.max(0, Math.min(maxIndex, index));
  const frameNumber = String(clamped + 1).padStart(BOTTLE_FRAME_MANIFEST.padding, "0");
  return `${BOTTLE_FRAME_MANIFEST.basePath}${frameNumber}${BOTTLE_FRAME_MANIFEST.extension}`;
}

export function pointerToBottleFrameIndex(
  clientX: number,
  rect: Pick<DOMRect, "left" | "width">,
) {
  const maxIndex = BOTTLE_FRAME_MANIFEST.frameCount - 1;
  const progress = (clientX - rect.left) / Math.max(rect.width, 1);
  return Math.round(Math.min(1, Math.max(0, progress)) * maxIndex);
}
