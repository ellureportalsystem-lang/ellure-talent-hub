import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const candidateFAQs = [
  {
    question: "Will I get updates on my application?",
    answer: "Yes. You will receive clear status updates at each hiring stage through the portal and notifications."
  },
  {
    question: "Does Ellure Nexhire charge candidates?",
    answer: "No. Ellure Nexhire does not charge candidates to apply for jobs."
  }
];

export const CandidateFAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
      {candidateFAQs.map((faq, index) => (
        <Card key={index} className="overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium pr-4">{faq.question}</span>
            {expandedIndex === index ? (
              <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-primary flex-shrink-0" />
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
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </Card>
      ))}
      <Link to="/faq" className="text-sm text-primary hover:underline">
        Read platform FAQs →
      </Link>
    </div>
  );
};

