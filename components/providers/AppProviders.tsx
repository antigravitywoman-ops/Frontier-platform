"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { usePatientRequestsStore } from "@/stores/patient-requests-store";

const TOAST_CLASS_NAMES = {
  toast:
    "glass-ios !rounded-2xl border border-pure-white/22 !bg-[#0D717B]/82 text-pure-white shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl",
  title: "text-sm font-medium text-pure-white",
  description: "text-xs text-pure-white/75",
  content: "text-pure-white",
  closeButton:
    "!left-auto !right-2 !top-2 !translate-y-0 border border-pure-white/25 !bg-pure-white/12 !text-pure-white hover:!bg-pure-white/20",
  success: "!border-pure-white/22 !bg-[#0D717B]/82 !text-pure-white",
  error: "!border-pure-white/22 !bg-[#0D717B]/82 !text-pure-white",
  info: "!border-pure-white/22 !bg-[#0D717B]/82 !text-pure-white",
  warning: "!border-pure-white/22 !bg-[#0D717B]/82 !text-pure-white",
  loading: "!border-pure-white/22 !bg-[#0D717B]/82 !text-pure-white",
  icon: "!text-pure-white",
} as const;

function isPortalRoute(pathname: string) {
  return pathname.startsWith("/portal");
}

function PersistStoreHydration() {
  useEffect(() => {
    void useOnboardingStore.persist.rehydrate();
    void usePatientRequestsStore.persist.rehydrate();
  }, []);

  return null;
}

function AppProvidersShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const enableSmoothScroll = !isPortalRoute(pathname);

  return enableSmoothScroll ? <SmoothScroll>{children}</SmoothScroll> : children;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    setRouterReady(true);
  }, []);

  const toastOptions = useMemo(
    () => ({
      classNames: TOAST_CLASS_NAMES,
    }),
    [],
  );

  return (
    <AuthProvider>
      <PersistStoreHydration />
      {routerReady ? <AppProvidersShell>{children}</AppProvidersShell> : children}
      <Toaster
        position="top-center"
        closeButton
        richColors={false}
        theme="dark"
        toastOptions={toastOptions}
      />
    </AuthProvider>
  );
}
