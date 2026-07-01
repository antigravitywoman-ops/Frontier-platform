"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "@/components/motion";
import { PROBLEM_POINTS, PROBLEM_SECTION } from "@/lib/landing/problem-points";

type ProblemPointsPanelProps = {
  interactive?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

export function ProblemPointsPanel({
  interactive = true,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: ProblemPointsPanelProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex ?? internalIndex;

  const setActiveIndex = (index: number) => {
    onActiveIndexChange?.(index);
    if (controlledIndex === undefined) {
      setInternalIndex(index);
    }
  };

  return (
    <div className="max-w-xl text-left">
      <h2 className="type-h2 text-balance font-normal text-pure-white">
        {PROBLEM_SECTION.titleLine1}
        <br />
        {PROBLEM_SECTION.titleLine2}
      </h2>

      <p className="mt-5 font-sans text-sm font-normal leading-relaxed text-pure-white/65 sm:mt-6 sm:text-base">
        {PROBLEM_SECTION.body}
      </p>

      <ul className="mt-8 space-y-0 sm:mt-10">
        {PROBLEM_POINTS.map((point, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={point.id} className="border-t border-white/10 first:border-t-0">
              <button
                type="button"
                disabled={!interactive}
                onClick={() => setActiveIndex(index)}
                className={`group w-full py-4 text-left transition-colors sm:py-5 ${
                  interactive ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-2 size-2 shrink-0 rounded-full transition-colors duration-300 ${
                      isActive ? "bg-pacific-teal" : "bg-white/15 group-hover:bg-white/25"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block font-sans text-lg font-normal tracking-[-0.01em] transition-colors duration-300 sm:text-xl ${
                        isActive ? "text-pure-white" : "text-pure-white/45 group-hover:text-pure-white/65"
                      }`}
                    >
                      {point.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.p
                          key={`${point.id}-desc`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden font-sans text-sm font-normal leading-relaxed text-pure-white/65 sm:text-base"
                        >
                          {point.description}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ProblemPointImageProps = {
  activeIndex: number;
  className?: string;
};

export function ProblemPointImage({ activeIndex, className = "" }: ProblemPointImageProps) {
  const point = PROBLEM_POINTS[activeIndex] ?? PROBLEM_POINTS[0];

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-deep-teal/5 ${className}`}
    >
      {/* Native img — reliable fill inside aspect-ratio containers */}
      <img
        key={point.id}
        src={point.image}
        alt={point.title}
        className="block h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export { PROBLEM_POINTS };
