import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { renderProductVisual, type ProductVisualVariant } from "@/lib/marketingProductVisuals";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

export type PastelCardTone = "peach" | "sky" | "mint" | "lavender";

const toneStyles: Record<
  PastelCardTone,
  { card: string; button: string }
> = {
  peach: {
    card: "bg-[#FDF0E9] border-[#f5ddd0] dark:bg-[#2a221e] dark:border-[#3d322c]",
    button: "border-[#3b82f6] text-[#2563eb] hover:bg-[#eff6ff] bg-white/80",
  },
  sky: {
    card: "bg-[#E9F0FF] border-[#d4e2fc] dark:bg-[#1a2233] dark:border-[#2a3a55]",
    button: "border-[#3b82f6] text-[#2563eb] hover:bg-white/90 bg-white/80",
  },
  mint: {
    card: "bg-[#E8F8F0] border-[#c5ead8] dark:bg-[#1a2a24] dark:border-[#2a4038]",
    button: "border-[#0d9488] text-[#0f766e] hover:bg-white/90 bg-white/80",
  },
  lavender: {
    card: "bg-[#E9F0FF] border-[#d4e2fc] dark:bg-[#1a2233] dark:border-[#2a3a55]",
    button: "border-[#0566CD] text-[#0566CD] hover:bg-white/90 bg-white/80",
  },
};

export type PastelFeatureCard = {
  tone: PastelCardTone;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** TalentHub product UI mockup (built for this site) */
  productVisual?: ProductVisualVariant;
  /** 3D-style cartoon illustration */
  illustration?: ReactNode;
};

type BharatGoPastelFeatureCardsProps = {
  cards: PastelFeatureCard[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  /** Single row of 2 (default) or stack on small screens */
  columns?: 1 | 2;
};

/**
 * BharatGo-style pastel split cards — copy left, cartoon illustration right.
 * Matches Capture.PNG layout (peach + sky cards with 3D-style characters).
 */
export function BharatGoPastelFeatureCards({
  cards,
  eyebrow,
  title,
  subtitle,
  className,
  columns = 2,
}: BharatGoPastelFeatureCardsProps) {
  return (
    <section className={cn("bharatgo-section py-14 sm:py-16 lg:py-20", className)}>
      <div className="container px-4 sm:px-6">
        {title ? (
          <BharatGoSectionHeader
            eyebrow={eyebrow}
            title={title}
            subtitle={subtitle}
            className="mb-10 sm:mb-12"
          />
        ) : null}

        <div
          className={cn(
            "grid gap-5 sm:gap-6",
            columns === 2 ? "lg:grid-cols-2" : "max-w-2xl mx-auto"
          )}
        >
          {cards.map((card, index) => {
            const styles = toneStyles[card.tone];
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  "bharatgo-pastel-card flex flex-col overflow-hidden rounded-3xl border p-6 sm:p-8",
                  styles.card
                )}
              >
                <div className="grid flex-1 items-center gap-6 lg:grid-cols-[1fr_minmax(200px,46%)] lg:gap-6">
                  <div className="flex flex-col justify-center lg:pr-2">
                    <h3 className="font-poppins text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {card.description}
                    </p>
                    {card.ctaLabel && card.ctaHref ? (
                      <Button
                        variant="outline"
                        className={cn(
                          "mt-6 h-11 w-fit rounded-full border-2 px-6 font-semibold shadow-sm",
                          styles.button
                        )}
                        asChild
                      >
                        <Link to={card.ctaHref}>
                          {card.ctaLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                  <div className="bharatgo-pastel-illustration flex min-h-[180px] items-center justify-center sm:min-h-[200px] lg:justify-end">
                    {card.productVisual ? (
                      renderProductVisual(card.productVisual, "compact")
                    ) : card.illustration ? (
                      <MarketingIllustrationFrame
                        tone={card.tone}
                        className="w-full max-w-[360px] border-white/60 bg-white/50 shadow-sm"
                      >
                        {card.illustration}
                      </MarketingIllustrationFrame>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
