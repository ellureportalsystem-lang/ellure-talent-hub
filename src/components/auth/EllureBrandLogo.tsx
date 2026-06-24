import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/brand";
import { BrandLogo } from "@/components/brand/BrandLogo";

type EllureBrandLogoProps = {
  to?: string | false;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showTagline?: boolean;
  portalLabel?: string;
  variant?: "default" | "nav" | "wordmark";
  /** Subtle glow on dark hero overlays */
  light?: boolean;
};

const logoSizeMap: Record<NonNullable<EllureBrandLogoProps["size"]>, "xs" | "sm" | "md" | "lg"> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
};

export function EllureBrandLogo({
  to = "/",
  className,
  size = "md",
  showTagline = false,
  portalLabel,
  variant = "default",
  light = false,
}: EllureBrandLogoProps) {
  const logoSize = variant === "nav" ? "xs" : logoSizeMap[size];

  const content =
    variant === "wordmark" ? (
      <BrandLogo className={className} size={logoSize} onDark={light} />
    ) : variant === "nav" ? (
      <>
        <BrandLogo className={cn("sm:hidden", className)} size="xs" markOnly onDark={light} />
        <BrandLogo className={cn("hidden sm:inline-flex", className)} size="sm" onDark={light} />
      </>
    ) : (
      <div className={cn("flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
        <BrandLogo size={logoSize} onDark={light} />
        {(portalLabel || showTagline) && (
          <div className="hidden min-w-0 flex-col leading-tight sm:flex">
            {portalLabel && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                {portalLabel}
              </span>
            )}
            {showTagline && (
              <span className="text-xs font-normal text-[#64748b]">Hire smarter. Apply faster.</span>
            )}
          </div>
        )}
      </div>
    );

  if (to === false) return content;

  return (
    <Link
      to={to}
      className="group inline-flex shrink-0 transition-opacity hover:opacity-90"
      aria-label={`${BRAND_NAME} home`}
    >
      {content}
    </Link>
  );
}
