# Ellure NexHire — Complete Website Reference

A single reference for the public marketing site, design system, content, and application UI. Content summaries match what is implemented in `src/pages/` today.

---

## 1. What this product is

**Ellure NexHire** is a recruitment platform that connects:

- **Applicants** — register, build profiles, apply, and use a personal dashboard  
- **Clients (employers)** — search candidates, shortlists, messaging, subscription-aware access  
- **Admins** — full applicant database, analytics, user management, enterprise profile views  

The **marketing website** (Home, Services, Industries, etc.) is separate from the **authenticated portals** (`/dashboard/applicant`, `/dashboard/admin`, `/dashboard/client`). Marketing pages are always forced to **light theme** for consistent branding.

**Brand split (important for copy):**

- **Ellure Consulting Services** — recruitment / hiring services company  
- **Ellure NexHire** — the technology platform (this site and app)

---

## 2. Technology & UI approach

### Stack

| Layer | Technology |
|--------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 + CSS variables in `src/index.css` |
| Components | shadcn/ui (Radix primitives + `src/components/ui/`) |
| Icons | Lucide React |
| Motion | Framer Motion (page transitions, scroll reveals, hero carousel) |
| Data / auth | Supabase (`@supabase/supabase-js`) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod (auth and dashboards) |
| PWA | `vite-plugin-pwa` (service worker in production only) |

### UI style (marketing)

- **Modern B2B SaaS / recruitment marketing** — full-width heroes, card grids, soft gradients, floating geometric decorations  
- **Component pattern:** `MarketingLayout` wrapper → sticky `Navbar` → hero → `marketing-section` blocks → `Footer`  
- **Interaction:** expandable cards (click to expand/collapse), industry detail dialog, hero auto-rotate (5s) with manual dots  
- **Responsive:** mobile-first; hamburger nav below `md`; 2-column stats on mobile, 4 on desktop  

### UI style (dashboards)

- **Enterprise admin console** — sidebar navigation, dense tables, filters, data grids, profile drill-down (`EnterpriseApplicantProfile`)  
- **Applicant portal** — simpler dashboard: profile, applications, jobs, messages, settings  
- **Client portal** — candidate search, folders, messaging, plan/subscription banners  
- Uses shared **design tokens** (primary, secondary, surfaces) but more table/form-heavy than marketing  

### Key UI files

| Area | Location |
|------|----------|
| Design tokens | `src/index.css` (`:root` / `.dark`) |
| Tailwind theme | `tailwind.config.ts` |
| Marketing shell | `src/components/marketing/MarketingLayout.tsx`, `FloatingGeometry.tsx` |
| Page heroes | `src/components/marketing/MarketingPageHero.tsx` |
| Layout | `src/components/layout/Navbar.tsx`, `Footer.tsx` |
| Routes | `src/App.tsx` |

---

## 3. Typography

### Font families

Loaded in `index.html` from Google Fonts:

- **Poppins** — weights 400, 500, 600, 700  
- **DM Sans** — loaded but marketing/dashboard body text primarily uses Tailwind’s default sans stack unless a class overrides it  

### Where fonts are used

| Use | Font | Classes / rules |
|-----|------|------------------|
| Hero & section titles (marketing) | Poppins | `.hero-title`, `.marketing-landing-hero-title`, `.marketing-hero-title`, `font-poppins` |
| Hero subtitles | Poppins | `.hero-subtitle` |
| Stats numbers | Poppins | `.font-stat` (tabular nums) |
| Navbar wordmark | Poppins-style bold | Inline styles: Ellure `#3d4853`, NexHire `#0566cd` |
| Body copy | System / Tailwind sans | `text-muted-foreground`, default paragraph styles |

### Title hierarchy (typical)

- **Home hero:** `clamp(1.45rem → 3.85rem)` via `.marketing-landing-hero-title`  
- **Inner page heroes:** `clamp(1.75rem → 4rem)` via `.marketing-hero-title`  
- **Section H2:** `text-2xl` → `text-4xl`, `font-bold`  
- **Card H3:** `text-lg` → `text-xl`, `font-semibold`  
- **Labels / eyebrows:** `text-sm uppercase tracking-wider text-primary`  

### Accent text

- **Gold highlights** in headlines: class `.gold-text` → `hsl(var(--gold))` — used for emphasis words in heroes and CTAs (not for body paragraphs).

---

## 4. Color system

