# Cursor prompt — clone MakTree MR/Manager UI onto Ellure portals

Use in **ellure-talent-hub** after `docs/MR_MANAGER_DASHBOARD_UIUX_EXPORT.md` exists (from MakTree extract prompt).

---

## START — paste into Ellure NexHire

Read **`docs/MR_MANAGER_DASHBOARD_UIUX_EXPORT.md`** in full. Rebuild Ellure’s authenticated portals to be **visually and structurally the same** as MakTree **MR** and **Manager** dashboards — **same section order, same card types, same spacing, same colors (map MakTree primary → Ellure portal tokens), same header/bottom nav behavior** — while keeping **only Ellure features, routes, and data**.

### Role mapping (non-negotiable)

| MakTree reference | Ellure portal | Shell donor |
|-------------------|---------------|-------------|
| **MR** (field rep) | **Applicant** | MR `PageHeader` + `BottomNav` + `dashboardPageClass()` |
| **Manager** | **Client** | Manager shell (same as MR) |
| **Admin** (MakTree sidebar — secondary) | **Admin** | Keep Ellure `PortalDashboardLayout` sidebar on **desktop**; on **mobile** use MR-style bottom nav + overflow menu. **Home + list pages** borrow layout from MR/Manager pages per §9 of export |

You are **cloning UI**, not features:

| Copy from MakTree | Do NOT copy |
|-------------------|-------------|
| Section order on home | Doctors, visits, territories |
| Welcome hero + avatar ring | MR/Manager role labels |
| Quick-action tile grid | 5-col field workflow labels (rewrite for Ellure) |
| Stat link cards, KPI typography | MakTree metrics names |
| Card list rows, search bars, drawers | Master list business logic |
| Colors, radius, glass, bottom nav chrome | Routes like `/mr/master-list` as URLs |
| Profile summary card layout | MakTree form fields |

### Ellure routes to implement (canonical — do not add routes)

From `docs/UI_CANONICAL_ROUTES.md`:

**Applicant (clone MR)**

| Ellure route | Layout donor (from export §9) | Ellure content |
|--------------|-------------------------------|----------------|
| `/dashboard/applicant` | **`/mr/dashboard`** — identical section stack | Profile strength, quick links: Jobs, Applications, Saved, Messages; stat cards: applications, pending, etc. |
| `/dashboard/applicant/jobs` | **`/mr/master-list`** list pattern | Job cards, search, city filter |
| `/dashboard/applicant/applications` | **`/mr/report/history`** | Application status cards |
| `/dashboard/applicant/saved-jobs` | MR list rows | Saved job cards |
| `/dashboard/applicant/job-alerts` | MR alert panels | Alert rules |
| `/dashboard/applicant/messages` | Notification sheet list pattern | Messaging workspace (keep feature, restyle chrome) |
| `/dashboard/applicant/profile-views` | MR history list | Profile view events |
| `/dashboard/applicant/settings` | **`/profile`** (MakTree) | Account, theme, password |

**Client (clone Manager)**

| Ellure route | Layout donor | Ellure content |
|--------------|--------------|----------------|
| `/dashboard/client` | **`/manager/dashboard`** | Company name hero, team/hiring KPIs, quick actions: Candidates, Jobs, Messages, Billing |
| `/dashboard/client/candidates` | **`/manager/team`** | Searchable candidate cards |
| `/dashboard/client/candidates/:id` | **`/manager/team/:mrId`** tabs | Candidate profile (existing view, new chrome) |
| `/dashboard/client/jobs` | Manager list + stat cards | Active jobs |
| `/dashboard/client/messages` | Manager notification sheet style | Client messages |
| `/dashboard/client/billing` | Profile `InfoRow` glass cards | Subscription |

**Admin (hybrid — lists from MR, home from Manager + admin density)**

| Ellure route | Layout donor | Ellure content |
|--------------|--------------|----------------|
| `/dashboard/admin` | **Manager home** + admin stat grid | Recruitment KPIs, charts (keep data, MR/Manager card chrome) |
| `/dashboard/admin/applicants` | **`/mr/master-list`** + admin search | Resume search + filters + results |
| `/dashboard/admin/applicants/:id` | **`/manager/team/:mrId`** or drawer detail | Enterprise applicant profile |
| `/dashboard/admin/folders` | MR grouped list | Folders |
| `/dashboard/admin/jobs` | MR/Manager card list | Jobs admin |
| `/dashboard/admin/reports` | **`/mr/analytics`** | Reports charts |
| `/dashboard/admin/users` | **`/admin/users`** chip filters + **MR list rows** | Users |
| `/dashboard/admin/messages` | Notification sheet | Emails |
| `/dashboard/admin/settings` | **`/profile`** | Admin settings |

