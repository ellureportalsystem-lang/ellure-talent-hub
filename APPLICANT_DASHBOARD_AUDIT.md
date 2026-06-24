# Applicant Dashboard — Complete Audit Report

**Project:** Ellure NexHire (`ellure-talent-hub`)  
**Audit date:** 17 June 2026  
**Scope:** `/dashboard/applicant/**` — routes, UI, UX, profile system, data layer, and candidate journey  
**Method:** Static codebase analysis (no code changes). Routes and components verified against `src/App.tsx`, `ApplicantPortal.tsx`, and related modules.

---

## Executive Summary

The applicant portal is a **Naukri-inspired, top-navigation shell** wrapping **10 routed screens**. The landing experience at `/dashboard/applicant` is a **unified profile dashboard** (`EnterpriseApplicantProfile` in `viewMode="applicant"`), not a separate home page. Legacy `/dashboard/applicant/profile` redirects to the index.

Strengths include a **rich profile schema** (normalized education, experience, skills tables), **working resume upload**, **job browse/apply/save**, **applications tracking**, **job alerts**, **messages**, and **profile view history**. Gaps include **stub edit flows** for employment/education/projects, **placeholder analytics**, **orphaned legacy dashboard code**, **inconsistent visual systems** between profile and sub-pages, **no mobile bottom navigation**, and **limited accessibility affordances**.

---

# 1. Dashboard Overview

## 1.1 Current Structure

```
App.tsx
└── /dashboard/applicant/*  (Role: applicant, ForceLightTheme)
    └── ApplicantPortal.tsx
        └── ApplicantNaukriShell
            └── NaukriTopNavShell (sticky header, mega menu, user menu)
                └── NaukriPageContainer
                    └── <Routes> (page content)
```

| Layer | File | Role |
|-------|------|------|
| Route guard | `DashboardRoute` + `AuthContext` | Requires `role === "applicant"` |
| Portal shell | `ApplicantPortal.tsx` | Auth display name, unread badge, child routes |
| Chrome | `ApplicantNaukriShell.tsx` | Wires candidate nav + job search |
| Top nav | `NaukriTopNavShell.tsx` | Logo, primary nav, search, notifications, avatar menu |
| Content wrap | `NaukriPageContainer.tsx` | Max-width 1180px, padding |
| Profile home | `ApplicantProfilePage.tsx` → `EnterpriseApplicantProfile` | Unified profile + dashboard strip |

## 1.2 Dashboard Hierarchy

```
Candidate Portal
├── Profile (home)          /dashboard/applicant
├── Jobs                    /dashboard/applicant/jobs
│   └── Job detail          /dashboard/applicant/jobs/:id
├── Applications            /dashboard/applicant/applications
├── Messages                /dashboard/applicant/messages
├── [Mega menu / deep links]
│   ├── Saved jobs          /dashboard/applicant/saved-jobs
│   ├── Job alerts          /dashboard/applicant/job-alerts
│   ├── Profile views       /dashboard/applicant/profile-views
│   └── Settings            /dashboard/applicant/settings
└── Legacy redirect         /dashboard/applicant/profile → /
```

## 1.3 User Flow (High Level)

1. **Login** → `/candidate/login` (`ApplicantLogin`) → redirect `/dashboard/applicant`
2. **Registration** (optional, 8 steps) → `/auth/applicant-register/success` → `/dashboard/applicant`
3. **Profile** — view/edit sections, upload resume, track completion
4. **Jobs** — search, save, open detail, apply
5. **Applications** — track stage
6. **Messages** — chat with admin/client
7. **Settings** — account name/phone/password (not full profile)

Post-login default: **Profile page** (not a separate “home” dashboard).

## 1.4 Screens Available — Page Inventory

### Profile (Home)

| Attribute | Detail |
|-----------|--------|
| **Page name** | Applicant Profile / Dashboard |
| **Route** | `/dashboard/applicant` (index) |
| **Purpose** | Single hub: welcome strip, stats, full Naukri-style profile editor |
| **Entry component** | `ApplicantProfilePage` → `EnterpriseApplicantProfile` (`viewMode="applicant"`) |
| **Key components** | `ApplicantHomeStrip`, `ProfileHeader`, `ProfileSidebar`, `ProfileSection` ×12, `ProfileCompletion`, section components under `src/components/profile/sections/` |
| **Functionality** | Fetch applicant + related tables; inline edit resume/headline/skills/summary/online profiles; delete experience/education/IT skill rows; scroll-spy section nav; profile completion %; hash deep links (`#resume`, `#skills`, etc.) |
| **Data sources** | `applicants`, `profiles`, `applicant_education`, `applicant_experience`, `applicant_skills`, `job_applications` (stats in home strip) |

### Profile Redirect

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/profile` |
| **Behavior** | `<Navigate to="/dashboard/applicant" replace />` |
| **Purpose** | Backward-compatible bookmark |

### Browse Jobs

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/jobs` |
| **File** | `ApplicantJobsPage.tsx` |
| **Components** | `DashboardPageShell`, `PortalPageHeader`, `Card`, `Input`, `Badge`, `PortalEmptyState`, `Skeleton` |
| **Functionality** | Search by title/skill/company; city filter; list active jobs; save/unsave via `toggleSavedJob`; link to detail |
| **Data** | `jobs`, `clients`, `saved_jobs`, `applicants` |

### Job Detail & Apply

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/jobs/:id` |
| **File** | `ApplicantJobDetail.tsx` |
| **Components** | `Dialog`, `Textarea`, `SafeHtml`, `PortalLoadingBlock` |
| **Functionality** | Job detail HTML; apply modal with cover letter (500 chars); duplicate apply guard; uses applicant resume URL |
| **Data** | `jobs`, `applicants`, `job_applications` via `applyToJob` |

### Applications

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/applications` |
| **File** | `ApplicantApplicationsPage.tsx` |
| **Components** | `Table` (desktop), card list (mobile), `Badge` stage chips |
| **Functionality** | List applications with job title, company, applied date, `current_stage` |
| **Data** | `fetchApplicantApplications` → `job_applications` + `jobs` |

