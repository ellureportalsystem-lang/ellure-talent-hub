-- ============================================================================
-- CLEAN SCHEMA MIGRATION: Remove Old Columns, Use Only Excel Columns
-- ============================================================================
-- WARNING: This will remove old columns and keep only Excel-matching columns
-- Make sure to backup your database before running this!
-- ============================================================================

-- ============================================================================
-- APPLICANTS TABLE: Clean Migration
-- ============================================================================

-- Step 1: Add all Excel columns
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

-- Step 2: Migrate data from old columns to new columns
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

-- Step 3: Make new columns NOT NULL where old columns were NOT NULL
-- (Only if you want to enforce the same constraints)
-- ALTER TABLE applicants ALTER COLUMN full_name SET NOT NULL;
-- ALTER TABLE applicants ALTER COLUMN mobile_number SET NOT NULL;
-- ALTER TABLE applicants ALTER COLUMN email_address SET NOT NULL;
-- ALTER TABLE applicants ALTER COLUMN city_current_location SET NOT NULL;

-- Step 4: Remove old columns (ONLY AFTER VERIFYING DATA MIGRATION)
-- Uncomment these lines after verifying the data migration worked correctly

-- ALTER TABLE applicants DROP COLUMN IF EXISTS name;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS phone;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS email;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS city;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS skill;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS education_level;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS education_board;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS medium;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS course_degree;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS university;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS percentage;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS passing_year;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS experience_type;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS total_experience;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS expected_ctc;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS key_skills;
-- ALTER TABLE applicants DROP COLUMN IF EXISTS resume_file;

-- ============================================================================
-- PROFILES TABLE: Clean Migration
-- ============================================================================

-- Step 1: Add all Excel columns
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

-- Step 2: Migrate data from old columns to new columns
UPDATE profiles 
SET 
  mobile_number = COALESCE(mobile_number, phone),
  email_address = COALESCE(email_address, email),
  city_current_location = COALESCE(city_current_location, location),
  key_skill = COALESCE(key_skill, key_skills),
  upload_cv_any_format = COALESCE(upload_cv_any_format, resume_file)
WHERE mobile_number IS NULL OR email_address IS NULL;

-- Step 3: Remove old columns (ONLY AFTER VERIFYING DATA MIGRATION)
-- Uncomment these lines after verifying the data migration worked correctly

-- ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS email;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS location;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS key_skills;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS resume_file;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify applicants table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
ORDER BY ordinal_position;

-- Verify profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check data migration
SELECT 
  COUNT(*) as total_applicants,
  COUNT(full_name) as has_full_name,
  COUNT(mobile_number) as has_mobile_number,
  COUNT(email_address) as has_email_address
FROM applicants;

SELECT 
  COUNT(*) as total_profiles,
  COUNT(mobile_number) as has_mobile_number,
  COUNT(email_address) as has_email_address
FROM profiles;















