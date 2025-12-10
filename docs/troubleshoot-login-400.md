# 🔧 Troubleshooting: 400 Bad Request on Login

## Problem

Getting `400 (Bad Request)` error when trying to login:
```
POST https://gckddvcjwnmwdvhhhgby.supabase.co/auth/v1/token?grant_type=password 400 (Bad Request)
```

## Common Causes & Solutions

### 1. User Doesn't Exist in Supabase Auth ❌

**Symptom**: 400 error with "Invalid login credentials" or "User not found"

**Solution**: 
- Check if the user exists in Supabase Auth:
  1. Go to: https://supabase.com/dashboard/project/gckddvcjwnmwdvhhhgby/auth/users
  2. Search for the email you're trying to login with
  3. If not found, the auth user was never created

**Fix**: Run the profile creation script:
```bash
npm run data:create-profiles
```

This will create auth users for all applicants in your database.

### 2. Wrong Password ❌

**Symptom**: 400 error with "Invalid login credentials"

**Solution**: 
- For old applicants imported via script, the default password is: `applicant@123`
- Make sure you're using the exact password (case-sensitive)
- If the user changed their password, use the new password

### 3. Email Format Issues ❌

**Symptom**: 400 error even with correct credentials

**Solution**:
- Make sure email is in lowercase
- No extra spaces before/after email
- Use the exact email from the database

### 4. Email Not Confirmed ❌

**Symptom**: 400 error with "Email not confirmed"

**Solution**:
- Check Supabase Auth settings
- The profile creation script should auto-confirm emails
- If not confirmed, manually confirm in Supabase dashboard

## Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) → Console tab. You should see:
- `🔐 Attempting login for: [email]`
- `❌ Login error:` with details
- `Error message:` with the exact Supabase error

### Step 2: Verify User Exists

1. Go to Supabase Dashboard
2. Navigate to: **Authentication** → **Users**
3. Search for the email you're trying to login with
4. Check if user exists and is confirmed

### Step 3: Check User Details

If user exists, check:
- ✅ Email is confirmed
- ✅ User is active (not banned)
- ✅ Password is set (not OAuth-only user)

### Step 4: Test with Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find the user
3. Click "Reset Password" or "Send Magic Link"
4. This will verify the user exists and email is valid

## Quick Test

Try logging in with a known good account:
- Email: Check one from your `applicants` table
- Password: `applicant@123` (default for old applicants)

## If User Doesn't Exist

If the user doesn't exist in Supabase Auth, you need to create them:

### Option 1: Run Profile Creation Script (Recommended)

```bash
npm run data:create-profiles
```

This will:
- Create auth users for all applicants
- Set default password: `applicant@123`
- Auto-confirm emails
- Create profiles linked to auth users

### Option 2: Create User Manually

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click "Add User" → "Create new user"
3. Enter email and password
4. Set password: `applicant@123`
5. Check "Auto Confirm User"
6. Click "Create User"

## Verify After Fix

After creating the user or fixing the issue:

1. **Restart dev server** (if you changed code)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try login again** with:
   - Email: (from applicants table)
   - Password: `applicant@123`

## Still Not Working?

1. Check the browser console for detailed error messages
2. Check Supabase Auth logs: Dashboard → **Authentication** → **Logs**
3. Verify `.env` file has correct `VITE_SUPABASE_ANON_KEY`
4. Make sure dev server was restarted after `.env` changes

---

**Most Common Fix**: Run `npm run data:create-profiles` to create auth users for all applicants! 🚀














