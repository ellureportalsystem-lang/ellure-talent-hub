import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

const faqs = [
  {
    q: "What is Ellure NexHire and how does it work?",
    a: "Ellure NexHire is a recruitment platform that connects employers and candidates through structured hiring workflows — applicant profiles, resume search, client shortlists, jobs, and secure dashboards for every role.",
  },
  {
    q: "Is Ellure NexHire a recruitment consultancy?",
    a: "We combine recruitment expertise with a technology platform. Employers get tools to search and manage talent; candidates get a professional profile visible to hiring teams.",
  },
  {
    q: "How do employers get started?",
    a: "Sign up as a client, choose a plan that fits your hiring volume, and start searching candidates, creating jobs, and collaborating with your team.",
  },
  {
    q: "How do applicants register?",
    a: "Create a free account, complete the multi-step profile (education, experience, documents), and access your applicant dashboard to apply and track opportunities.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. The platform uses role-based access, encrypted storage practices, and enterprise-grade controls suitable for sensitive hiring data.",
  },
];

export function BharatGoFaqSection() {
  return (
    <section className="bharatgo-section bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Get answers about Ellure NexHire. Need more help? Our team is happy to assist."
        />
        <Accordion type="single" collapsible className="mx-auto mt-10 max-w-3xl">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`} className="border-border bg-card px-4 rounded-lg mb-2">
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-full" asChild>
            <Link to="/faq">View all FAQs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
