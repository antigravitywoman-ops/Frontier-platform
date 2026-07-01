"use client";

import {
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";
import {
  type LucideIcon,
  Calculator,
  HelpCircle,
  Layers,
  LayoutGrid,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/** Spring for vertical blob travel — snappy with soft settle */
const BLOB_SPRING: SpringOptions = { stiffness: 320, damping: 26 };

const SLOT_SIZE_PX = 48;
const BLOB_SIZE_PX = 44;
const ICON_SIZE_PX = 22;
const BLOB_HALF_PX = BLOB_SIZE_PX / 2;
/** Skip goo morph when jumping more than this many slots */
const FAR_HOP_STEPS = 2;
const FAR_HOP_PX = 88;

/*
 * Theme mapping (Frontier tokens — see app/globals.css @theme):
 * - Rail surface: bg-deep-teal
 * - Active blob: bg-pacific-teal (primary accent)
 * - Active icon: text-pure-white (on-accent foreground)
 * - Inactive icons: text-pure-white/70 (muted foreground on dark surface)
 */

export type GooeySidebarItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

const DEFAULT_ITEMS: GooeySidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "layers", label: "Layers", icon: Layers },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "patients", label: "Patients", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

type MorphSession = {
  fromIndex: number;
  toIndex: number;
  fromY: number;
  toY: number;
};

type GooeyVerticalIconSidebarProps = {
  items?: GooeySidebarItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  className?: string;
  /** Unique id prefix when multiple sidebars share one page */
  gooFilterId?: string;
};

function measureSlotCenterY(
  container: HTMLElement,
  slot: HTMLElement,
): number {
  const containerRect = container.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();
  return slotRect.top - containerRect.top + slotRect.height / 2;
}

function GooFilterDefs({ filterId }: { filterId: string }) {
  return (
    <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
      <defs>
        <filter
          id={filterId}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

function StaticAccentBlob({
  centerY,
  scale = 1,
}: {
  centerY: number;
  scale?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 rounded-full bg-pacific-teal"
      style={{
        top: centerY - BLOB_HALF_PX,
        width: BLOB_SIZE_PX,
        height: BLOB_SIZE_PX,
        x: "-50%",
        scale,
      }}
      aria-hidden
    />
  );
}

function TravelingAccentBlob({
  centerY,
  scaleY,
}: {
  centerY: MotionValue<number>;
  scaleY: MotionValue<number>;
}) {
  const top = useTransform(centerY, (y) => y - BLOB_HALF_PX);

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 rounded-full bg-pacific-teal"
      style={{
        top,
        width: BLOB_SIZE_PX,
        height: BLOB_SIZE_PX,
        x: "-50%",
        scaleY,
      }}
      aria-hidden
    />
  );
}

export function GooeyVerticalIconSidebar({
  items = DEFAULT_ITEMS,
  defaultActiveIndex = 0,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  className = "",
  gooFilterId = "gooey-vertical-sidebar-goo",
}: GooeyVerticalIconSidebarProps) {
  const isControlled = controlledIndex !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const containerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const morphRef = useRef<MorphSession | null>(null);

  const [restY, setRestY] = useState<number | null>(null);
  const [morph, setMorph] = useState<MorphSession | null>(null);
  const [sourceScale, setSourceScale] = useState(1);

  const travelingY = useSpring(restY ?? 0, BLOB_SPRING);

  const travelingScaleY = useTransform(travelingY, (y) => {
    const session = morphRef.current;
    if (!session) return 1;

    const span = Math.abs(session.toY - session.fromY);
    if (span < 1) return 1;

    const t = Math.min(1, Math.abs(y - session.fromY) / span);
    return 1 + Math.sin(t * Math.PI) * 0.25;
  });

  const measureActiveCenter = useCallback(() => {
    const container = containerRef.current;
    const slot = slotRefs.current[activeIndex];
    if (!container || !slot) return null;
    return measureSlotCenterY(container, slot);
  }, [activeIndex]);

  const syncRestPosition = useCallback(() => {
    const y = measureActiveCenter();
    if (y === null) return;
    setRestY(y);
    travelingY.jump(y);
  }, [measureActiveCenter, travelingY]);

  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;

    const tryMeasure = () => {
      if (cancelled) return;
      if (measureActiveCenter() !== null) {
        syncRestPosition();
        return;
      }
      raf = requestAnimationFrame(tryMeasure);
    };

    if (restY === null && !morph) {
      tryMeasure();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [measureActiveCenter, morph, restY, syncRestPosition]);

  useLayoutEffect(() => {
    if (morph) return;
    syncRestPosition();
  }, [activeIndex, morph, syncRestPosition]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (morphRef.current) return;
      syncRestPosition();
    });

    observer.observe(container);
    for (const slot of slotRefs.current) {
      if (slot) observer.observe(slot);
    }

    return () => observer.disconnect();
  }, [items.length, syncRestPosition]);

  useMotionValueEvent(travelingY, "change", (latest) => {
    const session = morphRef.current;
    if (!session) return;

    const span = Math.abs(session.toY - session.fromY);
    if (span < 1) return;

    const t = Math.min(1, Math.abs(latest - session.fromY) / span);
    setSourceScale(Math.max(0, 1 - t * 0.9));
  });

  useMotionValueEvent(travelingY, "animationComplete", () => {
    const session = morphRef.current;
    if (!session) return;

    morphRef.current = null;
    setRestY(session.toY);
    setMorph(null);
    setSourceScale(1);
    travelingY.jump(session.toY);
  });

  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex) return;

      const container = containerRef.current;
      const fromSlot = slotRefs.current[activeIndex];
      const toSlot = slotRefs.current[nextIndex];
      if (!container || !fromSlot || !toSlot) return;

      const fromY = measureSlotCenterY(container, fromSlot);
      const toY = measureSlotCenterY(container, toSlot);
      const indexDistance = Math.abs(nextIndex - activeIndex);
      const pixelDistance = Math.abs(toY - fromY);
      const isFarHop = indexDistance > FAR_HOP_STEPS || pixelDistance > FAR_HOP_PX;

      if (!isControlled) {
        setInternalIndex(nextIndex);
      }
      onActiveIndexChange?.(nextIndex);

      if (isFarHop) {
        morphRef.current = null;
        setMorph(null);
        setSourceScale(1);
        travelingY.set(toY);
        setRestY(toY);
        return;
      }

      const session: MorphSession = {
        fromIndex: activeIndex,
        toIndex: nextIndex,
        fromY,
        toY,
      };

      morphRef.current = session;
      setMorph(session);
      setSourceScale(1);
      travelingY.jump(fromY);
      travelingY.set(toY);
    },
    [activeIndex, isControlled, onActiveIndexChange, travelingY],
  );

  const gooWrapperStyle: CSSProperties = {
    filter: `url(#${gooFilterId})`,
  };

  return (
    <nav
      ref={containerRef}
      className={`relative inline-flex flex-col items-center rounded-full bg-deep-teal px-3 py-4 shadow-[0_22px_48px_color-mix(in_srgb,var(--color-deep-teal)_28%,transparent)] ${className}`}
      aria-label="Icon navigation"
    >
      <GooFilterDefs filterId={gooFilterId} />

      <div
        className="pointer-events-none absolute inset-0 overflow-visible"
        style={gooWrapperStyle}
        aria-hidden
      >
        {morph ? (
          <>
            <StaticAccentBlob centerY={morph.fromY} scale={sourceScale} />
            <TravelingAccentBlob centerY={travelingY} scaleY={travelingScaleY} />
          </>
        ) : null}

        {!morph && restY !== null ? <StaticAccentBlob centerY={restY} /> : null}
      </div>

      <ul className="relative z-10 m-0 flex list-none flex-col items-center gap-0.5 p-0">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;

          return (
            <li key={item.id}>
              <button
                type="button"
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                onClick={() => setActiveIndex(index)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="flex items-center justify-center rounded-full transition-colors duration-150 ease-out"
                style={{ width: SLOT_SIZE_PX, height: SLOT_SIZE_PX }}
              >
                <Icon
                  size={ICON_SIZE_PX}
                  strokeWidth={isActive ? 2.1 : 1.85}
                  className={
                    isActive
                      ? "text-pure-white"
                      : "text-pure-white/70 hover:text-pure-white/90"
                  }
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default GooeyVerticalIconSidebar;
