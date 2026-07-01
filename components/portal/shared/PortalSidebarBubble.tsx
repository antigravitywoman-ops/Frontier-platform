"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Transition,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { SIDEBAR_BUBBLE_SPRING, SIDEBAR_LAYOUT_EASE } from "@/components/portal/shared/FloatingIconAction";

const BUBBLE_SIZE_PX = 32;
const FAR_HOP_PX = 64;
const FAR_HOP_STEPS = 2;
const GOO_DURATION_S = 0.5;
const ICON_SHELL_SELECTOR = ".portal-sidebar-icon-shell";

type HopProfile = "goo" | "near" | "far";

type ItemBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
  centerY: number;
  centerX: number;
};

type GooMorph = {
  from: ItemBounds;
  to: ItemBounds;
};

const LAYOUT_MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.88,
};

type PortalSidebarBubbleProps = {
  navRef: RefObject<HTMLElement | null>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
  activeIndex: number;
  expanded?: boolean;
  layoutTransitioning?: boolean;
  sidebarExpanded?: boolean;
  onActiveReady?: () => void;
};

function measureRelativeBounds(nav: HTMLElement, el: HTMLElement): ItemBounds {
  const navRect = nav.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const top = elRect.top - navRect.top;
  const left = elRect.left - navRect.left;
  const width = elRect.width;
  const height = elRect.height;

  return {
    top,
    left,
    width,
    height,
    centerY: top + height / 2,
    centerX: left + width / 2,
  };
}

function measureRowBounds(nav: HTMLElement, item: HTMLElement): ItemBounds {
  if (nav.contains(item)) {
    return {
      top: item.offsetTop,
      left: item.offsetLeft,
      width: item.offsetWidth,
      height: item.offsetHeight,
      centerY: item.offsetTop + item.offsetHeight / 2,
      centerX: item.offsetLeft + item.offsetWidth / 2,
    };
  }

  return measureRelativeBounds(nav, item);
}

function measureIconBounds(nav: HTMLElement, item: HTMLElement): ItemBounds {
  const icon = item.querySelector<HTMLElement>(ICON_SHELL_SELECTOR);
  if (icon) return measureRelativeBounds(nav, icon);
  return measureRowBounds(nav, item);
}

/** Icon-centered circle — same geometry as collapsed sidebar slide */
function toCircleBounds(bounds: ItemBounds): ItemBounds {
  const size = BUBBLE_SIZE_PX;
  return {
    top: bounds.centerY - size / 2,
    left: bounds.centerX - size / 2,
    width: size,
    height: size,
    centerY: bounds.centerY,
    centerX: bounds.centerX,
  };
}

/** Full row pill when expanded and at rest on the active item */
function toExpandedRestBounds(row: ItemBounds): ItemBounds {
  return {
    top: row.top,
    left: row.left,
    width: row.width,
    height: row.height,
    centerY: row.centerY,
    centerX: row.centerX,
  };
}

