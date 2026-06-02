import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hiringProcessSteps } from "@/lib/hiringProcessSteps";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { HiringProcessStepPreview } from "./HiringProcessStepPreview";

const AUTOPLAY_MS = 5000;

type BharatGoHowItWorksProps = {
  className?: string;
  showHeader?: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

/** Slim horizontal stepper + compact autoplay product preview */
export function BharatGoHowItWorks({
  className,
  showHeader = true,
  eyebrow = "How it works",
  title = "Start hiring in 4 simple steps",
  subtitle = "From role alignment to shortlist delivery — our structured process keeps every hire transparent and on track.",
}: BharatGoHowItWorksProps) {
  const steps = hiringProcessSteps;
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const active = steps[activeIndex];
  const ActiveIcon = active.icon;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + steps.length) % steps.length);
      setProgressKey((k) => k + 1);
    },
    [steps.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (prefersReducedMotion || !autoPlay || paused) return;
    const id = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, prefersReducedMotion, goNext]);

  return (
    <section className={cn("bharatgo-section bharatgo-how-it-works py-12 sm:py-14 lg:py-16", className)}>
      <div className="container px-4 sm:px-6">
        {showHeader ? (
          <BharatGoSectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} className="mb-8 lg:mb-10" />
        ) : null}

        {/* Horizontal step pills — single row */}
        <div className="-mx-1 mb-6 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max max-w-full flex-nowrap items-center justify-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-left transition-all sm:px-4",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted/50"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:h-8 sm:w-8",
                      isActive ? "bg-primary-foreground/20" : "bg-muted"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                      {step.step}
                    </span>
                    <span className="block text-xs font-semibold sm:text-sm">{step.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview (left) + details (right) */}
        <div
          className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(360px,460px)_1fr] lg:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Left: compact preview card */}
          <div className="bharatgo-hiw-card overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            <div className="h-0.5 w-full bg-muted" aria-hidden>
              {autoPlay && !prefersReducedMotion && !paused ? (
                <motion.div
                  key={`${activeIndex}-${progressKey}`}
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                />
              ) : (
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                />
              )}
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Step {activeIndex + 1} of {steps.length}
                </span>
                <button
                  type="button"
                  onClick={() => setAutoPlay((v) => !v)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
                    autoPlay ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-muted/50 text-muted-foreground"
                  )}
                  aria-pressed={autoPlay}
                >
                  {autoPlay ? (
                    <>
                      <Pause className="h-3 w-3" aria-hidden />
                      Auto play
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" aria-hidden />
                      Paused
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ActiveIcon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-poppins text-base font-bold leading-tight sm:text-lg">{active.headline}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{active.previewSubtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{active.description}</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <HiringProcessStepPreview key={active.id} step={active} />
              </AnimatePresence>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/80 pt-3">
                <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full px-2 text-xs" onClick={goPrev}>
                  <ChevronLeft className="mr-0.5 h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full px-2 text-xs" onClick={goNext}>
                  Next
                  <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right: step details (restored) */}
          <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Details</p>
            <h3 className="font-poppins mt-2 text-xl font-bold text-foreground sm:text-2xl">
              {active.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {active.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {steps.map((s, idx) => {
                const isActive = idx === activeIndex;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(idx)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                      isActive
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-background hover:border-primary/25"
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg", isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {s.step}
                      </span>
                      <span className="block text-sm font-semibold text-foreground">{s.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {s.previewSubtitle}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
