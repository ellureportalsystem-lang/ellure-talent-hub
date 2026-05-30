/** Animated blue → teal mesh background for homepage hero */
export function LandingHeroBackground() {
  return (
    <div className="marketing-hero-mesh-bg absolute inset-0 overflow-hidden" aria-hidden>
      <div className="marketing-hero-mesh-gradient absolute inset-0" />
      <div className="marketing-hero-mesh-orb marketing-hero-mesh-orb--1" />
      <div className="marketing-hero-mesh-orb marketing-hero-mesh-orb--2" />
      <div className="marketing-hero-mesh-orb marketing-hero-mesh-orb--3" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%/0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
    </div>
  );
}
