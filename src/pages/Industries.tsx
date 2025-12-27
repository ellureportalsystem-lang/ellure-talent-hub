import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Code, Headphones, ShoppingCart, DollarSign, HardHat, Pill, ArrowRight, CheckCircle, TrendingUp, Users, Award, Building2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const industries = [
  {
    icon: Code,
    title: "IT & Technology Services",
    shortDesc: "Technology and software development",
    fullDesc: "Comprehensive recruitment solutions for software developers, engineers, architects, DevOps specialists, cloud experts, and IT leadership roles across all technology stacks.",
    roles: ["Software Developer", "Full Stack Engineer", "DevOps Engineer", "Cloud Architect", "IT Manager"]
  },
  {
    icon: Headphones,
    title: "ITES & Shared Services",
    shortDesc: "IT-enabled services and BPO",
    fullDesc: "Specialized hiring for customer support, technical support, data entry, back office operations, and process management roles in the ITES sector.",
    roles: ["Customer Support", "Technical Support", "Data Entry Operator", "Process Associate", "Team Leader"]
  },
  {
    icon: DollarSign,
    title: "BFSI",
    shortDesc: "Banking, financial services, and insurance",
    fullDesc: "Strategic hiring for banking operations, financial analysis, insurance sales, risk management, and compliance roles in the BFSI sector.",
    roles: ["Relationship Manager", "Financial Analyst", "Insurance Advisor", "Risk Manager", "Compliance Officer"]
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Digital Businesses",
    shortDesc: "Online retail and digital marketplaces",
    fullDesc: "Talent acquisition for e-commerce operations, logistics, digital marketing, customer service, and management roles in the rapidly growing online retail sector.",
    roles: ["E-commerce Manager", "Logistics Coordinator", "Digital Marketing", "Customer Service", "Operations Head"]
  },
  {
    icon: Pill,
    title: "Pharmaceuticals & Life Sciences",
    shortDesc: "Healthcare and pharmaceutical industry",
    fullDesc: "Specialized hiring for pharmaceutical sales, medical representatives, quality control, R&D, and regulatory affairs professionals.",
    roles: ["Medical Representative", "Pharma Sales", "Quality Control", "R&D Scientist", "Regulatory Affairs"]
  },
  {
    icon: HardHat,
    title: "Manufacturing & Engineering",
    shortDesc: "Infrastructure and engineering",
    fullDesc: "Recruitment for engineers, project managers, quality control, production managers, and technical professionals in manufacturing and engineering sectors.",
    roles: ["Production Engineer", "Quality Engineer", "Project Manager", "Maintenance Engineer", "Process Engineer"]
  },
  {
    icon: Building2,
    title: "Telecom & Infrastructure",
    shortDesc: "Telecommunications and networking",
    fullDesc: "Expert recruitment for telecom engineers, network specialists, RF engineers, sales executives, and technical support roles in the telecommunications industry.",
    roles: ["Network Engineer", "RF Engineer", "Telecom Sales", "Technical Support", "Infrastructure Manager"]
  }
];

const Industries = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        {/* Full-sized Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(/industries-banner.jpg)`,
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"><span className="gold-text">Industries We Serve</span></h1>
              <p className="text-xl text-white/90">
                Specialised <span className="gold-text">recruitment expertise</span> across diverse sectors
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: Sector Expertise */}
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Industries We Serve</h2>
          <p className="text-muted-foreground text-lg">
            Our sector expertise
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedIndustry(index)}
              className="cursor-pointer"
            >
              <Card className="p-8 text-center card-hover group border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <industry.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground">{industry.shortDesc}</p>
                  <p className="text-xs text-primary font-medium flex items-center justify-center gap-1">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 2: Why Us */}
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
            <h2 className="text-3xl font-bold">Why Clients Choose Us</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, title: "Industry Expertise", desc: "Understanding role nuances across sectors." },
              { icon: CheckCircle, title: "Quality-Focused Screening", desc: "Relevance over volume — no bulk resumes." },
              { icon: Users, title: "Strong Talent Network", desc: "Access to active and passive candidates." },
              { icon: Award, title: "Proven Track Record", desc: "Consistent delivery and ethical hiring practices." },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center card-hover group border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Industry Partnership Stats */}
      <section className="container py-10">
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Industry Partnerships</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { value: "50+", label: "Hiring Partners", desc: "" },
            { value: "1,000+", label: "Successful Placements", desc: "" },
            { value: "95%", label: "Client Satisfaction", desc: "" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 text-center card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <h3 className="font-semibold mt-2">{stat.label}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Across multiple roles and industry verticals.
        </p>
      </section>

      {/* CTA Section */}
      <section className="container py-10">
        <Card className="p-12 text-white text-center relative overflow-hidden">
          {/* CTA Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/industries-cta-banner.jpg)`,
            }}
          />
          {/* Natural overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Looking for <span className="gold-text">talent</span> in your <span className="gold-text">industry</span>?</h2>
            <p className="text-white/90">
              Let's support your <span className="gold-text">hiring goals</span> with structured and ethical <span className="gold-text">hiring solutions</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                <Link to="/contact">Discuss Your Hiring Needs</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Industry Detail Dialog */}
      <Dialog open={selectedIndustry !== null} onOpenChange={() => setSelectedIndustry(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIndustry !== null && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Industry = industries[selectedIndustry].icon;
                      return <Industry className="h-8 w-8 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl">{industries[selectedIndustry].title}</DialogTitle>
                    <p className="text-muted-foreground">{industries[selectedIndustry].shortDesc}</p>
                  </div>
                </div>
              </DialogHeader>
              <DialogDescription className="space-y-6">
                <p className="text-base text-foreground">{industries[selectedIndustry].fullDesc}</p>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Sample Roles We Recruit For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {industries[selectedIndustry].roles.map((role, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button asChild className="flex-1 btn-hover">
                    <Link to="/contact">Discuss Requirements</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 btn-hover">
                    <Link to="/services">View Services</Link>
                  </Button>
                </div>
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Industries;
