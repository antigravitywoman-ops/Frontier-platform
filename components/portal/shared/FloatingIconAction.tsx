"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useSyncExternalStore } from "react";
import { ICON_SIZE_MD } from "@/components/icons/frontier";
import { Tooltip } from "@/components/ui/Tippy";
import type { FrontierIconComponent } from "@/lib/icons/types";

/** iOS-style spring presets — shared with the sliding active pill */
export const SIDEBAR_SPRING = {
  active: { type: "spring" as const, stiffness: 520, damping: 34, mass: 0.82 },
  press: { type: "spring" as const, stiffness: 620, damping: 26, mass: 0.75 },
  glow: { type: "spring" as const, stiffness: 400, damping: 38, mass: 0.9 },
};

/** Organic bubble morph — adjacent icons; far hops use a damped glide */
export const SIDEBAR_BUBBLE_SPRING = {
  type: "spring" as const,
  stiffness: 340,
  damping: 26,
  mass: 0.95,
};

export function useIsLgUp() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia("(min-width: 1024px)");
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

/** Desktop sliding active pill — styled in globals.css */
export const SIDEBAR_ACTIVE_INDICATOR_CLASS = "portal-sidebar-active-pill";
export const SIDEBAR_MOBILE_BUBBLE_LAYOUT_ID = "portal-sidebar-mobile-bubble";
export const SIDEBAR_WIDTH_TRANSITION_MS = 360;
export const SIDEBAR_LAYOUT_EASE = [0.32, 0.72, 0, 1] as const;

const iconShellBase =
  "portal-sidebar-icon-shell relative flex size-11 shrink-0 items-center justify-center";
const iconShellActiveSidebar =
  "text-pacific-teal lg:rounded-full lg:bg-surface-subtle lg:shadow-[0_2px_10px_rgba(1,26,36,0.12)] lg:ring-1 lg:ring-pacific-teal/18";
const iconShellActiveSidebarAnimated =
  "text-pacific-teal lg:rounded-full lg:bg-transparent lg:shadow-none lg:ring-0";
const iconShellInactiveSidebar =
  "text-pure-white/82 lg:hover:text-pure-white";
const iconShellInactiveSurface =
  "rounded-full border border-deep-teal/10 bg-pure-white text-deep-teal/55 shadow-[0_2px_8px_rgba(1,26,36,0.06)] hover:border-deep-teal/20 hover:text-deep-teal";

function tooltipContent(label: string, Icon: FrontierIconComponent, badge?: number, active?: boolean) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <Icon size={ICON_SIZE_MD} active={active} aria-hidden />
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-pacific-teal text-[10px] font-light text-pure-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </span>
  );
}

