import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Users, Building2, Shield, TrendingUp, FileCheck, Sparkles, ChevronLeft, ChevronRight, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const heroSlides = [
  {
    title: "Empowering Organizations With Exceptional Talent",
    subtitle: "We connect businesses with highly skilled professionals through precision-driven recruitment and industry expertise.",
  },
  {
    title: "Your Trusted Partner in End-to-End Recruitment Excellence",
    subtitle: "Delivering the right talent for every role, every time — with speed, accuracy, and integrity.",
  },
  {
    title: "Transforming Hiring for a Better, Smarter Workforce",
    subtitle: "Structured hiring solutions tailored for IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, and more.",
  }
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

const trustedStats = [
  { value: "500+", label: "Successful Placements" },
  { value: "50+", label: "Corporate Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "95%", label: "Client Satisfaction" },
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
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary py-16 md:py-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center text-primary-foreground space-y-6 pb-8"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl max-w-3xl mx-auto text-primary-foreground/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button size="lg" variant="secondary" className="btn-hover text-base px-8" asChild>
                  <Link to="/auth/register">
                    Join as Applicant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover text-base px-8" asChild>
                  <Link to="/contact">
                    Hire Talent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slider indicators */}
          <div className="flex gap-2 justify-center pt-4">
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
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-background border-b">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustedStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 card-hover group cursor-pointer border-2 border-transparent hover:border-primary/20">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold">Join as Applicant</h3>
                <p className="text-muted-foreground">Create your profile and get discovered by top employers across multiple industries.</p>
                <ul className="space-y-2">
                  {["Free profile creation", "Access to top companies", "Career guidance support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full btn-hover" size="lg">
                  <Link to="/auth/register">Register Now</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 card-hover group cursor-pointer border-2 border-transparent hover:border-secondary/20">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/20">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold">Hire Talent</h3>
                <p className="text-muted-foreground">Access our curated talent pool and find perfect candidates for your organization.</p>
                <ul className="space-y-2">
                  {["Pre-screened candidates", "Industry-specific talent", "Fast turnaround time"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 btn-hover" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2">About Us</h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" />
            </div>
            <Card className="p-8 md:p-12 card-hover">
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                Ellure Consulting Services connects organizations with exceptional, industry-ready talent through modern, data-driven recruitment solutions. With nearly a decade of experience across IT, Non-IT, Telecom, BFSI, Engineering, and more, we help businesses hire smarter, faster, and with confidence. Our mission is simple — deliver the right talent for the right role, every time.
              </p>
              <div className="flex justify-center mt-8">
                <Button size="lg" className="btn-hover" asChild>
                  <Link to="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Powerful Features</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Click on any feature card to explore its full capabilities
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  onClick={() => setExpandedFeature(expandedFeature === i ? null : i)} 
                  className={`p-6 cursor-pointer card-hover group border-2 transition-all duration-300 ${
                    expandedFeature === i 
                      ? "border-primary shadow-xl" 
                      : "border-transparent hover:border-primary/20"
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      expandedFeature === i ? "bg-primary text-primary-foreground" : "bg-primary/10"
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
          
          <div className="text-center mt-10">
            <Button size="lg" variant="outline" className="btn-hover" asChild>
              <Link to="/features">
                Explore All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container">
          <Card className="p-12 bg-gradient-primary text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Hiring?</h2>
              <p className="text-primary-foreground/90 text-lg">
                Join hundreds of organizations that trust Ellure for their recruitment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" variant="secondary" className="btn-hover" asChild>
                  <Link to="/contact">Get Started Today</Link>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                  <Link to="/services">View Our Services</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
