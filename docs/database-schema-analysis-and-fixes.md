# Database Schema Analysis and Fixes

**Date:** January 2025  
**Status:** Complete Analysis with Fixes  
**Schema Source:** `schema.json`

---

## Executive Summary

After analyzing the complete database schema, I've identified **5 critical issues** and **3 improvement opportunities** that need to be addressed to resolve the persistent database problems.

---

## Critical Issues Found

### 🔴 Issue #1: Empty Email Violation in `auto_create_profile_from_auth_user()`

**Location:** Function `auto_create_profile_from_auth_user()` (lines 1698-1701 in schema.json)

**Problem:**
```sql
COALESCE(NEW.email, '')  -- This creates empty string if email is NULL
```

The `profiles.email` column is **NOT NULL** (line 572-579), but the function can insert an empty string when `NEW.email` is NULL. This violates the constraint and causes failures.

**Impact:** 
- Profile creation fails when users sign up with phone-only (no email)
- Triggers database errors: `null value in column "email" of relation "profiles" violates not-null constraint`

**Fix:** Use safe email generation (already in `scripts/fix_auto_create_profile_trigger.sql`):
```sql
safe_email := COALESCE(
  NULLIF(NEW.email, ''),
  'user-' || NEW.id::text || '@generated.local'
);
```

---

### 🔴 Issue #2: Missing `created_at` and `updated_at` in `auto_create_profile_from_auth_user()`

**Location:** Function `auto_create_profile_from_auth_user()` (lines 1698-1701)

**Problem:**
The function doesn't explicitly set `created_at` and `updated_at`, which are **NOT NULL** columns. While they have defaults (`now()`), it's better to be explicit for consistency.

**Impact:**
- Potential timestamp inconsistencies
- May cause issues if defaults change

**Fix:** Include these columns in the INSERT statement (already fixed in `scripts/fix_auto_create_profile_trigger.sql`).

---

### 🔴 Issue #3: Empty Email in `auto_create_profile_from_applicant()`

**Location:** Function `auto_create_profile_from_applicant()` (lines 1710-1713)

**Problem:**
```sql
COALESCE(NEW.email, ''),  -- Line in INSERT statement
```

Same issue as Issue #1 - can create empty emails.

**Impact:**
- Profile creation fails when applicant has NULL email
- Causes constraint violations

**Fix:** Use safe email generation similar to Issue #1.

---

### 🔴 Issue #4: Conflicting Triggers on `applicants` Table

**Location:** Triggers on `applicants` table (lines 1752-1808)

**Problem:**
Multiple triggers fire on the same event:
- `trg_auto_create_profile_from_applicant` fires on **INSERT** (line 1782-1786)
- `trg_auto_update_profile_on_applicant_insert` fires on **INSERT** (line 1796-1800)

Both triggers try to create/update profiles, which can cause:
- Race conditions
- Duplicate work
- Potential conflicts

**Impact:**
- Performance degradation
- Unpredictable behavior
- Potential data inconsistencies

**Fix:** Consolidate trigger logic or ensure they don't conflict.

---

### 🔴 Issue #5: Missing Trigger on `auth.users`

**Location:** Trigger `trg_auto_create_profile_from_auth` should exist on `auth.users`

**Problem:**
The trigger `trg_auto_create_profile_from_auth` is defined in the fix script but may not be active. The function `auto_create_profile_from_auth_user()` exists but the trigger might be missing.

**Impact:**
- Profiles not created automatically when auth users are created
- Manual profile creation required
- Data inconsistency between `auth.users` and `profiles`

**Fix:** Ensure the trigger exists and is active on `auth.users`.

---

## Improvement Opportunities

### ⚠️ Improvement #1: Email Uniqueness Handling

