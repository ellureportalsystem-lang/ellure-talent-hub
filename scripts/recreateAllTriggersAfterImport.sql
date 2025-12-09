-- ============================================================================
-- RECREATE ALL TRIGGERS AFTER DATA IMPORT
-- ============================================================================
-- Run this AFTER successfully importing data
-- ============================================================================

-- Recreate the auto-create profile trigger (if the function exists)
CREATE TRIGGER IF NOT EXISTS trg_auto_create_profile_from_applicant
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_applicant();

-- Recreate the auto-update profile triggers (if the functions exist)
CREATE TRIGGER IF NOT EXISTS trg_auto_update_profile_on_applicant_insert
AFTER INSERT ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_update_profile_from_applicant();

CREATE TRIGGER IF NOT EXISTS trg_auto_update_profile_on_applicant_update
AFTER UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_update_profile_from_applicant();

-- Verify triggers are recreated
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%'
ORDER BY trigger_name;













