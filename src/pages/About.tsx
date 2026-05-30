import { Card } from "@/components/ui/card";
import { CheckCircle, Users, Award, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { FadeInSection } from "@/components/marketing/FadeInSection";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { MarketingGradientSplitCta } from "@/components/marketing/MarketingGradientSplitCta";
import { MarketingCollapsibleText } from "@/components/marketing/MarketingCollapsibleText";

const About = () => {
  return (
    <MarketingLayout showGeometry>
      <Navbar />

      <MarketingPageHero
        imageSrc="/about-banner.jpg"
        align="left"
        title={<span className="gold-text">About Us</span>}
        subtitle={<>Building <span className="gold-text">structured, ethical, and scalable</span> hiring experiences.</>}
      />

      {/* Section 1: Our History */}
      <section className="marketing-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Our Journey</h2>
          <Card className="p-6 sm:p-8 md:p-12 card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
            <MarketingCollapsibleText className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Ellure was founded with a clear purpose — to bring structure, transparency, and accountability into hiring processes.
              </p>
              <p className="text-lg">
                Over the years, we have supported organisations across industries by focusing on relevance, coordination, and ethical hiring practices.
              </p>
              <p className="text-lg">
                As hiring needs evolved, Ellure Nexhire was developed as a technology platform to enable scalable, process-driven recruitment workflows.
              </p>
            </MarketingCollapsibleText>
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
      <section className="marketing-section">
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
      <section className="marketing-section">
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

      <section className="marketing-section">
        <MarketingGradientSplitCta
          headline="Ready to work with us?"
          subtitle="Structured, ethical, and scalable hiring — for teams hiring talent and professionals building careers."
          employer={{
            ctaLabel: "Get in touch",
            ctaHref: "/contact",
          }}
          applicant={{
            ctaLabel: "Explore opportunities",
            ctaHref: "/auth/register",
          }}
        />
      </section>

      <Footer />
    </MarketingLayout>
  );
};

export default About;
