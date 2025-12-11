-- ============================================================================
-- FIXED: auto_create_profile_from_auth_user() Trigger Function
-- ============================================================================
-- This function creates a profile when a new auth user is created
-- 
-- ISSUES FIXED:
-- 1. Removed password_changed and must_change_password (columns don't exist)
-- 2. Added created_at and updated_at (required NOT NULL columns)
-- 3. Safe email generation for phone-only signups (prevents unique constraint violation)
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

  -- Insert profile with only existing columns
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
END;
$function$;

-- ============================================================================
-- Recreate the trigger
-- ============================================================================

DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- ============================================================================
-- Verify the function was created correctly
-- ============================================================================

-- Test query to check function exists
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';












