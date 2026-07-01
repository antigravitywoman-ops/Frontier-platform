"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { FrontierLogo } from "@/components/FrontierLogo";
import { OnboardCtaLink } from "@/components/landing/OnboardCtaLink";
import { useLandingNavTheme } from "@/hooks/use-landing-nav-theme";

const NAV_LINKS = [
  { href: "#why-frontier", label: "Platform" },
  { href: "#catalog", label: "Catalog" },
  { href: "#coa-certificate", label: "Safety" },
  { href: "#faqs", label: "Compliance" },
] as const;

const CLINIC_ONBOARDING_HREF = "/apply";
const CLINIC_ONBOARDING_LABEL = "Clinic onboarding";

type ApplyNavbarProps = {
  /** Pin navbar to viewport (landing page) */
  fixed?: boolean;
};

export function ApplyNavbar({ fixed = false }: ApplyNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(NAV_LINKS[0].href);
  const navTheme = useLandingNavTheme(fixed);
  const isLight = navTheme === "light";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`${fixed ? "fixed" : "absolute"} inset-x-0 top-4 z-50 w-full shrink-0 px-4 transition-all duration-300 sm:px-8`}
    >
      <div
        className={`mx-auto flex h-[72px] max-w-[1200px] items-center justify-between rounded-full border px-4 shadow-[0_8px_32px_rgba(1,26,36,0.08)] backdrop-blur-2xl transition-colors duration-300 sm:h-[76px] sm:px-6 ${
          isLight
            ? "border-deep-teal/[0.08] bg-pure-white/45"
            : "border-white/[0.08] bg-white/[0.04]"
        }`}
      >
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" aria-label="FrontierBioMed" onClick={closeMenu} className="shrink-0">
            <FrontierLogo
              variant={isLight ? "black" : "white"}
              priority
              className="!h-8 w-auto object-contain object-left transition-opacity hover:opacity-80 sm:!h-9 lg:!h-10"
            />
          </Link>
        </div>

        <nav
          className="hidden flex-1 items-center justify-center md:flex"
          aria-label="Main"
        >
          <div
            className={`flex items-center gap-1 rounded-full border p-1.5 backdrop-blur-xl transition-colors duration-300 ${
              isLight
                ? "border-deep-teal/[0.08] bg-white/35"
                : "border-white/[0.08] bg-black/10"
            }`}
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveSection(link.href)}
                  className={`rounded-full px-5 py-2 text-sm font-normal transition-all duration-300 ${
                    isActive
                      ? isLight
                        ? "border border-deep-teal/12 bg-deep-teal/8 text-deep-teal shadow-sm"
                        : "border border-white/20 bg-white/15 text-white shadow-sm"
                      : isLight
                        ? "border border-transparent text-deep-teal/60 hover:text-deep-teal"
                        : "border border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <Link
            href="/login"
            className={`hidden rounded-full px-4 py-2 text-sm font-normal transition-colors duration-300 sm:inline-flex ${
              isLight
                ? "text-deep-teal/70 hover:text-deep-teal"
                : "text-white/75 hover:text-white"
            }`}
          >
            Sign in
          </Link>

          <OnboardCtaLink
            href={CLINIC_ONBOARDING_HREF}
            label={CLINIC_ONBOARDING_LABEL}
            variant={isLight ? "solid-dark" : "media"}
          />

          <button
            type="button"
            className={`inline-flex size-10 items-center justify-center rounded-full border backdrop-blur-xl transition-colors duration-300 md:hidden ${
              isLight
                ? "border-deep-teal/[0.08] bg-white/35 text-deep-teal hover:bg-white/50"
                : "border-white/[0.08] bg-white/[0.04] text-white hover:bg-white/10"
            }`}
            aria-expanded={menuOpen}
            aria-controls="apply-mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={`mx-auto mt-2 grid max-w-[1200px] transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <nav
          id="apply-mobile-nav"
          className={`overflow-hidden rounded-3xl border shadow-xl backdrop-blur-2xl ${
            isLight
              ? "border-deep-teal/[0.08] bg-pure-white/55"
              : "border-white/[0.08] bg-black/25"
          }`}
        >
          <ul className="space-y-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.href);
                      closeMenu();
                    }}
                    className={`block rounded-xl px-4 py-3 text-center text-sm font-normal transition-colors duration-300 ${
                      isActive
                        ? isLight
                          ? "bg-deep-teal/8 text-deep-teal"
                          : "bg-white/15 text-white"
                        : isLight
                          ? "text-deep-teal/65 hover:bg-surface-muted hover:text-deep-teal"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/login"
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-center text-sm font-normal transition-colors duration-300 ${
                  isLight
                    ? "text-deep-teal/65 hover:bg-surface-muted hover:text-deep-teal"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href={CLINIC_ONBOARDING_HREF}
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-center text-sm font-normal transition-colors duration-300 ${
                  isLight
                    ? "bg-deep-teal/8 text-deep-teal"
                    : "bg-white/15 text-white"
                }`}
              >
                {CLINIC_ONBOARDING_LABEL}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
