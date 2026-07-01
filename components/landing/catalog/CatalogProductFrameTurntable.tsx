"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOTTLE_FRAME_MANIFEST,
  getBottleFramePath,
  pointerToBottleFrameIndex,
} from "@/lib/landing/bottle-frames";

type CatalogProductFrameTurntableProps = {
  productName: string;
  className?: string;
};

export function CatalogProductFrameTurntable({
  productName,
  className = "",
}: CatalogProductFrameTurntableProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [rotateY, setRotateY] = useState(0);
  const preloadedRef = useRef(false);

  const preloadFrames = useCallback(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;

    for (let index = 0; index < BOTTLE_FRAME_MANIFEST.frameCount; index += 1) {
      const image = new Image();
      image.src = getBottleFramePath(index);
    }
  }, []);

  const updateFromPointer = useCallback((clientX: number) => {
    const root = rootRef.current;
    if (!root) return;

    const rect = root.getBoundingClientRect();
    const nx = (clientX - rect.left) / Math.max(rect.width, 1);

    setFrameIndex(pointerToBottleFrameIndex(clientX, rect));
    setRotateY((nx - 0.5) * 22);
  }, []);

  const handleEnter = useCallback(() => {
    preloadFrames();
    setHovered(true);
  }, [preloadFrames]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setFrameIndex(0);
    setRotateY(0);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          preloadFrames();
        }
      },
      { rootMargin: "80px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [preloadFrames]);

  return (
    <div
      ref={rootRef}
      className={`relative touch-none select-none ${className}`.trim()}
      style={{ perspective: "700px" }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={(event) => {
        if (!hovered) return;
        updateFromPointer(event.clientX);
      }}
    >
      <div
        className="relative size-full transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none"
        style={{
          transformStyle: "preserve-3d",
          transform: hovered
            ? `rotateY(${rotateY}deg) scale(1.04)`
            : "rotateY(0deg) scale(1)",
        }}
      >
        <img
          src={getBottleFramePath(frameIndex)}
          alt={productName}
          width={280}
          height={158}
          className="pointer-events-none size-full scale-[1.45] object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}
