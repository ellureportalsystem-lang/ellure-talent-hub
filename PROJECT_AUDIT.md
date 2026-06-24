# Ellure NexHire — Full Project & Database Audit

**Audit date:** June 14, 2026  
**Auditor:** Automated read-only codebase + Supabase MCP audit  
**Purpose:** Complete inventory for planning a full rebuild  
**Repository:** `ellure-talent-hub`  
**Live reference:** https://ellurenexhire.vercel.app/

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Routing & Pages](#2-routing--pages)
3. [Dashboards (Detailed)](#3-dashboards--detailed)
4. [Database — Supabase Audit](#4-database--supabase-audit)
5. [API Routes / Backend](#5-api-routes--backend)
6. [Components & Shared Code](#6-components--shared-code)
7. [What Exists vs What Is Missing](#7-what-exists-vs-what-is-missing)

---

# 1. PROJECT STRUCTURE

## 1.1 Framework Identification

| Item | Value |
|------|-------|
| **Framework** | **Vite + React 18 SPA** (NOT Next.js) |
| **Language** | TypeScript 5.8 |
| **Routing** | `react-router-dom` v6 (`BrowserRouter`, client-side) |
| **Build output** | `dist/` (static SPA) |
| **Deployment** | Vercel (`vercel.json` — SPA rewrite to `index.html`) |
| **Dev server** | Port **8080** (`vite.config.ts`) |

## 1.2 Tech Stack (`package.json`)

### Core
- **React** 18.3.1, **react-dom** 18.3.1
- **Vite** 5.4.19, **@vitejs/plugin-react-swc** 3.11
- **react-router-dom** 6.30.1
- **TypeScript** 5.8.3

### Data & Auth
- **@supabase/supabase-js** 2.86.0 — primary backend (Auth, DB, Storage, Edge Functions)
- **@tanstack/react-query** 5.83.0 — server state caching

### UI / CSS
- **Tailwind CSS** 3.4.17 + **tailwindcss-animate** + **@tailwindcss/typography**
- **shadcn/ui** pattern — Radix UI primitives (`@radix-ui/react-*` ~20 packages)
- **class-variance-authority**, **clsx**, **tailwind-merge**
- **lucide-react** icons
- **framer-motion** 12.23.25
- **next-themes** 0.3.0 (theme toggle; marketing forced light)
- **recharts** 2.15.4 (admin dashboard charts)
- **sonner** + custom toast (dual toaster setup)

### Forms & Editors
- **react-hook-form** 7.61, **zod** 3.25, **@hookform/resolvers**
- **@tiptap/react** 3.23 (RichTextEditor for jobs)
- **react-day-picker**, **input-otp**

### File / Media
- **pdfjs-dist** 5.4 (resume preview)
- **react-image-crop**, **xlsx** 0.18 (import/export)
- **dompurify** (SafeHtml)
- **canvas-confetti**

### DnD
- **@dnd-kit/core**, **sortable**, **utilities** (kanban)

## 1.3 CSS Framework / UI Library

- **Primary:** Tailwind CSS utility classes + CSS variables in `src/index.css`
- **Component library:** shadcn/ui (`components.json`, `src/components/ui/*`)
- **Portal/dashboard:** Custom glass morphism (`glass-panel`, `liquid-glass-panel`, `PortalDashboardLayout`)
- **Marketing:** BharatGo-inspired SaaS blocks (`src/components/marketing/bharatgo/*`)
- **Fonts:** Inter (sans), Poppins (display), Sora (brand), DM Sans — loaded in `index.html`

## 1.4 Environment Variables (keys only, from `.env.example`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | **Yes** | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Supabase anon/publishable key |
| `API_KEY` | Optional | 21st.dev Magic MCP (Cursor) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Optional | Cloudinary uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Optional | Cloudinary preset |
| `VITE_CLOUDINARY_UPLOAD_PRESET_RAW` | Optional | Raw file preset |
| `VITE_CLOUDINARY_UPLOAD_PRESET_IMAGE` | Optional | Image preset |

**Supabase Edge Function secrets (not in `.env.example`, configured in Supabase Dashboard):**
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `SITE_URL`
- Email provider credentials (via `_shared/email.ts`)

**Note:** `.env` exists locally (gitignored) but was not read (values excluded per audit rules).

## 1.5 Top-Level Directory Tree

```
ellure-talent-hub/
├── src/                    # Application source
│   ├── pages/              # Route pages (marketing, auth, dashboards)
│   ├── components/         # UI, marketing, portal, profile, jobs, etc.
│   ├── contexts/           # AuthContext
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Supabase/data access layer
│   ├── lib/                # Utilities, marketing data, supabase client
│   ├── types/              # TypeScript types (database.types.ts — partial)
│   ├── data/               # Static JSON (states/cities, filter options)
│   ├── utils/              # Export, boolean search parser
│   ├── config/             # supabase.ts fallback config
│   ├── App.tsx             # Root router
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + design tokens
├── public/                 # Static assets (images, banners, mascot, GLB)
├── supabase/
│   ├── config.toml
│   ├── functions/          # 14 Edge Functions (source in repo)
│   └── migrations/         # README only — no SQL migration files committed
├── scripts/                # Data import, DB fix SQL, auth user scripts
├── docs/                   # Extensive documentation (schema, auth, UI spec)
├── data/                   # Excel analysis artifacts
├── dist/                   # Production build output
├── schema.json             # Exported DB schema snapshot
├── schema.sql              # SQL schema dump
├── COMPLETE_DATABASE_SCHEMA.sql
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json         # shadcn config
└── vercel.json
```

## 1.6 Key Config Files

| File | Role |
|------|------|
| `vite.config.ts` | Dev server port 8080, `@` alias |
| `tailwind.config.ts` | Design tokens, fonts, container |
| `components.json` | shadcn/ui configuration |
| `tsconfig.json` / `tsconfig.app.json` | TypeScript project refs |
| `eslint.config.js` | ESLint 9 flat config |
| `postcss.config.js` | Tailwind + autoprefixer |
| `src/config/supabase.ts` | Fallback Supabase URL/key (Lovable preview) |

---

# 2. ROUTING & PAGES

## 2.1 Architecture Note: No Next.js Middleware

This is a **client-side SPA**. There is **no** `middleware.ts` / server middleware. Protection is implemented via:

- `DashboardRoute` → `RoleBasedRoute` (role check)
- `ForcePasswordGuard` (`AuthRouteGuard.tsx`)
- `SessionTimeoutGuard` (inactivity logout)
- `ProtectedRoute` (legacy; includes **testing mode** bypass via `sessionStorage`)

## 2.2 Auth System

| Aspect | Implementation |
|--------|----------------|
| **Provider** | **Supabase Auth** (`@supabase/supabase-js`) |
| **NOT used** | NextAuth, Clerk, custom JWT server |
| **Methods** | Email/password, phone→email resolution, Google OAuth |
| **Profile linkage** | `profiles` table keyed to `auth.users.id` |
| **Roles** | `applicant`, `client`, `admin` (enum `user_role` in DB) |
| **Context** | `AuthContext` (`src/contexts/AuthContext.tsx`) |
| **Session** | `supabase.auth.getSession()` + `onAuthStateChange` |
| **Guards** | Role-based dashboard routes; force password change; session timeout |

### Auth-related routes

| Route | File | Public/Protected | Description |
|-------|------|------------------|-------------|
| `/auth/login` | `ApplicantLogin.tsx` | Public | Applicant login (email or phone) |
| `/auth/applicant` | `ApplicantLogin.tsx` | Public | Alias for applicant login |
| `/auth/forgot-password` | `ForgotPassword.tsx` | Public | Password reset request |
| `/auth/google/callback` | `GoogleCallback.tsx` | Public | OAuth callback handler |
| `/auth/force-change-password` | `ForceChangePassword.tsx` | Semi-protected | Forced password change when `must_change_password` |
| `/admin/auth/login` | `AdminLogin.tsx` | Public | Admin portal login |
| `/admin/auth/signup` | `AdminSignup.tsx` | Public | Admin self-signup (pending approval flow) |
| `/auth/admin` | `AdminLogin.tsx` | Public | Alias |
| `/client/auth/login` | `ClientLogin.tsx` | Public | Client login |
| `/client/auth/signup` | `ClientSignup.tsx` | Public | Client registration |
| `/auth/client` | `ClientLogin.tsx` | Public | Alias |
| `/auth/register` | `AccountCreationMethod.tsx` | Public | Choose email vs phone signup |
| `/auth/register/email` | `EmailSignUp.tsx` | Public | Email signup step 1 |
| `/auth/register/phone` | `PhoneSignUp.tsx` | Public | Phone signup step 1 |
| `/auth/register/verify-otp` | `VerifyOTP.tsx` | Public | OTP verification (**hardcoded OTP `123456` in dev**) |
| `/auth/register/set-password` | `SetPassword.tsx` | Public | Set password after OTP |
| `/auth/applicant-register/step-1` … `step-8` | `Step*.tsx` | Public | 8-step applicant onboarding wizard |
| `/auth/applicant-register/success` | `RegistrationSuccess.tsx` | Public | Registration complete |
| `/client/accept-invite` | `AcceptInvitePage.tsx` | Public | Team invite acceptance |

### Legacy / unused auth pages

| File | Status |
|------|--------|
| `src/pages/auth/Login.tsx` | Exists but **not routed** in `App.tsx` |
| `src/pages/Index.tsx` | Exists but **not routed** (Landing used at `/`) |

## 2.3 Marketing & Legal Routes (Public)

All wrapped in `ForceLightTheme` (light mode only).

| Route | File | Description |
|-------|------|-------------|
| `/` | `Landing.tsx` | Homepage — BharatGo hero, features, pricing section, testimonials |
| `/about` | `About.tsx` | Company about page |
| `/showcase` | `Showcase.tsx` | Product showcase |
| `/services` | `Services.tsx` | Services offering |
| `/features` | `Features.tsx` | Platform features |
| `/industries` | `Industries.tsx` | Industry verticals |
| `/contact` | `Contact.tsx` | Contact form |
| `/faq` | `FAQ.tsx` | FAQ accordion |
| `/privacy` | `Privacy.tsx` | Privacy policy |
| `/terms` | `Terms.tsx` | Terms of service |
| `*` | `NotFound.tsx` | 404 page |

### Unrouted marketing pages

| File | Note |
|------|------|
| `Pricing.tsx` | **Not registered in `App.tsx`** — pricing only embedded via `PricingSection` on Landing |

## 2.4 Protected Dashboard Routes

| Route prefix | Guard | Allowed roles |
|--------------|-------|---------------|
| `/dashboard/applicant/*` | `DashboardRoute` | `applicant` |
| `/dashboard/admin/*` | `DashboardRoute` | `admin` |
| `/dashboard/client/*` | `DashboardRoute` | `client`, `admin` |

Lazy-loaded with `React.Suspense` fallback skeleton.

## 2.5 Complete Route Map (Nested)

### Applicant (`/dashboard/applicant/`)

| Path | Component |
|------|-----------|
| `/` | `ApplicantDashboard` (embedded) |
| `profile` | Redirect → `/dashboard/applicant` |
| `jobs` | `ApplicantJobsPage` |
| `jobs/:id` | `ApplicantJobDetail` |
| `applications` | `ApplicantApplicationsPage` |
| `saved-jobs` | `ApplicantSavedJobsPage` |
| `job-alerts` | `JobAlertsPage` |
| `messages` | `ApplicantMessagesPage` |
| `profile-views` | `ApplicantProfileViewsPage` |
| `settings` | `ApplicantSettings` |

### Admin (`/dashboard/admin/`)

| Path | Component |
|------|-----------|
| `/` | `AdminHome` |
| `applicants` | `ApplicantsManagement` |
| `applicants/bulk-resumes` | `BulkResumeUpload` |
| `import` | `ImportCandidatesPage` |
| `applicants/:id` | `EnterpriseApplicantProfile` (viewMode=admin) |
| `folders` | `FoldersManagement` |
| `jobs/*` | `AdminJobsPage` |
| `reports` | `ReportsPage` |
| `users` | `UsersManagement` |
| `messages` | `AdminMessagesPage` |
| `settings` | `AdminSettings` |

### Client (`/dashboard/client/`)

| Path | Component |
|------|-----------|
| `/` | `ClientHome` |
| `candidates` | `CandidatesPage` |
| `candidates/:id` | `CandidateProfileView` → `EnterpriseApplicantProfile` |
| `folders` | `ClientFoldersManagement` |
| `jobs/*` | `JobsPage` |
| `billing` | `ClientBillingPage` |
| `team` | `ClientTeamPage` |
| `messages` | `MessagesPage` |
| `settings` | `ClientSettings` |

---

# 3. DASHBOARDS — DETAILED

Shared layout: **`PortalDashboardLayout`** — glass sidebar (desktop), sticky header with back button on inner pages, bottom nav (mobile), notification bell, logout.

## 3.1 Admin Dashboard (`/dashboard/admin/*`)

**Shell:** `AdminDashboard.tsx` — `role="admin"`, `headerMode="brand"`, sidebar sections (Main / Management / Settings).

### Home — `/dashboard/admin`
- **File:** `admin/AdminHome.tsx`
- **Features:** 8 KPI tiles, registration trend chart (Recharts), top skills, experience distribution, city distribution, pending client approvals with inline approve
- **Data:** `dashboardService` hooks — `applicants`, `clients`, `jobs`, `job_applications`, `applicant_search_index`
- **Issues:** `AdminStatCard` prop mismatch (`title` vs `label`) may hide stat labels

### Resume Search — `/dashboard/admin/applicants`
- **File:** `admin/ApplicantsManagement.tsx`
- **Features:** Boolean search bar, advanced filters drawer, paginated table, bulk status update, bulk folder add, CSV/Excel export
- **Data:** RPC `search_applicants` via `useApplicantSearch`; `shortlists`; direct `applicants` updates
- **Components:** `BooleanSearchBar`, `ResumeSearchFilters`, `ApplicantTable`, `BulkActionsBar`

### Bulk CV Upload — `/dashboard/admin/applicants/bulk-resumes`
- **File:** `admin/BulkResumeUpload.tsx`
- **Features:** Multi-file PDF/DOC/DOCX upload (15MB), auto/name/email filename matching
- **Data:** Paginated `applicants`, resume upload to storage/Cloudinary

### Import Data — `/dashboard/admin/import`
- **File:** `admin/ImportCandidatesPage.tsx`
- **Features:** 4-step Excel wizard (template, upload, validate, import)
- **Data:** `importService.importApplicantsBatch` → `applicants`

### Applicant Profile — `/dashboard/admin/applicants/:id`
- **File:** `admin/EnterpriseApplicantProfile.tsx`
- **Features:** Full profile viewer/editor, section sidebar (resume, skills, experience, education, etc.), profile view tracking, admin notes
- **Data:** `applicants`, `applicant_education`, `applicant_experience`, `applicant_skills`, `applicant_files`, RPC `increment_profile_views`

### Folders — `/dashboard/admin/folders`
- **File:** `admin/FoldersManagement.tsx`
- **Features:** Folder CRUD, add applicants via search dialog, master-detail layout
- **Data:** `useShortlists("admin")`, `searchApplicantsForFolder`
- **Issues:** Share/Edit/Export buttons **not wired**; `sharedWith` always empty

### Jobs — `/dashboard/admin/jobs/*`
- **File:** `admin/AdminJobsPage.tsx`
- **Features:** Jobs table, create/edit dialog (RichTextEditor), post as Ellure or client, status filter, nested kanban at `jobs/:jobId/applications`
- **Data:** `jobService`, `clients`, `JobApplicationsKanban`

### Reports — `/dashboard/admin/reports`
- **File:** `admin/ReportsPage.tsx`
- **Status:** **MOCK ONLY** — hardcoded KPIs, placeholder chart areas, non-functional export/date controls

### Users — `/dashboard/admin/users`
- **File:** `admin/UsersManagement.tsx`
- **Features:** List admins + clients, search, approve clients
- **Issues:** Create User dialog **UI-only** (no backend); summary cards hardcode `2`

### Emails — `/dashboard/admin/messages`
- **File:** `admin/AdminMessagesPage.tsx`
- **Features:** `MessagingWorkspace` full-bleed (`dashboardRole="admin"`)

### Settings — `/dashboard/admin/settings`
- **File:** `admin/AdminSettings.tsx`
- **Features:** Profile update, theme (light/dark/system), password change

### Orphan files (not routed)
- `admin/ApplicantProfileView.tsx` — legacy profile view
- `admin/AdminApplicantProfileView.tsx` — exists, check routing (not in AdminDashboard routes)

## 3.2 Client Dashboard (`/dashboard/client/*`)

**Shell:** `ClientDashboard.tsx` — `shellMode="mobile-first"`, CV usage badge in header.

### Home — `/dashboard/client`
- **File:** `client/ClientHome.tsx`
- **Features:** Hero, inline candidate search → redirect, quick actions, stat links, subscription renewal warning, recent profile views, top jobs
- **Data:** `getClientHomeStats`, `getClientRecentProfileViews`, `getClientTopJobs`, `useClientContext`

### Candidates — `/dashboard/client/candidates`
- **File:** `client/CandidatesPage.tsx`
- **Features:** Card/table search, filters, saved searches, CV download with plan limit modal
- **Data:** `useClientApplicantSearch` (RPC + `clientId`), `saved_searches`, `checkAndLogCvDownload`

### Candidate Profile — `/dashboard/client/candidates/:id`
- **File:** `client/CandidateProfileView.tsx` → wraps `EnterpriseApplicantProfile` (client mode)

### My Shortlists — `/dashboard/client/folders`
- **File:** `client/ClientFoldersManagement.tsx`
- **Features:** Shortlist sidebar, candidate list, create/delete, remove candidates
- **Data:** `useShortlists("client")`

### Jobs — `/dashboard/client/jobs/*`
- **File:** `client/JobsPage.tsx`
- **Features:** Client job CRUD, draft/active, application kanban

### Billing — `/dashboard/client/billing`
- **File:** `client/ClientBillingPage.tsx`
- **Features:** Plan display, usage meters, Razorpay checkout, transaction history
- **Data:** `subscription_plans`, `subscription_transactions`, edge `create-payment-order` / `verify-payment`

### Team — `/dashboard/client/team`
- **File:** `client/ClientTeamPage.tsx`
- **Features:** Team list, invite by email with role
- **Data:** `client_team_members`

### Emails — `/dashboard/client/messages`
- **File:** `client/MessagesPage.tsx` — `MessagingWorkspace` (client role)

### Settings — `/dashboard/client/settings`
- **File:** `client/ClientSettings.tsx`
- **Features:** Company info, subscription summary, theme, password, HR FAQs

## 3.3 Applicant Dashboard (`/dashboard/applicant/*`)

**Shell:** `ApplicantPortal.tsx` — mobile-first, flat nav list.

### Home — `/dashboard/applicant`
- **File:** `ApplicantDashboard.tsx` (`embedded`)
- **Features:** Welcome hero, application stats, profile completion, resume preview, FAQs
- **Data:** `applicants`, `job_applications`, `profiles`
- **Issues:** Activity feed **hardcoded mock**; profile checklist not data-driven

### Browse Jobs — `/dashboard/applicant/jobs`
- **File:** `applicant/ApplicantJobsPage.tsx`
- **Features:** Search, city filter, save/unsave jobs
- **Data:** `jobs` (active), `saved_jobs`

### Job Detail — `/dashboard/applicant/jobs/:id`
- **File:** `applicant/ApplicantJobDetail.tsx`
- **Features:** Job detail, apply with cover letter (500 char cap), duplicate apply guard

### Applications — `/dashboard/applicant/applications`
- **File:** `applicant/ApplicantApplicationsPage.tsx`
- **Features:** Application history with stage badges

### Saved Jobs — `/dashboard/applicant/saved-jobs`
- **File:** `applicant/ApplicantSavedJobsPage.tsx`

### Job Alerts — `/dashboard/applicant/job-alerts`
- **File:** `applicant/JobAlertsPage.tsx`
- **Features:** CRUD job alerts (keywords, cities, frequency)
- **Note:** Alert **delivery** depends on edge `run-job-alerts` (cron), not verified deployed

### Messages — `/dashboard/applicant/messages`
- **File:** `applicant/ApplicantMessagesPage.tsx`

### Profile Views — `/dashboard/applicant/profile-views`
- **File:** `applicant/ApplicantProfileViewsPage.tsx`
- **Data:** `profile_views` (last 30 days)

### Settings — `/dashboard/applicant/settings`
- **File:** `applicant/ApplicantSettings.tsx`
- **Features:** Name/phone, theme, password (not full profile editor)

---

# 4. DATABASE — SUPABASE AUDIT

**Connection:** Supabase MCP (`project-0-ellure-talent-hub-supabase`)  
**Schema audited:** `public` (39 tables)  
**RLS:** Enabled on 38/39 tables (`job_application_stages` has RLS **disabled**)  
**Edge functions deployed (remote):** **0** (MCP `list_edge_functions` returned empty — functions exist in repo but may not be deployed)  
**Approximate row counts:** From `pg_stat_user_tables` (June 14, 2026)

## 4.1 Table Row Counts & Usage

| Table | ~Rows | Usage status |
|-------|-------|--------------|
| `audit_logs` | 1 | Minimal / test data |
| `profile_views` | 1 | Minimal |
| `profiles` | 1 | Minimal (likely dev account) |
| All other 36 tables | **0** | Schema exists; **no production data** in connected project |

**Conclusion:** Connected Supabase project is essentially **empty** — schema fully defined but data import / seeding not applied to this instance.

## 4.2 Custom Enum Types (public schema)

| Enum | Values |
|------|--------|
| `access_source` | job, folder, manual |
| `achievement_type` | certification, award, publication, patent, course |
| `alert_frequency` | none, daily, weekly |
| `applicant_status` | submitted, under_review, shortlisted, rejected, hired, on_hold |
| `application_stage` | applied, screening, shortlisted, interview_scheduled, interviewed, offer, rejected, withdrawn |
| `communication_rating` | excellent, good, average, poor |
| `company_size` | startup, small, medium, large, enterprise |
| `employment_type` | full-time, part-time, contract, internship, freelance |
| `file_type` | resume, profile_image, certificate, other |
| `job_alert_frequency` | daily, weekly |
| `job_application_status` | applied, shortlisted, rejected, interviewed, hired |
| `job_status` | active, inactive, closed, draft |
| `job_type_enum` | full_time, part_time, contract, internship, freelance |
| `payment_status` | pending, success, failed, refunded |
| `profile_visibility` | public, private, clients_only |
| `skill_level` | beginner, intermediate, advanced, expert |
| `skill_type` | technical, soft, language, certification |
| `subscription_plan_type` | free, basic, professional, enterprise |
| `subscription_status_type` | trial, active, expired, cancelled, suspended |
| `team_member_role` | owner, admin, member |
| `user_role` | applicant, client, admin, user |
| `viewer_type` | admin, client |
| `work_mode_enum` | onsite, remote, hybrid |

## 4.3 Foreign Key Relationships (public schema)

| From table.column | → To table.column |
|-------------------|-------------------|
| admin_users.approved_by | profiles.id |
| admin_users.user_id | profiles.id |
| applicant_achievements.applicant_id | applicants.id |
| applicant_addresses.applicant_id | applicants.id |
| applicant_education.applicant_id | applicants.id |
| applicant_experience.applicant_id | applicants.id |
| applicant_files.applicant_id | applicants.id |
| applicant_files.uploaded_by | profiles.id |
| applicant_references.applicant_id | applicants.id |
| applicant_search_index.applicant_id | applicants.id |
| applicant_skills.applicant_id | applicants.id |
| applicants.user_id | profiles.id |
| applicants.verified_by | profiles.id |
| audit_logs.actor_id | profiles.id |
| cities.district_id | districts.id |
| cities.state_id | states.id |
| client_applicant_access.applicant_id | applicants.id |
| client_applicant_access.client_id | clients.id |
| client_applicant_access.granted_by | profiles.id |
| client_team_members.client_id | clients.id |
| client_team_members.invited_by | profiles.id |
| client_team_members.user_id | profiles.id |
| clients.approved_by | profiles.id |
| clients.user_id | profiles.id |
| conversations.job_id | jobs.id |
| conversations.participant1_id | profiles.id |
| conversations.participant2_id | profiles.id |
| courses.degree_id | degrees.id |
| cv_download_log.applicant_id | applicants.id |
| cv_download_log.client_id | clients.id |
| cv_download_log.downloaded_by | profiles.id |
| districts.state_id | states.id |
| institutions.city_id | cities.id |
| institutions.district_id | districts.id |
| institutions.state_id | states.id |
| job_alerts.applicant_id | applicants.id |
| job_application_events.application_id | job_applications.id |
| job_application_events.changed_by | profiles.id |
| job_application_stages.application_id | job_applications.id |
| job_application_stages.changed_by | profiles.id |
| job_applications.applicant_id | applicants.id |
| job_applications.job_id | jobs.id |
| job_applications.stage_updated_by | profiles.id |
| jobs.client_id | clients.id |
| jobs.posted_by | profiles.id |
| messages.conversation_id | conversations.id |
| messages.from_user_id | profiles.id |
| messages.to_user_id | profiles.id |
| notifications.user_id | profiles.id |
| profile_views.applicant_id | applicants.id |
| profile_views.viewer_id | profiles.id |
| saved_jobs.applicant_id | applicants.id |
| saved_jobs.job_id | jobs.id |
| saved_searches.client_id | clients.id |
| shortlist_items.applicant_id | applicants.id |
| shortlist_items.shortlist_id | shortlists.id |
| shortlist_shares.shared_by | profiles.id |
| shortlist_shares.shared_with_client_id | clients.id |
| shortlist_shares.shortlist_id | shortlists.id |
| shortlists.owner_id | profiles.id |
| subscription_transactions.client_id | clients.id |
| subscription_transactions.plan_id | subscription_plans.id |

## 4.4 Indexes Summary

**Total public indexes:** ~150+ (see live DB). Notable patterns:

- **Full-text / search:** `idx_applicants_search` (GIN tsvector), `idx_applicant_search_index_combined_text` / `idx_asi_combined_text_gin` (GIN on `combined_text`)
- **Applicant filtering:** status, city, email, phone, job_role, is_deleted composites
- **Uniques:** `applicants.applicant_number`, `jobs.slug`, `clients.slug`, `job_applications(job_id, applicant_id)`, `saved_jobs(applicant_id, job_id)`, `profile_views` daily unique `(viewer_id, applicant_id, view_date)`
- **Messaging:** conversation participants, unread message partial index
- **Master data:** states, cities, districts, degrees, boards name indexes

## 4.5 RLS Policies Summary

RLS enabled on all tables except `job_application_stages`. Policy patterns:

| Pattern | Tables |
|---------|--------|
| `is_admin_user()` / `is_admin()` full access | applicants, clients, audit_logs, master data management |
| Own profile (`auth.uid() = id`) | profiles SELECT/UPDATE/INSERT |
| Applicant owns own data (`user_id = auth.uid()`) | applicants, job_alerts, saved_jobs, achievements, references |
| Client access via `client_applicant_access` join | applicants, applicant_* child tables, applicant_search_index |
| Shortlist owner / share | shortlists, shortlist_items |
| Conversation participants | conversations, messages |
| Own notifications | notifications |
| Public read master data | states, cities, districts, boards, degrees, courses, institutions |
| Active jobs public read | jobs (`jobs_public_read_active`) |
| Subscription plans read all | subscription_plans |

**Security note:** `job_application_stages` has **RLS disabled** — potential exposure if table is in exposed schema.

## 4.6 Database Functions (application-relevant)

| Function | Purpose |
|----------|---------|
| `search_applicants(...)` | Primary candidate search RPC (filters, pagination, sort) |
| `admin_import_applicant_row(p_row jsonb)` | Single-row import |
| `safe_insert_applicant(...)` | Safe applicant creation |
| `refresh_applicant_search_index(p_applicant_id)` | Rebuild search index row |
| `calculate_profile_completion(applicant_uuid)` | Profile % score |
| `check_cv_download_limit(p_client_id)` | Subscription CV limit check |
| `increment_profile_views(...)` | Track profile views |
| `create_notification(...)` | In-app notifications |
| `finalize_client_signup(...)` | Client onboarding RPC |
| `ensure_profile_from_auth()` | Profile bootstrap |
| `is_admin()` / `is_admin_user()` | RLS helper functions |
| `add_board`, `add_city`, `add_course`, `add_institution` | Master data RPCs |
| `parse_ctc_lpa`, `parse_experience_years`, `parse_notice_period_days` | Search normalization |
| `normalize_education_level` | Education normalization |
| pg_trgm functions | Trigram similarity (extension) |

## 4.7 Database Triggers (public schema)

| Table | Triggers |
|-------|----------|
| `admin_users` | updated_at, auto_approve_admin_signup, sync_admin_user_role |
| `applicant_education/experience/skills/files` | profile completion + search index refresh |
| `applicants` | updated_at, audit log, applicant_number generation, profile sync, search index |
| `clients` | updated_at, auto_approve_client_signup |
| `client_applicant_access` | audit log |
| `job_applications` | application count, grant client access, status change log |
| `jobs` | slug generation, updated_at, audit log |
| `messages` | update conversation on new message |
| `profiles` | updated_at |
| `shortlists` / `shortlist_shares` | updated_at, audit log, grant access on share |

## 4.8 TypeScript Types vs Live Schema

`src/types/database.types.ts` documents only **5 tables** (applicants, clients, profiles, shortlists, shortlist_items) with **outdated column counts**. Live DB has **39 tables** with expanded columns (e.g. applicants: 84 columns). **Regenerate types** via `supabase gen types` or MCP `generate_typescript_types` before rebuild.

## 4.9 Complete Table Column Reference (Live DB)

### admin_users

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| user_id | uuid | uuid | YES |  |
| email | text | text | NO |  |
| full_name | text | text | YES |  |
| phone | text | text | YES |  |
| admin_role | text | text | NO | 'user'::text |
| status | text | text | NO | 'pending'::text |
| requested_at | timestamp with time zone | timestamptz | YES | now() |
| approved_at | timestamp with time zone | timestamptz | YES |  |
| approved_by | uuid | uuid | YES |  |
| notes | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| permissions | jsonb | jsonb | YES | '{"can_export": true, "can_manage_jobs": true, "can_view_reports": true, "can_manage_admins": false, |
| department | text | text | YES |  |
| last_active_at | timestamp with time zone | timestamptz | YES |  |

### applicant_achievements

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| applicant_id | uuid | uuid | NO |  |
| type | USER-DEFINED | achievement_type | NO |  |
| title | text | text | NO |  |
| issuer | text | text | YES |  |
| issue_date | date | date | YES |  |
| expiry_date | date | date | YES |  |
| credential_url | text | text | YES |  |
| description | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### applicant_addresses

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_id | uuid | uuid | NO |  |
| address_line1 | text | text | YES |  |
| address_line2 | text | text | YES |  |
| pincode | text | text | YES |  |
| city_id | uuid | uuid | YES |  |
| district_id | uuid | uuid | YES |  |
| state_id | uuid | uuid | YES |  |
| landmark | text | text | YES |  |
| is_primary | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### applicant_education

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_id | uuid | uuid | NO |  |
| education_level | text | text | NO |  |
| board_id | uuid | uuid | YES |  |
| institution_id | uuid | uuid | YES |  |
| degree_id | uuid | uuid | YES |  |
| course_id | uuid | uuid | YES |  |
| percentage | numeric | numeric | YES |  |
| passing_year | integer | int4 | YES |  |
| city_id | uuid | uuid | YES |  |
| state_id | uuid | uuid | YES |  |
| district_id | uuid | uuid | YES |  |
| is_highest | boolean | bool | YES | false |
| medium | text | text | YES |  |
| stream | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| field_of_study | text | text | YES |  |
| institution_name | text | text | YES |  |
| board_name | text | text | YES |  |
| grade_type | text | text | YES |  |
| mode | text | text | YES |  |

### applicant_experience

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_id | uuid | uuid | NO |  |
| company_name | text | text | NO |  |
| designation | text | text | NO |  |
| employment_type | USER-DEFINED | employment_type | YES | 'full-time'::employment_type |
| start_date | date | date | YES |  |
| end_date | date | date | YES |  |
| is_current | boolean | bool | YES | false |
| total_experience_months | integer | int4 | YES |  |
| current_ctc | text | text | YES |  |
| expected_ctc | text | text | YES |  |
| notice_period | text | text | YES |  |
| city_id | uuid | uuid | YES |  |
| description | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| skills_used | ARRAY | _text | YES | '{}'::text[] |
| department | text | text | YES |  |

### applicant_files

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_id | uuid | uuid | NO |  |
| file_url | text | text | NO |  |
| storage_bucket | text | text | YES |  |
| storage_path | text | text | YES |  |
| file_name | text | text | YES |  |
| file_size | integer | int4 | YES |  |
| mime_type | text | text | YES |  |
| uploaded_by | uuid | uuid | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| file_type | USER-DEFINED | file_type | YES | 'other'::file_type |

### applicant_references

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| applicant_id | uuid | uuid | NO |  |
| name | text | text | NO |  |
| designation | text | text | YES |  |
| company | text | text | YES |  |
| email | text | text | YES |  |
| phone | text | text | YES |  |
| relationship | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### applicant_search_index

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| applicant_id | uuid | uuid | NO |  |
| combined_text | tsvector | tsvector | NO |  |
| skills_text | text | text | YES |  |
| education_text | text | text | YES |  |
| experience_text | text | text | YES |  |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| location_city | text | text | YES |  |
| experience_years | numeric | numeric | YES |  |
| current_ctc | numeric | numeric | YES |  |
| expected_ctc | numeric | numeric | YES |  |
| notice_period_days | integer | int4 | YES |  |
| education_level | text | text | YES |  |
| is_actively_looking | boolean | bool | YES |  |
| profile_visibility | text | text | YES |  |
| profile_complete_percent | integer | int4 | YES |  |
| has_resume | boolean | bool | YES | false |

### applicant_skills

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_id | uuid | uuid | NO |  |
| skill_name | text | text | NO |  |
| skill_type | USER-DEFINED | skill_type | YES | 'technical'::skill_type |
| skill_level | USER-DEFINED | skill_level | YES | 'intermediate'::skill_level |
| years_of_experience | integer | int4 | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### applicants

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| applicant_number | text | text | YES |  |
| user_id | uuid | uuid | YES |  |
| client_id | uuid | uuid | YES |  |
| name | text | text | NO |  |
| phone | text | text | NO |  |
| email | text | text | NO |  |
| city | text | text | NO |  |
| date_of_birth | date | date | YES |  |
| gender | text | text | YES |  |
| job_role | text | text | YES |  |
| communication | text | text | YES |  |
| skill | text | text | YES |  |
| education_level | text | text | YES |  |
| education_board | text | text | YES |  |
| medium | text | text | YES |  |
| course_degree | text | text | YES |  |
| university | text | text | YES |  |
| percentage | text | text | YES |  |
| passing_year | integer | int4 | YES |  |
| experience_type | text | text | YES |  |
| total_experience | text | text | YES |  |
| current_company | text | text | YES |  |
| current_designation | text | text | YES |  |
| current_ctc | text | text | YES |  |
| expected_ctc | text | text | YES |  |
| key_skills | text | text | YES |  |
| notice_period | text | text | YES |  |
| availability | text | text | YES |  |
| resume_file | text | text | YES |  |
| profile_image | text | text | YES |  |
| verified | boolean | bool | YES | false |
| otp_verified | boolean | bool | YES | false |
| remarks | text | text | YES |  |
| registration_date | timestamp with time zone | timestamptz | YES | now() |
| profile_complete_percent | integer | int4 | YES | 0 |
| is_deleted | boolean | bool | YES | false |
| deleted_at | timestamp with time zone | timestamptz | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| date | text | text | YES |  |
| mobile_number | text | text | YES |  |
| email_address | text | text | YES |  |
| city_current_location | text | text | YES |  |
| skill_job_role_applying_for | text | text | YES |  |
| highest_qualification | text | text | YES |  |
| medium_of_study | text | text | YES |  |
| course_degree_name | text | text | YES |  |
| university_institute_name | text | text | YES |  |
| year_of_passing | text | text | YES |  |
| work_experience | text | text | YES |  |
| total_experience_numbers | text | text | YES |  |
| exp_ctc | text | text | YES |  |
| upload_cv_any_format | text | text | YES |  |
| education | text | text | YES |  |
| contact | text | text | YES |  |
| is_old_applicant | boolean | bool | YES | false |
| status | USER-DEFINED | applicant_status | YES | 'submitted'::applicant_status |
| profile_visibility | USER-DEFINED | profile_visibility | YES | 'clients_only'::profile_visibility |
| is_actively_looking | boolean | bool | YES | true |
| open_to_relocate | boolean | bool | YES | false |
| preferred_locations | ARRAY | _text | YES | '{}'::text[] |
| preferred_job_types | ARRAY | _text | YES | '{}'::text[] |
| languages_known | jsonb | jsonb | YES | '[]'::jsonb |
| total_experience_years | numeric | numeric | YES |  |
| last_profile_updated_at | timestamp with time zone | timestamptz | YES | now() |
| profile_views_count | integer | int4 | YES | 0 |
| shortlist_count | integer | int4 | YES | 0 |
| search_appearance_count | integer | int4 | YES | 0 |
| is_verified | boolean | bool | YES | false |
| verification_date | timestamp with time zone | timestamptz | YES |  |
| verified_by | uuid | uuid | YES |  |
| linkedin_url | text | text | YES |  |
| github_url | text | text | YES |  |
| portfolio_url | text | text | YES |  |
| headline | text | text | YES |  |
| summary | text | text | YES |  |
| marital_status | text | text | YES |  |
| father_name | text | text | YES |  |
| differently_abled | boolean | bool | YES | false |
| alternate_phone | text | text | YES |  |
| work_mode_preferences | ARRAY | _text | YES | '{}'::text[] |
| industry_preferences | ARRAY | _text | YES | '{}'::text[] |
| projects | jsonb | jsonb | YES | '[]'::jsonb |

### audit_logs

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| actor_id | uuid | uuid | YES |  |
| entity_type | text | text | NO |  |
| entity_id | uuid | uuid | NO |  |
| action | text | text | NO |  |
| old_data | jsonb | jsonb | YES |  |
| new_data | jsonb | jsonb | YES |  |
| ip_address | inet | inet | YES |  |
| user_agent | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### boards

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### cities

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| state_id | uuid | uuid | NO |  |
| district_id | uuid | uuid | YES |  |
| city_type | text | text | YES |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### client_applicant_access

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| client_id | uuid | uuid | NO |  |
| applicant_id | uuid | uuid | NO |  |
| source_id | uuid | uuid | YES |  |
| granted_by | uuid | uuid | YES |  |
| expires_at | timestamp with time zone | timestamptz | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### client_team_members

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| client_id | uuid | uuid | NO |  |
| user_id | uuid | uuid | NO |  |
| role | USER-DEFINED | team_member_role | YES | 'member'::team_member_role |
| invited_by | uuid | uuid | YES |  |
| invited_at | timestamp with time zone | timestamptz | YES | now() |
| joined_at | timestamp with time zone | timestamptz | YES |  |
| is_active | boolean | bool | YES | true |
| invite_token | text | text | YES |  |
| status | text | text | YES | 'active'::text |

### clients

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| user_id | uuid | uuid | YES |  |
| company_name | text | text | NO |  |
| contact_person | text | text | YES |  |
| email | text | text | NO |  |
| phone | text | text | YES |  |
| slug | text | text | YES |  |
| subscription_plan | text | text | YES | 'basic'::text |
| subscription_status | text | text | YES | 'active'::text |
| payment_id | text | text | YES |  |
| payment_date | timestamp with time zone | timestamptz | YES |  |
| subscription_start_date | timestamp with time zone | timestamptz | YES | now() |
| subscription_end_date | timestamp with time zone | timestamptz | YES |  |
| max_applicants | integer | int4 | YES |  |
| used_applicants | integer | int4 | YES | 0 |
| is_active | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| company_slug | text | text | YES |  |
| company_logo_url | text | text | YES |  |
| company_website | text | text | YES |  |
| company_description | text | text | YES |  |
| industry | text | text | YES |  |
| company_size | USER-DEFINED | company_size | YES |  |
| founded_year | integer | int4 | YES |  |
| headquarters_city | text | text | YES |  |
| headquarters_state | text | text | YES |  |
| gst_number | text | text | YES |  |
| contact_person_name | text | text | YES |  |
| contact_email | text | text | YES |  |
| contact_phone | text | text | YES |  |
| trial_end_date | date | date | YES |  |
| max_cv_downloads_per_month | integer | int4 | YES | 10 |
| cv_downloads_used_this_month | integer | int4 | YES | 0 |
| max_job_postings | integer | int4 | YES | 1 |
| job_postings_used | integer | int4 | YES | 0 |
| max_saved_searches | integer | int4 | YES | 3 |
| max_team_members | integer | int4 | YES | 1 |
| approved_by | uuid | uuid | YES |  |
| approved_at | timestamp with time zone | timestamptz | YES |  |
| notes | text | text | YES |  |

### conversations

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| participant1_id | uuid | uuid | NO |  |
| participant2_id | uuid | uuid | NO |  |
| last_message_at | timestamp with time zone | timestamptz | YES |  |
| last_message_preview | text | text | YES |  |
| unread_count_participant1 | integer | int4 | YES | 0 |
| unread_count_participant2 | integer | int4 | YES | 0 |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| participant_ids | ARRAY | _uuid | YES |  |
| type | text | text | YES | 'direct'::text |
| subject | text | text | YES |  |
| job_id | uuid | uuid | YES |  |
| unread_counts | jsonb | jsonb | YES | '{}'::jsonb |

### courses

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| degree_id | uuid | uuid | YES |  |
| category | text | text | YES |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### cv_download_log

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| client_id | uuid | uuid | NO |  |
| applicant_id | uuid | uuid | NO |  |
| downloaded_by | uuid | uuid | NO |  |
| downloaded_at | timestamp with time zone | timestamptz | YES | now() |

### degrees

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### districts

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| state_id | uuid | uuid | NO |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### institutions

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| institution_type | text | text | YES |  |
| state_id | uuid | uuid | YES |  |
| district_id | uuid | uuid | YES |  |
| city_id | uuid | uuid | YES |  |
| address | text | text | YES |  |
| is_verified | boolean | bool | YES | false |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### job_alerts

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| applicant_id | uuid | uuid | NO |  |
| keywords | ARRAY | _text | YES | '{}'::text[] |
| cities | ARRAY | _text | YES | '{}'::text[] |
| experience_min | numeric | numeric | YES |  |
| experience_max | numeric | numeric | YES |  |
| job_type | text | text | YES |  |
| frequency | USER-DEFINED | job_alert_frequency | YES | 'weekly'::job_alert_frequency |
| is_active | boolean | bool | YES | true |
| last_sent_at | timestamp with time zone | timestamptz | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### job_application_events

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| application_id | uuid | uuid | NO |  |
| changed_by | uuid | uuid | YES |  |
| notes | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### job_application_stages

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| application_id | uuid | uuid | NO |  |
| stage | USER-DEFINED | application_stage | NO |  |
| notes | text | text | YES |  |
| changed_by | uuid | uuid | YES |  |
| changed_at | timestamp with time zone | timestamptz | YES | now() |

### job_applications

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| job_id | uuid | uuid | NO |  |
| applicant_id | uuid | uuid | NO |  |
| applied_at | timestamp with time zone | timestamptz | YES | now() |
| notes | text | text | YES |  |
| cover_letter | text | text | YES |  |
| applicant_resume_url | text | text | YES |  |
| current_stage | USER-DEFINED | application_stage | YES | 'applied'::application_stage |
| stage_updated_at | timestamp with time zone | timestamptz | YES | now() |
| stage_updated_by | uuid | uuid | YES |  |
| recruiter_notes | text | text | YES |  |
| rating | integer | int4 | YES |  |

### jobs

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| posted_by | uuid | uuid | NO |  |
| client_id | uuid | uuid | YES |  |
| title | text | text | NO |  |
| description | text | text | YES |  |
| location | text | text | YES |  |
| experience_level | text | text | YES |  |
| salary_range | text | text | YES |  |
| required_skills | text | text | YES |  |
| application_deadline | date | date | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| status | USER-DEFINED | job_status | YES | 'active'::job_status |
| slug | text | text | YES |  |
| requirements | text | text | YES |  |
| responsibilities | text | text | YES |  |
| job_type | USER-DEFINED | job_type_enum | YES |  |
| work_mode | USER-DEFINED | work_mode_enum | YES |  |
| experience_min | numeric | numeric | YES |  |
| experience_max | numeric | numeric | YES |  |
| salary_min | numeric | numeric | YES |  |
| salary_max | numeric | numeric | YES |  |
| salary_currency | text | text | YES | 'INR'::text |
| is_salary_disclosed | boolean | bool | YES | true |
| city | text | text | YES |  |
| state | text | text | YES |  |
| skills_required | ARRAY | _text | YES |  |
| education_required | text | text | YES |  |
| openings | integer | int4 | YES | 1 |
| views_count | integer | int4 | YES | 0 |
| applications_count | integer | int4 | YES | 0 |
| is_featured | boolean | bool | YES | false |
| featured_until | date | date | YES |  |
| published_at | timestamp with time zone | timestamptz | YES |  |

### messages

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| conversation_id | uuid | uuid | NO |  |
| from_user_id | uuid | uuid | NO |  |
| to_user_id | uuid | uuid | NO |  |
| message | text | text | NO |  |
| is_read | boolean | bool | YES | false |
| is_system_notification | boolean | bool | YES | false |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| attachment_url | text | text | YES |  |
| read_at | timestamp with time zone | timestamptz | YES |  |

### notifications

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| user_id | uuid | uuid | NO |  |
| type | text | text | NO |  |
| title | text | text | NO |  |
| body | text | text | YES |  |
| link | text | text | YES |  |
| is_read | boolean | bool | YES | false |
| read_at | timestamp with time zone | timestamptz | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### profile_views

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| viewer_id | uuid | uuid | NO |  |
| viewer_type | USER-DEFINED | viewer_type | NO |  |
| applicant_id | uuid | uuid | NO |  |
| viewed_at | timestamp with time zone | timestamptz | YES | now() |
| view_date | date | date | YES |  |

### profiles

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO |  |
| email | text | text | NO |  |
| phone | text | text | YES |  |
| full_name | text | text | YES |  |
| client_id | uuid | uuid | YES |  |
| applicant_id | uuid | uuid | YES |  |
| password_changed | boolean | bool | YES | false |
| must_change_password | boolean | bool | YES | false |
| is_old_applicant | boolean | bool | YES | false |
| display_name | text | text | YES |  |
| headline | text | text | YES |  |
| summary | text | text | YES |  |
| location | text | text | YES |  |
| key_skills | text | text | YES |  |
| resume_file | text | text | YES |  |
| profile_image | text | text | YES |  |
| profile_complete_percent | integer | int4 | YES | 0 |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |
| role | USER-DEFINED | user_role | NO | 'applicant'::user_role |
| avatar_url | text | text | YES |  |
| last_login_at | timestamp with time zone | timestamptz | YES |  |
| login_count | integer | int4 | YES | 0 |
| is_active | boolean | bool | YES | true |
| deactivated_at | timestamp with time zone | timestamptz | YES |  |
| notification_preferences | jsonb | jsonb | YES | '{"sms": false, "email": true, "in_app": true}'::jsonb |
| timezone | text | text | YES | 'Asia/Kolkata'::text |
| last_login_ip | text | text | YES |  |

### saved_jobs

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| applicant_id | uuid | uuid | NO |  |
| job_id | uuid | uuid | NO |  |
| saved_at | timestamp with time zone | timestamptz | YES | now() |

### saved_searches

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| client_id | uuid | uuid | NO |  |
| name | text | text | NO |  |
| filters | jsonb | jsonb | NO | '{}'::jsonb |
| alert_frequency | USER-DEFINED | alert_frequency | YES | 'none'::alert_frequency |
| last_run_at | timestamp with time zone | timestamptz | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### shortlist_items

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| shortlist_id | uuid | uuid | NO |  |
| applicant_id | uuid | uuid | NO |  |
| notes | text | text | YES |  |
| added_at | timestamp with time zone | timestamptz | YES | now() |

### shortlist_shares

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| shortlist_id | uuid | uuid | NO |  |
| shared_with_client_id | uuid | uuid | NO |  |
| shared_by | uuid | uuid | NO |  |
| can_edit | boolean | bool | YES | false |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### shortlists

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| owner_id | uuid | uuid | NO |  |
| owner_type | text | text | NO |  |
| name | text | text | NO |  |
| description | text | text | YES |  |
| color | text | text | YES | 'blue'::text |
| is_shared | boolean | bool | YES | false |
| shared_token | text | text | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### states

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | uuid_generate_v4() |
| name | text | text | NO |  |
| code | text | text | YES |  |
| is_verified | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |
| updated_at | timestamp with time zone | timestamptz | YES | now() |

### subscription_plans

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| name | text | text | NO |  |
| display_name | text | text | NO |  |
| price_monthly | numeric | numeric | YES | 0 |
| price_yearly | numeric | numeric | YES | 0 |
| max_cv_downloads | integer | int4 | YES | 10 |
| max_job_postings | integer | int4 | YES | 1 |
| max_team_members | integer | int4 | YES | 1 |
| max_saved_searches | integer | int4 | YES | 3 |
| can_export_excel | boolean | bool | YES | false |
| can_see_contact_details | boolean | bool | YES | false |
| can_bulk_download | boolean | bool | YES | false |
| features | jsonb | jsonb | YES | '{}'::jsonb |
| is_active | boolean | bool | YES | true |
| created_at | timestamp with time zone | timestamptz | YES | now() |

### subscription_transactions

| Column | Type | UDT | Nullable | Default |
|--------|------|-----|----------|---------|
| id | uuid | uuid | NO | gen_random_uuid() |
| client_id | uuid | uuid | NO |  |
| plan_id | uuid | uuid | YES |  |
| amount | numeric | numeric | NO |  |
| currency | text | text | YES | 'INR'::text |
| payment_gateway | text | text | YES |  |
| payment_id | text | text | YES |  |
| invoice_number | text | text | YES |  |
| status | USER-DEFINED | payment_status | YES | 'pending'::payment_status |
| period_start | date | date | YES |  |
| period_end | date | date | YES |  |
| created_at | timestamp with time zone | timestamptz | YES | now() |


---

# 5. API ROUTES / BACKEND

## 5.1 No Traditional `/api/*` Routes

This Vite SPA has **no** Next.js API routes or Express server. All backend interaction is:

1. **Supabase client** (direct table/RPC access from browser)
2. **Supabase Edge Functions** (Deno, in `supabase/functions/`)
3. **External APIs** (Razorpay, Cloudinary, Google OAuth via Supabase)

## 5.2 Supabase Edge Functions (source in repo)

| Function | Trigger / Method | Purpose | DB tables touched |
|----------|------------------|---------|-------------------|
| `create-payment-order` | HTTP POST | Create Razorpay order | Reads plan/client context |
| `verify-payment` | HTTP POST | Verify Razorpay payment, update subscription | `clients`, `subscription_transactions` |
| `generate-invoice` | HTTP | Generate invoice PDF/number | `subscription_transactions` |
| `expire-subscriptions` | Cron | Expire overdue subscriptions | `clients` |
| `reset-monthly-downloads` | Cron | Reset CV download counters | `clients` |
| `on-applicant-registered` | DB webhook | Welcome email on registration | `applicants`, `profiles` |
| `on-application-submitted` | DB webhook INSERT | Application confirmation email | `job_applications`, `jobs`, `applicants` |
| `on-application-stage-changed` | DB webhook | Stage change notification | `job_applications` |
| `on-client-approved` | DB webhook | Client approval email | `clients` |
| `on-client-signup` | DB webhook | Client signup notification | `clients` |
| `on-message-received` | DB webhook | New message notification | `messages`, `conversations` |
| `run-job-alerts` | Cron | Send job alert emails | `job_alerts`, `jobs` |
| `run-saved-search-alerts` | Cron | Saved search alert emails | `saved_searches` |
| `send-email` | HTTP | Generic email sender | N/A |

**Deployment status:** MCP reports **0 deployed** edge functions on connected project.

## 5.3 Supabase RPCs Called from Frontend (via services)

| RPC | Used by |
|-----|---------|
| `search_applicants` | Admin/client candidate search |
| `increment_profile_views` | Profile view tracking |
| `check_cv_download_limit` | Client CV downloads |
| `admin_import_applicant_row` | Import service |
| `finalize_client_signup` | Client signup |
| `ensure_profile_from_auth` | Auth bootstrap |
| `add_board`, `add_city`, `add_course`, `add_institution` | Master data during registration |

## 5.4 External Services

| Service | Usage |
|---------|-------|
| **Supabase** | Auth, Postgres, Storage, Edge Functions, Realtime (limited use) |
| **Razorpay** | Client subscription payments (INR) |
| **Cloudinary** | Optional resume/profile image uploads (`src/lib/cloudinaryUpload.ts`) |
| **Google OAuth** | Applicant sign-in via Supabase Auth |
| **Vercel** | Static hosting + SPA rewrites |

## 5.5 Server Actions

**None** — not applicable (not Next.js App Router).

## 5.6 Data Import Scripts (Node.js, not API)

Located in `scripts/` and `package.json` npm scripts:

- `data:import`, `data:import-master`, `data:create-profiles`, `data:create-missing-auth`, `data:reset-password`, `data:create-demo-accounts`, etc.
- Uses service role key locally (not exposed to frontend)

---

# 6. COMPONENTS & SHARED CODE

## 6.1 Context Providers

| Provider | File | State managed |
|----------|------|---------------|
| `AuthProvider` | `src/contexts/AuthContext.tsx` | `user`, `profile`, `session`, `loading`, signIn/signOut/OAuth, `refreshProfile` |
| `ThemeProvider` | `src/components/ThemeProvider.tsx` | Light/dark/system theme via `next-themes` |
| `QueryClientProvider` | `src/App.tsx` via `@tanstack/react-query` | Server state cache (`queryClient`) |
| `TooltipProvider` | Radix tooltip wrapper | Tooltip context |
| `PortalThemeSync` | `src/components/portal/PortalThemeSync.tsx` | Syncs portal theme with document |

## 6.2 Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useAuth` | Re-export from AuthContext |
| `useApplicants` | Direct Supabase applicant list (legacy) |
| `useApplicantSearch` | Admin search via `searchService` + React Query |
| `useClientApplicantSearch` | Client-scoped search RPC |
| `useClientContext` | Client record + subscription plan for logged-in client |
| `useDashboardStats` | Admin dashboard KPI queries |
| `useShortlists` | Shortlist CRUD for admin/client |
| `useUnreadMessageCount` | Polls unread messages (45s interval) |
| `useNotifications` | In-app notifications |
| `useRegistrationApplicant` | Applicant record during/after registration |
| `useInactivityTimeout` | Session timeout warning + auto logout |
| `useInViewOnce` | Intersection observer for animations |
| `useIsLgUp` / `use-mobile` | Responsive breakpoints |
| `useNavbarScroll` / `useNavbarScrollHide` | Marketing navbar scroll behavior |
| `use-toast` | Toast notifications |

## 6.3 Services (`src/services/`)

| Service | Responsibility |
|---------|----------------|
| `applicantService.ts` | Applicant CRUD, fetch by id |
| `applicantProfileMutations.ts` | Profile section mutations |
| `searchService.ts` | `search_applicants` RPC wrapper |
| `dashboardService.ts` | Admin/client home stats, charts data |
| `jobService.ts` | Jobs, applications, saved jobs, alerts |
| `clientService.ts` | Client profile, team, billing, CV downloads |
| `clientSignupService.ts` | Client registration flow |
| `clientPlanHelper.ts` | Plan limits and feature gates |
| `shortlistService.ts` | Folders/shortlists |
| `importService.ts` | Excel batch import |
| `messageService.ts` | Conversations and messages |
| `profileService.ts` | Profile updates |
| `profileViewService.ts` | Profile view tracking |
| `registrationService.ts` | Multi-step applicant registration |
| `masterDataService.ts` | States, cities, boards, degrees RPCs |
| `portalAuthService.ts` | Portal-specific auth helpers |

## 6.4 Utility Libraries (`src/lib/` + `src/utils/`)

| Module | Purpose |
|--------|---------|
| `supabase.ts` | Supabase client singleton |
| `queryClient.ts` | React Query defaults |
| `utils.ts` | `cn()` classname merge |
| `resolveSignInEmail.ts` | Phone→email login resolution |
| `authErrorMessages.ts` | User-friendly auth errors |
| `dashboardNav.ts` | Active nav detection |
| `portalTheme.ts` / `portalMobileNav.ts` | Portal styling helpers |
| `cloudinaryUpload.ts` | Cloudinary upload helpers |
| `applicantMediaUpload.ts` | Resume/image upload |
| `bulkResumeMatcher.ts` | Filename→applicant matching |
| `importNormalization.ts` | Excel row normalization |
| `exportUtils.ts` | Export helpers |
| `resumePreview.ts` | PDF preview via pdfjs |
| `applicantProfileUtils.ts` | Profile computation helpers |
| `booleanSearchParser.ts` | Boolean search → tsquery |
| `applicantExport.ts` | CSV/Excel export |
| `hiringProcessSteps.ts` | Marketing step content |
| `marketing*.ts/tsx` | Marketing content, nav, visuals, testimonials |

## 6.5 Shared / Reusable Components (by category)

### Route guards & auth
- `ProtectedRoute`, `RoleBasedRoute`, `DashboardRoute`, `ForcePasswordGuard`, `SessionTimeoutGuard`, `SessionExpiryModal`

### Portal / dashboard shell
- `PortalDashboardLayout`, `PortalBrand`, `portal-ui`, `PortalKpiGrid`, `PortalFormSection`, `PortalThemeSync`
- `DashboardPageShell`, `RangeFilterControl`

### Admin dashboard
- `BooleanSearchBar`, `ResumeSearchFilters`, `ApplicantTable`, `BulkActionsBar`

### Client dashboard
- `ClientCandidatesTable`, `CandidateCard`, `CVLimitModal`, `ClientSearchFilters`

### Jobs
- `JobApplicationsKanban`, `ApplicantProfileDrawer`

### Profile (enterprise)
- `ProfileHeader`, `ProfileSidebar`, `ProfileSection`, `ProfileCompletion`
- Sections: `PersonalDetailsSection`, `ResumeSection`, `SkillsSection`, `ExperienceSection`, `EducationSection`, `ProjectsSection`, `AccomplishmentsSection`, `CareerProfileSection`, `ITSkillsSection`, `OnlineProfilesSection`, `ProfileAnalytics`

### Messaging & notifications
- `MessagingWorkspace`, `NotificationBell`

### Registration
- `RegistrationLayout`, `RegistrationProgressBar`, `PhotoCropUpload`

### Marketing (80+ components)
- Layout: `Navbar`, `Footer`, `MarketingLayout`, `MarketingNavMegaDropdown`
- BharatGo: `BharatGoHero`, `BharatGoFeatureGrid`, `BharatGoHowItWorks`, etc.
- UI effects: `ShaderBackground`, `HeroTypewriterHeadline`, `GlassPanel`, `ElluraChatbot`

### shadcn/ui primitives (`src/components/ui/` — 50+ files)
`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `empty-state`, `form`, `glass-*`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `safe-html`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton*`, `slider`, `sonner`, `switch`, `table`, `tabs`, `tag-input`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`, `typewriter`

### Editor
- `RichTextEditor` (TipTap)

### Other
- `ScrollToTop`, `ThemeToggle`, `NavLink`, `FAQPreview`, `CandidateFAQs`, `HRFAQs`

## 6.6 Static / Mock Data

| File | Purpose |
|------|---------|
| `src/data/mockApplicants.ts` | Mock applicant data (dev/fallback) |
| `src/data/masterFilterOptions.ts` | Filter option constants |
| `src/data/indianStatesCities.json` | Location data |
| `src/data/collegesByCity.json` | College lookup |

---

# 7. WHAT EXISTS vs WHAT IS MISSING

## 7.1 WHAT IS ALREADY BUILT (even if incomplete)

### Marketing website
- Homepage (`Landing`) with hero shader, feature grids, pricing section, testimonials, chatbot
- About, Services, Features, Industries, Showcase, Contact, FAQ, Privacy, Terms
- Responsive marketing layout, mega nav, branded banners, cartoon assets

### Authentication
- Supabase Auth integration (email, phone, Google OAuth)
- Applicant 8-step registration wizard
- Admin signup/login, client signup/login
- Force password change flow
- Session inactivity timeout
- Team invite acceptance page

### Admin portal
- Dashboard home with live stats/charts (when data exists)
- AI resume search with boolean query + advanced filters
- Bulk CV upload, Excel import wizard
- Enterprise applicant profile viewer/editor
- Folder/shortlist management
- Jobs CRUD + application kanban
- Messaging workspace
- User list + client approval
- Settings (profile, theme, password)

### Client portal
- Dashboard home with search + stats
- Candidate search with plan-gated contact/CV download
- Saved searches
- Shortlists
- Jobs + kanban
- Billing with Razorpay integration (code complete)
- Team invites
- Messaging
- Settings

### Applicant portal
- Dashboard home with stats + resume preview
- Job browse/apply/save
- Applications tracker
- Job alerts CRUD
- Messages
- Profile views
- Settings

### Database schema
- 39 tables with RLS, indexes, triggers, search RPC
- Master data tables (states, cities, boards, degrees, etc.)
- Subscription/billing tables
- Messaging tables
- Audit logging

### Edge functions (source)
- 14 Deno functions for email, payments, cron jobs

### Tooling
- Excel import scripts, auth user creation scripts, extensive SQL fix scripts in `scripts/`
- Comprehensive docs (`docs/`, root markdown files)

## 7.2 WHAT IS COMPLETELY MISSING or NOT IMPLEMENTED

### Application architecture
- **No Next.js / SSR / API routes** (if rebuild targets Next.js, full migration needed)
- **No server-side middleware** (all auth is client-side)
- **No committed Supabase migrations** (`supabase/migrations/` only has README)
- **No deployed edge functions** on connected Supabase project
- **No production data** in connected database (0 applicants, 0 clients, etc.)

### Features missing or stub-only
- **Admin Reports page** — entirely mock/static
- **Admin user creation** — dialog not connected to backend
- **Admin folder share/export/edit** — buttons unwired
- **Real-time OTP** — hardcoded `123456` in email/phone signup
- **Pricing page route** — component exists, no `/pricing` route
- **Dedicated recruiter role** — only admin/client/applicant (no separate recruiter portal)
- **AI resume parsing/scoring** — "AI" badge on search but no LLM integration in codebase
- **Video interviews / scheduling**
- **ATS integrations** (LinkedIn, Naukri, etc.)
- **SMS notifications** (preferences exist, no Twilio/etc.)
- **Mobile native apps**
- **Multi-language / i18n**
- **Public job board** (jobs only inside authenticated applicant portal)
- **SEO job listing pages** (slug exists in DB but no public `/jobs/:slug` route)
- **Analytics tracking** (Google Analytics, etc.)
- **Admin audit log UI** (table exists, no frontend viewer)
- **Notification center UI** (bell exists; limited notification types wired)
- **Applicant full profile editor in settings** (only basic fields; enterprise profile not in applicant nav)
- **Recruiter assignment / pipeline ownership**
- **Interview feedback forms**
- **Offer letter generation**
- **Compliance/GDPR data export/delete self-service**

### Code hygiene gaps
- Orphan pages: `ApplicantProfileView.tsx`, `Login.tsx`, `Index.tsx`, `Pricing.tsx` (unrouted)
- Outdated `database.types.ts` (5 tables vs 39 live)
- `ProtectedRoute` testing mode bypass (`sessionStorage testing_mode`) — security risk if left in production
- `job_application_stages` table without RLS
- Legacy duplicate registration steps (`Step2Education`, `Step3Professional`, `Step4Upload`, `Step7Review` — parallel to main 8-step flow)

### Infrastructure / DevOps
- No CI/CD config in repo (no `.github/workflows`)
- No automated tests (no `*.test.*` / `*.spec.*` files found)
- No Storybook / component catalog
- Edge function cron schedules not verifiable in repo

---

## Appendix A: Documentation Files in Repo

| Path | Topic |
|------|-------|
| `docs/ELLURE_NEXHIRE_UI_UX_SPECIFICATION.md` | Full UI/UX spec |
| `docs/ELLURE_NEXHIRE_BRAND_KIT.md` | Brand guidelines |
| `docs/database-schema-complete-reference.md` | Schema reference (partially outdated) |
| `docs/complete-system-flow-documentation.md` | System flows |
| `docs/UI_CANONICAL_ROUTES.md` | Frozen dashboard UI canon |
| `PAGES_DOCUMENTATION.md` | Marketing page content reference |
| `THEME_DOCUMENTATION.md` | Theme tokens |
| `TROUBLESHOOTING.md` | Debug guide |

## Appendix B: Audit Methodology

- Read-only exploration of full `src/` tree, `package.json`, configs, `supabase/functions/`
- Supabase MCP: `list_tables`, `execute_sql` for columns, FKs, indexes, RLS, functions, triggers, row counts
- No code modifications except this report file
- Database snapshot date: June 14, 2026

---

*End of PROJECT_AUDIT.md*