function SidebarGooDefs() {
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
      <defs>
        <filter
          id="portal-sidebar-goo"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

function GooPill({ className = "" }: { className?: string }) {
  return <span className={`portal-sidebar-bubble-core block size-full rounded-full ${className}`} />;
}

function GooInfinityLayer({
  morph,
  progress,
  reduceMotion,
}: {
  morph: GooMorph;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
}) {
  const fromScale = useTransform(progress, (p) => Math.cos(p * Math.PI * 0.5));
  const toScale = useTransform(progress, (p) => Math.sin(p * Math.PI * 0.5));

  return (
    <div
      className="portal-sidebar-goo-stage pointer-events-none absolute inset-0 z-[1] hidden lg:block"
      style={{ filter: "url(#portal-sidebar-goo)" }}
      aria-hidden
    >
      <motion.div
        className="portal-sidebar-goo-blob pointer-events-none absolute rounded-full"
        style={{
          top: morph.from.top,
          left: morph.from.left,
          width: morph.from.width,
          height: morph.from.height,
          scale: reduceMotion ? 0 : fromScale,
        }}
      >
        <GooPill />
      </motion.div>
      <motion.div
        className="portal-sidebar-goo-blob pointer-events-none absolute rounded-full"
        style={{
          top: morph.to.top,
          left: morph.to.left,
          width: morph.to.width,
          height: morph.to.height,
          scale: reduceMotion ? 1 : toScale,
        }}
      >
        <GooPill />
      </motion.div>
    </div>
  );
}

export function PortalSidebarBubble({
  navRef,
  itemRefs,
  activeIndex,
  expanded = false,
  layoutTransitioning = false,
  sidebarExpanded = false,
  onActiveReady,
}: PortalSidebarBubbleProps) {
  const reduceMotion = useReducedMotion();
  const [displayBounds, setDisplayBounds] = useState<ItemBounds | null>(null);
  const [stretchY, setStretchY] = useState(1);
  const [bubbleScale, setBubbleScale] = useState(1);
  const [hopProfile, setHopProfile] = useState<HopProfile>("near");
  const [gooMorph, setGooMorph] = useState<GooMorph | null>(null);
  const gooProgress = useMotionValue(0);
  const prevIndexRef = useRef(activeIndex);
  const layoutTransitionRef = useRef(false);
  const sidebarExpandedRef = useRef(sidebarExpanded);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);

  sidebarExpandedRef.current = sidebarExpanded;

  const notifyActiveReady = useCallback(() => {
    if (!sidebarExpandedRef.current || layoutTransitionRef.current) return;
    requestAnimationFrame(() => {
      onActiveReady?.();
    });
  }, [onActiveReady]);

  const measureLayoutMorphTarget = useCallback((): boolean => {
    const nav = navRef.current;
    const item = itemRefs.current[activeIndex];
    if (!nav || !item || activeIndex < 0 || item.offsetHeight === 0) return false;

    if (sidebarExpandedRef.current) {
      setDisplayBounds(toExpandedRestBounds(measureRowBounds(nav, item)));
    } else {
      setDisplayBounds(toCircleBounds(measureIconBounds(nav, item)));
    }
    return true;
  }, [activeIndex, itemRefs, navRef]);

  const settleToRest = useCallback(
    (item: HTMLElement) => {
      const nav = navRef.current;
      if (!nav) return;
      setDisplayBounds(toExpandedRestBounds(measureRowBounds(nav, item)));
    },
    [navRef],
  );

  const measure = useCallback((): boolean => {
    const nav = navRef.current;
    const item = itemRefs.current[activeIndex];
    if (!nav || !item || activeIndex < 0 || item.offsetHeight === 0) return false;

    if (layoutTransitionRef.current) {
      return measureLayoutMorphTarget();
    }

    if (!gooMorph) {
      if (sidebarExpandedRef.current) {
        settleToRest(item);
      } else {
        setDisplayBounds(toCircleBounds(measureIconBounds(nav, item)));
      }
    }
    return true;
  }, [activeIndex, gooMorph, itemRefs, measureLayoutMorphTarget, navRef, settleToRest]);

  useLayoutEffect(() => {
    if (displayBounds !== null && !motionEnabled) {
      const raf = requestAnimationFrame(() => setMotionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [displayBounds, motionEnabled]);

  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;

    const tryMeasure = () => {
      if (cancelled) return;
      if (measure()) return;
      raf = requestAnimationFrame(tryMeasure);
    };

    tryMeasure();

    const nav = navRef.current;
    if (!nav) {
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }

    const observer = new ResizeObserver(() => {
      if (!cancelled) measure();
    });
    observer.observe(nav);
    for (const item of itemRefs.current) {
      if (item) observer.observe(item);
    }

    window.addEventListener("resize", measure);
    nav.addEventListener("scroll", measure, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      nav.removeEventListener("scroll", measure);
    };
  }, [measure, itemRefs, navRef]);

  useEffect(() => {
    if (layoutTransitioning) {
      layoutTransitionRef.current = true;
      setGooMorph(null);
      setHopProfile("near");
      setStretchY(1);
      setBubbleScale(1);
      setBubbleVisible(true);
      setMotionEnabled(true);

      const nav = navRef.current;
      const item = itemRefs.current[activeIndex];
      if (nav && item && activeIndex >= 0) {
        setDisplayBounds(
          sidebarExpanded
            ? toCircleBounds(measureIconBounds(nav, item))
            : toExpandedRestBounds(measureRowBounds(nav, item)),
        );
      }
      return;
    }

    layoutTransitionRef.current = false;

    if (!expanded) {
      setBubbleVisible(false);
      setDisplayBounds(null);
      return;
    }

    setMotionEnabled(false);
    measure();
    requestAnimationFrame(() => {
      setBubbleVisible(true);
      requestAnimationFrame(() => {
        setMotionEnabled(true);
        notifyActiveReady();
      });
    });
  }, [
    activeIndex,
    expanded,
    itemRefs,
    layoutTransitioning,
    measure,
    navRef,
    notifyActiveReady,
    sidebarExpanded,
  ]);

  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    if (prevIndex === activeIndex) return;

    const nav = navRef.current;
    const prevItem = itemRefs.current[prevIndex];
    const nextItem = itemRefs.current[activeIndex];

    let toBounds: ItemBounds | null = null;

    if (nav && nextItem) {
      if (sidebarExpandedRef.current && !layoutTransitionRef.current) {
        toBounds = toExpandedRestBounds(measureRowBounds(nav, nextItem));
      } else if (!sidebarExpandedRef.current) {
        toBounds = toCircleBounds(measureIconBounds(nav, nextItem));
      }
    }

    const finishHop = () => {
      if (nextItem) settleToRest(nextItem);
    };

    setGooMorph(null);
    setHopProfile("far");
    setStretchY(1);
    setBubbleScale(reduceMotion ? 1 : 0.92);
    if (toBounds) setDisplayBounds(toBounds);

    const settleTimer = window.setTimeout(() => {
      setBubbleScale(1);
      finishHop();
    }, reduceMotion ? 0 : 280);

    prevIndexRef.current = activeIndex;
    return () => window.clearTimeout(settleTimer);
  }, [activeIndex, itemRefs, navRef, reduceMotion, settleToRest]);

  if (activeIndex < 0 || displayBounds === null || !expanded) return null;

  const isNearMorph = hopProfile === "near" && stretchY > 1.03;
  const showSingleBubble = !gooMorph;

  const isLayoutMorph = layoutTransitioning;
  const bubbleTransition: Transition = reduceMotion
    ? { duration: 0 }
    : isLayoutMorph
      ? {
          top: LAYOUT_MORPH_SPRING,
          left: LAYOUT_MORPH_SPRING,
          width: LAYOUT_MORPH_SPRING,
          height: LAYOUT_MORPH_SPRING,
          scale: { duration: 0.2, ease: SIDEBAR_LAYOUT_EASE },
          scaleY: { duration: 0.2, ease: SIDEBAR_LAYOUT_EASE },
          scaleX: { duration: 0.2, ease: SIDEBAR_LAYOUT_EASE },
        }
      : hopProfile === "far"
      ? {
          top: motionEnabled
            ? { type: "spring", stiffness: 400, damping: 34, mass: 0.85 }
            : { duration: 0 },
          left: motionEnabled
            ? { type: "spring", stiffness: 400, damping: 34, mass: 0.85 }
            : { duration: 0 },
          width: motionEnabled
            ? { type: "spring", stiffness: 400, damping: 34, mass: 0.85 }
            : { duration: 0 },
          height: motionEnabled
            ? { type: "spring", stiffness: 400, damping: 34, mass: 0.85 }
            : { duration: 0 },
          scale: { type: "spring", stiffness: 480, damping: 28, mass: 0.8 },
          scaleY: { duration: 0.15 },
          scaleX: { duration: 0.15 },
        }
      : {
          top: motionEnabled ? SIDEBAR_BUBBLE_SPRING : { duration: 0 },
          left: motionEnabled ? SIDEBAR_BUBBLE_SPRING : { duration: 0 },
          width: motionEnabled ? SIDEBAR_BUBBLE_SPRING : { duration: 0 },
          height: motionEnabled ? SIDEBAR_BUBBLE_SPRING : { duration: 0 },
          scale: { type: "spring", stiffness: 420, damping: 24, mass: 0.9 },
          scaleY: { type: "spring", stiffness: 400, damping: 22, mass: 0.92 },
          scaleX: { type: "spring", stiffness: 400, damping: 22, mass: 0.92 },
        };

  return (
    <>
      <SidebarGooDefs />
      {gooMorph ? (
        <GooInfinityLayer morph={gooMorph} progress={gooProgress} reduceMotion={reduceMotion} />
      ) : null}
      {showSingleBubble ? (
        <motion.div
          className="portal-sidebar-bubble pointer-events-none absolute z-[1] hidden rounded-full lg:block"
          initial={false}
          animate={{
            top: displayBounds.top,
            left: displayBounds.left,
            width: displayBounds.width,
            height: displayBounds.height,
            opacity: bubbleVisible ? 1 : 0,
            scale: bubbleVisible ? bubbleScale : 0.92,
            scaleY: hopProfile === "far" ? 1 : stretchY,
            scaleX:
              hopProfile === "far"
                ? 1
                : isNearMorph
                  ? 0.96 + 0.04 / stretchY
                  : 1,
          }}
          transition={{
            ...bubbleTransition,
            opacity: { duration: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden
        >
          <GooPill />
          {hopProfile === "near" ? (
            <motion.span
              className="portal-sidebar-bubble-drip absolute left-1/2 top-[88%] -translate-x-1/2"
              initial={false}
              animate={{
                opacity: isNearMorph ? 0.6 : 0,
                scaleY: isNearMorph ? 1.05 : 0.5,
                scaleX: isNearMorph ? 1 : 0.6,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 24 }
              }
              aria-hidden
            />
          ) : null}
        </motion.div>
      ) : null}
    </>
  );
}
