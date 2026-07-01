"use client";

import { useCallback, useEffect, useState } from "react";
import {
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/AuthShell";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import { toolbarBtnPrimaryClass } from "@/components/portal/shared/PortalPageToolbar";
import { updatePlatformSettings } from "@/lib/admin/api";
import type { PlatformSettings } from "@/lib/admin/types";
import { useShallow } from "@/lib/hooks/zustand";
import { useAdminPortalStore } from "@/stores/admin-portal-store";
import { showError, toast } from "@/lib/toast";

const EMPTY_SETTINGS: PlatformSettings = {
  default_profit_margin_percent: 0,
  platform_commission_percent: 10,
  affiliate_referral_fee_percent: 5,
  payout_frequency: "biweekly",
  minimum_payout_threshold: 500,
  default_shipping_rate: 12,
  tax_calculation: "auto",
  updated_at: "",
};

export function AdminPlatformSettings() {
  const { platformSettings, isLoading, refreshPlatformSettings } = useAdminPortalStore(
    useShallow((state) => ({
      platformSettings: state.platformSettings,
      isLoading: state.isLoading,
      refreshPlatformSettings: state.refreshPlatformSettings,
    })),
  );
  const [settings, setSettings] = useState<PlatformSettings>(EMPTY_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (platformSettings) {
      setSettings((current) =>
        JSON.stringify(current) === JSON.stringify(platformSettings) ? current : platformSettings,
      );
    }
  }, [platformSettings]);

  const loadSettings = useCallback(async () => {
    await refreshPlatformSettings();
  }, [refreshPlatformSettings]);

  function updateField<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await updatePlatformSettings({
        default_profit_margin_percent: settings.default_profit_margin_percent,
        platform_commission_percent: settings.platform_commission_percent,
        affiliate_referral_fee_percent: settings.affiliate_referral_fee_percent,
      });
      setSettings(result.settings);
      useAdminPortalStore.getState().setPlatformSettings(result.settings);
      toast.success(result.message);
    } catch (error) {
      showError(error, "Unable to save platform settings.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <PortalPageShell title="Platform Settings">
        <div className="provider-dash-card px-6 py-12 text-center text-sm text-deep-teal/50">
          Loading platform settings…
        </div>
      </PortalPageShell>
    );
  }

  return (
    <PortalPageShell
      title="Platform Settings"
      subtitle={
        settings.updated_at
          ? `Commission defaults and affiliate profit margins · Last updated ${new Date(settings.updated_at).toLocaleString()}`
          : "Commission defaults and affiliate profit margins"
      }
    >
      <div className="provider-dash-card">
        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <h2 className="text-sm font-light text-deep-teal">Commission & Fees</h2>
            <p className="mt-1 text-sm text-deep-teal/60">
              Default profit margin is applied automatically when you create a new main affiliate.
              Per-affiliate overrides remain available on the Affiliates page.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={authLabelClassName}>Default profit margin (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={settings.default_profit_margin_percent}
                onChange={(e) =>
                  updateField("default_profit_margin_percent", Number(e.target.value))
                }
                className={authInputClassName}
              />
            </div>
            <div>
              <label className={authLabelClassName}>Platform commission (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={settings.platform_commission_percent}
                onChange={(e) =>
                  updateField("platform_commission_percent", Number(e.target.value))
                }
                className={authInputClassName}
              />
            </div>
            <div>
              <label className={authLabelClassName}>Affiliate referral fee (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={settings.affiliate_referral_fee_percent}
                onChange={(e) =>
                  updateField("affiliate_referral_fee_percent", Number(e.target.value))
                }
                className={authInputClassName}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => void handleSave()}
            className={toolbarBtnPrimaryClass}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </PortalPageShell>
  );
}
