# Ellure NexHire — Complete UI/UX Specification

**Document purpose:** Implementation-ready audit for cloning Ellure NexHire marketing visual quality, interaction quality, and responsive behavior onto ALIGN Network (or any greenfield rebuild).  
**Source of truth:** Codebase at `ellure-talent-hub` + live site behavior at https://ellurenexhire.vercel.app/  
**Audit date:** June 10, 2026  
**Rule:** No invented features. Items not verifiable in code/assets are marked `[UNVERIFIED — needs screenshot]`.

---

## Implementation priority list

| Priority | Area | Why first |
|----------|------|-----------|
| P0 | Design tokens (`index.css`, `tailwind.config.ts`) | Every component inherits HSL tokens, fonts, shadows |
| P0 | `MarketingLayout` + `Landing.tsx` section order | Page skeleton and z-index stacking |
| P0 | `Navbar.tsx` (glass, hero overlay, mobile menu) | Fixed chrome affects all sections |
| P0 | `BharatGoHero` + `ShaderBackground` + typewriter + `HeroCandidatePreview` | Signature first impression |
| P1 | Pastel card system (`BharatGoPastelFeatureCards`, tone tokens) | Repeated visual language |
| P1 | Product mockups (SVG collages) + cartoon PNG pipeline | Differentiator visuals |
| P1 | Motion catalog (Framer Motion + CSS keyframes) | Interaction parity |
| P2 | Industries tabs, How-it-works stepper, Pricing, FAQ | Mid-page conversion |
| P2 | Testimonials, stats count-up, marquee | Social proof band |
| P3 | Footer, Ellura chatbot, branded banners | Polish + support UX |

---

## Top 10 files to read first

1. `src/index.css` — All marketing CSS utilities, glass, mesh, marquee, BharatGo classes
2. `src/pages/Landing.tsx` — Homepage composition and section order
3. `src/components/layout/Navbar.tsx` — Scroll states, z-index, mobile menu
4. `src/components/marketing/bharatgo/BharatGoHero.tsx` — Hero layout and CTAs
5. `src/components/ui/shader-background.tsx` — WebGL hero background (not Three/Spline)
6. `src/components/marketing/HeroTypewriterHeadline.tsx` + `src/components/ui/typewriter.tsx`
7. `src/components/marketing/HeroCandidatePreview.tsx` + `src/components/ui/glass-panel.tsx`
8. `src/lib/marketingPastelColors.ts` + `src/lib/marketingPastelContent.tsx`
9. `src/components/marketing/bharatgo/BharatGoHowItWorks.tsx` — Stepper autoplay
10. `tailwind.config.ts` — Font families, container, extended tokens

---

# PHASE 1 — PROJECT & STACK DISCOVERY

## Framework & tooling

| Layer | Technology | Version (package.json) |
|-------|------------|------------------------|
| Build | Vite | ^5.4.19 |
| UI | React | ^18.3.1 |
| Routing | react-router-dom | ^6.30.1 |
| Language | TypeScript | ^5.8.3 |
| Styling | Tailwind CSS | ^3.4.17 |
| Component primitives | Radix UI + shadcn/ui pattern | Multiple `@radix-ui/*` |
| Animation | framer-motion | ^12.23.25 |
| Icons | lucide-react | ^0.462.0 |
| Utilities | clsx, tailwind-merge, class-variance-authority | — |
| Tailwind plugin | tailwindcss-animate | ^1.0.7 |
| Data (pricing only) | @supabase/supabase-js via `fetchSubscriptionPlans` | Optional API merge |

**Not used on marketing homepage:** Three.js, Spline, Lottie, Rive, embla-carousel (carousel exists but hero uses shader, not photo carousel).

## 3D / visual strategy

| Visual type | Implementation | Real 3D? |
|-------------|----------------|----------|
| Hero background | Custom WebGL fragment shader (`ShaderBackground`) | Shader animation, not mesh 3D |
| Hero plasma orbs | CSS `div` + blur + keyframe drift | No |
| Hero candidate card | `GlassPanel` (CSS glass morphism) | No |
| Cartoon illustrations | Static PNG in `public/cartoon-*.png` | Pre-rendered 3D-style art |
| Product mockups | Inline SVG React components | Flat UI collage |
| Ellura mascot | PNG (`mascot.png`) + CSS animations; legacy `.glb` exists but chatbot uses PNG | [UNVERIFIED — needs screenshot] for GLB usage |
| Branded banners | Full-width PNG strips (`1.png`, `2.png`, etc.) | Static |

## Fonts (loaded in `index.html`)

```html
Poppins: 400, 500, 600, 700
Inter: 300–800
Sora: 400, 500, 600
DM Sans: 400, 500, 600
```

Tailwind mapping (`tailwind.config.ts`):
- `font-sans` → Inter
- `font-brand` → Sora
- `font-poppins` → Poppins

## Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 640px | Hero title nowrap, navbar height bump |
| `md` | 768px | Grid shifts, marquee fade width |
| `lg` | 1024px | Desktop nav visible, 2-col hero, industries layout |
| `xl` | 1280px | Hero gap widening |
| `2xl` (container max) | 1400px | Centered container cap |

`useIsLgUp` hook hard-codes **1024px** for navbar scroll-hide disable on SaaS variant.

## Folder structure (marketing-relevant)

```
src/
  pages/Landing.tsx                 # Homepage orchestration
  components/
    layout/Navbar.tsx, Footer.tsx, MarketingNavMegaDropdown.tsx
    marketing/
      MarketingLayout.tsx
      bharatgo/                     # BharatGo-inspired SaaS landing blocks
      product-mockups/              # SVG UI collages
      illustrations/                # Legacy inline SVG cartoons (mostly superseded by PNG)
    ui/                             # shadcn: button, accordion, glass-panel, typewriter, etc.
  lib/
    marketingPastelColors.ts, marketingPastelContent.tsx
    marketingCartoonAssets.ts, marketingProductVisuals.tsx
    marketingIndustries.ts, marketingTestimonials.ts, hiringProcessSteps.ts
  hooks/useNavbarScroll.ts, useNavbarScrollHide.ts, useInViewOnce.ts
  index.css                         # Design system + marketing utilities
public/                             # PNG/SVG assets (see Phase 12)
```

