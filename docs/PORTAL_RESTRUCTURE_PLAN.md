# Ellure NexHire — Portal Restructure Plan

**Status:** Approved direction — implement page-by-page  
**Date:** June 2026  
**Reference UI:** Naukri recruiter (`recruit.naukri.com`, `resdex.naukri.com`)  
**Screenshot folder:** `uiuxsc/` (filename = page context)

---

## 1. Three portals — roles & purpose

| Portal | DB role | Who | Purpose |
|--------|---------|-----|---------|
| **Candidate** | `applicant` | Job seekers | Profile, applications, jobs — **no changes in this phase** |
| **Recruiter** | `client` | Companies / hiring teams | **100% Naukri recruiter UX** — home, jobs, ResDex, reports, mass mail |
| **Admin** | `admin` | Ellure internal ops | **Portal control plane** — data ingest, users, subscriptions, access, audit |

> **Naming:** UI says “Recruiter”; code/DB may keep `client` for compatibility. Display strings and new routes use “Recruiter”.

---

## 2. Feature placement — what moves where

### 2.1 Leave Admin → move to Recruiter dashboard

| Current admin route | Current component | New recruiter home |
|---------------------|-------------------|-------------------|
| `/dashboard/admin/applicants` | `ApplicantsManagement` | `/dashboard/client/resdex` (search + results) |
| `/dashboard/admin/applicants/:id` | `EnterpriseApplicantProfile` (admin) | `/dashboard/client/resdex/candidates/:id` |
| `/dashboard/admin/jobs` | `AdminJobsPage` | `/dashboard/client/jobs` (extend existing `JobsPage`) |
| `/dashboard/admin/folders` | `FoldersManagement` | `/dashboard/client/shortlists` (extend `ClientFoldersManagement`) |
| `/dashboard/admin/reports` (hiring funnel) | `ReportsPage` | `/dashboard/client/reports` (extend `ClientReportsPage`) |

Admin keeps **read-only** candidate lookup only if needed for support (optional later: `/dashboard/admin/data/candidates/:id`).

### 2.2 Stays in Admin (management only)

| Feature | Current | Target admin route | Notes |
|---------|---------|-------------------|-------|
| Excel import wizard | `ImportCandidatesPage` | `/dashboard/admin/data/import` | 4-step wizard — keep |
| Bulk resume upload | `BulkResumeUpload` | `/dashboard/admin/data/bulk-resumes` | Keep |
| Recruiter accounts | `ClientsManagement` | `/dashboard/admin/recruiters` | Rename UI; approve/suspend/create |
| Subscription plans | partial in `clientAdminService` | `/dashboard/admin/subscriptions` | **New** — CRUD `subscription_plans` |
| Recruiter access / quotas | `subscription_plans` + `clients` | `/dashboard/admin/recruiters/:id` | **New** — per-recruiter feature matrix |
| Admin users | — | `/dashboard/admin/admins` | **New** — super admin creates admins only |
| Platform analytics | `AdminHome` + `ReportsPage` | `/dashboard/admin` + `/dashboard/admin/analytics` | Ops KPIs, not Naukri-style |
| Audit log | `AuditLogPage` | `/dashboard/admin/audit-log` | Keep |
| Settings | `AdminSettings` | `/dashboard/admin/settings` | Keep |

### 2.3 Recruiter-only (Naukri — build from screenshots)

| Naukri section | Planned recruiter route | Screenshot ref |
|----------------|-------------------------|----------------|
| Home | `/dashboard/client` | `uiuxsc/homepage.PNG` |
| Jobs & Responses | `/dashboard/client/jobs` | *(you will upload)* |
| ResDex — search form | `/dashboard/client/resdex` | `uiuxsc/resdex.PNG`, `resdex2.PNG` |
| ResDex — results | `/dashboard/client/resdex/results` | `uiuxsc/searched candidates page.PNG` |
| Reports | `/dashboard/client/reports` | *(you will upload)* |
| Mass mail / NVite | `/dashboard/client/nvite` | *(you will upload)* |

