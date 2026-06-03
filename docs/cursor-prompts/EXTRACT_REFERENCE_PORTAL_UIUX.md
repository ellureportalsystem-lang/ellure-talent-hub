# Cursor prompt — extract portal UI/UX reference (generic — superseded for MR/Manager clone)

> **For identical MR + Manager dashboard clone**, use instead:  
> **`EXTRACT_MR_MANAGER_DASHBOARD_UIUX.md`** → output `MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`  
> Then in Ellure: **`APPLY_MR_MANAGER_UIUX_TO_ELLURE_PORTALS.md`**

This older prompt is a shallow whole-portal audit. It is not enough for “same layout as MR/Manager home”.

---

Copy everything inside the **START / END** block below into Cursor in your **reference portal** repo (the unrelated product).

After it finishes, copy **`PORTAL_UIUX_REFERENCE_EXPORT.md`** to `docs/PORTAL_UIUX_REFERENCE_EXPORT.md` in Ellure.

---

## START — paste from here

You are auditing this codebase **only for visual design and layout patterns** — not for product features, business logic, APIs, or data models.

### Goal

Produce a single markdown file named **`PORTAL_UIUX_REFERENCE_EXPORT.md`** at the **repository root** (or under `docs/` if the repo convention prefers `docs/`). This file will be used as **UI/UX inspiration** for a **different** hiring portal (Ellure NexHire: admin + client + applicant dashboards). We are **not** copying features from this app; we are extracting how it *looks and feels* on mobile, tablet, and desktop.

### Hard rules

1. **Do not** propose reimplementing this app’s features elsewhere.
2. **Do not** change any source code except creating/updating **`PORTAL_UIUX_REFERENCE_EXPORT.md`**.
3. **Do** inspect real components, CSS variables, Tailwind config, layout shells, and responsive breakpoints in this repo.
4. **Do** describe what you see with file paths and component names so another developer can map patterns.
5. If something is unclear, note “unknown” — do not invent hex codes; read them from theme/CSS.
6. Include **screenshot-level detail in words**: spacing, radius, shadows, typography scale, icon style, empty states, loading states.
7. Cover **at least three breakpoints** with explicit behavior:
   - **Mobile** (e.g. &lt; 768px): bottom nav, sheets, stacked cards, touch targets
   - **Tablet** (e.g. 768px–1023px): collapsed sidebar, 2-column grids, filter drawers
   - **Laptop/desktop** (e.g. ≥ 1024px): persistent sidebar, multi-column dashboards, dense tables

### What to audit in this codebase

Walk the **authenticated dashboard / portal** areas (whatever this app calls them — sidebar layouts, role-based shells, settings, lists, detail pages, messaging, analytics). For each major **page type**, document layout and components, not business rules.

| Area | Document |
|------|----------|
| **App shell** | Sidebar width (collapsed/expanded), header height, sticky regions, safe-area, bottom navigation |
| **Theme** | Light/dark tokens, primary/secondary/accent, semantic colors (success/warning/destructive), borders, radii, shadows |
| **Typography** | Font families, weights, page titles vs section titles vs body vs captions |
| **Cards** | Padding, border vs shadow, hover, stat/KPI cards, list cards, action cards |
| **Tables & lists** | Desktop table vs mobile card list; filters; pagination; bulk actions |
| **Forms & filters** | Search bars, chips, date ranges, drawer vs inline filters |
| **Charts / viz** | Chart types, colors, legends, responsive chart height |
| **Messaging / chat** | Thread list, bubbles, composer, attachments, unread badges |
| **Navigation** | Active states, badges, overflow “More” menu, settings placement |
| **Modals / drawers / sheets** | When each is used; widths on tablet/desktop |
| **Empty / error / loading** | Skeletons, spinners, copy tone, illustration use |
| **Motion** | Page transitions, hover, reduced-motion considerations (if any) |

### Required structure for `PORTAL_UIUX_REFERENCE_EXPORT.md`

Use this exact outline (fill every section; use tables and bullet lists):