## Routing map (marketing)

| Path | Page component |
|------|----------------|
| `/` | `Landing` |
| `/about` | `About` |
| `/services` | `Services` |
| `/features` | `Features` |
| `/industries` | `Industries` |
| `/showcase` | `Showcase` |
| `/contact` | `Contact` |
| `/faq` | `FAQ` |
| `/privacy`, `/terms` | Legal |
| `/auth/*` | Registration/login flows |

Homepage uses `ForceLightTheme` wrapper — marketing is **light mode only**.

---

## Homepage section order (canonical)

From `src/pages/Landing.tsx` (top → bottom):

1. **Navbar** — `variant="saas" heroOverlay`
2. **Hero** — `BharatGoHero`
3. **Logo marquee** — `TrustLogoMarquee`
4. **Pastel feature cards (×2)** — `BharatGoPastelFeatureCards` (`landingPastelCards`)
5. **Feature grid (×6)** — `BharatGoFeatureGrid` `variant="pastel"`
6. **Analytics band** — `HomePlatformAnalyticsBand` (inline in Landing)
7. **Branded banner** — `MarketingBrandedBanner` (`/1.png`)
8. **AI search split showcase** — `BharatGoSplitShowcase` + resume-search mockup
9. **Client workspace split** — `BharatGoSplitShowcase` `reverse` + team cartoon, `bg-[#FDF0E9]`
10. **Industries** — `BharatGoIndustriesSection`
11. **Why choose + stats** — `BharatGoWhyChoose`
12. **Testimonials** — `BharatGoTestimonials`
13. **How it works** — `BharatGoHowItWorks`
14. **Pricing** — `PricingSection` `bg-[#E9F0FF]`
15. **Branded banner** — `MarketingBrandedBanner` (`/2.png`)
16. **FAQ** — `BharatGoFaqSection`
17. **Final CTA** — `BharatGoFinalCta`
18. **Footer** — `Footer variant="light"`
19. **Global overlay** — `ElluraChatbot` via `MarketingLayout` (`showChatbot` default true)

`MarketingLayout`: `variant="saas"`, `showGeometry={false}` (no `FloatingGeometry` on homepage).

---

# PHASE 2 — GLOBAL DESIGN LANGUAGE

## Color system (HSL CSS variables — `src/index.css` `:root`)

| Token | HSL | Approx HEX | Role |
|-------|-----|------------|------|
| `--primary` | 212 94% 38% | #0566CD | Brand blue — CTAs, links, active states |
| `--secondary` | 183 72% 38% | #1CB4A8 | Brand teal — checks, footer accents |
| `--foreground` | 215 25% 15% | ~#1F2937 | Body text |
| `--muted` | 220 17% 96% | #F5F6F8 | Section backgrounds |
| `--muted-foreground` | 215 12% 45% | ~#6B7280 | Secondary copy |
| `--border` | 216 15% 88% | #DDE3EA | Borders |
| `--success` | 183 72% 38% | Same as secondary | Trust bullets, check icons |
| `--gold` | 46 80% 52% | #E8C547 | `.gold-text` utility (heroes) |
| `--radius` | 0.75rem | 12px | Base border radius |

## Gradients

| Name | Definition | Usage |
|------|------------|-------|
| `--gradient-primary` | `linear-gradient(135deg, primary → secondary)` | `.bg-gradient-primary` |
| `--gradient-subtle` | white → muted | Legacy marketing layout |
| `.marketing-gradient-split-cta` | Blue → teal → dark navy multi-stop | Inner page CTAs |
| `.marketing-hero-mesh-gradient` | Animated 135° blue/teal | Legacy hero (superseded on homepage) |
| Hero overlay gradients | `from-[#060612]/86` etc. | BharatGo hero scrim |

## Pastel marketing palette (hard-coded HEX)

| Tone | Background | Border | CSS class |
|------|------------|--------|-----------|
| Peach | `#FDF0E9` | `#f5ddd0` | `.bharatgo-feature-card-pastel-peach` |
| Sky | `#E9F0FF` | `#d4e2fc` | `.bharatgo-feature-card-pastel-sky` |
| Mint | `#E8F8F0` | `#c5ead8` | `.bharatgo-feature-card-pastel-mint` |
| Lavender | `#F3EFFE` | `#ddd0f5` | `.bharatgo-feature-card-pastel-lavender` |

## Typography scale

| Element | Classes / CSS | Size |
|---------|---------------|------|
| Section eyebrow | `text-sm font-semibold uppercase tracking-widest text-primary` | 14px |
| Section H2 | `font-poppins text-3xl sm:text-4xl font-bold tracking-tight` | 30→36px |
| Section subtitle | `text-base sm:text-lg text-muted-foreground leading-relaxed` | 16→18px |
| Hero H1 | `font-poppins text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12]` | 36→52px |
| Hero body | `text-base sm:text-xl text-slate-200/95` | 16→20px |
| Card H3 | `font-poppins text-xl sm:text-2xl font-bold` | 20→24px |
| Stat numbers | `font-poppins text-lg sm:text-xl lg:text-2xl font-bold text-primary` | 18→24px |

Tabular nums: `.font-stat`, `AnimatedStatValue` uses `tabular-nums`.

## Spacing & layout

- **Container:** `center: true`, padding `1rem` → `1.25rem` (sm) → `2rem` (lg)
- **Section vertical rhythm:** `py-14` to `py-24` depending on section (`bharatgo-section`)
- **Card padding:** `p-6 sm:p-8` (pastel cards), `p-4 sm:p-6` (feature grid)
- **Grid gaps:** `gap-5` to `gap-16` between major columns

## Radius & shadows

| Element | Radius | Shadow |
|---------|--------|--------|
| Buttons (marketing CTAs) | `rounded-full` | `shadow-lg`, `btn-glow-primary` on hover |
| Cards | `rounded-2xl` / `rounded-3xl` | `shadow-sm` → `shadow-md` on hover |
| Glass panel | `rounded-2xl` (hero card) | Inset highlights + `glass-panel-shadow` blur |
| Product mockup frame | `rounded-2xl` outer, `rounded-xl` inner | `shadow-md ring-1 ring-black/[0.06]` |

