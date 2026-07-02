import type { UserRole } from "@/lib/auth/types";

export const AUTH_TOKEN_COOKIE = "frontier-auth-token";
export const AUTH_ROLE_COOKIE = "frontier-auth-role";
export const AUTH_STORAGE_KEY = "frontier-auth-session";
export const AUTH_REMEMBER_KEY = "frontier-auth-remember";
export const PENDING_LOGIN_KEY = "frontier-pending-login";
export const RESET_TOKEN_STORAGE_KEY = "frontier-reset-token";

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
export const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
export const REFRESH_INTERVAL_MS = 60 * 1000;

export const PORTAL_PATHS = {
  affiliate: "/portal/affiliate",
  admin: "/portal/admin",
  patient: "/portal/patient",
  doctor: "/portal/doctor",
} as const;

export const LOGIN_PATH = "/login";

export const LOGIN_PATHS = {
  affiliate: `${LOGIN_PATH}?role=affiliate`,
  admin: `${LOGIN_PATH}?role=admin`,
  patient: `${LOGIN_PATH}?role=patient`,
  doctor: LOGIN_PATH,
} as const;

export const PUBLIC_ROUTES = [
  "/",
  LOGIN_PATH,
  "/login/send-otp",
  "/login/verify-otp",
  "/forgot-password",
  "/reset-password",
  "/set-password",
  "/accept-invitation",
  "/accept-clinic-invitation",
  "/apply",
  "/apply/submitted",
] as const;

export function buildLoginUrl(options?: { role?: UserRole; redirect?: string }) {
  const params = new URLSearchParams();

  if (options?.role && options.role !== "doctor") {
    params.set("role", options.role);
  }

  if (options?.redirect) {
    params.set("redirect", options.redirect);
  }

  const query = params.toString();
  return query ? `${LOGIN_PATH}?${query}` : LOGIN_PATH;
}

export function loginPathForRole(role: keyof typeof LOGIN_PATHS) {
  return LOGIN_PATHS[role];
}

export function loginPathForPortalPath(pathname: string) {
  if (pathname.startsWith("/portal/patient")) return LOGIN_PATHS.patient;
  if (pathname.startsWith("/portal/admin")) return LOGIN_PATHS.admin;
  if (pathname.startsWith("/portal/affiliate")) return LOGIN_PATHS.affiliate;
  return LOGIN_PATHS.doctor;
}

export function isLoginRoute(pathname: string) {
  return (
    pathname === LOGIN_PATH ||
    pathname === "/login/send-otp" ||
    pathname === "/login/verify-otp"
  );
}

export function isLegacyLoginRoute(pathname: string) {
  return pathname === "/login/admin" || pathname === "/login/affiliate";
}
