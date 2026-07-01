"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ApplyTabs } from "@/components/apply/wizard/ApplyTabs";
import {
  authGlassEyebrowClassName,
  authGlassTitleClassName,
  glassSecondaryButtonClassName,
} from "@/components/auth/AuthShell";
import { WIZARD_STEPS } from "@/lib/apply/types";

const STEP_DESCRIPTIONS: Record<number, string> = {
  1: "Share your practice details, credentials, and primary contact information.",
  2: "Upload compliance documents and optional branding for your storefront.",
  3: "Add encrypted banking details for secure clinic payouts.",
};

const MAIN_TABS = WIZARD_STEPS.map((step) => ({
  id: String(step.id),
  label: step.short,
}));

type ApplyShellProps = {
  currentStep: number;
  onTabChange: (step: number) => void;
  children: ReactNode;
  footer: ReactNode;
};

export function ApplyShell({
  currentStep,
  onTabChange,
  children,
  footer,
}: ApplyShellProps) {
  const stepMeta = WIZARD_STEPS.find((step) => step.id === currentStep);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0D717B] lg:flex-row">
      <aside className="relative hidden h-full min-h-0 shrink-0 overflow-hidden bg-[#3f8b98] lg:block lg:w-1/2">
        <div className="absolute -inset-10">
          <Image
            src="/assets/login/login.png"
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-cover object-center"
            sizes="50vw"
          />
        </div>
      </aside>

      <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#094f57] via-[#0D717B] to-[#1aa3ad]" />
          <div className="absolute -left-24 top-[12%] size-80 rounded-full bg-[#3ec5cf]/25 blur-3xl" />
          <div className="absolute -right-20 bottom-[8%] size-96 rounded-full bg-[#011a24]/25 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 size-64 -translate-y-1/2 rounded-full bg-pure-white/10 blur-3xl" />
        </div>

        <div className="relative z-[1] flex h-full min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="glass-ios glass-ios-panel flex min-h-0 flex-1 flex-col overflow-hidden">
            <header className="shrink-0 border-b border-pure-white/10 px-4 py-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <p className={authGlassEyebrowClassName}>Clinic application</p>
                <h1 className={authGlassTitleClassName}>{stepMeta?.label}</h1>
                <p className="mx-auto mt-1.5 font-sans text-xs leading-none text-pure-white/70 whitespace-nowrap">
                  {STEP_DESCRIPTIONS[currentStep]}
                </p>
                <ApplyTabs
                  tabs={MAIN_TABS}
                  activeId={String(currentStep)}
                  onChange={(id) => onTabChange(Number(id))}
                  variant="primary"
                  appearance="glass"
                  className="mt-2"
                />
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-2 sm:px-6 sm:py-3" data-tour="apply-form">
              <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">{children}</div>
            </div>

            <footer className="shrink-0 border-t border-pure-white/10 px-4 py-3 sm:px-6">
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
                {footer}
              </div>
            </footer>
          </div>

          <div className="mt-4 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/" className={glassSecondaryButtonClassName}>
              Back to home
            </Link>
            <Link href="/login" className={glassSecondaryButtonClassName}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