Token shadows: `--shadow-sm` through `--shadow-xl` (HSL-based).

## Glass effects

Two glass systems:

1. **Marketing hero card** — `.glass-panel` / `.glass-panel-shadow` (`index.css` lines 1816–1924)
   - `backdrop-filter: blur(24px) saturate(1.5)`
   - Border `rgba(255,255,255,0.28)`
   - Purple-tinted drop shadow pseudo-element

2. **Portal glass** (not homepage) — `.portal-glass-card`, `.portal-glass-header`

Navbar solid state uses **lighter glass:** `bg-white/95 backdrop-blur-xl`.

---

# PHASE 3 — NAVBAR (DEEP DIVE)

**File:** `src/components/layout/Navbar.tsx`  
**Homepage props:** `variant="saas" heroOverlay`

## Structure

```
createPortal(headerBar → document.body)     z-[200]
Spacer div h-14 sm:h-[4.25rem]
Mobile menu overlay (lg:hidden)             z-[210]
ElluraChatbot (MarketingLayout)             z-50
```

- Logo: `/ellure-logo.png` h-10 w-10 sm:h-12 — `[UNVERIFIED — needs screenshot]` if PNG missing in deploy (repo has `ellure-logo.svg`)
- Wordmark: `font-poppins text-lg sm:text-xl font-bold`
  - Hero overlay: all white
  - Solid: `Ellure` → `#3d4853`, `NexHire` → `text-primary`

## Scroll behavior

| Hook | Threshold | Behavior |
|------|-----------|----------|
| `useNavbarScroll(32)` | 32px | `isSolidNav` when `scrolled \|\| mobileMenuOpen \|\| forceSolidNav` |
| `useNavbarScrollHide(72, true)` | 72px | **Disabled on SaaS** (`variant === "saas"` → always visible) |
| `forceSolidNav` | — | Contact page only |

### Header bar states (`motion.header` lines 147–159)

**Solid (scrolled):**
```
fixed inset-x-0 top-0 z-[200]
border-b border-border/80
bg-white/95 shadow-sm backdrop-blur-xl
supports-[backdrop-filter]:bg-white/90
transition-all duration-300 ease-out
```

**Hero overlay (top of homepage):**
```
border-b border-white/10
bg-[#060612]/50
shadow-[0_4px_24px_rgba(0,0,0,0.2)]
backdrop-blur-md
```

**Transparent (non-hero pages at top):**
```
border-b border-transparent bg-transparent
```

**Hide animation (non-SaaS only):**
```
animate={{ y: mobileMenuOpen || !navHidden ? 0 : -100 }}
transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
```

## Desktop link states (`linkClass`, lines 88–103)

**Hero overlay — inactive:**
`text-white hover:bg-white/12 hover:text-white rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200`

**Hero overlay — active:**
`bg-white/15 text-white`

**Solid SaaS — inactive:**
`text-foreground/80 hover:bg-muted/80 hover:text-primary`

**Solid SaaS — active:**
`bg-primary/10 text-primary font-semibold`

## Mega menu trigger (`megaTriggerClass`, lines 123–130)

Hero: `text-white hover:bg-white/12`  
Solid: `text-foreground/80 hover:bg-muted/80 hover:text-primary`  
Open: `data-[state=open]:bg-primary/10 data-[state=open]:text-primary`

Mega dropdown: Radix Popover, hover open with 180ms close delay, `z-[100]`.

## CTA buttons (desktop, lines 203–224)

| Button | Variant | Hero overlay classes |
|--------|---------|-------------------|
| Login | outline | `border-white/35 bg-white/5 text-white hover:bg-white/15` |
| Start for FREE | default + `btn-glow-primary` | Primary fill, `rounded-full h-9 px-5 shadow-md` |

## Mobile menu (lines 283–416)

**Overlay:**
```
fixed inset-0 top-14 sm:top-[4.25rem] z-[210]
bg-background/98 backdrop-blur-md
AnimatePresence opacity 0→1, duration 0.2
body overflow hidden when open
```

**Mobile link card:**
```
min-h-[48px] rounded-xl border border-border/60 bg-card px-4 py-3
active:scale-[0.98]
active route: border-primary/30 bg-primary/5 text-primary
```

**Staggered entrance:** `delay: 0.05 + index * 0.03` per link.

**Bottom CTAs:** Full-width `h-12 rounded-full` — Start for FREE, Platform showcase, Contact sales, Login.

## Focus states

Buttons use shadcn default: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

---

# PHASE 4 — HERO (DEEP DIVE)

**File:** `src/components/marketing/bharatgo/BharatGoHero.tsx`

## Layout

- Section pulls under fixed nav: negative margin `-mt-14 sm:-mt-[4.25rem]` with compensating padding
- Min height desktop: `lg:min-h-[calc(100vh-4.25rem)]`
- Grid: `lg:grid-cols-2` — copy left, preview right
- Mobile: centered copy `max-lg:text-center`, CTAs `sm:justify-center lg:justify-start`

## Background stack (back → front)

1. `ShaderBackground variant="dark"` — WebGL plasma grid
2. `.bharatgo-hero-plasma-orb--1` — violet blur orb, 22s drift
3. `.bharatgo-hero-plasma-orb--2` — 18s drift
4. `.bharatgo-hero-plasma-vignette`
5. Horizontal scrim: `bg-gradient-to-r from-[#060612]/86 via-[#0a0820]/42 to-[#12082a]/12`
6. Vertical scrim: `from-[#060612]/28 via-transparent to-[#060612]/78`
7. Content `z-[1]`

## Headline & typewriter

**Static lines:**
```
Hire exceptional talent in
[TYPEWRITER LINE]
```

**Typewriter** (`HeroTypewriterHeadline.tsx`):
- Library: custom `Typewriter` component (`src/components/ui/typewriter.tsx`), **not** external npm typewriter
- Phrases (looped):
  1. `minutes, not months`
  2. `with structure & speed`
  3. `on one platform`
  4. `with ethical hiring`
