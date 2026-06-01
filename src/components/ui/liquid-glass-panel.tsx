import * as React from "react";

import { LiquidGlassSurface } from "@/components/ui/liquid-glass-button";
import { cn } from "@/lib/utils";

export interface LiquidGlassPanelProps extends React.ComponentProps<"div"> {
  cornerClassName?: string;
  filterId?: string;
}

/** Hero card — liquid glass (SVG displacement + inset shadows) */
function LiquidGlassPanel({
  className,
  cornerClassName = "rounded-lg",
  filterId = "container-glass-hero-card",
  children,
  ...props
}: LiquidGlassPanelProps) {
  return (
    <LiquidGlassSurface
      className={cn("text-white", className)}
      cornerClassName={cornerClassName}
      filterId={filterId}
      displacementScale={48}
    >
      <div
        className={cn("overflow-hidden border border-white/25 bg-white/[0.04]", cornerClassName)}
        {...props}
      >
        {children}
      </div>
    </LiquidGlassSurface>
  );
}

export { LiquidGlassPanel };
