import { BharatGoSectionHeader } from "./BharatGoSectionHeader";

const stats = [
  { value: "500+", label: "Successful placements", note: "Across industries" },
  { value: "50K+", label: "Profiles managed", note: "Structured applicant data" },
  { value: "10+", label: "Years experience", note: "Recruitment expertise" },
  { value: "95%", label: "Client satisfaction", note: "Quality-first delivery" },
  { value: "4", label: "Portal roles", note: "Admin, client, applicant, team" },
  { value: "24/7", label: "Platform access", note: "Secure cloud workspace" },
];

export function BharatGoMarketStats() {
  return (
    <section className="bharatgo-section bg-[#E9F0FF] py-14 sm:py-16 lg:py-20">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="India hiring landscape"
          title="Built for scale in a growing talent market"
          subtitle="Ellure NexHire combines recruitment expertise with technology — so employers and candidates benefit from structure at every step."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#d4e2fc] bg-white p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">{item.value}</p>
              <p className="mt-2 font-semibold text-foreground">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Illustrative platform metrics — not financial projections.
        </p>
      </div>
    </section>
  );
}
