import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, CheckCircle, Users, Award, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const timeline = [
  { year: "2016", title: "Founded", desc: "Ellure Consulting Services established in Pune" },
  { year: "2018", title: "Expansion", desc: "Expanded services to IT and BFSI sectors" },
  { year: "2020", title: "Growth", desc: "500+ successful placements milestone" },
  { year: "2024", title: "Innovation", desc: "Launched digital recruitment platform" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">Our Story</span>
            <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl mt-2 mb-5">About <span className="gold-text">Ellure Consulting Services</span></h1>
            <p className="hero-subtitle text-base md:text-lg text-primary-foreground/90 max-w-3xl mx-auto">
              A decade of excellence in connecting organizations with <span className="gold-text">exceptional talent</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 md:p-12 card-hover">
            <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                <strong className="text-foreground">Ellure Consulting Services</strong>, founded on April 1st, 2016, is a specialized recruitment and talent solutions firm committed to connecting organizations with high-quality professionals. Over the past decade, we have built a strong reputation for delivering strategic hiring solutions across IT, Non-IT, Engineering, Telecom, E-Commerce, BFSI, and various emerging sectors.
              </p>
              <p className="text-lg">
                Our core philosophy is simple — <strong className="text-foreground">understand businesses deeply, understand people even better, and bring them together for lasting success.</strong>
              </p>
              <p className="text-lg">
                We combine domain expertise, data-driven insights, and human intelligence to identify the perfect talent fit. Our consultants collaborate with clients to understand role expectations, team dynamics, and organizational priorities — ensuring faster hiring cycles and higher success ratios.
              </p>
              <p className="text-lg">
                Ellure Consulting Services continues to support organizations in building strong, reliable, and future-ready teams with transparency, integrity, and long-term commitment.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Timeline Section */}
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
            <span className="text-sm font-medium text-primary uppercase tracking-wider">History</span>
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center card-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{item.year}</div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="container py-16">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Foundation</span>
          <h2 className="font-poppins text-3xl font-semibold tracking-tight">Our Foundation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "To deliver precision-driven recruitment solutions that empower organizations to build exceptional teams and help professionals achieve their career aspirations.",
              color: "primary"
            },
            {
              icon: Eye,
              title: "Our Vision",
              desc: "To be the most trusted recruitment partner, recognized for integrity, innovation, and impact in connecting the right talent with the right opportunities.",
              color: "secondary"
            },
            {
              icon: Heart,
              title: "Our Values",
              desc: "Transparency, Integrity, Excellence, Commitment, and a people-first approach in everything we do.",
              color: "success"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 text-center card-hover group h-full">
                <div className="space-y-6">
                  <div className={`h-16 w-16 rounded-full bg-${item.color}/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:bg-${item.color}/20`}>
                    <item.icon className={`h-8 w-8 text-${item.color}`} />
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
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
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Why Choose Ellure?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              What sets us apart in the recruitment industry
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: CheckCircle,
                title: "10+ Years of Expertise",
                description: "A decade of experience in delivering quality recruitment solutions across diverse industries."
              },
              {
                icon: Users,
                title: "Deep Industry Knowledge",
                description: "Specialized understanding of IT, Non-IT, BFSI, Telecom, E-Commerce, and Engineering sectors."
              },
              {
                icon: Award,
                title: "Quality Over Quantity",
                description: "We focus on finding the perfect fit rather than filling positions quickly with mismatched candidates."
              },
              {
                icon: TrendingUp,
                title: "Higher Success Ratios",
                description: "Our thorough screening process ensures better placement success and longer candidate retention."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 card-hover group">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="p-12 bg-gradient-primary text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-poppins text-3xl font-semibold tracking-tight">Ready to <span className="gold-text">Work With Us</span>?</h2>
            <p className="text-primary-foreground/90">
              Whether you're looking for talent or seeking opportunities, we're here to help.
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

      <Footer />
    </div>
  );
};

export default About;
