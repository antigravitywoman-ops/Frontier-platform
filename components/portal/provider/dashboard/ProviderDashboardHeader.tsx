"use client";

type ProviderDashboardHeaderProps = {
  displayName?: string;
};

export function ProviderDashboardHeader({ displayName }: ProviderDashboardHeaderProps) {
  const name = displayName?.trim() || "Doctor";

  return (
    <header className="relative z-10 border-b border-deep-teal/8 pb-3">
      <p className="font-sans text-2xl font-normal tracking-[-0.02em] text-deep-teal sm:text-3xl">
        Welcome back, {name}!
      </p>
      <h2 className="mt-2 font-sans text-xl font-semibold tracking-[-0.02em] text-deep-teal sm:text-2xl">
        Overview
      </h2>
    </header>
  );
}
