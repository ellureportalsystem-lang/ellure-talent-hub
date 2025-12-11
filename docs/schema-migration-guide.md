# Schema Migration Guide

## Overview
This guide explains how to migrate your database schema to match Excel file columns exactly.

## Files Created

1. **`scripts/generateSchemaMigration.sql`** - Safe migration (keeps both old and new columns)
2. **`scripts/generateCleanSchemaMigration.sql`** - Clean migration (removes old columns after migration)

## Excel Columns Found

Based on the analysis, these are the Excel columns that need to be in the database:

### Standard Columns (22 columns in most files):
- Date
- Full Name
- Mobile Number
- Email Address
- City / Current Location
- Skill / Job Role Applying For
- Communication
- Highest Qualification
- Education Board
- Medium of Study
- Course / Degree Name
- University / Institute Name
- Year of Passing
- Work Experience
- Total Experience(Numbers)
- Current Company
- Current Designation
- Current CTC
- Exp CTC
- Notice Period
- Key Skill
- Upload CV any format

### Alternative Columns (in some files like Graphic Designer.xlsx):
- Skill
- Name
- Contact
- Email
- Experience
- Education
- Location

## Migration Strategy

### Option 1: Safe Migration (Recommended First)
This keeps both old and new columns, allowing you to verify data migration before removing old columns.

**Steps:**
1. Go to Supabase SQL Editor
2. Copy and run: `scripts/generateSchemaMigration.sql`
3. Verify data migration worked
4. Then optionally remove old columns

### Option 2: Clean Migration
This migrates data and removes old columns in one go.

**Steps:**
1. **BACKUP YOUR DATABASE FIRST!**
2. Go to Supabase SQL Editor
3. Copy and run: `scripts/generateCleanSchemaMigration.sql`
4. Verify the migration

## Column Name Normalization

Excel column names are normalized to database-friendly names:
- Spaces → underscores
- Special characters removed
- Lowercase
- Examples:
  - "Full Name" → `full_name`
  - "City / Current Location" → `city_current_location`
  - "Skill / Job Role Applying For" → `skill_job_role_applying_for`

## Data Migration

The migration scripts will:
1. Add new columns matching Excel structure
2. Copy data from old columns to new columns
3. Use `COALESCE` to preserve existing data
4. Optionally remove old columns (if using clean migration)

## Important Notes

### Columns That Will Be Kept (System Columns)
These columns are essential and will NOT be removed:
- `id` (UUID primary key)
- `user_id` (links to profiles)
- `client_id` (links to clients)
- `created_at`, `updated_at` (timestamps)
- `is_deleted`, `deleted_at` (soft delete)
- `status`, `verified`, `otp_verified` (application status)
- `profile_complete_percent` (completion tracking)

### Columns That Will Be Migrated
Old column → New Excel column:
- `name` → `full_name`
- `phone` → `mobile_number`
- `email` → `email_address`
- `city` → `city_current_location`
- `skill` → `skill_job_role_applying_for`
- `education_level` → `highest_qualification`
- `medium` → `medium_of_study`
- `course_degree` → `course_degree_name`
- `university` → `university_institute_name`
- `passing_year` → `year_of_passing` (converted to TEXT)
- `total_experience` → `total_experience_numbers`
- `expected_ctc` → `exp_ctc`
- `key_skills` → `key_skill`
- `resume_file` → `upload_cv_any_format`

## Verification Steps

After running the migration:

1. **Check Column Count:**
   ```sql
   SELECT COUNT(*) FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = 'applicants';
   ```

2. **Verify Data Migration:**
   ```sql
   SELECT 
     COUNT(*) as total,
     COUNT(full_name) as has_full_name,
     COUNT(mobile_number) as has_mobile_number,
     COUNT(email_address) as has_email_address
   FROM applicants;
   ```

3. **Check for Null Values:**
   ```sql
   SELECT 
     COUNT(*) FILTER (WHERE full_name IS NULL) as null_full_name,
     COUNT(*) FILTER (WHERE mobile_number IS NULL) as null_mobile,
     COUNT(*) FILTER (WHERE email_address IS NULL) as null_email
   FROM applicants;
   ```

## Rollback Plan

If something goes wrong:

1. **If you used Safe Migration:**
   - Old columns still exist
   - Just don't remove them
   - Update your import script to use old column names

2. **If you used Clean Migration:**
   - Restore from backup
   - Or re-add old columns and copy data back

## After Migration

1. Update the import script column mapping to use new column names
2. Test import with a small Excel file first
3. Verify data appears correctly in the UI
4. Update TypeScript types if needed

## Next Steps

After successful migration:
1. Run `npm run data:import` to import Excel data
2. Verify data in Supabase dashboard
3. Check that profiles and applicants are linked correctly
4. Test viewing data in the UI

---

**⚠️ WARNING:** Always backup your database before running migration scripts!















