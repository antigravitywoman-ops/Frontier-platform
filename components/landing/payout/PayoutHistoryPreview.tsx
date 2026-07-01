"use client";

import { useMemo, useState } from "react";
import { IOSSegmentedControl } from "@/components/ui/IOSSegmentedControl";
import {
  filterPayoutHistory,
  PAYOUT_HISTORY,
  PAYOUT_PREVIEW_TABS,
  type PayoutPreviewTab,
} from "@/lib/landing/payout-section";
import { PayoutHistoryTile } from "./PayoutHistoryTile";

const TAB_SEGMENTS = PAYOUT_PREVIEW_TABS.map((tab) => ({
  value: tab,
  label: tab,
}));

type PayoutHistoryPreviewProps = {
  className?: string;
};

export function PayoutHistoryPreview({ className = "" }: PayoutHistoryPreviewProps) {
  const [activeTab, setActiveTab] = useState<PayoutPreviewTab>("All");

  const filteredEntries = useMemo(
    () => filterPayoutHistory(PAYOUT_HISTORY, activeTab, ""),
    [activeTab],
  );

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-pure-white shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:rounded-2xl ${className}`.trim()}
      aria-label="Payout history preview"
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-deep-teal/8 bg-surface-muted/80 px-3 py-2 sm:px-3.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#ff5f57] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#febc2e] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
          <span className="size-2.5 rounded-full border border-black/[0.12] bg-[#28c840] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]" />
        </div>
        <span className="ml-1.5 font-sans text-[10px] font-normal text-deep-teal/45 sm:text-[11px]">
          Settlements
        </span>
      </div>

      <div className="flex shrink-0 flex-col gap-2.5 border-b border-deep-teal/8 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
        <p className="font-sans text-xs font-normal text-deep-teal sm:text-sm">Payout history</p>
        <IOSSegmentedControl
          value={activeTab}
          onChange={setActiveTab}
          segments={TAB_SEGMENTS}
          aria-label="Payout status filter"
          className="w-full min-w-[17.5rem] sm:w-auto [&_.portal-ios-segment-inner]:min-w-[17.5rem]"
        />
      </div>

      <div className="flex flex-1 flex-col divide-y divide-deep-teal/6 bg-surface-muted/25">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => <PayoutHistoryTile key={entry.batchId} entry={entry} />)
        ) : (
          <p className="flex flex-1 items-center justify-center px-3.5 py-6 text-center font-sans text-xs font-normal text-deep-teal/50">
            No payouts in this tab.
          </p>
        )}
      </div>
    </div>
  );
}
