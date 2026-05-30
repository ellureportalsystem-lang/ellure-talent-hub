import { Card } from "@/components/ui/card";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export type ProcessStep = {
  step: string;
  title: string;
  desc: string;
};

type ServicesProcessTimelineProps = {
  steps: ProcessStep[];
  className?: string;
};

function TimelineStep({
  item,
  index,
  isLast,
  lineActive,
}: {
  item: ProcessStep;
  index: number;
  isLast: boolean;
  lineActive: boolean;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.35, "0px 0px -10% 0px");

  return (
    <div ref={ref} className="relative flex gap-6 pb-10 last:pb-0 md:gap-8">
      {!isLast && (
        <div
          className="absolute left-[1.35rem] top-14 bottom-0 w-0.5 origin-top bg-border md:left-[1.6rem]"
          aria-hidden
        >
          <motion.div
            className="h-full w-full bg-gradient-to-b from-primary via-primary/70 to-secondary/60"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: inView && lineActive ? 1 : 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "top" }}
          />
        </div>
      )}

      <motion.div
        className={cn(
          "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold shadow-md md:h-12 md:w-12",
          inView
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted text-muted-foreground"
        )}
        initial={{ scale: 0.85, opacity: 0.5 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <span className="md:text-base">{item.step}</span>
      </motion.div>

      <motion.div
        className="min-w-0 flex-1 pt-0.5"
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 8 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <Card className="border-2 border-border p-5 shadow-md transition-shadow hover:border-primary/25 hover:shadow-lg md:p-6">
          <h3 className="font-poppins text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{item.desc}</p>
        </Card>
      </motion.div>
    </div>
  );
}

export function ServicesProcessTimeline({ steps, className }: ServicesProcessTimelineProps) {
  const { ref: containerRef, inView: containerInView } = useInViewOnce<HTMLDivElement>(0.15);

  return (
    <div ref={containerRef} className={cn("mx-auto max-w-2xl", className)}>
      {steps.map((item, index) => (
        <TimelineStep
          key={item.step}
          item={item}
          index={index}
          isLast={index === steps.length - 1}
          lineActive={containerInView}
        />
      ))}
    </div>
  );
}
