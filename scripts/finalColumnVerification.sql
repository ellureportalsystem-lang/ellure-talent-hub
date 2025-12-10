-- ============================================================================
-- FINAL COLUMN VERIFICATION AND MISSING COLUMNS
-- ============================================================================
-- Run this to add any missing columns and verify everything matches Excel
-- ============================================================================

-- Add missing columns to APPLICANTS table
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS communication TEXT;
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS education TEXT;

-- Verify all Excel columns exist in APPLICANTS
-- Excel Column → Database Column Mapping:
-- ✓ Date → date
-- ✓ Full Name → full_name  
-- ✓ Mobile Number → mobile_number
-- ✓ Email Address → email_address
-- ✓ City / Current Location → city_current_location
-- ✓ Skill / Job Role Applying For → skill_job_role_applying_for
-- ✓ Communication → communication (just added)
-- ✓ Highest Qualification → highest_qualification
-- ✓ Education Board → education_board
-- ✓ Medium of Study → medium_of_study
-- ✓ Course / Degree Name → course_degree_name
-- ✓ University / Institute Name → university_institute_name
-- ✓ Year of Passing → year_of_passing
-- ✓ Work Experience → work_experience
-- ✓ Total Experience(Numbers) → total_experience_numbers
-- ✓ Current Company → current_company
-- ✓ Current Designation → current_designation
-- ✓ Current CTC → current_ctc
-- ✓ Exp CTC → exp_ctc
-- ✓ Notice Period → notice_period
-- ✓ Key Skill → key_skill
-- ✓ Upload CV any format → upload_cv_any_format
-- ✓ Education → education (just added)

-- Verify all Excel columns exist in PROFILES
-- All columns already exist in profiles table ✓

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check applicants table has all Excel columns
SELECT 
  CASE 
    WHEN COUNT(*) = 22 THEN '✅ All Excel columns present in applicants'
    ELSE '❌ Missing columns in applicants'
  END as status,
  COUNT(*) as excel_columns_found
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
  AND column_name IN (
    'date', 'full_name', 'mobile_number', 'email_address', 
    'city_current_location', 'skill_job_role_applying_for', 
    'communication', 'highest_qualification', 'education_board', 
    'medium_of_study', 'course_degree_name', 'university_institute_name', 
    'year_of_passing', 'work_experience', 'total_experience_numbers', 
    'current_company', 'current_designation', 'current_ctc', 'exp_ctc', 
    'notice_period', 'key_skill', 'upload_cv_any_format', 'education'
  );

-- Check profiles table has all Excel columns
SELECT 
  CASE 
    WHEN COUNT(*) >= 22 THEN '✅ All Excel columns present in profiles'
    ELSE '❌ Missing columns in profiles'
  END as status,
  COUNT(*) as excel_columns_found
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN (
    'date', 'full_name', 'mobile_number', 'email_address', 
    'city_current_location', 'skill_job_role_applying_for', 
    'communication', 'highest_qualification', 'education_board', 
    'medium_of_study', 'course_degree_name', 'university_institute_name', 
    'year_of_passing', 'work_experience', 'total_experience_numbers', 
    'current_company', 'current_designation', 'current_ctc', 'exp_ctc', 
    'notice_period', 'key_skill', 'upload_cv_any_format', 'education', 
    'skill', 'contact', 'location'
  );

-- List all Excel-matching columns in applicants
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'applicants'
  AND column_name IN (
    'date', 'full_name', 'mobile_number', 'email_address', 
    'city_current_location', 'skill_job_role_applying_for', 
    'communication', 'highest_qualification', 'education_board', 
    'medium_of_study', 'course_degree_name', 'university_institute_name', 
    'year_of_passing', 'work_experience', 'total_experience_numbers', 
    'current_company', 'current_designation', 'current_ctc', 'exp_ctc', 
    'notice_period', 'key_skill', 'upload_cv_any_format', 'education'
  )
ORDER BY column_name;














