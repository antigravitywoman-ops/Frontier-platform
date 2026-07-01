import { Skeleton } from "@/components/ui/Skeleton";
import {
  ProviderDashboardCard,
  ProviderDashboardSectionHeader,
} from "@/components/portal/provider/dashboard/ProviderDashboardGlass";
import { ProviderPageSection } from "@/components/portal/provider/shared/ProviderPageSection";

export function ProviderDashboardCardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="provider-dash-stat-pill px-3 py-2.5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="mt-2 h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

type GlassSkeletonProps = {
  glass?: boolean;
};

export function ProviderDashboardMetricsSkeleton({ glass = false }: GlassSkeletonProps) {
  if (glass) {
    return (
      <ProviderDashboardCard noPadding data-tour="doctor-dashboard-performance">
        <div className="border-b border-deep-teal/8 px-4 py-3 sm:px-5">
          <ProviderDashboardSectionHeader title="Performance" subtitle="Loading chart…" />
        </div>
        <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="provider-dash-chart-kpi provider-dash-chart-kpi--sales">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-7 w-20" />
                </div>
              ))}
            </div>
            <div className="provider-dash-chart-canvas">
              <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:px-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-72 w-full min-w-0 rounded-xl sm:h-[300px]" />
            </div>
          </div>
        </div>
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderPageSection title="Performance" noPadding>
      <div className="p-5 sm:p-6">
        <Skeleton className="h-80 w-full min-w-0 rounded-xl" />
      </div>
    </ProviderPageSection>
  );
}

export function ProviderDashboardClinicCardSkeleton({ glass = false }: GlassSkeletonProps) {
  if (glass) {
    return (
      <ProviderDashboardCard muted="teal">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-48" />
        <Skeleton className="mt-6 h-16 w-full max-w-xs" />
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderPageSection title="Clinic" subtitle="Loading…" compact>
      <ProviderDashboardCardSkeleton />
    </ProviderPageSection>
  );
}

export function ProviderDashboardOpsCardSkeleton({ glass = false }: GlassSkeletonProps) {
  if (glass) {
    return (
      <ProviderDashboardCard>
        <ProviderDashboardSectionHeader title="Operations" subtitle="Loading…" />
        <ProviderDashboardCardSkeleton />
      </ProviderDashboardCard>
    );
  }

  return (
    <ProviderPageSection title="Operations" subtitle="Orders and patients at a glance" compact>
      <ProviderDashboardCardSkeleton />
    </ProviderPageSection>
  );
}

export function ProviderDashboardRecentOrdersSkeleton({ glass = true }: GlassSkeletonProps) {
  if (!glass) return null;

  return (
    <ProviderDashboardCard noPadding className="provider-dash-recent-orders-card flex h-full min-h-0 flex-col overflow-hidden">
      <div className="border-b border-deep-teal/6 px-4 py-4 sm:px-5">
        <ProviderDashboardSectionHeader title="Recent orders" subtitle="Loading…" className="mb-0" />
      </div>
      <div className="provider-dash-recent-orders flex min-h-0 flex-1 flex-col">
        <div className="provider-dash-recent-orders-head grid shrink-0 grid-cols-4 gap-3 px-4 py-2.5 sm:px-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-3.5 w-16" />
          ))}
        </div>
        <div className="provider-dash-recent-orders-body">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="provider-dash-recent-orders-row grid grid-cols-4 items-center gap-3 px-4 py-3 sm:px-5"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="ml-auto h-5 w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto shrink-0 border-t border-deep-teal/6 bg-surface-muted/30 px-4 py-3 sm:px-5">
        <Skeleton className="h-5 w-40" />
      </div>
    </ProviderDashboardCard>
  );
}
