"use client";

import Link from "next/link";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";

type ProviderDashboardCtaProps = {
  pendingMessageCount: number;
};

export function ProviderDashboardCta({ pendingMessageCount }: ProviderDashboardCtaProps) {
  const hasPendingMessages = pendingMessageCount > 0;

  return (
    <div className="provider-dash-promo relative flex h-full min-h-[11rem] flex-col justify-between overflow-hidden p-5 sm:min-h-[12rem] sm:p-6">
      <div
        className="pointer-events-none absolute -right-6 top-0 size-36 rounded-full bg-pacific-teal/25 blur-3xl"
        aria-hidden
      />
      <div
        className="provider-dash-promo-watermark pointer-events-none absolute bottom-6 right-6"
        aria-hidden
      >
        <span className="provider-dash-promo-watermark-icon">
          <frontierSidebarIcons.messageSquare size={44} aria-hidden />
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center pr-12 sm:pr-16">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-pure-white/70 sm:text-sm">
          {hasPendingMessages ? "Action needed" : "Messages"}
        </p>
        <h3 className="mt-2 max-w-[18rem] font-sans text-2xl font-semibold leading-tight tracking-[-0.02em] text-pure-white sm:max-w-[22rem] sm:text-[1.75rem]">
          {hasPendingMessages
            ? `${pendingMessageCount} pending message${pendingMessageCount === 1 ? "" : "s"}`
            : "No pending messages"}
        </h3>
        <p className="mt-2 max-w-[18rem] text-base leading-relaxed text-pure-white/85 sm:max-w-[22rem] sm:text-lg">
          {hasPendingMessages
            ? "Patients are waiting for a reply from your clinic."
            : "You're caught up — open messages anytime to follow up."}
        </p>
      </div>

      <Link href="/portal/doctor/messages" className="provider-dash-promo-btn relative z-10 mt-5 w-fit">
        {hasPendingMessages ? "Reply now" : "Open messages"}
      </Link>
    </div>
  );
}
