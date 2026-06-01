import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/ui/shader-background";
import { HeroCandidatePreview } from "@/components/marketing/HeroCandidatePreview";
import { HeroTypewriterHeadline } from "@/components/marketing/HeroTypewriterHeadline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/** BharatGo-style split hero with light shader backdrop */
export function BharatGoHero() {
  return (
    <section className="bharatgo-hero relative -mt-14 overflow-hidden bg-[#f3f8fc] pb-[calc(3rem+1cm)] pt-[calc(3.5rem+1.5rem+1cm)] sm:-mt-[4.25rem] sm:pb-[calc(4rem+1cm)] sm:pt-[calc(4.25rem+2rem+1cm)] lg:pb-[calc(5rem+1cm)]">
      <ShaderBackground className="pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" aria-hidden />

      <div className="container relative z-[1] px-4 sm:px-6">
        <div className="grid items-center gap-11 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center lg:text-left"
          >
            <h1 className="font-poppins text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              <span className="block">Hire exceptional talent in</span>
              <span className="mt-1 block min-h-[1.2em] text-primary sm:min-h-[1.15em]">
                <HeroTypewriterHeadline />
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Ellure NexHire connects employers and candidates through structured hiring workflows.
              No complex setups — register, search, and hire with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                className="h-12 min-h-[48px] rounded-full px-8 text-base font-semibold shadow-md active:scale-[0.98]"
                asChild
              >
                <Link to="/auth/register">
                  Start for FREE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-h-[48px] rounded-full border-2 bg-background/80 px-8 text-base font-semibold backdrop-blur-sm active:scale-[0.98]"
                asChild
              >
                <Link to="/features">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {["Free applicant profiles", "No credit card for candidates", "Enterprise-ready security"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              <HeroCandidatePreview variant="light" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