All semantic colors are **HSL CSS variables** in `src/index.css` (required for Tailwind `hsl(var(--primary))` pattern).

### Light mode (marketing default)

| Token | HSL | Role | Approx. hex |
|-------|-----|------|-------------|
| `--primary` | `212 94% 38%` | Brand blue — buttons, links, icons | ~`#0566cd` |
| `--secondary` | `183 72% 38%` | Teal — secondary CTAs, check icons | ~`#1a9e9e` |
| `--gold` | `46 80% 52%` | Hero accent words | ~`#d4af37` |
| `--background` | `0 0% 100%` | Page background | White |
| `--foreground` | `215 25% 15%` | Main text | Dark slate |
| `--muted` | `220 17% 96%` | Section tints | Light gray |
| `--muted-foreground` | `215 12% 45%` | Secondary text | Gray |
| `--destructive` | `0 84% 60%` | Errors / delete | Red |
| `--success` / `--brand-green` | `183 72% 38%` | Success (aligned with secondary) | Teal |
| `--warning` | `38 92% 50%` | Warnings | Amber |
| `--info` | `199 89% 48%` | Info | Sky blue |
| `--border` | `216 15% 88%` | Cards, inputs | Light gray |

### Gradients & shadows

- **`--gradient-primary`:** 135° blue → teal (hero fallback background, buttons)  
- **`--gradient-subtle`:** white → off-white (page base via `bg-gradient-subtle`)  
- **Shadows:** `--shadow-sm` through `--shadow-xl` (soft slate-tinted)  
- **Hero overlay:** `.marketing-hero-overlay` — dark gradient so white/gold text stays readable on banner photos  

### Dark mode

Defined in `.dark` for dashboards and system theme. **Public marketing routes use `ForceLightTheme`** so visitors always see light branding.

### Logo colors (navbar / footer)

- **Ellure:** `#3d4853`  
- **NexHire:** `#0566cd`  
- **PWA theme_color:** `#0566cd`

---

## 5. Layout & spacing patterns

| Pattern | Description |
|---------|-------------|
| **Container** | Centered, responsive padding (`1rem` → `2rem` on large screens), max `1400px` at `2xl` |
| **Marketing sections** | `.marketing-section` — consistent vertical padding |
| **Home hero height** | Fixed: `480px` mobile → `520px` tablet → `560px` desktop (not full viewport) |
| **Inner page heroes** | `.marketing-page-hero` — shorter than old full-screen; text vertically centered |
| **Cards** | `border-2`, `shadow-md`, hover `shadow-xl`, `card-hover` lift, optional corner glow on hover |
| **CTA blocks** | Full-width card with background JPG + dark gradient overlay |

---

## 6. Site map & routes

### Public marketing

| URL | Page | Hero banner asset |
|-----|------|-------------------|
| `/` | Home (`Landing.tsx`) | `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg` (carousel) |
| `/services` | Services | `services-banner.jpg` |
| `/industries` | Industries | `industries-banner.jpg` |
| `/features` | Platform features | `features-banner.jpg` |
| `/about` | About | `about-banner.jpg` |
| `/contact` | Contact | `contact-banner.jpg` |
| `/faq` | FAQ | Text-only hero (no banner image) |
| `/privacy` | Privacy policy | Standard layout |
| `/terms` | Terms of service | Standard layout |

### Auth (light theme)

| URL | Purpose |
|-----|---------|
| `/auth/login`, `/auth/applicant` | Applicant login |
| `/auth/register` (+ email/phone/OTP/password steps) | Applicant signup |
| `/auth/applicant-register/step-1` … `step-8` | Multi-step applicant profile |
| `/admin/auth/login`, `/auth/admin` | Admin login |
| `/admin/auth/signup` | Admin signup (approval flow) |
| `/client/auth/login`, `/auth/client` | Client login |
| `/client/auth/signup` | Client signup |

### Dashboards (authenticated)

| URL | Role |
|-----|------|
| `/dashboard/applicant/*` | Applicant portal |
| `/dashboard/admin/*` | Admin dashboard |
| `/dashboard/client/*` | Client dashboard |

---

## 7. Page content (brief)

### 7.1 Home (`/`)

**Hero carousel (3 slides, 5s auto-advance):**

1. *Empowering Organizations With* → gold *Exceptional Talent* — precision-driven recruitment across industries.  
2. *Your Trusted Partner in* → *End-to-End Recruitment Excellence* — speed, accuracy, integrity.  
3. *Transforming Hiring for a Better, Smarter Workforce* — IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, etc.

