import { cn } from "@/lib/utils";

type PortalBrandProps = {
  portalSuffix: string;
  tagline?: string;
  collapsed?: boolean;
  size?: "sm" | "md";
  /** MakTree PageHeader home — logo + wordmark in one row */
  variant?: "default" | "compact";
};

export function PortalBrand({
  portalSuffix,
  tagline,
  collapsed,
  size = "md",
  variant = "default",
}: PortalBrandProps) {
  if (collapsed) {
    return (
      <img src="/ellure-logo.png" alt="Ellure NexHire" className="h-9 w-9 object-contain" />
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src="/ellure-logo.png"
          alt=""
          className="h-9 w-9 shrink-0 object-contain"
        />
        <div className="min-w-0 leading-tight">
          <p className="font-brand truncate text-sm font-extrabold tracking-tight text-foreground">
            Ellure <span className="text-primary">NexHire</span>
          </p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {portalSuffix}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden">
      <div
        className={cn(
          "font-brand font-semibold leading-tight tracking-[-0.03em] text-foreground",
          size === "sm" ? "text-lg" : "text-xl"
        )}
      >
        Ellure <span className="portal-brand-accent font-medium">{portalSuffix}</span>
      </div>
      {tagline ? (
        <p className="text-[10px] text-muted-foreground md:text-xs">{tagline}</p>
      ) : null}
    </div>
  );
}
