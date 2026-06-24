import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const hrFAQs = [
  {
    question: "Will I receive bulk resumes?",
    answer: "No. Ellure TalentHub prioritises relevant, mapped profiles over bulk resume submissions."
  },
  {
    question: "Is WhatsApp used for hiring communication?",
    answer: "Yes, in a controlled manner. WhatsApp is used for reminders and updates while all actions remain logged within the portal."
  }
];

export const HRFAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
      {hrFAQs.map((faq, index) => (
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