---

## 3. Information architecture

### 3.1 Admin dashboard (light theme, modern ops console)

**Shell:** Light sidebar or top bar — **not** Naukri. Professional white/slate, Ellure blue accent (`#2B6CEE` per brand kit).

```
/dashboard/admin
├── /                          → Ops home (pending approvals, import stats, recruiter count)
├── /data
│   ├── /import                → Excel import wizard
│   └── /bulk-resumes          → Bulk CV upload
├── /recruiters                → List, approve, suspend, create
│   └── /:id                   → Recruiter detail + subscription + feature access
├── /subscriptions             → Plan templates (CV limit, ResDex, NVite, contact visibility)
├── /admins                    → Admin user management (super admin only)
├── /analytics                 → Platform-wide reports (registrations, funnel, plans)
├── /audit-log                 → Audit trail
└── /settings                  → Admin profile / security
```

**Admin home widgets (management-focused):**
- Pending recruiter approvals (queue)
- Candidates added today (from import + registrations)
- Active recruiters / suspended count
- Import jobs status (last run, errors)
- Quota alerts (recruiters near CV limit)
- Quick actions: Import Excel, Bulk resumes, Create recruiter

### 3.2 Recruiter dashboard (Naukri clone — top navigation)

**Shell:** `RecruiterShell` — white top bar, horizontal nav (match Naukri).

```
Top nav:  [Logo]  Home | Jobs & Responses | ResDex | Reports     [Recent] [Search] [Saved] [Bell] [Avatar]

/dashboard/client  (URL unchanged; UI label "Recruiter")
├── /                          → Naukri-style home (welcome, quota cards, promos)
├── /jobs                      → Jobs & Responses (post, manage, applications)
│   └── /:jobId/responses      → Per-job pipeline
├── /resdex                    → Search form page (boolean toggle, filters sidebar)
│   ├── /results               → Candidate results (left filters, cards, bulk actions)
│   └── /candidates/:id        → Candidate profile (read-only + unlock contact)
├── /reports                   → Recruiter hiring reports
├── /nvite                     → Mass mail / NVite (when screenshots provided)
├── /shortlists                → Saved folders (was "My Shortlists")
├── /messages                  → Emails / comms
├── /team                      → Team members
├── /billing                   → Plan usage (read-only; changes via admin)
└── /settings                  → Company profile
```

---

## 4. URLs, login paths & route protection

### 4.1 Public entry points (implement now; domain later)

| Audience | Registration | Login | After login |
|----------|--------------|-------|-------------|
| Candidate | `/auth/register` | `/auth/login` | `/dashboard/applicant` |
| Recruiter | `/client/auth/signup` → pending approval | `/client/auth/login` | `/dashboard/client` |
| Admin | **No public signup** | `/admin/auth/login` | `/dashboard/admin` |

### 4.2 Friendly redirects (add in `App.tsx`)

| Path | Redirect |
|------|----------|
| `/recruiter` | `/client/auth/login` |
| `/admin` | `/admin/auth/login` |

### 4.3 Route protection (existing `RoleBasedRoute` — keep)

| URL | Allowed role | Wrong role → |
|-----|--------------|--------------|
| `/dashboard/applicant/*` | `applicant` | `/auth/login` |
| `/dashboard/client/*` | `client` | `/client/auth/login` |
| `/dashboard/admin/*` | `admin` | `/admin/auth/login` |

Remove `admin` from `DashboardRoute allowedRoles` on client dashboard when restructure is done (currently admin can open client dashboard).

### 4.4 Domain checklist (when `ellurenexhire.com` is live)

| URL | Purpose | SEO |
|-----|---------|-----|
| `/` | Marketing home | Index |
| `/recruiter` | Recruiter login | **Index** (like Naukri) |
| `/auth/login` | Candidate login | Index |
| `/auth/register` | Candidate register | Index |
| `/admin` | Admin login | **`noindex, nofollow`** on login page |

