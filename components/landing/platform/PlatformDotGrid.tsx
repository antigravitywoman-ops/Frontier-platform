export function PlatformDotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, var(--color-deep-teal) 9%, transparent) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
      aria-hidden
    />
  );
}
