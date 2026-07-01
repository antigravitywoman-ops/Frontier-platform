"use client";

import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ICON_SIZE_MD } from "@/components/icons/frontier";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import {
  FloatingIconButton,
  FloatingIconLink,
  SIDEBAR_WIDTH_TRANSITION_MS,
  useIsLgUp,
} from "@/components/portal/shared/FloatingIconAction";
import { PortalSidebarBubble } from "@/components/portal/shared/PortalSidebarBubble";
import { PortalOnboardingHeaderStrip } from "@/components/portal/shared/PortalOnboardingHeaderStrip";
import {
  PortalUserMenu,
  type PortalUserMenuConfig,
} from "@/components/portal/shared/PortalUserMenu";
import {
  PortalTopBarBrand,
  type PortalTopBarBrandConfig,
} from "@/components/portal/shared/PortalTopBarBrand";
import { Tooltip } from "@/components/ui/Tippy";
import { useAuth } from "@/context/AuthProvider";
import { useRoleOnboarding } from "@/lib/hooks/use-role-onboarding";
import { navTourId } from "@/lib/onboarding/tour-targets";
import type { OnboardingRole } from "@/lib/onboarding/types";
import type { FrontierIconComponent } from "@/lib/icons/types";

const SIDEBAR_EXPANDED_STORAGE_KEY = "frontier-portal-sidebar-expanded";

export type SidebarLink = {
  href: string;
  label: string;
  icon: FrontierIconComponent;
  exact?: boolean;
  badge?: number;
};

type PortalSidebarLayoutProps = {
  links: readonly SidebarLink[];
  children: React.ReactNode;
  onboardingRole?: OnboardingRole;
  onboardingFilterStepIds?: string[];
  userMenu?: PortalUserMenuConfig;
  topBarBrand?: PortalTopBarBrandConfig;
};

