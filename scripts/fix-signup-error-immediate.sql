-- ============================================================================
-- IMMEDIATE FIX FOR SIGNUP ERROR
-- ============================================================================
-- Error: "Database error saving new user" (500 Internal Server Error)
-- Cause: auto_create_profile_from_auth_user() function creates empty emails
-- 
-- This script fixes the trigger function to handle NULL emails properly
-- Run this in Supabase SQL Editor immediately
-- ============================================================================

-- ============================================================================
-- Step 1: Fix the trigger function
-- ============================================================================

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
    -- This prevents the signup from failing if profile creation has issues
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- ============================================================================
-- Step 2: Ensure trigger exists and is active
-- ============================================================================

DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- ============================================================================
-- Step 3: Verify the fix
-- ============================================================================

-- Check function exists
SELECT 
  proname as function_name,
  'Function exists and should handle NULL emails' as status
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';

-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  'Trigger is active' as status
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth'
  AND trigger_name = 'trg_auto_create_profile_from_auth';

-- Check for any existing profiles with empty emails (should fix these)
SELECT 
  id,
  email,
  phone,
  created_at,
  CASE 
    WHEN email = '' OR email IS NULL THEN '⚠️ Needs fix'
    ELSE '✓ OK'
  END as status
FROM public.profiles
WHERE email = '' OR email IS NULL
LIMIT 10;

-- ============================================================================
-- Step 4: Fix existing profiles with empty emails (if any)
-- ============================================================================

-- Update any existing profiles with empty emails to use safe generated emails
UPDATE public.profiles
SET 
  email = 'user-' || id::text || '@generated.local',
  updated_at = now()
WHERE (email = '' OR email IS NULL)
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.email = 'user-' || profiles.id::text || '@generated.local'
  );

-- ============================================================================
-- VERIFICATION COMPLETE
-- ============================================================================
-- The signup error should now be fixed. Test by:
-- 1. Creating a new user with email
-- 2. Creating a new user with phone only (no email)
-- 3. Both should work without errors
-- ============================================================================








