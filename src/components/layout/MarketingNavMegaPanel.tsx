import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MegaMenuConfig } from "@/lib/marketingNavMegaConfig";

const featuredTone = {
  peach: "bg-[#FDF0E9] border-[#f5ddd0]",
  sky: "bg-[#E9F0FF] border-[#d4e2fc]",
};

/** Shopify-style mega menu: intro + link columns + featured card */
export function MarketingNavMegaPanel({ config }: { config: MegaMenuConfig }) {
  return (
    <div className="w-[min(100vw-2rem,920px)] overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px] lg:grid-cols-[200px_1fr_1fr_260px]">
        {/* Intro column */}
        <div className="hidden border-r border-border/60 bg-muted/30 p-5 lg:block lg:p-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{config.eyebrow}</p>
          <p className="mt-2 font-poppins text-lg font-bold leading-snug text-foreground">{config.title}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{config.description}</p>
          <Link
            to={config.viewAllHref}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {config.viewAllLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Link columns */}
        <div className="col-span-2 grid gap-0 border-r border-border/60 sm:grid-cols-2 md:col-span-1 lg:col-span-2">
          {config.columns.map((column) => (
            <div key={column.heading} className="border-b border-border/60 p-4 sm:border-b-0 sm:p-5 lg:p-6">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {column.heading}
              </p>
              <ul className="space-y-0.5">
                {column.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg py-2 pl-1 pr-2 text-sm transition-colors",
                        "hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    >
                      <span className="font-medium text-foreground group-hover:text-primary">{item.title}</span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/0 transition-all group-hover:text-primary group-hover:opacity-100 opacity-0" />
                    </Link>
                    <p className="hidden pl-1 text-xs text-muted-foreground lg:line-clamp-1">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured card (Shopify-style promo) */}
        <div className={cn("p-4 lg:p-5", featuredTone[config.featured.tone])}>
          <div className="marketing-banner-bleed overflow-hidden rounded-lg border border-border/50 bg-white shadow-sm">
            <img
              src={config.featured.imageSrc}
              alt=""
              className="marketing-photo-banner marketing-photo-banner--tile aspect-[16/10] w-full"
              loading="lazy"
            />
          </div>
          <p className="mt-3 font-poppins text-sm font-bold leading-snug text-foreground">{config.featured.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{config.featured.description}</p>
          <Link
            to={config.featured.ctaHref}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {config.featured.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile / tablet intro */}
      <div className="border-t border-border/60 bg-muted/20 px-4 py-3 lg:hidden">
        <Link to={config.viewAllHref} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          {config.viewAllLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
