import {
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
  isLoginRoute,
  loginPathForPortalPath,
  PORTAL_PATHS,
} from "@/lib/auth/constants";
import type { UserRole } from "@/lib/auth/types";
import { isAccessTokenUsable } from "@/lib/auth/token";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_PREFIXES = [
  "/_next",
  "/fonts",
  "/brand",
  "/assets",
  "/favicon.ico",
  "/icon.png",
];

function isStaticAsset(pathname: string) {
  return (
    STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

function portalForRole(role: UserRole) {
  return PORTAL_PATHS[role];
}

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readAuthFromRequest(request: NextRequest): { role: UserRole } | null {
  const rawToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const role = request.cookies.get(AUTH_ROLE_COOKIE)?.value as UserRole | undefined;

  if (!rawToken || !role || !(role in PORTAL_PATHS)) return null;

  const token = decodeCookieValue(rawToken);
  if (!isAccessTokenUsable(token)) return null;

  return { role };
}

function hasAuthCookies(request: NextRequest) {
  return Boolean(
    request.cookies.get(AUTH_TOKEN_COOKIE)?.value ||
      request.cookies.get(AUTH_ROLE_COOKIE)?.value,
  );
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(AUTH_ROLE_COOKIE, "", { path: "/", maxAge: 0 });
}

function redirectWithOptionalCookieClear(
  request: NextRequest,
  target: URL,
  clearCookies: boolean,
) {
  const response = NextResponse.redirect(target);
  if (clearCookies) clearAuthCookies(response);
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/patient/login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("role", "patient");
    return NextResponse.redirect(loginUrl);
  }

  const auth = readAuthFromRequest(request);
  const isAuthenticated = Boolean(auth);
  const staleAuthCookies = hasAuthCookies(request) && !isAuthenticated;

  if (isAuthenticated && isLoginRoute(pathname)) {
    return NextResponse.redirect(new URL(portalForRole(auth!.role), request.url));
  }

  if (!isAuthenticated && pathname.startsWith("/portal")) {
    const loginUrl = new URL(loginPathForPortalPath(pathname), request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return redirectWithOptionalCookieClear(request, loginUrl, staleAuthCookies);
  }

  if (!isAuthenticated && isLoginRoute(pathname)) {
    if (staleAuthCookies) {
      const response = NextResponse.next();
      clearAuthCookies(response);
      return response;
    }
    return NextResponse.next();
  }

  if (isAuthenticated && auth && pathname.startsWith("/portal")) {
    const expectedPortal = PORTAL_PATHS[auth.role];
    if (!pathname.startsWith(expectedPortal)) {
      return NextResponse.redirect(new URL(expectedPortal, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
