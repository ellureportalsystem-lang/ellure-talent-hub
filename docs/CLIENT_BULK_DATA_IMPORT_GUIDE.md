# Ellure NexHire — Client Data Import Guide

Use this document when preparing **legacy applicant data** (Excel sheets + resume files) for upload into Ellure NexHire. Share it with your data team so every batch is formatted consistently before admin upload.

---

## Overview — two ways applicant data enters the system

| Source | How it enters | Recruiter visibility | Applicant login |
|--------|---------------|----------------------|-----------------|
| **Bulk import (legacy Excel)** | Admin uploads formatted Excel via Admin Dashboard | Immediately searchable in ResDex after import | Applicant can **register later with the same email** and their imported profile is linked automatically |
| **Self-registration (new)** | Applicant signs up on the portal | Searchable after profile completion | Full login from day one |

Both sources live in the **same `applicants` database**. Recruiters see one unified candidate pool in ResDex.

---

## Recommended workflow (in order)

```
1. Download Excel template
2. Client formats all legacy rows into template columns
3. Split into batches (5,000–10,000 rows per file recommended)
4. Admin: Import Excel batches (review → validate → import)
5. Admin: Bulk upload resumes (name files to match applicants)
6. Recruiters verify samples in ResDex
7. (Optional) Invite applicants to register and claim their profile
```

---

## Step 1 — Excel template

### Download options

- **Admin Dashboard:** `Admin → Data → Import candidates → Download template`
- **Static file:** `/templates/ellure_candidate_import_template.xlsx` (same format)

The template has two sheets:

1. **Candidates** — one row per applicant (headers + one sample row)
2. **Field guide** — column definitions, required flags, examples

### Required columns (must be present in every row)

| Column | Rules | Example |
|--------|-------|---------|
| `name` | Full name, no special characters only | `Rajesh Kumar` |
| `email` | Valid, unique per person (lowercase preferred) | `rajesh.kumar@example.com` |
| `phone` | 10-digit Indian mobile | `9876543210` |

### Optional columns (strongly recommended for ResDex quality)

| Column | Accepted values / format | Example |
|--------|--------------------------|---------|
| `city` | Current location | `Mumbai` |
| `job_role` | Role applying for | `Software Engineer` |
| `current_designation` | Current job title | `Senior Developer` |
| `current_company` | Employer name | `Infosys` |
| `total_experience_years` | Number or "Fresher" | `4` |
| `experience_type` | Fresher, Junior, Mid-Level, Senior | `Mid-Level` |
| `current_ctc` | LPA number or text | `8` or `8 LPA` |
| `expected_ctc` | LPA number or text | `12` |
| `notice_period` | Immediate, 15 Days, 30 Days, 45 Days, 60 Days, 90 Days | `30 Days` |
| `education_level` | Graduate, Post Graduate, Diploma, 12th, 10th | `Graduate` |
| `highest_qualification` | Degree short name | `B.Tech` |
| `course_degree_name` | Full course name | `B.Tech Computer Science` |
| `university_institute_name` | College / university | `Mumbai University` |
| `year_of_passing` | 4-digit year | `2019` |
| `education_board` | Board name (if applicable) | `CBSE` |
| `medium_of_study` | English, Hindi, etc. | `English` |
| `key_skills` | Comma-separated | `Java, Spring, SQL` |
| `communication` | Excellent, Good, Average, Below Average | `Good` |
| `gender` | Male, Female, Other | `Male` |
| `headline` | Short professional summary | `Java developer with 4 yrs exp` |
| `status` | submitted, under_review, shortlisted, rejected, hired, on_hold | `submitted` |
| `registration_date` | YYYY-MM-DD | `2023-06-15` |

### Data quality rules

- **One row = one candidate.** Do not merge multiple people in one cell.
- **Email must be unique** within each file and across the database (duplicates are skipped unless admin chooses overwrite).
- **Phone:** digits only; leading `0` or `+91` is auto-stripped.
- **Empty optional fields** are fine — they import as blank/null.
- **Do not put resume file paths in Excel** — resumes are uploaded separately (Step 3).
- **Header names:** use exact template headers, or common aliases (`Full Name`, `Mobile`, `Skills`, etc.) — the system auto-maps them.

### Batch sizing for large datasets (lakhs of rows)

| Batch size | Why |
|------------|-----|
| **5,000–10,000 rows per file** | Stable upload, easier error review |
| **Max 50 MB per file** | Platform limit |
| **One sheet only** | Only the first worksheet is read |

After each batch import, download the **error report** if any rows failed, fix those rows, and re-upload as a small correction file.

---

