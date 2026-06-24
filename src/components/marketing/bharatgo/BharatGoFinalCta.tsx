import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Play } from "lucide-react";
import { marketingCtaImage } from "@/lib/marketingPastelColors";

const bullets = [
  "Free applicant registration",
  "No credit card required for candidates",
  "Support when you need it",
  "Cancel or change plans anytime",
];

export function BharatGoFinalCta() {
  return (
    <section className="bharatgo-section py-14 sm:py-16">
      <div className="container px-4 sm:px-6">
        <div className="bharatgo-final-cta relative min-h-[300px] overflow-hidden rounded-3xl sm:min-h-[320px]">
          <img
            src={marketingCtaImage}
            alt=""
            className="marketing-cta-bg absolute inset-0 h-full w-full"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <div className="bharatgo-final-cta-overlay bharatgo-final-cta-overlay--centered absolute inset-0" aria-hidden />

          <div className="relative z-10 flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center sm:min-h-[320px] sm:px-10 sm:py-12">
            <div className="mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-white drop-shadow-sm">
                Ready to get started?
              </p>
              <h2 className="font-poppins mt-2 text-3xl font-bold text-white drop-shadow-md sm:text-4xl">
                Create your free profile now
              </h2>
              <p className="mt-4 text-base text-white/95 drop-shadow-sm sm:text-lg">
                Try Ellure TalentHub risk-free. Build your profile or client workspace in minutes and see the
                difference.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-full px-8 font-semibold active:scale-[0.98]"
                  asChild
                >
                  <Link to="/auth/register">
                    Start free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/60 bg-white/15 px-8 font-semibold text-white backdrop-blur-sm hover:bg-white/25 active:scale-[0.98]"
                  asChild
                >
                  <Link to="/contact">
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Talk to sales
                  </Link>
                </Button>
              </div>
              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/95">
                {bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2 drop-shadow-sm">
                    <Check className="h-4 w-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