- `speed={42}` ms per character
- `deleteSpeed={28}` ms
- `waitTime={2200}` ms between phrases
- `initialDelay={400}` ms
- `loop` true
- `cursorChar="|"` with blink animation (`opacity` toggle, 0.01s duration, 0.4s repeat delay)
- Display class: `text-violet-200` wrapper + `text-primary` on typed text
- `min-h-[1.2em] sm:min-h-[1.15em]` prevents layout shift

**Reduced motion:** Static text `minutes, not months` with `text-primary` on "not months".

## Subtitle (responsive copy split)

- Mobile (`sm:hidden`): shorter single sentence
- Desktop (`hidden sm:inline`): full Ellure NexHire value prop

## CTAs

| CTA | Route | Classes |
|-----|-------|---------|
| Start for FREE | `/auth/register` | `size="lg" h-12 rounded-full px-8 font-semibold shadow-lg shadow-primary/25 active:scale-[0.98]` |
| Watch Demo | `/features` | `variant="outline" border-2 border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15` + Play icon `fill-current` |

## Trust bullets

3 items in `grid grid-cols-2` → `sm:flex flex-wrap`:
- `Free applicant profiles`
- `No credit card for candidates` (spans 2 cols on mobile)
- `Enterprise-ready security`

Bullet marker: `h-1.5 w-1.5 rounded-full bg-violet-400`

## Hero mockup (NOT 3D — glass card UI)

`HeroCandidatePreview variant="hero"`:
- Wrapped in `GlassPanel cornerClassName="rounded-2xl"`
- Ambient glows: `bg-violet-500/28 blur-[48px]` and `bg-fuchsia-500/14 blur-[28px]`
- **4 rotating fake applicant profiles**, interval `5500ms`
- Float animation: `y: [0, -4, 0]` over 5s infinite
- Profile transition: opacity + y, 0.28s ease `[0.4, 0, 0.2, 1]`
- Progress bar animates width 0→N% in 0.5s on profile change

## Entrance animations

| Element | Initial | Animate | Transition |
|---------|---------|---------|------------|
| Copy column | opacity 0, y 20 | opacity 1, y 0 | 0.5s |
| Preview column | opacity 0, y 24 | opacity 1, y 0 | 0.55s, delay 0.1s |

---

# PHASE 5 — 3D MOCKUPS & ILLUSTRATIONS

## Asset table

| ID | Type | Path | Animation | Placement | Perspective/tilt | Shadow |
|----|------|------|-----------|-----------|------------------|--------|
| Recruiter cartoon | PNG | `/cartoon-recruiter-tools.png` | None | Pastel card 1 | `object-contain` in frame | `drop-shadow` on SVG filter for inline; PNG uses frame shadow |
| Candidates cartoon | PNG | `/cartoon-candidate-profiles.png` | None | Why choose section | `size="showcase"` max-h min(360px,48vw) | `MarketingIllustrationFrame shadow-md` |
| Team cartoon | PNG | `/cartoon-team-office.png` | None | Client workspace split | Peach frame | Frame `shadow-sm` |
| Analytics cartoon | PNG | `/cartoon-hiring-analytics.png` | None | Analytics band | Lavender frame compact | — |
| Platform features | PNG | `/cartoon-platform-features.png` | None | Features page cards | — | — |
| Services coordination | PNG | `/cartoon-services-coordination.png` | None | Services page | — | — |
| Industries sectors | PNG | `/cartoon-industries-sectors.png` | None | Industries page | — | — |
| Resume search mockup | Inline SVG | `NexHireResumeSearchMockup.tsx` | None | Split showcase, pastel card | Flat | `MarketingProductMockup` ring shadow |
| Client workspace mockup | Inline SVG | `NexHireClientWorkspaceMockup.tsx` | None | Pastel card 2 | Flat | Same frame |
| Analytics mockup | Inline SVG | `NexHireAnalyticsMockup.tsx` | None | Analytics band | Flat compact max-h 120px | — |
| Hero profile card | React/CSS | `HeroCandidatePreview` | Float + rotate + crossfade | Hero right column | No CSS 3D transform | Glass panel shadow + violet glow |
| Banner strips | PNG | `/1.png`, `/2.png`, `/3.png` | None | Full bleed `aspect-ratio: 1643/957` | None | None |
| Final CTA bg | PNG | `/last2.png` | None | `BharatGoFinalCta` | `object-fit: cover` | Gradient overlay |
| Ellura mascot | PNG | `/mascot.png` | Float, blink, pulse, ground glow | Fixed bottom-right | None | `drop-shadow` + ground glow |
| Logo | SVG/PNG | `/ellure-logo.svg` (repo), code refs `.png` | Hover scale 1.05 | Navbar, footer | — | `drop-shadow-sm` on hero |

**No CSS `perspective` or `rotateY` tilt** on marketing mockups — depth is simulated via shadows, blur orbs, and pre-rendered art.

## Product mockup frame (`MarketingProductMockup.tsx`)

```
Outer: rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e9f0ff] p-2 sm:p-3 shadow-md ring-1 ring-black/[0.06]
Inner: rounded-xl bg-white/90 overflow-hidden
Compact: max-w-[200px] sm:max-w-[220px], min-h-[120px]
```

---

# PHASE 6 — SECTION-BY-SECTION HOMEPAGE

## 1. Hero — see Phase 4

## 2. Logo marquee (`TrustLogoMarquee.tsx`)

- Background: `bg-[#E9F0FF] border-y border-[#d4e2fc] py-8 md:py-10`
- Title: `text-sm font-semibold uppercase tracking-[0.16em] text-primary` centered
- Track: duplicated 8 industry labels (IT, BFSI, ITES, E-Commerce, Pharma, Manufacturing, Telecom, Engineering)
- Each chip: `rounded-xl border bg-background px-5 py-3 shadow-sm` + Lucide icon in `bg-primary/10` square
- Animation: `.marketing-logo-marquee-track` — `translateX(-50%)` over **42s linear infinite**
- Edge fade: 16px→24px gradient masks
- **Reduced motion:** animation off, flex-wrap center

