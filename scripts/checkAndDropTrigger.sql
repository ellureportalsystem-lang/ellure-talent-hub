-- ============================================================================
-- CHECK AND DROP TRIGGERS - COMPLETE SOLUTION
-- ============================================================================
-- Run this to check trigger status and drop ALL profile-related triggers
-- ============================================================================

-- Step 1: Check all profile-related triggers on applicants table
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%';

-- Step 2: Drop ALL profile-related triggers (this will fix the issue)
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_insert ON applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_update ON applicants;

-- Step 3: Verify they're all gone (should return nothing)
SELECT 
  trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%';

-- If Step 3 returns nothing, all triggers are successfully dropped!
-- Now you can run: npm run data:import

