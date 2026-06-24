# UI canonical routes (do not add alternate UIs)

**Frozen baseline:** commit `1d63582` on `main` — applicant portal uses `ApplicantPortal` + `ApplicantDashboard` only.

## Applicant (canonical)

| URL | Component | Notes |
|-----|-----------|--------|
| `/dashboard/applicant` | `ApplicantPortal` → `ApplicantDashboard` (embedded) | **Only** applicant home UI |
| `/dashboard/applicant/profile` | Redirect → `/dashboard/applicant` | Legacy bookmark; no separate page |
| `/dashboard/applicant/settings` | `ApplicantSettings` | Contact / password only |
| `/dashboard/applicant/applications` | `ApplicantApplicationsPage` | |
| `/dashboard/applicant/jobs` | `ApplicantJobsPage` | |
| `/dashboard/applicant/saved-jobs` | `ApplicantSavedJobsPage` | |
| `/dashboard/applicant/job-alerts` | `JobAlertsPage` | |
| `/dashboard/applicant/messages` | `ApplicantMessagesPage` | |
| `/dashboard/applicant/profile-views` | `ApplicantProfileViewsPage` | |

**Removed / do not re-wire:** `ApplicantProfile.tsx`, `EnterpriseApplicantProfile` with `viewMode="applicant"`, `OldApplicantWelcomeModal`.

## Admin (canonical)

| URL | Component |
|-----|-----------|
| `/dashboard/admin` | `AdminHome` |
| `/dashboard/admin/applicants` | `ApplicantsManagement` |
| `/dashboard/admin/applicants/:id` | `EnterpriseApplicantProfile` (admin) |
| `/dashboard/admin/candidates/:id` | Redirect → `/dashboard/admin/applicants/:id` |
| `/dashboard/admin/messages` | `AdminMessagesPage` |
| `/dashboard/admin/users` | `UsersManagement` |
| Other admin nav paths | See `AdminDashboard.tsx` routes |

## Client (canonical)

| URL | Component |
|-----|-----------|
| `/dashboard/client` | `ClientHome` |
| `/dashboard/client/candidates/:id` | `CandidateProfileView` → `EnterpriseApplicantProfile` (client) |

## Orphan components (exist in repo, **not routed** — do not link without explicit approval)

| File | Was intended for |
|------|------------------|
| `admin/AdminApplicantProfileView.tsx` | Card-style admin candidate view |
| `admin/ApplicantProfileView.tsx` | Older admin candidate view |
| `client/ClientApplicantProfileView.tsx` | Card-style client candidate view |

## Duplicate auth login URLs (same UI, different paths)

- Applicant: `/auth/login`, `/auth/applicant`
- Admin: `/admin/auth/login`, `/auth/admin`
- Client: `/client/auth/login`, `/auth/client`

## Why UI “randomly” changed before

1. **Multiple implementations** for the same role (e.g. `ApplicantDashboard` vs `EnterpriseApplicantProfile` vs deleted `ApplicantProfile`).
2. **Uncommitted local edits** — Cursor/AI changed files on disk; restart still showed edits until git pull/reset.
3. **Wrong post-login redirect** — login sent users to `/dashboard/applicant/profile` (enterprise UI) instead of `/dashboard/applicant`.
4. **AI sessions** rewiring routes during backend/search work despite dashboard UI lock rules.

**Rule:** Only edit dashboard layout/styling when the user explicitly requests UI changes. Wire features behind existing canonical components.

## Responsive layout notes (MakTree-inspired)

Applied from `docs/PORTAL_UIUX_REFERENCE_EXPORT.md` — visual patterns only, not feature parity.

| Breakpoint | Shell | Content |
|------------|-------|---------|
| **Mobile** (&lt;768px) | MakTree glass header with **logo + Ellure NexHire** on home; back + title on inner routes; bottom nav with top active bar | Applicant/client: no sidebar; admin: bottom nav + overflow menu |
| **Tablet** (768–1023px) | Applicant/client: same mobile-first shell (bottom nav visible) | Card rows, `PortalStatLinkGrid` 3-col on phone |
| **Desktop** (≥1024px) | Admin: `w-60` sidebar; applicant/client: centered content, bottom nav remains (MR/Manager pattern) | Inter body + Sora brand wordmark in header |

Shared primitives: `src/components/portal/portal-ui.tsx`, `portalStyles.ts`, `DashboardPageShell.tsx`.

## MR/Manager layout donors (MakTree field-hub)

Visual clone per `docs/MR_MANAGER_DASHBOARD_UIUX_EXPORT.md` — Ellure routes and data unchanged.

| MakTree reference | Ellure portal | Shell |
|-------------------|---------------|-------|
| MR `/mr/dashboard` | Applicant `/dashboard/applicant` | `shellMode="mobile-first"` — compact logo header, bottom nav |
| Manager `/manager/dashboard` | Client `/dashboard/client` | Same |
| Admin sidebar + MR mobile nav | Admin `/dashboard/admin` | Desktop sidebar; mobile bottom nav |

| Ellure route | Layout donor |
|--------------|--------------|
| `/dashboard/applicant` | MR home (hero → today → quick actions → 3-col stats → alerts → panels) |
| `/dashboard/applicant/jobs` | MR master list |
| `/dashboard/applicant/applications` | MR report history |
| `/dashboard/applicant/settings` | MakTree profile |
| `/dashboard/client` | Manager home |
| `/dashboard/client/candidates` | Manager team list |
| `/dashboard/client/candidates/:id` | Manager team detail tabs |
| `/dashboard/admin` | Manager home + admin density |
| `/dashboard/admin/applicants` | MR master list + admin search |
| `/dashboard/admin/reports` | MR analytics |
