import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PortalBanner } from "@/services/portalContentService";
import { cn } from "@/lib/utils";

type PortalBannerStripProps = {
  banners: PortalBanner[];
  className?: string;
  fallback?: {
    title: string;
    body?: string;
    ctaLabel?: string;
    ctaLink?: string;
  };
};

export function PortalBannerStrip({ banners, className, fallback }: PortalBannerStripProps) {
  const [index, setIndex] = useState(0);
  const items =
    banners.length > 0
      ? banners
      : fallback
        ? [
            {
              id: "fallback",
              title: fallback.title,
              body: fallback.body ?? null,
              cta_label: fallback.ctaLabel ?? null,
              cta_link: fallback.ctaLink ?? null,
              image_url: null,
            } as PortalBanner,
          ]
        : [];

  if (items.length === 0) return null;

  const banner = items[index];
  const hasMultiple = items.length > 1;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded border border-[#e8e8e8] bg-white p-6 md:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      {banner.image_url && (
        <img
          src={banner.image_url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none"
        />
      )}
      <div className="relative max-w-lg">
        <p className="text-base font-semibold text-[#333]">{banner.title}</p>
        {banner.body && <p className="mt-1 text-sm text-[#666]">{banner.body}</p>}
        {banner.cta_label && banner.cta_link && (
          <Button asChild className="mt-4 bg-[#0566CD] hover:bg-[#0066c0] text-white rounded h-9 text-sm">
            {banner.cta_link.startsWith("http") ? (
              <a href={banner.cta_link} target="_blank" rel="noreferrer">
                {banner.cta_label}
              </a>
            ) : (
              <Link to={banner.cta_link}>{banner.cta_label}</Link>
            )}
          </Button>
        )}
      </div>
      {hasMultiple && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border bg-white p-1 shadow-sm"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border bg-white p-1 shadow-sm"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            aria-label="Next banner"
          >
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </>
      )}
    </div>
  );
}
