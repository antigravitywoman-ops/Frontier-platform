"use client";

import { useCallback, useEffect, useState } from "react";
import { ICON_SIZE_SM } from "@/components/icons/frontier";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { PortalPageSection } from "@/components/portal/shared/PortalPageSection";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { toolbarBtnPrimaryClass } from "@/components/portal/shared/PortalPageToolbar";
import { listClinicReferrals } from "@/lib/affiliate/api";
import type { ClinicReferral, ReferralScope } from "@/lib/affiliate/types";
import { useAffiliatePortal } from "@/context/AffiliatePortalProvider";
import { showError } from "@/lib/toast";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AffiliateReferrals() {
  const { isMain } = useAffiliatePortal();
  const [referrals, setReferrals] = useState<ClinicReferral[]>([]);
  const [scope, setScope] = useState<ReferralScope>("own");
  const [isLoading, setIsLoading] = useState(true);

  const loadReferrals = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listClinicReferrals({
        page: 1,
        limit: 100,
        scope: isMain ? scope : "own",
      });
      setReferrals(response.referrals);
    } catch (error) {
      showError(error, "Unable to load clinic referrals.");
      setReferrals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isMain, scope]);

  useEffect(() => {
    void loadReferrals();
  }, [loadReferrals]);

  const colSpan = isMain && scope === "all" ? 6 : 5;

  return (
    <PortalPageShell
      title="Clinic Referrals"
      actions={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isMain ? (
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as ReferralScope)}
              className="rounded-full border border-deep-teal/25 bg-pure-white px-4 py-2 text-sm text-deep-teal outline-none focus:border-deep-teal"
            >
              <option value="own">My referrals</option>
              <option value="all">All network</option>
            </select>
          ) : null}
          <button
            type="button"
            onClick={() => void loadReferrals()}
            disabled={isLoading}
            className={toolbarBtnPrimaryClass}
            aria-label="Refresh referrals"
          >
            <frontierSidebarIcons.refreshCw size={ICON_SIZE_SM} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <PortalPageSection
        icon={frontierSidebarIcons.building2}
        title="Referred clinics"
        subtitle={isLoading ? "Loading…" : `${referrals.length} referral${referrals.length === 1 ? "" : "s"}`}
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-deep-teal/10 bg-surface-muted/50 text-xs uppercase tracking-wide text-deep-teal/45">
              <tr>
                <th className="px-4 py-3 font-light">Clinic</th>
                <th className="px-4 py-3 font-light">Email</th>
                <th className="px-4 py-3 font-light">Clinic status</th>
                <th className="px-4 py-3 font-light">Referral status</th>
                {isMain && scope === "all" ? (
                  <th className="px-4 py-3 font-light">Referred by</th>
                ) : null}
                <th className="px-4 py-3 font-light">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-10 text-center text-deep-teal/50">
                    Loading referrals…
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-10 text-center text-deep-teal/50">
                    No clinic referrals found.
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-deep-teal/5">
                    <td className="px-4 py-3 font-light text-deep-teal">{referral.clinic.clinic_name}</td>
                    <td className="px-4 py-3 text-deep-teal/70">{referral.clinic.email}</td>
                    <td className="px-4 py-3 capitalize text-deep-teal/70">{referral.clinic.status}</td>
                    <td className="px-4 py-3 capitalize text-deep-teal/70">{referral.status}</td>
                    {isMain && scope === "all" ? (
                      <td className="px-4 py-3 font-mono text-xs text-deep-teal/70">
                        {referral.referred_by.affiliate_code}
                      </td>
                    ) : null}
                    <td className="px-4 py-3 text-deep-teal/70">{formatDate(referral.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalPageSection>
    </PortalPageShell>
  );
}