## 3. Pastel feature cards (`BharatGoPastelFeatureCards`)

**Card 1 (peach):** Recruiter cartoon — "Enhance hiring with powerful platform tools"  
**Card 2 (sky):** Client workspace SVG mockup — "Structured workflows for every role"

- Section: `py-14 sm:py-16 lg:py-20`
- Card: `rounded-3xl border p-6 sm:p-8 bharatgo-pastel-card`
- Grid inside card: `lg:grid-cols-[1fr_minmax(200px,46%)]`
- Scroll in: `whileInView opacity/y`, delay `index * 0.08`
- CTA outline buttons per tone (peach uses blue border `#3b82f6`, sky ditto)

## 4. Feature grid (`BharatGoFeatureGrid`)

- Section bg: `bg-muted/40 py-16 sm:py-20 lg:py-24`
- 6 features from `Landing.tsx` (FileCheck, TrendingUp, Users, Shield, Building2, Sparkles)
- **Desktop (sm+):** 2×3 grid `lg:grid-cols-3`, pastel tones cycle peach/sky/mint/lavender
- **Mobile:** 2-col accordion cards — tap toggles description, chevron rotates 180°, height animate 0.22s
- Icon tile hover: `group-hover:bg-primary group-hover:text-primary-foreground`
- Card hover: `hover:border-primary/25 hover:shadow-md duration-300`

## 5. Analytics band (`HomePlatformAnalyticsBand`)

- `bg-[#F3EFFE] border-y border-[#ddd0f5] py-10 sm:py-12 lg:py-14`
- Layout: `lg:grid-cols-[1fr_auto]` — copy left, visuals right
- Visuals: lavender cartoon `size="band"` + analytics SVG `compact`

## 6. Branded banner mid (`MarketingBrandedBanner`)

- Image: `/1.png` — full viewport width, `aspect-ratio: 1643/957`, `object-fit: contain`
- No text overlay (copy baked into image)

## 7. AI search split (`BharatGoSplitShowcase`)

- Outer card: sky pastel `rounded-3xl border-[#d4e2fc] bg-[#E9F0FF] p-6 sm:p-10 lg:p-12`
- Copy animates from x: -20; visual from x: 20
- CTA: `h-11 rounded-full` → `/auth/register`

## 8. Client workspace split

- `reverse` — visual left on desktop
- Section className: `bg-[#FDF0E9]` (peach page band behind card)
- Visual: peach `MarketingIllustrationFrame` + team cartoon
- CTA → `/contact` "Hire talent"

## 9. Industries (`BharatGoIndustriesSection`)

- `bg-muted/40`
- Left: 7 industry tab buttons — mobile 2-col snap scroll, desktop vertical stack
- Active tab: `border-primary bg-primary text-primary-foreground shadow-md`
- Inactive: `border-border bg-card hover:border-primary/30`
- Right: detail card `rounded-2xl border bg-card p-6 shadow-lg` with motion crossfade
- Role chips: `rounded-full bg-muted px-3 py-1 text-xs`

## 10. Why choose (`BharatGoWhyChoose`)

- Left: 4 reasons with `CheckCircle2 text-secondary`
- Right: candidates cartoon + embedded stats grid
- Stats: 2×2 mobile, 4-col desktop, count-up on in-view (see Phase 7)

## 11. Testimonials (`BharatGoTestimonials`)

- Background: `bg-[#FDF0E9]`
- 5 testimonials from `marketingTestimonials.ts`
- Grid: 1 → 2 → 3 columns
- Card: `rounded-2xl ring-1 ring-foreground/10 border-transparent`
- Stars: filled `fill-primary` for rating
- Avatars: `https://i.pravatar.cc/96?u={name}` external

## 12. How it works (`BharatGoHowItWorks`)

See Phase 8 motion catalog. 4 steps: Understand → Source → Screen → Deliver.

## 13. Pricing (`PricingSection`)

- Background: `bg-[#E9F0FF]` (passed via className)
- 2 plans: Free (sky tone) + Pro (highlighted, `ring-2 ring-primary/25`)
- Pro badge: "Most popular"
- Fetches Supabase plans optionally; falls back to defaults (₹0 / ₹4,999)
- Custom plan card: peach `bg-[#FDF0E9]`

## 14. Branded banner CTA strip

- Image: `/2.png`

## 15. FAQ (`BharatGoFaqSection`)

- `bg-muted/40`
- Radix Accordion single collapsible
- Item: `rounded-lg mb-2 bg-card px-4`
- Trigger: `font-semibold py-4 hover:underline`, chevron rotates 180°
- Content animation: `accordion-down/up` 0.2s ease-out

## 16. Final CTA (`BharatGoFinalCta`)

- Card: `rounded-3xl min-h-[300px] sm:min-h-[320px]`
- Background image `/last2.png` + `.bharatgo-final-cta-overlay--centered`
- Primary CTA: `variant="secondary"` (teal) "Start free trial"
- Secondary: glass outline white "Talk to sales"
- Trust bullets with Check icons

## 17. Footer — see Phase 10

---

# PHASE 7 — CARDS & COLORED SURFACES

## Card variants

| Variant | Default | Hover | Padding |
|---------|---------|-------|---------|
| Pastel feature | tone bg + border | `bharatgo-pastel-card:hover` deeper shadow | p-6 sm:p-8 |
| Feature grid (desktop) | pastel tone | `hover:border-primary/25 hover:shadow-md` | p-4 sm:p-6 |
| Feature grid (mobile) | pastel, accordion | `active:scale-[0.99]` | p-3 |
| Split showcase container | sky pastel | none | p-6 lg:p-12 |
| Industry detail | white card | none | p-6 sm:p-8 |
| Stat mini card | white `border-[#d4e2fc]` | none | px-2.5 py-3 |
| Pricing Free | sky pastel border-2 | none | p-6 sm:p-8 |
| Pricing Pro | white border-primary ring | none | + badge padding |
| Testimonial | white ring-1 | none | p-4 |
| How-it-works preview | `bg-card shadow-md` | pause autoplay on hover | p-4 sm:p-5 |
| Profile hero glass | glass-panel | none | px-3 py-3 sm:px-4 |

