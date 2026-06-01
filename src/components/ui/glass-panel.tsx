import * as React from "react";

import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.ComponentProps<"div"> {
  /** Applied to the frosted surface (not the outer wrap) */
  surfaceClassName?: string;
  /** Corner radius shared by panel + shadow (default: rounded-xl) */
  cornerClassName?: string;
}

/**
 * Card-sized liquid glass panel — same visual system as GlassButton, for hero cards etc.
 */
function GlassPanel({
  className,
  surfaceClassName,
  cornerClassName = "rounded-xl",
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div className={cn("glass-panel-wrap w-full", cornerClassName, className)}>
      <div
        className={cn(
          "glass-panel relative z-[2] w-full overflow-hidden text-white",
          cornerClassName,
          surfaceClassName
        )}
        {...props}
      >
        {children}
      </div>
      <div className={cn("glass-panel-shadow", cornerClassName)} aria-hidden />
    </div>
  );
}

export { GlassPanel };
