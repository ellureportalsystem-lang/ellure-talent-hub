import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";
import { AnimatedStatValue } from "@/components/marketing/AnimatedStatValue";
import { defaultTrustedStats } from "@/components/marketing/StatsStrip";
import { useInViewOnce } from "@/hooks/useInViewOnce";

const reasons = [
  {
    title: "No complex setups",
    body: "Structured applicant registration and client onboarding — your hiring workspace is ready without IT overhead.",
  },
  {
    title: "Built for teams & scale",
    body: "Bulk CV upload, folders, role-based access, and analytics for admins and clients.",
  },
  {
    title: "AI-assisted matching",
    body: "Resume search and skill insights help recruiters shortlist faster with confidence.",
  },
  {
    title: "Simple & transparent",
    body: "Clear plans for employers; free profile creation for candidates. Pay for hiring power, not hidden fees.",
  },
];

function WhyChooseStats() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.12);

  return (
    <div ref={ref} className="mt-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary lg:text-left">
        Trusted nationwide
      </p>
      <p className="mt-1 text-center font-poppins text-lg font-bold text-foreground lg:text-left">
        Proven recruitment outcomes
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {defaultTrustedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center rounded-xl border border-[#d4e2fc] bg-white px-2.5 py-3 text-center shadow-sm sm:px-3 sm:py-3.5"
            >
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-1.5 sm:h-9 sm:w-9">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
              </div>
              <p className="font-poppins text-lg font-bold text-primary sm:text-xl lg:text-2xl">
                <AnimatedStatValue value={stat.value} active={inView} />
              </p>
              <p className="mt-0.5 text-[10px] font-medium leading-snug text-muted-foreground sm:text-[11px]">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function BharatGoWhyChoose() {
  return (
    <section className="bharatgo-section py-16 sm:py-20 lg:py-24">
      <div className="container px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <BharatGoSectionHeader
              align="left"
              eyebrow="Why choose us"
              title="Why choose Ellure NexHire?"
              subtitle="Say goodbye to scattered spreadsheets and hello to one platform for applicants, clients, and your recruitment team."
            />
            <ul className="mt-8 space-y-5">
              {reasons.map((item, index) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Button className="mt-8 rounded-full px-6" variant="outline" asChild>
              <Link to="/about">Know more about us</Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <MarketingIllustrationFrame tone="sky" className="mx-auto w-full max-w-lg shadow-md lg:mx-0">
              <MarketingCartoonArt variant="candidates" size="showcase" />
            </MarketingIllustrationFrame>
            <WhyChooseStats />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
