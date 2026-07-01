"use client";

import { useEffect, useState, type RefObject } from "react";
import { useLenis } from "@/components/SmoothScroll";

export function useScrollSectionProgress(sectionRef: RefObject<HTMLElement | null>) {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / scrollable)));
    };

    update();

    if (lenis) {
      lenis.on("scroll", update);
      return () => {
        lenis.off("scroll", update);
      };
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [lenis, sectionRef]);

  return progress;
}
