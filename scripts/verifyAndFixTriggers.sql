-- ============================================================================
-- VERIFY AND FIX TRIGGERS - Complete Solution
-- ============================================================================
-- Run this script to verify and fix all trigger issues
-- ============================================================================

-- STEP 1: Check for ALL triggers on applicants table
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
ORDER BY trigger_name;

-- STEP 2: Check for ALL functions that might reference 'city'
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND (
    routine_definition LIKE '%NEW.city%' 
    OR routine_definition LIKE '%NEW.city%'
    OR routine_definition LIKE '%applicant.city%'
  )
ORDER BY routine_name;

-- STEP 3: Drop ALL old triggers (safe to run multiple times)
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_insert ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_update ON public.applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_from_applicant ON public.applicants;
DROP TRIGGER IF EXISTS trg_sync_profile_on_insert ON public.applicants;
DROP TRIGGER IF EXISTS trg_sync_profile_on_update ON public.applicants;

-- STEP 4: Drop ALL old functions (CASCADE removes dependencies)
DROP FUNCTION IF EXISTS public.auto_create_profile_from_applicant() CASCADE;
DROP FUNCTION IF EXISTS public.auto_update_profile_from_applicant() CASCADE;
DROP FUNCTION IF EXISTS public.sync_profile_from_applicant() CASCADE;

-- STEP 5: Create the NEW sync function (fixed version)
CREATE OR REPLACE FUNCTION public.sync_profile_from_applicant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If user_id is null, do nothing
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Update matching profile with only valid fields
  -- IMPORTANT: Also set role = 'applicant' to ensure correct role
  -- Handle case where city_id might be null
  UPDATE public.profiles
  SET
    full_name = COALESCE(NEW.name, full_name),
    phone = COALESCE(NEW.phone, phone),
    email = COALESCE(NEW.email, email),
    role = 'applicant', -- CRITICAL: Ensure role is always 'applicant' when syncing from applicants
    location = CASE
      WHEN NEW.city_id IS NOT NULL THEN (
        SELECT COALESCE(c.name, '') || 
               CASE 
                 WHEN d.name IS NOT NULL THEN ', ' || d.name 
                 ELSE '' 
               END ||
               CASE 
                 WHEN s.name IS NOT NULL THEN ', ' || s.name 
                 ELSE '' 
               END
        FROM public.cities c
        LEFT JOIN public.districts d ON d.id = c.district_id
        LEFT JOIN public.states s ON s.id = c.state_id
        WHERE c.id = NEW.city_id
        LIMIT 1
      )
      ELSE location
    END,
    updated_at = now()
  WHERE id = NEW.user_id;

  -- If profile doesn't exist, create it with role 'applicant'
  IF NOT FOUND THEN
    INSERT INTO public.profiles (
      id,
      email,
      phone,
      full_name,
      role,
      updated_at
    )
    VALUES (
      NEW.user_id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.phone, ''),
      COALESCE(NEW.name, ''),
      'applicant', -- Always create as applicant
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      full_name = COALESCE(NEW.name, profiles.full_name),
      phone = COALESCE(NEW.phone, profiles.phone),
      email = COALESCE(NEW.email, profiles.email),
      role = 'applicant', -- Ensure role is 'applicant' even on conflict
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

-- STEP 6: Create the new triggers
CREATE TRIGGER trg_sync_profile_on_insert
AFTER INSERT ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_applicant();

CREATE TRIGGER trg_sync_profile_on_update
AFTER UPDATE ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_applicant();

-- STEP 7: Verify only the new triggers exist
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
ORDER BY trigger_name;

-- STEP 8: Verify the function exists and is correct
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'sync_profile_from_applicant';

-- ============================================================================
-- Expected Results:
-- - STEP 7 should show only: trg_sync_profile_on_insert, trg_sync_profile_on_update, update_applicants_updated_at
-- - STEP 8 should show: sync_profile_from_applicant function
-- ============================================================================

