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

  return allItems.filter((item) => {
    const path = item.path.replace(/\/$/, "");
    if (normalizedPinned.includes(path)) return false;
    return !normalizedPinned.some(
      (pinned) => path.startsWith(`${pinned}/`) && path !== pinned
    );
  });
}
