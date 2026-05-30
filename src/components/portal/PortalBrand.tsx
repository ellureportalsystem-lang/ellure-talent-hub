import { cn } from "@/lib/utils";

type PortalBrandProps = {
  portalSuffix: string;
  tagline?: string;
  collapsed?: boolean;
  size?: "sm" | "md";
};

export function PortalBrand({ portalSuffix, tagline, collapsed, size = "md" }: PortalBrandProps) {
  if (collapsed) {
    return (
      <img
        src="/ellure-logo.png"
        alt="Ellure NexHire"
        className="h-9 w-9 object-contain"
      />
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
