-- ============================================================================
-- FIXED SIGNUP ERROR - WITH SCHEMA PREFIX FOR user_role TYPE
-- ============================================================================
-- Root Cause: "type user_role does not exist" error
-- Solution: Use public.user_role or ensure search_path includes public
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop existing function and trigger
-- ============================================================================

DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;
DROP FUNCTION IF EXISTS public.auto_create_profile_from_auth_user() CASCADE;

-- ============================================================================
-- STEP 2: Create the fixed function with proper schema references
-- ============================================================================

CREATE OR REPLACE FUNCTION public.auto_create_profile_from_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
  safe_email text;
  safe_full_name text;
  safe_role public.user_role;  -- Explicit schema prefix
BEGIN
  -- ========================================================================
  -- Generate safe email (NEVER empty, ALWAYS unique)
  -- ========================================================================
  
  -- Step 1: Get email from NEW (auth.users row)
  safe_email := COALESCE(NEW.email, '');
  
  -- Step 2: Normalize email (lowercase, trim)
  safe_email := LOWER(TRIM(safe_email));
  
  -- Step 3: If email is empty or NULL, generate unique one
  IF safe_email = '' OR safe_email IS NULL THEN
    safe_email := 'user-' || REPLACE(NEW.id::text, '-', '') || '@generated.local';
  END IF;
  
  -- ========================================================================
  -- Generate safe full name
  -- ========================================================================
  safe_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    ''
  );

  -- ========================================================================
  -- Generate safe role (with error handling and explicit schema)
  -- ========================================================================
  BEGIN
    safe_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::public.user_role,  -- Explicit schema
      'applicant'::public.user_role  -- Explicit schema
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- If role casting fails, default to applicant
      safe_role := 'applicant'::public.user_role;  -- Explicit schema
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
-- STEP 3: Create the trigger
-- ============================================================================

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- ============================================================================
-- STEP 4: Grant necessary permissions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.auto_create_profile_from_auth_user() 
TO postgres, anon, authenticated, service_role;

-- ============================================================================
-- STEP 5: Verify the fix
-- ============================================================================

-- Check 1: Function exists
SELECT 
  'Function Check' as verification_step,
  proname as function_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ Function exists'
    ELSE '✗ Function missing'
  END as status
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user'
GROUP BY proname;

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

-- Check 3: Verify user_role type exists
SELECT 
  'Type Check' as verification_step,
  typname as type_name,
  CASE 
    WHEN typname = 'user_role' THEN '✓ user_role type exists'
    ELSE '✗ user_role type missing'
  END as status
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
  AND t.typname = 'user_role';

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- The fix has been applied with proper schema references.
-- The "type user_role does not exist" error should now be resolved.
-- Test signup now - it should work!
-- ============================================================================








