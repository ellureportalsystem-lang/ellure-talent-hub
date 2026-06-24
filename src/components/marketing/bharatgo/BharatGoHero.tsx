import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/ui/shader-background";
import { HeroCandidatePreview } from "@/components/marketing/HeroCandidatePreview";
import { HeroTypewriterHeadline } from "@/components/marketing/HeroTypewriterHeadline";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/** Split hero — deep blue / teal brand backdrop (shader clipped below navbar) */
export function BharatGoHero() {
  return (
    <section className="bharatgo-hero relative -mt-14 overflow-hidden bg-[#010c7d] sm:-mt-[4.25rem] lg:min-h-[680px]">
      {/* Mesh lives below the fixed navbar only — no bleed into nav */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 bottom-0 top-14 sm:top-[4.25rem]">
          <ShaderBackground variant="dark" className="absolute inset-0 bharatgo-hero-shader" />
          <div className="bharatgo-hero-plasma-orb bharatgo-hero-plasma-orb--1" />
          <div className="bharatgo-hero-plasma-orb bharatgo-hero-plasma-orb--2" />
          <div className="bharatgo-hero-plasma-vignette" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#010c7d]/88 via-[#023d7a]/45 to-[#0566CD]/18" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#010c7d]/35 via-transparent to-[#010c7d]/82" />
        </div>
      </div>

      <div className="container relative z-[1] flex min-h-[500px] flex-col justify-center px-4 pb-11 pt-[calc(3.5rem+1.5rem)] sm:min-h-[540px] sm:px-6 sm:pb-12 sm:pt-[calc(4.25rem+1.75rem)] lg:min-h-[680px] lg:pb-14 lg:pt-[calc(4.25rem+2.5rem)]">
        <div className="grid w-full translate-y-1 items-center gap-9 sm:gap-10 sm:translate-y-2 lg:grid-cols-2 lg:gap-14 lg:translate-y-3 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center lg:text-left"
          >
            <h1 className="bharatgo-hero-headline font-poppins text-4xl font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-[3.25rem]">
              <span className="block">Hire exceptional talent in</span>
              <span className="mt-1 block min-h-[1.2em] sm:min-h-[1.15em]">
                <HeroTypewriterHeadline className="text-sky-200" />
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-200/95 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:mt-5 sm:text-xl">
              <span className="sm:hidden">
                Structured hiring workflows for employers & candidates — register and hire with confidence.
              </span>
              <span className="hidden sm:inline">
                Ellure TalentHub connects employers and candidates through structured hiring workflows. No complex setups
                — register, search, and hire with confidence.
              </span>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                className="h-12 min-h-[48px] rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 active:scale-[0.98]"
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
                className="h-12 min-h-[48px] rounded-full border-2 border-white/25 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white active:scale-[0.98]"
                asChild
              >
                <Link to="/features">
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            <ul className="mt-6 grid grid-cols-2 justify-center gap-x-4 gap-y-2 text-xs text-slate-200/80 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 sm:text-sm lg:justify-start">
              {["Free applicant profiles", "No credit card for candidates", "Enterprise-ready security"].map((item) => (
                <li
                  key={item}
                  className={cn(
                    "flex items-center gap-2 sm:shrink-0",
                    item === "No credit card for candidates" && "col-span-2 sm:col-span-1"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A9EB0]" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-[21rem] sm:max-w-[23rem] lg:max-w-[26rem]">
              <HeroCandidatePreview variant="hero" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
