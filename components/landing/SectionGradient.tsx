import {
  buildLandingGradient,
  LANDING_GRADIENT_PRESETS,
  type LandingGradientPreset,
} from "@/lib/landing/landing-gradients";

type SectionGradientProps = {
  variant: LandingGradientPreset;
  className?: string;
};

export function SectionGradient({ variant, className = "" }: SectionGradientProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none h-16 w-full sm:h-24 lg:h-32 ${className}`.trim()}
      style={{
        background: buildLandingGradient(LANDING_GRADIENT_PRESETS[variant]),
      }}
    />
  );
}
