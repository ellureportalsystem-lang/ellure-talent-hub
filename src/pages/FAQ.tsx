import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";
import { MarketingSaasPageHero } from "@/components/marketing/MarketingSaasPageHero";
import { MarketingSaasSection } from "@/components/marketing/MarketingSaasSection";
import { MarketingIllustrationFrame } from "@/components/marketing/MarketingIllustrationFrame";
import { MarketingCartoonArt } from "@/components/marketing/MarketingCartoonArt";

const mainFAQs = [
  {
    question: "What is Ellure TalentHub?",
    answer:
      "Ellure TalentHub is a hiring platform that connects employers and candidates through structured, transparent hiring workflows.",
  },
  {
    question: "How is Ellure TalentHub different from Ellure Consulting Services?",
    answer:
      "Ellure Consulting Services is a recruitment company. Ellure TalentHub is a technology platform developed to support scalable and ethical hiring.",
  },
  {
    question: "Is Ellure TalentHub a recruitment consultancy?",
    answer: "No. Ellure TalentHub is a platform, not a consultancy.",
  },
  {
    question: "Do you provide recruitment or executive search services?",
    answer: "No. Recruitment services are provided separately under Ellure Consulting Services.",
  },
  {
    question: "Can users track hiring progress?",
    answer:
      "Yes. Both employers and candidates can track application progress clearly within the portal.",
  },
  {
    question: "Is data secure on Ellure TalentHub?",
    answer: "Yes. The platform follows enterprise-grade security and controlled access practices.",
  },
];

const FAQ = () => (
  <MarketingSaasShell>
    <MarketingSaasPageHero
      eyebrow="FAQ"
      align="left"
      illustration={
        <MarketingIllustrationFrame tone="lavender" className="w-full">
          <MarketingCartoonArt variant="candidates" size="hero" />
        </MarketingIllustrationFrame>
      }
      illustrationTone="lavender"
      title="Frequently asked questions"
      subtitle="Find answers to common questions about Ellure TalentHub."
    />

    <MarketingSaasSection>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {mainFAQs.map((faq, i) => (
          <AccordionItem
            key={faq.question}
            value={`item-${i}`}
            className="mb-2 rounded-lg border border-border bg-card px-4"
          >
            <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </MarketingSaasSection>
  </MarketingSaasShell>
);

export default FAQ;
