import { Button } from "@/components/ui/button";
import { marketingIndustries } from "@/lib/marketingIndustries";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

export function BharatGoIndustriesSection() {
  const [activeId, setActiveId] = useState(marketingIndustries[0]?.id ?? "it");
  const active = marketingIndustries.find((i) => i.id === activeId) ?? marketingIndustries[0];
  const Icon = active?.icon;

  return (
    <section className="bharatgo-section bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          title="Designed for every industry"
          subtitle="Whether you're in IT, BFSI, pharma, telecom, or retail — Ellure NexHire helps you source, screen, and place the right talent faster."
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="marketing-snap-scroll -mx-4 grid grid-cols-2 gap-2 px-4 sm:mx-0 sm:px-0 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-2">
              {marketingIndustries.map((industry) => {
                const IndIcon = industry.icon;
                const isActive = industry.id === activeId;
                return (
                  <button
                    key={industry.id}
                    type="button"
                    onClick={() => setActiveId(industry.id)}
                    className={cn(
                      "flex min-h-[44px] w-full snap-start items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-[12px] font-semibold leading-tight transition-all active:scale-[0.98] sm:px-4 sm:text-sm lg:rounded-xl lg:px-4 lg:py-3",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <IndIcon className="h-4 w-4 shrink-0 opacity-90" />
                    <span className="line-clamp-2">{industry.title}</span>
                  </button>
                );
              })}
            </div>
            <Button variant="outline" className="mt-6 hidden rounded-full lg:inline-flex" asChild>
              <Link to="/industries">
                Know more about us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {active && Icon ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1",
                    active.accentBg
                  )}
                >
                  <Icon className={cn("h-7 w-7", active.accentIcon)} />
                </div>
                <div>
                  <h3 className="font-poppins text-xl font-semibold">{active.title}</h3>
                  <p className="mt-2 text-muted-foreground">{active.shortDesc}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">{active.fullDesc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {active.roles.slice(0, 4).map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : null}

          <Button variant="outline" className="mt-2 w-full rounded-full lg:hidden" asChild>
            <Link to="/industries">
              Know more about us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
