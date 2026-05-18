# Marketing website lock (public site only)

## What is protected

These paths define the **public marketing website** (not dashboards):

- `src/pages/Landing.tsx`, `About.tsx`, `Features.tsx`, `Services.tsx`, `Industries.tsx`, `Contact.tsx`, `FAQ.tsx`, `Privacy.tsx`, `Terms.tsx`
- `src/components/layout/Navbar.tsx`, `Footer.tsx`
- `src/components/marketing/**`
- `src/components/FAQPreview.tsx`
- Hero sizing in `src/index.css` → `.marketing-landing-hero` (fixed heights, not full viewport)

**Do not change** `src/pages/dashboard/**`, `AdminDashboard.tsx`, `ClientDashboard.tsx`, `ApplicantPortal.tsx`, or dashboard services unless the task is explicitly about dashboards.

## Why the site kept changing

1. **AI / agent sessions** edited marketing files during “enterprise” or “slice” tasks without a clear boundary from dashboards.
2. **One-off patch scripts** in `scripts/_archive_DO_NOT_RUN/` (formerly `fix-landing.mjs`, `patch-landing.mjs`, etc.) rewrote `Landing.tsx` and sometimes corrupted JSX (e.g. wrong `</motion.div>` closers).
3. **Uncommitted local edits** were mixed with restores, so the browser showed different versions after each fix.

Patch scripts are **archived** so they are not run again by mistake.

## Before you change the marketing site

1. Run `npm run build` after edits.
2. Hard refresh the browser (Ctrl+Shift+R).
3. Do **not** run anything under `scripts/_archive_DO_NOT_RUN/`.

## Verify before push

```powershell
.\scripts\verify-marketing-lock.ps1
.\scripts\pre-push-check.ps1
npm run build
```

## Homepage hero height (intentional)

Current locked heights in `src/index.css` (`.marketing-landing-hero`):

- Mobile: `480px`
- `640px+`: `520px`
- `1024px+`: `560px`

Do not revert to `min(88svh, 640px)` without product approval — that made the banner too tall.

Homepage headlines use `.marketing-landing-hero-title` with per-slide `titleLine1` / `titleLine2` / `titleLine2Gold` in `Landing.tsx`. Do not reuse that class on inner pages.

## Inner page hero height (intentional)

`.marketing-page-hero` uses `calc(... - 5.5cm)` from the previous min-heights. Text is vertically centered via flex on the section and `.marketing-page-hero-inner`.

Do not use full-page screenshots as banner JPGs (they duplicate navbar and headline text).
