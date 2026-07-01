"use client";

import { motion, useReducedMotion } from "framer-motion";

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type IOSSegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  segments: readonly SegmentOption<T>[];
  className?: string;
  "aria-label"?: string;
};

export function IOSSegmentedControl<T extends string>({
  value,
  onChange,
  segments,
  className = "",
  "aria-label": ariaLabel,
}: IOSSegmentedControlProps<T>) {
  const reduceMotion = useReducedMotion();
  const activeIndex = Math.max(
    0,
    segments.findIndex((segment) => segment.value === value),
  );
  const segmentWidth = 100 / segments.length;

  return (
    <div
      className={`portal-ios-segment ${className}`.trim()}
      role="tablist"
      aria-label={ariaLabel ?? "Segmented control"}
    >
      <div
        className="portal-ios-segment-inner"
        style={{ gridTemplateColumns: `repeat(${segments.length}, minmax(0, 1fr))` }}
      >
        <motion.span
          aria-hidden
          className="portal-ios-segment-thumb"
          animate={{ left: `${activeIndex * segmentWidth}%`, width: `${segmentWidth}%` }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 34, mass: 0.82 }
          }
        />
        {segments.map((segment) => {
          const active = segment.value === value;
          return (
            <button
              key={segment.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(segment.value)}
              className={`portal-ios-segment-btn ${active ? "is-active" : ""}`}
            >
              {segment.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
