# Cursor prompt — apply reference UI/UX to Ellure portals (use in ellure-talent-hub)

Use **after** `docs/PORTAL_UIUX_REFERENCE_EXPORT.md` exists (pasted from the other project).

---

## START — paste from here

Read **`docs/PORTAL_UIUX_REFERENCE_EXPORT.md`** in full. Apply its **visual and layout patterns only** to Ellure NexHire’s three authenticated portals:

- **Admin** — `src/pages/dashboard/AdminDashboard.tsx` and `src/pages/dashboard/admin/**`
- **Client** — `src/pages/dashboard/ClientDashboard.tsx` and `src/pages/dashboard/client/**`
- **Applicant** — `src/pages/dashboard/ApplicantPortal.tsx`, `ApplicantDashboard.tsx`, `src/pages/dashboard/applicant/**`

Shared shell: `src/components/portal/PortalDashboardLayout.tsx`, `portalStyles.ts`, `src/index.css` (portal section only).

### Hard rules

1. **Do not edit** marketing website files (`Landing`, `About`, `Navbar`, `Footer`, `components/marketing/**`). Run `scripts/verify-marketing-lock.ps1` before finishing.
2. **Do not add** features from the reference app (no new routes, APIs, or product flows).
3. **Do not break** canonical routes in `docs/UI_CANONICAL_ROUTES.md`.
4. **Do** align: responsive layouts (mobile / tablet / desktop), cards, tables→cards on mobile, filters, messaging UI chrome, charts styling, typography scale, spacing, nav active states, empty/loading states.
5. **Preserve** Ellure brand: primary blue + teal secondary; adjust only where the reference doc improves consistency (document any token changes in commit message).
6. Run `npm run build` and fix lint errors in touched files.

### Breakpoint targets

| Breakpoint | Admin | Client | Applicant |
|------------|-------|--------|-----------|
| Mobile | Bottom nav + overflow menu; card lists; sticky actions | Same pattern | Home hero + quick actions; job cards |
| Tablet | Collapsible sidebar; 2-col filters + results | Same | 2-col where useful |
| Desktop | Full sidebar; dense tables with inline filters | Same | Sidebar + 2-col home |

### Deliverables

1. Implemented UI across the three portals per the reference doc §9 mapping.
2. Short update to `docs/UI_CANONICAL_ROUTES.md` only if nav labels/paths unchanged but layout notes added (optional subsection “Responsive layout notes”).
3. Summary comment in chat: files changed, what was borrowed vs skipped, marketing verification result.

## END