### 4.5 Admin login hardening (phase 2)

- Rate limit: 3 attempts / 15 min / IP
- No “Forgot password” on admin login — reset via super admin only
- `profiles.role = 'admin'` verified in DB after auth

---

## 5. Recruiter access control (admin-managed)

Map to existing tables: `clients`, `subscription_plans`, `client_applicant_access`.

| Feature flag | Source | Admin sets on |
|--------------|--------|---------------|
| CV downloads / month | `subscription_plans.cv_downloads_per_month` | Plan + override on recruiter |
| ResDex search | plan + `clients.is_active` | Recruiter detail |
| Contact visibility | `can_see_contact_details` | Plan |
| Job posting limit | `jobs` count vs plan | Plan |
| NVite / mass mail | **new** `can_send_nvite` on plan | Plan |
| Boolean search | **new** `can_boolean_search` | Plan |
| Team seats | `client_team_members` | Recruiter detail |

**Admin UI:** Recruiter detail → “Feature access” card with plan dropdown + per-feature toggles + quota usage readout.

---

## 6. UI/UX rules

| Portal | Theme | Shell | Reference |
|--------|-------|-------|-----------|
| Admin | Light only | Modern ops sidebar (white/slate) | Ellure brand kit — professional, dense tables |
| Recruiter | Light only | Naukri top nav | `uiuxsc/*` screenshots — pixel-match per page |
| Candidate | Light only | Existing applicant portal | Unchanged |

**Screenshot workflow:**
1. You upload to `uiuxsc/` with descriptive filename (e.g. `jobs-responses-list.PNG`)
2. We implement **one page per PR** matching filename layout
3. You review → next page

---

## 7. Implementation phases (page-by-page)

### Phase 0 — Structure ✅ started
- [x] Add `/recruiter` and `/admin` redirects in `App.tsx`
- [x] Add `noindex` meta to `AdminLogin.tsx`
- [x] Create `RecruiterShell` + `NaukriTopNavShell` with **Credits remaining** badge on every page
- [x] Create `AdminPortalShell` (Naukri-style light top nav for admin)
- [x] Strip recruiter features from admin nav; legacy redirects to recruiter routes
- [x] Recruiter home skeleton from `homepage.PNG`
- [x] ResDex search form page from `resdex.PNG`
- [ ] Document route map in `docs/UI_CANONICAL_ROUTES.md`

### Phase 1 — Admin management console
- [x] Admin home: subscription expiry alert (next 7 days)
- [ ] Rebuild `AdminHome` → full ops dashboard polish
- [x] Move routes under `/dashboard/admin/data/*`
- [x] Rename Clients → Recruiters (`/dashboard/admin/recruiters`)
- [ ] Build `/dashboard/admin/recruiters/:id` (plan + access matrix + **Login as Recruiter** impersonate)
- [ ] Build `/dashboard/admin/subscriptions` (plan CRUD)
- [ ] Build `/dashboard/admin/admins` (super admin only)
- [x] Platform analytics at `/dashboard/admin/analytics`
- [x] Keep audit log

### Phase 2 — Recruiter Naukri UI (screenshots, in order)
1. [x] **Home** — `homepage.PNG` (skeleton; polish with your uploads)
2. [x] **ResDex search form** — `resdex.PNG`, `resdex2.PNG` (v1)
3. [ ] **ResDex results** — `searched candidates page.PNG` (wire Naukri card layout)
4. [ ] **NVite / mass mail** — **step 3** (after results; tied to ResDex selection)
5. [ ] **Jobs & Responses** — *(awaiting screenshot)*
6. [ ] **Reports** — *(awaiting screenshot)*

### Phase 3 — Wire existing logic into new shells
- [x] ResDex results route → `ApplicantsManagement` at `/dashboard/client/resdex/results`
- [x] Admin-only import/bulk at `/data/*`
- [ ] Feature gates from `subscription_plans` on recruiter UI
- [x] Remove admin access to client dashboard route

