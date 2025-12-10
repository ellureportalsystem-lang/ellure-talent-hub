-- ============================================================================
-- TEMPORARILY DISABLE TRIGGER FOR DATA IMPORT
-- ============================================================================
-- Run this BEFORE running npm run data:import
-- This disables the trigger that auto-creates profiles from applicants
-- ============================================================================

ALTER TABLE applicants DISABLE TRIGGER trg_auto_create_profile_from_applicant;

-- Verify trigger is disabled
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trg_auto_create_profile_from_applicant'
  AND event_object_table = 'applicants';














