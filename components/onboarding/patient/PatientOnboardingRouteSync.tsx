"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useOnboardingStore } from "@/stores/onboarding-store";

const PATIENT_ROUTE_STEP_MAP: Record<string, string> = {
  "/portal/patient/profile": "complete-profile",
  "/portal/patient/products": "browse-products",
  "/portal/patient/chat": "message-clinic",
};

export function PatientOnboardingRouteSync() {
  const { session } = useAuth();
  const pathname = usePathname();
  const toggleStep = useOnboardingStore((state) => state.toggleStep);

  useEffect(() => {
    if (!session) return;
    const route = pathname.split("?")[0]!;
    const stepId = PATIENT_ROUTE_STEP_MAP[route];
    if (!stepId) return;
    toggleStep(session.userId, "patient", stepId, true);
  }, [session, pathname, toggleStep]);

  return null;
}
