"use client";

import { FrontierStrokeIconShell } from "@/components/icons/frontier/FrontierStrokeIconShell";
import { sidebarLinePaths } from "@/lib/icons/paths/sidebar-line";
import type { FrontierIconComponent, FrontierIconProps } from "@/lib/icons/types";

function createStrokeSidebarIcon(
  paths: (typeof sidebarLinePaths)[keyof typeof sidebarLinePaths],
  displayName: string,
): FrontierIconComponent {
  const Icon = (props: FrontierIconProps) => (
    <FrontierStrokeIconShell paths={paths} {...props} />
  );
  Icon.displayName = displayName;
  return Icon;
}

/** Thin-line sidebar icons — medical dashboard reference style */
export const frontierStrokeSidebarIcons = {
  layoutDashboard: createStrokeSidebarIcon(
    sidebarLinePaths.layoutDashboard,
    "FrontierStrokeLayoutDashboardIcon",
  ),
  layoutGrid: createStrokeSidebarIcon(sidebarLinePaths.layoutGrid, "FrontierStrokeLayoutGridIcon"),
  inventory: createStrokeSidebarIcon(sidebarLinePaths.warehouse, "FrontierStrokeInventoryIcon"),
  myStore: createStrokeSidebarIcon(sidebarLinePaths.shoppingBag, "FrontierStrokeMyStoreIcon"),
  store: createStrokeSidebarIcon(sidebarLinePaths.store, "FrontierStrokeStoreIcon"),
  users: createStrokeSidebarIcon(sidebarLinePaths.users, "FrontierStrokeUsersIcon"),
  package: createStrokeSidebarIcon(sidebarLinePaths.package, "FrontierStrokePackageIcon"),
  shoppingCart: createStrokeSidebarIcon(
    sidebarLinePaths.shoppingCart,
    "FrontierStrokeShoppingCartIcon",
  ),
  calculator: createStrokeSidebarIcon(
    sidebarLinePaths.calculator,
    "FrontierStrokeCalculatorIcon",
  ),
  messageSquare: createStrokeSidebarIcon(
    sidebarLinePaths.messageSquare,
    "FrontierStrokeMessageSquareIcon",
  ),
  usersRound: createStrokeSidebarIcon(
    sidebarLinePaths.usersRound,
    "FrontierStrokeUsersRoundIcon",
  ),
  settings: createStrokeSidebarIcon(sidebarLinePaths.settings, "FrontierStrokeSettingsIcon"),
  helpCircle: createStrokeSidebarIcon(
    sidebarLinePaths.helpCircle,
    "FrontierStrokeHelpCircleIcon",
  ),
  logOut: createStrokeSidebarIcon(sidebarLinePaths.logOut, "FrontierStrokeLogOutIcon"),
  menu: createStrokeSidebarIcon(sidebarLinePaths.menu, "FrontierStrokeMenuIcon"),
  clipboardCheck: createStrokeSidebarIcon(
    sidebarLinePaths.clipboardCheck,
    "FrontierStrokeClipboardCheckIcon",
  ),
  user: createStrokeSidebarIcon(sidebarLinePaths.user, "FrontierStrokeUserIcon"),
  userPlus: createStrokeSidebarIcon(sidebarLinePaths.userPlus, "FrontierStrokeUserPlusIcon"),
  shoppingBag: createStrokeSidebarIcon(
    sidebarLinePaths.shoppingBag,
    "FrontierStrokeShoppingBagIcon",
  ),
  wallet: createStrokeSidebarIcon(sidebarLinePaths.wallet, "FrontierStrokeWalletIcon"),
  handshake: createStrokeSidebarIcon(sidebarLinePaths.handshake, "FrontierStrokeHandshakeIcon"),
  warehouse: createStrokeSidebarIcon(sidebarLinePaths.warehouse, "FrontierStrokeWarehouseIcon"),
  barChart: createStrokeSidebarIcon(sidebarLinePaths.barChart, "FrontierStrokeBarChartIcon"),
  shield: createStrokeSidebarIcon(sidebarLinePaths.shield, "FrontierStrokeShieldIcon"),
  refreshCw: createStrokeSidebarIcon(sidebarLinePaths.refreshCw, "FrontierStrokeRefreshCwIcon"),
  trash2: createStrokeSidebarIcon(sidebarLinePaths.trash2, "FrontierStrokeTrash2Icon"),
  plus: createStrokeSidebarIcon(sidebarLinePaths.plus, "FrontierStrokePlusIcon"),
  chevronDown: createStrokeSidebarIcon(sidebarLinePaths.chevronDown, "FrontierStrokeChevronDownIcon"),
  arrowLeft: createStrokeSidebarIcon(sidebarLinePaths.arrowLeft, "FrontierStrokeArrowLeftIcon"),
  download: createStrokeSidebarIcon(sidebarLinePaths.download, "FrontierStrokeDownloadIcon"),
  search: createStrokeSidebarIcon(sidebarLinePaths.search, "FrontierStrokeSearchIcon"),
  mail: createStrokeSidebarIcon(sidebarLinePaths.mail, "FrontierStrokeMailIcon"),
  send: createStrokeSidebarIcon(sidebarLinePaths.send, "FrontierStrokeSendIcon"),
  folder: createStrokeSidebarIcon(sidebarLinePaths.folder, "FrontierStrokeFolderIcon"),
  building2: createStrokeSidebarIcon(sidebarLinePaths.building2, "FrontierStrokeBuilding2Icon"),
  creditCard: createStrokeSidebarIcon(sidebarLinePaths.creditCard, "FrontierStrokeCreditCardIcon"),
  mapPin: createStrokeSidebarIcon(sidebarLinePaths.mapPin, "FrontierStrokeMapPinIcon"),
  packagePlus: createStrokeSidebarIcon(sidebarLinePaths.packagePlus, "FrontierStrokePackagePlusIcon"),
} as const;
