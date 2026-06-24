# Ellure NexHire — Recruiter Dashboard Audit

**Audit date:** June 2026  
**Scope:** Client/recruiter portal (`/dashboard/client/*`) — ResDex, NVite, jobs, home, nav  
**Target rating:** 9.0 / 10

---

## Current rating

| | Score |
|---|-------|
| **Before this sprint** | **6.4 / 10** |
| **After fixes (now)** | **7.8 / 10** |
| **Target** | 9.0 / 10 |

### Breakdown

| Dimension | Before | Now | Notes |
|-----------|--------|-----|-------|
| ResDex search & filters | 6.0 | **8.0** | DB-backed keyword/city/company suggestions; no static demo chips |
| Candidate profile view | 5.0 | **8.0** | `get_resdex_applicant_profile` RPC; demo client linked |
| Navigation & IA | 6.5 | **8.5** | ResDex sub-bar removed; hover menus on top nav |
| NVite / mass mail | 6.0 | **6.5** | Full UI; delivery needs `RESEND_API_KEY` (banner added) |
| Jobs & responses | 7.0 | **7.5** | Sidebar jobs-only (no duplicate ResDex links) |
| Home & saved searches | 7.0 | **7.5** | Works when `client_id` resolved |
| Data accuracy / API health | 5.5 | **8.0** | Fixed `skills_text`, `cv_download_log.downloaded_at` 400s |
| Plan / billing / team | 6.5 | **7.0** | Unchanged; Razorpay still deferred |

**Verdict:** ResDex is **usable end-to-end** for search → profile → shortlist. NVite compose works; **email send** waits on external Resend setup. Demo login `client.infosys@ellureconsulting.com` is now linked to a `clients` row via migration `012`.

---

## What was broken (root causes)

### 1. Console 400 errors

| Request | Cause | Fix |
|---------|-------|-----|
| `applicant_search_index?select=key_skills` | Column is `skills_text`, not `key_skills` | `dashboardService.getTopSkillsFromSearchIndex` |
| `cv_download_log?created_at=gte...` | Column is `downloaded_at` | Admin stats query in `dashboardService` |

### 2. Profile not found

- Search uses `search_applicants` (SECURITY DEFINER) — returns all matches.
- Profile page used direct `applicants` SELECT — blocked if RLS/role/client link failed.
- Demo user had `role=client` but **no `clients` row** → no quotas, broken context.

**Fixes:**

- RPC `get_resdex_applicant_profile` + fallback direct read.
- Migration `012`: broaden `is_recruiter_user()`, link demo Infosys account to `clients`.
- `fetchClientByProfile` matches client by email when `client_id` missing.

### 3. Suggestions showed demo/static data

- `INDUSTRY_SUGGESTIONS` hardcoded in `ResdexSearchFormSections`.
- Search bar had no DB autocomplete.

**Fixes:**

- `useResdexFilterOptions` loads cities, skills, companies, roles from `applicants`.
- `ResdexAutocompleteInput` + dropdown on search bar, keywords, location, filter panel.
- Static industry list removed.

### 4. Nav duplication

- Extra ResDex sub-nav bar under header (Search / NVite / Campaigns).
- Jobs sidebar repeated “Search Resumes” + placeholder Naukri links.

**Fixes:**

- Removed `ResdexSubNav` from `RecruiterShell`.
- ResDex + NVite in **top nav hover** (`recruiterNavMenus`).
- `RecruiterJobsSidebar` — jobs & responses only.

### 5. NVite / email

- UI and `send-nvite` edge function exist.
- **Resend not configured** → emails do not deliver.

**Fix:** Amber notice on `NvitePage` + menu description. Configure per `docs/EXTERNAL_SERVICES_SETUP_CHECKLIST.md`.

---

## Route map (live)

| Route | Component |
|-------|-----------|
| `/dashboard/client` | `RecruiterHomePage` |
| `/dashboard/client/resdex` | `ResdexSearchPage` |
| `/dashboard/client/resdex/results` | `ResdexResultsPage` |
| `/dashboard/client/candidates/:id` | `ResdexCandidateProfilePage` |
| `/dashboard/client/nvite` | `NvitePage` |
| `/dashboard/client/nvite/campaigns` | `NviteCampaignsPage` |
| `/dashboard/client/jobs/*` | `JobsPage` + jobs sidebar |
| `/dashboard/client/reports` | `RecruiterReportsPage` |

---

## Files changed (this sprint)

| Area | Path |
|------|------|
| Migration | `supabase/migrations/012_recruiter_resdex_fixes.sql` |
| Suggestions hook | `src/hooks/useResdexFilterOptions.ts` |
| Autocomplete UI | `src/components/dashboard/recruiter/ResdexAutocompleteInput.tsx` |
| Search bar | `src/components/dashboard/admin/ResdexSearchBar.tsx` |
| Search form | `ResdexSearchPage.tsx`, `ResdexSearchFormSections.tsx`, `ResdexSearchFormUi.tsx` |
| Results filters | `ResdexFiltersPanel.tsx`, `ResdexResultsPage.tsx` |
| Profile | `ResdexCandidateProfilePage.tsx`, `clientService.ts` |
| Nav | `RecruiterShell.tsx`, `naukriShellStyles.ts`, `RecruiterJobsSidebar.tsx` |
| NVite notice | `NvitePage.tsx` |
| API fixes | `dashboardService.ts` |

---

## Remaining for 9.0

- [ ] Configure Resend + verify NVite end-to-end
- [ ] Wire `searchIn` (skills vs title) into RPC if product needs it
- [ ] ResDex filters panel: skills/education chips from DB (partial — location done)
- [ ] Save search button on results toolbar (inline)
- [ ] Mobile ResDex filter sheet parity
- [ ] Playwright: recruiter search → profile → NVite select
- [ ] Replace demo client with production recruiter accounts

---

## Quick test checklist

1. Log in as `client.infosys@ellureconsulting.com` (demo).
2. ResDex → type a skill from your data → **dropdown suggestions** appear.
3. Search → open candidate profile → **no “Profile not found”**.
4. Hover **Resdex** in top nav → Search / Results / NVite / Campaigns.
5. Jobs → sidebar shows **only jobs links** (no Search Resumes section).
6. NVite → amber banner explains email setup status.
7. Console: no repeated `key_skills` or `created_at` 400 errors on home/admin charts.

---

*See also:* [`LAUNCH_AND_REMAINING_CHECKLIST.md`](./LAUNCH_AND_REMAINING_CHECKLIST.md) · [`EXTERNAL_SERVICES_SETUP_CHECKLIST.md`](./EXTERNAL_SERVICES_SETUP_CHECKLIST.md)
