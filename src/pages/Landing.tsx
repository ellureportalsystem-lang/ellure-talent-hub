import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Building2, Shield, TrendingUp, FileCheck, Sparkles, ChevronLeft, ChevronRight, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FAQPreview } from "@/components/FAQPreview";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import StatsStrip from "@/components/marketing/StatsStrip";
import { FadeInSection } from "@/components/marketing/FadeInSection";

const heroSlides = [
  {
    titleLine1: "Empowering Organizations",
    titleLine2: "With",
    titleLine2Gold: "Exceptional Talent",
    subtitle: "We connect businesses with highly skilled professionals through precision-driven recruitment and industry expertise.",
  },
  {
    titleLine1: "Your Trusted Partner in",
    titleLine2: "End-to-End",
    titleLine2IsAccent: true,
    titleLine2Gold: "Recruitment Excellence",
    subtitle: "Delivering the right talent for every role, every time — with speed, accuracy, and integrity.",
  },
  {
    titleLine1: "Transforming Hiring for",
    titleLine2: "a Better,",
    titleLine2Gold: "Smarter Workforce",
    subtitle: "Structured hiring solutions tailored for IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, and more.",
  },
];

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MarketingLayout showGeometry>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary text-primary-foreground marketing-landing-hero flex items-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={`/banner-${currentSlide + 1}.jpg`}
            alt=""
            aria-hidden
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full marketing-hero-banner-img"
            draggable={false}
          />
        </AnimatePresence>
        <div className="absolute inset-0 marketing-hero-overlay" />
        
        <div className="container relative w-full py-8 md:py-10 px-4 sm:px-6">
          <motion.div className="flex flex-col justify-center z-10 w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="space-y-3 sm:space-y-6 z-10 pt-2 sm:pt-6 lg:pt-0"
              >
                <h1 className="hero-title marketing-landing-hero-title">
                  <span className="marketing-hero-title-line">
                    {heroSlides[currentSlide].titleLine1}
                  </span>
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
                <p className="hero-subtitle text-lg md:text-xl text-primary-foreground/90 text-pretty max-w-2xl">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* Static Buttons - Centered, don't change with banners */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 z-10">
              <Button size="lg" variant="secondary" className="btn-hover btn-glow text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/auth/register">
                  Join as Applicant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover btn-glow-primary text-base px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/contact">
                  Hire Talent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Static Slider indicators - Centered */}
            <div className="flex gap-2 pt-6 sm:pt-8 z-10">
              {heroSlides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentSlide 
                      ? "w-8 bg-primary-foreground" 
                      : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <StatsStrip />

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
                <Button asChild className="w-full btn-hover btn-glow shadow-md hover:shadow-xl transition-all duration-300" size="lg">
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
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 btn-hover btn-glow shadow-md hover:shadow-xl transition-all duration-300" size="lg">
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
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  Ellure NexHire connects organizations with exceptional, industry-ready talent through modern, data-driven recruitment solutions. With nearly a decade of experience across IT, Non-IT, Telecom, BFSI, Engineering, and more, we help businesses hire smarter, faster, and with confidence. Our mission is simple — deliver the right talent for the right role, every time.
                </p>
                <div className="flex justify-center mt-8">
                  <Button size="lg" className="btn-hover shadow-md hover:shadow-xl transition-all duration-300" asChild>
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
              Click on any feature card to explore its full capabilities
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card 
                  onClick={() => setExpandedFeature(expandedFeature === i ? null : i)} 
                  className={`p-5 sm:p-6 cursor-pointer marketing-card-lift group border-2 transition-all duration-300 relative overflow-hidden shadow-md ${
                    expandedFeature === i 
                      ? "border-primary shadow-2xl" 
                      : "border-border hover:border-primary/60 hover:shadow-xl"
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full transition-opacity duration-300 ${
                    expandedFeature === i ? "bg-primary/10 opacity-100" : "bg-primary/5 opacity-0 group-hover:opacity-100"
                  }`} />
                  <div className={`absolute bottom-0 left-0 w-20 h-20 rounded-tr-full transition-opacity duration-300 ${
                    expandedFeature === i ? "bg-primary/5 opacity-100" : "bg-primary/3 opacity-0 group-hover:opacity-100"
                  }`} />
                  <div className="space-y-4 relative z-10">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md group-hover:shadow-xl ${
                      expandedFeature === i ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10"
                    }`}>
                      <f.icon className={`h-7 w-7 ${expandedFeature === i ? "" : "text-primary"}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{f.title}</h3>
                    
                    <div className="overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedFeature === i ? "auto" : 0,
                          opacity: expandedFeature === i ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <p className="text-muted-foreground pb-2">{f.fullDesc}</p>
                      </motion.div>
                      <motion.p
                        initial={false}
                        animate={{
                          height: expandedFeature === i ? 0 : "auto",
                          opacity: expandedFeature === i ? 0 : 1,
                        }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="text-sm text-muted-foreground"
                      >
                        {f.shortDesc}
                      </motion.p>
                    </div>
                    
                    <p className="text-xs text-primary font-medium flex items-center gap-1">
                      {expandedFeature === i ? "Click to collapse" : "Click to expand"}
                      <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${
                        expandedFeature === i ? "rotate-90" : ""
                      }`} />
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="marketing-cta-card marketing-card-pad text-white text-center relative overflow-hidden shadow-2xl border-2 border-white/20">
              {/* CTA Banner Background */}
              <div
                className="absolute inset-0 marketing-cta-banner bg-cover bg-no-repeat"
                style={{ backgroundImage: `url(/cta-banner.jpg)` }}
                aria-hidden
              />
              <div className="absolute inset-0 marketing-cta-overlay" aria-hidden />
              <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">Ready to <span className="gold-text">Transform Your Hiring</span>?</h2>
                <p className="hero-subtitle text-white/90 text-base sm:text-lg">
                  Join hundreds of organizations that trust Ellure for their recruitment needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 w-full">
                  <Button size="lg" variant="secondary" className="btn-hover btn-glow shadow-lg w-full sm:w-auto" asChild>
                    <Link to="/contact">Get Started Today</Link>
                  </Button>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover btn-glow-primary shadow-lg w-full sm:w-auto" asChild>
                    <Link to="/services">View Our Services</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </FadeInSection>

      <FAQPreview />

      <Footer />
    </MarketingLayout>
  );
};

export default Landing;