function IconShell({
  Icon,
  active,
  badge,
  tone = "sidebar",
  slidingActive = false,
  interactive = false,
  expanded = false,
}: {
  Icon: FrontierIconComponent;
  active?: boolean;
  badge?: number;
  tone?: "sidebar" | "surface";
  slidingActive?: boolean;
  interactive?: boolean;
  expanded?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const useSlidingIndicator = slidingActive && expanded;
  const shellClass =
    tone === "surface"
      ? iconShellInactiveSurface
      : active
        ? useSlidingIndicator
          ? iconShellActiveSidebarAnimated
          : iconShellActiveSidebar
        : iconShellInactiveSidebar;

  const shell = (
    <span className={`${iconShellBase} ${shellClass} ${active ? "is-active" : ""}`}>
      {interactive && !active ? (
        <span
          aria-hidden
          className="portal-sidebar-hover-bloom pointer-events-none absolute inset-0 hidden rounded-full lg:block"
        />
      ) : null}
      <motion.span
        key={active ? "active" : "idle"}
        className="flex items-center justify-center"
        aria-hidden
        initial={
          reduceMotion ? false : active ? { scale: 0.78, opacity: 0.55 } : false
        }
        animate={
          reduceMotion
            ? undefined
            : {
                scale: 1,
                opacity: 1,
              }
        }
        whileHover={
          reduceMotion || !interactive || active
            ? undefined
            : { scale: 1.1, y: -1, opacity: 1 }
        }
        whileTap={reduceMotion || !interactive ? undefined : { scale: 0.86 }}
        transition={
          active && !reduceMotion
            ? { type: "spring", stiffness: 520, damping: 22, mass: 0.72 }
            : SIDEBAR_SPRING.press
        }
      >
        <Icon size={22} active={active} aria-hidden className="portal-sidebar-icon block" />
      </motion.span>
      {badge && badge > 0 ? (
        <motion.span
          className={`absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-pacific-teal text-[9px] font-light text-pure-white ring-2 ${
            tone === "surface" ? "ring-pure-white" : "ring-deep-teal"
          }`}
          initial={false}
          animate={reduceMotion ? undefined : { scale: 1 }}
          whileHover={reduceMotion ? undefined : { scale: 1.12 }}
          transition={SIDEBAR_SPRING.press}
        >
          {badge > 9 ? "9+" : badge}
        </motion.span>
      ) : null}
    </span>
  );

  return shell;
}

function MobileActiveRow({ snapBubble = false }: { snapBubble?: boolean }) {
  const reduceMotion = useReducedMotion();

  if (snapBubble) {
    return (
      <motion.span
        aria-hidden
        className="portal-sidebar-mobile-bubble pointer-events-none absolute inset-0 z-0 rounded-xl lg:hidden"
        initial={reduceMotion ? false : { opacity: 0.55, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 30, mass: 0.85 }
        }
      />
    );
  }

  return (
    <motion.span
      layoutId={SIDEBAR_MOBILE_BUBBLE_LAYOUT_ID}
      aria-hidden
      className="portal-sidebar-mobile-bubble pointer-events-none absolute inset-0 z-0 rounded-xl lg:hidden"
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              layout: SIDEBAR_BUBBLE_SPRING,
              ...SIDEBAR_BUBBLE_SPRING,
            }
      }
      layout
    />
  );
}

type FloatingIconLinkProps = {
  href: string;
  label: string;
  icon: FrontierIconComponent;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
  className?: string;
  slidingActive?: boolean;
  snapBubble?: boolean;
  expanded?: boolean;
  slidingExpanded?: boolean;
  collapsedTooltips?: boolean;
  "data-tour"?: string;
};

