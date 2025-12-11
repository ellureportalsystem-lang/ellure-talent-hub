-- ============================================================================
-- SCHEMA MIGRATION: Align Database Columns with Excel Files
-- ============================================================================
-- This script will:
-- 1. Rename existing columns to match Excel column names (normalized)
-- 2. Add missing columns from Excel
-- 3. Keep essential system columns (id, user_id, client_id, timestamps, etc.)
-- ============================================================================

-- ============================================================================
-- APPLICANTS TABLE MIGRATION
-- ============================================================================

-- Step 1: Rename existing columns to match Excel (if needed)
-- Note: Most columns already have correct names, we'll just add missing ones

-- Step 2: Add missing columns from Excel files
-- These columns match the Excel structure exactly (normalized to snake_case)

ALTER TABLE applicants ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS email_address TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS city_current_location TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS skill_job_role_applying_for TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS highest_qualification TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS medium_of_study TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS course_degree_name TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS university_institute_name TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS year_of_passing TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS work_experience TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS total_experience_numbers TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS exp_ctc TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS key_skill TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS upload_cv_any_format TEXT;

-- Step 3: Map existing columns to Excel columns (data migration)
-- We'll keep both old and new columns, then migrate data

-- Copy data from old columns to new Excel-matching columns
UPDATE applicants 
SET 
  full_name = COALESCE(full_name, name),
  mobile_number = COALESCE(mobile_number, phone),
  email_address = COALESCE(email_address, email),
  city_current_location = COALESCE(city_current_location, city),
  skill_job_role_applying_for = COALESCE(skill_job_role_applying_for, skill),
  highest_qualification = COALESCE(highest_qualification, education_level),
  medium_of_study = COALESCE(medium_of_study, medium),
  course_degree_name = COALESCE(course_degree_name, course_degree),
  university_institute_name = COALESCE(university_institute_name, university),
  year_of_passing = COALESCE(year_of_passing, CAST(passing_year AS TEXT)),
  total_experience_numbers = COALESCE(total_experience_numbers, total_experience),
  exp_ctc = COALESCE(exp_ctc, expected_ctc),
  key_skill = COALESCE(key_skill, key_skills),
  upload_cv_any_format = COALESCE(upload_cv_any_format, resume_file)
WHERE full_name IS NULL OR mobile_number IS NULL OR email_address IS NULL;

-- ============================================================================
-- PROFILES TABLE MIGRATION
-- ============================================================================

-- Add missing columns from Excel files
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city_current_location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skill TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skill_job_role_applying_for TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS communication TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS highest_qualification TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_board TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medium_of_study TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS course_degree_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS university_institute_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS year_of_passing TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_experience TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_experience_numbers TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_designation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_ctc TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS exp_ctc TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notice_period TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS key_skill TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS upload_cv_any_format TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact TEXT;

-- Copy data from existing columns to new Excel-matching columns
UPDATE profiles 
SET 
  mobile_number = COALESCE(mobile_number, phone),
  email_address = COALESCE(email_address, email),
  city_current_location = COALESCE(city_current_location, location),
  key_skill = COALESCE(key_skill, key_skills),
  upload_cv_any_format = COALESCE(upload_cv_any_format, resume_file)
WHERE mobile_number IS NULL OR email_address IS NULL;

-- ============================================================================
-- OPTIONAL: Remove old columns if you want to clean up
-- ============================================================================
-- WARNING: Only run these if you're sure you want to remove the old columns
-- Make sure data is migrated first!

-- For applicants table (uncomment if needed):
-- ALTER TABLE applicants DROP COLUMN IF EXISTS name;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS phone;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS email;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS city;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS skill;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS education_level;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS medium;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS course_degree;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS university;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS passing_year;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS total_experience;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS expected_ctc;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS key_skills;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS resume_file;

-- For profiles table (uncomment if needed):
-- ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS email;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS location;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS key_skills;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS resume_file;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check applicants table columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'applicants'
ORDER BY ordinal_position;

-- Check profiles table columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;















