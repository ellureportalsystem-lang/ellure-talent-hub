"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const LIQUID_GLASS_SHADOW =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]";

export const LIQUID_GLASS_SHADOW_DARK =
  "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

export function GlassFilter({
  filterId = "container-glass",
  displacementScale = 70,
}: {
  filterId?: string;
  displacementScale?: number;
}) {
  return (
    <svg className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden>
      <defs>
        <filter
          id={filterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidGlassSurface({
  className,
  cornerClassName = "rounded-md",
  filterId = "container-glass",
  displacementScale = 70,
  children,
}: {
  className?: string;
  cornerClassName?: string;
  filterId?: string;
  displacementScale?: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative isolate w-full", cornerClassName, className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 h-full w-full",
          cornerClassName,
          LIQUID_GLASS_SHADOW,
          LIQUID_GLASS_SHADOW_DARK
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-white/[0.07] backdrop-blur-[2px]",
          cornerClassName
        )}
        style={{
          backdropFilter: `url("#${filterId}")`,
          WebkitBackdropFilter: `url("#${filterId}")`,
        }}
        aria-hidden
      />
      <div className="relative z-[2]">{children}</div>
      <GlassFilter filterId={filterId} displacementScale={displacementScale} />
    </div>
  );
}

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow,transform] duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:scale-105",
  {
    variants: {
      variant: {
        default: "bg-transparent text-primary",
        destructive: "text-white",
        outline: "text-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 min-w-[7rem] px-4 py-2",
        sm: "h-8 min-w-[5rem] text-xs px-4",
        lg: "h-10 min-w-[8rem] px-6",
        xl: "h-12 min-w-[9rem] px-8",
        xxl: "h-14 min-w-[10rem] px-10",
        icon: "size-9 min-w-0 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const filterId = "container-glass-button";

  return (
    <Comp
      data-slot="liquid-glass-button"
      className={cn("relative overflow-hidden rounded-md", liquidbuttonVariants({ variant, size, className }))}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-md",
          LIQUID_GLASS_SHADOW,
          LIQUID_GLASS_SHADOW_DARK
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-md bg-white/[0.07] backdrop-blur-[2px]"
        style={{
          backdropFilter: `url("#${filterId}")`,
          WebkitBackdropFilter: `url("#${filterId}")`,
        }}
        aria-hidden
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
      <GlassFilter filterId={filterId} />
    </Comp>
  );
}

export { LiquidButton, liquidbuttonVariants };
