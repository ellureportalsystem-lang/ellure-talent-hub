-- ============================================================================
-- COMPLETE CLEANUP: Remove ALL Old Triggers and Functions
-- ============================================================================
-- This script removes ALL old triggers and functions that reference
-- non-existent columns like 'city', 'full_name', etc.
-- ============================================================================

-- STEP 1: Drop ALL old triggers on applicants table
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_insert ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_update ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_from_applicant ON public.applicants;

-- STEP 2: Drop ALL old functions (CASCADE to remove dependencies)
DROP FUNCTION IF EXISTS public.auto_create_profile_from_applicant() CASCADE;
DROP FUNCTION IF EXISTS public.auto_update_profile_from_applicant() CASCADE;

-- STEP 3: Verify all old triggers are gone
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND (trigger_name LIKE '%profile%' OR trigger_name LIKE '%auto%')
ORDER BY trigger_name;

-- STEP 4: Verify all old functions are gone
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%auto_create_profile%' 
       OR routine_name LIKE '%auto_update_profile%')
ORDER BY routine_name;

-- ============================================================================
-- If the above queries return nothing, all old triggers/functions are removed!
-- ============================================================================












