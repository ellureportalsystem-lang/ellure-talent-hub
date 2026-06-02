import { marketingTestimonials } from "@/lib/marketingTestimonials";
import { cn } from "@/lib/utils";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import TestimonialSection from "@/components/ui/testimonials";

export function BharatGoTestimonials() {
  const testimonials = marketingTestimonials.map((t) => ({
    name: t.name,
    role: t.role,
    stars: t.rating,
    content: t.quote,
    // Stock avatars that exist reliably
    avatar: `https://i.pravatar.cc/96?u=${encodeURIComponent(t.name)}`,
  }));

  return (
    <section
      className="bharatgo-section bg-[#FDF0E9] py-14 sm:py-16 lg:py-20"
    >
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="Testimonial"
          title="Loved by hiring teams & candidates"
          subtitle="Join organizations and professionals who trust Ellure NexHire to grow their hiring outcomes."
        />
        <TestimonialSection testimonials={testimonials} className="mt-2" />
      </div>
    </section>
  );
}
