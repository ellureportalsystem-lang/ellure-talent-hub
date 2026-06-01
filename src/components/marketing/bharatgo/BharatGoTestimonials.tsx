import { marketingTestimonials } from "@/lib/marketingTestimonials";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

const ROTATE_MS = 5500;

export function BharatGoTestimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const current = marketingTestimonials[active];

  useEffect(() => {
    if (prefersReducedMotion || paused || marketingTestimonials.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % marketingTestimonials.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, prefersReducedMotion]);

  if (!current) return null;

  return (
    <section
      className="bharatgo-section bg-[#FDF0E9] py-14 sm:py-16 lg:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="Testimonial"
          title="Loved by hiring teams & candidates"
          subtitle="Join organizations and professionals who trust Ellure NexHire to grow their hiring outcomes."
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-7 shadow-md sm:p-9"
            >
              <Quote className="h-9 w-9 text-primary/25" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < current.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <blockquote className="mt-5 text-lg leading-relaxed text-foreground/90 sm:text-xl">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <p className="mt-6 font-poppins text-base font-semibold">{current.name}</p>
              <p className="text-sm text-muted-foreground">
                {current.role} · {current.company}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-nowrap items-center justify-center gap-2 min-w-min mx-auto w-max max-w-full">
              {marketingTestimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-left transition-all active:scale-[0.98]",
                    i === active
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                  aria-current={i === active ? "true" : undefined}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {t.initials}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
