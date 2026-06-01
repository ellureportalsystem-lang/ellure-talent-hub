import {
  Building2,
  Code,
  DollarSign,
  Factory,
  Headphones,
  Pill,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TrustBrand = {
  name: string;
  icon: LucideIcon;
};

const TRUST_BRANDS: TrustBrand[] = [
  { name: "IT & Technology", icon: Code },
  { name: "BFSI", icon: DollarSign },
  { name: "ITES & BPO", icon: Headphones },
  { name: "E-Commerce", icon: ShoppingCart },
  { name: "Pharma & Life Sciences", icon: Pill },
  { name: "Manufacturing", icon: Factory },
  { name: "Telecom", icon: Building2 },
  { name: "Engineering", icon: Building2 },
];

type TrustLogoMarqueeProps = {
  className?: string;
  title?: string;
};

export function TrustLogoMarquee({
  className,
  title = "Trusted across leading industries",
}: TrustLogoMarqueeProps) {
  const track = [...TRUST_BRANDS, ...TRUST_BRANDS];

  return (
    <section
      className={cn(
        "border-y border-[#d4e2fc] bg-[#E9F0FF] py-8 md:py-10",
        className
      )}
      aria-label="Industries we serve"
    >
      <div className="container px-4 sm:px-6">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      </div>

      <div className="marketing-logo-marquee relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#E9F0FF] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#E9F0FF] to-transparent sm:w-24" />

        <div className="marketing-logo-marquee-track flex w-max items-center gap-4 sm:gap-6">
          {track.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border/80 bg-background px-5 py-3 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-foreground/80">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
