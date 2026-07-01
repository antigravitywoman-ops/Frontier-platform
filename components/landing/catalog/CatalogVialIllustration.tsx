type CatalogVialIllustrationProps = {
  tone?: "teal" | "coral" | "sky";
  className?: string;
};

const TONE_FILLS: Record<NonNullable<CatalogVialIllustrationProps["tone"]>, string> = {
  teal: "rgba(13, 113, 123, 0.32)",
  coral: "rgba(247, 225, 217, 0.42)",
  sky: "rgba(160, 210, 220, 0.38)",
};

export function CatalogVialIllustration({
  tone = "teal",
  className = "",
}: CatalogVialIllustrationProps) {
  const fill = TONE_FILLS[tone];

  return (
    <svg
      viewBox="0 0 120 140"
      className={`h-full w-full ${className}`.trim()}
      aria-hidden
    >
      <ellipse cx="60" cy="72" rx="44" ry="58" fill="rgba(13, 113, 123, 0.08)" />
      <rect x="42" y="8" width="36" height="18" rx="2.5" fill="#9aacb8" />
      <rect x="42" y="8" width="36" height="6" rx="2.5" fill="#b8c5ce" />
      <rect x="48" y="20" width="24" height="4" rx="1" fill="#7a8f9c" />
      <path
        d="M 46 26 h 28 v 10 c 0 3 -28 3 -28 3 v -13 z"
        fill="rgba(180, 210, 220, 0.35)"
        stroke="rgba(1, 26, 36, 0.12)"
        strokeWidth="0.75"
      />
      <path
        d="M 34 36 h 52 c 5 0 8 5 8 11 v 72 c 0 8 -7 14 -15 14 H 41 c -8 0 -15 -6 -15 -14 V 47 c 0 -6 3 -11 8 -11 z"
        fill="rgba(255, 255, 255, 0.55)"
        stroke="rgba(1, 26, 36, 0.14)"
        strokeWidth="1.1"
      />
      <path
        d="M 42 48 h 36 v 78 c 0 5 -5 8 -10 8 H 52 c -5 0 -10 -3 -10 -8 V 48 z"
        fill={fill}
      />
      <path
        d="M 46 44 v 72"
        stroke="rgba(255, 255, 255, 0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 72 54 v 52"
        stroke="rgba(1, 26, 36, 0.08)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