## Step 2 — Admin Excel import (Admin Dashboard)

**Path:** `/dashboard/admin/data/import`

| Step | What happens |
|------|--------------|
| 1. Template | Download template / read field guide |
| 2. Upload & map | Drop `.xlsx` or `.xls`; columns auto-detected; manual override if needed |
| 3. Validate | Every row checked — errors (red), warnings (amber), valid (green) |
| 4. Import | Rows written to database; progress bar; summary + error export |

### Import options

- **Skip rows with errors** — recommended for first pass; fix errors and re-import later.
- **Overwrite duplicates** — when email already exists, update that applicant instead of skipping.

### What gets created on import

- A full **applicant record** in the database (visible to recruiters in ResDex).
- Flag `is_old_applicant = true` (marks legacy import vs self-registration).
- **No login account yet** — `user_id` is empty until the person registers.

Imported applicants **do not need to log in** for recruiters to search, view profiles, download CVs, shortlist, or send NVites.

---

## Step 3 — Bulk resume upload

**Path:** `/dashboard/admin/data/bulk-resumes`

Resumes are uploaded **after** Excel import, in a separate step.

### File rules

- Formats: **PDF, DOC, DOCX**
- Max **15 MB** per file
- Upload hundreds or thousands at once

### How resumes are matched to applicants

The system matches each **file name** (without extension) to an applicant already in the database.

**Best naming conventions (pick one and use consistently):**

| Priority | File name pattern | Example |
|----------|-------------------|---------|
| 1 (best) | Full email as file name | `rajesh.kumar@example.com.pdf` |
| 2 | Full name exactly as in Excel | `Rajesh Kumar.pdf` |
| 3 | Email local-part (only if unique) | `rajesh.kumar.pdf` |
| 4 | 10-digit phone (only if unique) | `9876543210.pdf` |

**Avoid:**

- Generic names: `resume.pdf`, `CV1.pdf`
- First name only when many people share it: `Rajesh.pdf` → **ambiguous match error**
- Special characters that don't match Excel name

### Admin bulk upload steps

1. Click **Load applicants from database** (builds match index).
2. Choose match mode: **Auto** (recommended), **Name only**, or **Email only**.
3. Select or drag resume files.
4. Review match results — green = uploaded, red = no match or ambiguous.
5. Fix failed file names and re-upload only the failures.

After upload, `resume_file` is stored on the applicant record. Recruiters can preview and download CVs from ResDex.

---

## Step 4 — Applicant login & profile (after import)

### Can imported applicants log in?

**Yes — when they self-register** using the **same email** as in the Excel import:

1. They go to the applicant portal and create an account.
2. The system **links their login to the existing imported record** (no duplicate profile).
3. They see their imported data and can update skills, experience, upload a new resume, etc.

They do **not** get an automatic password email on import. Options:

- Ask them to register normally on the portal (recommended).
- Admin can run a one-time auth creation script for bulk invites (internal ops — contact your Ellure team).

### New applicants (not imported)

Candidates who register fresh on the portal create a new record with `is_old_applicant = false`. Both old and new appear together in ResDex.

---

## Step 5 — Recruiter verification checklist

After import + resume upload, verify on the recruiter dashboard:

- [ ] Search by skill / city / experience returns imported candidates
- [ ] Candidate profile shows correct Excel fields
- [ ] CV opens/downloads when resume was bulk-uploaded
- [ ] Keyword highlighting works on search results
- [ ] Shortlist / NVite actions work on imported profiles

---

## Common issues & fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Row failed: invalid email | Typo or missing `@` | Correct email in Excel, re-import row |
| Row skipped: duplicate email | Already in database | Use overwrite option or skip intentionally |
| Resume: no match | File name doesn't match name/email | Rename file to full email or full name |
| Resume: ambiguous | Multiple applicants with same first name | Use email as file name |
| Applicant can't see imported data after signup | Registered with different email | Must use same email as Excel row |
| Recruiter can't find candidate | Import failed or search index pending | Re-import row; refresh ResDex search |

---

## Quick reference — admin URLs

| Task | URL |
|------|-----|
| Import Excel | `/dashboard/admin/data/import` |
| Bulk resumes | `/dashboard/admin/data/bulk-resumes` |
| Template download | `/templates/ellure_candidate_import_template.xlsx` |

---

## Support checklist for your data team

Before sending files to admin:

1. [ ] All files use the official template headers
2. [ ] Every row has name, email, phone
3. [ ] Emails are unique and valid
4. [ ] Files split into batches under 10,000 rows
5. [ ] Resume files named with email or full name matching Excel
6. [ ] Sample batch (100 rows) tested end-to-end before full migration
