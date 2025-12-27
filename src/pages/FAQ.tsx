import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const mainFAQs = [
  {
    question: "What is Ellure Nexhire?",
    answer: "Ellure Nexhire is a hiring platform that connects employers and candidates through structured, transparent hiring workflows."
  },
  {
    question: "How is Ellure Nexhire different from Ellure Consulting Services?",
    answer: "Ellure Consulting Services is a recruitment company. Ellure Nexhire is a technology platform developed to support scalable and ethical hiring."
  },
  {
    question: "Is Ellure Nexhire a recruitment consultancy?",
    answer: "No. Ellure Nexhire is a platform, not a consultancy."
  },
  {
    question: "Do you provide recruitment or executive search services?",
    answer: "No. Recruitment services are provided separately under Ellure Consulting Services."
  },
  {
    question: "Can users track hiring progress?",
    answer: "Yes. Both employers and candidates can track application progress clearly within the portal."
  },
  {
    question: "Is data secure on Ellure Nexhire?",
    answer: "Yes. The platform follows enterprise-grade security and controlled access practices."
  }
];

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="container relative">
          <div className="flex items-center py-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-6 z-10"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">Frequently Asked Questions</h1>
              <p className="text-xl text-white/90">
                Find answers to common questions about Ellure Nexhire
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {mainFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;

