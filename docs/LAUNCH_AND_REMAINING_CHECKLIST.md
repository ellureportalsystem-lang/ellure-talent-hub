# Ellure NexHire — Launch Readiness & Remaining Work

**Last updated:** June 2026  
**Supabase project:** `togxwenqypmxohqguscg`  
**Production domain (target):** `https://ellurenexhire.com`  
**Related docs:** [`EXTERNAL_SERVICES_SETUP_CHECKLIST.md`](./EXTERNAL_SERVICES_SETUP_CHECKLIST.md) · [`ADMIN_E2E_CHECKLIST.md`](./ADMIN_E2E_CHECKLIST.md) · [`CLIENT_BULK_DATA_IMPORT_GUIDE.md`](./CLIENT_BULK_DATA_IMPORT_GUIDE.md)

Use this as the **master checklist** for everything still needed before full production launch. OTP/SMS and payments are intentionally deferred — sections are included so you can wire them when ready.

---

## Admin dashboard — current rating

| | Score |
|---|-------|
| **Before audit (June 2025)** | 5.8 / 10 |
| **After Phases 1–3** | 8.2 / 10 |
| **After Phase 4 (latest)** | **8.8 / 10** |
| **Target** | 9.5 / 10 |

### Rating breakdown (current)

| Dimension | Score | Status |
|-----------|-------|--------|
| Data import & verification | **9.0** | 7-step wizard, DB verify, batch resumes, progress bars |
| Candidate ops (ResDex admin) | **8.5** | Search restored, soft delete, profile edit, server-side source filter |
| Recruiter / client ops | **7.5** | Create, approve, suspend, archive, impersonate; no hard delete |
| Analytics & audit | **8.0** | Real Supabase data, charts, CSV export |
| Subscriptions & content | **7.5** | Plan CRUD; nav labels aligned |
| Navigation & coherence | **8.5** | Candidates in nav, routes match docs, global search |
| UX simplicity | **8.0** | Hook-based home refresh, ops inbox, no portal-hopping for candidates |
| Admin user management | **8.0** | Create admin via Auth (edge function); **deploy required** |

### What moved the score (Phase 4 — done in code)

- [x] `p_is_old_applicant` on `search_applicants` — correct pagination for Imported / Self-registered
- [x] `admin-create-user` edge function + Users UI for approved admin create
- [x] Admin home refresh without `window.location.reload()`
- [x] E2E checklist + `npm run qa:admin-flow` smoke script

### What still blocks 9.5 (admin only)

- [ ] Deploy `admin-create-user` and smoke-test create + login
- [ ] Run full manual E2E at scale ([`ADMIN_E2E_CHECKLIST.md`](./ADMIN_E2E_CHECKLIST.md))
- [ ] Admin password reset / delete user actions (UI placeholders exist)
- [ ] Recruiter hard-delete or explicit “archive only” copy everywhere
- [ ] In-app first-time admin onboarding guide
- [ ] Playwright CI for import → search → delete flow (optional but ideal for 9.5)

**Verdict:** Admin is **production-usable for daily ops** (import, search, edit, delete, recruiter onboarding). Remaining gap is mostly **deploy + external services + polish**, not broken core flows.

---

## Phase 1 — Deploy edge functions (do first)

Code exists locally; production Supabase must match.

### 1.1 New function (required for admin user create)

| Function | JWT | Purpose |
|----------|-----|---------|
| `admin-create-user` | on | Admin creates another admin (Auth + `profiles` + `admin_users` approved) |

**Deploy:**

```powershell
supabase login
supabase link --project-ref togxwenqypmxohqguscg
supabase functions deploy admin-create-user --project-ref togxwenqypmxohqguscg
```

**Test (Supabase Dashboard → Edge Functions → `admin-create-user`):**

```json
{
  "email": "test-admin@yourdomain.com",
  "password": "SecurePass123!",
  "full_name": "Test Admin",
  "phone": null
}
```

Use **Authorization: Bearer &lt;logged-in-admin-JWT&gt;** (not service role alone).

- [ ] `admin-create-user` deployed
- [ ] Test invoke returns `{ "ok": true, "user_id": "..." }`
- [ ] New admin can sign in at `/admin/auth/login`
- [ ] UI test: `/dashboard/admin/users` → Add New User → Admin

### 1.2 All other functions (21 existing + 1 new = 22)

