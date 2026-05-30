import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarketingCollapsibleTextProps = {
  children: ReactNode;
  className?: string;
  /** Lines shown before expand on phone/tablet */
  clampClass?: string;
};

/** Long copy: truncated on viewports below lg; full text on laptop+. */
export function MarketingCollapsibleText({
  children,
  className,
  clampClass = "max-h-[9.5rem] overflow-hidden",
}: MarketingCollapsibleTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className={cn("lg:hidden", className)}>
        <div className={cn(!expanded && clampClass)}>{children}</div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 min-h-[44px] rounded-lg px-4 text-sm font-semibold text-primary active:scale-[0.98]"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      </div>
      <div className={cn("hidden lg:block", className)}>{children}</div>
    </>
  );
}
