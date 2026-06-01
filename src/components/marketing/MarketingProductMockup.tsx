import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MarketingProductMockupProps = {
  children: ReactNode;
  className?: string;
  size?: "compact" | "default" | "hero";
};

const sizeClass = {
  compact: "max-w-[200px] sm:max-w-[220px]",
  default: "max-w-md sm:max-w-lg",
  hero: "max-w-lg",
};

/** Framed NexHire UI collage — product screens, not external reference images */
export function MarketingProductMockup({
  children,
  className,
  size = "default",
}: MarketingProductMockupProps) {
  return (
    <div
      className={cn(
        "marketing-product-mockup mx-auto w-full rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e9f0ff] p-2 shadow-md ring-1 ring-black/[0.06] sm:p-3",
        size === "compact" && "marketing-product-mockup--compact min-h-[120px] sm:min-h-[140px]",
        size !== "compact" && "min-h-[200px] sm:min-h-[220px]",
        sizeClass[size],
        className
      )}
    >
      <div className="marketing-product-mockup-inner overflow-hidden rounded-xl bg-white/90">
        {children}
      </div>
    </div>
  );
}
