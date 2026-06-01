import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  MarketingIllustrationFrame,
} from "@/components/marketing/MarketingIllustrationFrame";
import type { PastelCardTone } from "@/components/marketing/bharatgo/BharatGoPastelFeatureCards";
import { renderProductVisual, type ProductVisualVariant } from "@/lib/marketingProductVisuals";

type MarketingSaasPageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  /** Photo banner (b1, s1, g1…) */
  imageSrc?: string;
  /** NexHire product UI mockup */
  productVisual?: ProductVisualVariant;
  /** 3D cartoon illustration */
  illustration?: ReactNode;
  illustrationTone?: PastelCardTone;
};

/** Light inner-page hero (BharatGo-style) */
export function MarketingSaasPageHero({
  eyebrow,
  title,
  subtitle,
  align = "center",
  imageSrc,
  productVisual,
  illustration,
  illustrationTone = "peach",
}: MarketingSaasPageHeroProps) {
  const centered = align === "center";
  const hasVisual = Boolean(imageSrc || productVisual || illustration);

  return (
    <section className="bharatgo-page-hero border-b border-border/60 bg-[#E9F0FF]/50 pb-10 pt-2 sm:pb-14">
      <div className="container px-4 sm:px-6">
        <div
          className={cn(
            "grid items-center gap-8",
            hasVisual && "lg:grid-cols-2 lg:gap-12",
            centered && !hasVisual && "mx-auto max-w-3xl text-center"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(centered && !hasVisual && "mx-auto", !centered && "lg:text-left")}
          >
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
            ) : null}
            <h1 className="font-poppins mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
            ) : null}
          </motion.div>
          {productVisual ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex justify-center lg:justify-end"
            >
              {renderProductVisual(productVisual, "hero")}
            </motion.div>
          ) : illustration ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex justify-center lg:justify-end"
            >
              <MarketingIllustrationFrame tone={illustrationTone}>{illustration}</MarketingIllustrationFrame>
            </motion.div>
          ) : imageSrc ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="marketing-banner-bleed w-full max-w-lg overflow-hidden rounded-2xl border border-border shadow-lg">
                <img
                  src={imageSrc}
                  alt=""
                  className="marketing-photo-banner marketing-photo-banner--card h-[clamp(220px,32vw,300px)] w-full"
                  loading="eager"
                />
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
