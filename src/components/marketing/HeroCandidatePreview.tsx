import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroCandidatePreviewProps = {
  className?: string;
  /** Light section styling (default). Use "hero" only on dark banner backgrounds. */
  variant?: "light" | "hero";
};

/** Decorative product-style preview — not wired to dashboard routes */
export function HeroCandidatePreview({ className, variant = "light" }: HeroCandidatePreviewProps) {
  const isHero = variant === "hero";

  return (
    <motion.div
      className={cn("relative mx-auto w-full max-w-md lg:max-w-none", className)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className={cn(
            "rounded-2xl bg-card p-4 sm:p-5",
            isHero
              ? "border border-white/20 bg-white/95 shadow-2xl shadow-primary/20 backdrop-blur-md"
              : "border-2 border-border shadow-xl"
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                AR
              </div>
              <div>
                <p className="font-semibold text-foreground">Ananya Rao</p>
                <p className="text-xs text-muted-foreground">Senior Data Analyst</p>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
              <Star className="h-3.5 w-3.5 fill-current" />
              94% match
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <MapPin className="h-3 w-3" />
              Pune
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1">
              <Building2 className="h-3 w-3" />
              5+ years
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {["Python", "SQL", "Power BI", "ETL"].map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[10px] font-medium">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3 text-center">
            <div>
              <p className="text-lg font-bold text-primary">12</p>
              <p className="text-[10px] text-muted-foreground">Applications</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">3</p>
              <p className="text-[10px] text-muted-foreground">Shortlisted</p>
            </div>
            <div>
              <p className="text-lg font-bold text-secondary">Live</p>
              <p className="text-[10px] text-muted-foreground">Status</p>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className={cn(
            "absolute -right-2 -top-3 rounded-xl px-3 py-2 shadow-lg sm:-right-6",
            isHero ? "border border-white/25 bg-white/90 backdrop-blur-sm" : "border border-border bg-card"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground">Smart match</p>
              <p className="text-xs font-semibold text-foreground">Role fit: High</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={cn(
            "absolute -bottom-4 -left-2 rounded-xl px-3 py-2 shadow-lg sm:-left-6",
            isHero ? "border border-white/25 bg-white/90 backdrop-blur-sm" : "border border-border bg-card"
          )}
        >
          <p className="text-[10px] text-muted-foreground">Pipeline</p>
          <p className="text-sm font-bold text-foreground">Screening → Offer</p>
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-secondary/25 blur-2xl"
        aria-hidden
      />
    </motion.div>
  );
}
