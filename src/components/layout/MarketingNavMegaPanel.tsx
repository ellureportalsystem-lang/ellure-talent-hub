import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavMegaItem } from "@/lib/marketingNavData";

type MarketingNavMegaPanelProps = {
  items: NavMegaItem[];
  viewAllHref: string;
  viewAllLabel: string;
};

export const MarketingNavMegaPanel = ({
  items,
  viewAllHref,
  viewAllLabel,
}: MarketingNavMegaPanelProps) => (
  <div className="w-full p-4 md:w-[640px] lg:w-[720px]">
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <Link
              to={item.href}
              className={cn(
                "flex gap-3 rounded-lg border border-transparent p-3 no-underline outline-none transition-all duration-200",
                "hover:border-primary/20 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold leading-tight text-foreground">{item.title}</p>
                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
    <div className="mt-3 flex justify-end border-t border-border/60 pt-3">
      <Link
        to={viewAllHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        {viewAllLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);