### Saved Jobs

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/saved-jobs` |
| **File** | `ApplicantSavedJobsPage.tsx` |
| **Components** | `PortalListRow`, `PortalEmptyState` |
| **Functionality** | List saved jobs; unsave; CTA to browse |
| **Data** | `saved_jobs`, `jobs` |

### Job Alerts

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/job-alerts` |
| **File** | `JobAlertsPage.tsx` |
| **Components** | `Dialog`, `TagInput`, `Switch`, `RadioGroup` |
| **Functionality** | CRUD alerts (keywords, locations, frequency); toggle active |
| **Data** | `job_alerts`; delivery via edge `run-job-alerts` (cron) |
| **Note** | Email delivery depends on deployed edge functions |

### Messages

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/messages` |
| **File** | `ApplicantMessagesPage.tsx` |
| **Components** | `MessagingWorkspace` (`dashboardRole="applicant"`) |
| **Functionality** | Inbox with admin/client; unread count in header badge |
| **Data** | `conversations`, `messages`, `notifications` |

### Profile Views

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/profile-views` |
| **File** | `ApplicantProfileViewsPage.tsx` |
| **Components** | `PortalListRow`, `PortalEmptyState` |
| **Functionality** | Last 30 days recruiter/admin views |
| **Data** | `profile_views` via `fetchApplicantProfileViews` |

### Settings

| Attribute | Detail |
|-----------|--------|
| **Route** | `/dashboard/applicant/settings` |
| **File** | `ApplicantSettings.tsx` |
| **Components** | `Card`, `Input`, `Label`, `Separator` |
| **Functionality** | Edit `full_name`, `phone` on `profiles`; change password via Supabase Auth |
| **Limitation** | Not a full profile editor; resume/skills/education live on Profile home |

### Orphan (Not Routed)

| File | Status |
|------|--------|
| `ApplicantDashboard.tsx` | **Exists but not imported** in `ApplicantPortal`. Legacy MR-style home with FAQs, duplicate stats. Canonical docs (`UI_CANONICAL_ROUTES.md`) still reference it — **documentation drift**. |

---

# 2. Applicant Dashboard Navigation

## 2.1 Existing Navigation Structure

### Top Navigation (Desktop ≥1024px)

Defined in `candidatePrimaryNav` (`naukriShellStyles.ts`):

| Label | Path | Hover submenu (`candidateNavMenus`) |
|-------|------|-------------------------------------|
| Profile | `/dashboard/applicant` | Edit Profile, Resume (`#resume`), Settings |
| Jobs | `/dashboard/applicant/jobs` | Browse Jobs, Saved Jobs, Job Alerts |
| Applications | `/dashboard/applicant/applications` | My Applications, Profile Views |
| Messages | `/dashboard/applicant/messages` | — |

**Chrome elements:** Ellure logo, global job search (→ `/dashboard/applicant/jobs?q=`), bookmark icon (non-functional link), `NotificationBell`, **Candidate tools** mega menu (`NaukriMegaMenu`), avatar dropdown (Settings, Logout).

Active state: Naukri blue text `#0078db` + red bottom border `#e84444`.

### Sidebar Navigation

**Portal-level:** None. Applicant does **not** use `PortalDashboardLayout` sidebar.

**Profile-level:** `ProfileSidebar` — sticky section jump links (desktop `lg+` only, 2/12 grid column). Hidden on mobile/tablet; users scroll long profile without section nav.

### Mobile Navigation

- **Hamburger** → `Sheet` with flat link list + submenu links (`NaukriPrimaryNav` `mobile` mode)
- **No bottom navigation bar** for applicant (unlike `PortalDashboardLayout` pattern documented for MR/Manager)
- Profile section sidebar **not available** on small screens

### Breadcrumbs

**Not implemented** anywhere in applicant portal.

### Navigation Hierarchy Diagram

```
[Naukri Top Nav — always visible]
  Logo → Profile home
  Profile | Jobs▾ | Applications▾ | Messages
  [Search jobs] [Notifications] [Mega menu] [Avatar▾]

[Page content]
  Profile page only:
    [ApplicantHomeStrip]
    [ProfileHeader]
    [ProfileSidebar | Sections... | ProfileCompletion]  (3-col desktop)
```

## 2.2 Missing Navigation Items

| Missing item | Industry expectation |
|--------------|---------------------|
| Dedicated **Home** vs **Profile** clarity | Naukri separates job feed/home from profile; here Profile is home |
| **Saved Jobs** in primary nav | Only in Jobs submenu |
| **Job Alerts** in primary nav | Submenu only |
| **Profile Views** in primary nav | Under Applications submenu |
| **Help / FAQs** in portal | Only `CandidateFAQs` in orphaned `ApplicantDashboard` |
| **Bottom nav** on mobile | Naukri/LinkedIn mobile apps use tab bar |
| **Breadcrumbs** on inner pages | Job detail, settings |
| **“Recent” button** | Shown in shell but navigates to Resdex path for recruiters — **wrong context for candidate** |

## 2.3 UX Problems

1. **Profile page length** — Home strip + header + 12 collapsible sections = extreme scroll; mobile has no section nav.
2. **Duplicate information** — Welcome strip repeats name/role; header repeats again immediately below.
3. **Submenu “Profile”** exists in `candidateNavMenus` but **Profile is not a hover parent** in primary nav (only Jobs, Applications have submenus). Resume/Settings links in menu are **orphaned** from hover UX.
4. **Bookmark header button** — no `onClick` / route for candidates.
5. **Settings split** — account settings vs profile editing on different routes without clear IA label.
6. **No way to reach Saved Jobs / Alerts** from profile home strip (only Jobs, Apps, Saved, Inbox quick actions — Saved is present; Alerts missing).

## 2.4 Recommended Improvements

