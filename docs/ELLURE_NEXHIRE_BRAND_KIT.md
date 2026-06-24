<!-- markdownlint-disable MD013 MD060 -->
# Ellure NexHire — Brand Kit (Typography & Colour)

**Document version:** 1.0  
**Product:** Ellure NexHire  
**Scope:** Public marketing website, Applicant dashboard, Client dashboard, Admin dashboard  

---

## 1. Brand wordmark colours

Used on logo lockups and dual-line wordmarks (e.g. auth and registration screens).

| Element | HEX | RGB | Usage |
|--------|-----|-----|--------|
| Ellure (wordmark line 1) | `#3D4853` | 61, 72, 83 | “Ellure” text |
| NexHire (wordmark line 2) | `#0566CD` | 5, 102, 205 | “NexHire” text |
| Browser theme (light) | `#0566CD` | 5, 102, 205 | Mobile browser chrome |

**Logo asset:** `ellure-logo.png` (icon mark; use on white or very light backgrounds).

---

## 2. Core brand palette (shared)

Primary brand colours used across the marketing site and as accents in portals.

| Name | HEX | HSL | Role |
|------|-----|-----|------|
| Brand blue (primary) | `#0566CD` | 212°, 94%, 38% | Primary buttons, links, key highlights |
| Brand teal (secondary) | `#1CB4A8` | 183°, 72%, 38% | Secondary actions, success, brand green |
| Brand gradient | Blue → Teal | 135° blend | Marketing hero and CTA bands |
| Gold (accent) | `#E8C547` | 46°, 80%, 52% | Occasional highlights |

### Semantic colours (all surfaces)

| Name | Light mode HEX | Role |
|------|----------------|------|
| Success | `#1CB4A8` | Positive status, confirmations |
| Warning | `#F59E0B` | Alerts, pending states |
| Info | `#0EA5E9` | Informational messages |
| Error / Destructive | `#EF4444` | Errors, destructive actions |

### Neutral text (light mode)

| Name | HEX | Role |
|------|-----|------|
| Text primary | `#0F172A` | Headings and main body |
| Text secondary | `#475569` | Supporting copy |
| Text muted | `#94A3B8` | Captions, placeholders |

### Neutral surfaces (light mode)

| Name | HEX | Role |
|------|-----|------|
| Page background | `#FFFFFF` | Default page |
| Subtle background | `#F8FAFC` | Sections, alternate rows |
| Muted fill | `#F1F5F9` | Inputs, chips, soft panels |
| Border | `#E2E8F0` | Dividers, card outlines |

---

## 3. Typography

### 3.1 Font families

| Font | Weights loaded | Primary use |
|------|----------------|-------------|
| **Poppins** | 400, 500, 600, 700 | Marketing headings and display text |
| **Inter** | 300, 400, 500, 600, 700, 800 | Marketing body (default UI), all portal UI |
| **Sora** | 400, 500, 600 | Portal product name / brand line in headers |
| **DM Sans** | 400, 500, 600 | Available in stack (supporting) |
| **System UI** | — | Fallback: `system-ui`, `sans-serif` |

### 3.2 Marketing website — typography

| Element | Font | Weight | Notes |
|---------|------|--------|--------|
| Page body | Inter | 400 | Default sans across pages |
| Section headings (H1–H3) | Poppins | 600–700 | Applied via `font-poppins` on headings |
| Subheadings | Poppins | 600 | |
| Buttons | Inter / Poppins | 500–600 | |
| Statistics / numbers | Poppins | 700 | Large KPI-style figures |
| Letter-spacing | Normal to tight | — | Headings: slight tight tracking |

### 3.3 Dashboards (Applicant, Client, Admin) — typography

| Element | Font | Weight | Notes |
|---------|------|--------|--------|
| All UI text | Inter | 400–600 | Base portal font |
| Product name in header | Sora | 600–800 | “Ellure NexHire” compact header |
| Portal suffix label | Sora + accent colour | 500–600 | e.g. Applicant, Client, Admin |
| Page titles | Inter | 600 | Semibold |
| Section labels | Inter | 600 | Uppercase labels: 11px, wide tracking |
| KPI / stat numbers | Inter | 600–700 | Tabular figures |
| Body letter-spacing | −0.011em | — | Slightly tightened for readability |

---

## 4. Marketing website — colour & theme

**Theme modes:** Light (default). Dark mode is not the primary marketing experience.

### 4.1 Primary UI colours (light)

| Token | HEX | Usage |
|-------|-----|--------|
| Background | `#FFFFFF` | Page background |
| Foreground (text) | `#1E293B` | Main text |
| Primary | `#0566CD` | Buttons, links, focus ring |
| Primary text on button | `#FFFFFF` | Text on primary buttons |
| Secondary | `#1CB4A8` | Secondary brand actions |
| Muted background | `#F4F6F8` | Soft sections |
| Muted text | `#64748B` | Secondary text |
| Border | `#DDE4ED` | Cards, inputs |
| Card surface | `#FFFFFF` | Cards on white |

### 4.2 Marketing surfaces (hex aliases)

| Token | HEX |
|-------|-----|
| Surface 1 | `#FFFFFF` |
| Surface 2 | `#F8FAFC` |
| Surface 3 | `#F1F5F9` |
| Surface border | `#E2E8F0` |

### 4.3 Corner radius

| Element | Value |
|---------|--------|
| Default radius | `12px` (0.75rem) |
| Cards (marketing) | `12px`–`16px` |
| Buttons | `8px`–`12px` |

---

## 5. Applicant dashboard — colour & theme

**Accent role:** Career / candidate portal (aligned with brand blue).

**Theme modes:** Light and dark (user-selectable in settings).

