import { HeroCandidatePreview } from "@/components/marketing/HeroCandidatePreview";
import { FadeInSection } from "@/components/marketing/FadeInSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/** Candidate profile mockup — shown below hero, not on banner */
export function PlatformPreviewSection() {
  return (
    <FadeInSection className="relative overflow-hidden border-b bg-muted/30 py-10 md:py-14">
      <div className="container px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="max-w-lg max-lg:mx-auto max-lg:text-center lg:text-left"
          >
            <span className="text-sm font-medium uppercase tracking-wider text-primary">Platform preview</span>
            <h2 className="font-poppins mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              See how candidates show up to employers
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Rich profiles, skill tags, match scores, and pipeline status — the same structured view hiring teams
              use inside Ellure NexHire.
            </p>
            <Button asChild variant="outline" className="btn-hover mt-6 h-12 min-h-[48px] w-full max-lg:mx-auto max-lg:max-w-sm active:scale-[0.98] lg:w-auto">
              <Link to="/features">
                Explore platform features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="flex justify-center max-lg:w-full max-lg:max-w-[min(100%,22rem)] max-lg:mx-auto lg:justify-end">
            <HeroCandidatePreview variant="light" />
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
