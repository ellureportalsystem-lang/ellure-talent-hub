import type { ReactNode } from "react";
import { portalPageCanvas, portalPageWidth } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

export type DashboardPageWidth = keyof typeof portalPageWidth;

type DashboardPageShellProps = {
  children: ReactNode;
  className?: string;
  /** @deprecated use width="narrow" */
  narrow?: boolean;
  width?: DashboardPageWidth;
};

/** Consistent responsive padding and max-width for portal dashboard pages */
export function DashboardPageShell({
  children,
  className,
  narrow,
  width = "wide",
}: DashboardPageShellProps) {
  const resolvedWidth = narrow ? "narrow" : width;

  return (
    <div className={cn(portalPageCanvas, portalPageWidth[resolvedWidth], className)}>{children}</div>
  );
}
