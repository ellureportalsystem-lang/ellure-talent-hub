import { cn } from "@/lib/utils";
import { BRAND_NAME, brandLogos } from "@/lib/brand";

type BrandLogoSize = "xs" | "sm" | "nav" | "footer" | "md" | "lg";

type BrandLogoProps = {
  className?: string;
  size?: BrandLogoSize;
  /** Show icon mark only (collapsed sidebars, tight mobile slots) */
  markOnly?: boolean;
  /** Subtle glow on dark hero / footer chrome */
  onDark?: boolean;
};

const sizeConfig: Record<
  BrandLogoSize,
  { shell: string; mark: string; name: string; gap: string }
> = {
  xs: {
    shell: "h-8",
    mark: "h-8 w-auto",
    name: "h-[1.65rem] w-auto",
    gap: "gap-1",
  },
  sm: {
    shell: "h-9 sm:h-10",
    mark: "h-9 w-auto sm:h-10",
    name: "h-[1.85rem] w-auto sm:h-[2.05rem]",
    gap: "gap-1.5",
  },
  nav: {
    shell: "h-10 sm:h-11",
    mark: "h-9 w-auto sm:h-10",
    name: "h-[2.5rem] w-auto max-w-none sm:h-[2.75rem]",
    gap: "gap-1.5 sm:gap-2",
  },
  md: {
    shell: "h-10 sm:h-11",
    mark: "h-10 w-auto sm:h-11",
    name: "h-[2.05rem] w-auto sm:h-[2.3rem]",
    gap: "gap-1.5 sm:gap-2",
  },
  footer: {
    shell: "h-12 sm:h-14",
    mark: "h-12 w-auto sm:h-14",
    name: "h-[2.45rem] w-auto sm:h-[2.9rem]",
    gap: "gap-2 sm:gap-2.5",
  },
  lg: {
    shell: "h-12 sm:h-14",
    mark: "h-12 w-auto sm:h-14",
    name: "h-[2.45rem] w-auto sm:h-[2.9rem]",
    gap: "gap-2 sm:gap-2.5",
  },
};

export function BrandLogo({
  className,
  size = "md",
  markOnly = false,
  onDark = false,
}: BrandLogoProps) {
  const s = sizeConfig[size];
  const glow = onDark ? "drop-shadow-[0_1px_10px_rgba(255,255,255,0.28)]" : "";

  if (markOnly) {
    return (
      <span className={cn("inline-flex shrink-0 items-center leading-none", className)}>
        <img
          src={brandLogos.mark}
          alt={BRAND_NAME}
          className={cn("block object-contain object-left", s.mark, glow)}
          decoding="async"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center leading-none",
        s.shell,
        s.gap,
        className
      )}
    >
      <img
        src={brandLogos.mark}
        alt=""
        aria-hidden
        className={cn("block shrink-0 object-contain object-center", s.mark, glow)}
        decoding="async"
      />
      <img
        src={brandLogos.name}
        alt={BRAND_NAME}
        className={cn("block min-w-0 object-contain object-left", s.name, glow)}
        decoding="async"
      />
    </span>
  );
}
