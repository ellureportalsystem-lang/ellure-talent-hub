-- ============================================================================
-- REMOVE OLD COLUMNS (Run after data import is successful)
-- ============================================================================
-- WARNING: Only run this AFTER you've imported Excel data and verified it works!
-- This will remove the old column names and keep only Excel-matching columns
-- ============================================================================

-- ============================================================================
-- APPLICANTS TABLE: Remove old columns
-- ============================================================================

-- Remove old columns that have been replaced by Excel-matching columns
ALTER TABLE applicants DROP COLUMN IF EXISTS name;
ALTER TABLE applicants DROP COLUMN IF EXISTS phone;
ALTER TABLE applicants DROP COLUMN IF EXISTS email;
ALTER TABLE applicants DROP COLUMN IF EXISTS city;
ALTER TABLE applicants DROP COLUMN IF EXISTS skill;
ALTER TABLE applicants DROP COLUMN IF EXISTS education_level;
ALTER TABLE applicants DROP COLUMN IF EXISTS education_board;
ALTER TABLE applicants DROP COLUMN IF EXISTS medium;
ALTER TABLE applicants DROP COLUMN IF EXISTS course_degree;
ALTER TABLE applicants DROP COLUMN IF EXISTS university;
ALTER TABLE applicants DROP COLUMN IF EXISTS percentage;
ALTER TABLE applicants DROP COLUMN IF EXISTS passing_year;
ALTER TABLE applicants DROP COLUMN IF EXISTS experience_type;
ALTER TABLE applicants DROP COLUMN IF EXISTS total_experience;
ALTER TABLE applicants DROP COLUMN IF EXISTS expected_ctc;
ALTER TABLE applicants DROP COLUMN IF EXISTS key_skills;
ALTER TABLE applicants DROP COLUMN IF EXISTS resume_file;

-- Note: We keep these old columns because they don't have direct Excel equivalents:
-- - job_role (might be useful)
-- - availability (might be useful)
-- - profile_image (might be useful)
-- - All system columns (id, user_id, client_id, timestamps, status, etc.)

-- ============================================================================
-- PROFILES TABLE: Remove old columns
-- ============================================================================

-- Remove old columns that have been replaced by Excel-matching columns
ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS email;
ALTER TABLE profiles DROP COLUMN IF EXISTS location;
ALTER TABLE profiles DROP COLUMN IF EXISTS key_skills;
ALTER TABLE profiles DROP COLUMN IF EXISTS resume_file;

-- Note: We keep these because they're still useful:
-- - full_name (exists in both old and new, but new is Excel-matching)
-- - All system columns (id, role, client_id, applicant_id, timestamps, etc.)

-- ============================================================================
-- VERIFICATION: Check remaining columns
-- ============================================================================

-- Verify applicants table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
ORDER BY ordinal_position;

-- Verify profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;















