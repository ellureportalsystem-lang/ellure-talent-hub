import { Typewriter } from "@/components/ui/typewriter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const PHRASES = [
  "minutes, not months",
  "with structure & speed",
  "on one platform",
  "with ethical hiring",
];

type HeroTypewriterHeadlineProps = {
  className?: string;
};

export function HeroTypewriterHeadline({ className }: HeroTypewriterHeadlineProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (reducedMotion) {
    return (
      <span className={cn(className)}>
        minutes, <span className={cn("text-primary", className)}>not months</span>
      </span>
    );
  }

  return (
    <span className={cn(className)}>
      <Typewriter
        text={PHRASES}
        speed={42}
        deleteSpeed={28}
        waitTime={2200}
        initialDelay={400}
        loop
        className={cn("text-primary", className)}
        cursorChar="|"
        cursorClassName={cn("ml-0.5 font-normal", className ?? "text-primary")}
      />
    </span>
  );
}
