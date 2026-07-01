import { formatUsd, type PayoutHistoryEntry } from "@/lib/landing/payout-section";

const STATUS_LABELS = {
  paid: "Paid",
  processing: "Processing",
} as const;

const STATUS_CLASS = {
  paid: "bg-pacific-teal/10 text-pacific-teal",
  processing: "bg-deep-teal/6 text-deep-teal/55",
} as const;

type PayoutHistoryTileProps = {
  entry: PayoutHistoryEntry;
};

export function PayoutHistoryTile({ entry }: PayoutHistoryTileProps) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 sm:gap-4 sm:px-4">
      <span className="min-w-0 flex-1 truncate font-sans text-[11px] font-normal tracking-[0.02em] text-deep-teal/75 sm:text-xs">
        {entry.batchId}
      </span>
      <span className="shrink-0 font-sans text-xs font-normal text-deep-teal sm:text-[13px]">
        {formatUsd(entry.amount)}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[9px] font-normal uppercase tracking-wide sm:text-[10px] ${STATUS_CLASS[entry.status]}`}
      >
        {STATUS_LABELS[entry.status]}
      </span>
      <span className="shrink-0 font-sans text-[11px] font-normal text-deep-teal/45 sm:text-xs">
        {entry.dateLabel}
      </span>
    </div>
  );
}
