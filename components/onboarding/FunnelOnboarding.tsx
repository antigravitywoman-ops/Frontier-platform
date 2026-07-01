"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CaretDown,
  CheckCircle,
  Circle,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";
import { FunnelProgressBar } from "@/components/onboarding/FunnelProgressBar";
import { Tooltip } from "@/components/ui/Tippy";
import { useAuth } from "@/context/AuthProvider";
import { useRoleOnboarding } from "@/lib/hooks/use-role-onboarding";
import { useShallow } from "@/lib/hooks/zustand";
import { useOnboardingStore } from "@/stores/onboarding-store";
import {
  btnGhostClass,
  btnPrimaryClass,
  shapeStandardsCards,
  typeGuideTitle,
  typeSectionLabel,
} from "@/lib/brand/design-system";
import { typeBody } from "@/lib/brand/typography";
import type { OnboardingRole } from "@/lib/onboarding/types";

type FunnelOnboardingProps = {
  role: OnboardingRole;
  filterStepIds?: string[];
};

const CARD_CLASS =
  "overflow-hidden rounded-tl-[3.25rem] rounded-tr-xl rounded-br-[3.25rem] rounded-bl-xl border border-deep-teal/15 bg-pure-white shadow-[0_4px_24px_rgba(1,26,36,0.08)] sm:rounded-tl-[4rem] sm:rounded-br-[4rem]";

/** Funnel tier width — wider at top, narrower toward launch */
const TIER_WIDTH = ["w-full", "w-[94%]", "w-[88%]", "w-[82%]", "w-[76%]"];

function tierWidth(index: number) {
  return TIER_WIDTH[Math.min(index, TIER_WIDTH.length - 1)];
}