### Implementation requirements

1. **Shared primitives** — implement or extend under `src/components/portal/` to match export §7–§10:
   - `PortalMrShell` or extend `PortalDashboardLayout` with MR/Manager header + bottom nav behavior
   - `PortalWelcomeHero` (MR/Manager hero — avatar ring, gradient, badge)
   - `PortalQuickActionGrid` (same column breakpoints as MR home)
   - `PortalStatLinkCard` (KPI + footer chevron on mobile)
   - `PortalListRow` (alternating `bg-card` / `bg-card/80`)
   - `PortalPageCanvas` = export `dashboardPageClass()`
   - `PortalPanel` = export `dashboardPanelClass()`

2. **Colors** — align `src/index.css` portal section to MakTree export §1.1 (HSL). Ellure applicant keeps blue accent; client cyan; admin blue — **same neutrals, borders, glass** as MakTree.

3. **Applicant home** must match MR home **section order** (use export wireframe):
   - Sticky glass header (greeting on home)
   - Welcome hero with **profile photo** or initials + ring
   - Quick actions row (4 tiles for Ellure, same tile **visual** as MR 5-col but 4-col)
   - 3-col stat cards on mobile (readable labels — **no 8px text**)
   - Alert/reminder panels (semantic tints)
   - Main content panels (resume, snapshot) in MR panel style
   - Bottom nav: 4 pins + Menu overflow (Ellure has more routes than 5)

4. **Client home** must match **Manager home** section order:
   - Manager hero + company context
   - Team/hiring overview panel
   - Quick actions (candidates, jobs, messages, billing)
   - KPI mini cards + subscription warning panel (Manager-style amber/destructive)
   - Recent activity / top jobs list in list-row style

5. **Admin** — desktop sidebar unchanged in width (~240px); restyle nav links to MakTree active state. Mobile: MR bottom nav pattern.

6. **Every** dashboard page in the tables above must use `DashboardPageShell` + donor layout — **no** bare `p-4 lg:p-6` wrappers left in `src/pages/dashboard/**`.

7. **Profile photos** — use existing Ellure image URLs; presentation must match MakTree avatar ring sizes from export.

8. **Do not edit** marketing files (`Landing`, `Navbar`, `Footer`, `components/marketing/**`). Run `scripts/verify-marketing-lock.ps1`.

9. **Do not** change Supabase queries, route paths, or feature logic except wiring buttons to existing navigations.

10. Run `npm run build` and fix errors.

### Visual acceptance checklist (must pass)

- [ ] Applicant home: user can point to MR-equivalent blocks in same vertical order as export wireframe
- [ ] Client home: matches Manager home structure
- [ ] Mobile bottom nav: glass + top active bar on all three portals
- [ ] Quick action tiles: icon in tinted `rounded-xl` box, `active:scale-95`
- [ ] List pages: no HTML tables on mobile — card rows only
- [ ] Cards: `rounded-2xl border-border/80 shadow-sm` everywhere in portals

### Deliverables

1. Code changes across admin, client, applicant dashboards
2. Update `docs/UI_CANONICAL_ROUTES.md` — add “MR/Manager layout donors” table
3. Short summary: files changed, any Ellure-specific deviations (e.g. 4 quick actions vs 5), marketing lock result

## END

---

## Ellure file targets (quick reference)

```
src/components/portal/PortalDashboardLayout.tsx
src/components/portal/portal-ui.tsx
src/components/portal/portalStyles.ts
src/components/dashboard/DashboardPageShell.tsx
src/index.css  (portal-dashboard section only)
src/pages/dashboard/ApplicantPortal.tsx
src/pages/dashboard/ApplicantDashboard.tsx
src/pages/dashboard/applicant/*
src/pages/dashboard/ClientDashboard.tsx
src/pages/dashboard/client/*
src/pages/dashboard/AdminDashboard.tsx
src/pages/dashboard/admin/*
```

## If export file is missing

Stop and tell the user to run `EXTRACT_MR_MANAGER_DASHBOARD_UIUX.md` in MakTree first.
