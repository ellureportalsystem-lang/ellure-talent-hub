import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  portalAlertError,
  portalAlertInfo,
  portalAlertSuccess,
  portalAlertWarning,
  portalPanelClass,
  portalSectionTitleClass,
} from "@/components/portal/portalStyles";

export const portalAlerts = {
  warning: portalAlertWarning,
  error: portalAlertError,
  success: portalAlertSuccess,
  info: portalAlertInfo,
};

export function PortalSectionLabel({ children }: { children: ReactNode }) {
  return <p className={portalSectionTitleClass}>{children}</p>;
}

type PortalSectionProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
};

export function PortalSection({ title, description, icon, children, className, action }: PortalSectionProps) {
  return (
    <section className={cn("space-y-3 md:space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {icon ? (
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {icon}
              </span>
              <h2 className="text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h2>
            </div>
          ) : (
            <h2 className="text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h2>
          )}
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

type PortalPageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function PortalPageHeader({ title, subtitle, action }: PortalPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="text-sm font-semibold tracking-tight text-foreground md:text-base">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{subtitle}</p> : null}
      </div>
      {action ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}

type PortalWelcomeHeroProps = {
  name: string;
  subtitle: string;
  initials: string;
  avatarUrl?: string | null;
  dateLine?: string;
  children?: ReactNode;
  className?: string;
};

/** MR/Manager welcome hero — `mr/Dashboard.tsx` */
export function PortalWelcomeHero({
  name,
  subtitle,
  initials,
  avatarUrl,
  dateLine,
  children,
  className,
}: PortalWelcomeHeroProps) {
  return (
    <div
      className={cn(
        portalPanelClass,
        "animate-fade-in-up border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover shadow ring-[3px] ring-primary/15"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-extrabold text-primary shadow ring-[3px] ring-primary/15">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold tracking-tight truncate">Hi, {name}!</p>
          {dateLine ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{dateLine}</p>
          ) : (
            <p className="mt-0.5 text-xs font-medium text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

type PortalTodayPanelProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

/** MakTree `DashboardTodayCard` glass strip */
export function PortalTodayPanel({ title, children, action }: PortalTodayPanelProps) {
  return (
    <div className="portal-glass-card overflow-hidden rounded-2xl border border-border/80 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-primary/10 bg-primary/[0.04] px-3.5 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-foreground">{title}</p>
        {action}
      </div>
      <div className="p-3.5 space-y-2">{children}</div>
    </div>
  );
}

type PortalQuickActionProps = {
  label: string;
  icon: ReactNode;
  to: string;
  tint?: "primary" | "destructive" | "amber" | "sky" | "violet";
};

const tintMap = {
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  amber: "bg-amber-500/10 text-amber-600",
  sky: "bg-sky-500/10 text-sky-600",
  violet: "bg-violet-500/10 text-violet-600",
};

/** MR 5-col or Manager 3–6 col quick actions */
export function PortalQuickActionGrid({
  actions,
  columns = 4,
}: {
  actions: PortalQuickActionProps[];
  columns?: 4 | 5 | 6;
}) {
  const colClass =
    columns === 5
      ? "grid-cols-5"
      : columns === 6
        ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        : "grid-cols-4";

  return (
    <div className={cn("grid gap-2", colClass)}>
      {actions.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className={cn(
            portalPanelClass,
            "flex flex-col items-center gap-1.5 p-2.5 active:scale-95 transition-all",
            a.tint === "destructive" && "border-destructive/20"
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl",
              tintMap[a.tint ?? "primary"]
            )}
          >
            {a.icon}
          </span>
          <span
            className={cn(
              "text-center font-semibold leading-tight text-foreground",
              columns === 5 ? "text-[9px]" : "text-[10px] md:text-xs"
            )}
          >
            {a.label}
          </span>
        </Link>
      ))}
    </div>
  );
}

type PortalStatLinkCardProps = {
  label: string;
  value: string | number;
  icon?: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
};

export function PortalStatLinkCard({ label, value, icon, to, onClick, className }: PortalStatLinkCardProps) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground max-md:text-[10px] max-md:leading-tight sm:text-sm">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight max-md:text-lg md:text-3xl">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary max-md:hidden">
            {icon}
          </div>
        ) : null}
      </div>
      {(to || onClick) && (
        <div className="mt-2 flex items-center justify-end border-t border-border/60 pt-2 text-primary max-md:pt-1.5">
          <span className="hidden text-xs font-medium sm:inline">View</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </>
  );

  const cardClass = cn(
    portalPanelClass,
    "p-3 md:p-4 transition-transform active:scale-[0.98]",
    (to || onClick) && "hover:border-primary/25",
    className
  );

  if (to) {
    return (
      <Link to={to} className={cardClass}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cardClass, "w-full text-left")}>
        {inner}
      </button>
    );
  }
  return <div className={cardClass}>{inner}</div>;
}

export function PortalStatLinkGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid max-md:!grid-cols-3 max-md:gap-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

type PortalListRowProps = {
  title: string;
  subtitle?: string;
  initials?: string;
  avatarUrl?: string | null;
  trailing?: ReactNode;
  onClick?: () => void;
  alternate?: boolean;
};

export function PortalListRow({
  title,
  subtitle,
  initials,
  avatarUrl,
  trailing,
  onClick,
  alternate,
}: PortalListRowProps) {
  const className = cn(
    "flex items-center gap-3 rounded-xl border border-border/70 px-3 py-3 shadow-sm transition-transform",
    alternate ? "bg-card/80" : "bg-card",
    onClick && "cursor-pointer active:scale-[0.99] touch-manipulation hover:bg-muted/30"
  );

  const avatar = avatarUrl ? (
    <img src={avatarUrl} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
  ) : initials ? (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {initials}
    </div>
  ) : null;

  const content = (
    <>
      {avatar}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        {subtitle ? <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {trailing ?? (onClick ? <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /> : null)}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(className, "w-full text-left")}>
        {content}
      </button>
    );
  }
  return <div className={className}>{content}</div>;
}

type PortalEmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PortalEmptyState({ title, description, action }: PortalEmptyStateProps) {
  return (
    <div className={cn(portalPanelClass, "flex flex-col items-center px-6 py-10 text-center")}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function PortalLoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
