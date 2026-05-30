import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Building2, Shield, TrendingUp, FileCheck, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FAQPreview } from "@/components/FAQPreview";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import StatsStrip from "@/components/marketing/StatsStrip";
import { FadeInSection } from "@/components/marketing/FadeInSection";
import { FeaturesBentoGrid } from "@/components/marketing/FeaturesBentoGrid";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { MarketingGradientSplitCta } from "@/components/marketing/MarketingGradientSplitCta";
import { LandingHeroCarousel } from "@/components/marketing/LandingHeroCarousel";
import { PlatformPreviewSection } from "@/components/marketing/PlatformPreviewSection";
import { MarketingCollapsibleText } from "@/components/marketing/MarketingCollapsibleText";

const features = [
  {
    icon: FileCheck,
    title: "Smart Application Management",
    shortDesc: "Multi-step registration and automated profile creation",
    fullDesc: "Multi-step registration, automated profile creation, resume parsing, and instant dashboard access."
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    shortDesc: "Track hiring performance and real-time metrics",
    fullDesc: "Track hiring performance, applicant flow, skill clusters, and real-time metrics."
  },
  {
    icon: Users,
    title: "Bulk Operations",
    shortDesc: "Upload thousands of applicants and manage at scale",
    fullDesc: "Upload thousands of applicants via CSV/Excel, export structured reports, and manage data at scale."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    shortDesc: "Role-based access control and encrypted data",
    fullDesc: "Role-based access control, audit logging, encrypted data, and SOC-2-ready workflows."
  },
  {
    icon: Building2,
    title: "Client Collaboration Tools",
    shortDesc: "Share candidate folders and manage communication",
    fullDesc: "Share candidate folders, collect feedback, and manage communication efficiently."
  },
  {
    icon: Sparkles,
    title: "Smart Matching Engine",
    shortDesc: "AI-powered resume analysis and recommendations",
    fullDesc: "AI-powered resume analysis and automated skill-based candidate recommendations."
  }
];

const Landing = () => {
  return (
    <MarketingLayout showGeometry>
      <Navbar />

      <LandingHeroCarousel />

      <StatsStrip />

      <PlatformPreviewSection />

      <TestimonialsSection />

      <FadeInSection className="container py-10 md:py-12 px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="marketing-card-pad marketing-card-lift group cursor-pointer border-2 border-border shadow-lg hover:shadow-2xl hover:border-primary/60 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 shadow-lg group-hover:shadow-xl">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold">Join as Applicant</h3>
                <p className="text-muted-foreground text-base leading-relaxed">Create your profile and get discovered by top employers across multiple industries.</p>
                <ul className="space-y-3">
                  {["Free profile creation", "Access to top companies", "Career guidance support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="btn-hover btn-glow h-12 min-h-[48px] w-full shadow-md transition-all duration-300 hover:shadow-xl active:scale-[0.98] lg:h-10" size="lg">
                  <Link to="/auth/register">Register Now</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="marketing-card-pad marketing-card-lift group cursor-pointer border-2 border-border shadow-lg hover:shadow-2xl hover:border-secondary/60 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/20 shadow-lg group-hover:shadow-xl">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-semibold">Hire Talent</h3>
                <p className="text-muted-foreground text-base leading-relaxed">Access our curated talent pool and find perfect candidates for your organization.</p>
                <ul className="space-y-3">
                  {["Pre-screened candidates", "Industry-specific talent", "Fast turnaround time"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-secondary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="btn-hover btn-glow h-12 min-h-[48px] w-full bg-secondary text-secondary-foreground shadow-md transition-all duration-300 hover:bg-secondary/90 hover:shadow-xl active:scale-[0.98] lg:h-10" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </FadeInSection>

      <FadeInSection className="relative py-10 md:py-12 overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Who We Are</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mt-3">About Us</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 rounded-full" />
            </div>
            <Card className="marketing-card-pad marketing-card-lift shadow-xl border-2 border-border hover:border-primary/60 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <MarketingCollapsibleText className="text-lg leading-relaxed text-muted-foreground text-center lg:text-center">
                  <p>
                    Ellure NexHire connects organizations with exceptional, industry-ready talent through modern, data-driven recruitment solutions. With nearly a decade of experience across IT, Non-IT, Telecom, BFSI, Engineering, and more, we help businesses hire smarter, faster, and with confidence. Our mission is simple — deliver the right talent for the right role, every time.
                  </p>
                </MarketingCollapsibleText>
                <div className="flex justify-center mt-8">
                  <Button size="lg" className="btn-hover h-12 min-h-[48px] w-full max-w-xs shadow-md transition-all duration-300 hover:shadow-xl active:scale-[0.98] sm:w-auto lg:h-10" asChild>
                    <Link to="/about">
                      Learn More About Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </FadeInSection>

      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <div className="container">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">What We Offer</span>
            <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mt-2">Powerful Features</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-base">
              Enterprise-grade tools to manage hiring at scale — structured, secure, and built for teams.
            </p>
          </motion.div>

          <FeaturesBentoGrid features={features} />
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" className="btn-hover shadow-md hover:shadow-lg" asChild>
              <Link to="/features">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <div className="container">
          <MarketingGradientSplitCta
            headline="Ready to transform your hiring?"
            subtitle="Whether you're hiring or job hunting — Ellure NexHire supports both journeys with one trusted platform."
            employer={{
              ctaLabel: "Get started today",
            }}
            applicant={{
              ctaLabel: "Build your profile",
            }}
          />
        </div>
      </FadeInSection>

      <FAQPreview />

      <Footer />
    </MarketingLayout>
  );
};

export default Landing;