### 5.1 Light mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#0566CD` | Active nav, links, focus, brand highlight |
| Page background | `#F5F7FA` | App canvas |
| Card background | `#FFFFFF` | Panels and cards |
| Primary text | `#1C2333` | Headings and body |
| Muted text | `#6B7280` | Secondary labels |
| Border | `#E2E8F0` | Dividers |
| Primary button | `#0566CD` | Main actions |
| Glass header / nav | White at ~72% opacity | Sticky header and bottom bar |

### 5.2 Dark mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#4D9AFF` | Active states (lighter blue) |
| Page background | `#12151C` | App canvas |
| Card background | `#1A1F28` | Panels |
| Primary text | `#F1F5F9` | Headings and body |
| Muted text | `#9CA3AF` | Secondary labels |
| Border | `#2E3644` | Dividers |

### 5.3 Applicant — fonts

| Element | Font |
|---------|------|
| UI | Inter |
| Header wordmark | Sora (accent colour on portal name) |

---

## 6. Client dashboard — colour & theme

**Accent role:** Hiring / employer portal (cyan emphasis).

**Theme modes:** Light and dark (user-selectable in settings).

### 6.1 Light mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#0EA5E9` | Active nav, links, focus |
| Page background | `#F5F7FA` | Shared portal canvas |
| Card background | `#FFFFFF` | Panels |
| Primary (buttons) | `#0EA5E9` | Main actions |
| Primary text | `#1C2333` | Body and headings |
| Muted text | `#6B7280` | Labels |
| Border | `#E2E8F0` | Dividers |

### 6.2 Dark mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#38BDF8` | Active states |
| Page background | `#12151C` | App canvas |
| Card background | `#1A1F28` | Panels |
| Primary text | `#F1F5F9` | Body |
| Border | `#2E3644` | Dividers |

### 6.3 Client — fonts

| Element | Font |
|---------|------|
| UI | Inter |
| Header wordmark | Sora |

---

## 7. Admin dashboard — colour & theme

**Accent role:** Internal operations / recruitment admin (vivid blue).

**Theme modes:** Light and dark (user-selectable in settings).

### 7.1 Light mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#2B6CEE` | Active nav, links, focus, KPI emphasis |
| Page background | `#F5F7FA` | Shared portal canvas |
| Card background | `#FFFFFF` | Panels, tables |
| Primary (buttons) | `#2B6CEE` | Main actions |
| Primary text | `#1C2333` | Body and headings |
| Muted text | `#6B7280` | Labels, table headers |
| Border | `#E2E8F0` | Tables, cards |
| Sidebar surface | `#FAFAFA` | Desktop navigation (light grey) |

### 7.2 Dark mode

| Token | HEX | Usage |
|-------|-----|--------|
| Portal accent | `#6B9FE8` | Active states |
| Page background | `#12151C` | App canvas |
| Card background | `#1A1F28` | Panels |
| Primary text | `#F1F5F9` | Body |
| Border | `#2E3644` | Dividers |

### 7.3 Admin — fonts

| Element | Font |
|---------|------|
| UI | Inter |
| Header wordmark | Sora |
| Section labels | Inter, 11px, semibold, uppercase |

---

## 8. Dashboard shared UI (all three portals)

Applies to Applicant, Client, and Admin unless overridden above.

### 8.1 Layout surfaces (light)

| Token | HEX |
|-------|-----|
| Surface 1 (cards) | `#FFFFFF` |
| Surface 2 (nested) | `#F4F5F7` |
| Surface 3 (deeper nested) | `#EEF0F4` |
| Surface border | `#DDE1E8` |

### 8.2 Shape and chrome

| Property | Value |
|----------|--------|
| Card corner radius | `16px` (1rem / rounded-2xl) |
| Button corner radius | `8px`–`12px` |
| Card border | Light grey, ~80% opacity |
| Card shadow | Soft: `0 1px 2px` rgba(15, 23, 42, 0.04) |
| Bottom navigation (mobile) | Frosted white bar, accent top indicator on active tab |

### 8.3 Semantic colours in dashboards (light)

| State | HEX |
|-------|-----|
| Success background | `#F0FDF4` |
| Success text | `#16A34A` |
| Warning background | `#FFFBEB` |
| Warning text | `#D97706` |
| Error background | `#FEF2F2` |
| Error text | `#DC2626` |
| Info background | `#EFF6FF` |
| Info text | `#2563EB` |

---

## 9. Quick reference — accent by product area

| Area | Accent HEX (light) | Body font | Display / brand font |
|------|-------------------|-----------|----------------------|
| Marketing website | `#0566CD` | Inter | Poppins (headings) |
| Applicant dashboard | `#0566CD` | Inter | Sora |
| Client dashboard | `#0EA5E9` | Inter | Sora |
| Admin dashboard | `#2B6CEE` | Inter | Sora |

---

## 10. Colour usage rules (short)

1. **Marketing:** Use brand blue `#0566CD` and teal `#1CB4A8` together only in approved gradients and CTAs; keep large areas white or `#F8FAFC`.
2. **Applicant:** Use brand blue `#0566CD` as the only strong accent; do not substitute client cyan or admin bright blue.
3. **Client:** Use cyan `#0EA5E9` for all primary actions and active navigation in the client product.
4. **Admin:** Use admin blue `#2B6CEE` for admin-only screens; keeps internal tools visually distinct from applicant blue.
5. **Text:** Prefer `#0F172A` / `#1C2333` on light backgrounds and `#F1F5F9` on dark portal backgrounds.
6. **Typography:** Do not use Poppins for dashboard UI; reserve Poppins for the public marketing site headings only.

---

*End of brand kit — typography and colour only.*