1. Add **mobile section nav** — horizontal scroll chips or floating “Jump to” menu on profile.
2. Wire **header Bookmark** → `/dashboard/applicant/saved-jobs`.
3. Add **Job Alerts** to home strip quick actions or primary nav.
4. Implement **breadcrumbs** on `jobs/:id`, `settings`.
5. Consider **tabbed profile** (Resume | Experience | Education) vs single scroll for mobile.
6. Remove or repurpose **Recent** clock button for candidate portal.
7. Add **bottom nav** (Profile, Jobs, Applications, Messages) for `<lg` viewports per `PORTAL_UIUX_REFERENCE_EXPORT.md` intent.

---

# 3. Profile Management System

Profile editing is centralized on **`/dashboard/applicant`** via `EnterpriseApplicantProfile`. There is **no separate profile edit route**.

## 3.1 Profile Overview Page

### Layout (Desktop)

| Zone | Width | Content |
|------|-------|---------|
| Full width | 1180px max | `ApplicantHomeStrip` — welcome, today panel, quick actions, stat cards, alerts |
| Full width | — | `ProfileHeader` — cover bar, avatar, name, chips, CTAs |
| Left | 2/12 | `ProfileSidebar` — section links (sticky) |
| Center | 7/12 | 12× `ProfileSection` accordions |
| Right | 3/12 | `ProfileCompletion` + profile status card (sticky) |

Background: `#f4f5f7` (`applicantProfileCanvas`).

### Sections (in scroll order)

| Section ID | Title | Editable (applicant) |
|------------|-------|----------------------|
| `resume` | Resume & Headline | Yes — upload, headline |
| `skills` | Key Skills | Yes — chip list |
| `experience` | Employment | Partial — delete only; **edit stub** |
| `education` | Education | Partial — delete only; **edit stub** |
| `itskills` | IT Skills | Partial — delete rows; **edit stub** |
| `projects` | Projects | **Empty array** — no persistence |
| `summary` | Profile Summary | Yes — textarea + save |
| `links` | Online Profiles | Yes — LinkedIn, GitHub, portfolio |
| `accomplishments` | Accomplishments | **Empty** — edit stub |
| `career` | Career Profile | **Read-only** display |
| `personal` | Personal Details | **Read-only** display |
| `analytics` | Profile Analytics | **Placeholder metrics** (`--`) |

### Information Displayed

- Name, status badge, designation, experience, city, skill chips
- Profile photo with upload on hover
- Circular completion % on avatar ring
- Application stats in home strip (total, pending, shortlisted)
- Profile completion checklist (12 items, computed client-side)
- Registered / last updated dates in right rail

### Progress Indicators

- `ProfileCompletion` card — % + checklist with scroll-to-section
- `Progress` bar in home strip (“Profile strength”)
- Avatar ring SVG `strokeDasharray` tied to completion %
- Database field `profile_complete_percent` on `applicants` / `profiles` (synced via triggers)

### CTA Buttons

| CTA | Action |
|-----|--------|
| Improve profile → | Scroll to `#resume` |
| Edit Profile | Scroll to resume |
| Upload Resume | Scroll / file input in section |
| Share profile | `navigator.share` or clipboard |
| Quick actions | Navigate to Jobs, Apps, Saved, Inbox |
| Section Add/Edit | Per-section (many stubs) |

## 3.2 Profile Edit Page

**There is no dedicated edit page.** Editing is inline within each `ProfileSection`.

### Forms & Fields (by section)

| Section | Inputs | Persistence |
|---------|--------|-------------|
| Resume headline | `Textarea`, 250 char cap | `saveResumeHeadline` → `profiles.headline`, `applicants` |
| Resume file | File input `.pdf,.doc,.docx` | `uploadApplicantResume` → storage + `applicants.resume_file` |
| Key skills | `Input` chips, 250 char total | `syncApplicantSkillsFromChipList` → `applicant_skills` |
| Profile summary | `Textarea` + Save | `updateProfileSummary` |
| Online profiles | `Input` URLs | `applicants` + `profiles` linkedin/github/portfolio |
| Settings page | Name, phone, password | `profiles`, Supabase Auth |

### Validation

- Resume: MIME type whitelist, 5MB applicant / 15MB admin
- Headline: 250 characters
- Skills: duplicate check, total 250 chars
- Password: min 8 chars, confirm match
- Cover letter on apply: 500 chars

### Save Process

- Most sections save **immediately** on action (skills on add/remove, headline on Save)
- Toast feedback via `sonner`
- `profileReloadNonce` triggers refetch in parent after mutations
- `applicantProfileTouchFields()` updates `last_profile_updated_at`

### User Flow Gaps

- No **unsaved changes** warning
- No **global Save profile** button
- Employment/education **Add** buttons call `toast.info` stubs — **no create modals**

## 3.3 Resume Upload Section

| Aspect | Implementation |
|--------|----------------|
| **Upload flow** | Hidden file input → `uploadApplicantResume` (Cloudinary/storage) → update `applicants` + `profiles` |
| **Validation** | PDF/DOC/DOCX; size limit |
| **Preview** | `openResumePreview` (new tab / viewer) |
| **Download** | `triggerResumeDownload` |
| **Replace** | Same upload flow |
| **Remove** | Confirm dialog → `deleteApplicantResume` |
| **Error handling** | Toast errors; DB link failure message if upload succeeds but DB fails |
| **Legacy data** | Shows format-only message if `resumeUrl` is not HTTP URL (imported Excel) |

**Missing:** Resume parser, multi-version history, drag-and-drop UI (click only), virus scan feedback.

## 3.4 Skills Section

| Aspect | Detail |
|--------|--------|
| **Management** | Chip add/remove with immediate DB sync |
| **Tagging** | Comma-separated storage in `applicant_skills` + `applicants.key_skills` |
| **Searchability** | Feeds `applicant_search_index.skills_text` via DB triggers |
| **Suggest button** | **Fake AI** — static `suggestedSkills` array after timeout |
| **IT Skills** | Separate table `applicant_skills` with proficiency; distinct from key skills chips |

**Problems:** Misleading “AI” suggest; two skill UIs confuse users; no autocomplete from master skill list.

## 3.5 Education Section

