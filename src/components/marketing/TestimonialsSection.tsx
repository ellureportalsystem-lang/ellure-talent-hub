import { Card } from "@/components/ui/card";
import { marketingTestimonials } from "@/lib/marketingTestimonials";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { FadeInSection } from "./FadeInSection";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25"
          )}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof marketingTestimonials)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col border-2 border-border p-6 shadow-md transition-all duration-300 hover:border-primary/25 hover:shadow-lg">
        <Quote className="h-8 w-8 text-primary/30" aria-hidden />
        <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90 sm:text-base">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
          <StarRating rating={testimonial.rating} />
          <span className="text-xs font-medium text-muted-foreground">{testimonial.rating}.0</span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/25 text-sm font-semibold text-primary ring-1 ring-primary/15"
            aria-hidden
          >
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            <p className="text-xs font-medium text-primary">{testimonial.company}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

type TestimonialsSectionProps = {
  className?: string;
  title?: string;
  subtitle?: string;
};

export function TestimonialsSection({
  className,
  title = "Trusted by hiring teams & candidates",
  subtitle = "Real feedback from organizations and professionals who partner with Ellure NexHire.",
}: TestimonialsSectionProps) {
  return (
    <FadeInSection className={cn("py-10 md:py-14 px-4 sm:px-6", className)}>
      <div className="container">
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-primary">Wall of love</span>
          <h2 className="font-poppins mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
        </motion.div>

        {/* Phone / tablet: horizontal snap carousel */}
        <div className="marketing-snap-scroll -mx-4 px-4 lg:hidden">
          <div className="flex w-max gap-4 snap-x snap-mandatory touch-pan-x">
            {marketingTestimonials.map((t, i) => (
              <div
                key={t.name}
                className="w-[min(85vw,20rem)] shrink-0 snap-start sm:w-[20rem]"
              >
                <TestimonialCard testimonial={t} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Laptop+ — unchanged grid */}
        <div className="hidden gap-5 lg:grid lg:grid-cols-3">
          {marketingTestimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>

        <div className="mt-5 hidden gap-5 lg:grid lg:grid-cols-2">
          {marketingTestimonials.slice(3).map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i + 3} />
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
