"use client";

import { useCallback } from "react";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import {
  FloatingToolbarAction,
  FloatingToolbarActions,
} from "@/components/portal/shared/FloatingIconAction";
import {
  PortalDetailCell,
  PortalStatCard,
} from "@/components/portal/shared/PortalDashboardCards";
import { PortalPageSection } from "@/components/portal/shared/PortalPageSection";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { useAffiliatePortal } from "@/context/AffiliatePortalProvider";
import { toast } from "@/lib/toast";

export function AffiliateDashboard() {
  const { profile, isMain, isLoading, refreshProfile } = useAffiliatePortal();

  const copyReferralLink = useCallback(async () => {
    if (!profile?.referral_link) return;
    try {
      await navigator.clipboard.writeText(profile.referral_link);
      toast.success("Referral link copied.");
    } catch {
      toast.error("Unable to copy link.");
    }
  }, [profile?.referral_link]);

  if (isLoading) {
    return <p className="py-12 text-center text-sm text-deep-teal/50">Loading your affiliate account…</p>;
  }

  if (!profile) {
    return <p className="py-12 text-center text-sm text-deep-teal/50">Unable to load affiliate profile.</p>;
  }

  const toolbarActions = [
    {
      href: "/portal/affiliate/clinics/invite",
      label: "Invite clinic",
      icon: frontierSidebarIcons.userPlus,
      primary: true,
    },
    {
      href: "/portal/affiliate/referrals",
      label: "Referrals",
      icon: frontierSidebarIcons.users,
      primary: false,
    },
    ...(isMain
      ? [
          {
            href: "/portal/affiliate/sub-affiliates",
            label: "Sub-affiliates",
            icon: frontierSidebarIcons.usersRound,
            primary: false,
          },
        ]
      : []),
  ] as const;

  return (
    <PortalPageShell
      title="Dashboard"
      actions={
        <FloatingToolbarActions>
          {toolbarActions.map(({ href, label, icon, primary }) => (
            <FloatingToolbarAction
              key={href}
              href={href}
              label={label}
              icon={icon}
              primary={primary}
            />
          ))}
          <FloatingToolbarAction
            label="Copy link"
            icon={frontierSidebarIcons.creditCard}
            onClick={() => void copyReferralLink()}
          />
          <FloatingToolbarAction
            label="Refresh dashboard"
            icon={frontierSidebarIcons.refreshCw}
            disabled={isLoading}
            onClick={() => void refreshProfile({ force: true })}
          />
        </FloatingToolbarActions>
      }
    >
      <PortalPageSection title="Account" subtitle={profile.email}>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <PortalDetailCell label="Email" value={profile.email} />
            <PortalDetailCell
              label="Type"
              value={<span className="capitalize">{profile.affiliate_type}</span>}
            />
            <PortalDetailCell
              label="Status"
              value={<span className="capitalize">{profile.status}</span>}
            />
            <PortalDetailCell
              label="Affiliate code"
              value={<span className="font-mono text-xs">{profile.affiliate_code}</span>}
            />
            <PortalDetailCell label="Profit margin" value={`${profile.profit_margin_percent}%`} />
            {isMain ? (
              <PortalDetailCell
                label="Sub-affiliate limit"
                value={
                  profile.max_sub_affiliates === null
                    ? "Unlimited"
                    : `${profile.stats.sub_affiliate_count} / ${profile.max_sub_affiliates}`
                }
              />
            ) : profile.parent_affiliate ? (
              <PortalDetailCell
                label="Parent affiliate"
                value={`${profile.parent_affiliate.affiliate_code} · ${profile.parent_affiliate.email}`}
              />
            ) : (
              <PortalDetailCell label="Parent affiliate" value="—" />
            )}
          </dl>

          <div className="provider-dash-card-muted provider-dash-card-muted--teal p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-light uppercase tracking-wide text-deep-teal/45">Referral link</p>
              <button
                type="button"
                onClick={() => void copyReferralLink()}
                className="inline-flex items-center gap-1.5 rounded-full border border-deep-teal/15 px-3 py-1 text-xs font-light text-deep-teal hover:bg-pacific-teal/12"
              >
                <frontierSidebarIcons.creditCard size={12} aria-hidden="true" />
                Copy
              </button>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-deep-teal/80">{profile.referral_link}</p>
          </div>
      </PortalPageSection>

      <PortalPageSection title="Referral stats" subtitle="Your network at a glance">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PortalStatCard
            centered
            label="My clinic referrals"
            value={profile.stats.own_clinic_referrals}
          />
          {isMain ? (
            <>
              <PortalStatCard
                centered
                label="Total network referrals"
                value={profile.stats.total_clinic_referrals}
              />
              <PortalStatCard
                centered
                label="Sub-affiliates"
                value={profile.stats.sub_affiliate_count}
              />
            </>
          ) : null}
        </div>
      </PortalPageSection>
    </PortalPageShell>
  );
}
