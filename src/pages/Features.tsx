import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileCheck, TrendingUp, Users, Shield, Building2, Zap, ArrowRight, CheckCircle, Search, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: FileCheck,
    title: "Application Lifecycle Management",
    shortDesc: "Tracks candidate journey end-to-end",
    fullDesc: "Tracks candidate journey end-to-end. Mandatory for any serious hiring portal. HRs understand this immediately. Complete visibility into every stage of the application process from submission to final decision.",
    benefits: ["End-to-end candidate tracking", "Stage-by-stage visibility", "HR-friendly interface", "Complete application history"]
  },
  {
    icon: Search,
    title: "Context-Based Matching Engine",
    shortDesc: "Matches candidates by relevance, not keywords",
    fullDesc: "Matches candidates by relevance, not keywords. Strong differentiator when explained properly. Avoids fake 'AI' claims. Intelligent matching that understands context and role requirements for better candidate fit.",
    benefits: ["Relevance-based matching", "Context understanding", "Better candidate fit", "Transparent process"]
  },
  {
    icon: MessageSquare,
    title: "HR–Recruiter Collaboration Workspace",
    shortDesc: "Private feedback & notes for ethical hiring",
    fullDesc: "Private feedback & notes. Ethical, transparent hiring. Aligns with Ellure's brand values. Secure workspace for HR and recruiters to collaborate, share feedback, and maintain transparent communication throughout the hiring process.",
    benefits: ["Private feedback system", "Secure collaboration", "Transparent communication", "Ethical hiring practices"]
  },
  {
    icon: Users,
    title: "Controlled Bulk Actions",
    shortDesc: "Saves recruiter time with enterprise-safe limits",
    fullDesc: "Saves recruiter time. Prevents spam & misuse. Enterprise-safe. Controlled bulk operations with built-in limits to ensure quality and prevent abuse while maintaining efficiency for recruiters.",
    benefits: ["Time-saving bulk operations", "Spam prevention", "Enterprise-safe limits", "Quality control"]
  },
  {
    icon: TrendingUp,
    title: "Essential Hiring Analytics",
    shortDesc: "Actionable metrics without dashboard overload",
    fullDesc: "Actionable metrics only. No dashboard overload. Builds trust with MNCs. Focused analytics that provide meaningful insights without overwhelming users with unnecessary data.",
    benefits: ["Actionable insights", "Clean dashboard", "MNC-ready", "Trust-building metrics"]
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security & Compliance",
    shortDesc: "Non-negotiable for MNC clients",
    fullDesc: "Non-negotiable for MNC clients. Data protection & access control. Silent credibility booster. Enterprise-grade security with comprehensive data protection, access controls, and compliance features that MNCs require.",
    benefits: ["Data protection", "Access control", "MNC compliance", "Enterprise security"]
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
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        {/* Full-sized Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(/features-banner.jpg)`,
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"><span className="gold-text">Platform Features</span></h1>
              <p className="text-xl text-white/90">
                Everything you need to manage recruitment at scale with <span className="gold-text">efficiency and precision</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Explore</span>
          <h2 className="text-3xl font-bold">Powerful Features</h2>
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
              <Card className={`p-6 h-full card-hover group border-2 transition-all duration-300 shadow-md hover:shadow-xl ${
                expandedFeature === index 
                  ? 'border-primary shadow-xl' 
                  : 'border-border hover:border-primary/60'
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
      </section>

      {/* Stats Section */}
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
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Results</span>
            <h2 className="text-3xl font-bold">Platform Impact</h2>
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
                <Card className="p-6 text-center card-hover group border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
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
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Enterprise Ready</span>
          <h2 className="text-3xl font-bold">Built for Scale & Security</h2>
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
              <Card className="p-8 text-center card-hover group border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
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
      <section className="container py-10">
        <Card className="p-12 text-white text-center relative overflow-hidden">
          {/* CTA Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/features-cta-banner.jpg)`,
            }}
          />
          {/* Natural overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to <span className="gold-text">Experience</span> These <span className="gold-text">Features</span>?</h2>
            <p className="text-white/90">
              Get started today and <span className="gold-text">transform</span> your recruitment process.
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
