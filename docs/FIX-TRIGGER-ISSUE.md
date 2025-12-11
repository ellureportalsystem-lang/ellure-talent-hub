# 🔧 FIX: Trigger Still Running Issue

The trigger is still active even though you disabled it. Here's how to fix it:

## The Problem

The error `null value in column "id" of relation "profiles" violates not-null constraint` means the trigger `trg_auto_create_profile_from_applicant` is still trying to create profiles when you insert applicants.

## Solution: Drop the Trigger (Recommended)

**Step 1:** Run this SQL in Supabase SQL Editor:

```sql
-- Drop the trigger completely
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON applicants;
```

**Step 2:** Verify it's gone:

```sql
-- Should return nothing
SELECT trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%';
```

**Step 3:** Run the import:

```bash
npm run data:import
```

**Step 4:** After import succeeds, recreate the trigger:

```sql
-- Recreate the trigger
CREATE TRIGGER trg_auto_create_profile_from_applicant
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_applicant();
```

## Alternative: Use the Scripts

I've created helper scripts:

1. **Before import:** Run `scripts/forceDisableTrigger.sql`
2. **Run import:** `npm run data:import`
3. **After import:** Run `scripts/recreateTriggerAfterImport.sql`

## Why This Happens

Sometimes `DISABLE TRIGGER` doesn't work if:
- The trigger was created with specific conditions
- There are multiple triggers
- The database connection has cached the trigger state

Dropping and recreating is the most reliable solution.















