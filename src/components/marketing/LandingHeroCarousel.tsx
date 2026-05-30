import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const heroSlides = [
  {
    titleLine1: "Empowering Organizations",
    titleLine2: "With",
    titleLine2Gold: "Exceptional Talent",
    subtitle:
      "We connect businesses with highly skilled professionals through precision-driven recruitment and industry expertise.",
  },
  {
    titleLine1: "Your Trusted Partner in",
    titleLine2: "End-to-End",
    titleLine2IsAccent: true,
    titleLine2Gold: "Recruitment Excellence",
    subtitle:
      "Delivering the right talent for every role, every time — with speed, accuracy, and integrity.",
  },
  {
    titleLine1: "Transforming Hiring for",
    titleLine2: "a Better,",
    titleLine2Gold: "Smarter Workforce",
    subtitle:
      "Structured hiring solutions tailored for IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, and more.",
  },
];

/** Homepage hero — rotating banner-1/2/3.jpg with slide copy */
export function LandingHeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-primary text-primary-foreground marketing-landing-hero marketing-hero-under-nav max-lg:justify-center lg:min-h-0">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={`/banner-${currentSlide + 1}.jpg`}
          alt=""
          aria-hidden
          initial={{ opacity: 0, x: reducedMotion ? 0 : 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reducedMotion ? 0 : -100 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="marketing-hero-banner-img absolute inset-0 h-full w-full"
          draggable={false}
        />
      </AnimatePresence>
      <div className="absolute inset-0 marketing-hero-overlay" aria-hidden />

      <div className="container relative w-full px-4 py-10 sm:px-6 sm:py-12 md:py-10">
        <motion.div className="z-10 flex w-full max-w-3xl flex-col justify-center max-lg:mx-auto max-lg:items-center max-lg:text-center lg:items-start lg:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="z-10 space-y-3 pt-2 sm:space-y-6 sm:pt-6 lg:pt-0"
            >
              <h1 className="hero-title marketing-landing-hero-title text-white max-lg:items-center">
                <span className="marketing-hero-title-line">{heroSlides[currentSlide].titleLine1}</span>
                {heroSlides[currentSlide].titleLine2 ? (
                  <span
                    className={
                      heroSlides[currentSlide].titleLine2IsAccent
                        ? "marketing-hero-title-line marketing-hero-title-line--accent gold-text"
                        : "marketing-hero-title-line"
                    }
                  >
                    {heroSlides[currentSlide].titleLine2}
                  </span>
                ) : null}
                <span className="marketing-hero-title-line marketing-hero-title-line--accent gold-text">
                  {heroSlides[currentSlide].titleLine2Gold}
                </span>
              </h1>
              <p className="hero-subtitle mx-auto max-w-2xl text-pretty text-base text-primary-foreground/90 sm:text-lg md:text-xl lg:mx-0">
                {heroSlides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="z-10 flex w-full max-w-md flex-col gap-3 pt-6 sm:max-w-none sm:flex-row sm:gap-4 sm:pt-8 lg:max-w-none">
            <Button
              size="lg"
              variant="secondary"
              className="btn-hover btn-glow h-12 min-h-[48px] w-full px-6 text-base active:scale-[0.98] sm:w-auto sm:px-8"
              asChild
            >
              <Link to="/auth/register">
                Join as Applicant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              className="btn-hover btn-glow-primary h-12 min-h-[48px] w-full bg-white px-6 text-base text-primary hover:bg-white/90 active:scale-[0.98] sm:w-auto sm:px-8"
              asChild
            >
              <Link to="/contact">
                Hire Talent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="z-10 flex justify-center gap-1 pt-6 sm:gap-2 sm:pt-8 lg:justify-start">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === currentSlide ? "true" : undefined}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:scale-95"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? "w-8 bg-primary-foreground"
                      : "w-2 bg-primary-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
