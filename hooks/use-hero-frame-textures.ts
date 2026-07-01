"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { getHeroFramePath, HERO_FRAME_MANIFEST } from "@/lib/landing/hero-frames";

function configureTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function useHeroFrameTextures() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const loadFrame = (index: number) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          getHeroFramePath(index),
          (texture) => resolve(configureTexture(texture)),
          undefined,
          reject,
        );
      });

    void (async () => {
      try {
        const slots: THREE.Texture[] = new Array(HERO_FRAME_MANIFEST.frameCount);
        const first = await loadFrame(0);

        if (cancelled) {
          first.dispose();
          return;
        }

        slots[0] = first;
        setTextures([...slots]);
        setReady(true);

        const rest = await Promise.all(
          Array.from({ length: HERO_FRAME_MANIFEST.frameCount - 1 }, (_, offset) =>
            loadFrame(offset + 1),
          ),
        );

        if (cancelled) {
          rest.forEach((texture) => texture.dispose());
          return;
        }

        rest.forEach((texture, offset) => {
          slots[offset + 1] = texture;
        });

        setTextures([...slots]);
      } catch {
        if (!cancelled) {
          setReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      setTextures((current) => {
        current.forEach((texture) => texture?.dispose());
        return [];
      });
    };
  }, []);

  return { textures, ready };
}
