import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileCheck, TrendingUp, Users, Shield, Building2, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: FileCheck,
    title: "Smart Application Management",
    shortDesc: "Multi-step registration and automated profile creation",
    fullDesc: "Multi-step registration, automated profile creation, resume parsing, and instant dashboard access. Streamline your applicant onboarding process with intelligent form handling and automatic data extraction.",
    benefits: ["Automated profile generation", "Resume parsing", "Instant dashboard access", "Multi-format support"]
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    shortDesc: "Track hiring performance and real-time metrics",
    fullDesc: "Track hiring performance, applicant flow, skill clusters, and real-time metrics. Make data-driven decisions with comprehensive dashboards and detailed reports on your recruitment pipeline.",
    benefits: ["Real-time metrics", "Skill clustering", "Performance tracking", "Custom reports"]
  },
  {
    icon: Users,
    title: "Bulk Operations",
    shortDesc: "Upload thousands of applicants and manage at scale",
    fullDesc: "Upload thousands of applicants via CSV/Excel, export structured reports, and manage data at scale. Handle large-scale recruitment drives efficiently with our bulk processing capabilities.",
    benefits: ["CSV/Excel import", "Mass exports", "Batch processing", "Data validation"]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    shortDesc: "Role-based access control and encrypted data",
    fullDesc: "Role-based access control, audit logging, encrypted data, and SOC-2-ready workflows. Your data security is our priority with enterprise-grade protection and compliance features.",
    benefits: ["Role-based access", "Audit logs", "Data encryption", "Compliance ready"]
  },
  {
    icon: Building2,
    title: "Client Collaboration Tools",
    shortDesc: "Share candidate folders and manage communication",
    fullDesc: "Share candidate folders, collect feedback, and manage communication efficiently. Enable seamless collaboration between recruiters and hiring managers with dedicated client portals.",
    benefits: ["Candidate folders", "Feedback system", "Secure sharing", "Real-time updates"]
  },
  {
    icon: Zap,
    title: "Smart Matching Engine",
    shortDesc: "AI-powered resume analysis and recommendations",
    fullDesc: "AI-powered resume analysis and automated skill-based candidate recommendations. Leverage machine learning to find the perfect candidates faster and improve match quality.",
    benefits: ["AI-powered matching", "Skill analysis", "Auto recommendations", "Quality scoring"]
  }
];

const stats = [
  { value: "80%", label: "Time Saved", desc: "In recruitment processes" },
  { value: "95%", label: "Accuracy", desc: "In candidate matching" },
  { value: "50K+", label: "Profiles", desc: "Managed efficiently" },
  { value: "24/7", label: "Support", desc: "Available when you need" }
];

const Features = () => {
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-10 md:py-14 overflow-hidden min-h-[300px] md:min-h-[350px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/features-banner.jpg" 
            alt="Features Banner"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
          <div className="absolute top-0 left-0 right-0 h-2/3 bg-gradient-to-b from-black/80 via-black/60 to-transparent" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid opacity-5" />
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-sm font-medium uppercase tracking-wider text-white/90 drop-shadow-md">Capabilities</span>
            <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl mt-2 mb-5 text-white drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              <span className="text-[#FFD700]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>Platform Features</span>
            </h1>
            <p className="hero-subtitle text-base md:text-lg text-white/95 max-w-3xl mx-auto drop-shadow-md" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Everything you need to manage recruitment at scale with <span className="text-[#FFD700] font-semibold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>efficiency and precision</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
        <div className="container relative">
          <motion.div 
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore</span>
            <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any feature to explore its capabilities and key benefits
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                className="cursor-pointer"
              >
                <Card className={`p-6 h-full card-hover group border-2 transition-all duration-300 ${
                  expandedFeature === index 
                    ? 'border-primary/50 shadow-2xl bg-gradient-to-br from-card to-primary/5 scale-[1.02]' 
                    : 'border-primary/10 hover:border-primary/40 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl'
              }`}>
                <div className="space-y-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    expandedFeature === index ? "bg-primary text-primary-foreground" : "bg-primary/10"
                  }`}>
                    <feature.icon className={`h-7 w-7 ${expandedFeature === index ? "" : "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  
                  <div className="overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedFeature === index ? "auto" : 0,
                        opacity: expandedFeature === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-4"
                    >
                      <p className="text-muted-foreground">{feature.fullDesc}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Key Benefits:</p>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                    <motion.p
                      initial={false}
                      animate={{
                        height: expandedFeature === index ? 0 : "auto",
                        opacity: expandedFeature === index ? 0 : 1,
                      }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="text-sm text-muted-foreground"
                    >
                      {feature.shortDesc}
                    </motion.p>
                  </div>
                  
                  <p className="text-xs text-primary font-medium flex items-center gap-1">
                    {expandedFeature === index ? "Click to collapse" : "Click to expand"}
                    <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${
                      expandedFeature === index ? "rotate-90" : ""
                    }`} />
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Results</span>
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Platform Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real results from organizations using our platform
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center card-hover group">
                  <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <h3 className="font-semibold mt-2">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Enterprise */}
      <section className="container py-16">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Enterprise Ready</span>
          <h2 className="font-poppins text-3xl font-semibold tracking-tight">Built for Scale & Security</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade features designed for scale and security
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and compliance ready" },
            { icon: Zap, title: "Lightning Fast", desc: "Optimized performance at any scale" },
            { icon: Users, title: "Collaborative", desc: "Built for teams and stakeholders" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 text-center card-hover group">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
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
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Ready to <span className="gold-text">Experience These Features</span>?</h2>
            <p className="text-primary-foreground/90">
              Get started today and transform your recruitment process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/auth/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
