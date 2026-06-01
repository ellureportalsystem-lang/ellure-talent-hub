import { BharatGoSectionHeader } from "./BharatGoSectionHeader";
import { marketingBanners } from "@/lib/marketingPastelColors";

const gallery = [
  { src: marketingBanners.homeMid, caption: "Collaboration" },
  { src: marketingBanners.gallery[0], caption: "Our workspace" },
  { src: marketingBanners.gallery[1], caption: "Team culture" },
  { src: marketingBanners.about, caption: "Client meetings" },
];

export function BharatGoOfficeGallery() {
  return (
    <section className="bharatgo-section py-14 sm:py-16 lg:py-20">
      <div className="container px-4 sm:px-6">
        <BharatGoSectionHeader
          eyebrow="Our office"
          title="From Pune, for hiring teams everywhere"
          subtitle="Glimpses of how we work — structured, ethical, and people-first."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item) => (
            <figure
              key={item.caption}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="marketing-banner-bleed aspect-[4/3] overflow-hidden">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="marketing-photo-banner marketing-photo-banner--tile h-full w-full transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
