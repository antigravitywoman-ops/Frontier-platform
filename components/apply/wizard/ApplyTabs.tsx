"use client";

type ApplyTab = {
  id: string;
  label: string;
};

type ApplyTabsProps = {
  tabs: ApplyTab[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: "primary" | "secondary";
  appearance?: "default" | "glass";
  className?: string;
};

export function ApplyTabs({
  tabs,
  activeId,
  onChange,
  variant = "primary",
  appearance = "default",
  className = "",
}: ApplyTabsProps) {
  const isPrimary = variant === "primary";
  const isGlass = appearance === "glass";

  return (
    <div
      role="tablist"
      aria-label="Form sections"
      className={`flex gap-1 ${
        isPrimary
          ? isGlass
            ? "rounded-2xl border border-pure-white/18 bg-pure-white/8 p-1 backdrop-blur-md"
            : "rounded-2xl border border-deep-teal/10 bg-deep-teal/[0.03] p-1"
          : isGlass
            ? "border-b border-pure-white/18"
            : "border-b border-deep-teal/10"
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-tour={`apply-tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={
              isPrimary
                ? `flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-light transition-all sm:px-4 ${
                    isGlass
                      ? isActive
                        ? "bg-pure-white/22 text-pure-white shadow-sm ring-1 ring-pure-white/20"
                        : "text-pure-white/60 hover:text-pure-white/85"
                      : isActive
                        ? "bg-pure-white text-deep-teal shadow-sm shadow-deep-teal/10"
                        : "text-deep-teal/50 hover:text-deep-teal/75"
                  }`
                : `relative -mb-px border-b-2 px-3 py-2.5 text-sm font-light transition-colors sm:px-4 ${
                    isGlass
                      ? isActive
                        ? "border-pure-white text-pure-white"
                        : "border-transparent text-pure-white/55 hover:text-pure-white/80"
                      : isActive
                        ? "border-pacific-teal text-deep-teal"
                        : "border-transparent text-deep-teal/45 hover:text-deep-teal/70"
                  }`
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
