import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { MarketingNavMegaPanel } from "@/components/layout/MarketingNavMegaPanel";
import type { MegaMenuConfig } from "@/lib/marketingNavMegaConfig";
import { cn } from "@/lib/utils";

type MarketingNavMegaDropdownProps = {
  label: string;
  config: MegaMenuConfig;
  triggerClassName?: string;
};

const CLOSE_DELAY_MS = 180;

/** Hover mega menu; clicking the label navigates to the section page */
export function MarketingNavMegaDropdown({ label, config, triggerClassName }: MarketingNavMegaDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <Popover
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) setOpen(false);
      }}
    >
      <div
        className="relative"
        onMouseEnter={() => {
          clearCloseTimer();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <PopoverAnchor asChild>
          <Link
            to={config.viewAllHref}
            className={cn(
              "inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium outline-none transition-colors",
              open && "bg-primary/5 text-primary",
              triggerClassName
            )}
            aria-expanded={open}
            onClick={() => setOpen(false)}
          >
            {label}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
              aria-hidden
            />
          </Link>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={10}
          avoidCollisions
          collisionPadding={12}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-[100] w-auto max-w-[calc(100vw-1.5rem)] border-0 bg-transparent p-0 shadow-none"
        >
          <MarketingNavMegaPanel config={config} />
        </PopoverContent>
      </div>
    </Popover>
  );
}
