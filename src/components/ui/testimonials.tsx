import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export type UiTestimonial = {
  name: string;
  role: string;
  stars: number;
  avatar?: string;
  content: string;
};

export default function TestimonialSection({
  testimonials,
  className,
}: {
  testimonials: UiTestimonial[];
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <div
                key={`${t.name}-${index}`}
                className="bg-background ring-foreground/10 rounded-2xl border border-transparent p-4 ring-1"
              >
                <div className="flex gap-1" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < t.stars
                          ? "fill-primary stroke-primary"
                          : "fill-foreground/15 stroke-transparent"
                      )}
                    />
                  ))}
                </div>

                <p className="text-foreground my-4 text-sm leading-relaxed">{t.content}</p>

                <div className="flex items-center gap-2">
                  <Avatar className="ring-foreground/10 size-8 border border-transparent shadow ring-1">
                    {t.avatar ? <AvatarImage src={t.avatar} alt={t.name} /> : null}
                    <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-foreground text-sm font-medium">{t.name}</div>
                  <span aria-hidden className="bg-foreground/25 size-1 rounded-full" />
                  <span className="text-muted-foreground text-sm">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

