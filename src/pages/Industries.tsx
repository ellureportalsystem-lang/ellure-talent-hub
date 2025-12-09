import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Code, Briefcase, Headphones, ShoppingCart, DollarSign, HardHat, Pill, ArrowRight, CheckCircle, TrendingUp, Users, Award } from "lucide-react";
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
    title: "IT",
    shortDesc: "Technology and software development",
    fullDesc: "Comprehensive recruitment solutions for software developers, engineers, architects, DevOps specialists, cloud experts, and IT leadership roles across all technology stacks.",
    roles: ["Software Developer", "Full Stack Engineer", "DevOps Engineer", "Cloud Architect", "IT Manager"]
  },
  {
    icon: Briefcase,
    title: "Non-IT",
    shortDesc: "Business operations and administration",
    fullDesc: "Recruitment for administrative, HR, finance, operations, marketing, and management roles across various industries and organizational levels.",
    roles: ["HR Executive", "Finance Manager", "Operations Head", "Marketing Specialist", "Business Analyst"]
  },
  {
    icon: Headphones,
    title: "ITES",
    shortDesc: "IT-enabled services and BPO",
    fullDesc: "Specialized hiring for customer support, technical support, data entry, back office operations, and process management roles in the ITES sector.",
    roles: ["Customer Support", "Technical Support", "Data Entry Operator", "Process Associate", "Team Leader"]
  },
  {
    icon: Headphones,
    title: "Telecom",
    shortDesc: "Telecommunications and networking",
    fullDesc: "Expert recruitment for telecom engineers, network specialists, RF engineers, sales executives, and technical support roles in the telecommunications industry.",
    roles: ["Network Engineer", "RF Engineer", "Telecom Sales", "Technical Support", "Infrastructure Manager"]
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    shortDesc: "Online retail and digital marketplaces",
    fullDesc: "Talent acquisition for e-commerce operations, logistics, digital marketing, customer service, and management roles in the rapidly growing online retail sector.",
    roles: ["E-commerce Manager", "Logistics Coordinator", "Digital Marketing", "Customer Service", "Operations Head"]
  },
  {
    icon: DollarSign,
    title: "BFSI",
    shortDesc: "Banking, financial services, and insurance",
    fullDesc: "Strategic hiring for banking operations, financial analysis, insurance sales, risk management, and compliance roles in the BFSI sector.",
    roles: ["Relationship Manager", "Financial Analyst", "Insurance Advisor", "Risk Manager", "Compliance Officer"]
  },
  {
    icon: HardHat,
    title: "Construction",
    shortDesc: "Infrastructure and real estate",
    fullDesc: "Recruitment for civil engineers, site engineers, project managers, quantity surveyors, and construction management professionals.",
    roles: ["Civil Engineer", "Site Engineer", "Project Manager", "Quantity Surveyor", "Safety Officer"]
  },
  {
    icon: Pill,
    title: "Pharmaceutical",
    shortDesc: "Healthcare and pharmaceutical industry",
    fullDesc: "Specialized hiring for pharmaceutical sales, medical representatives, quality control, R&D, and regulatory affairs professionals.",
    roles: ["Medical Representative", "Pharma Sales", "Quality Control", "R&D Scientist", "Regulatory Affairs"]
  }
];

const Industries = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">Sectors We Serve</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6">Industries We Serve</h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Specialized recruitment expertise across diverse sectors
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="container py-16">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Expertise</span>
          <h2 className="text-3xl font-bold">Our Sector Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on any industry to explore our capabilities and sample roles
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
              <Card className="p-8 text-center card-hover group border-2 border-transparent hover:border-primary/20 h-full">
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

      {/* Why Choose Ellure Section */}
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
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Why Us</span>
            <h2 className="text-3xl font-bold">Why Work With Ellure?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deep sector knowledge enables better candidate matching and faster placements
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Industry Expertise", desc: "8+ years of deep sector knowledge" },
              { icon: Users, title: "Talent Network", desc: "Access to pre-screened candidates" },
              { icon: CheckCircle, title: "Quality Focus", desc: "Rigorous screening processes" },
              { icon: Award, title: "Track Record", desc: "95% client satisfaction rate" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center card-hover group">
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

      {/* Stats Section */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { value: "50+", label: "Industry Partners", desc: "Trusted by leading organizations" },
            { value: "1000+", label: "Successful Placements", desc: "Across all sectors" },
            { value: "95%", label: "Client Satisfaction", desc: "High retention rates" },
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
                <h3 className="font-semibold mt-2">{stat.label}</h3>
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
            <h2 className="text-3xl font-bold">Looking for Talent in Your Industry?</h2>
            <p className="text-primary-foreground/90">
              Let's discuss your specific sector requirements and find the perfect candidates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                <Link to="/services">View Services</Link>
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