| Aspect | Detail |
|--------|--------|
| **Display** | Cards from `applicant_education` or fallback single row from `applicants` registration fields |
| **Edit** | `onEdit` → `toast.info` only |
| **Delete** | Works for UUID rows; registration summary rows show error toast |
| **Add** | ProfileSection `canAdd` — **no handler wired** |

**Missing:** Add/edit modal, institution/degree pickers, board/university master data integration in UI.

## 3.6 Experience Section

| Aspect | Detail |
|--------|--------|
| **Display** | Timeline UI with company, designation, dates, CTC |
| **Edit** | Stub toast |
| **Delete** | Works for normalized rows |
| **Fallback** | Registration summary pseudo-row (`registration-summary`) |

**Missing:** Add employment form, current job toggle, notice period editor in portal.

## 3.7 Projects Section

| Aspect | Detail |
|--------|--------|
| **Data** | `projects: any[] = []` hardcoded empty in `EnterpriseApplicantProfile` |
| **UI** | `ProjectsSection` grid ready but never populated |
| **DB** | No `applicant_projects` table referenced in profile loader |

**Status:** **Non-functional** for applicants.

## 3.8 Personal Details & Career Sections

- **Read-only** in applicant mode (`PersonalDetailsSection`, `CareerProfileSection` ignore `viewMode` editing)
- Data from flat `applicants` columns
- **No edit UI** in dashboard for DOB, gender, preferred locations, expected CTC, etc.
- Registration captures many fields; post-login editing limited

## 3.9 Accomplishments Section

- Empty array; no DB load
- `applicant_achievements` table exists in schema but **not wired** in profile page

## 3.10 Profile Analytics Section

- Four stat cards always show `--`
- Separate **Profile Views** page has real data
- Misleading to show analytics section with placeholders

---

# 4. Visual Design Audit

## 4.1 Dual Design Systems (Inconsistency)

| Context | Token source | Background | Card style |
|---------|--------------|------------|------------|
| Profile home | `applicantProfileStyles.ts` + Naukri | `#f4f5f7` | `border-[#e8e8e8]`, subtle shadow |
| Jobs, Apps, Settings, etc. | `portalStyles.ts` + shadcn | White / muted | `portalPanelClass`, theme tokens |
| Shell | `naukriShellStyles.ts` | `#f4f5f7` page, white header | Naukri nav |

## 4.2 Color System

### Naukri Portal (Applicant shell + profile)

| Token | Value | Usage |
|-------|-------|-------|
| `NAUKRI_PRIMARY` | `#0078db` | Links, buttons, progress |
| `NAUKRI_PRIMARY_HOVER` | `#0066c0` | Button hover |
| `NAUKRI_PAGE_BG` | `#f4f5f7` | Page canvas |
| `NAUKRI_BORDER` | `#e8e8e8` | Card borders |
| `NAUKRI_TEXT` | `#333` | Body |
| `NAUKRI_TEXT_MUTED` | `#666` | Secondary |
| Active nav underline | `#e84444` | Naukri red accent |

### Brand Kit (Marketing / legacy)

| Token | Value |
|-------|-------|
| Brand primary | `#0566CD` |
| Brand teal | `#1CB4A8` |
| Wordmark Ellure | `#3D4853` |

**Inconsistency:** Portal uses `#0078db` (Naukri blue) while brand kit primary is `#0566CD`. Theme CSS variables may still reference brand primary on some shadcn components.

## 4.3 Typography

| Element | Font | Size (typical) |
|---------|------|----------------|
| Portal UI | Inter | 13–14px body |
| Brand wordmark | Sora / Poppins | Nav logo |
| Profile name | Inter Bold | 22px (applicant header) |
| Section titles | Inter Semibold | 14px |
| Home welcome | Inter Bold | 20px |

## 4.4 Spacing & Grid

- Content max width: **1180px** (`NAUKRI_CONTENT_MAX`)
- Profile grid: **12-column** at `lg` (2 + 7 + 3)
- Section spacing: `space-y-5` (20px)
- Card padding: 16px (`p-4`)

## 4.5 Card Design

- Border radius: **8px** (`rounded-lg`) standard; **12px** (`rounded-xl`) profile header
- Shadow: `0 1px 4px rgba(0,0,0,0.06)`
- No glass morphism in applicant portal (unlike marketing hero)

## 4.6 Component Consistency Issues

1. `ProfileSection` uses shadcn `Card`; jobs pages use `portalPanelClass` — visually similar but different class sources
2. `ProfileAnalytics` uses purple/green accent icons — violates dashboard rule “avoid violet AI styling”
3. `SkillsSection` “Suggest” uses `Lightbulb` + fake AI copy
4. Orphan `ApplicantDashboard` uses gradient hero / `PortalWelcomeHero` — different from current profile strip

## 4.7 Figma Reference

- File created: `Ellure NexHire - Applicant Profile` (`UYBtxi5tPpqMN6ofH8CPIe`)
- Implementation partially aligned via `applicantProfileStyles.ts`

---

# 5. User Experience Audit

## 5.1 Ease of Use

| Strength | Weakness |
|----------|----------|
| Single profile URL simplifies mental model | Very long scroll on profile |
| Resume upload is clear | Employment/education edit appears broken (toast only) |
| Job search is simple | No recommended jobs on home |
| Applications table readable | No drill-down to application detail |

## 5.2 Information Architecture

- **Profile = Home** matches LinkedIn “profile as identity” but not Naukri “job feed first”
- Secondary features (alerts, saved, views) buried in mega menu / submenus
- Settings vs Profile split causes “where do I edit X?” confusion

## 5.3 Accessibility

| Present | Missing |
|---------|---------|
| `aria-label` on mobile menu button | Skip links |
| Some semantic headings | Focus management in modals (partial) |
| Keyboard works on shadcn components | Section sidebar keyboard trap |
| Color contrast generally OK on Naukri tokens | `aria-live` for toasts only |
| | Form field `aria-describedby` for errors |
| | Screen reader labels on profile completion ring |

