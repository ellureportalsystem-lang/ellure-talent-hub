import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { marketingBanners } from "@/lib/marketingPastelColors";

const team = [
  { name: "Leadership", role: "Founder & strategy", focus: "Vision, partnerships, ethical hiring" },
  { name: "Recruitment", role: "Delivery team", focus: "Screening, coordination, client success" },
  { name: "Product", role: "Platform team", focus: "TalentHub portals, search, and workflows" },
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
              title="The people behind Ellure TalentHub"
              subtitle="Innovators and recruitment specialists working together to simplify hiring for businesses and candidates across India."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-[#f5ddd0] bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F0FF] text-base font-bold text-primary sm:h-14 sm:w-14 sm:text-lg">
                    {member.name[0]}
                  </div>
                  <h3 className="mt-3 font-semibold">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{member.focus}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto grid w-full max-w-xl gap-4 lg:mx-0">
            <div className="marketing-banner-bleed overflow-hidden rounded-2xl border border-[#f5ddd0] shadow-md">
              <img
                src={marketingBanners.gallery[1]}
                alt="Team at Ellure TalentHub"
                className="marketing-photo-banner aspect-[16/10] w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="marketing-banner-bleed overflow-hidden rounded-2xl border border-[#f5ddd0] shadow-md">
                <img
                  src={marketingBanners.gallery[0]}
                  alt="Recruitment collaboration"
                  className="marketing-photo-banner aspect-[4/3] w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="marketing-banner-bleed overflow-hidden rounded-2xl border border-[#f5ddd0] shadow-md">
                <img
                  src={marketingBanners.about}
                  alt="Client meetings"
                  className="marketing-photo-banner aspect-[4/3] w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