**Buttons:** Join as Applicant → `/auth/register` · Hire Talent → `/contact`

**Stats strip:** 500+ placements · 50+ corporate clients · 8+ years · 95% satisfaction

**Dual CTA cards:**

- **Join as Applicant** — free profile, top companies, career guidance → Register  
- **Hire Talent** — pre-screened candidates, industry talent, fast turnaround → Contact  

**About snippet:** NexHire connects organizations with industry-ready talent; ~10 years across sectors; mission = right talent, right role.

**Features grid (6, expandable):** Smart Application Management · Advanced Analytics · Bulk Operations · Enterprise Security · Client Collaboration · Smart Matching Engine

**FAQ preview (4 items):** What is NexHire · Not a consultancy · Data security · How to register

**Final CTA:** *Ready to Transform Your Hiring?* — `cta-banner.jpg` background → Contact + Register buttons

---

### 7.2 Services (`/services`)

**Hero:** *Our Services* — structured hiring solutions for employers and candidates.

**What we do:** Supports hiring through coordination, relevance screening, and ethical process management — without replacing internal HR ownership.

**Six services (expandable cards):**

| Service | Summary |
|---------|---------|
| Resume Intake & Validation | Structured submission and basic validation |
| Profile Relevance Screening | Skills, experience, notice period, role fit |
| Skill & Role Mapping | Maps candidates to role requirements |
| Candidate–Client Coordination | Interviews, feedback, offers, joiner follow-ups |
| Hiring Process Support | Interview flow, timelines, closure assistance |
| Ethical Hiring Enablement | Transparency and accountability |

**How it works (4 steps):** Understand → Source → Screen → Deliver

**Notes:** Optional resume-writing on request; platform tracking/analytics live inside NexHire system.

**CTA:** Banner `services-cta-banner.jpg` — get started → Contact

---

### 7.3 Industries (`/industries`)

**Hero:** *Industries We Serve* — specialised recruitment across sectors.

**Seven sectors (card → dialog with roles):**

| Industry | Focus |
|----------|--------|
| IT & Technology Services | Devs, DevOps, cloud, IT leadership |
| ITES & Shared Services | Support, BPO, back office |
| BFSI | Banking, finance, insurance, compliance |
| E-commerce & Digital | Ops, logistics, digital marketing |
| Pharmaceuticals & Life Sciences | Sales, MR, QC, R&D, regulatory |
| Manufacturing & Engineering | Production, QC, project managers |
| Telecom & Infrastructure | Network, RF, sales, support |

**Why clients choose us:** Industry expertise · Quality screening · Talent network · Proven track record

**Stats:** 50+ hiring partners · 1,000+ placements · 95% satisfaction

**CTA:** `industries-cta-banner.jpg` — talent in your industry → Contact

---

### 7.4 Features (`/features`)

**Hero:** *Platform Features* — recruitment at scale with efficiency and precision.

**Six platform capabilities (expandable + benefit bullets):**

| Feature | Brief |
|---------|--------|
| Application Lifecycle Management | End-to-end candidate journey tracking |
| Context-Based Matching Engine | Relevance matching (not keyword-only) |
| HR–Recruiter Collaboration Workspace | Private notes and ethical collaboration |
| Controlled Bulk Actions | Bulk ops with enterprise-safe limits |
| Essential Hiring Analytics | Focused metrics, no dashboard bloat |
| Enterprise-Grade Security & Compliance | Access control and data protection |

**Stats block:** 80% time saved · 95% matching accuracy · 50K+ profiles · 24/7 support

**CTA:** `features-cta-banner.jpg`

---

### 7.5 About (`/about`)

**Hero:** *About Us* — structured, ethical, scalable hiring.

**Our journey:** Founded to bring structure and transparency to hiring; years supporting organisations; NexHire built as the technology layer for scalable workflows.

**Mission:** Efficient, transparent, ethical hiring through structured workflows and technology.

**Vision:** Trusted ecosystem with clarity, relevance, and long-term value.

**Values:** Ethical hiring · Quality over quantity · Accountability · Collaboration

**Why choose Ellure:** 10+ years industry knowledge · Process + platform · Quality-focused delivery · Higher success ratio · Flexible partnership

**CTA:** `about-cta-banner.jpg`

---

### 7.6 Contact (`/contact`)

**Hero:** *Get in Touch*

**Map:** Ellure Consulting Services, Pune (embedded Google Maps, opens external link)

