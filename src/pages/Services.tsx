import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, FileText, CheckCircle, BarChart3, Users, Briefcase, Database, PenTool, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const services = [
  {
    icon: Search,
    title: "Executive Search",
    shortDesc: "Precision-driven hiring for leadership roles",
    fullDesc: "Confidential, precision-driven hiring for leadership and CXO roles with deep behavioral and capability assessments.",
  },
  {
    icon: FileText,
    title: "Resume Processing",
    shortDesc: "Professional resume restructuring and optimization",
    fullDesc: "Professional restructuring, formatting, ATS optimization, and thorough quality checks for candidate resumes.",
  },
  {
    icon: CheckCircle,
    title: "Candidate Screening",
    shortDesc: "Structured assessments and cultural fit analysis",
    fullDesc: "Structured assessments including skill checks, communication evaluation, and cultural fit analysis.",
  },
  {
    icon: BarChart3,
    title: "Skill Mapping",
    shortDesc: "Competency mapping and workforce optimization",
    fullDesc: "Competency mapping to identify role-specific skills, optimize workforce planning, and enhance productivity.",
  },
  {
    icon: Users,
    title: "Candidate–Client Coordination",
    shortDesc: "End-to-end coordination and process management",
    fullDesc: "End-to-end coordination from screening to scheduling to onboarding — reducing delays and boosting efficiency.",
  },
  {
    icon: Briefcase,
    title: "Contractual Staffing",
    shortDesc: "Agile workforce solutions for temporary needs",
    fullDesc: "Agile workforce solutions for temporary, seasonal, or project-based requirements with complete process management.",
  },
  {
    icon: Database,
    title: "Database Management",
    shortDesc: "Secure and structured data management",
    fullDesc: "Secure and structured management of employee/candidate data with modern tools and analytics readiness.",
  },
  {
    icon: PenTool,
    title: "Resume Writing",
    shortDesc: "Professional resume creation services",
    fullDesc: "Professional resume creation including chronological, functional, and combination formats to maximize visibility.",
  }
];

const processSteps = [
  { step: "01", title: "Understand", desc: "Deep dive into your requirements and culture" },
  { step: "02", title: "Source", desc: "Identify and engage qualified candidates" },
  { step: "03", title: "Screen", desc: "Thorough assessment and validation" },
  { step: "04", title: "Deliver", desc: "Present shortlisted candidates and support onboarding" }
];

const Services = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">What We Do</span>
            <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl mt-2 mb-5">Our <span className="gold-text">Services</span></h1>
            <p className="hero-subtitle text-base md:text-lg text-primary-foreground/90 max-w-3xl mx-auto">
              Comprehensive recruitment solutions tailored to your <span className="gold-text">organizational needs</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore</span>
          <h2 className="font-poppins text-3xl font-semibold tracking-tight">What We Offer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on any service to learn more about how we can help your organization
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
              <Card className={`p-6 h-full card-hover group border-2 transition-all duration-300 ${
                expandedService === index 
                  ? 'border-primary shadow-xl' 
                  : 'border-transparent hover:border-primary/20'
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
      </section>

      {/* Process Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container relative">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Our Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A systematic approach to finding the perfect talent for your organization
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
                <Card className="p-6 text-center card-hover group relative overflow-hidden">
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

      {/* Why Choose Section */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { value: "500+", label: "Placements", desc: "Successful candidate placements" },
            { value: "95%", label: "Satisfaction", desc: "Client satisfaction rate" },
            { value: "48hrs", label: "Response", desc: "Average response time" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 text-center card-hover">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="font-semibold mt-2">{stat.label}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="p-12 bg-gradient-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Let's <span className="gold-text">Build Your Team Together</span></h2>
            <p className="text-primary-foreground/90">
              Get in touch to discuss your recruitment needs and discover how we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/contact">Contact Us</Link>
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
