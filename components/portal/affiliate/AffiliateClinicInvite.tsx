"use client";

import { useCallback, useEffect, useState } from "react";
import { ICON_SIZE_SM } from "@/components/icons/frontier";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/AuthShell";
import { PortalDetailCell } from "@/components/portal/shared/PortalDashboardCards";
import { PortalPageSection } from "@/components/portal/shared/PortalPageSection";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import {
  toolbarBtnClass,
  toolbarBtnPrimaryClass,
} from "@/components/portal/shared/PortalPageToolbar";
import { getClinicInviteLink, inviteClinic } from "@/lib/affiliate/api";
import { showError, toast } from "@/lib/toast";

export function AffiliateClinicInvite() {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [clinicEmail, setClinicEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadInviteLink = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getClinicInviteLink();
      setReferralCode(response.referral_code);
      setReferralLink(response.referral_link);
    } catch (error) {
      showError(error, "Unable to load clinic invite link.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInviteLink();
  }, [loadInviteLink]);

  async function handleCopyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied.");
    } catch {
      toast.error("Unable to copy link.");
    }
  }

  async function handleInvite(event: React.FormEvent) {
    event.preventDefault();
    setIsSending(true);
    try {
      const result = await inviteClinic({
        clinic_email: clinicEmail.trim() || undefined,
      });
      setReferralCode(result.referral_code);
      setReferralLink(result.referral_link);
      toast.success(result.message);
      setClinicEmail("");
    } catch (error) {
      showError(error, "Unable to create clinic invitation.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <PortalPageShell
      title="Invite Clinic"
      actions={
        <>
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            disabled={!referralLink || isLoading}
            className={toolbarBtnClass}
          >
            <frontierSidebarIcons.creditCard size={ICON_SIZE_SM} aria-hidden="true" />
            <span className="hidden sm:inline">Copy link</span>
          </button>
          <button
            type="button"
            onClick={() => void loadInviteLink()}
            disabled={isLoading}
            className={toolbarBtnPrimaryClass}
            aria-label="Refresh invite link"
          >
            <frontierSidebarIcons.refreshCw size={ICON_SIZE_SM} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
        </>
      }
    >
      <PortalPageSection
        icon={frontierSidebarIcons.mapPin}
        title="Your clinic invite link"
        subtitle="Share this link with prospective clinics"
      >
          {isLoading ? (
            <p className="py-8 text-center text-sm text-deep-teal/50">Loading invite link…</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <PortalDetailCell label="Referral code" value={referralCode} />
              <PortalDetailCell
                label="Referral link"
                value={<span className="break-all font-mono text-xs">{referralLink}</span>}
                className="sm:col-span-2"
              />
            </div>
          )}
      </PortalPageSection>

      <PortalPageSection
        icon={frontierSidebarIcons.mail}
        title="Email invitation"
        subtitle="Send the application link to a clinic inbox"
      >
        <form onSubmit={(event) => void handleInvite(event)} className="space-y-4">
          <div className="max-w-md">
            <label htmlFor="clinic-email" className={authLabelClassName}>
              Clinic email (optional)
            </label>
            <input
              id="clinic-email"
              type="email"
              value={clinicEmail}
              onChange={(e) => setClinicEmail(e.target.value)}
              placeholder="clinic@example.com"
              className={authInputClassName}
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-full bg-deep-teal px-5 py-2.5 text-sm font-light text-pure-white hover:opacity-90 disabled:opacity-60"
          >
            <frontierSidebarIcons.send size={ICON_SIZE_SM} aria-hidden="true" />
            {isSending ? "Sending…" : clinicEmail.trim() ? "Send invitation" : "Generate link"}
          </button>
        </form>
      </PortalPageSection>
    </PortalPageShell>
  );
}
