import type { ReactNode } from "react";
import { portalContentWrap } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

type DashboardPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Narrow pages (e.g. settings) */
  narrow?: boolean;
};

/** Consistent padding and max-width for portal dashboard pages */
export function DashboardPageShell({ children, className, narrow }: DashboardPageShellProps) {
  return (
    <div
      className={cn(
        portalContentWrap,
        "w-full px-4 pt-4 pb-6 md:px-8 md:pt-6",
        narrow && "max-w-3xl",
        className
      )}
    >
      {children}
    </div>
  );
}