## 5.4 State Coverage Matrix

| State | Profile | Jobs | Applications | Settings |
|-------|---------|------|--------------|----------|
| Loading | Spinner in `EnterpriseApplicantProfile` | Skeleton list | Skeleton | Skeleton |
| Empty | Section empty messages | `PortalEmptyState` | Inline text | N/A |
| Error | Toast on fetch fail | Toast | Silent fail | Toast |
| Success | Toast per save | Toast save job | N/A | Toast |

**Gaps:** No retry UI on network failure; profile “applicant not found” is sparse; job detail 404 minimal.

## 5.5 UX Friction Points (Ranked)

1. Employment/education **Edit/Add non-functional** (stubs)
2. **Projects & accomplishments** non-functional
3. **Analytics placeholders** erode trust
4. **No mobile section navigation** on profile
5. **Duplicate welcome + header** on profile load
6. **Fake AI skill suggestions**
7. **Personal/career fields** not editable post-registration
8. **Registration summary rows** cannot be edited or deleted cleanly
9. **Settings** doesn’t link to profile sections
10. **Bookmark** icon does nothing

---

# 6. Dashboard Components Inventory

## 6.1 Layout & Shell

| Component | Path | Usage | Reusability | Consistency |
|-----------|------|-------|-------------|-------------|
| `ApplicantNaukriShell` | `components/dashboard/applicant/` | All applicant pages | High | Naukri |
| `NaukriTopNavShell` | `components/dashboard/naukri/` | Shell wrapper | Cross-portal | High |
| `NaukriPrimaryNav` |同上 | Top + mobile nav | Cross-portal | High |
| `NaukriMegaMenu` |同上 | Candidate tools dropdown | Cross-portal | High |
| `NaukriPageContainer` |同上 | Content width | Cross-portal | High |
| `DashboardPageShell` | `components/dashboard/` | Sub-pages | Cross-portal | Medium |

## 6.2 Profile Components

| Component | Usage locations | Notes |
|-----------|-----------------|-------|
| `ApplicantHomeStrip` | Profile index only | Figma-aligned |
| `ProfileHeader` | Profile (all modes) | Applicant variant styled |
| `ProfileSidebar` | Profile desktop | Hidden mobile |
| `ProfileSection` | 12 accordions | Framer motion expand |
| `ProfileCompletion` | Profile right rail | Sticky |
| `ResumeSection` | Profile | Full CRUD upload |
| `SkillsSection` | Profile | Chip editor |
| `ExperienceSection` | Profile | Timeline |
| `EducationSection` | Profile | List cards |
| `ITSkillsSection` | Profile | Table layout |
| `ProjectsSection` | Profile | Unused data |
| `OnlineProfilesSection` | Profile | Edit/save works |
| `PersonalDetailsSection` | Profile | Read-only |
| `CareerProfileSection` | Profile | Read-only |
| `AccomplishmentsSection` | Profile | Empty |
| `ProfileAnalytics` | Profile | Placeholder |

## 6.3 Portal UI Primitives (`portal-ui.tsx`)

| Component | Applicant usage |
|-----------|-----------------|
| `PortalPageHeader` | Jobs, Apps, Saved, Alerts, Views, Settings |
| `PortalEmptyState` | Jobs, Saved, Views |
| `PortalListRow` | Saved jobs, Profile views |
| `PortalStatLinkCard` | Home strip stats |
| `PortalQuickActionGrid` | *(removed from strip — custom grid now)* |
| `PortalWelcomeHero` | Orphan `ApplicantDashboard` only |
| `PortalLoadingBlock` | Job detail |
| `PortalBannerStrip` | Home strip (admin-managed content) |

## 6.4 shadcn/ui Components Used

`Button`, `Card`, `Input`, `Textarea`, `Badge`, `Progress`, `Table`, `Dialog`, `Sheet`, `DropdownMenu`, `Switch`, `RadioGroup`, `Label`, `Separator`, `Skeleton`, `Avatar`, `TagInput`

## 6.5 Messaging

| Component | Path |
|-----------|------|
| `MessagingWorkspace` | `components/messages/` |
| `NotificationBell` | `components/notifications/` |

## 6.6 Orphan / Legacy

| Component | Status |
|-----------|--------|
| `ApplicantDashboard` | Not routed |
| `CandidateFAQs` | Only in orphan dashboard |

---

# 7. Responsive Design Audit

## 7.1 Desktop (≥1024px)

| Area | Behavior |
|------|----------|
| Top nav | Full primary nav + search |
| Profile | 3-column layout with sticky sidebars |
| Applications | Table view |
| Jobs | Full search row |

**Issues:** Profile center column very wide; no max-width on inner text lines.

## 7.2 Tablet (768–1023px)

| Area | Behavior |
|------|----------|
| Top nav | Hidden; hamburger menu |
| Profile | Single column; **no ProfileSidebar** |
| Applications | Card list (`md:hidden` table hidden — cards show below `md`) |

**Issues:** Profile section nav absent; long scroll.

## 7.3 Mobile (<768px)

| Area | Behavior |
|------|----------|
| Nav | Sheet menu |
| Home strip | 4-col quick actions may be cramped |
| Profile header | Stacked CTAs |
| Resume actions | Wrap buttons |

**Issues:**

- Quick action grid `grid-cols-4` tight on 320px screens
- No bottom nav
- Table hidden but card patterns good on applications
- Profile completion checklist `max-h-[280px]` scroll inside card — awkward

## 7.4 Overflow & Accessibility

- Top nav scrolls horizontally on narrow desktop with `overflow-x-auto`
- Long skill chips wrap OK
- Headline/resume filenames truncate
- Touch targets generally ≥44px on buttons; section chevrons are small (28px)

---

# 8. Candidate Journey Analysis

## 8.1 Journey Map

```
[Landing / Login]
    ↓
/candidate/login → Auth (email/password, Google callback)
    ↓
/dashboard/applicant (Profile)
    ├─ Complete profile sections
    ├─ Upload resume
    └─ Home strip → Jobs / Applications
    ↓
/dashboard/applicant/jobs → Search → Detail → Apply
    ↓
/dashboard/applicant/applications → Track stages
    ↓
(Optional) Messages, Alerts, Profile Views, Settings
```

