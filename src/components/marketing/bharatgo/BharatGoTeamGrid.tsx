import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { marketingBanners } from "@/lib/marketingPastelColors";

const team = [
  { name: "Leadership", role: "Founder & strategy", focus: "Vision, partnerships, ethical hiring" },
  { name: "Recruitment", role: "Delivery team", focus: "Screening, coordination, client success" },
  { name: "Product", role: "Platform team", focus: "NexHire portals, search, and workflows" },
  { name: "Operations", role: "Support & QA", focus: "Onboarding, data quality, compliance" },
];

export function BharatGoTeamGrid() {
  return (
    <section className="bharatgo-section bg-[#FDF0E9] py-14 sm:py-16 lg:py-20">
      <div className="container px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <BharatGoSectionHeader
              align="left"
              eyebrow="Our team"
              title="The people behind Ellure NexHire"
              subtitle="Innovators and recruitment specialists working together to simplify hiring for businesses and candidates across India."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-[#f5ddd0] bg-white p-5 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E9F0FF] text-lg font-bold text-primary">
                    {member.name[0]}
                  </div>
                  <h3 className="mt-3 font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="marketing-banner-bleed mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-[#f5ddd0] shadow-md lg:mx-0">
            <img
              src={marketingBanners.gallery[1]}
              alt=""
              className="marketing-photo-banner marketing-photo-banner--tile aspect-[4/3] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
