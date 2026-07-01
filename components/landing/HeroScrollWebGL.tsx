"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { progressToFrameIndex, getHeroFramePath } from "@/lib/landing/hero-frames";
import { useHeroFrameTextures } from "@/hooks/use-hero-frame-textures";

type FrameSceneProps = {
  progress: number;
  textures: THREE.Texture[];
};

function FrameScene({ progress, textures }: FrameSceneProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { viewport, size } = useThree();

  const frameIndex = progressToFrameIndex(progress);
  const activeTexture =
    textures[frameIndex] ??
    textures.slice(0, frameIndex).findLast(Boolean) ??
    textures[0];

  const { planeWidth, planeHeight } = useMemo(() => {
    const texture = activeTexture ?? textures[0];
    const image = texture?.image as HTMLImageElement | undefined;
    const imageAspect =
      image && image.width && image.height ? image.width / image.height : 16 / 9;
    const screenAspect = size.width / size.height;

    if (screenAspect > imageAspect) {
      return {
        planeWidth: viewport.width,
        planeHeight: viewport.width / imageAspect,
      };
    }

    return {
      planeWidth: viewport.height * imageAspect,
      planeHeight: viewport.height,
    };
  }, [activeTexture, size.width, size.height, textures, viewport.height, viewport.width]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material || !activeTexture) return;

    material.map = activeTexture;
    material.needsUpdate = true;
  }, [activeTexture, frameIndex]);

  if (!textures.length || !activeTexture) return null;

  return (
    <mesh>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <meshBasicMaterial ref={materialRef} map={activeTexture} toneMapped={false} />
    </mesh>
  );
}

type HeroScrollWebGLProps = {
  progress: number;
  className?: string;
  backgroundClassName?: string;
};

export function HeroScrollWebGL({
  progress,
  className = "",
  backgroundClassName = "bg-deep-teal",
}: HeroScrollWebGLProps) {
  const { textures, ready } = useHeroFrameTextures();
  const posterSrc = getHeroFramePath(0);

  return (
    <div className={`${backgroundClassName} ${className}`} aria-hidden>
      {!ready ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      ) : null}
      <Canvas
        className="h-full w-full"
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      >
        {ready ? <FrameScene progress={progress} textures={textures} /> : null}
      </Canvas>
    </div>
  );
}
