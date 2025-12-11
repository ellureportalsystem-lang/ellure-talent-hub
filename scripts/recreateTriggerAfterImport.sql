-- ============================================================================
-- RECREATE TRIGGER AFTER DATA IMPORT
-- ============================================================================
-- Run this AFTER successfully importing data
-- ============================================================================

-- Recreate the trigger (the function still exists)
CREATE TRIGGER trg_auto_create_profile_from_applicant
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_applicant();

-- Verify trigger is recreated
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name = 'trg_auto_create_profile_from_applicant';