export function FloatingIconLink({
  href,
  label,
  icon: Icon,
  active = false,
  badge,
  onClick,
  className = "",
  slidingActive = false,
  snapBubble = false,
  expanded = false,
  slidingExpanded,
  collapsedTooltips = false,
  "data-tour": dataTour,
}: FloatingIconLinkProps) {
  const isDesktop = useIsLgUp();
  const reduceMotion = useReducedMotion();
  const showDesktopLabel = isDesktop && expanded;
  const useSlidingExpanded = slidingExpanded ?? expanded;

  const link = (
    <Link
      href={href}
      data-tour={dataTour}
      onClick={onClick}
      aria-label={showDesktopLabel ? undefined : label}
      aria-current={active ? "page" : undefined}
      className={`portal-sidebar-link group relative z-[2] flex w-full max-w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-[padding,gap] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
        expanded
          ? "lg:min-h-8 lg:justify-start lg:gap-2 lg:rounded-full lg:px-2 lg:py-0.5"
          : "lg:w-auto lg:max-w-none lg:justify-center lg:gap-0 lg:rounded-none lg:px-0 lg:py-0.5"
      } ${className}`}
    >
      {active && !showDesktopLabel ? <MobileActiveRow snapBubble={snapBubble} /> : null}
      <span
        className={`relative z-10 flex min-w-0 flex-1 items-center gap-3 transition-[gap] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          expanded ? "lg:flex-1 lg:items-center lg:justify-start lg:gap-2" : "lg:flex-none lg:justify-center lg:gap-0"
        }`}
      >
        <IconShell
          Icon={Icon}
          active={active}
          badge={badge}
          slidingActive={slidingActive}
          interactive={isDesktop}
          expanded={useSlidingExpanded}
        />
        {isDesktop ? (
          <span
            aria-hidden={!expanded}
            className={`portal-sidebar-link-label truncate text-sm font-medium leading-tight lg:block lg:text-[0.8125rem] lg:transition-[opacity,max-width,margin,color] lg:duration-[360ms] lg:ease-[cubic-bezier(0.32,0.72,0,1)] ${
              expanded
                ? "lg:ml-0 lg:max-w-[10rem] lg:opacity-100"
                : "lg:pointer-events-none lg:ml-0 lg:max-w-0 lg:overflow-hidden lg:opacity-0"
            } ${active && useSlidingExpanded ? "is-active font-semibold" : ""}`}
          >
            {label}
          </span>
        ) : (
          <motion.span
            key={active ? "active" : "idle"}
            className={`portal-sidebar-link-label truncate text-sm font-medium leading-tight ${
              active ? "is-active font-semibold" : ""
            }`}
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {label}
          </motion.span>
        )}
        {badge && badge > 0 ? (
          <span
            className={`ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-pacific-teal text-[10px] font-medium text-pure-white ${
              showDesktopLabel ? "lg:flex" : "lg:hidden"
            }`}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </span>
    </Link>
  );

  if (isDesktop && !expanded && collapsedTooltips) {
    return (
      <Tooltip content={tooltipContent(label, Icon, badge, active)} placement="right">
        {link}
      </Tooltip>
    );
  }

  return link;
}

type FloatingIconButtonProps = {
  label: string;
  icon: FrontierIconComponent;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  tone?: "sidebar" | "surface";
  "aria-label"?: string;
};

export function FloatingIconButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  className = "",
  tone = "sidebar",
  "aria-label": ariaLabel,
}: FloatingIconButtonProps) {
  return (
    <Tooltip content={tooltipContent(label, Icon)} placement={tone === "surface" ? "bottom" : "right"}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        className={`relative flex justify-center py-1 disabled:opacity-50 ${className}`}
      >
        <IconShell Icon={Icon} tone={tone} />
      </button>
    </Tooltip>
  );
}

type FloatingToolbarActionProps = {
  label: string;
  icon: FrontierIconComponent;
  primary?: boolean;
  disabled?: boolean;
} & (
  | { href: string; onClick?: never }
  | { href?: never; onClick: () => void }
);

export function FloatingToolbarAction({
  label,
  icon: Icon,
  primary = false,
  disabled = false,
  href,
  onClick,
}: FloatingToolbarActionProps) {
  const inner = (
    <span
      className={`${iconShellBase} overflow-hidden rounded-full border ${
        primary
          ? "border-deep-teal bg-pure-white text-deep-teal shadow-[0_2px_8px_rgba(1,26,36,0.12)]"
          : "border-deep-teal/10 bg-pure-white text-deep-teal/55 shadow-[0_2px_8px_rgba(1,26,36,0.06)] hover:border-deep-teal/20 hover:text-deep-teal"
      }`}
    >
      <Icon size={ICON_SIZE_MD} active={primary} aria-hidden className="block" />
    </span>
  );

  const wrapperClass = "flex justify-center py-0.5";

  if (href) {
    return (
      <Tooltip content={tooltipContent(label, Icon, undefined, primary)} placement="bottom">
        <Link href={href} aria-label={label} className={wrapperClass}>
          {inner}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={tooltipContent(label, Icon)} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`${wrapperClass} disabled:opacity-50`}
      >
        {inner}
      </button>
    </Tooltip>
  );
}

export function FloatingToolbarActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

export { ICON_SIZE_MD };
