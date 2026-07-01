"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DoctorMissionPanel } from "@/components/onboarding/doctor/DoctorMissionPanel";
import { ProviderDashboardCta } from "@/components/portal/provider/dashboard/ProviderDashboardCta";
import { ProviderDashboardRecentOrders } from "@/components/portal/provider/dashboard/ProviderDashboardRecentOrders";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { ProviderDashboardHeader } from "@/components/portal/provider/dashboard/ProviderDashboardHeader";
import { ProviderDashboardOpsStats } from "@/components/portal/provider/dashboard/ProviderDashboardOpsStats";
import { ProviderDashboardQuickActions } from "@/components/portal/provider/ProviderDashboardQuickActions";
import { ProviderMetricsBar } from "@/components/portal/provider/ProviderMetricsBar";
import {
  ProviderDashboardClinicCardSkeleton,
  ProviderDashboardMetricsSkeleton,
  ProviderDashboardOpsCardSkeleton,
  ProviderDashboardRecentOrdersSkeleton,
} from "@/components/portal/provider/ProviderDashboardSkeleton";
import { useProviderUnreadTotal } from "@/context/ChatProvider";
import { useAuth } from "@/context/AuthProvider";
import { useProviderDashboard } from "@/context/ProviderPortalProvider";
import { DOCTOR_ONBOARDING_EVENTS } from "@/lib/onboarding/doctor/events";

function ClinicHero({
  clinicName,
  stats,
}: {
  clinicName: string;
  stats: { patientCount: number; pendingReviewCount: number };
}) {
  return (
    <div className="flex h-full min-h-[9rem] flex-1 flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-deep-teal/45 sm:text-base">Clinic</p>
        <p className="mt-1.5 font-sans text-4xl font-bold tracking-[-0.03em] text-deep-teal sm:text-[2.75rem]">
          {clinicName}
        </p>
        <p className="mt-2 max-w-md text-base leading-relaxed text-deep-teal/55 sm:text-lg">
          Patients under care and orders awaiting review
        </p>
      </div>

      <div className="flex shrink-0 items-stretch gap-2 sm:gap-3 lg:justify-end lg:self-center">
        <div className="provider-dash-stat-pill flex min-w-[6.5rem] flex-col justify-center px-4 py-3 text-center sm:min-w-[7.5rem] sm:px-5 sm:py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-deep-teal/45 sm:text-sm">
            Patients
          </p>
          <p className="mt-1.5 font-sans text-4xl font-light text-deep-teal sm:text-[2.75rem]">
            {stats.patientCount}
          </p>
        </div>
        <div className="provider-dash-stat-pill flex min-w-[6.5rem] flex-col justify-center px-4 py-3 text-center sm:min-w-[7.5rem] sm:px-5 sm:py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-deep-teal/45 sm:text-sm">
            Pending review
          </p>
          <p className="mt-1.5 font-sans text-4xl font-light text-deep-teal sm:text-[2.75rem]">
            {stats.pendingReviewCount}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardMetricsPair({ isOrdersHydrated }: { isOrdersHydrated: boolean }) {
  const performanceRef = useRef<HTMLDivElement>(null);
  const [pairedHeight, setPairedHeight] = useState<number | null>(null);

  useEffect(() => {
    const performance = performanceRef.current;
    if (!performance) return;

    const syncHeight = () => {
      setPairedHeight(performance.getBoundingClientRect().height);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(performance);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [isOrdersHydrated]);

  return (
    <div className="relative z-10 grid gap-3 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-4">
      <div ref={performanceRef} className="min-w-0">
        {isOrdersHydrated ? (
          <ProviderMetricsBar glass />
        ) : (
          <ProviderDashboardMetricsSkeleton glass />
        )}
      </div>

      <div
        className="flex min-h-0 min-w-0 flex-col max-lg:h-auto lg:max-h-[var(--dash-paired-h)] lg:h-[var(--dash-paired-h)]"
        style={
          pairedHeight != null
            ? ({ "--dash-paired-h": `${pairedHeight}px` } as CSSProperties)
            : undefined
        }
      >
        {isOrdersHydrated ? (
          <ProviderDashboardRecentOrders />
        ) : (
          <ProviderDashboardRecentOrdersSkeleton />
        )}
      </div>
    </div>
  );
}

export function ProviderDashboard() {
  const { session } = useAuth();
  const {
    branding,
    providerDisplayName,
    stats,
    cardsReady,
    isOrdersHydrated,
    isPatientsHydrated,
    isStoreHydrated,
    isProfileHydrated,
  } = useProviderDashboard();
  const pendingMessageCount = useProviderUnreadTotal();

  useEffect(() => {
    if (!cardsReady) return;
    window.dispatchEvent(new CustomEvent(DOCTOR_ONBOARDING_EVENTS.dashboardReady));
  }, [cardsReady]);

  const showClinicCard =
    isProfileHydrated && isPatientsHydrated && isOrdersHydrated;
  const showOpsCard = isOrdersHydrated && isPatientsHydrated && isStoreHydrated;

  return (
    <div className="space-y-3">
      <div className="provider-dashboard-shell">
        <div className="provider-dashboard-panel relative z-0 space-y-4 p-4 sm:space-y-5 sm:p-5 lg:p-6">
          <DoctorMissionPanel />

          <ProviderDashboardHeader
            displayName={providerDisplayName ?? session?.email ?? undefined}
          />

          <div className="relative z-10 grid gap-3 lg:grid-cols-5 lg:gap-4">
            <div className="lg:col-span-3">
              {showClinicCard ? (
                <ProviderDashboardCard
                  muted="teal"
                  data-tour="doctor-dashboard-clinic-card"
                  className="flex h-full flex-col"
                >
                  <ClinicHero
                    clinicName={branding.clinicName}
                    stats={{
                      patientCount: stats.patientCount,
                      pendingReviewCount: stats.pendingReviewCount,
                    }}
                  />
                </ProviderDashboardCard>
              ) : (
                <ProviderDashboardClinicCardSkeleton glass />
              )}
            </div>

            <div className="lg:col-span-2">
              {showOpsCard ? (
                <ProviderDashboardCard data-tour="doctor-dashboard-ops-card" className="h-full">
                  <ProviderDashboardSectionHeader
                    title="Operations"
                    subtitle="Live clinic activity"
                  />
                  <ProviderDashboardOpsStats stats={stats} />
                </ProviderDashboardCard>
              ) : (
                <ProviderDashboardOpsCardSkeleton glass />
              )}
            </div>
          </div>

          <div className="relative z-10 grid gap-3 lg:grid-cols-5 lg:gap-4">
            <div className="lg:col-span-3">
              <ProviderDashboardCard data-tour="doctor-dashboard-quick-actions">
                <ProviderDashboardSectionHeader
                  title="Quick actions"
                  subtitle="Jump to a workspace"
                />
                <ProviderDashboardQuickActions />
              </ProviderDashboardCard>
            </div>

            <div className="lg:col-span-2">
              {showOpsCard ? (
                <ProviderDashboardCta pendingMessageCount={pendingMessageCount} />
              ) : (
                <div className="provider-dash-promo min-h-[11rem] animate-pulse opacity-40 sm:min-h-[12rem]" />
              )}
            </div>
          </div>

          <DashboardMetricsPair isOrdersHydrated={isOrdersHydrated} />
        </div>
      </div>
    </div>
  );
}
