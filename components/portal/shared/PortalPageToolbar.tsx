"use client";

import type { ReactNode } from "react";
import { ICON_SIZE_MD } from "@/components/icons/frontier";
import {
  btnGhostClass,
  btnPrimaryClass,
} from "@/lib/brand/design-system";
import { typePageTitle } from "@/lib/brand/typography";

/** Toolbar action icons — larger than ICON_SIZE_SM for visibility */
export const TOOLBAR_ICON_SIZE = ICON_SIZE_MD;

const toolbarIconSizing = "[&_svg]:shrink-0 [&_img]:shrink-0";

type PortalPageToolbarProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PortalPageToolbar({ title, subtitle, children }: PortalPageToolbarProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-deep-teal/20 bg-pure-white px-4 py-2.5 shadow-[0_2px_12px_rgba(1,26,36,0.08)] sm:px-5">
      <h1 className={`min-w-0 shrink-0 ${typePageTitle}`}>
        {title}
        {subtitle ? (
          <span className="font-light text-deep-teal/50"> · {subtitle}</span>
        ) : null}
      </h1>
      {children ? (
        <>
          <div className="min-w-4 flex-1" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>
        </>
      ) : null}
    </div>
  );
}

export const toolbarBtnClass = `${btnGhostClass} ${toolbarIconSizing}`;

export const toolbarBtnPrimaryClass = `${btnPrimaryClass} portal-toolbar-btn-primary ${toolbarIconSizing}`;