**Form:** Name, email, phone, message → client-side toast confirmation (no backend email in UI alone)

**Contact details:**

- **Address:** H657 Parmar Nagar, Opp Vishal Mega Mart, Wanowrie, Pune – 411013  
- **Phone:** 7517383196  
- **Email:** ayessha03@ellure-consulttingservices.com  

**Social:** LinkedIn, Facebook, Instagram, WhatsApp links in footer/contact cards

**Business hours section:** Uses `contact-business-hours-banner.jpg` where applicable

---

### 7.7 FAQ (`/faq`)

Accordion-style FAQs:

- What is Ellure Nexhire?  
- Difference vs Ellure Consulting Services?  
- Is it a recruitment consultancy? (No — platform)  
- Recruitment / executive search? (Separate consulting entity)  
- Track hiring progress? (Yes, in portal)  
- Data secure? (Yes, enterprise practices)

---

### 7.8 Footer (all marketing pages)

- Brand blurb: connecting talent with organisations  
- Quick links: Home, About, Services, Industries, Features, FAQ  
- Legal: Privacy, Terms  
- Contact summary + social icons  
- Copyright Ellure NexHire  

---

## 8. Banner & image assets

All production banners live in `public/` and must be **photo banners** (not full-page UI screenshots).

| File | Used on |
|------|---------|
| `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg` | Home hero rotation |
| `cta-banner.jpg` | Home bottom CTA |
| `services-banner.jpg`, `services-cta-banner.jpg` | Services |
| `industries-banner.jpg`, `industries-cta-banner.jpg` | Industries |
| `features-banner.jpg`, `features-cta-banner.jpg` | Features |
| `about-banner.jpg`, `about-cta-banner.jpg` | About |
| `contact-banner.jpg`, `contact-business-hours-banner.jpg` | Contact |
| `ellure-logo.png`, `logo1.png` | Navbar, favicon, PWA icons |

See `BANNER_ASSETS_CHECKLIST.md` for verification scripts.

---

## 9. Navigation & global chrome

**Navbar links:** Home · Services · Industries · Features · About · Contact Us · **Login / Register**

**Behavior:** Sticky header, blur backdrop, active link underline, mobile slide-down menu

**Marketing chrome:** Optional floating geometry shapes behind content (`FloatingGeometry`)

---

## 10. Authenticated application (summary)

Not part of the marketing copy, but part of the same site:

### Applicant portal

- Dashboard home, profile (canonical embedded dashboard), applications, jobs, saved jobs, job alerts, messages, profile views, settings  
- Registration: 8-step form (basic info → address → education → experience → skills → preferences → documents → review)

### Admin dashboard

- Home metrics, applicant management grid, search/resume tools, per-applicant **enterprise profile** (education, experience, skills from DB + fallbacks), user/admin management, master data, messaging, analytics-style views

### Client dashboard

- Home (subscription expiry banners when applicable), candidate search, folders, messaging, candidate profile view via shared enterprise profile component (client mode)

### Security & session

- Role-based route guards (`DashboardRoute`)  
- Session timeout guard  
- Force password change flow when required  
- Supabase RLS on data tables  

---

## 11. Animations & accessibility

- **Framer Motion:** hero slide fade/slide; scroll `whileInView` reveals; expandable height animations  
- **Reduced motion:** `prefers-reduced-motion: reduce` disables decorative geometry animation  
- **Focus:** Ring uses `--ring` (primary blue) on interactive elements  

---

## 12. Related documentation

| Document | Topic |
|----------|--------|
| `THEME_DOCUMENTATION.md` | Extended token/button reference (verify against `index.css` if colors drift) |
| `PAGES_DOCUMENTATION.md` | Per-page layout notes |
| `docs/MARKETING_WEBSITE_LOCK.md` | Rules to prevent accidental marketing UI changes |
| `docs/UI_CANONICAL_ROUTES.md` | Dashboard route canonical map |
| `BANNER_ASSETS_CHECKLIST.md` | Banner file list |

---

## 13. Brand voice (content tone)

- Professional B2B recruitment / HR tech  
- Emphasises **structure, ethics, transparency, relevance** (not “AI hype”)  
- Clear separation: **platform** vs **consulting services**  
- CTAs drive either **applicant registration** or **employer contact**  

---

*Last aligned with codebase: marketing pages in `src/pages/`, design tokens in `src/index.css`, routes in `src/App.tsx`.*
