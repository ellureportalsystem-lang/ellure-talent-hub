import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ParsedStat = {
  end: number;
  suffix: string;
};

function parseStatValue(raw: string): ParsedStat {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { end: 0, suffix: raw };
  return { end: Number(match[1]), suffix: match[2] ?? "" };
}

type AnimatedStatValueProps = {
  value: string;
  active: boolean;
  durationMs?: number;
  className?: string;
};

export function AnimatedStatValue({
  value,
  active,
  durationMs = 1600,
  className,
}: AnimatedStatValueProps) {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(parsed.end * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, parsed.end, durationMs]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display}
      {parsed.suffix}
    </span>
  );
}
