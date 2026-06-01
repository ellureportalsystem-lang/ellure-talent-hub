/** Solid pastel palette (no gradients) — BharatGo-style marketing */
export const marketingPastel = {
  peach: { bg: "#FDF0E9", border: "#f5ddd0" },
  sky: { bg: "#E9F0FF", border: "#d4e2fc" },
  mint: { bg: "#E8F8F0", border: "#c5ead8" },
  lavender: { bg: "#F3EFFE", border: "#ddd0f5" },
  cream: { bg: "#FFFBF7", border: "#f0e6dc" },
} as const;

/**
 * Marketing banner assets in `public/`
 * Type A (full-width strips): 1, 2, 3
 * Type B (mega menu): b1, b2
 * Type C (contact): c1, c2
 * Gallery: g1, g2
 * Showcase: s1
 */
export const marketingBanners = {
  /** Type A — home mid-page strip */
  homeMid: "/1.png",
  /** Type A — home bottom CTA strip */
  cta: "/2.png",
  /** Type A — about page strip */
  about: "/3.png",
  /** Legacy alias — gallery + optional carousel */
  home: ["/1.png", "/g1.png", "/g2.png"] as const,
  /** Type B — Services mega menu featured image */
  services: "/b1.png",
  /** Type B — Industries mega menu featured image */
  industries: "/b2.png",
  /** Type C — Contact page hero */
  contact: "/c1.png",
  /** Type C — Contact business hours section */
  contactHours: "/c2.png",
  /** Showcase page + features visual */
  features: "/s1.png",
  showcase: "/s1.png",
  /** Gallery / lifestyle */
  gallery: ["/g1.png", "/g2.png"] as const,
} as const;

/** Final CTA section — branded bottom banner (`public/last2.png`) */
export const marketingCtaImage = "/last2.png" as const;
