# NexHire — External Services Setup Checklist

> **Project:** Ellure NexHire Talent Hub  
> **Supabase project ref:** `togxwenqypmxohqguscg`  
> **Production URL:** `https://ellurenexhire.com`  
> **Last updated:** June 2026

Use this document as your step-by-step runbook. Work through each phase in order. Check off items as you complete them.

---

## Quick status (codebase)

| Area | Status |
|------|--------|
| Edge functions (21 total) | **Deployed** to Supabase |
| Database migration (NVite, notes, tags) | **Applied** |
| Frontend wiring (NVite, CV download, rate limit, etc.) | **Done** |
| Payment gateway (Razorpay) | **Deferred** — stubs return 501 |
| MSG91 SMS | **Not wired** — optional later |

---

## Phase 1 — Gather API keys & accounts

### 1.1 Supabase (already have)

| Item | Value / where |
|------|----------------|
| Project URL | `https://togxwenqypmxohqguscg.supabase.co` |
| Anon key | Supabase Dashboard → Settings → API → `anon` / publishable key |
| Service role key | Same page — **never put in frontend** |
| Dashboard | [supabase.com/dashboard](https://supabase.com/dashboard) |

- [ ] Confirm you can log into the Supabase project that owns `togxwenqypmxohqguscg`

> **REMINDER:** The service role key bypasses RLS. It belongs only in Edge Function secrets and server-side tools — never in `.env` with a `VITE_` prefix.

---

### 1.2 Resend (email) — **REQUIRED NOW**

You said you have the Resend API key. Complete these steps:

| What to gather | Where |
|----------------|-------|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) → Create API key |

**Resend domain setup (do before production volume):**

1. Resend Dashboard → **Domains** → Add `ellurenexhire.com`
2. Add DNS records (SPF, DKIM, optional DMARC) at your domain registrar
3. Wait for verification (usually minutes to a few hours)
4. Confirm sender: `NexHire <noreply@ellurenexhire.com>`

- [ ] `RESEND_API_KEY` copied
- [ ] Domain `ellurenexhire.com` verified in Resend
- [ ] Test email sent from Resend dashboard to your inbox

> **REMINDER:** Until the domain is verified, Resend may only send to your own verified email addresses. Verify the domain before testing NVite mass mail to real candidates.

**Emails powered by Resend in this platform:**

- Welcome email (applicant registered)
- Application submitted / stage changed
- Recruiter account approved
- NVite mass mail + campaign tracking
- Subscription expiry reminders
- Job alerts
- Team invite emails

---

### 1.3 Cloudinary (file storage) — **REQUIRED NOW**

We use Cloudinary for **all** resume and profile image storage. Supabase Storage buckets are **not** used.

| What to gather | Where to store |
|----------------|----------------|
| Cloud name | Frontend `.env` + Edge secret |
| API Key | Edge secret only |
| API Secret | Edge secret only |
| Upload preset (raw / resumes) | Frontend `.env` |
| Upload preset (images) | Frontend `.env` |

**Cloudinary setup steps:**

