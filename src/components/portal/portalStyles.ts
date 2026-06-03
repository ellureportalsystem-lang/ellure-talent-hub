/** Shared Tailwind class strings for portal dashboards (MakTree-inspired layout). */

export const portalPageTitleClass =
  "text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl";

export const portalPageSubtitleClass = "text-sm text-muted-foreground";

export const portalNavGroupClass =
  "px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground";

export const portalNavLinkBase =
  "portal-nav-link flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200";

export const portalNavLinkActive = "portal-nav-link-active";

export const portalPanelClass =
  "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm";

/** @deprecated use portalPanelClass */
export const portalPanelCard = "portal-panel-card";

/** Responsive page canvas (reference: dashboardPageClass) */
export const portalPageCanvas =
  "mx-auto w-full space-y-5 px-4 py-5 md:space-y-6 md:px-8 md:py-6 lg:px-10";

export const portalPageWidth = {
  standard: "max-w-lg md:max-w-3xl lg:max-w-5xl xl:max-w-6xl",
  wide: "max-w-7xl xl:max-w-[1600px]",
  narrow: "max-w-lg md:max-w-xl lg:max-w-2xl",
  full: "w-full max-w-full",
} as const;

export const portalContentWrap = cnPortalPage("wide");

export const portalSectionTitleClass =
  "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground";

export const portalAlertWarning =
  "rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4";
export const portalAlertError =
  "rounded-2xl border border-destructive/30 bg-destructive/5 p-4";
export const portalAlertSuccess =
  "rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4";
export const portalAlertInfo =
  "rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4";

export const portalSearchInputWrap = "relative flex-1";
export const portalSearchInputClass = "h-10 w-full rounded-lg pl-9";

export const portalFilterChipBase =
  "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors";
export const portalFilterChipActive = "border-primary bg-primary text-primary-foreground";
export const portalFilterChipInactive = "border-border bg-card text-foreground";

function cnPortalPage(width: keyof typeof portalPageWidth) {
  return `${portalPageCanvas} ${portalPageWidth[width]}`;
}

export const portalMobileNavLinkClass = "min-h-[48px] py-3 text-base";

/** Use on filter rows / form stacks inside portal pages */
export const portalMobileStackRow = "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4";

export const portalMobileInputClass = "max-md:h-11 max-md:text-base";

export const portalMobilePrimaryButtonClass = "max-md:w-full max-md:h-11";
