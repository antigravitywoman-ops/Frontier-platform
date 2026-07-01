"use client";

import Link from "next/link";
import { frontierSidebarIcons } from "@/components/icons/frontier/frontier-sidebar-icons";
import { AdminCategoriesPanel } from "@/components/portal/admin/catalog/AdminCategoriesPanel";
import { AdminProductList } from "@/components/portal/admin/products/AdminProductList";
import { PortalPageShell } from "@/components/portal/shared/PortalPageShell";
import {
  TOOLBAR_ICON_SIZE,
  toolbarBtnClass,
  toolbarBtnPrimaryClass,
} from "@/components/portal/shared/PortalPageToolbar";

const CATALOG_ACTIONS = [
  {
    href: "/portal/admin/products/new",
    label: "Add Product",
    icon: frontierSidebarIcons.packagePlus,
    primary: true,
  },
  {
    href: "/portal/admin/products/import",
    label: "Bulk Import",
    icon: frontierSidebarIcons.plus,
    primary: false,
  },
  {
    href: "/portal/admin/catalog/stock",
    label: "Stock Management",
    icon: frontierSidebarIcons.warehouse,
    primary: false,
  },
] as const;

export function AdminCatalogPage() {
  return (
    <PortalPageShell
      title="Catalog"
      actions={
        <>
          {CATALOG_ACTIONS.map(({ href, label, icon: Icon, primary }) => (
            <Link
              key={href}
              href={href}
              className={primary ? toolbarBtnPrimaryClass : toolbarBtnClass}
            >
              <Icon size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <AdminCategoriesPanel />
        <AdminProductList />
      </div>
    </PortalPageShell>
  );
}