1. [cloudinary.com/console](https://cloudinary.com/console) → note **Cloud name**
2. Settings → **Upload** → Create unsigned presets:
   - `ellure_resumes_raw` — Resource type: **Raw**, Signing: **Unsigned**
   - `ellure_profile_image` — Resource type: **Image**, Signing: **Unsigned**
3. Settings → **Security** → Allowed fetch/delivery domains:
   - `ellurenexhire.com`
   - `localhost` (for dev)
4. Settings → **API Keys** → copy Key + Secret

- [ ] Cloud name noted
- [ ] Raw upload preset created (unsigned)
- [ ] Image upload preset created (unsigned)
- [ ] API Key + Secret copied
- [ ] Domain allowlist configured

> **REMINDER:** Upload presets go in the **frontend** `.env` (they are designed to be public with unsigned uploads). API **Secret** must **only** live in Supabase Edge Function secrets — used by `get-cloudinary-url` for signed CV downloads.

---

### 1.4 Upstash Redis (admin login rate limit) — **RECOMMENDED**

Without this, admin login rate limiting is disabled (fallback: allow all attempts).

| What to gather | Where |
|----------------|-------|
| `UPSTASH_REDIS_REST_URL` | [console.upstash.com](https://console.upstash.com) → Redis → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Same page |

- [ ] Upstash account created
- [ ] Redis database created (region: closest to Mumbai / your users)
- [ ] REST URL + token copied

> **REMINDER:** After adding Upstash secrets, test admin login 4+ times with wrong password — the 4th attempt should show "Too many attempts. Try again in X minutes."

---

### 1.5 Razorpay (payments) — **LATER**

Skipped for now. When ready:

| Secret name | Purpose |
|-------------|---------|
| `RAZORPAY_KEY_ID` | Frontend checkout |
| `RAZORPAY_KEY_SECRET` | `verify-payment` signature check |

- [ ] _(Deferred)_ Create Razorpay account
- [ ] _(Deferred)_ Add live/test keys to Edge secrets

---

### 1.6 MSG91 (SMS / OTP) — **LATER**

Not wired in code yet. Supabase Auth handles email OTP today. Add MSG91 when you want SMS OTP or transactional SMS.

- [ ] _(Deferred)_ MSG91 account + API key
- [ ] _(Deferred)_ DLT template registration (India)

---

## Phase 2 — Configure environment variables

### 2.1 Frontend `.env` (browser-safe only)

Copy from `.env.example` and fill in:

```env
# Supabase
VITE_SUPABASE_URL=https://togxwenqypmxohqguscg.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>

# Cloudinary (uploads from browser)
VITE_CLOUDINARY_CLOUD_NAME=<cloud name>
VITE_CLOUDINARY_UPLOAD_PRESET=<generic preset, optional>
VITE_CLOUDINARY_UPLOAD_PRESET_RAW=<raw/resume preset name>
VITE_CLOUDINARY_UPLOAD_PRESET_IMAGE=<profile image preset name>
```

- [ ] `.env` updated locally
- [ ] Production hosting (Vercel/Netlify/etc.) env vars set to match
- [ ] Restart dev server after changes

> **REMINDER:** Never add `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or `RESEND_API_KEY` to frontend env vars.

---

### 2.2 Supabase Edge Function secrets

**Dashboard path:** Project → Edge Functions → **Secrets**

Add each secret (name must match exactly):

```text
RESEND_API_KEY=re_xxxxxxxx
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret
SITE_URL=https://ellurenexhire.com

# Optional but recommended:
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxx

# Later (payments):
# RAZORPAY_KEY_ID=rzp_live_xxx
# RAZORPAY_KEY_SECRET=xxx
```

Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are usually injected automatically for Edge Functions.

- [ ] All required secrets added in Supabase Dashboard
- [ ] Secrets saved (re-deploy not required after secret-only changes)

> **REMINDER:** After adding `RESEND_API_KEY`, invoke a test from Supabase Dashboard → Edge Functions → `send-email` → Test with body:
> ```json
> { "to": "your@email.com", "subject": "NexHire test", "html": "<p>It works!</p>" }
> ```

---

## Phase 3 — Edge functions (deployed)

All 21 functions are **live** on project `togxwenqypmxohqguscg`:

| Function | JWT | Purpose |
|----------|-----|---------|
| `send-email` | off | Generic Resend email sender |
| `send-nvite` | on | Mass mail / NVite campaigns |
| `track-nvite-open` | off | Email open tracking pixel |
| `nvite-response` | off | Candidate respond API |
| `get-cloudinary-url` | on | Signed CV download URLs |
| `check-rate-limit` | off | Admin login rate limit |
| `impersonate-recruiter` | on | Admin → recruiter magic link |
| `on-applicant-registered` | off | Welcome email + notification |
| `on-application-submitted` | off | Application confirmation |
| `on-application-stage-changed` | off | Stage update emails |
| `on-client-approved` | off | Recruiter approval email |
| `on-client-signup` | off | Notify admins of new signup |
| `on-message-received` | off | New message email |
| `expire-subscriptions` | off | Daily expiry + emails |
| `reset-monthly-downloads` | off | Monthly CV counter reset |
| `run-job-alerts` | off | Applicant job alert emails |
| `run-saved-search-alerts` | off | Recruiter saved search alerts |
| `process-scheduled-nvite` | off | Send scheduled NVites |
| `create-payment-order` | on | Razorpay order (deferred) |
| `verify-payment` | on | Razorpay verify (deferred) |
| `generate-invoice` | on | Invoice generation |

- [x] Functions deployed
- [ ] Smoke-test critical functions (see Phase 6)

**Re-deploy locally (if you change function code):**

```powershell
supabase login
supabase link --project-ref togxwenqypmxohqguscg
supabase functions deploy --project-ref togxwenqypmxohqguscg
```

> **REMINDER:** If CLI returns **403**, your local Supabase login is on a different account than the project owner. Use the account that owns `togxwenqypmxohqguscg`, or deploy via Supabase Dashboard → Edge Functions → Deploy.

---

## Phase 4 — Database webhooks

**Dashboard path:** Database → Webhooks → Create webhook

Each webhook POSTs to:  
`https://togxwenqypmxohqguscg.supabase.co/functions/v1/<function-name>`

Use the **service role** key in the webhook Authorization header, or configure as Supabase recommends for Database Webhooks.

| Table | Event | Filter (optional) | Edge function |
|-------|-------|-------------------|---------------|
| `applicants` | UPDATE | `status` changed to `submitted` | `on-applicant-registered` |
| `job_applications` | INSERT | — | `on-application-submitted` |
| `job_applications` | UPDATE | `current_stage` changed | `on-application-stage-changed` |
| `clients` | UPDATE | `is_active` false → true | `on-client-approved` |
| `clients` | INSERT | — | `on-client-signup` |
| `messages` | INSERT | — | `on-message-received` |

- [ ] Webhook: applicant registered
- [ ] Webhook: application submitted
- [ ] Webhook: application stage changed
- [ ] Webhook: client approved
- [ ] Webhook: client signup
- [ ] Webhook: message received

> **REMINDER:** Webhooks won't fire until they're created. If welcome emails aren't sending after registration, this is the #1 thing to check.

---

## Phase 5 — Cron schedules

**Dashboard path:** Edge Functions → select function → **Schedules** (or Project → Integrations → Cron)

All times below are **UTC**. IST = UTC + 5:30.

| Function | Cron (UTC) | IST equivalent | Purpose |
|----------|------------|----------------|---------|
| `expire-subscriptions` | `5 18 * * *` | ~11:35 PM IST daily | Expire subs + email |
| `reset-monthly-downloads` | `1 18 1 * *` | ~11:31 PM IST on 1st | Reset CV download counters |
| `run-job-alerts` | `30 2 * * *` | ~8:00 AM IST daily | Applicant job alerts |
| `run-saved-search-alerts` | `0 3 * * *` | ~8:30 AM IST daily | Recruiter search alerts |
| `process-scheduled-nvite` | `*/15 * * * *` | Every 15 min | Send scheduled NVites |

- [ ] Cron: expire-subscriptions
- [ ] Cron: reset-monthly-downloads
- [ ] Cron: run-job-alerts
- [ ] Cron: run-saved-search-alerts
- [ ] Cron: process-scheduled-nvite

> **REMINDER:** Cron jobs need `RESEND_API_KEY` in secrets to send emails. Set secrets before enabling crons.

---

## Phase 6 — Plan & feature configuration

### 6.1 Enable NVite on subscription plans

NVite is gated by `subscription_plans.features.can_send_nvite`.

**Dashboard:** Table Editor → `subscription_plans` → edit `features` JSON:

```json
{
  "can_send_nvite": true,
  "can_boolean_search": true,
  "can_radius_search": false
}
```

Or use: **Admin dashboard** → `/dashboard/admin/subscriptions`

- [ ] At least one paid plan has `can_send_nvite: true`
- [ ] Test recruiter on that plan can send NVite

> **REMINDER:** If Send NVite shows "Upgrade your plan", the recruiter's `subscription_plan` name must match a row in `subscription_plans` with `can_send_nvite: true`.

### 6.2 Seed subscription plans (if empty)

- [ ] `subscription_plans` table has rows: free, basic, professional, enterprise
- [ ] Each plan has sensible `max_cv_downloads`, `max_job_postings`, `max_saved_searches`

---

## Phase 7 — Smoke tests (do in order)

### 7.1 Email

- [ ] Edge function `send-email` test → email received
- [ ] Register test applicant → welcome email (needs webhook)
- [ ] Send test NVite to yourself from ResDex

### 7.2 Cloudinary

- [ ] Applicant uploads resume during registration → file appears in Cloudinary Media Library under `ellure/applicants/...`
- [ ] Recruiter downloads CV from ResDex profile → file downloads, contact unlocks

### 7.3 NVite flow

- [ ] Select candidates in ResDex → Send NVite → campaign appears at `/dashboard/client/nvite/campaigns`
- [ ] Open email → tracking pixel fires (`track-nvite-open`)
- [ ] Click respond link → `/respond?token=...` loads and submits

### 7.4 Admin

- [ ] Admin login rate limit blocks after 3 failed attempts (needs Upstash)
- [ ] Admin → Recruiters → detail → "Login as Recruiter" opens magic link
- [ ] Subscription plans CRUD at `/dashboard/admin/subscriptions`

### 7.5 Recruiter tools

- [ ] Notes & Tags tab on candidate profile saves and persists
- [ ] Saved search shows "X new" count on home page
- [ ] CV download limit modal appears when quota exceeded

---

## Phase 8 — Production launch checklist

- [ ] Resend domain verified on production domain
- [ ] All frontend env vars set on hosting provider
- [ ] All Edge Function secrets set
- [ ] Database webhooks active
- [ ] Cron schedules active
- [ ] `SITE_URL=https://ellurenexhire.com` in Edge secrets
- [ ] SSL / HTTPS on production
- [ ] Test full flow: signup → profile → search → NVite → respond

---

## What's still deferred (tell the team)

| Item | Notes |
|------|-------|
| **Razorpay payments** | Functions deployed but return 501 without keys. Billing UI exists; gateway not live. |
| **MSG91 SMS** | Not integrated. Email OTP via Supabase Auth works today. |
| **Supabase Storage** | Intentionally not used. All files → Cloudinary. |
| **ResDex "Save search" button** | Save/delete on home page works; inline button on results page can be added. |
| **EnterpriseApplicantProfile admin notes** | Admin sidebar still has placeholder; client mode has live notes/tags. |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Emails not sending | Missing `RESEND_API_KEY` or domain not verified | Add secret; verify domain in Resend |
| NVite "Upgrade plan" | Plan missing `can_send_nvite` | Update `subscription_plans.features` |
| CV download fails | Missing Cloudinary secrets | Add all 3 Cloudinary secrets to Edge |
| Welcome email never arrives | Webhook not configured | Add `on-applicant-registered` webhook |
| Admin login not rate-limited | Upstash not configured | Add Upstash secrets (optional) |
| Edge function 401 | JWT verify on when calling without auth | Use anon key + user JWT, or call public functions without JWT |

---

## Reference links

- Supabase project: `https://supabase.com/dashboard/project/togxwenqypmxohqguscg`
- Resend: [resend.com](https://resend.com)
- Cloudinary: [cloudinary.com/console](https://cloudinary.com/console)
- Upstash: [console.upstash.com](https://console.upstash.com)
- Edge function source: `supabase/functions/` in this repo
- Migration: `supabase/migrations/010_external_services_integration.sql`

---

*Check off items as you go. When all Phase 1–7 boxes are checked, the platform external integrations are production-ready (except payments/SMS).*
