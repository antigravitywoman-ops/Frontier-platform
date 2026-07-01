"use client";

import { CoaBottleTurntable } from "@/components/landing/coa/CoaBottleTurntable";
import { COA_ANNOTATIONS } from "@/lib/landing/coa-section";

const LINE_ANCHOR_X = -6;
const LINE_END_X = 30;
const LABEL_X = 38;

type CoaVialDiagramProps = {
  vialHovered: boolean;
  activeAnnotationId: string | null;
  highlightAll: boolean;
  onVialHoverChange: (hovered: boolean) => void;
  onAnnotationHoverChange: (id: string | null) => void;
};

function isAnnotationActive(
  id: string,
  activeAnnotationId: string | null,
  highlightAll: boolean,
) {
  return highlightAll || activeAnnotationId === id;
}

export function CoaVialDiagram({
  vialHovered,
  activeAnnotationId,
  highlightAll,
  onVialHoverChange,
  onAnnotationHoverChange,
}: CoaVialDiagramProps) {
  const isEngaged = vialHovered || activeAnnotationId !== null;

  return (
    <div
      className="mx-auto w-full max-w-2xl lg:max-w-none"
      onMouseLeave={() => {
        onVialHoverChange(false);
        onAnnotationHoverChange(null);
      }}
    >
      <div className="relative flex min-h-[22rem] items-center sm:min-h-[26rem] lg:min-h-[34rem] xl:min-h-[38rem]">
        <div className="relative z-10 w-[62%] shrink-0 sm:w-[60%] lg:w-[58%]">
          <CoaBottleTurntable onHoverChange={onVialHoverChange} />
        </div>

        <svg
          viewBox="-10 0 250 240"
          className="-ml-[10%] h-full min-h-[22rem] w-[54%] shrink-0 overflow-visible sm:-ml-[12%] sm:min-h-[26rem] sm:w-[58%] lg:-ml-[14%] lg:min-h-[34rem] xl:min-h-[38rem]"
          role="img"
          aria-label="Vial batch verification diagram"
          preserveAspectRatio="xMinYMid meet"
        >
          {COA_ANNOTATIONS.map((item) => {
            const active = isAnnotationActive(item.id, activeAnnotationId, highlightAll);

            return (
              <g
                key={item.id}
                className="transition-opacity duration-300"
                style={{ opacity: isEngaged && !active ? 0.42 : 1 }}
                onMouseEnter={() => onAnnotationHoverChange(item.id)}
              >
                <line
                  x1={LINE_ANCHOR_X}
                  y1={item.y}
                  x2={LINE_END_X}
                  y2={item.y}
                  className="transition-all duration-300 ease-out"
                  stroke={active ? "rgba(140, 210, 216, 0.95)" : "rgba(140, 210, 216, 0.55)"}
                  strokeWidth={active ? 1.75 : 1}
                />
                <circle
                  cx={LINE_ANCHOR_X}
                  cy={item.y}
                  r={active ? 3.25 : 2.5}
                  className="transition-all duration-300 ease-out"
                  fill={active ? "rgba(140, 210, 216, 1)" : "rgba(140, 210, 216, 0.95)"}
                />
                <circle
                  cx={LINE_END_X}
                  cy={item.y}
                  r={active ? 2.25 : 1.5}
                  className="transition-all duration-300 ease-out"
                  fill={active ? "rgba(140, 210, 216, 0.85)" : "rgba(140, 210, 216, 0.4)"}
                />

                <foreignObject x={LABEL_X} y={item.y - 17} width="200" height="44">
                  <div
                    className={`cursor-default border-l pl-3 transition-colors duration-300 ${
                      active ? "border-pacific-teal" : "border-pacific-teal/35"
                    }`}
                  >
                    <p
                      className={`font-sans text-[0.65rem] font-normal uppercase tracking-[0.12em] transition-colors duration-300 ${
                        active ? "text-pacific-teal" : "text-pacific-teal/85"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`font-sans text-[0.8125rem] leading-tight transition-colors duration-300 ${
                        active ? "text-pure-white" : "text-pure-white/88"
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
