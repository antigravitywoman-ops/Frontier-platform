"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import {
  AuthCard,
  AuthShell,
  authGlassDescriptionClassName,
  authGlassDisclaimerClassName,
  authGlassEyebrowClassName,
  authGlassInputClassName,
  authGlassLabelClassName,
  authGlassTitleClassName,
  glassPrimaryButtonClassName,
  glassSecondaryButtonClassName,
} from "@/components/auth/AuthShell";
import { DEFAULT_LOGIN_ROLES, RoleToggle } from "@/components/auth/RoleToggle";
import { useAuth } from "@/context/AuthProvider";
import { OtpRequiredError } from "@/lib/auth/api";
import { storePendingLogin } from "@/lib/auth/storage";
import type { UserRole } from "@/lib/auth/types";
import { showError, toast } from "@/lib/toast";

type LoginFormProps = {
  fixedRole?: Extract<UserRole, "admin" | "affiliate" | "doctor">;
};

const ROLE_SPECIFIC_HEADINGS: Record<
  Extract<UserRole, "admin" | "affiliate" | "doctor" | "patient">,
  { title: string; description: string }
> = {
  doctor: {
    title: "Doctor sign in",
    description: "Sign in to manage your clinic, patients, and prescriptions.",
  },
  patient: {
    title: "Patient sign in",
    description: "Sign in to view orders, prescriptions, and your care portal.",
  },
  admin: {
    title: "Admin sign in",
    description: "Sign in to manage platform inventory, clinics, and users.",
  },
  affiliate: {
    title: "Affiliate sign in",
    description: "Sign in to manage referrals, commissions, and sub-affiliates.",
  },
};

function getLoginHeading(
  role: UserRole,
  fixedRole?: Extract<UserRole, "admin" | "affiliate" | "doctor">,
) {
  const effectiveRole = fixedRole ?? role;

  if (
    effectiveRole === "admin" ||
    effectiveRole === "affiliate" ||
    effectiveRole === "doctor" ||
    effectiveRole === "patient"
  ) {
    return ROLE_SPECIFIC_HEADINGS[effectiveRole];
  }

  return ROLE_SPECIFIC_HEADINGS.doctor;
}

const ROLE_QUERY_VALUES = ["admin", "affiliate", "doctor", "patient"] as const;

function roleFromPathname(
  pathname: string,
): Extract<UserRole, "admin" | "affiliate"> | undefined {
  if (pathname === "/login/admin") return "admin";
  if (pathname === "/login/affiliate") return "affiliate";
  return undefined;
}

function roleFromSearchParams(
  searchParams: ReturnType<typeof useSearchParams>,
): UserRole | undefined {
  const queryRole = searchParams.get("role");
  if (queryRole && ROLE_QUERY_VALUES.includes(queryRole as (typeof ROLE_QUERY_VALUES)[number])) {
    return queryRole as UserRole;
  }
  return undefined;
}

export function LoginForm({ fixedRole }: LoginFormProps = {}) {
  const { login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resolvedFixedRole = fixedRole ?? roleFromPathname(pathname);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(
    () => resolvedFixedRole ?? roleFromSearchParams(searchParams) ?? "doctor",
  );
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      toast.success("Email verified. You can sign in now.");
    }

    if (resolvedFixedRole) {
      setRole(resolvedFixedRole);
      return;
    }

    const queryRole = roleFromSearchParams(searchParams);
    if (queryRole) {
      setRole(queryRole);
    }
  }, [searchParams, resolvedFixedRole]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Signing in…");

    try {
      await login({ email, password, role, rememberMe });
      toast.dismiss(toastId);
      toast.success("Welcome back.");
    } catch (error) {
      toast.dismiss(toastId);

      if (error instanceof OtpRequiredError) {
        storePendingLogin({ email, password, role, rememberMe });
        toast.info("Enter the verification code sent to your email.");
        const verifyUrl = new URL("/login/verify-otp", window.location.origin);
        verifyUrl.searchParams.set("email", error.email);
        verifyUrl.searchParams.set("role", role);
        startTransition(() => {
          router.push(`${verifyUrl.pathname}${verifyUrl.search}`);
        });
        return;
      }

      showError(error, "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const heading = getLoginHeading(role, resolvedFixedRole);
  const roleToggleRoles = resolvedFixedRole ? [resolvedFixedRole] : DEFAULT_LOGIN_ROLES;

  return (
    <AuthShell background="login" disableAnimation>
      <AuthCard variant="glass">
        <header className="mb-8 text-center">
          <p className={authGlassEyebrowClassName}>Sign in</p>
          <h1 className={authGlassTitleClassName}>{heading.title}</h1>
          <p className={`${authGlassDescriptionClassName} mx-auto max-w-md text-balance`}>
            {heading.description}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className={authGlassLabelClassName}>
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.com"
              className={authGlassInputClassName}
            />
          </div>

          <div>
            <label htmlFor="password" className={authGlassLabelClassName}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${authGlassInputClassName} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pure-white/55 transition-colors hover:text-pure-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Eye className="size-5" strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <RoleToggle
            value={role}
            onChange={resolvedFixedRole ? () => {} : setRole}
            roles={roleToggleRoles}
            appearance="glass"
          />

          <div className="space-y-4 pt-1">
            <label className="flex cursor-pointer items-center gap-3 font-sans text-sm font-normal text-pure-white/78">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-pure-white/30 bg-pure-white/10 text-pure-white focus:ring-pure-white/25"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${glassPrimaryButtonClassName}`}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link href="/" className={glassSecondaryButtonClassName}>
            Back to home
          </Link>
          <Link href="/apply" className={glassSecondaryButtonClassName}>
            Apply as clinic
          </Link>
        </div>

        <p className={authGlassDisclaimerClassName}>
          Practitioner access requires verified NPI credentials. Unauthorized access is
          prohibited.
        </p>
      </AuthCard>
    </AuthShell>
  );
}
