-- ============================================================================
-- VERIFY TRIGGER STATUS
-- ============================================================================
-- Run this to check if the trigger is actually disabled
-- ============================================================================

SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement,
  action_condition
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%'
ORDER BY trigger_name;

-- Check trigger status (enabled/disabled)
SELECT 
  t.trigger_name,
  t.event_object_table,
  CASE 
    WHEN t.trigger_name IS NOT NULL THEN 'EXISTS'
    ELSE 'NOT FOUND'
  END as status
FROM information_schema.triggers t
WHERE t.event_object_table = 'applicants'
  AND t.trigger_name LIKE '%profile%';