See [`EXTERNAL_SERVICES_SETUP_CHECKLIST.md`](./EXTERNAL_SERVICES_SETUP_CHECKLIST.md) Phase 3 for the full list.

**Re-deploy all after code changes:**

```powershell
supabase functions deploy --project-ref togxwenqypmxohqguscg
```

- [ ] Confirm all functions show **Active** in Supabase Dashboard
- [ ] `SITE_URL=https://ellurenexhire.com` in Edge secrets (magic links, NVite, emails)

> **403 on deploy?** Log in with the Supabase account that **owns** project `togxwenqypmxohqguscg`, or deploy via Dashboard upload.

---

## Phase 2 — API keys & Supabase secrets

Work through [`EXTERNAL_SERVICES_SETUP_CHECKLIST.md`](./EXTERNAL_SERVICES_SETUP_CHECKLIST.md) Phase 1–2 in detail. Summary:

### 2.1 Required now (mass mail + files)

| Service | Secret / env var | Where it goes | Used for |
|---------|------------------|---------------|----------|
| **Resend** | `RESEND_API_KEY` | Edge secrets only | Welcome, NVite, job alerts, stage emails, team invites |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Edge secrets | Signed CV download (`get-cloudinary-url`) |
| **Cloudinary** | `VITE_CLOUDINARY_*` presets | Frontend `.env` + Vercel | Browser resume/image upload |
| **Supabase** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Frontend + Vercel | App auth & data |
| **Supabase** | `SUPABASE_SERVICE_ROLE_KEY` | Edge (auto) + local scripts only | Webhooks, admin scripts — **never `VITE_`** |

- [ ] Resend API key created
- [ ] Resend domain verified (see Phase 3)
- [ ] Cloudinary cloud name + API key + secret
- [ ] Unsigned upload presets: raw (resumes) + image (profiles)
- [ ] All secrets added: Supabase → Edge Functions → **Secrets**
- [ ] Frontend `.env` matches Vercel production env

**Smoke test after keys:**

```json
// send-email test body
{ "to": "you@email.com", "subject": "NexHire test", "html": "<p>OK</p>" }
```

- [ ] `send-email` delivers to inbox
- [ ] Applicant resume upload appears in Cloudinary console
- [ ] Recruiter CV download works from ResDex profile

### 2.2 Recommended now (security)

| Service | Secrets | Purpose |
|---------|---------|---------|
| **Upstash Redis** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Admin login rate limit (`check-rate-limit`) |

- [ ] Upstash database created (region near users, e.g. Mumbai)
- [ ] Secrets added; 4th wrong admin login shows rate-limit message

### 2.3 Deferred — OTP / SMS (when you are ready)

| Service | Notes |
|---------|-------|
| **MSG91** (or Twilio / AWS SNS) | Not wired in code. Supabase Auth email works today. |
| **DLT templates** | Required for India transactional SMS |
| **Supabase Auth** | Can enable phone OTP after provider is chosen |

**When adding OTP later:**

1. Choose provider → get API key
2. Add Edge secret (e.g. `MSG91_API_KEY`, `MSG91_SENDER_ID`)
3. Implement or enable: applicant login OTP, admin 2FA, recruiter invite SMS (product decision)
4. Update Supabase Auth → Phone provider settings if using Supabase-native phone auth
5. Re-test admin create, applicant register, password reset flows

- [ ] _(Later)_ SMS provider account + API key
- [ ] _(Later)_ DLT / sender ID registered
- [ ] _(Later)_ OTP flows tested end-to-end

> Admin create today uses `email_confirm: true` via service role — **no OTP required until you turn it on**.

### 2.4 Deferred — payments

| Service | Secrets | Notes |
|---------|---------|-------|
| **Razorpay** | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | `create-payment-order` / `verify-payment` return 501 without keys |

- [ ] _(Later)_ Razorpay live/test keys
- [ ] _(Later)_ Billing page full payment test

---

## Phase 3 — Domain, DNS & Vercel

### 3.1 Buy / own domain

- [ ] Domain purchased (e.g. `ellurenexhire.com`)
- [ ] Registrar login secured (2FA)

### 3.2 Connect domain to Vercel

1. Vercel → Project → **Settings** → **Domains**
2. Add `ellurenexhire.com` and `www.ellurenexhire.com`
3. At registrar, add DNS records Vercel shows (usually `A` / `CNAME`)
4. Wait for SSL (automatic on Vercel)