## 8.2 Registration Path (New Users)

```
/auth/register → Email/Phone OTP → Set password
    ↓
/auth/applicant-register/step-1..8
    Step 1: Basic info
    Step 2: Address
    Step 3: Education
    Step 4: Experience
    Step 5: Skills
    Step 6: Career preferences
    Step 7: Documents (resume)
    Step 8: Review
    ↓
/auth/applicant-register/success → /dashboard/applicant
```

## 8.3 Journey Issues

| Step | Issue |
|------|-------|
| Registration → Dashboard | 8 steps then **same fields** appear again in profile editor |
| Email verification | OTP in register flow; not re-verified in dashboard |
| Profile completion | Shown in dashboard but **doesn’t gate** job apply |
| Job apply | Allowed without resume in code path (resume URL optional in `applyToJob`) — may fail downstream |
| Post-apply | Email via `on-application-submitted` edge (deploy-dependent) |
| Imported candidates | Can claim profile via same email — documented in `CLIENT_BULK_DATA_IMPORT_GUIDE.md` |

## 8.4 Redundant Steps

1. Enter education in registration **and** see education section again (read-only/stub edit)
2. Welcome strip + profile header duplicate metadata
3. Settings name/phone vs personal details section (split)
4. Key skills in registration + skills section + IT skills section

## 8.5 Improvement Opportunities

1. Post-registration **guided checklist** modal on first login
2. **Resume required** before apply with inline CTA
3. **Merge registration step 8 review** into live profile preview
4. **Onboarding tour** for nav (Jobs, Applications, Messages)
5. **Email/push** for stage changes (edge functions)

---

# 9. Industry Comparison

Comparison against typical patterns (not live product teardowns).

| Capability | Ellure NexHire | Naukri | LinkedIn | Indeed | Foundit |
|------------|----------------|--------|----------|--------|---------|
| Profile as landing | Yes | Partial (job feed often home) | Yes | Apply-focused | Yes |
| Resume upload | Yes | Yes | Yes | Yes | Yes |
| Resume parser | No | Yes | Yes | Yes | Yes |
| Profile strength % | Yes | Yes | Yes | Limited | Yes |
| Job recommendations | No | Yes | Yes | Yes | Yes |
| Easy Apply | Partial (cover letter) | Yes | Yes | Yes | Yes |
| Saved jobs | Yes | Yes | Yes | Yes | Yes |
| Job alerts | Yes | Yes | Yes | Yes | Yes |
| Application tracking | Basic list | Detailed | Detailed | Simple | Detailed |
| Profile views insight | Separate page | Yes | Premium | Limited | Yes |
| Messaging recruiters | Yes | Limited | Yes | Limited | Limited |
| Mobile bottom nav | No | Yes | Yes | Yes | Yes |
| Skill endorsements | No | No | Yes | No | No |
| Open to work badge | Status badge only | Yes | Yes | No | Yes |
| Video intro | No | No | Yes | No | No |
| Projects portfolio | UI only, empty | Add-on | Yes | No | Partial |
| Career preferences edit | Read-only | Yes | Yes | Yes | Yes |
| PDF profile export | No | Yes | Yes | No | Partial |
| Who viewed resume | Partial | Yes | Premium | No | Yes |

### Missing Modules (vs industry)

- Job recommendation feed / “Jobs for you”
- Recruiter search appearance analytics (real data)
- Resume parsing / auto-fill
- Profile visibility controls in UI (`profile_visibility` enum exists in DB)
- Interview scheduling from applicant side
- Salary insights
- Company follow / alerts per company

### Missing UX Patterns

- Sticky mobile “Apply” bar on job detail
- Progress stepper for profile completion on mobile
- Single-click Easy Apply
- Notification center unified with application updates
- Dark mode in applicant portal (forced light theme)

---

# 10. Database Mapping

## 10.1 Core Applicant Tables

### `applicants`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Canonical candidate record; registration + import data |
| **Relationships** | `user_id` → `profiles.id`; children: education, experience, skills, applications, etc. |
| **Key fields** | `name`, `email`, `phone`, `city`, `resume_file`, `profile_image`, `key_skills`, `current_company`, `current_designation`, `total_experience`, `expected_ctc`, `profile_complete_percent`, `headline`, `summary`, URLs |
| **Usage** | Primary load in `EnterpriseApplicantProfile`; apply flow; search index source |

### `profiles`

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Auth-linked user profile (all roles) |
| **Relationships** | `applicant_id` → `applicants.id` (1:1 for candidates) |
| **Key fields** | `role`, `full_name`, `email`, `phone`, `location`, `resume_file`, `profile_image`, `headline`, `profile_complete_percent` |
| **Usage** | Auth context; settings page; sync triggers from applicants |

### `applicant_education`

| Purpose | Normalized education rows |
|-----------|---------------------------|
| **FK** | `applicant_id` → `applicants.id` |
| **Fields** | `education_level`, `degree_id`, `institution_id`, `passing_year`, `percentage`, `is_highest`, etc. |
| **Usage** | Profile education section; search index |

### `applicant_experience`

| Purpose | Employment history |
|-----------|-------------------|
| **FK** | `applicant_id` → `applicants.id` |
| **Fields** | `company_name`, `designation`, `start_date`, `end_date`, `is_current`, `current_ctc`, `notice_period` |
| **Usage** | Profile experience section |

### `applicant_skills`

| Purpose | IT/detailed skills |
|-----------|-------------------|
| **FK** | `applicant_id` → `applicants.id` |
| **Fields** | `skill_name`, `skill_level`, `years_of_experience` |
| **Usage** | IT skills section; key skills sync |

### `applicant_files`

| Purpose | File metadata (resumes, certificates) |
|-----------|--------------------------------------|
| **Usage** | Schema exists; profile UI uses direct `resume_file` URL on applicants row primarily |