---

## 11. Plan improvements (incorporated)

1. **Credits remaining badge** — on every recruiter page via `RecruiterShell` / `CreditsRemainingBadge` (CV used vs plan limit).
2. **Admin home** — “Recruiters near subscription expiry (7 days)” alert widget.
3. **Impersonate** — Phase 1: “Login as Recruiter” on `/dashboard/admin/recruiters/:id` (admin views recruiter dashboard as that account).
4. **NVite order** — Phase 2 step 4 (after ResDex results), not last — mass mail launches from results selection.
5. **Admin UI** — Naukri-style light top nav (`AdminPortalShell`), same chrome family as recruiter until admin-specific screenshots arrive.

---

## 12. Naukri feature parity backlog (recruiter)

**ResDex:** search within results · candidate comparison · similar profiles sidebar · search history dropdown · fresher mode · radius search

**Jobs:** hot vacancy / walk-in badges · screening questions · auto-rejection emails · job templates · duplicate job · stage email notifications · application star ratings

**NVite:** pool preview · personalization tokens · schedule send · unsubscribe · delivery report · follow-up sequence · saved templates

**Reports:** source of hire · time-to-hire · team performance · job visibility · ResDex usage · export all

**Profile:** download tracking · already contacted badge · notes · tags · team activity log

**Account:** usage dashboard · team activity log · plan comparison · auto-renewal toggle

**UX:** back to results breadcrumb · print view · keyboard shortcuts · last seen on cards

**Build priority after current Phase 2 pages:**
1. Search history dropdown · 2. Similar profiles · 3. Notes + tags · 4. Already contacted · 5. Screening questions · 6. Job templates · 7. NVite delivery reports · 8. Schedule send · 9. Source of hire · 10. Time-to-hire · 11. Team activity · 12. Usage dashboard · 13. Comparison · 14. Auto-rejection · 15. Radius search

---
- [ ] Admin rate limiting
- [ ] Recruiter approval email flow verification
- [ ] Domain + `noindex` + sitemap

---

## 8. Code modules (planned)

```
src/
├── components/
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── AdminOpsShell.tsx          # NEW light management shell
│   │   │   └── ... (keep import, bulk, audit)
│   │   └── recruiter/
│   │       ├── RecruiterShell.tsx         # NEW Naukri top nav
│   │       ├── RecruiterHome.tsx          # NEW from homepage.PNG
│   │       ├── ResdexSearchPage.tsx       # NEW form page
│   │       ├── ResdexResultsPage.tsx      # Refactor from ApplicantsManagement
│   │       └── RecruiterCandidateCard.tsx # Match Naukri card
├── pages/dashboard/
│   ├── AdminDashboard.tsx                 # Slim routes — management only
│   └── ClientDashboard.tsx                # Recruiter routes + RecruiterShell
```

---

## 9. What we do NOT change in this project

- `src/pages/marketing/**` — locked
- Candidate `/dashboard/applicant/**` — frozen unless bugfix
- Supabase `role = 'client'` — keep; UI says Recruiter
- Real data only — no mocks in dashboards

---

## 10. How to start the next session

**Say:** `Start Phase 0` or `Build admin ops home` or `Build recruiter home from homepage.PNG`

**Upload:** Next screenshot to `uiuxsc/` with clear filename.

**Figma (optional):** Share `figma.com/design/...` link for measurements.

---

## Appendix — Current vs target quick reference

| Item | Today | Target |
|------|-------|--------|
| Admin shell | Dark slate sidebar | Light ops console |
| Admin has ResDex | Yes | **No** — recruiter only |
| Client label | “Client” | “Recruiter” |
| Client shell | Mobile-first sidebar | Naukri top nav |
| `/recruiter` URL | Missing | Redirect to login |
| `/admin` URL | Missing | Redirect to login |
