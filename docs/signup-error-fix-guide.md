# Signup Error Fix Guide

**Error:** `Database error saving new user` (500 Internal Server Error)  
**Location:** `SetPassword.tsx` during `supabase.auth.signUp()`  
**Root Cause:** `auto_create_profile_from_auth_user()` trigger function creates profiles with empty emails

---

## Problem Analysis

### The Issue

When a user signs up, Supabase creates an entry in `auth.users`. A trigger `trg_auto_create_profile_from_auth` fires and calls `auto_create_profile_from_auth_user()` to create a profile.

**Current broken function:**
```sql
COALESCE(NEW.email, '')  -- Creates empty string if email is NULL
```

**Problems:**
1. When users sign up with **phone-only** (no email), `NEW.email` is NULL
2. The function inserts an empty string `''` for email
3. The `profiles.email` column is **NOT NULL** and **UNIQUE**
4. Multiple phone-only signups would create duplicate empty emails → **UNIQUE constraint violation**
5. This causes the entire auth user creation to fail → **500 error**

---

## Solution

### Step 1: Run the Fix Script

**File:** `scripts/fix-signup-error-immediate.sql`

Run this script in your Supabase SQL Editor. It will:

1. ✅ Fix the `auto_create_profile_from_auth_user()` function to generate safe unique emails
2. ✅ Ensure the trigger exists and is active
3. ✅ Fix any existing profiles with empty emails
4. ✅ Add error handling to prevent cascade failures

### Step 2: Verify the Fix

After running the script, test:

1. **Email signup:**
   ```javascript
   await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123'
   });
   ```
   Should work ✅

2. **Phone-only signup:**
   ```javascript
   await supabase.auth.signUp({
     phone: '+911234567890',
     password: 'password123'
   });
   ```
   Should work ✅ (will use `user-{id}@generated.local`)

3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for any warnings about profile creation
   - Should see no errors

---

## What the Fix Does

### Before (Broken):
```sql
INSERT INTO profiles (email, ...)
VALUES (COALESCE(NEW.email, ''), ...)  -- Empty string if NULL
```

### After (Fixed):
```sql
safe_email := COALESCE(
  NULLIF(NEW.email, ''),
  'user-' || NEW.id::text || '@generated.local'  -- Unique email if NULL
);

INSERT INTO profiles (email, ...)
VALUES (safe_email, ...)  -- Always valid, always unique
```

### Key Improvements:

1. **Safe Email Generation:**
   - If email exists → use it
   - If email is NULL/empty → generate `user-{uuid}@generated.local`
   - Always unique (uses user ID)

2. **Explicit Timestamps:**
   - Includes `created_at` and `updated_at` explicitly
   - Ensures consistency

3. **Error Handling:**
   - Wraps INSERT in EXCEPTION block
   - Logs warnings but doesn't fail auth user creation
   - Prevents cascade failures

4. **Trigger Verification:**
   - Ensures trigger exists on `auth.users`
   - Recreates if missing

---

## Testing Checklist

After running the fix:

- [ ] Email signup works
- [ ] Phone-only signup works
- [ ] Profile is created automatically
- [ ] No errors in Supabase logs
- [ ] Profile fetch succeeds (no timeout)
- [ ] User can proceed to registration form

---

## If Issues Persist

### Check 1: Verify Function Exists
```sql
SELECT proname, pg_get_functiondef(oid)
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';
```

### Check 2: Verify Trigger Exists
```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';
```

### Check 3: Check for Empty Emails
```sql
SELECT id, email, phone, created_at
FROM profiles
WHERE email = '' OR email IS NULL;
```

### Check 4: Check Supabase Logs
- Go to Dashboard → Logs → Postgres Logs
- Look for errors related to profile creation
- Check for constraint violations

---

## Related Files

- **Fix Script:** `scripts/fix-signup-error-immediate.sql`
- **Comprehensive Fix:** `scripts/comprehensive-database-fix.sql`
- **Analysis:** `docs/database-schema-analysis-and-fixes.md`
- **SetPassword Component:** `src/pages/auth/register/SetPassword.tsx`

---

## Notes

- The fix is **non-destructive** - it only updates the function and trigger
- Existing profiles are not affected (unless they have empty emails, which get fixed)
- The fix handles both email and phone-only signups
- Error handling ensures signup doesn't fail even if profile creation has issues

---

**Status:** Ready to deploy  
**Priority:** Critical  
**Impact:** Fixes signup for all users