### `applicant_achievements`

| Purpose | Certifications, awards |
|-----------|------------------------|
| **Usage** | **Not loaded** in applicant profile UI |

### `applicant_search_index`

| Purpose | Full-text / filter search for ResDex |
|-----------|-------------------------------------|
| **Fields** | `combined_text`, `skills_text`, `experience_years`, `has_resume`, `profile_visibility` |
| **Usage** | Recruiter search; updated via triggers |

## 10.2 Applications & Jobs

### `job_applications`

| Fields | `job_id`, `applicant_id`, `current_stage`, `applied_at`, `cover_letter`, `applicant_resume_url` |
| **Unique** | `(job_id, applicant_id)` |
| **Usage** | Applications page; home strip stats; activity feed |

### `saved_jobs`

| Fields | `applicant_id`, `job_id` |
| **Usage** | Saved jobs page; heart toggle on jobs list |

### `job_alerts`

| Fields | `keywords[]`, `cities[]`, `frequency`, `is_active`, `last_sent_at` |
| **Usage** | Job alerts page; `run-job-alerts` edge |

### `jobs`

| **Usage** | Browse/detail; FK to `clients` for company name |

## 10.3 Engagement Tables

### `profile_views`

| Fields | `applicant_id`, `viewer_id`, `viewer_type`, `viewed_at` |
| **Usage** | Profile views page; `increment_profile_views` RPC |

### `conversations` / `messages`

| **Usage** | `MessagingWorkspace` |

### `notifications`

| **Usage** | `NotificationBell` |

## 10.4 RPC & Triggers (Applicant-relevant)

| Name | Purpose |
|------|---------|
| `increment_profile_views` | Track recruiter views |
| `auto_create_profile_from_applicant` | Sync profile on applicant insert/update |
| Triggers on education/experience/skills | Refresh search index + completion % |

---

# 11. Feature Gap Analysis

| Feature | Exists | Missing | Notes |
|---------|--------|---------|-------|
| Unified profile dashboard | ✅ | — | `/dashboard/applicant` |
| Profile completion score | ✅ | — | Client + DB field; formulas differ slightly |
| Profile strength indicator | ✅ | — | Home strip + completion card |
| Resume upload | ✅ | — | PDF/DOC/DOCX |
| Resume preview | ✅ | — | `openResumePreview` |
| Resume parser | ❌ | ✅ | No auto-extract |
| Resume version history | ❌ | ✅ | Single file field |
| Headline / summary | ✅ | — | Editable |
| Key skills editor | ✅ | — | Chip UI |
| IT skills CRUD | Partial | Add/Edit UI | Delete works |
| Employment CRUD | Partial | Add/Edit UI | Delete works |
| Education CRUD | Partial | Add/Edit UI | Delete works |
| Projects | ❌ | ✅ | Empty array |
| Accomplishments | ❌ | ✅ | Table exists, UI empty |
| Personal details edit | ❌ | ✅ | Read-only |
| Career preferences edit | ❌ | ✅ | Read-only |
| Online profiles | ✅ | — | LinkedIn/GitHub/portfolio |
| Profile photo upload | ✅ | — | Avatar hover upload |
| Job search | ✅ | — | Text + city |
| Job recommendations | ❌ | ✅ | No ML/rules feed |
| Saved jobs | ✅ | — | |
| Job alerts | ✅ | Partial | CRUD yes; email needs cron |
| Easy apply | Partial | ✅ | Modal + cover letter |
| Application tracking | ✅ | Partial | No detail page |
| Application timeline | ❌ | ✅ | `job_application_stages` not shown |
| Profile views | ✅ | — | 30-day list |
| Profile analytics dashboard | ❌ | ✅ | Placeholder `--` |
| Messaging | ✅ | — | |
| In-app notifications | ✅ | Partial | Bell present |
| Settings (account) | ✅ | — | Name, phone, password |
| Email change | ❌ | ✅ | Disabled in settings |
| Profile visibility toggle | ❌ | ✅ | DB enum exists |
| Activity history | Partial | ✅ | Service exists; not on profile UI |
| FAQs / help | Partial | ✅ | Only in orphan dashboard |
| Mobile bottom nav | ❌ | ✅ | |
| Breadcrumbs | ❌ | ✅ | |
| Onboarding tour | ❌ | ✅ | |
| Dark mode | ❌ | ✅ | Force light theme |
| Export profile PDF | ❌ | ✅ | |
| Share profile link | Partial | ✅ | Clipboard/share API on header |
| AI skill suggest | Fake | ✅ | Static list |
| Imported profile claim | ✅ | — | Email match flow |
| RLS / own data security | ✅ | — | Applicant owns rows |
| Edge functions (email) | Partial | Deploy | Repo has functions |

---

# 12. Screenshots Reference

No applicant-dashboard-specific screenshots are checked into the repository. Reference assets below are the closest available.

