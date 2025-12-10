# Create Profiles and Auth Users for Imported Applicants

## Overview

This script creates:
1. **Auth users** in Supabase Auth for each imported applicant
2. **Profiles** linked to those auth users
3. **Default password**: `applicant@123` for all users
4. **Login**: Users can login with their email or phone number

## Prerequisites

Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

You can find the service role key in:
Supabase Dashboard → Settings → API → `service_role` key (secret)

## Run the Script

```bash
npm run data:create-profiles
```

## What It Does

1. **Fetches all applicants** from the `applicants` table
2. **For each applicant**:
   - Creates an auth user with email/phone
   - Sets default password: `applicant@123`
   - Auto-confirms email and phone
   - Creates a profile linked to the auth user
   - Copies all Excel data to the profile
   - Updates applicant with `user_id`

## Login Credentials

- **Email/Phone**: From `email_address` or `mobile_number` column
- **Password**: `applicant@123` (default for all)
- **Status**: Email and phone are auto-confirmed

## Notes

- If an auth user already exists (by email), it will use that user
- If a profile already exists, it will update it with applicant data
- Applicants without email or phone will be skipped
- All Excel columns are copied to profiles

## After Running

Users can now:
1. Login with their email or phone
2. Use password: `applicant@123`
3. Will be prompted to change password (if `must_change_password` is true)