export function FunnelOnboarding({ role, filterStepIds }: FunnelOnboardingProps) {
  const { session } = useAuth();
  const { config, steps, progress, allComplete, isVisible, completedCount } = useRoleOnboarding(
    role,
    filterStepIds,
  );
  const { toggleStep, dismiss, triggerJoyride } = useOnboardingStore(
    useShallow((state) => ({
      toggleStep: state.toggleStep,
      dismiss: state.dismiss,
      triggerJoyride: state.triggerJoyride,
    })),
  );

  const activeIndex = steps.findIndex((step) => !progress.completedStepIds.includes(step.id));
  const defaultExpanded = activeIndex >= 0 ? steps[activeIndex]?.id : steps[steps.length - 1]?.id;
  const [expandedId, setExpandedId] = useState<string | undefined>(undefined);
  const openId = expandedId ?? defaultExpanded;

  if (!isVisible) return null;

  function handleToggle(stepId: string, completed: boolean) {
    if (!session) return;
    toggleStep(session.userId, role, stepId, completed);
  }

  function handleDismiss() {
    if (!session) return;
    dismiss(session.userId, role);
  }

  const totalMinutes = steps.reduce((sum, step) => sum + step.estimatedMinutes, 0);
  const remainingMinutes = steps
    .filter((step) => !progress.completedStepIds.includes(step.id))
    .reduce((sum, step) => sum + step.estimatedMinutes, 0);

  return (
    <section data-tour="onboarding-checklist" className={CARD_CLASS}>
      <div className="bg-surface-muted/30 px-5 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`${typeSectionLabel} text-sm`}>Funnel onboarding</p>
            <h2 className={`mt-3 ${typeGuideTitle}`}>
              {allComplete ? "Launch funnel complete" : config.funnelTitle}
            </h2>
            <p className={`mt-3 max-w-2xl text-lg leading-relaxed text-deep-teal/65`}>
              {allComplete
                ? "Every stage is done. Dismiss this funnel when you are ready to work without guidance."
                : config.funnelSubtitle}
            </p>
            {!allComplete ? (
              <p className="mt-3 text-sm text-deep-teal/50">
                ~{remainingMinutes} min remaining · {totalMinutes} min total funnel
              </p>
            ) : null}
          </div>
          {!allComplete ? (
            <button
              type="button"
              onClick={() => triggerJoyride()}
              className={`${btnGhostClass} shrink-0 px-4 py-2 text-sm`}
            >
              <Sparkle className="size-4" weight="fill" aria-hidden="true" />
              Guided tour
            </button>
          ) : null}
        </div>

        {!allComplete ? (
          <div className="mt-7">
            <FunnelProgressBar steps={steps} completedStepIds={progress.completedStepIds} />
          </div>
        ) : null}
      </div>

      {!allComplete ? (
        <div className="flex flex-col items-center gap-5 px-4 py-7 sm:gap-6 sm:px-6 sm:py-8">
          {steps.map((step, index) => {
            const completed = progress.completedStepIds.includes(step.id);
            const isActive = index === activeIndex;
            const isExpanded = openId === step.id;
            const shapeClass = shapeStandardsCards[index % shapeStandardsCards.length];

            return (
              <div
                key={step.id}
                className={`mx-auto transition-[width] duration-300 ${tierWidth(index)}`}
              >
                <article
                  className={`border transition-[border-color,box-shadow] duration-300 ${shapeClass} ${
                    completed
                      ? "border-pacific-teal/25 bg-pacific-teal/[0.04]"
                      : isActive
                        ? "border-deep-teal/20 bg-pure-white shadow-[0_8px_30px_rgba(1,26,36,0.08)]"
                        : "border-deep-teal/10 bg-surface-muted/20"
                  }`}
                >
                  <div className="flex w-full items-start gap-4 px-5 py-5 sm:px-6 sm:py-6">
                    <Tooltip content={completed ? "Mark incomplete" : "Mark complete"}>
                      <button
                        type="button"
                        onClick={() => handleToggle(step.id, !completed)}
                        className="mt-1 shrink-0 text-pacific-teal"
                        aria-label={completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {completed ? (
                          <CheckCircle className="size-6" weight="fill" />
                        ) : (
                          <Circle className="size-6" weight="light" />
                        )}
                      </button>
                    </Tooltip>

                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => setExpandedId(isExpanded ? undefined : step.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="rounded-full bg-deep-teal/8 px-3 py-1 text-xs font-light uppercase tracking-wide text-deep-teal/70">
                          Stage {step.stage} · {step.stageLabel}
                        </span>
                        {isActive && !completed ? (
                          <span className="rounded-full bg-coral-blush/80 px-3 py-1 text-xs font-light text-deep-teal">
                            Up next
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5 text-xs text-deep-teal/45">
                          <Clock className="size-3.5" weight="light" aria-hidden="true" />~
                          {step.estimatedMinutes} min
                        </span>
                      </div>
                      <h3 className="type-h3 mt-3 text-deep-teal">{step.title}</h3>
                      <p className={`mt-2 ${typeBody} text-deep-teal/65`}>{step.description}</p>
                    </button>

                    <button
                      type="button"
                      className="mt-1 shrink-0 text-deep-teal/40"
                      onClick={() => setExpandedId(isExpanded ? undefined : step.id)}
                      aria-label={isExpanded ? "Collapse stage" : "Expand stage"}
                    >
                      <CaretDown
                        className={`size-5 transition-transform duration-300 sm:size-6 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        weight="light"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="border-t border-deep-teal/8 px-5 pb-6 pt-5 sm:px-6 sm:pb-7">
                      <p className={`${typeBody} leading-relaxed text-deep-teal/75`}>{step.details}</p>

                      <div className="mt-6">
                        <p className="text-sm font-light uppercase tracking-wide text-deep-teal/50">
                          In this stage
                        </p>
                        <ul className="mt-3 space-y-3">
                          {step.checklist.map((item) => (
                            <li
                              key={item}
                              className={`flex items-start gap-3 ${typeBody} text-deep-teal/80`}
                            >
                              <span className="mt-2 size-2 shrink-0 rounded-full bg-pacific-teal" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        href={step.href}
                        className={`mt-6 inline-flex items-center gap-2 ${btnPrimaryClass} px-6 py-3 text-base`}
                      >
                        {step.actionLabel ?? "Go to stage"}
                        <ArrowRight className="size-4" weight="light" aria-hidden="true" />
                      </Link>
                    </div>
                  ) : null}
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <p className="text-sm text-deep-teal/60">
            All {completedCount} funnel stages complete. You are cleared for full portal access.
          </p>
          <button type="button" onClick={handleDismiss} className={btnPrimaryClass}>
            Dismiss funnel
          </button>
        </div>
      )}

      {!allComplete ? (
        <div className="flex justify-end border-t border-deep-teal/8 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-sm text-deep-teal/50 transition-colors hover:text-deep-teal"
          >
            Dismiss funnel
          </button>
        </div>
      ) : null}
    </section>
  );
}
