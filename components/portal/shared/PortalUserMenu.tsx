"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ICON_SIZE_SM } from "@/components/icons/frontier";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import type { FrontierIconComponent } from "@/lib/icons/types";

export type PortalUserMenuItem = {
  href: string;
  label: string;
  icon: FrontierIconComponent;
};

export type PortalUserMenuConfig = {
  displayName: string;
  subtitle?: string;
  items?: PortalUserMenuItem[];
};

type PortalUserMenuProps = PortalUserMenuConfig & {
  onSignOut: () => void;
  className?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

const panelMotion = {
  hidden: { opacity: 0, y: -12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 32, mass: 0.85 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
} as const;

const contentMotion = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
} as const;

const rowMotion = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
} as const;

export function PortalUserMenu({
  displayName,
  subtitle,
  items = [],
  onSignOut,
  className = "",
}: PortalUserMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initials = initialsFromName(displayName);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSignOut() {
    setOpen(false);
    onSignOut();
  }

  const panelAnimation = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: "hidden" as const, animate: "visible" as const, exit: "exit" as const, variants: panelMotion };

  const rowAnimation = reduceMotion
    ? {}
    : { variants: rowMotion, initial: "hidden" as const, animate: "visible" as const, exit: "exit" as const };

  const contentAnimation = reduceMotion
    ? {}
    : { variants: contentMotion, initial: "hidden" as const, animate: "visible" as const, exit: "exit" as const };

  return (
    <div ref={rootRef} className={`portal-user-menu ${className}`.trim()}>
      <button
        type="button"
        className="portal-user-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="portal-top-bar-user-avatar" aria-hidden>
          {initials}
        </span>
        <span className="portal-user-menu-label min-w-0 text-left">
          <span className="portal-top-bar-user-name">{displayName}</span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 22 }}
          className="inline-flex shrink-0"
          aria-hidden
        >
          <frontierSidebarIcons.chevronDown
            size={ICON_SIZE_SM}
            className="text-deep-teal/45"
          />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            className="portal-user-menu-panel"
            role="menu"
            {...panelAnimation}
          >
            <motion.div {...contentAnimation}>
              <motion.div className="portal-user-menu-header" {...rowAnimation}>
                <p className="portal-user-menu-header-name">{displayName}</p>
                {subtitle ? <p className="portal-user-menu-header-subtitle">{subtitle}</p> : null}
              </motion.div>

              {items.length > 0 ? (
                <div className="portal-user-menu-section" role="none">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div key={item.href} {...rowAnimation}>
                        <Link
                          href={item.href}
                          role="menuitem"
                          className="portal-user-menu-item"
                          onClick={() => setOpen(false)}
                        >
                          <Icon size={ICON_SIZE_SM} aria-hidden className="shrink-0 text-deep-teal/55" />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : null}

              <div className="portal-user-menu-section" role="none">
                <motion.div {...rowAnimation}>
                  <button
                    type="button"
                    role="menuitem"
                    className="portal-user-menu-item portal-user-menu-item--danger"
                    onClick={handleSignOut}
                  >
                    <frontierSidebarIcons.logOut
                      size={ICON_SIZE_SM}
                      aria-hidden
                      className="shrink-0"
                    />
                    <span>Sign out</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
