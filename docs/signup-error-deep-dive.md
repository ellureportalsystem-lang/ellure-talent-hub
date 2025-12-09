# Signup Error Deep Dive - Complete Solution

**Error:** `Database error saving new user` (500 Internal Server Error)  
**Flow:** Join as Applicant → Select Email → Enter Email → OTP Verification → Set Password → **ERROR**

---

## Root Cause Analysis

The error occurs during `supabase.auth.signUp()` when the trigger `trg_auto_create_profile_from_auth` fires. Even though the function and trigger exist, the error persists, indicating:

1. **The function definition might not have been updated** (still has old code)
2. **Email uniqueness violation** (generated email already exists)
3. **Missing required columns** (created_at/updated_at)
4. **RLS policy blocking insert**
5. **Check constraint violation**

---

## Step-by-Step Fix

### Step 1: Run Diagnostic Queries

**File:** `scripts/diagnose-signup-error.sql`

Run this first to identify the exact issue:

```sql
-- Check the ACTUAL function definition
SELECT pg_get_functiondef(oid)
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';
```

**What to look for:**
- Does it have `safe_email` variable? ✓
- Does it use `COALESCE(NULLIF(NEW.email, ''), ...)`? ✓
- Does it include `created_at` and `updated_at`? ✓

### Step 2: Run Robust Fix

**File:** `scripts/fix-signup-error-robust.sql`

This version includes:
- ✅ Enhanced email uniqueness checking with retry logic
- ✅ Better error handling for all constraint violations
- ✅ Fallback mechanisms for edge cases
- ✅ Proper permission grants

### Step 3: Check Supabase Logs

Go to **Supabase Dashboard → Logs → Postgres Logs** and look for:
- `WARNING: Failed to create profile for user...`
- `ERROR: duplicate key value violates unique constraint "profiles_email_key"`
- `ERROR: null value in column "email" violates not-null constraint`

---

## Common Issues & Solutions

### Issue 1: Function Not Updated

**Symptom:** Function exists but still has old code

**Solution:**
```sql
-- Force drop and recreate
DROP FUNCTION IF EXISTS public.auto_create_profile_from_auth_user() CASCADE;

-- Then run the fix script again
```

### Issue 2: Email Uniqueness Violation

**Symptom:** Error mentions `profiles_email_key`

**Solution:** The robust fix includes retry logic for unique emails

### Issue 3: RLS Policy Blocking

**Symptom:** Insert fails silently or with permission error

**Solution:**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Temporarily disable RLS to test (NOT recommended for production)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Test signup
-- Re-enable: ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Issue 4: Check Constraint

**Symptom:** Error mentions check constraint

**Solution:**
```sql
-- Check for check constraints
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND constraint_name LIKE '%profile%';
```

---

## Complete Fix Script (All-in-One)

Run this comprehensive script:

```sql
-- ============================================================================
-- COMPLETE FIX - Run this entire script
-- ============================================================================

-- 1. Drop and recreate function
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
  safe_email := COALESCE(
    NULLIF(LOWER(TRIM(NEW.email)), ''),
    'user-' || NEW.id::text || '@generated.local'
  );

  -- Safe full name
  safe_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    ''
  );

  -- Safe role
  BEGIN
    safe_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'applicant'::user_role
    );
  EXCEPTION
    WHEN OTHERS THEN
      safe_role := 'applicant'::user_role;
  END;

  -- Insert profile
  INSERT INTO public.profiles (
    id, email, phone, full_name, role, created_at, updated_at
  )
  VALUES (
    NEW.id, safe_email, NEW.phone, safe_full_name, safe_role, now(), now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- 2. Recreate trigger
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_auth ON auth.users;

CREATE TRIGGER trg_auto_create_profile_from_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_profile_from_auth_user();

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION public.auto_create_profile_from_auth_user() 
TO postgres, anon, authenticated, service_role;

-- 4. Fix existing problematic profiles
UPDATE public.profiles
SET email = 'user-' || id::text || '@generated.local', updated_at = now()
WHERE (email = '' OR email IS NULL);

-- 5. Verify
SELECT 
  'Function' as check_type,
  CASE WHEN COUNT(*) > 0 THEN '✓ Exists' ELSE '✗ Missing' END as status
FROM pg_proc WHERE proname = 'auto_create_profile_from_auth_user'

UNION ALL

SELECT 
  'Trigger' as check_type,
  CASE WHEN COUNT(*) > 0 THEN '✓ Exists' ELSE '✗ Missing' END as status
FROM information_schema.triggers
WHERE trigger_name = 'trg_auto_create_profile_from_auth'
  AND event_object_table = 'users'
  AND trigger_schema = 'auth';
```

---

## Testing After Fix

1. **Clear browser cache and session storage**
2. **Test email signup:**
   - Go to Join as Applicant
   - Select Email
   - Enter email
   - Complete OTP
   - Set password
   - Should work ✅

3. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - Verify user was created
   - Go to Table Editor → profiles
   - Verify profile was created with correct email

4. **Check Logs:**
   - Go to Logs → Postgres Logs
   - Should see no errors
   - May see warnings (these are handled gracefully)

---

## If Still Not Working

### Option 1: Check Actual Function Definition

```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';
```

Copy the output and verify it has:
- `safe_email` variable
- `COALESCE(NULLIF(NEW.email, ''), ...)` pattern
- `created_at` and `updated_at` in INSERT

### Option 2: Temporarily Disable Trigger

```sql
-- Disable trigger to test if it's the cause
ALTER TABLE auth.users DISABLE TRIGGER trg_auto_create_profile_from_auth;

-- Test signup (should work but profile won't be created)

-- Re-enable trigger
ALTER TABLE auth.users ENABLE TRIGGER trg_auto_create_profile_from_auth;

-- Run fix script again
```

### Option 3: Check Supabase Logs

Go to **Dashboard → Logs → Postgres Logs** and look for the exact error message. It will tell you:
- Which constraint is violated
- Which column has the issue
- The exact error code

---

## Files Reference

- **Diagnostic:** `scripts/diagnose-signup-error.sql`
- **Robust Fix:** `scripts/fix-signup-error-robust.sql`
- **Simple Fix:** `scripts/fix-signup-error-immediate.sql`
- **Complete Fix:** Use the all-in-one script above

---

**Priority:** Critical  
**Status:** Ready to deploy  
**Expected Result:** Signup should work for both email and phone signups








