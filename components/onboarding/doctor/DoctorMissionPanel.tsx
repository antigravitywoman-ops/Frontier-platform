"use client";

import {
  CheckCircle,
  Circle,
  Play,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useDoctorOnboarding } from "@/context/DoctorOnboardingProvider";
import { DOCTOR_ONBOARDING_AUTO_PLAY } from "@/lib/onboarding/doctor/auto-play";
import { DOCTOR_ONBOARDING_SUBTITLE, DOCTOR_ONBOARDING_TITLE } from "@/lib/onboarding/doctor/config";
import type { DoctorMissionId } from "@/lib/onboarding/doctor/types";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";

function MissionStatusIcon({ complete, active }: { complete: boolean; active: boolean }) {
  if (complete) {
    return <CheckCircle className="size-4 shrink-0 text-pacific-teal" weight="fill" aria-hidden />;
  }
  if (active) {
    return <Sparkle className="size-4 shrink-0 text-pacific-teal" weight="fill" aria-hidden />;
  }
  return <Circle className="size-4 shrink-0 text-deep-teal/25" weight="light" aria-hidden />;
}

export function DoctorMissionPanel() {
  const {
    missions,
    completedMissionIds,
    activeMissionId,
    isVisible,
    allComplete,
    completedCount,
    startMission,
    continueSetup,
    dismissOnboarding,
    restartTour,
    isAutoPlayActive,
  } = useDoctorOnboarding();

  if (!isVisible) return null;

  const progressPercent = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;
  const nextMission = missions.find((m) => !completedMissionIds.includes(m.id));

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
          title={DOCTOR_ONBOARDING_TITLE}
          subtitle={DOCTOR_ONBOARDING_SUBTITLE}
        />

        <div className="mt-1 flex items-center gap-4 sm:mt-2">
          <div
            className="provider-dash-launch-progress"
            aria-label={`${progressPercent}% complete`}
          >
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
              {allComplete ? "All missions complete" : `${completedCount} of ${missions.length} missions done`}
            </p>
            {!allComplete && nextMission ? (
              <p className="mt-0.5 text-sm text-deep-teal/55">
                {isAutoPlayActive && DOCTOR_ONBOARDING_AUTO_PLAY
                  ? "Guided setup in progress…"
                  : `Up next: ${nextMission.title}`}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {missions.map((mission, index) => {
            const complete = completedMissionIds.includes(mission.id);
            const active = activeMissionId === mission.id;
            const stepNumber = index + 1;
            const totalSteps = missions.length;
            return (
              <li key={mission.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => startMission(mission.id as DoctorMissionId)}
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
                        {mission.stageLabel}
                      </span>
                    </div>
                    <MissionStatusIcon complete={complete} active={active} />
                  </div>
                  <span className="line-clamp-2 text-sm font-medium leading-snug text-deep-teal">
                    {mission.title}
                  </span>
                  <span className="text-xs text-deep-teal/45">~{mission.estimatedMinutes} min</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-deep-teal/8 px-4 py-3 sm:px-5 sm:py-4">
        <p className="max-w-xl text-sm leading-relaxed text-deep-teal/55">
          {allComplete
            ? "Your clinic portal is fully configured. Replay any mission anytime."
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
