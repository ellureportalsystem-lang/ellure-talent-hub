-- ============================================================================
-- FORCE DISABLE/DROP TRIGGER FOR DATA IMPORT
-- ============================================================================
-- Run this to completely disable or drop the trigger
-- ============================================================================

-- Method 1: Disable the trigger (if it exists)
ALTER TABLE applicants DISABLE TRIGGER IF EXISTS trg_auto_create_profile_from_applicant;

-- Method 2: Drop the trigger completely (safer for import)
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON applicants;

-- Verify trigger is gone
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%';

-- If the query returns nothing, the trigger is successfully disabled/dropped!















