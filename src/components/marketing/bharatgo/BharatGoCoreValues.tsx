import type { LucideIcon } from "lucide-react";
import { Heart, Lightbulb, Target, Zap } from "lucide-react";
import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

const values: { icon: LucideIcon; title: string; body: string; tone: "peach" | "sky" | "mint" | "lavender" }[] = [
  {
    icon: Heart,
    title: "Customer first",
    body: "Every decision starts with employers and candidates — we build for real hiring problems, not vanity features.",
    tone: "peach",
  },
  {
    icon: Lightbulb,
    title: "Simplicity matters",
    body: "Structured workflows without complexity. Clear screens, clear steps, and ethical hiring by design.",
    tone: "sky",
  },
  {
    icon: Zap,
    title: "Bias for action",
    body: "We move quickly, learn from feedback, and improve the platform so your team spends less time on admin.",
    tone: "mint",
  },
  {
    icon: Target,
    title: "Own your impact",
    body: "Quality over quantity — relevance, accountability, and outcomes matter more than bulk resumes.",
    tone: "lavender",
  },
];

const toneBg: Record<string, string> = {
  peach: "bg-[#FDF0E9] border-[#f5ddd0]",
  sky: "bg-[#E9F0FF] border-[#d4e2fc]",
  mint: "bg-[#E8F8F0] border-[#c5ead8]",
  lavender: "bg-[#E9F0FF] border-[#d4e2fc]",
};

export function BharatGoCoreValues() {
  return (
    <section className="bharatgo-section py-14 sm:py-16 lg:py-20">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="Our values"
          title="The core values that drive everything"
          subtitle="These principles guide how we build Ellure TalentHub and how we support every hire."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className={`rounded-2xl border p-6 sm:p-8 ${toneBg[item.tone]}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-poppins text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
