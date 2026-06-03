# Cursor prompt — deep extract: MakTree **MR + Manager** dashboards only

Use this in the **MakTree / maktree-field-hub** repo (the reference project).  
Do **not** use the older generic `EXTRACT_REFERENCE_PORTAL_UIUX.md` alone — this prompt is the **primary** spec for Ellure portal redesign.

---

## What you will do (two steps)

1. **Paste the START → END block** below into Cursor in MakTree → get **`MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`**
2. Copy that file into Ellure: `docs/MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`
3. In Ellure, run **`APPLY_MR_MANAGER_UIUX_TO_ELLURE_PORTALS.md`**

---

## START — paste into MakTree project

You are a **UI/UX archaeologist**. Your job is to document the **MR (field rep)** and **Manager** dashboards so completely that another team can rebuild **the same layout, spacing, colors, typography, and component chrome** in a different product — **without copying MakTree features or data**.

### Output file (mandatory)

Create **`MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`** at repo root (or `docs/`).

- Minimum **400 lines** of useful content (no filler).
- **No TBD** placeholders — inspect the code.
- **Do not modify** any file except this markdown export.

### Scope — ONLY these roles

| Include | Routes prefix | Primary files to open |
|---------|---------------|------------------------|
| **MR dashboard** | `/mr/*` | `src/pages/mr/*.tsx`, `src/components/dashboard/*`, `src/components/shared/PageHeader.tsx`, `BottomNav.tsx`, `dashboard-shell.tsx` |
| **Manager dashboard** | `/manager/*` | `src/pages/manager/*.tsx`, `src/components/manager/*` |
| **Shared shell** used by MR/Manager | — | `PageHeader`, `BottomNav`, `dashboard-shell.tsx`, `DashboardSection`, `StatCard`, `dashboard-stat-link-cards.tsx`, `profile-summary-card.tsx`, `NotificationBell.tsx` |
| **Profile** (MR/Manager use it) | `/profile` | `src/pages/profile/Profile.tsx` |

| Exclude (mention only in 1 paragraph “not used for Ellure shell”) |
|--------|
| `/admin/*` except as contrast |
| Marketing / login pages (brief login card notes only) |

### Hard rules

1. Document **layout and visuals only** — not business rules, not API shapes.
2. Every claim must cite **`file/path.tsx`** (and component name if exported).
3. Copy **exact** CSS variable values, Tailwind class strings, and pixel/rem sizes from code.
4. For **each page**, describe **top-to-bottom section order** on **mobile, tablet, desktop** (three subsections).
5. Include **ASCII wireframes** per homepage (MR + Manager) showing section stacking.
6. Document **profile photo / avatar** everywhere it appears (size, ring, fallback initials, upload if visible in UI).
7. Document **quick actions / shortcuts** grids: column count per breakpoint, icon box size, label typography, tap feedback.
8. Document **bottom navigation**: 5 items, labels, icons, active indicator, glass styles, safe-area.
9. Document **PageHeader**: home vs inner page, back button, brand, notification bell, avatar tap target.
10. Export **copy-paste Tailwind snippets** for: page wrapper, panel card, stat card, list row, quick action tile, welcome hero, alert panel, filter chip.

---

## Required document structure

