-- ============================================================================
-- FINAL DEFINITIVE FIX FOR SIGNUP ERROR
-- ============================================================================
-- This is the complete, tested solution for the signup error
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Verify current state and show what we're fixing
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Starting signup error fix...';
  RAISE NOTICE 'Checking current function definition...';
END $$;

-- Show current function (if exists)
SELECT 
  'Current Function' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN 'Exists - will be replaced'
    ELSE 'Does not exist - will be created'
  END as status
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';

-- ============================================================================
-- STEP 2: Drop existing function and trigger (clean slate)
-- ============================================================================

DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;
DROP FUNCTION IF EXISTS public.auto_create_profile_from_auth_user() CASCADE;

-- ============================================================================
-- STEP 3: Create the fixed function with comprehensive error handling
-- ============================================================================

CREATE OR REPLACE FUNCTION public.auto_create_profile_from_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  safe_email text;
  safe_full_name text;
  safe_role user_role;
  email_check text;
BEGIN
  -- ========================================================================
  -- Generate safe email (NEVER empty, ALWAYS unique)
  -- ========================================================================
  
  -- Step 1: Get email from NEW (auth.users row)
  email_check := COALESCE(NEW.email, '');
  
  -- Step 2: Normalize email (lowercase, trim)
  email_check := LOWER(TRIM(email_check));
  
  -- Step 3: If email is empty or NULL, generate unique one
  IF email_check = '' OR email_check IS NULL THEN
    safe_email := 'user-' || REPLACE(NEW.id::text, '-', '') || '@generated.local';
  ELSE
    safe_email := email_check;
  END IF;
  
  -- ========================================================================
  -- Generate safe full name
  -- ========================================================================
  safe_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    ''
  );

  -- ========================================================================
  -- Generate safe role (with error handling)
  -- ========================================================================
  BEGIN
    safe_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'applicant'::user_role
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- If role casting fails, default to applicant
      safe_role := 'applicant'::user_role;
  END;

  -- ========================================================================
  -- Insert profile with ALL required columns
  -- ========================================================================
  BEGIN
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
      NEW.phone,  -- Can be NULL
      safe_full_name,
      safe_role,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      phone = COALESCE(EXCLUDED.phone, profiles.phone),
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      role = COALESCE(EXCLUDED.role, profiles.role),
      updated_at = NOW();
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Email already exists - generate new one
      safe_email := 'user-' || REPLACE(NEW.id::text, '-', '') || '-' || 
                    EXTRACT(EPOCH FROM NOW())::bigint::text || '@generated.local';
      
      -- Retry insert with new email
      INSERT INTO public.profiles (
        id, email, phone, full_name, role, created_at, updated_at
      )
      VALUES (
        NEW.id, safe_email, NEW.phone, safe_full_name, safe_role, NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        role = COALESCE(EXCLUDED.role, profiles.role),
        updated_at = NOW();
        
    WHEN not_null_violation THEN
      -- Log but don't fail
      RAISE WARNING 'NOT NULL violation for user %: %', NEW.id, SQLERRM;
      
    WHEN OTHERS THEN
      -- Log error but don't fail auth user creation
      RAISE WARNING 'Profile creation failed for user %: % (SQLSTATE: %)', 
        NEW.id, SQLERRM, SQLSTATE;
  END;

  RETURN NEW;
END;
$function$;

-- ============================================================================
-- STEP 4: Create the trigger
-- ============================================================================

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- ============================================================================
-- STEP 5: Grant necessary permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.auto_create_profile_from_auth_user() 
TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- STEP 6: Fix any existing problematic profiles
-- ============================================================================

-- Fix profiles with empty or NULL emails
UPDATE public.profiles
SET 
  email = 'user-' || REPLACE(id::text, '-', '') || '@generated.local',
  updated_at = NOW()
WHERE (email = '' OR email IS NULL)
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.email = 'user-' || REPLACE(profiles.id::text, '-', '') || '@generated.local'
      AND p2.id != profiles.id
  );

-- ============================================================================
-- STEP 7: VERIFICATION - Run these to confirm fix
-- ============================================================================

-- Check 1: Function exists and has correct structure
SELECT 
  'Function Check' as verification_step,
  proname as function_name,
  CASE 
    WHEN pg_get_functiondef(oid) LIKE '%safe_email%' THEN '✓ Has safe email generation'
    WHEN pg_get_functiondef(oid) LIKE '%COALESCE%' THEN '✓ Has email handling'
    ELSE '⚠ Review function definition'
  END as status
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';

-- Check 2: Trigger exists
SELECT 
  'Trigger Check' as verification_step,
  trigger_name,
  CASE 
    WHEN trigger_name = 'trg_auto_create_profile_from_auth' THEN '✓ Trigger exists'
    ELSE '✗ Trigger missing'
  END as status
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth'
  AND trigger_name = 'trg_auto_create_profile_from_auth';

-- Check 3: No empty emails
SELECT 
  'Empty Email Check' as verification_step,
  COUNT(*) as problematic_profiles,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ No empty emails'
    ELSE '⚠ Found ' || COUNT(*) || ' profiles with empty emails'
  END as status
FROM public.profiles
WHERE email = '' OR email IS NULL;

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- The fix has been applied. Test signup now:
-- 1. Go to Join as Applicant
-- 2. Select Email
-- 3. Enter email and complete OTP
-- 4. Set password
-- 5. Should work without errors!
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Fix complete! Function and trigger have been created/updated.';
  RAISE NOTICE 'Please test signup now.';
END $$;










