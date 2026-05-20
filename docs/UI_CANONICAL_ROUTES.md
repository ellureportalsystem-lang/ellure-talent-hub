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