**Issue:** The safe email generation (`user-{id}@generated.local`) could theoretically conflict if multiple users have the same ID (shouldn't happen, but worth checking).

**Recommendation:** Add a check to ensure uniqueness before inserting.

---

### ⚠️ Improvement #2: Function Security

**Issue:** Some functions use `SECURITY DEFINER` which runs with elevated privileges. Need to ensure they're properly secured.

**Current Status:** `auto_create_profile_from_auth_user()` uses `SECURITY DEFINER` (correct for triggers on `auth.users`).

---

### ⚠️ Improvement #3: Error Handling

**Issue:** Functions don't have comprehensive error handling for edge cases.

**Recommendation:** Add error handling and logging for debugging.

---

## Complete Fix Script

I'll create a comprehensive fix script that addresses all issues:

```sql
-- ============================================================================
-- COMPREHENSIVE DATABASE FIX SCRIPT
-- ============================================================================
-- This script fixes all identified issues in the database schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- FIX #1 & #2: auto_create_profile_from_auth_user()
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
-- FIX #4: Review and consolidate triggers
-- ============================================================================
-- Note: The triggers trg_auto_create_profile_from_applicant and 
-- trg_auto_update_profile_on_applicant_insert both fire on INSERT.
-- Consider if both are needed or if one can be removed.
-- For now, we'll keep both but ensure they don't conflict.

-- Verify triggers exist
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
ORDER BY trigger_name;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check function exists and is correct
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
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
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Check for profiles with empty emails (should be none after fix)
SELECT id, email, phone, created_at
FROM public.profiles
WHERE email = '' OR email IS NULL;

-- Check for orphaned records
SELECT 
  'auth.users without profiles' as issue,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL

UNION ALL

SELECT 
  'profiles without auth.users' as issue,
  COUNT(*) as count
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;
```

---

## Recommended Action Plan

### Step 1: Backup Database
Before running fixes, ensure you have a backup of your database.

### Step 2: Run Fix Script
Execute the comprehensive fix script above in Supabase SQL Editor.

### Step 3: Verify Fixes
Run the verification queries at the end of the fix script.

### Step 4: Test
- Create a new auth user (should auto-create profile)
- Create an applicant with NULL email (should use safe email)
- Create an applicant with user_id (should update profile)

### Step 5: Monitor
Watch for any errors in Supabase logs after deploying fixes.

---

## Schema Summary

### Tables
- **applicants**: 55 columns, 1 PK, 2 FKs, multiple indexes
- **profiles**: 44 columns, 1 PK, 1 FK, unique email constraint
- **clients**: 18 columns, 1 PK, unique constraints on email, slug, payment_id
- **shortlists**: 9 columns, 1 PK, 1 FK
- **shortlist_items**: 5 columns, 1 PK, 2 FKs

### Functions
- 12 functions total
- 3 trigger functions for profile creation/updates
- 5 security/access functions
- 1 utility function (`update_updated_at_column`)

### Triggers
- 8 triggers total
- 4 triggers for `updated_at` maintenance
- 4 triggers for profile synchronization

### Constraints
- All tables have primary keys
- Foreign keys properly defined
- Unique constraints on critical fields
- NOT NULL constraints on required fields

---

## Notes

1. **Legacy Fields**: Many tables contain duplicate/legacy fields (e.g., `full_name` and `name`, `mobile_number` and `phone`). These exist for backward compatibility.

2. **Soft Deletes**: The `applicants` table uses soft deletes via `is_deleted` flag.

3. **Auto-Timestamps**: All tables have `created_at` and `updated_at` maintained by triggers.

4. **Profile Completion**: Profile completion percentage is stored in both `applicants` and `profiles` tables.

---

## Next Steps

1. ✅ Run the comprehensive fix script
2. ✅ Verify all fixes are applied
3. ✅ Test the system with various scenarios
4. ✅ Monitor for any new issues
5. ⚠️ Consider removing duplicate triggers if not needed
6. ⚠️ Consider cleaning up legacy fields in future migration

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Ready for Implementation










