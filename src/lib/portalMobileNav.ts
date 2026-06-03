import type {
  PortalNavItemConfig,
  PortalNavSectionConfig,
} from "@/components/portal/PortalDashboardLayout";

export function flattenPortalNavItems(
  navSections?: PortalNavSectionConfig[],
  navItems?: PortalNavItemConfig[]
): PortalNavItemConfig[] {
  if (navSections?.length) {
    return navSections.flatMap((section) => section.items);
  }
  return navItems ?? [];
}

/** Nav items not pinned on the bottom tab bar — shown in the overflow sheet. */
export function getPortalOverflowNavItems(
  allItems: PortalNavItemConfig[],
  pinnedPaths: string[]
): PortalNavItemConfig[] {
  const normalizedPinned = pinnedPaths.map((p) => p.replace(/\/$/, ""));
  const DASHBOARD_HOME_RE = /^\/dashboard\/(admin|client|applicant)$/;

  return allItems.filter((item) => {
    const path = item.path.replace(/\/$/, "");
    if (normalizedPinned.includes(path)) return false;
    return !normalizedPinned.some((pinned) => {
      // Avoid swallowing the entire portal under "/dashboard/<role>"
      if (DASHBOARD_HOME_RE.test(pinned)) return false;
      return path.startsWith(`${pinned}/`) && path !== pinned;
    });
  });
}
