import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, Users, Award, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        {/* Full-sized Banner Background */}
        <div 
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url(/about-banner.jpg)`,
          }}
        />
        {/* Subtle overlay for text readability - natural banner appearance */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        
        <div className="container relative">
          <div className="flex items-center py-8">
            {/* Text Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-6 z-10"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"><span className="gold-text">About Us</span></h1>
              <p className="text-xl text-white/90">
                Building <span className="gold-text">structured, ethical, and scalable</span> hiring experiences.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: Our History */}
      <section className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Our Journey</h2>
          <Card className="p-8 md:p-12 card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Ellure was founded with a clear purpose — to bring structure, transparency, and accountability into hiring processes.
              </p>
              <p className="text-lg">
                Over the years, we have supported organisations across industries by focusing on relevance, coordination, and ethical hiring practices.
              </p>
              <p className="text-lg">
                As hiring needs evolved, Ellure Nexhire was developed as a technology platform to enable scalable, process-driven recruitment workflows.
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Section 2: Our Mission */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <Card className="p-8 card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
              <p className="text-lg text-muted-foreground leading-relaxed">
                To enable organisations and candidates to experience efficient, transparent, and ethical hiring through structured workflows and technology-enabled collaboration.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Our Vision */}
      <section className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <Card className="p-8 card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
            <p className="text-lg text-muted-foreground leading-relaxed">
              To become a trusted hiring ecosystem where employers and candidates engage through clarity, relevance, and long-term value.
            </p>
          </Card>
        </motion.div>
      </section>

      {/* Section 4: Our Values */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "Ethical Hiring", desc: "Transparency and fairness at every stage" },
                { title: "Quality Over Quantity", desc: "Relevance matters more than volume" },
                { title: "Accountability", desc: "Clear ownership and timely communication" },
                { title: "Collaboration", desc: "Working closely with clients and candidates" },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Why Choose Ellure */}
      <section className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Ellure</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "10+ Years of Deep Industry Knowledge",
                description: "Hands-on experience supporting hiring across multiple sectors and roles."
              },
              {
                icon: Users,
                title: "Strong Process & Platform Approach",
                description: "Human coordination supported by structured workflows and technology."
              },
              {
                icon: CheckCircle,
                title: "Quality-Focused Delivery",
                description: "Shortlists based on relevance, not bulk submissions."
              },
              {
                icon: Award,
                title: "Higher Success Ratio",
                description: "Consistent closures driven by clarity, coordination, and follow-through."
              },
              {
                icon: Heart,
                title: "Ready to Work With You",
                description: "Flexible, responsive, and aligned to your hiring timelines.",
                fullWidth: true
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={item.fullWidth ? "md:col-span-2" : ""}
              >
                <Card className="p-6 card-hover group border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
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
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container py-10">
        <Card className="p-12 text-white text-center relative overflow-hidden">
          {/* CTA Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(/about-cta-banner.jpg)`,
            }}
          />
          {/* Natural overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to <span className="gold-text">Work With Us</span>?</h2>
            <p className="text-white/90">
              Let's build <span className="gold-text">hiring outcomes</span> that are <span className="gold-text">structured, ethical, and scalable</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="btn-hover" asChild>
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-hover" asChild>
                <Link to="/services">Learn More</Link>
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