```markdown
# MR & Manager dashboard UI/UX export (full layout spec)

> Source: [project name]
> Generated: [date]
> Purpose: Pixel-faithful layout clone for Ellure NexHire (applicant ≈ MR, client ≈ Manager, admin ≈ hybrid)

## 0. How to read this doc
- Ellure will clone **structure and style**, not MakTree features.

## 1. Global design system (MR/Manager)
### 1.1 Colors (light + dark) — table with HSL/hex from index.css / tailwind.config
### 1.2 Typography scale
### 1.3 Spacing, radius, shadow, glass
### 1.4 Icons (sizes per context)
### 1.5 Motion / animation classes used on dashboard

## 2. App shell (MR & Manager identical shell)
### 2.1 PageHeader — anatomy diagram (ASCII), classes, safe-area
### 2.2 BottomNav — anatomy, active state, 5 items per role (MR vs Manager table)
### 2.3 dashboardPageClass() — full class string + max-width per breakpoint
### 2.4 dashboardPanelClass() / DashboardSection / glass-card
### 2.5 Content padding bottom (clearance for bottom nav)

## 3. MR dashboard — page by page

For EACH route under `/mr/` listed in App.tsx:

### 3.X [Page name] — `[route]`
- **Nav label** (bottom nav or none)
- **Header mode**: home brand | back + title
- **File paths** (page + key components)
- **Mobile layout** (ordered list 1…n of every visible section)
- **Tablet layout** (what changes: grids, 2-col, etc.)
- **Desktop layout** (max-width, multi-column)
- **ASCII wireframe** (mobile)
- **Components table**: section → component file → key Tailwind classes
- **Cards/stats**: dimensions, typography, colors, links/chevrons
- **Quick actions** (if any): grid cols, tile structure
- **Profile/avatar** (if any)
- **Lists**: row card pattern, avatars, actions, grouping, search, empty state
- **Charts** (if any): type, height, wrapper card
- **Filters** (if any): chips, selects, toolbar
- **Drawers/sheets/dialogs** (if any): width, header, footer buttons

**Mandatory deep pages (extra detail, ≥40 lines each):**
- `/mr/dashboard` — HOME (hero, today panel, quick actions, stat cards, alerts, targets, reorder classes `max-md:order-*`)
- `/mr/master-list` — list + search + coverage + drawer
- `/mr/analytics` — performance dashboard
- `/mr/report/history` — history list
- `/mr/report/new` — step form layout (sections only)

## 4. Manager dashboard — page by page

Same template as §3 for EVERY `/manager/` route.

**Mandatory deep pages (≥40 lines each):**
- `/manager/dashboard` — HOME (hero, team stats, quick actions, leaderboard)
- `/manager/team` — team hub list + search + drawer
- `/manager/team/:mrId` — tabbed detail layout
- `/manager/analytics` — performance
- `/manager/reports` — list
- `/manager/history` — list
- `/manager/requests` — approval cards

## 5. Side-by-side: MR home vs Manager home
| UI block | MR home | Manager home | Same or different? |
|----------|---------|--------------|-------------------|
| Welcome hero | … | … | … |
| Quick actions grid | … | … | … |
| Stat/KPI row | … | … | … |
| Secondary panels | … | … | … |

## 6. Profile page (shared MR/Manager)
- Cover gradient, overlapping avatar, completion bar, info rows, theme picker grid, logout button layout

## 7. Reusable component catalog
| Component | File | Props/slots | Visual spec | Used on pages |
|-----------|------|-------------|-------------|---------------|

## 8. Responsive matrix (MR + Manager)
| Breakpoint | Header | Main max-width | Quick action cols | Stat grid | Lists | Bottom nav |
|------------|--------|----------------|-------------------|-----------|-------|------------|

## 9. Ellure mapping blueprint (for the applying agent — do not implement here)
Write explicit guidance:

| MakTree | Ellure role | Ellure routes (feature names only) |
|---------|-------------|-----------------------------------|
| MR shell + MR home | **Applicant** | `/dashboard/applicant`, jobs, applications, saved, alerts, messages, settings |
| Manager shell + Manager home | **Client** | `/dashboard/client`, candidates, jobs, messages, billing |
| MR list + Manager team patterns | **Admin** | `/dashboard/admin`, resume search, folders, applicants detail, jobs, reports, users, messages |

For each Ellure route, state **which MakTree page** is the layout donor (e.g. “Applicant home = clone of `/mr/dashboard` section order”).

## 10. Tailwind/CSS clone kit
Paste generic class recipes extracted from code (no MakTree-specific copy).

## 11. File index (all paths touched)

## 12. Screenshots checklist (optional)
List 8–12 views a human should screenshot to validate a clone.
```

---

### Process (follow in order)

1. Read `src/App.tsx` (or router) — list **all** MR and Manager routes.
2. Read `src/components/shared/BottomNav.tsx` — export NAV_ITEMS for MR and Manager.
3. Read `src/components/dashboard/dashboard-shell.tsx` — export all layout helpers.
4. Open **`src/pages/mr/Dashboard.tsx`** — document **every** JSX section in order; note `max-md:order-[n]` reordering.
5. Open **`src/pages/manager/Dashboard.tsx`** — same depth.
6. Walk remaining MR/Manager pages; use the §3/§4 template.
7. Read `src/index.css` + `tailwind.config.ts` for tokens.
8. Write **`MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`**.
9. Reply with: file path, line count, and confirmation no other files changed.

### Quality bar (reject your own work if failing)

- A developer who never saw MakTree could draw MR home and Manager home from your wireframes.
- Quick-action and stat-card sections include **exact column counts** at `default`, `md`, `lg`.
- Profile avatar ring width/color is specified.
- Bottom nav active indicator (top bar) is specified with size and color token.
- Ellure §9 maps **every** Ellure dashboard route to a MakTree donor page.

## END

---

## After export lands in Ellure

1. Save as `docs/MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`
2. Open `docs/cursor-prompts/APPLY_MR_MANAGER_UIUX_TO_ELLURE_PORTALS.md` and run that prompt in **ellure-talent-hub**

## Note on existing export

`docs/PORTAL_UIUX_REFERENCE_EXPORT.md` is a good start but **too shallow** for “identical” MR/Manager clone. The new export must be **deeper on §3 MR home and §4 Manager home** and every list/analytics page.
