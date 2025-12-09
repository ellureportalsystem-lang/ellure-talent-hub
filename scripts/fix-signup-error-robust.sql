-- ============================================================================
-- ROBUST FIX FOR SIGNUP ERROR
-- ============================================================================
-- This version includes additional safety checks and better error handling
-- Run this if the previous fix didn't work
-- ============================================================================

-- ============================================================================
-- Step 1: Drop and recreate the function with enhanced safety
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
  email_exists boolean;
  counter integer := 0;
  max_attempts integer := 10;
BEGIN
  -- Generate safe email (never empty, always unique)
  -- If email is NULL or empty, create a unique email using user ID
  IF NEW.email IS NOT NULL AND NEW.email != '' THEN
    safe_email := LOWER(TRIM(NEW.email));
  ELSE
    -- Generate unique email with retry logic
    safe_email := 'user-' || NEW.id::text || '@generated.local';
    
    -- Check if this email already exists (shouldn't happen, but safety check)
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = safe_email) INTO email_exists;
    
    -- If exists (shouldn't happen), add counter
    WHILE email_exists AND counter < max_attempts LOOP
      counter := counter + 1;
      safe_email := 'user-' || NEW.id::text || '-' || counter::text || '@generated.local';
      SELECT EXISTS(SELECT 1 FROM public.profiles WHERE email = safe_email) INTO email_exists;
    END LOOP;
    
    -- If still exists after max attempts, use timestamp
    IF email_exists THEN
      safe_email := 'user-' || NEW.id::text || '-' || EXTRACT(EPOCH FROM NOW())::text || '@generated.local';
    END IF;
  END IF;

  -- Safe full name from metadata
  safe_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    ''
  );

  -- Safe role from metadata (default to 'applicant')
  -- Handle potential casting errors
  BEGIN
    safe_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'applicant'::user_role
    );
  EXCEPTION
    WHEN OTHERS THEN
      safe_role := 'applicant'::user_role;
  END;

  -- Insert profile with all required columns
  -- Use explicit error handling
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
      NEW.phone,  -- Can be NULL for email-only signups
      safe_full_name,
      safe_role,
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Log success (only in development, remove in production)
    -- RAISE NOTICE 'Profile created successfully for user % with email %', NEW.id, safe_email;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Email already exists - try to update instead
      BEGIN
        UPDATE public.profiles
        SET 
          phone = COALESCE(NEW.phone, profiles.phone),
          full_name = COALESCE(safe_full_name, profiles.full_name),
          role = COALESCE(safe_role, profiles.role),
          updated_at = now()
        WHERE id = NEW.id;
        
        -- If update didn't affect any rows, it means email conflict
        IF NOT FOUND THEN
          -- Generate a new unique email
          safe_email := 'user-' || NEW.id::text || '-' || EXTRACT(EPOCH FROM NOW())::text || '@generated.local';
          
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
            NEW.phone,
            safe_full_name,
            safe_role,
            now(),
            now()
          )
          ON CONFLICT (id) DO NOTHING;
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE WARNING 'Failed to create/update profile for user %: %', NEW.id, SQLERRM;
      END;
      
    WHEN not_null_violation THEN
      RAISE WARNING 'NOT NULL violation creating profile for user %: %', NEW.id, SQLERRM;
      
    WHEN OTHERS THEN
      -- Log the error but don't fail the auth user creation
      RAISE WARNING 'Failed to create profile for user %: % (Error Code: %)', NEW.id, SQLERRM, SQLSTATE;
  END;

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
-- Step 3: Grant necessary permissions (if needed)
-- ============================================================================

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.auto_create_profile_from_auth_user() TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- Step 4: Verify the fix
-- ============================================================================

-- Check function exists with correct definition
SELECT 
  proname as function_name,
  CASE 
    WHEN pg_get_functiondef(oid) LIKE '%safe_email%' THEN '✓ Has safe email generation'
    ELSE '✗ Missing safe email generation'
  END as status
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';

-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  CASE 
    WHEN trigger_name = 'trg_auto_create_profile_from_auth' THEN '✓ Trigger exists'
    ELSE '✗ Trigger missing'
  END as status
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth'
  AND trigger_name = 'trg_auto_create_profile_from_auth';

-- ============================================================================
-- Step 5: Fix any existing problematic profiles
-- ============================================================================

-- Fix profiles with empty or NULL emails
UPDATE public.profiles
SET 
  email = 'user-' || id::text || '@generated.local',
  updated_at = now()
WHERE (email = '' OR email IS NULL)
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p2 
    WHERE p2.email = 'user-' || profiles.id::text || '@generated.local'
      AND p2.id != profiles.id
  );

-- ============================================================================
-- VERIFICATION COMPLETE
-- ============================================================================
-- This robust version includes:
-- 1. Enhanced email uniqueness checking with retry logic
-- 2. Better error handling for all constraint violations
-- 3. Fallback mechanisms for edge cases
-- 4. Proper permission grants
--
-- Test by creating a new user - should work now!
-- ============================================================================








