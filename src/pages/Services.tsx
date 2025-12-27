import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, BarChart3, Users, Briefcase, ArrowRight, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const services = [
  {
    icon: FileText,
    title: "Resume Intake & Validation",
    shortDesc: "Structured resume submission and basic validation",
    fullDesc: "Structured resume submission and basic validation to ensure profiles are relevant and ready for hiring workflows.",
  },
  {
    icon: CheckCircle,
    title: "Profile Relevance Screening",
    shortDesc: "Initial screening based on skills and role fit",
    fullDesc: "Initial screening based on skills, experience alignment, notice period, and role fit — without claiming deep interviews.",
  },
  {
    icon: BarChart3,
    title: "Skill & Role Mapping",
    shortDesc: "Accurate mapping of candidate skills to role requirements",
    fullDesc: "Accurate mapping of candidate skills to role requirements to improve shortlist quality and relevance.",
  },
  {
    icon: Users,
    title: "Candidate–Client Coordination",
    shortDesc: "End-to-end coordination including interview scheduling",
    fullDesc: "End-to-end coordination including interview scheduling, feedback sharing, offer updates, and joiner follow-ups.",
  },
  {
    icon: Briefcase,
    title: "Hiring Process Support",
    shortDesc: "Operational support across hiring stages",
    fullDesc: "Operational support across hiring stages such as interview flow management, timeline follow-ups, and closure assistance.",
  },
  {
    icon: Shield,
    title: "Ethical Hiring Enablement",
    shortDesc: "Promoting transparency and accountability",
    fullDesc: "Promoting transparency, timely communication, and accountability across candidates and employers throughout the hiring process.",
  }
];

const processSteps = [
  { step: "01", title: "Understand", desc: "Role requirements, expectations, and timelines are aligned." },
  { step: "02", title: "Source", desc: "Relevant profiles are sourced through structured intake." },
  { step: "03", title: "Screen", desc: "Profiles are screened and mapped for relevance and fit." },
  { step: "04", title: "Deliver", desc: "Shortlists, coordination, and hiring support are delivered through the platform." }
];

const Services = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        {/* Full-sized Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(/services-banner.jpg)`,
          }}
        />
        {/* Subtle overlay for text readability - natural banner appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        
        <div className="container relative">
          <div className="flex items-center justify-center py-8">
            {/* Text Content - Center */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-6 z-10 text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Our <span className="gold-text">Services</span></h1>
              <p className="text-xl text-white/90">
                Structured <span className="gold-text">hiring solutions</span> for employers and candidates.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: What We Do */}
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold">What We Do</h2>
          <p className="text-muted-foreground text-lg">
            We support hiring outcomes through structured coordination, relevance screening, and ethical process management — without replacing internal HR or recruitment ownership.
          </p>
        </motion.div>
      </section>

      {/* Section 2: Our Services */}
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
          <p className="text-muted-foreground text-lg">
            Explore what we offer
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setExpandedService(expandedService === index ? null : index)}
              className="cursor-pointer"
            >
              <Card className={`p-6 h-full card-hover group border-2 transition-all duration-300 shadow-md hover:shadow-xl ${
                expandedService === index 
                  ? 'border-primary shadow-xl' 
                  : 'border-border hover:border-primary/60'
              }`}>
                <div className="space-y-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    expandedService === index ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}>
                    <service.icon className={`h-7 w-7 ${expandedService === index ? "" : "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-xl">{service.title}</h3>
                  
                  <div className="overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedService === index ? "auto" : 0,
                        opacity: expandedService === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-4"
                    >
                      <p className="text-muted-foreground">{service.fullDesc}</p>
                      <Button asChild className="w-full btn-hover">
                        <Link to="/contact">Get Started</Link>
                      </Button>
                    </motion.div>
                    <motion.p
                      initial={false}
                      animate={{
                        height: expandedService === index ? 0 : "auto",
                        opacity: expandedService === index ? 0 : 1,
                      }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="text-sm text-muted-foreground"
                    >
                      {service.shortDesc}
                    </motion.p>
                  </div>
                  
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    {expandedService === index ? "Click to collapse" : "Click to expand"}
                    <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${
                      expandedService === index ? "rotate-90" : ""
                    }`} />
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Optional Footnote */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Additional services such as resume writing may be provided upon candidate request.
          </p>
        </div>
      </section>

      {/* Mandatory Clarity Line */}
      <section className="container pb-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Platform features such as application tracking and analytics are available within the Ellure Nexhire system.
          </p>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container relative">
          <motion.div 
            className="text-center space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our hiring process
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center card-hover group relative overflow-hidden border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
                  <div className="space-y-4 relative">
                    <div className="text-5xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors duration-300">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-xl">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-10">
        <Card className="p-12 text-white text-center relative overflow-hidden">
          {/* CTA Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/services-cta-banner.jpg)`,
            }}
          />
          {/* Natural overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to <span className="gold-text">Get Started</span>?</h2>
            <p className="text-white/90">
              Let's discuss your <span className="gold-text">hiring needs</span> and discover how we can <span className="gold-text">support</span> your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