```markdown
# Portal UI/UX reference export

> Source: [PROJECT NAME]
> Generated: [DATE]
> Purpose: Visual/layout inspiration for Ellure NexHire dashboards (admin, client, applicant) — not feature parity.

## 1. Executive summary
- One paragraph on overall design language (e.g. dense enterprise, consumer mobile-first, glassmorphism, etc.)
- Top 5 patterns worth borrowing for a recruiting portal
- Top 5 patterns to avoid for recruiting UX

## 2. Design tokens
### 2.1 Color palette (light)
| Token / role | Value | Usage |
### 2.2 Color palette (dark)
### 2.3 Typography
### 2.4 Spacing & layout grid
### 2.5 Radius, border, shadow
### 2.6 Icons (library, sizes)

## 3. Responsive system
| Breakpoint | Sidebar | Header | Main content | Lists/tables | Nav |
|------------|---------|--------|--------------|--------------|-----|
| Mobile | … | … | … | … | … |
| Tablet | … | … | … | … | … |
| Desktop | … | … | … | … | … |

## 4. App shell & navigation
- Shell component(s) with file paths
- Sidebar behavior (collapse, sections, footer user block)
- Header (greeting vs title, actions, notifications)
- Mobile bottom nav (items, max count, overflow)
- Role-specific accents (if multiple roles exist)

## 5. Component patterns (with file paths)
### 5.1 Cards (stat, content, interactive)
### 5.2 Data tables → mobile transformation
### 5.3 Filters & search
### 5.4 Charts & dashboards
### 5.5 Messaging / chat UI
### 5.6 Profile / detail pages
### 5.7 Settings pages
### 5.8 Notifications

## 6. Page inventory (UI only)
For each major routed dashboard page:
- Route or nav label
- Primary layout (1-col / 2-col / sidebar + main)
- Key widgets on mobile / tablet / desktop
- Component file paths

## 7. Role-based differences (if applicable)
How UI differs per role (layout density, nav items, accent color) — UI only.

## 8. Accessibility & touch
- Minimum tap targets
- Focus rings
- Contrast notes

## 9. Mapping notes for Ellure NexHire (destination)
This section is **for the consuming team**. Given a recruiting portal with:
- **Admin**: applicants DB, resume search, folders, jobs, messages, reports, users
- **Client**: candidates, jobs, messages, subscription
- **Applicant**: home, jobs, applications, saved jobs, alerts, messages, profile views

Suggest **which patterns from this reference app** fit each Ellure area (table vs cards, filter placement, home dashboard hero, etc.). Do **not** list features to copy from this app — only **layout and visual patterns**.

## 10. File index
Table: pattern name → primary file path(s) → brief note

## 11. Optional: CSS / Tailwind snippets
Paste only **generic** reusable snippets (e.g. card class, nav link active state) with no business-specific class names.
```

### Process

1. Search for dashboard layout, portal shell, theme provider, and global CSS.
2. Open representative pages for list, detail, dashboard home, settings, and messages.
3. Read `tailwind.config`, `index.css` / global styles, and any `theme` or `design-tokens` files.
4. Write **`PORTAL_UIUX_REFERENCE_EXPORT.md`** following the outline above.
5. Confirm in chat: output path, line count, and that no other files were modified.

### Output

- **Single deliverable:** `PORTAL_UIUX_REFERENCE_EXPORT.md` (complete, no placeholders like “TBD”).
- **No code changes** except that file.

## END — paste until here

---

## After you get the export

1. Save as `docs/PORTAL_UIUX_REFERENCE_EXPORT.md` in **ellure-talent-hub**.
2. In Ellure Cursor, use prompt: **`docs/cursor-prompts/APPLY_REFERENCE_UIUX_TO_ELLURE_PORTALS.md`** (create on demand if missing) or say:

   > Apply `docs/PORTAL_UIUX_REFERENCE_EXPORT.md` to admin, client, and applicant dashboards only. Keep marketing site locked. Keep canonical routes in `docs/UI_CANONICAL_ROUTES.md`. No new features — UI/layout/theme only.

### Ellure constraints (for the applying agent later)

| Keep | Do not change |
|------|----------------|
| Routes in `docs/UI_CANONICAL_ROUTES.md` | `src/pages/Landing.tsx`, marketing pages, Navbar, Footer |
| Existing features & Supabase wiring | Reference app’s feature set |
| Brand primary ~ `#0560C7` / teal secondary unless reference doc justifies subtle harmony | Copy unrelated product copy/labels |

Current Ellure portal stack: React + Vite + Tailwind + shadcn, `PortalDashboardLayout`, role classes `portal-dashboard--admin|client|applicant`, light/dark via `portal-theme` localStorage.
