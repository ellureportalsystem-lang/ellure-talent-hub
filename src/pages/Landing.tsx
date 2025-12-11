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
    image: "/banner-1.jpg",
    title: "Empowering Organizations With Exceptional Talent",
    subtitle: "We connect businesses with highly skilled professionals through precision-driven recruitment and industry expertise.",
  },
  {
    image: "/banner-3.jpg",
    title: "Transforming Hiring for a Better, Smarter Workforce",
    subtitle: "Structured hiring solutions tailored for IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, and more.",
  },
  {
    image: "/banner-2.jpg",
    title: "Your Trusted Partner in End-to-End Recruitment Excellence",
    subtitle: "Delivering the right talent for every role, every time — with speed, accuracy, and integrity.",
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
      <section className="relative overflow-hidden min-h-[450px] md:min-h-[500px] lg:min-h-[550px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img 
                src={heroSlides[currentSlide].image} 
                alt={`Banner ${currentSlide + 1}`}
                className="w-full h-full object-cover"
                style={currentSlide === 2 ? { objectPosition: 'center 20%' } : { objectPosition: 'center center' }}
              />
              {/* Subtle overlay for better text readability - positioned at top */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/60 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Decorative elements - reduced opacity */}
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        <div className="container relative z-10 py-8 md:py-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 md:space-y-5"
            >
              {/* Text Content */}
              <div className={`text-white transition-all duration-500 ${
                currentSlide === 0 
                  ? 'text-left md:text-left lg:mr-auto lg:max-w-[50%] xl:max-w-[45%] lg:pl-12 xl:pl-16' 
                  : currentSlide === 1 
                  ? 'text-left md:text-left lg:mr-auto lg:max-w-[50%] xl:max-w-[45%] lg:pl-12 xl:pl-16'
                  : 'text-left md:text-left lg:mr-auto lg:max-w-[50%] xl:max-w-[45%] lg:pl-12 xl:pl-16'
              }`}>
                <motion.h1 
                  className="hero-title text-3xl md:text-4xl lg:text-5xl leading-tight font-semibold drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  {currentSlide === 0 ? (
                    <>
                      Empowering Organizations With <span className="text-[#FFD700]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Exceptional Talent</span>
                    </>
                  ) : currentSlide === 1 ? (
                    <>
                      Transforming Hiring for a <span className="text-[#FFD700]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>Better, Smarter</span> Workforce
                    </>
                  ) : (
                    <>
                      Your Trusted Partner in <span className="text-[#FFD700]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>End-to-End</span> Recruitment Excellence
                    </>
                  )}
                </motion.h1>
                <motion.p 
                  className="hero-subtitle text-base md:text-lg mt-3 md:mt-4 text-white/95 drop-shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>
              </div>
              
              {/* Buttons - Animate with slides */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center pt-2 md:pt-4"
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
          <div className="flex gap-2 justify-center pt-3">
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
      <section className="bg-gradient-to-b from-background to-muted/20 border-b">
        <div className="container py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {trustedStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-4 md:p-5 text-center border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="container py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 md:p-10 card-hover group cursor-pointer border-2 border-primary/10 hover:border-primary/40 transition-all duration-300 bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-xl">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 border border-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Join as Applicant</h3>
                <p className="text-muted-foreground leading-relaxed">Create your profile and get discovered by top employers across multiple industries.</p>
                <ul className="space-y-3">
                  {["Free profile creation", "Access to top companies", "Career guidance support"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full btn-hover mt-4" size="lg">
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
            <Card className="p-8 md:p-10 card-hover group cursor-pointer border-2 border-secondary/10 hover:border-secondary/40 transition-all duration-300 bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-xl">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/20 border border-secondary/20">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">Hire Talent</h3>
                <p className="text-muted-foreground leading-relaxed">Access our curated talent pool and find perfect candidates for your organization.</p>
                <ul className="space-y-3">
                  {["Pre-screened candidates", "Industry-specific talent", "Fast turnaround time"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 btn-hover mt-4" size="lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10 md:mb-12">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Who We Are</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mt-2">About Us</h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full" />
            </div>
            <Card className="p-8 md:p-12 card-hover border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-lg bg-gradient-to-br from-card to-card/80">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                Ellure NexHire connects organizations with exceptional, industry-ready talent through modern, data-driven recruitment solutions. With nearly a decade of experience across IT, Non-IT, Telecom, BFSI, Engineering, and more, we help businesses hire smarter, faster, and with confidence. Our mission is simple — deliver the right talent for the right role, every time.
              </p>
              <div className="flex justify-center mt-8 md:mt-10">
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
            <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mt-2">Powerful Features</h2>
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
                      ? "border-primary/50 shadow-xl bg-gradient-to-br from-card to-primary/5" 
                      : "border-primary/10 hover:border-primary/40 bg-gradient-to-br from-card to-card/50 shadow-sm"
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
      <section className="py-16 md:py-20">
        <div className="container">
          <Card className="p-12 md:p-16 bg-gradient-primary text-primary-foreground text-center relative overflow-hidden border-2 border-primary/20 shadow-2xl">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
              <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight whitespace-nowrap">Ready to <span className="text-[#FFD700]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Transform Your Hiring</span>?</h2>
              <p className="hero-subtitle text-primary-foreground/95 text-lg md:text-xl leading-relaxed">
                Join hundreds of organizations that trust Ellure for their recruitment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" variant="secondary" className="btn-hover shadow-lg" asChild>
                  <Link to="/contact">Get Started Today</Link>
                </Button>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover shadow-lg" asChild>
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
