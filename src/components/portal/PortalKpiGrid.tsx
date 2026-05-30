import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PortalKpiGridProps = {
  children: ReactNode;
  /** Total stat cards — enables compact 3×2 + 2-col layout on phone when > 6 */
  count?: number;
  className?: string;
};

/**
 * Responsive KPI layout: dense grid on phone, full grid from sm/md up.
 */
export function PortalKpiGrid({ children, count = 4, className }: PortalKpiGridProps) {
  const childArray = Children.toArray(children);
  const items = childArray.filter(Boolean);
  const useCompact = count > 6 && items.length > 6;

  if (!useCompact) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4",
          count === 5 && "lg:grid-cols-5",
          className
        )}
      >
        {children}
      </div>
    );
  }

  const firstSix = items.slice(0, 6);
  const rest = items.slice(6);

  return (
    <div className={cn("space-y-2 sm:space-y-0", className)}>
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 sm:hidden">{firstSix}</div>
      {rest.length > 0 ? (
        <div className="grid grid-cols-2 gap-1.5 sm:hidden">{rest}</div>
      ) : null}
      <div className="hidden sm:grid sm:grid-cols-4 sm:gap-2 xl:grid-cols-8">{children}</div>
    </div>
  );
}