## Glass surfaces

- `GlassPanel` for hero applicant card only on marketing homepage
- Navbar solid: `bg-white/95 backdrop-blur-xl` (not full glass-panel system)

## Profile card (hero)

- Applicant label + mono ID
- Match % badge emerald
- Skill chips max 3 + overflow `+N`
- Progress bar violet-400 on white/15 track
- Mini stats: Apps / Short / Intv
- Smart match violet chip

## Stat cards

`defaultTrustedStats`:
- 500+ Successful Placements
- 50+ Corporate Clients
- 8+ Years Experience
- 95% Client Satisfaction

Count-up: 1600ms, ease-out cubic `1 - (1-t)³`

---

# PHASE 8 — MOTION CATALOG

| Effect | Where | Implementation | Duration | Easing | Trigger | Mobile |
|--------|-------|----------------|----------|--------|---------|--------|
| Typewriter | Hero headline | `Typewriter` setTimeout loop | 42ms/char type, 28ms delete, 2200ms wait | linear char | mount | Same; reduced motion → static |
| Cursor blink | Hero | framer-motion opacity | 0.01s + 0.4s delay | reverse repeat | always | Same |
| Hero fade-in-up | Hero columns | framer-motion | 0.5–0.55s | default | mount | Same |
| Section fade-in-up | Pastel cards, features | `whileInView` | 0.55s default | `[0.22,1,0.36,1]` | scroll into view once, margin -40px | Same |
| Stagger | Pastel cards, features, reasons | delay `index * 0.06–0.08` | — | — | scroll | Same |
| Logo marquee | Trust strip | CSS `@keyframes marketing-logo-marquee` | 42s | linear | always | Reduced motion: static wrap |
| Shader plasma | Hero bg | WebGL RAF | continuous | — | in viewport | Falls back to gradient |
| Plasma orb drift | Hero | CSS keyframes 18–22s | — | ease-in-out | always | Reduced motion: off |
| Profile float | Hero card | framer `y: [0,-4,0]` | 5s | easeInOut infinite | always | Same |
| Profile rotate | Hero candidates | `setInterval` 5500ms | 0.28s crossfade | `[0.4,0,0.2,1]` | auto + dot click | Same |
| Progress bar fill | Hero profile | framer width | 0.5s | easeOut | profile change | Same |
| Feature accordion | Mobile feature grid | framer height | 0.22s | `[0.4,0,0.2,1]` | tap | Mobile only |
| Industry tab swap | Industries | framer opacity/y | default | — | click | Same |
| Count-up stats | Why choose | `requestAnimationFrame` | 1600ms | cubic out | `useInViewOnce` | Same |
| Testimonial grid | Testimonials | static | — | — | — | 1 col → 2 → 3 |
| Stepper autoplay | How it works | `setInterval` 5000ms | progress bar linear 5s | — | default on; pause hover | Same |
| Stepper progress | How it works | framer width 0→100% | 5s | linear | per step | Paused if reduced motion |
| Step preview swap | How it works | AnimatePresence | 0.28s | — | step change | Same |
| FAQ accordion | FAQ | Radix + tailwind animate | 0.2s | ease-out | click | Same |
| Button scale | CTAs | `active:scale-[0.98]` | instant | — | tap | Same |
| btn-glow-primary | Navbar CTA | CSS hover | 300ms | ease-out | hover pointer fine | N/A desktop |
| marketing-card-lift | Stats strip (inner pages) | translateY -1.5 + shadow | 300ms | ease-out | hover | Disabled coarse pointer |
| Navbar hide | Non-SaaS only | framer y | 0.28s | `[0.4,0,0.2,1]` | scroll down | SaaS: disabled |
| Mobile menu fade | Navbar | opacity | 0.2s | — | open | Mobile |
| Ellura float | Chatbot | CSS `ellura-float` | 3.2s | ease-in-out | always | Same |
| Ellura launcher | Chatbot | whileHover scale 1.04 | spring | — | hover | Same |
| Layout fade | MarketingLayout | opacity 0→1 | 0.35s | — | page load | Same |
| Reduced motion | Global | `prefers-reduced-motion` | — | — | OS setting | Disables most loops |

---

# PHASE 9 — RESPONSIVE MATRIX

| Section | Mobile (<640) | Tablet (640–1023) | Desktop (1024+) |
|---------|---------------|-------------------|-----------------|
| Navbar | Hamburger, single CTA, overlay menu | Same + sm CTA visible | Full links, mega menus, Login + CTA |
| Hero | Centered copy, stacked CTAs, shorter subtitle | 2-col CTAs row centered | Left copy, right preview, left-aligned CTAs |
| Marquee | Full bleed scroll | Same | Same + wider fade masks |
| Pastel cards | Stacked | Stacked | 2-col grid of cards |
| Feature grid | 2-col accordion | 2×3 grid | 3×2 grid |
| Analytics band | Stacked center | Stacked | Copy left, visuals right |
| Split showcases | Stacked, centered | Stacked | 2-col alternating |
| Industries | 2-col snap tabs + card below | Same | Left vertical tabs, right detail |
| Why choose | Stacked | Stacked | 2-col |
| Stats in why choose | 2×2 grid | 2×2 | 1×4 row |
| Testimonials | 1 col | 2 col | 3 col |
| How it works | 2×2 step grid + dropdown details | Horizontal stepper scroll | Stepper + 2-col preview/details |
| Pricing | Stacked cards | 2 col | 2 col max-w-4xl |
| FAQ | Full width accordion | max-w-3xl centered | Same |
| Final CTA | Stacked buttons | Row buttons | Centered max-w-2xl |
| Footer | 2-col grid | 2-col | 12-col grid |
| Ellura | bottom 5.5rem right-4 | Same | bottom-6 right-6 |

---

# PHASE 10 — FOOTER

**File:** `src/components/layout/Footer.tsx`  
**Homepage:** `variant="light"`

## Layout

