import { Button } from "@/components/ui/button";
import { ShaderBackground } from "@/components/ui/shader-background";
import { HeroCandidatePreview } from "@/components/marketing/HeroCandidatePreview";
import { HeroTypewriterHeadline } from "@/components/marketing/HeroTypewriterHeadline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/** BharatGo-style split hero with animated shader backdrop */
export function BharatGoHero() {
  return (
    <section className="bharatgo-hero relative -mt-14 overflow-hidden bg-[#080818] pb-[calc(4.5rem+1.2cm)] pt-[calc(4.5rem+2rem+1.2cm)] sm:-mt-[4.25rem] sm:pb-[calc(5rem+1.2cm)] sm:pt-[calc(5rem+2.5rem+1.2cm)] lg:min-h-[calc(100vh-4.25rem)] lg:pb-[calc(6rem+1.2cm)] lg:pt-[calc(5.5rem+2.5rem+1.2cm)]">
      <ShaderBackground variant="dark" className="pointer-events-none bharatgo-hero-shader" />
      <div className="bharatgo-hero-plasma-orb bharatgo-hero-plasma-orb--1" aria-hidden />
      <div className="bharatgo-hero-plasma-orb bharatgo-hero-plasma-orb--2" aria-hidden />
      <div className="bharatgo-hero-plasma-vignette" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060612]/86 via-[#0a0820]/42 to-[#12082a]/12"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060612]/28 via-transparent to-[#060612]/78"
        aria-hidden
      />

      <div className="container relative z-[1] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-lg:mx-auto max-lg:max-w-xl max-lg:text-center lg:text-left"
          >
            <h1 className="bharatgo-hero-headline font-poppins text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              <span className="block">Hire exceptional talent in</span>
              <span className="mt-1 block min-h-[1.2em] sm:min-h-[1.15em]">
                <HeroTypewriterHeadline className="text-violet-200" />
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-300/95 sm:text-xl">
              Ellure NexHire connects employers and candidates through structured hiring workflows.
              No complex setups — register, search, and hire with confidence.
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
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 lg:justify-start">
              {["Free applicant profiles", "No credit card for candidates", "Enterprise-ready security"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
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
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <div
                className="pointer-events-none absolute -inset-10 rounded-3xl bg-violet-500/28 blur-[48px]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-6 rounded-2xl bg-fuchsia-500/14 blur-[28px]"
                aria-hidden
              />
              <HeroCandidatePreview variant="hero" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