| Screen | Reference path | Hierarchy / notes |
|--------|----------------|-------------------|
| Applicant registration (step 1) | `uiuxsc/ellure sc/login screens/applicant registration form first page sc.PNG` | Marketing-style registration, not dashboard |
| Naukri login reference | `uiuxsc/ellure sc/login screens/naukri login screen.PNG` | External UX reference only |
| Recruiter view of candidate profile | `uiuxsc/ellure sc/resdex/resdex applicant profile view inside the recruters dashboard after candidate is searched.PNG` | Shows recruiter-side profile — applicant should mirror section structure |
| Candidate cartoon (marketing) | `public/auth-cartoon-candidate.png` | Auth pages, not dashboard |
| Figma reference (2026) | [Figma: Applicant Profile](https://www.figma.com/design/UYBtxi5tPpqMN6ofH8CPIe) | Welcome strip, quick actions, header — implemented in `ApplicantHomeStrip` |
| Orphan home mock | `ApplicantDashboard.tsx` (code only) | Gradient hero, FAQs — **not routed** |
| Live capture | `http://localhost:8080/dashboard/applicant` | **Recommended:** capture Profile, Jobs, Applications, Settings for QA |

### Component Hierarchy (Profile Page)

```
ApplicantProfilePage
└── EnterpriseApplicantProfile [viewMode=applicant]
    ├── ApplicantHomeStrip
    │   ├── Welcome card
    │   ├── Today panel (stats + progress)
    │   ├── Quick actions (4)
    │   ├── Stat link grid (3)
    │   └── Alert cards (conditional)
    ├── ProfileHeader
    ├── Grid 12-col
    │   ├── ProfileSidebar (lg only)
    │   ├── Main sections ×12 (ProfileSection → section component)
    │   └── ProfileCompletion + status card
```

---

# 13. Final Assessment

## 13.1 Current Scores

| Dimension | Score (/10) | Rationale |
|-----------|-------------|-----------|
| **UI Design** | **6.5** | Naukri-aligned profile strip and shell are cohesive; sub-pages and placeholders pull quality down |
| **UX Design** | **5.5** | Strong IA intent (unified profile) undermined by stub editors, long scroll, nav gaps |
| **Accessibility** | **5.0** | Baseline shadcn patterns; missing skip links, inconsistent focus, small touch targets |
| **Mobile Experience** | **6.0** | Responsive cards/tables work; profile editing on mobile is arduous without section nav |
| **Recruiter Readiness** | **7.0** | Rich schema + search index + resume; data completeness depends on applicant filling profile |

**Overall weighted:** **6.0 / 10** — solid foundation, incomplete applicant self-service editing.

## 13.2 Top 20 Problems (by Severity)

| # | Severity | Problem |
|---|----------|---------|
| 1 | Critical | Employment **Add/Edit** non-functional (toast stubs) |
| 2 | Critical | Education **Add/Edit** non-functional |
| 3 | High | Projects section **never populated** |
| 4 | High | Accomplishments **not wired** to `applicant_achievements` |
| 5 | High | Profile analytics shows **fake `--` metrics** |
| 6 | High | Personal details & career prefs **read-only** after registration |
| 7 | High | **No mobile section navigation** on profile |
| 8 | Medium | Orphan **`ApplicantDashboard`** + docs drift confuse maintainers |
| 9 | Medium | **Dual design tokens** (Naukri vs portal vs brand) |
| 10 | Medium | **Fake AI skill suggest** misleads users |
| 11 | Medium | Registration **summary rows** can’t be edited in place |
| 12 | Medium | **Bookmark** nav button non-functional |
| 13 | Medium | **Recent** clock button wrong for candidate portal |
| 14 | Medium | No **job recommendations** on home |
| 15 | Medium | Apply flow may proceed **without resume** |
| 16 | Medium | **No application detail** / stage timeline for applicants |
| 17 | Low | **No breadcrumbs** on nested routes |
| 18 | Low | **No bottom nav** on mobile |
| 19 | Low | Settings **doesn’t surface** profile editing |
| 20 | Low | `Profile` submenu links in `candidateNavMenus` **not reachable** via hover (no Profile parent menu) |

## 13.3 Top 20 Improvements (by Impact)

| # | Impact | Improvement |
|---|--------|-------------|
| 1 | Very high | Implement **employment add/edit modal** with `applicant_experience` CRUD |
| 2 | Very high | Implement **education add/edit modal** with master data pickers |
| 3 | Very high | Wire **projects** to new or existing table |
| 4 | High | Wire **accomplishments** to `applicant_achievements` |
| 5 | High | Replace analytics placeholders with **real metrics** or hide section |
| 6 | High | Add **mobile section nav** (chips or drawer) |
| 7 | High | **Editable personal & career** sections |
| 8 | High | **Resume required** gate on job apply |
| 9 | Medium | Add **job recommendations** widget to home strip |
| 10 | Medium | **Application detail page** with stage timeline |
| 11 | Medium | Unify **design tokens** — single applicant theme module |
| 12 | Medium | Remove fake AI; use **real skill autocomplete** from index |
| 13 | Medium | Add **bottom navigation** for mobile |
| 14 | Medium | Fix header **Bookmark → saved jobs** |
| 15 | Medium | **Profile visibility** toggle (public/clients_only) |
| 16 | Medium | First-login **onboarding checklist** |
| 17 | Medium | Delete or archive **`ApplicantDashboard.tsx`**; update docs |
| 18 | Low | **Breadcrumbs** on job detail / settings |
| 19 | Low | **Resume parser** integration (third-party) |
| 20 | Low | **Export profile as PDF** for downloads |

---

## Appendix A — Key Source Files

| Area | Path |
|------|------|
| Routes | `src/App.tsx`, `src/pages/dashboard/ApplicantPortal.tsx` |
| Shell | `src/components/dashboard/applicant/ApplicantNaukriShell.tsx` |
| Nav tokens | `src/components/dashboard/naukri/naukriShellStyles.ts` |
| Profile page | `src/pages/dashboard/applicant/ApplicantProfilePage.tsx` |
| Profile logic | `src/pages/dashboard/admin/EnterpriseApplicantProfile.tsx` |
| Profile styles | `src/components/dashboard/applicant/applicantProfileStyles.ts` |
| Home strip | `src/components/dashboard/applicant/ApplicantHomeStrip.tsx` |
| Services | `src/services/applicantDashboardService.ts`, `applicantProfileMutations.ts`, `jobService.ts` |
| Canonical routes doc | `docs/UI_CANONICAL_ROUTES.md` (partially outdated) |
| Schema reference | `PROJECT_AUDIT.md` §4, `docs/database-schema-complete.md` |
| Brand | `docs/ELLURE_NEXHIRE_BRAND_KIT.md` |

## Appendix B — Auth & Entry URLs

| Action | URL |
|--------|-----|
| Login | `/candidate/login` |
| Register | `/auth/register` → applicant-register steps |
| Dashboard | `/dashboard/applicant` |
| Legacy login aliases | `/auth/applicant`, `/auth/login` → redirect |

---

*End of audit. This document reflects the codebase as of 17 June 2026. No source files were modified during this audit.*
