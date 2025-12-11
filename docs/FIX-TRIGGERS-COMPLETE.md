# 🔧 FIX: Drop ALL Profile Triggers

## The Problem

You found **TWO triggers** that are causing the issue:
1. `trg_auto_update_profile_on_applicant_insert`
2. `trg_auto_update_profile_on_applicant_update`

These triggers are trying to create/update profiles when applicants are inserted, which is causing the "null value in column 'id' of relation 'profiles'" error.

## Solution: Drop ALL Triggers

**Step 1:** Run this SQL in Supabase SQL Editor:

```sql
-- Drop ALL profile-related triggers
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_insert ON applicants;
DROP TRIGGER IF EXISTS trg_auto_update_profile_on_applicant_update ON applicants;
```

Or use the script: `scripts/checkAndDropTrigger.sql`

**Step 2:** Verify they're all gone:

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

**Step 4:** After import succeeds, recreate the triggers:

```sql
-- Recreate triggers
CREATE TRIGGER trg_auto_create_profile_from_applicant
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_applicant();

CREATE TRIGGER trg_auto_update_profile_on_applicant_insert
AFTER INSERT ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_update_profile_from_applicant();

CREATE TRIGGER trg_auto_update_profile_on_applicant_update
AFTER UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_update_profile_from_applicant();
```

Or use: `scripts/recreateAllTriggersAfterImport.sql`

## Why This Happens

These triggers automatically create/update profiles when applicants are inserted/updated. For old applicants without auth users (`user_id` is NULL), the triggers try to create profiles with NULL `id`, which violates the NOT NULL constraint.

By dropping all triggers during import, we can import the applicant data first, then profiles will be created later when users register/login.















