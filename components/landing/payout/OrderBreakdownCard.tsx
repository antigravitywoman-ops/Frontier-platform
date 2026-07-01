import {
  FEATURED_ORDER,
  formatUsd,
  formatUsdCents,
  PAYOUT_HISTORY,
  PAYOUT_SECTION,
} from "@/lib/landing/payout-section";
import { landingDataText, landingFieldLabel } from "@/lib/landing/landing-surfaces";

function MarginBar({ marginPercent }: { marginPercent: number }) {
  return (
    <>
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-deep-teal/6" aria-hidden>
        <div
          className="h-full rounded-full bg-pacific-teal/35"
          style={{ width: `${marginPercent}%` }}
        />
        <div className="h-full flex-1 rounded-full bg-deep-teal/8" />
      </div>
      <div className="mt-1.5 flex justify-between font-sans text-[10px] font-normal text-deep-teal/40 sm:text-[11px]">
        <span>Margin {formatUsd(FEATURED_ORDER.margin)}</span>
        <span>Platform cost {formatUsd(FEATURED_ORDER.retail - FEATURED_ORDER.margin)}</span>
      </div>
    </>
  );
}

function OrderIcon() {
  return (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-deep-teal/8 bg-surface-muted/70"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 text-pacific-teal/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

type OrderBreakdownCardProps = {
  className?: string;
};

export function OrderBreakdownCard({ className = "" }: OrderBreakdownCardProps) {
  const marginPercent = Math.round((FEATURED_ORDER.margin / FEATURED_ORDER.retail) * 1000) / 10;
  const latestBatch = PAYOUT_HISTORY[0];

  return (
    <div
      className={`group h-full [perspective:1200px] ${className}`.trim()}
      tabIndex={0}
      aria-label="Order payout breakdown preview. Hover or focus to flip."
    >
      <div className="relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none] motion-reduce:group-focus:[transform:none]">
        {/* Front — retail & margin */}
        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl border border-deep-teal/10 bg-pure-white shadow-[0_16px_40px_rgba(1,26,36,0.07)] [backface-visibility:hidden] sm:rounded-2xl">
          <div className="grid min-h-0 flex-1 grid-cols-2">
            <div className="flex flex-col justify-center border-r border-deep-teal/8 bg-surface-muted/60 px-4 py-5 sm:px-5 sm:py-6">
              <p className={`${landingFieldLabel} text-deep-teal/45`}>Your retail</p>
              <p className="mt-2 font-sans text-2xl font-normal tracking-[-0.04em] text-deep-teal sm:text-3xl">
                {formatUsdCents(FEATURED_ORDER.retail)}
              </p>
              <p className="mt-1.5 font-sans text-xs font-normal text-deep-teal/55 sm:text-sm">
                {FEATURED_ORDER.product} · qty {FEATURED_ORDER.quantity}
              </p>
            </div>

            <div className="flex flex-col justify-center bg-surface-warm/80 px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex items-center gap-2">
                <p className={`${landingFieldLabel} text-deep-teal/45`}>Your margin</p>
                <span className="rounded-full bg-pacific-teal/10 px-2 py-0.5 font-sans text-[10px] font-normal uppercase tracking-[0.06em] text-pacific-teal">
                  auto
                </span>
              </div>
              <p className="mt-2 font-sans text-2xl font-normal tracking-[-0.04em] text-pacific-teal sm:text-3xl">
                {formatUsdCents(FEATURED_ORDER.margin)}
              </p>
              <p className="mt-1.5 font-sans text-xs font-normal text-deep-teal/55 sm:text-sm">
                {marginPercent}% of retail · calculated in-platform
              </p>
            </div>
          </div>

          <p className="shrink-0 border-t border-deep-teal/8 px-4 py-2 text-center font-sans text-[10px] font-normal text-deep-teal/38 sm:px-5 sm:text-[11px]">
            Hover to view payout details
          </p>
        </div>

        {/* Back — order & settlement */}
        <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-xl border border-deep-teal/10 bg-pure-white shadow-[0_16px_40px_rgba(1,26,36,0.07)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-2xl">
          <div className="flex h-full flex-col px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-start gap-2.5">
              <OrderIcon />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-normal text-deep-teal">{FEATURED_ORDER.product}</p>
                <p className={`${landingDataText} mt-0.5 text-deep-teal/50`}>{FEATURED_ORDER.orderId}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-deep-teal/8 py-4">
              <div>
                <p className={`${landingFieldLabel} text-deep-teal/40`}>Payout date</p>
                <p className="mt-1 font-sans text-base font-normal text-deep-teal sm:text-lg">
                  {FEATURED_ORDER.payoutDate}
                </p>
              </div>
              <div>
                <p className={`${landingFieldLabel} text-deep-teal/40`}>Schedule</p>
                <p className="mt-1 font-sans text-xs font-normal leading-relaxed text-deep-teal/65 sm:text-sm">
                  {PAYOUT_SECTION.scheduleNote}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className={`${landingFieldLabel} text-deep-teal/40`}>Latest batch</p>
              <p className={`${landingDataText} mt-1.5 text-deep-teal/70`}>
                <span className="text-deep-teal">{latestBatch.batchId}</span>
                <span className="mx-1.5 text-deep-teal/20">·</span>
                {formatUsd(latestBatch.amount)}
                <span className="mx-1.5 text-deep-teal/20">·</span>
                <span className="text-pacific-teal">{latestBatch.status}</span>
              </p>
            </div>

            <div className="mt-auto pt-3">
              <MarginBar marginPercent={marginPercent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
