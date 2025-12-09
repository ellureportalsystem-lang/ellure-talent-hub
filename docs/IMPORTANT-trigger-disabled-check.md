# ⚠️ IMPORTANT: Verify Trigger is Disabled

The import is still failing with profile errors. Please verify the trigger is actually disabled:

## Step 1: Check Trigger Status

Run this SQL in Supabase SQL Editor:

```sql
-- Check if trigger exists and is enabled/disabled
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%profile%';
```

## Step 2: Disable ALL Profile-Related Triggers

If the trigger is still enabled, run:

```sql
-- Disable the trigger
ALTER TABLE applicants DISABLE TRIGGER trg_auto_create_profile_from_applicant;

-- Verify it's disabled (should return empty or show disabled status)
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name = 'trg_auto_create_profile_from_applicant';
```

## Step 3: Alternative - Drop the Trigger Temporarily

If disabling doesn't work, you can drop and recreate it:

```sql
-- Drop the trigger temporarily
DROP TRIGGER IF EXISTS trg_auto_create_profile_from_applicant ON applicants;

-- After import, recreate it (the function still exists)
CREATE TRIGGER trg_auto_create_profile_from_applicant
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION auto_create_profile_from_applicant();
```

## Step 4: Run Import

After verifying the trigger is disabled/dropped:

```bash
npm run data:import
```

## Step 5: Re-enable Trigger

After successful import:

```sql
-- Re-enable the trigger
ALTER TABLE applicants ENABLE TRIGGER trg_auto_create_profile_from_applicant;

-- OR recreate it if you dropped it (see Step 3)
```













