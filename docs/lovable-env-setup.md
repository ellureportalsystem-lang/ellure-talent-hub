# 🔧 Setting Up Environment Variables in Lovable

## ❌ The Problem

When you push code to GitHub, your `.env` file is **NOT** included (it's in `.gitignore` for security). Lovable's preview environment doesn't have access to your local environment variables, causing the app to fail.

## ✅ The Solution

You need to configure environment variables **directly in Lovable's platform settings**.

---

## 📝 Step-by-Step Instructions

### Option 1: Configure in Lovable Dashboard (Recommended)

1. **Go to your Lovable project dashboard**
   - Navigate to your project settings

2. **Find "Environment Variables" or "Secrets" section**
   - This is usually in:
     - Project Settings → Environment Variables
     - Or: Deploy Settings → Environment Variables
     - Or: Settings → Secrets

3. **Add these two variables:**

   ```
   VITE_SUPABASE_URL=https://gckddvcjwnmwdvhhhgby.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzQyMTMsImV4cCI6MjA3ODc1MDIxM30.f6_VnT84HKEyHf5q0nzdtVF0K_tky0qZp5Sz7LY9jRo
   ```

4. **Save and redeploy**
   - Lovable should automatically rebuild with the new environment variables

---

### Option 2: If Lovable doesn't have a UI for environment variables

Some platforms require you to set environment variables in a different way:

1. **Check Lovable's documentation** for how to set environment variables
2. **Look for a `.env` file in Lovable's file explorer** (if they allow it)
3. **Contact Lovable support** if you can't find where to set them

---

## 🔍 How to Get Your Credentials

If you need to get your Supabase credentials again:

1. Go to: https://supabase.com/dashboard/project/gckddvcjwnmwdvhhhgby
2. Navigate to: **Settings** → **API**
3. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

---

## ✅ Verification

After setting the environment variables in Lovable:

1. The preview should automatically rebuild
2. The error should disappear
3. Your app should connect to Supabase successfully

---

## 📌 Important Notes

- ✅ **Safe to expose**: `VITE_SUPABASE_ANON_KEY` is safe to use in client-side code (it's designed for public use)
- ❌ **Never expose**: `SUPABASE_SERVICE_ROLE_KEY` should NEVER be set in Lovable (it's only for server-side scripts)
- 🔒 **Security**: Your `.env` file stays local and is never pushed to GitHub (this is correct!)

---

## 🆘 Still Having Issues?

If you can't find where to set environment variables in Lovable:

1. Check Lovable's documentation
2. Look for "Environment Variables", "Secrets", or "Config" in the dashboard
3. Contact Lovable support with this error message













