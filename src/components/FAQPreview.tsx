import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const faqPreview = [
  {
    question: "What is Ellure Nexhire?",
    answer: "Ellure Nexhire is a hiring platform that connects employers and candidates through structured, transparent hiring workflows."
  },
  {
    question: "Is Ellure Nexhire a recruitment consultancy?",
    answer: "No. Ellure Nexhire is a platform, not a consultancy."
  },
  {
    question: "Is data secure on Ellure Nexhire?",
    answer: "Yes. The platform follows enterprise-grade security and controlled access practices."
  },
  {
    question: "How do I get started as an applicant?",
    answer: "Simply click 'Register Now' to create your profile. The registration process is free and takes just a few minutes to complete."
  }
];

export const FAQPreview = () => {
  return (
    <section className="py-10 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-transparent" />
      <div className="container relative">
        <motion.div 
          className="text-center space-y-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Help Center</span>
          <h2 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mt-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Quick answers to common questions
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {faqPreview.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="p-6 h-full card-hover border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-300">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" className="btn-hover shadow-md hover:shadow-lg transition-all duration-300" size="lg" asChild>
            <Link to="/faq">View All FAQs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

