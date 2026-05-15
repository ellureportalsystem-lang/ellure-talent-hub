import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MarketingCtaCardProps = {
  imageSrc: string;
  children: ReactNode;
  className?: string;
};

const MarketingCtaCard = ({ imageSrc, children, className }: MarketingCtaCardProps) => (
  <Card
    className={cn(
      "marketing-cta-card p-6 sm:p-8 md:p-10 lg:p-12 text-white text-center relative overflow-hidden shadow-2xl border-2 border-white/20",
      className
    )}
  >
    <div
      className="absolute inset-0 marketing-cta-banner bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${imageSrc})` }}
      aria-hidden
    />
    <div className="absolute inset-0 marketing-cta-overlay" aria-hidden />
    <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">{children}</div>
  </Card>
);

export default MarketingCtaCard;
