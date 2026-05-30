import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import MarketingPageHero from "@/components/marketing/MarketingPageHero";
import { IndustriesTabbedSelector } from "@/components/marketing/IndustriesTabbedSelector";
import { MarketingGradientSplitCta } from "@/components/marketing/MarketingGradientSplitCta";

const Industries = () => {
  return (
    <MarketingLayout showGeometry>
      <Navbar />

      <MarketingPageHero
        imageSrc="/industries-banner.jpg"
        title={
          <>
            <span className="gold-text">Industries We Serve</span>
          </>
        }
        subtitle={
          <>
            Specialised <span className="gold-text">recruitment expertise</span> across diverse sectors
          </>
        }
      />

      <section className="marketing-section">
        <motion.div
          className="mb-8 space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Explore by industry</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Select a sector to view expertise, typical roles, and how we support your hiring goals — no pop-ups, just a
            clear enterprise view.
          </p>
        </motion.div>

        <IndustriesTabbedSelector />
      </section>

      <section className="relative overflow-hidden py-10">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container relative">
          <motion.div
            className="mb-8 space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold">Why Clients Choose Us</h2>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <Card className="card-hover group border-2 border-border p-6 text-center shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <motion.div
          className="mb-8 space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold">Industry Partnerships</h2>
        </motion.div>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
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
              <Card className="card-hover border-2 border-border p-8 text-center shadow-md transition-all duration-300 hover:border-primary/60 hover:shadow-xl">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <h3 className="mt-2 font-semibold">{stat.label}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">Across multiple roles and industry verticals.</p>
      </section>

      <section className="marketing-section">
        <MarketingGradientSplitCta
          headline="Looking for talent in your industry?"
          subtitle="Sector-specific hiring support — or register to be discovered by employers in your field."
          employer={{
            title: "Hire for your sector",
            description:
              "Discuss role requirements and timelines with our team — structured, ethical hiring across IT, BFSI, pharma, and more.",
            ctaLabel: "Discuss hiring needs",
            ctaHref: "/contact",
          }}
          applicant={{
            description: "Build a complete profile and get matched to opportunities in the industries you care about.",
            ctaLabel: "Join talent network",
          }}
        />
      </section>

      <Footer />
    </MarketingLayout>
  );
};

export default Industries;
