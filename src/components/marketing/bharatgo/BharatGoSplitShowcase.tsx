import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type BharatGoSplitShowcaseProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  visual: ReactNode;
  reverse?: boolean;
  className?: string;
};

/** Alternating image + copy blocks (plugins / themes style on BharatGo) */
export function BharatGoSplitShowcase({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  visual,
  reverse = false,
  className,
}: BharatGoSplitShowcaseProps) {
  return (
    <section className={cn("bharatgo-section py-16 sm:py-20 lg:py-24", className)}>
      <div className="container px-4 sm:px-6">
        <div
          className={cn(
            "bharatgo-pastel-card grid items-center gap-10 rounded-3xl border border-[#d4e2fc] bg-[#E9F0FF] p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-12",
            reverse && "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1"
          )}
        >
          <motion.div
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-lg:mx-auto max-lg:max-w-lg max-lg:text-center lg:text-left"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
            <h2 className="font-poppins mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
            <Button className="mt-6 h-11 rounded-full px-6 font-semibold" asChild>
              <Link to={ctaHref}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="bharatgo-showcase-visual w-full max-w-lg">{visual}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