- [ ] Apex domain resolves with HTTPS
- [ ] `www` redirects or serves same app (pick one canonical)
- [ ] `VITE_*` env vars set on Vercel **Production** (and Preview if needed)

### 3.3 Email DNS (Resend) — same domain

At registrar (or Cloudflare), add Resend records:

- [ ] SPF TXT
- [ ] DKIM CNAME(s)
- [ ] DMARC TXT (recommended)
- [ ] Resend dashboard shows **Verified**

Sender examples:

- `NexHire <noreply@ellurenexhire.com>`
- `support@ellurenexhire.com` (optional)

### 3.4 Supabase Auth URLs

Supabase Dashboard → **Authentication** → **URL configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://ellurenexhire.com` |
| Redirect URLs | `https://ellurenexhire.com/**`, `http://localhost:8080/**` (dev) |

- [ ] Site URL updated
- [ ] All auth redirect paths whitelisted (Google OAuth, magic links, password reset)

### 3.5 Cloudinary allowed domains

Cloudinary → Settings → Security → Allowed domains:

- [ ] `ellurenexhire.com`
- [ ] `*.vercel.app` (preview deploys, optional)
- [ ] `localhost` (dev)

---

## Phase 4 — Google Search Console & Analytics

### 4.1 Google Search Console (GSC)

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: **URL prefix** `https://ellurenexhire.com` (or Domain property if using DNS verification)
3. Verify via DNS TXT **or** HTML file in `public/` (Vercel serves `public/` at root)

- [ ] Property verified
- [ ] Submit sitemap: `https://ellurenexhire.com/sitemap.xml` (create `public/sitemap.xml` if missing)
- [ ] Request indexing for home, `/features`, `/pricing`, auth landing pages
- [ ] Monitor **Coverage** and **Core Web Vitals** after launch

**Recommended `robots.txt` in `public/robots.txt`:**

```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /admin/
Sitemap: https://ellurenexhire.com/sitemap.xml
```

- [ ] `robots.txt` blocks private dashboards from crawling
- [ ] Marketing pages remain indexable

### 4.2 Google Analytics 4 (GA4)

