import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { marketingIndustries } from "@/lib/marketingIndustries";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function IndustryDetailPanel({ industryId }: { industryId: string }) {
  const industry = marketingIndustries.find((i) => i.id === industryId);
  if (!industry) return null;

  const Icon = industry.icon;

  return (
    <motion.div
      key={industryId}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="h-full border-2 border-border bg-card p-5 shadow-lg sm:p-7 md:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ring-1",
              industry.accentBg
            )}
          >
            <Icon className={cn("h-10 w-10", industry.accentIcon)} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary">Sector expertise</p>
              <h3 className="mt-1 font-poppins text-2xl font-semibold tracking-tight sm:text-3xl">
                {industry.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{industry.shortDesc}</p>
            </div>
            <p className="text-base leading-relaxed text-foreground/90">{industry.fullDesc}</p>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Sample roles we recruit for</h4>
              <div className="flex flex-wrap gap-2">
                {industry.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-sm text-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row lg:flex-row">
              <Button asChild className="btn-hover h-12 min-h-[48px] w-full sm:w-auto lg:w-auto">
                <Link to="/contact">
                  Discuss requirements
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-hover h-12 min-h-[48px] w-full sm:w-auto lg:w-auto">
                <Link to="/services">View services</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function IndustriesTabbedSelector() {
  const defaultId = marketingIndustries[0]?.id ?? "it";
  const [activeId, setActiveId] = useState(defaultId);

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const triggerRefHandlers = useMemo(
    () =>
      Object.fromEntries(
        marketingIndustries.map((i) => [
          i.id,
          (el: HTMLButtonElement | null) => {
            triggerRefs.current[i.id] = el;
          },
        ])
      ) as Record<string, (el: HTMLButtonElement | null) => void>,
    []
  );

  const scrollActiveIntoView = (id: string) => {
    const el = triggerRefs.current[id];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <Tabs
      value={activeId}
      onValueChange={(v) => {
        setActiveId(v);
        scrollActiveIntoView(v);
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(240px,280px)_1fr] lg:gap-8">
        <TabsList
          className={cn(
            // Mobile/tablet: normal grid (no sideways scrolling)
            "-mx-4 grid h-auto w-full grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-2 px-4",
            "sm:mx-0 sm:grid-cols-3 sm:px-2",
            // Laptop+: vertical list
            "lg:mx-0 lg:flex lg:flex-col lg:items-stretch lg:gap-2 lg:overflow-visible lg:p-2"
          )}
        >
          {marketingIndustries.map((industry) => {
            const Icon = industry.icon;
            return (
              <TabsTrigger
                key={industry.id}
                value={industry.id}
                ref={triggerRefHandlers[industry.id]}
                className={cn(
                  "h-auto min-h-[44px] w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left active:scale-[0.98] data-[state=active]:bg-background data-[state=active]:shadow-md",
                  "whitespace-normal",
                  "lg:w-full lg:justify-start lg:gap-3 lg:px-4 lg:py-3.5 lg:text-left",
                  "lg:data-[state=active]:border lg:data-[state=active]:border-primary/20"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 lg:h-11 lg:w-11 lg:rounded-xl",
                    industry.accentBg
                  )}
                >
                  <Icon className={cn("h-4 w-4 lg:h-5 lg:w-5", industry.accentIcon)} />
                </span>
                {/* Laptop+: title only (no subtitle) */}
                <span className="hidden min-w-0 flex-1 text-left lg:block">
                  <span className="block break-words text-sm font-semibold leading-snug">
                    {industry.title}
                  </span>
                </span>
                {/* Mobile/tablet: title only */}
                <span className="min-w-0 flex-1 text-left lg:hidden">
                  <span className="block break-words text-[12px] font-semibold leading-tight sm:text-sm">
                    {industry.title}
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="min-w-0">
          {marketingIndustries.map((industry) => (
            <TabsContent
              key={industry.id}
              value={industry.id}
              className="mt-0 focus-visible:outline-none"
            >
              <IndustryDetailPanel industryId={industry.id} />
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  );
}
