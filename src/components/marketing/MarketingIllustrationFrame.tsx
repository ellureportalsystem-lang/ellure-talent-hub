import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PastelCardTone } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";

const toneStyles: Record<PastelCardTone, string> = {
  peach: "border-[#f5ddd0] bg-[#FDF0E9]",
  sky: "border-[#d4e2fc] bg-[#E9F0FF]",
  mint: "border-[#c5ead8] bg-[#E8F8F0]",
  lavender: "border-[#ddd0f5] bg-[#F3EFFE]",
};

type MarketingIllustrationFrameProps = {
  children: ReactNode;
  tone?: PastelCardTone;
  className?: string;
};

/** Snug frame around cartoon / 3D illustrations — no oversized empty panel */
export function MarketingIllustrationFrame({
  children,
  tone = "peach",
  className,
}: MarketingIllustrationFrameProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-full shrink-0 items-center justify-center justify-self-center rounded-2xl border p-3 shadow-sm sm:p-4",
        "lg:justify-self-end",
        toneStyles[tone],
        className
      )}
    >
      <div className="marketing-illustration-inner flex items-center justify-center">{children}</div>
    </div>
  );
}