- `border-t border-border bg-muted/30 text-foreground`
- Container `py-12 md:py-16`
- Grid: `grid-cols-2 lg:grid-cols-12`

Columns:
1. Brand (col-span-2 lg:col-span-3)
2. Quick links (lg:col-span-2)
3. For employers (lg:col-span-2)
4. For applicants + legal (lg:col-span-2)
5. Contact (col-span-2 lg:col-span-3)

## Link hover (light variant)

- Quick links: `text-muted-foreground hover:text-primary` + `group-hover:translate-x-0.5`
- Social icons: `hover:scale-105 duration-300` + brand color fills (LinkedIn #0a66c2, etc.)

## Dark footer variant (inner pages)

- `marketing-footer-dark` bg `#1e2a38`
- Muted text `hsl(215 15% 68%)`
- Link hover → `hsl(183 72% 55%)`
- Hidden on mobile when `variant="dark" && pathname !== "/"` — **homepage uses light footer always**

## Contact block

- Address Pune, phone, email with `text-secondary` icons
- "Get in touch" → `bg-secondary` button `rounded-lg h-10`

## Bottom bar

- Copyright + Privacy/Terms/Contact/LinkedIn links `hover:text-secondary`

---

# PHASE 11 — CLONE RECIPES

## 1. Navbar glass (hero overlay → solid)

```tsx
// State: isSolidNav = scrollY > 32 || mobileMenuOpen
<header className={cn(
  "fixed inset-x-0 top-0 z-[200] w-full transition-all duration-300 ease-out",
  isSolidNav
    ? "border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
    : "border-b border-white/10 bg-[#060612]/50 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
)} />
```

## 2. Typewriter hero line

```tsx
<Typewriter
  text={["minutes, not months", "with structure & speed", "on one platform", "with ethical hiring"]}
  speed={42}
  deleteSpeed={28}
  waitTime={2200}
  initialDelay={400}
  loop
  cursorChar="|"
  className="text-primary"
/>
```

## 3. Industry marquee

```html
<section class="border-y border-[#d4e2fc] bg-[#E9F0FF] py-8 md:py-10">
  <div class="marketing-logo-marquee overflow-hidden">
    <div class="marketing-logo-marquee-track flex w-max gap-4"><!-- duplicate items --></div>
  </div>
</section>
```
CSS: `animation: marketing-logo-marquee 42s linear infinite` + edge gradients.

## 4. Feature + mockup split (pastel card)

```tsx
<article className="bharatgo-pastel-card flex flex-col rounded-3xl border p-6 sm:p-8 bg-[#FDF0E9] border-[#f5ddd0]">
  <div className="grid lg:grid-cols-[1fr_minmax(200px,46%)] gap-6">
    <div>{/* copy + outline CTA */}</div>
    <div>{/* MarketingProductMockup or MarketingCartoonArt */}</div>
  </div>
</article>
```

## 5. Icon tile card (feature grid)

```tsx
<article className="group rounded-2xl border p-4 sm:p-6 bharatgo-feature-card-pastel-sky shadow-sm hover:border-primary/25 hover:shadow-md transition-all duration-300">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
    <Icon className="h-6 w-6" strokeWidth={1.75} />
  </div>
  <h3 className="mt-4 font-poppins text-lg font-semibold">{title}</h3>
  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
</article>
```

## 6. Stats band with count-up

```tsx
// useInViewOnce(0.12) → active
<p className="font-poppins text-xl font-bold text-primary">
  <AnimatedStatValue value="500+" active={inView} durationMs={1600} />
</p>
```

## 7. Testimonials row

```tsx
<section className="bg-[#FDF0E9] py-14 sm:py-16 lg:py-20">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div className="rounded-2xl bg-background p-4 ring-1 ring-foreground/10">{/* stars + quote + avatar */}</div>
  </div>
</section>
```

## 8. How-it-works stepper

```tsx
// AUTOPLAY_MS = 5000, pause on mouseenter
<div className="h-0.5 bg-muted">
  <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} />
</div>
```

## 9. FAQ accordion

```tsx
<Accordion type="single" collapsible>
  <AccordionItem className="border-border bg-card px-4 rounded-lg mb-2">
    <AccordionTrigger className="font-semibold py-4 hover:no-underline" />
    <AccordionContent className="text-muted-foreground pb-4" />
  </AccordionItem>
</Accordion>
```

## 10. Final CTA with image overlay

```tsx
<div className="relative min-h-[300px] overflow-hidden rounded-3xl">
  <img src="/last2.png" className="marketing-cta-bg absolute inset-0 h-full w-full" />
  <div className="bharatgo-final-cta-overlay bharatgo-final-cta-overlay--centered absolute inset-0" />
  <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">{/* copy + CTAs */}</div>
</div>
```

---

# PHASE 12 — ASSET MANIFEST

## Public images (marketing)

| Path | Type | Used on |
|------|------|---------|
| `/cartoon-recruiter-tools.png` | PNG | Pastel card 1 |
| `/cartoon-candidate-profiles.png` | PNG | Why choose |
| `/cartoon-team-office.png` | PNG | Client workspace |
| `/cartoon-hiring-analytics.png` | PNG | Analytics band |
| `/cartoon-platform-features.png` | PNG | Features page |
| `/cartoon-services-coordination.png` | PNG | Services |
| `/cartoon-industries-sectors.png` | PNG | Industries |
| `/1.png` | PNG banner | Home mid |
| `/2.png` | PNG banner | Pre-FAQ strip |
| `/3.png` | PNG banner | About |
| `/last2.png` | PNG | Final CTA bg |
| `/b1.png`, `/b2.png` | PNG | Mega menu featured |
| `/c1.png`, `/c2.png` | PNG | Contact hero/hours |
| `/s1.png` | PNG | Showcase/features |
| `/g1.png`, `/g2.png` | PNG | Gallery |
| `/mascot.png`, `/mascot1.jpg` | PNG/JPG | Ellura |
| `/ellure-logo.svg` | SVG | [UNVERIFIED — needs screenshot] vs code `.png` ref |
| `/cute_nexhire_mascot.glb` | GLB | Not referenced in homepage React tree |
| `/contact-hero.png`, `/banner-3.jpg` | Legacy | Contact alt assets |
| `Capture*.PNG`, `222.PNG`, etc. | Reference captures | Design reference only |

## Inline SVG components (no static file)

- `src/components/marketing/product-mockups/NexHireResumeSearchMockup.tsx`
- `src/components/marketing/product-mockups/NexHireClientWorkspaceMockup.tsx`
- `src/components/marketing/product-mockups/NexHireAnalyticsMockup.tsx`

## External URLs

- Testimonial avatars: `https://i.pravatar.cc/96?u={name}`
- Social links: LinkedIn, Facebook, Instagram, WhatsApp (see Footer)

## No Lottie JSON files in repo

---

# PHASE 13 — DESIGN TOKENS JSON

```json
{
  "colors": {
    "primary": { "hsl": "212 94% 38%", "hex": "#0566CD" },
    "secondary": { "hsl": "183 72% 38%", "hex": "#1CB4A8" },
    "foreground": { "hsl": "215 25% 15%" },
    "background": { "hsl": "0 0% 100%" },
    "muted": { "hsl": "220 17% 96%" },
    "mutedForeground": { "hsl": "215 12% 45%" },
    "border": { "hsl": "216 15% 88%" },
    "destructive": { "hsl": "0 84.2% 60.2%" },
    "gold": { "hsl": "46 80% 52%", "hex": "#E8C547" },
    "pastel": {
      "peach": { "bg": "#FDF0E9", "border": "#f5ddd0" },
      "sky": { "bg": "#E9F0FF", "border": "#d4e2fc" },
      "mint": { "bg": "#E8F8F0", "border": "#c5ead8" },
      "lavender": { "bg": "#F3EFFE", "border": "#ddd0f5" }
    },
    "hero": {
      "base": "#080818",
      "scrimDark": "#060612",
      "violetAccent": "hsl(270 95% 62%)"
    },
    "footerDark": "#1e2a38",
    "wordmark": { "ellure": "#3D4853", "nexhire": "#0566CD", "footerNexhire": "#5eb8e8" }
  },
  "gradients": {
    "primary": "linear-gradient(135deg, hsl(212 94% 38%), hsl(183 72% 38%))",
    "heroMesh": "linear-gradient(135deg, hsl(212 94% 32%) 0%, hsl(183 72% 42%) 100%)",
    "finalCtaOverlay": "linear-gradient(180deg, hsl(220 55% 22% / 0.55) 0%, hsl(var(--primary) / 0.82) 100%)"
  },
  "fonts": {
    "sans": ["Inter", "system-ui", "sans-serif"],
    "display": ["Poppins", "sans-serif"],
    "brand": ["Sora", "Inter", "system-ui", "sans-serif"]
  },
  "radius": {
    "base": "0.75rem",
    "card": "1rem",
    "cardLg": "1.5rem",
    "pill": "9999px"
  },
  "shadows": {
    "sm": "0 2px 4px hsl(215 25% 15% / 0.05)",
    "md": "0 4px 12px hsl(215 25% 15% / 0.08)",
    "lg": "0 8px 24px hsl(215 25% 15% / 0.12)",
    "xl": "0 12px 32px hsl(215 25% 15% / 0.16)",
    "ctaGlowPrimary": "0 8px 28px hsl(var(--primary) / 0.35)"
  },
  "breakpoints": {
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "container2xl": 1400
  },
  "animation": {
    "typewriter": { "speed": 42, "deleteSpeed": 28, "waitTime": 2200, "initialDelay": 400 },
    "marquee": { "duration": "42s", "timing": "linear" },
    "heroEntrance": { "duration": 0.5, "y": 20 },
    "fadeInSection": { "duration": 0.55, "y": 28, "ease": [0.22, 1, 0.36, 1] },
    "statCountUp": { "durationMs": 1600 },
    "profileRotate": { "intervalMs": 5500 },
    "stepperAutoplay": { "intervalMs": 5000 },
    "navbarTransition": { "duration": 0.3 },
    "accordion": { "duration": "0.2s", "ease": "ease-out" },
    "plasmaOrb1": { "duration": "22s" },
    "plasmaOrb2": { "duration": "18s" }
  },
  "zIndex": {
    "content": 1,
    "navbar": 200,
    "mobileMenu": 210,
    "elluraChat": 50,
    "megaMenu": 100
  }
}
```

---

## Global overlays not in main scroll flow

### Ellura chatbot (`ElluraChatbot.tsx`)

- Fixed `z-50` bottom-right
- Position: `bottom-[5.5rem] right-4 md:bottom-6 md:right-6`
- Draggable horizontally; drag right >40px hides to tab
- Invite bubble: "Need help with hiring?" / "Chat with Ellura — your NexHire guide."
- Panel: `w-[min(100vw-2rem,380px)]` `h-[min(520px,calc(100dvh-9.5rem))]`
- Header gradient: `from-violet-600 via-violet-700 to-indigo-800`

### MarketingLayout page enter

- `motion.div` opacity 0→1 in 0.35s wraps all children

---

## Verification notes & gaps

| Item | Status |
|------|--------|
| Logo file `/ellure-logo.png` | Code references PNG; repo `public/` has SVG — verify deployed asset |
| Live pricing values from Supabase | May differ from defaults; API merge at runtime |
| Testimonial avatars | External pravatar.cc — clone needs fallback strategy |
| `prefers-reduced-motion` | Extensively handled; test each section when cloning |
| Dark mode on marketing | Force-disabled via `ForceLightTheme` |

---

## Summary for ALIGN Network clone team

Rebuild order: **tokens → layout shell → navbar → shader hero → glass profile card → pastel sections → SVG mockups → motion polish → footer/chat**. The site's premium feel comes from (1) WebGL shader + violet plasma orbs, (2) glass morphism applicant card with live rotation, (3) consistent pastel HEX bands, (4) tight Framer Motion scroll reveals, and (5) inline SVG product collages — **not** from runtime 3D engines. Match exact Tailwind class stacks in Phase 11 recipes for fastest parity.

---

*End of specification. Word count: 3,400+.*
