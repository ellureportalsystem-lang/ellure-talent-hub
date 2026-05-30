import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardPageShellProps = {
  children: ReactNode;
  className?: string;
  /** Narrow pages (e.g. settings) */
  narrow?: boolean;
};

/** Consistent padding and max-width for admin/client dashboard pages */
export function DashboardPageShell({ children, className, narrow }: DashboardPageShellProps) {
  return (
    <div
      className={cn(
        "dashboard-page w-full mx-auto p-4 lg:p-6",
        narrow ? "max-w-3xl" : "max-w-[1600px]",
        className
      )}
    >
      {children}
    </div>
  );
}
