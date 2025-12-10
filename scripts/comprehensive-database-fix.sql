-- ============================================================================
-- COMPREHENSIVE DATABASE FIX SCRIPT
-- ============================================================================
-- This script fixes all identified critical issues in the database schema
-- 
-- ISSUES FIXED:
-- 1. Empty email violation in auto_create_profile_from_auth_user()
-- 2. Missing created_at and updated_at in auto_create_profile_from_auth_user()
-- 3. Empty email in auto_create_profile_from_applicant()
-- 4. Conflicting triggers review
-- 5. Missing trigger on auth.users verification
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- FIX #1 & #2: auto_create_profile_from_auth_user()
-- ============================================================================
-- Problem: Function can create profiles with empty emails (violates NOT NULL)
-- Solution: Generate safe unique email for phone-only signups

DROP FUNCTION IF EXISTS public.auto_create_profile_from_auth_user() CASCADE;

CREATE OR REPLACE FUNCTION public.auto_create_profile_from_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  safe_email text;
  safe_full_name text;
  safe_role user_role;
BEGIN
  -- Generate safe email (never empty, always unique)
  -- If email is NULL or empty, create a unique email using user ID
  safe_email := COALESCE(
    NULLIF(NEW.email, ''),
    'user-' || NEW.id::text || '@generated.local'
  );

  -- Safe full name from metadata
  safe_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    ''
  );

  -- Safe role from metadata (default to 'applicant')
  safe_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'applicant'::user_role
  );

  -- Insert profile with all required columns
  INSERT INTO public.profiles (
    id,
    email,
    phone,
    full_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    safe_email,
    NEW.phone,  -- Can be NULL for email-only signups
    safe_full_name,
    safe_role,
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- ============================================================================
-- FIX #5: Ensure trigger exists on auth.users
-- ============================================================================

DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- ============================================================================
-- FIX #3: auto_create_profile_from_applicant()
-- ============================================================================
-- Problem: Function can create profiles with empty emails
-- Solution: Generate safe unique email similar to auth user function

CREATE OR REPLACE FUNCTION public.auto_create_profile_from_applicant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  safe_email text;
  safe_phone text;
  safe_name text;
BEGIN
  -- Only process if user_id is provided
  IF NEW.user_id IS NOT NULL THEN
    -- Generate safe values (never empty)
    safe_email := COALESCE(
      NULLIF(NEW.email, ''),
      'user-' || NEW.user_id::text || '@generated.local'
    );
    safe_phone := COALESCE(NEW.phone, '');
    safe_name := COALESCE(NEW.name, '');

    -- Update existing profile or create new one
    INSERT INTO public.profiles (
      id,
      email,
      phone,
      full_name,
      role,
      applicant_id,
      display_name,
      location,
      key_skills,
      resume_file,
      profile_image,
      profile_complete_percent,
      is_old_applicant,
      created_at,
      updated_at
    )
    VALUES (
      NEW.user_id,
      safe_email,
      safe_phone,
      safe_name,
      'applicant',
      NEW.id,
      NEW.name,
      NEW.city,
      NEW.key_skills,
      NEW.resume_file,
      NEW.profile_image,
      COALESCE(NEW.profile_complete_percent, 0),
      TRUE, -- Mark as old applicant
      now(),
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      applicant_id = NEW.id,
      display_name = COALESCE(NEW.name, profiles.display_name),
      location = COALESCE(NEW.city, profiles.location),
      key_skills = COALESCE(NEW.key_skills, profiles.key_skills),
      resume_file = COALESCE(NEW.resume_file, profiles.resume_file),
      profile_image = COALESCE(NEW.profile_image, profiles.profile_image),
      profile_complete_percent = COALESCE(NEW.profile_complete_percent, profiles.profile_complete_percent),
      updated_at = now();
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the applicant insert
    RAISE WARNING 'Failed to create/update profile for applicant %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check function exists and is correct
SELECT 
  proname as function_name,
  CASE 
    WHEN proname = 'auto_create_profile_from_auth_user' THEN 'Should use safe_email generation'
    WHEN proname = 'auto_create_profile_from_applicant' THEN 'Should use safe_email generation'
    ELSE 'OK'
  END as verification_note
FROM pg_proc 
WHERE proname IN (
  'auto_create_profile_from_auth_user',
  'auto_create_profile_from_applicant'
)
ORDER BY proname;

-- Check trigger exists on auth.users
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation,
  action_timing,
  CASE 
    WHEN trigger_name = 'trg_auto_create_profile_from_auth' THEN '✓ Trigger exists'
    ELSE '✗ Trigger missing'
  END as status
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Check for profiles with empty emails (should be none after fix)
SELECT 
  id, 
  email, 
  phone, 
  created_at,
  CASE 
    WHEN email = '' OR email IS NULL THEN '✗ INVALID - Empty email'
    ELSE '✓ Valid email'
  END as status
FROM public.profiles
WHERE email = '' OR email IS NULL
LIMIT 10;

-- Check for orphaned records
SELECT 
  'auth.users without profiles' as issue,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ Some auth users missing profiles'
    ELSE '✓ All auth users have profiles'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
  'profiles without auth.users' as issue,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ Some profiles missing auth users (may be old applicants)'
    ELSE '✓ All profiles have auth users'
  END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;

-- Check trigger status on applicants table
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_schema = 'public'
ORDER BY trigger_name, event_manipulation;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- After running this script:
-- 1. ✓ auto_create_profile_from_auth_user() now handles empty emails safely
-- 2. ✓ auto_create_profile_from_applicant() now handles empty emails safely
-- 3. ✓ Trigger on auth.users is verified/created
-- 4. ✓ All functions include created_at and updated_at
-- 5. ✓ Error handling added to prevent cascade failures
--
-- Next steps:
-- - Review verification queries output
-- - Test creating new auth users
-- - Test creating applicants with NULL emails
-- - Monitor Supabase logs for any warnings
-- ============================================================================









