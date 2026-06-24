import { cn } from "@/lib/utils";
import { brandColors } from "@/lib/brand";
import { BrandLogo } from "@/components/brand/BrandLogo";

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
    return <BrandLogo size="sm" markOnly />;
  }

  if (variant === "compact") {
    return (
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandLogo size="sm" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
            {portalSuffix}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 overflow-hidden space-y-1">
      <BrandLogo size={size === "sm" ? "sm" : "md"} />
      <p
        className={cn(
          "font-poppins font-medium leading-tight tracking-tight text-[#64748b]",
          size === "sm" ? "text-xs" : "text-sm"
        )}
        style={{ color: brandColors.muted }}
      >
        {portalSuffix}
      </p>
      {tagline ? <p className="text-[10px] text-[#64748b] md:text-xs">{tagline}</p> : null}
    </div>
  );
}
