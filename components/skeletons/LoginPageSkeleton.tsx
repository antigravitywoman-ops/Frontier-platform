import { Skeleton } from "@/components/ui/Skeleton";

export function LoginPageSkeleton() {
  return (
    <div
      className="relative flex h-dvh w-full overflow-hidden bg-[#0D717B] lg:flex-row"
      aria-busy="true"
      aria-label="Loading sign in page"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden lg:left-1/2" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-[#094f57] via-[#0D717B] to-[#1aa3ad]" />
        <div className="absolute -left-24 top-[12%] size-80 rounded-full bg-[#3ec5cf]/25 blur-3xl" />
        <div className="absolute -right-20 bottom-[8%] size-96 rounded-full bg-[#011a24]/25 blur-3xl" />
      </div>

      <Skeleton className="relative z-[1] hidden h-full w-1/2 shrink-0 rounded-none lg:block" />

      <div className="relative z-[1] flex h-full min-h-0 w-full flex-col overflow-y-auto px-6 py-8 lg:w-1/2 lg:px-12 xl:px-16">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="glass-ios glass-ios-panel w-full max-w-xl p-8 md:p-10">
            <div className="mb-8 space-y-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-10" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))}
                </div>
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-12 w-full rounded-full" />
            </div>

            <Skeleton className="mx-auto mt-6 h-4 w-56" />
            <Skeleton className="mx-auto mt-4 h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
