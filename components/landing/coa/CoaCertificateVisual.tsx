"use client";

import { useMemo, useState } from "react";
import { COA_ANNOTATIONS } from "@/lib/landing/coa-section";
import { CoaJsonSpec } from "@/components/landing/coa/CoaJsonSpec";
import { CoaVialDiagram } from "@/components/landing/coa/CoaVialDiagram";

export function CoaCertificateVisual() {
  const [vialHovered, setVialHovered] = useState(false);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  const highlightAll = vialHovered && activeAnnotationId === null;

  const activeJsonKey = useMemo(() => {
    if (!activeAnnotationId) return null;
    return COA_ANNOTATIONS.find((item) => item.id === activeAnnotationId)?.jsonKey ?? null;
  }, [activeAnnotationId]);

  return (
    <div className="contents">
      <CoaVialDiagram
        vialHovered={vialHovered}
        activeAnnotationId={activeAnnotationId}
        highlightAll={highlightAll}
        onVialHoverChange={setVialHovered}
        onAnnotationHoverChange={setActiveAnnotationId}
      />
      <CoaJsonSpec
        highlightAll={highlightAll}
        activeJsonKey={activeJsonKey}
        vialHovered={vialHovered}
      />
    </div>
  );
}
