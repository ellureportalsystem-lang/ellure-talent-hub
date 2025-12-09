# Data Import Troubleshooting

## Issue: "null value in column 'id' of relation 'profiles' violates not-null constraint"

This error occurs because the database trigger `trg_auto_create_profile_from_applicant` is trying to create profiles when applicants are inserted, but it's failing because `user_id` is NULL for old applicants.

### Solution: Temporarily Disable the Trigger

1. **Before importing**, run this SQL in Supabase SQL Editor:
   ```sql
   ALTER TABLE applicants DISABLE TRIGGER trg_auto_create_profile_from_applicant;
   ```
   
   Or use the script: `scripts/disableTriggerForImport.sql`

2. **Run the import**:
   ```bash
   npm run data:import
   ```

3. **After importing**, re-enable the trigger:
   ```sql
   ALTER TABLE applicants ENABLE TRIGGER trg_auto_create_profile_from_applicant;
   ```
   
   Or use the script: `scripts/enableTriggerAfterImport.sql`

### Why This Is Needed

The trigger `auto_create_profile_from_applicant` automatically creates profiles when applicants are inserted. However:
- For old applicants, we don't have auth users yet (`user_id` is NULL)
- The trigger tries to create a profile with `user_id` as the profile `id`
- Since `user_id` is NULL, the INSERT fails

By disabling the trigger during import, we can import all the applicant data first. Profiles will be created later when users register/login.

### Alternative: Update the Trigger

If you want to keep the trigger enabled, you could update it to handle NULL `user_id` more gracefully, but the current approach (disable → import → enable) is simpler and safer.