1. [analytics.google.com](https://analytics.google.com) → Create property **Ellure NexHire**
2. Web data stream → URL `https://ellurenexhire.com`
3. Copy **Measurement ID** (`G-XXXXXXXXXX`)
4. Add to frontend (e.g. `index.html` gtag snippet or env `VITE_GA_MEASUREMENT_ID`)

- [ ] GA4 property created
- [ ] Measurement ID in Vercel env + app
- [ ] Real-time shows your visit on production
- [ ] Exclude admin/recruiter internal traffic (optional: IP filter or separate stream)

### 4.3 Optional SEO / trust

- [ ] **Google Business Profile** (if applicable for Ellure Consulting)
- [ ] **Favicon + OG images** on marketing pages (`index.html` meta tags)
- [ ] **Cookie / privacy policy** pages linked from footer (compliance)
- [ ] **Microsoft Clarity** or **Hotjar** (optional UX recording)

---

## Phase 5 — Database webhooks & cron (production emails)

Without these, transactional emails and NVite schedules **will not run automatically**.

### 5.1 Database webhooks

Supabase → Database → Webhooks → POST to `https://togxwenqypmxohqguscg.supabase.co/functions/v1/<name>`

| Table | Event | Function |
|-------|-------|----------|
| `applicants` | UPDATE (status → submitted) | `on-applicant-registered` |
| `job_applications` | INSERT | `on-application-submitted` |
| `job_applications` | UPDATE (stage) | `on-application-stage-changed` |
| `clients` | UPDATE (approved) | `on-client-approved` |
| `clients` | INSERT | `on-client-signup` |
| `messages` | INSERT | `on-message-received` |

- [ ] All 6 webhooks created and enabled

### 5.2 Cron schedules (Edge Functions)

| Function | Cron (UTC) | Purpose |
|----------|------------|---------|
| `expire-subscriptions` | `5 18 * * *` | Expiry emails |
| `reset-monthly-downloads` | `1 18 1 * *` | CV quota reset |
| `run-job-alerts` | `30 2 * * *` | Applicant job alerts |
| `run-saved-search-alerts` | `0 3 * * *` | Recruiter saved search |
| `process-scheduled-nvite` | `*/15 * * * *` | Scheduled NVites |

- [ ] All crons enabled (requires `RESEND_API_KEY` first)

---

## Phase 6 — Pre-launch smoke tests

Run in order (also in [`ADMIN_E2E_CHECKLIST.md`](./ADMIN_E2E_CHECKLIST.md) and [`EXTERNAL_SERVICES_SETUP_CHECKLIST.md`](./EXTERNAL_SERVICES_SETUP_CHECKLIST.md) Phase 7):

```bash
# Automated (set ADMIN_TEST_EMAIL + ADMIN_TEST_PASSWORD in .env)
npm run qa:admin-flow
```

| Flow | Route / action | Pass? |
|------|----------------|-------|
| Admin login | `/admin/auth/login` | [ ] |
| Admin create user | `/dashboard/admin/users` | [ ] |
| Bulk import | `/dashboard/admin/data/import` | [ ] |
| Candidate search + filters | `/dashboard/admin/applicants` | [ ] |
| Profile edit + delete | `/dashboard/admin/applicants/:id` | [ ] |
| Recruiter approve | `/dashboard/admin/recruiters` | [ ] |
| Recruiter ResDex search | `/dashboard/client/resdex` | [ ] |
| NVite send | ResDex → Send NVite | [ ] |
| Applicant register + welcome email | Public register | [ ] |

---

## Phase 7 — Next focus: Recruiter dashboard (preview)

Admin is ~**8.8/10**. Next sprint targets the **client/recruiter portal** (Naukri-style), especially **ResDex**.

Planned audit + fixes (not started — use this as sprint backlog):

| Area | Likely issues | Priority |
|------|---------------|----------|
| **ResDex search** | Filter parity with admin, saved search UX, results pagination | P0 |
| **ResDex profile** | CV download limits, contact masking per plan, notes/tags | P0 |
| **NVite** | Campaign list, scheduling, open/response tracking | P1 |
| **Jobs** | Post job, manage responses, stage pipeline | P1 |
| **Home** | Credits badge, saved searches “X new”, quick actions | P1 |
| **Billing** | Razorpay when keys added; plan upgrade modal | P2 |
| **Team** | Multi-recruiter seats, invites | P2 |
| **Mobile** | Bottom nav, filter drawer on ResDex | P2 |

**Suggested deliverable:** `docs/RECRUITER_DASHBOARD_AUDIT.md` (same format as admin audit) → Phases 1–3 implementation.

**Canonical recruiter routes:** see [`UI_CANONICAL_ROUTES.md`](./UI_CANONICAL_ROUTES.md) and [`PORTAL_RESTRUCTURE_PLAN.md`](./PORTAL_RESTRUCTURE_PLAN.md).

---

## Quick reference — where things live

| Topic | Document / path |
|-------|-----------------|
| API keys & Edge secrets (detail) | `docs/EXTERNAL_SERVICES_SETUP_CHECKLIST.md` |
| Admin E2E manual QA | `docs/ADMIN_E2E_CHECKLIST.md` |
| Bulk import for clients | `docs/CLIENT_BULK_DATA_IMPORT_GUIDE.md` |
| Admin audit & history | `docs/ADMIN_DASHBOARD_AUDIT.md` |
| Edge function source | `supabase/functions/` |
| Deploy payload example | `deploy-payloads/admin-create-user.json` |
| Smoke script | `npm run qa:admin-flow` |

---

## Checklist summary (printable)

**Infrastructure**

- [ ] Domain on Vercel + SSL
- [ ] Resend domain verified
- [ ] Supabase Auth URLs + redirects
- [ ] All Edge secrets set
- [ ] `admin-create-user` deployed
- [ ] Webhooks + crons enabled

**Analytics & SEO**

- [ ] Google Search Console verified + sitemap
- [ ] GA4 installed on production
- [ ] `robots.txt` / privacy pages

**Deferred (when ready)**

- [ ] MSG91 / SMS OTP
- [ ] Razorpay payments
- [ ] Playwright E2E CI

**Product**

- [ ] Admin E2E at scale
- [ ] Recruiter dashboard audit → ResDex fixes

---

*When Phases 1–6 are checked, the platform is launch-ready for import, search, NVite, and admin ops. OTP and payments can follow without blocking go-live.*