function isLinkActive(pathname: string, href: string, exact?: boolean) {
  if (href === "/portal/patient") {
    return pathname === href || pathname === "/portal/patient/pay";
  }
  if (exact) return pathname === href;
  if (href === "/portal/admin/wms") {
    return pathname === href || pathname.startsWith("/portal/admin/wms/");
  }
  if (href === "/portal/admin/catalog") {
    return (
      pathname === href ||
      pathname.startsWith("/portal/admin/catalog/") ||
      pathname.startsWith("/portal/admin/products/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function PortalLayoutHeaderBase({
  hideHeaderTitle,
  activeLinkLabel,
  onOpenMobileNav,
  hideDesktopHeader,
  onboardingStrip,
  homeHref,
  onLogout,
  userMenu,
  topBarBrand,
}: {
  hideHeaderTitle: boolean;
  activeLinkLabel: string;
  onOpenMobileNav: () => void;
  hideDesktopHeader: boolean;
  onboardingStrip?: React.ReactNode;
  homeHref: string;
  onLogout: () => void;
  userMenu?: PortalUserMenuConfig;
  topBarBrand?: PortalTopBarBrandConfig;
}) {
  const hideDesktopToolbar = hideHeaderTitle;

  return (
    <header
      className={`sticky top-0 z-30 bg-pure-white/95 backdrop-blur-sm ${
        hideDesktopHeader ? "lg:hidden" : hideHeaderTitle ? "lg:border-b-0 lg:bg-transparent lg:backdrop-blur-none" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${
          hideHeaderTitle ? "py-2.5" : "py-3"
        } ${hideDesktopToolbar ? "lg:hidden" : ""}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="rounded-lg border border-deep-teal/15 p-2 text-deep-teal transition-colors hover:border-deep-teal/25 hover:bg-deep-teal/[0.04] active:scale-95 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={false}
          >
            <frontierSidebarIcons.menu size={ICON_SIZE_MD} aria-hidden />
          </button>
          {!hideHeaderTitle ? (
            <h1 className="truncate font-sans text-xl font-extrabold tracking-[-0.01em] text-deep-teal sm:text-2xl">
              {activeLinkLabel}
            </h1>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {userMenu ? (
            <PortalUserMenu {...userMenu} onSignOut={onLogout} className="lg:hidden" />
          ) : (
            <FloatingIconButton
              label="Sign out"
              icon={frontierSidebarIcons.logOut}
              onClick={onLogout}
              tone="surface"
              className="lg:hidden"
            />
          )}
          <PortalTopBarBrand
            homeHref={homeHref}
            variant="mobile"
            priority
            logoUrl={topBarBrand?.logoUrl}
            clinicName={topBarBrand?.clinicName}
            showPoweredBy={topBarBrand?.showPoweredBy}
          />
        </div>
      </div>
      {onboardingStrip}
    </header>
  );
}

function PortalLayoutHeaderWithOnboarding({
  hideHeaderTitle,
  activeLinkLabel,
  onOpenMobileNav,
  onboardingRole,
  onboardingFilterStepIds,
  homeHref,
  onLogout,
  userMenu,
  topBarBrand,
}: {
  hideHeaderTitle: boolean;
  activeLinkLabel: string;
  onOpenMobileNav: () => void;
  onboardingRole: OnboardingRole;
  onboardingFilterStepIds?: string[];
  homeHref: string;
  onLogout: () => void;
  userMenu?: PortalUserMenuConfig;
  topBarBrand?: PortalTopBarBrandConfig;
}) {
  const onboarding = useRoleOnboarding(onboardingRole, onboardingFilterStepIds);
  const showOnboardingStrip = onboarding.isVisible && onboarding.progressSteps.length > 0;

  return (
    <PortalLayoutHeaderBase
      hideHeaderTitle={hideHeaderTitle}
      activeLinkLabel={activeLinkLabel}
      onOpenMobileNav={onOpenMobileNav}
      hideDesktopHeader={hideHeaderTitle && !showOnboardingStrip}
      homeHref={homeHref}
      onLogout={onLogout}
      userMenu={userMenu}
      topBarBrand={topBarBrand}
      onboardingStrip={
        <PortalOnboardingHeaderStrip role={onboardingRole} filterStepIds={onboardingFilterStepIds} />
      }
    />
  );
}

function PortalLayoutHeader({
  hideHeaderTitle,
  activeLinkLabel,
  onOpenMobileNav,
  onboardingRole,
  onboardingFilterStepIds,
  homeHref,
  onLogout,
  userMenu,
  topBarBrand,
}: {
  hideHeaderTitle: boolean;
  activeLinkLabel: string;
  onOpenMobileNav: () => void;
  onboardingRole?: OnboardingRole;
  onboardingFilterStepIds?: string[];
  homeHref: string;
  onLogout: () => void;
  userMenu?: PortalUserMenuConfig;
  topBarBrand?: PortalTopBarBrandConfig;
}) {
  if (onboardingRole) {
    return (
      <PortalLayoutHeaderWithOnboarding
        hideHeaderTitle={hideHeaderTitle}
        activeLinkLabel={activeLinkLabel}
        onOpenMobileNav={onOpenMobileNav}
        onboardingRole={onboardingRole}
        onboardingFilterStepIds={onboardingFilterStepIds}
        homeHref={homeHref}
        onLogout={onLogout}
        userMenu={userMenu}
        topBarBrand={topBarBrand}
      />
    );
  }

  return (
    <PortalLayoutHeaderBase
      hideHeaderTitle={hideHeaderTitle}
      activeLinkLabel={activeLinkLabel}
      onOpenMobileNav={onOpenMobileNav}
      hideDesktopHeader={hideHeaderTitle}
      homeHref={homeHref}
      onLogout={onLogout}
      userMenu={userMenu}
      topBarBrand={topBarBrand}
    />
  );
}

function PortalTopActions({
  homeHref,
  userMenu,
  onLogout,
  topBarBrand,
}: {
  homeHref: string;
  userMenu?: PortalUserMenuConfig;
  onLogout: () => void;
  topBarBrand?: PortalTopBarBrandConfig;
}) {
  const [scrollEdge, setScrollEdge] = useState<"top" | "scrolled">("top");

  useEffect(() => {
    const updateScrollEdge = () => {
      setScrollEdge(window.scrollY > 6 ? "scrolled" : "top");
    };

    updateScrollEdge();
    window.addEventListener("scroll", updateScrollEdge, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollEdge);
  }, []);

  return (
    <header
      className="portal-top-bar hidden lg:block"
      data-scroll-edge={scrollEdge}
    >
      <div className="portal-top-bar-inner">
        <PortalTopBarBrand
          homeHref={homeHref}
          priority
          logoUrl={topBarBrand?.logoUrl}
          clinicName={topBarBrand?.clinicName}
          showPoweredBy={topBarBrand?.showPoweredBy}
        />

        <div className="portal-top-bar-actions">
          {userMenu ? (
            <PortalUserMenu {...userMenu} onSignOut={onLogout} />
          ) : (
            <button type="button" onClick={onLogout} className="portal-top-bar-signout">
              <span>Sign out</span>
              <frontierSidebarIcons.logOut
                size={ICON_SIZE_MD}
                className="portal-top-bar-signout-icon"
                aria-hidden
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export const PortalSidebarLayout = memo(function PortalSidebarLayout({
  links,
  children,
  onboardingRole,
  onboardingFilterStepIds,
  userMenu,
  topBarBrand,
}: PortalSidebarLayoutProps) {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarPillShape, setSidebarPillShape] = useState(false);
  const [sidebarTransitioning, setSidebarTransitioning] = useState(false);
  const [sidebarActiveReady, setSidebarActiveReady] = useState(true);
  const prevSidebarExpandedRef = useRef(sidebarExpanded);
  const reduceMotion = useReducedMotion();
  const isLgUp = useIsLgUp();

  const openMobileNav = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileOpen || isLgUp) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, isLgUp]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_EXPANDED_STORAGE_KEY);
      if (stored !== null) {
        const expanded = stored === "true";
        setSidebarExpanded(expanded);
        setSidebarPillShape(!expanded);
        setSidebarActiveReady(expanded);
        prevSidebarExpandedRef.current = expanded;
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isLgUp) return;

    const wasExpanded = prevSidebarExpandedRef.current;
    prevSidebarExpandedRef.current = sidebarExpanded;

    if (sidebarExpanded === wasExpanded) return;

    if (reduceMotion) {
      setSidebarTransitioning(false);
      setSidebarPillShape(!sidebarExpanded);
      setSidebarActiveReady(sidebarExpanded);
      return;
    }

    setSidebarTransitioning(true);
    setSidebarActiveReady(false);

    if (sidebarExpanded) {
      setSidebarPillShape(false);
      return;
    }

    setSidebarPillShape(false);
  }, [sidebarExpanded, isLgUp]);

  const handleSidebarWidthTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLElement>) => {
      if (!isLgUp || event.propertyName !== "width") return;
      if (event.target !== event.currentTarget) return;

      setSidebarTransitioning(false);

      if (!sidebarExpanded) {
        setSidebarPillShape(true);
      }
    },
    [isLgUp, sidebarExpanded],
  );

  const sidebarContentExpanded = sidebarExpanded || sidebarTransitioning;
  const sidebarFullyCollapsed = !sidebarExpanded && !sidebarTransitioning;

  const handleSidebarActiveReady = useCallback(() => {
    if (sidebarExpanded && !sidebarTransitioning) {
      setSidebarActiveReady(true);
    }
  }, [sidebarExpanded, sidebarTransitioning]);

  useEffect(() => {
    if (!isLgUp) return;
    if (sidebarTransitioning || !sidebarExpanded) {
      setSidebarActiveReady(false);
    }
  }, [isLgUp, sidebarExpanded, sidebarTransitioning]);

  useEffect(() => {
    if (!isLgUp || reduceMotion) return;

    if (sidebarTransitioning) {
      const fallback = window.setTimeout(() => {
        setSidebarTransitioning(false);
        if (!sidebarExpanded) {
          setSidebarPillShape(true);
        }
      }, SIDEBAR_WIDTH_TRANSITION_MS + 64);
      return () => window.clearTimeout(fallback);
    }
  }, [isLgUp, reduceMotion, sidebarExpanded, sidebarTransitioning]);

  const toggleSidebarExpanded = useCallback(() => {
    setSidebarTransitioning(true);
    setSidebarActiveReady(false);
    setSidebarExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_EXPANDED_STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    function openSidebarForTour() {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        setMobileOpen(true);
      }
    }

    window.addEventListener("frontier:joyride-nav-step", openSidebarForTour);
    return () => window.removeEventListener("frontier:joyride-nav-step", openSidebarForTour);
  }, []);

  if (isLoading) {
    return (
      <div className="portal-shell flex min-h-dvh items-center justify-center text-deep-teal">
        Loading portal…
      </div>
    );
  }

  const activeLink = links.find((link) => isLinkActive(pathname, link.href, link.exact));
  const activeIndex = links.findIndex((link) => isLinkActive(pathname, link.href, link.exact));
  const homeHref = links[0]?.href ?? "/";
  const hideHeaderTitle = pathname.startsWith("/portal/");
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveIndexRef = useRef(activeIndex);
  const [snapBubble, setSnapBubble] = useState(false);

  useEffect(() => {
    const prevIndex = prevActiveIndexRef.current;
    if (prevIndex === activeIndex) return;

    const indexDistance = Math.abs(activeIndex - prevIndex);
    const nav = navRef.current;
    const prevItem = itemRefs.current[prevIndex];
    const nextItem = itemRefs.current[activeIndex];

    let pixelDistance = indexDistance * 36;
    if (nav && prevItem && nextItem) {
      const navRect = nav.getBoundingClientRect();
      const prevY =
        prevItem.getBoundingClientRect().top -
        navRect.top +
        prevItem.getBoundingClientRect().height / 2;
      const nextY =
        nextItem.getBoundingClientRect().top -
        navRect.top +
        nextItem.getBoundingClientRect().height / 2;
      pixelDistance = Math.abs(nextY - prevY);
    }

    setSnapBubble(indexDistance > 2 || pixelDistance > 88);
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  const navItemVariants = {
    hidden: { opacity: 0, x: -18 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            stiffness: 420,
            damping: 32,
            mass: 0.88,
            delay: isLgUp ? 0 : index * 0.05 + 0.08,
          },
    }),
  };

  const mobileNavVariants = {
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  };

  const sidebarSlideTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.92 };

  return (
    <div
      className="portal-shell min-h-dvh"
      data-sidebar-expanded={sidebarExpanded ? "true" : "false"}
    >
      <PortalTopActions
        homeHref={homeHref}
        userMenu={userMenu}
        onLogout={logout}
        topBarBrand={topBarBrand}
      />

      <div className="portal-top-bar-spacer hidden shrink-0 lg:block" aria-hidden="true" />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-deep-teal/40 backdrop-blur-[3px] lg:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={closeMobileNav}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        data-expanded={sidebarExpanded ? "true" : "false"}
        data-transitioning={sidebarTransitioning ? "true" : "false"}
        className={`portal-sidebar-aside fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh w-[min(18rem,100vw)] flex-col bg-deep-teal shadow-[6px_0_36px_rgba(1,26,36,0.28)] ${
          !mobileOpen && !isLgUp ? "pointer-events-none" : ""
        }`}
        onTransitionEnd={handleSidebarWidthTransitionEnd}
        initial={false}
        animate={{
          x: isLgUp || reduceMotion ? 0 : mobileOpen ? 0 : "-100%",
        }}
        transition={isLgUp ? { duration: 0 } : sidebarSlideTransition}
      >
        <motion.nav
          ref={navRef}
          data-expanded={sidebarContentExpanded ? "true" : "false"}
          data-active-ready={sidebarActiveReady ? "true" : "false"}
          data-pill={sidebarPillShape && sidebarFullyCollapsed ? "true" : "false"}
          data-transitioning={sidebarTransitioning ? "true" : "false"}
          className={`portal-sidebar-rail relative flex h-full min-h-0 w-full flex-col overflow-x-hidden px-3 py-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] [scrollbar-width:none] lg:h-auto lg:w-full lg:flex-none lg:gap-0 lg:py-2 [&::-webkit-scrollbar]:hidden ${
            sidebarTransitioning
              ? "overflow-hidden lg:overflow-hidden"
              : "overflow-y-auto lg:overflow-y-auto"
          } ${
            sidebarContentExpanded
              ? "lg:items-stretch lg:px-1.5"
              : "lg:items-center lg:gap-0.5 lg:px-1 lg:py-2"
          }`}
          aria-label="Portal navigation"
          data-tour="portal-nav"
          initial={false}
          animate={isLgUp ? undefined : mobileOpen ? "open" : "closed"}
          variants={isLgUp ? undefined : mobileNavVariants}
        >
          {links.map((link, index) => {
            const active = isLinkActive(pathname, link.href, link.exact);

            return (
              <motion.div
                key={link.href}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className={`relative flex w-full overflow-visible ${
                  sidebarContentExpanded ? "justify-start" : "justify-center"
                }`}
                custom={index}
                initial={false}
                animate={
                  isLgUp
                    ? { opacity: 1, x: 0 }
                    : mobileOpen
                      ? "visible"
                      : "hidden"
                }
                variants={navItemVariants}
              >
                <FloatingIconLink
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  active={active}
                  badge={link.badge}
                  slidingActive
                  snapBubble={snapBubble}
                  expanded={sidebarContentExpanded}
                  slidingExpanded={sidebarContentExpanded}
                  collapsedTooltips={sidebarFullyCollapsed && sidebarPillShape}
                  onClick={closeMobileNav}
                  data-tour={navTourId(link.href)}
                />
              </motion.div>
            );
          })}
          <PortalSidebarBubble
            navRef={navRef}
            itemRefs={itemRefs}
            activeIndex={activeIndex}
            expanded={sidebarContentExpanded}
            layoutTransitioning={sidebarTransitioning}
            sidebarExpanded={sidebarExpanded}
            onActiveReady={handleSidebarActiveReady}
          />

          <div
            className={`hidden w-full lg:block lg:flex-none ${
              sidebarContentExpanded ? "mt-auto pt-1" : "mt-1.5"
            }`}
          >
            <Tooltip content={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}>
              <motion.button
                type="button"
                onClick={toggleSidebarExpanded}
                aria-expanded={sidebarExpanded}
                aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.02, backgroundColor: "rgba(255,255,255,0.07)" }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={{ type: "spring", stiffness: 520, damping: 28, mass: 0.82 }}
                className={`portal-sidebar-expand-toggle flex w-full items-center rounded-lg border border-transparent text-pure-white/70 transition-colors hover:border-white/10 hover:text-pure-white ${
                  sidebarContentExpanded ? "gap-2 px-2 py-1.5" : "justify-center px-1 py-1"
                }`}
              >
                <CaretRight
                  className={`size-4 shrink-0 transition-transform duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    sidebarContentExpanded ? "rotate-180" : ""
                  }`}
                  weight="light"
                  aria-hidden
                />
                <span
                  className={`truncate text-xs font-medium transition-[opacity,max-width] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    sidebarContentExpanded
                      ? "max-w-[5rem] opacity-100"
                      : "max-w-0 overflow-hidden opacity-0"
                  }`}
                >
                  Collapse
                </span>
              </motion.button>
            </Tooltip>
          </div>
        </motion.nav>
      </motion.aside>

      <div className="portal-main-column relative z-0 flex min-h-dvh min-w-0 flex-col">
        <PortalLayoutHeader
          hideHeaderTitle={hideHeaderTitle}
          activeLinkLabel={activeLink?.label ?? "Dashboard"}
          onOpenMobileNav={openMobileNav}
          onboardingRole={onboardingRole}
          onboardingFilterStepIds={onboardingFilterStepIds}
          homeHref={homeHref}
          onLogout={logout}
          userMenu={userMenu}
          topBarBrand={topBarBrand}
        />

        <main
          className="flex-1 px-4 pb-5 pt-1 sm:px-6 lg:box-border lg:px-0 lg:pb-6"
          data-tour="portal-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
});
