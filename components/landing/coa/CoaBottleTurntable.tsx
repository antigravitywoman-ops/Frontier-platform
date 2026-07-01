"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOTTLE_FRAME_MANIFEST,
  getBottleFramePath,
  pointerToBottleFrameIndex,
} from "@/lib/landing/bottle-frames";

type CoaBottleTurntableProps = {
  onHoverChange: (hovered: boolean) => void;
};

export function CoaBottleTurntable({ onHoverChange }: CoaBottleTurntableProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const preloadedRef = useRef(false);

  const preloadFrames = useCallback(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;

    for (let index = 0; index < BOTTLE_FRAME_MANIFEST.frameCount; index += 1) {
      const image = new Image();
      image.src = getBottleFramePath(index);
    }
  }, []);

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    const nx = (clientX - rect.left) / Math.max(rect.width, 1);
    const ny = (clientY - rect.top) / Math.max(rect.height, 1);

    setFrameIndex(pointerToBottleFrameIndex(clientX, rect));
    setTilt({
      rotateY: (nx - 0.5) * 28,
      rotateX: (0.5 - ny) * 16,
    });
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hovered) return;
      updateFromPointer(event.clientX, event.clientY);
    },
    [hovered, updateFromPointer],
  );

  const handleEnter = useCallback(() => {
    preloadFrames();
    setHovered(true);
    onHoverChange(true);
  }, [onHoverChange, preloadFrames]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    onHoverChange(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, [onHoverChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setIsVisible(visible);
        if (visible) preloadFrames();
      },
      { rootMargin: "120px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [preloadFrames]);

  useEffect(() => {
    if (hovered || !isVisible) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const frameIntervalMs = 1000 / BOTTLE_FRAME_MANIFEST.fps;
    const timer = window.setInterval(() => {
      setFrameIndex((index) => (index + 1) % BOTTLE_FRAME_MANIFEST.frameCount);
    }, frameIntervalMs);

    return () => window.clearInterval(timer);
  }, [hovered, isVisible]);

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-none touch-none select-none"
      style={{ perspective: "1100px" }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={handlePointerMove}
    >
      <div
        className="relative min-h-[22rem] w-full transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none sm:min-h-[26rem] lg:min-h-[34rem] xl:min-h-[38rem]"
        style={{
          transformStyle: "preserve-3d",
          transform: hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(18px) scale(1.04)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
        }}
      >
        <img
          src={getBottleFramePath(frameIndex)}
          alt="Frontier labeled vial"
          width={560}
          height={315}
          className="pointer-events-none absolute inset-0 size-full scale-[1.9] object-contain"
          draggable={false}
        />
      </div>

      <button
        type="button"
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pacific-teal"
        aria-label="Vial rotates automatically. Hover to scrub frames and trace batch data."
        onFocus={handleEnter}
        onBlur={handleLeave}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setFrameIndex((index) => Math.min(BOTTLE_FRAME_MANIFEST.frameCount - 1, index + 1));
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setFrameIndex((index) => Math.max(0, index - 1));
          }
        }}
      />
    </div>
  );
}
