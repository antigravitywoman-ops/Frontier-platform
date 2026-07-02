"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { LOGIN_PATH, PORTAL_PATHS } from "@/lib/auth/constants";

export function PortalAuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (isLoading || redirectingRef.current) return;

    if (!session) {
      redirectingRef.current = true;
      window.location.replace(LOGIN_PATH);
      return;
    }

    const expectedPortal = PORTAL_PATHS[session.role];
    if (!pathname.startsWith(expectedPortal)) {
      router.replace(expectedPortal);
    }
  }, [isLoading, session, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-pure-white text-deep-teal">
        Loading portal…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-pure-white text-deep-teal">
        Redirecting to sign in…
      </div>
    );
  }

  const expectedPortal = PORTAL_PATHS[session.role];
  if (!pathname.startsWith(expectedPortal)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-pure-white text-deep-teal">
        Redirecting…
      </div>
    );
  }

  return children;
}
