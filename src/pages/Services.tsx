import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, BarChart3, Users, Briefcase, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { ServicesFeatureList } from "@/components/marketing/ServicesFeatureList";
import { ServicesProcessTimeline } from "@/components/marketing/ServicesProcessTimeline";
import { MarketingGradientSplitCta } from "@/components/marketing/MarketingGradientSplitCta";

const services = [
  {
    icon: FileText,
    title: "Resume Intake & Validation",
    shortDesc: "Structured resume submission and basic validation",
    fullDesc:
      "Structured resume submission and basic validation to ensure profiles are relevant and ready for hiring workflows.",
  },
  {
    icon: CheckCircle,
    title: "Profile Relevance Screening",
    shortDesc: "Initial screening based on skills and role fit",
    fullDesc:
      "Initial screening based on skills, experience alignment, notice period, and role fit — without claiming deep interviews.",
  },
  {
    icon: BarChart3,
    title: "Skill & Role Mapping",
    shortDesc: "Accurate mapping of candidate skills to role requirements",
    fullDesc:
      "Accurate mapping of candidate skills to role requirements to improve shortlist quality and relevance.",
  },
  {
    icon: Users,
    title: "Candidate–Client Coordination",
    shortDesc: "End-to-end coordination including interview scheduling",
    fullDesc:
      "End-to-end coordination including interview scheduling, feedback sharing, offer updates, and joiner follow-ups.",
  },
  {
    icon: Briefcase,
    title: "Hiring Process Support",
    shortDesc: "Operational support across hiring stages",
    fullDesc:
      "Operational support across hiring stages such as interview flow management, timeline follow-ups, and closure assistance.",
  },
  {
    icon: Shield,
    title: "Ethical Hiring Enablement",
    shortDesc: "Promoting transparency and accountability",
    fullDesc:
      "Promoting transparency, timely communication, and accountability across candidates and employers throughout the hiring process.",
  },
];

const processSteps = [
  { step: "01", title: "Understand", desc: "Role requirements, expectations, and timelines are aligned." },
  { step: "02", title: "Source", desc: "Relevant profiles are sourced through structured intake." },
  { step: "03", title: "Screen", desc: "Profiles are screened and mapped for relevance and fit." },
  { step: "04", title: "Deliver", desc: "Shortlists, coordination, and hiring support are delivered through the platform." },
];

const Services = () => {
  return (
    <MarketingLayout showGeometry>
      <Navbar />

      <MarketingPageHero
        imageSrc="/services-banner.jpg"
        title={
          <>
            Our <span className="gold-text">Services</span>
          </>
        }
        subtitle={
          <>
            Structured <span className="gold-text">hiring solutions</span> for employers and candidates.
          </>
        }
      />

      <section className="marketing-section">
        <motion.div
          className="mx-auto mb-8 max-w-4xl space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold md:text-3xl">What We Do</h2>
          <p className="text-lg text-muted-foreground">
            We support hiring outcomes through structured coordination, relevance screening, and ethical process
            management — without replacing internal HR or recruitment ownership.
          </p>
        </motion.div>
      </section>

      <section className="marketing-section">
        <motion.div
          className="mb-6 space-y-3 text-center sm:mb-8 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">Our Services</h2>
          <p className="px-2 text-base text-muted-foreground sm:text-lg">
            End-to-end support — presented the way enterprise firms communicate capability.
          </p>
        </motion.div>

        <ServicesFeatureList services={services} />

        <div className="mt-6 space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Additional services such as resume writing may be provided upon candidate request.
          </p>
        </div>
      </section>

      <section className="container pb-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Platform features such as application tracking and analytics are available within the Ellure Nexhire system.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-10 md:py-14">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container relative">
          <motion.div
            className="mb-10 space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">Our hiring process — step by step, as you scroll.</p>
          </motion.div>

          <ServicesProcessTimeline steps={processSteps} />
        </div>
      </section>

      <section className="marketing-section">
        <MarketingGradientSplitCta
          headline="Ready to get started?"
          subtitle="Explore our hiring services as an employer, or register as a candidate — both paths start here."
          employer={{
            ctaLabel: "Discuss your hiring needs",
            ctaHref: "/contact",
          }}
          applicant={{
            ctaLabel: "Start your application",
            ctaHref: "/auth/register",
          }}
        />
      </section>

      <Footer />
    </MarketingLayout>
  );
};

export default Services;
