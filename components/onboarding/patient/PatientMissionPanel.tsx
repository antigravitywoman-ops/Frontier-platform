"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  CheckCircle,
  Circle,
  Play,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { useAuth } from "@/context/AuthProvider";
import { useRoleOnboarding } from "@/lib/hooks/use-role-onboarding";
import { PATIENT_ONBOARDING_SUBTITLE, PATIENT_ONBOARDING_TITLE } from "@/lib/onboarding/configs";
import { useShallow } from "@/lib/hooks/zustand";
import { useOnboardingStore } from "@/stores/onboarding-store";

function MissionStatusIcon({ complete, active }: { complete: boolean; active: boolean }) {
  if (complete) {
    return <CheckCircle className="size-4 shrink-0 text-pacific-teal" weight="fill" aria-hidden />;
  }
  if (active) {
    return <Sparkle className="size-4 shrink-0 text-pacific-teal" weight="fill" aria-hidden />;
  }
  return <Circle className="size-4 shrink-0 text-deep-teal/25" weight="light" aria-hidden />;
}

export function PatientMissionPanel() {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { steps, progress, isVisible, allComplete, completedCount } = useRoleOnboarding("patient");
  const { dismiss, triggerJoyride, restartPatientGuide } = useOnboardingStore(
    useShallow((state) => ({
      dismiss: state.dismiss,
      triggerJoyride: state.triggerJoyride,
      restartPatientGuide: state.restartPatientGuide,
    })),
  );
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const startMission = useCallback(
    (stepId: string) => {
      if (!session) return;
      const step = steps.find((item) => item.id === stepId);
      if (!step) return;

      setActiveStepId(stepId);
      triggerJoyride();
      if (pathname !== step.href) {
        router.push(step.href);
      }
    },
    [session, steps, triggerJoyride, pathname, router],
  );

  const continueSetup = useCallback(() => {
    const next = steps.find((step) => !progress.completedStepIds.includes(step.id));
    if (next) startMission(next.id);
  }, [steps, progress.completedStepIds, startMission]);

  const dismissOnboarding = useCallback(() => {
    if (!session) return;
    dismiss(session.userId, "patient");
    setActiveStepId(null);
  }, [dismiss, session]);

  const restartTour = useCallback(() => {
    if (!session) return;
    restartPatientGuide(session.userId);
    setActiveStepId(null);
    triggerJoyride();
  }, [restartPatientGuide, session, triggerJoyride]);

  if (!isVisible) return null;

  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const nextStep = steps.find((step) => !progress.completedStepIds.includes(step.id));

  return (
    <ProviderDashboardCard
      data-tour="onboarding-checklist"
      noPadding
      muted="teal"
      className="relative z-10 overflow-hidden"
    >
      <button
        type="button"
        onClick={dismissOnboarding}
        className="provider-dash-icon-btn provider-dash-launch-dismiss"
        aria-label="Dismiss setup guide"
      >
        <X className="size-4" weight="light" />
      </button>

      <div className="border-b border-deep-teal/8 px-4 py-4 pr-14 sm:px-5 sm:py-5 sm:pr-16">
        <ProviderDashboardSectionHeader
          title={PATIENT_ONBOARDING_TITLE}
          subtitle={PATIENT_ONBOARDING_SUBTITLE}
        />

        <div className="mt-1 flex items-center gap-4 sm:mt-2">
          <div className="provider-dash-launch-progress" aria-label={`${progressPercent}% complete`}>
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
              <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-deep-teal/10" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                className="stroke-pacific-teal transition-all duration-500"
                strokeWidth="3"
                strokeDasharray={`${progressPercent} 100`}
                strokeLinecap="round"
                pathLength={100}
              />
            </svg>
            <span className="relative font-sans text-sm font-semibold text-deep-teal">{progressPercent}%</span>
          </div>
          <div className="min-w-0">
            <p className="text-base font-medium text-deep-teal">
              {allComplete ? "All missions complete" : `${completedCount} of ${steps.length} missions done`}
            </p>
            {!allComplete && nextStep ? (
              <p className="mt-0.5 text-sm text-deep-teal/55">Up next: {nextStep.title}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {steps.map((step, index) => {
            const complete = progress.completedStepIds.includes(step.id);
            const active = activeStepId === step.id;
            const stepNumber = index + 1;
            const totalSteps = steps.length;

            return (
              <li key={step.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => startMission(step.id)}
                  className={`provider-dash-mission flex h-full w-full flex-col gap-2 px-3 py-3 text-left ${
                    active
                      ? "provider-dash-mission--active"
                      : complete
                        ? "provider-dash-mission--complete"
                        : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`provider-dash-mission-step ${
                          complete
                            ? "provider-dash-mission-step--complete"
                            : active
                              ? "provider-dash-mission-step--active"
                              : ""
                        }`}
                        aria-hidden
                      >
                        {stepNumber}/{totalSteps}
                      </span>
                      <span className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-deep-teal/45">
                        {step.stageLabel}
                      </span>
                    </div>
                    <MissionStatusIcon complete={complete} active={active} />
                  </div>
                  <span className="line-clamp-2 text-sm font-medium leading-snug text-deep-teal">
                    {step.title}
                  </span>
                  <span className="text-xs text-deep-teal/45">~{step.estimatedMinutes} min</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-deep-teal/8 px-4 py-3 sm:px-5 sm:py-4">
        <p className="max-w-xl text-sm leading-relaxed text-deep-teal/55">
          {allComplete
            ? "Your patient portal is ready. Replay any mission anytime."
            : "Guided tours walk you through each area and verify your progress."}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {!allComplete ? (
            <button type="button" onClick={continueSetup} className="provider-dash-setup-btn">
              <Play className="size-4" weight="fill" aria-hidden />
              Continue setup
            </button>
          ) : (
            <button type="button" onClick={restartTour} className="provider-dash-setup-btn">
              Restart guide
            </button>
          )}
        </div>
      </div>
    </ProviderDashboardCard>
  );
}
