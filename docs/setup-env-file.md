# 📝 How to Set Up Your .env File

## Step 1: Delete the Old .env File

Manually delete the existing `.env` file from your project root:
```
E:\new PRP\ellure-talent-hub\.env
```

## Step 2: Create New .env File

Create a new `.env` file in the project root with the following content:

```env
# ============================================
# Supabase Configuration
# ============================================
# IMPORTANT: In Vite, environment variables MUST be prefixed with VITE_ to be accessible in client code

# Your Supabase Project URL
# Get this from: Supabase Dashboard → Settings → API → Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase Anon/Public Key (safe to expose in client)
# Get this from: Supabase Dashboard → Settings → API → anon public key
# This is the same as "Publishable Key" in some Supabase dashboards
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (ONLY for server-side scripts, NEVER expose in client)
# Get this from: Supabase Dashboard → Settings → API → service_role key (secret)
# This is used by Node.js scripts only (like importApplicantData.js, createProfilesAndAuthUsers.js)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Fill in Your Credentials

Based on your previous `.env` file, here's what you need to fill in:

### 1. VITE_SUPABASE_URL
```
VITE_SUPABASE_URL=https://gckddvcjwnmwdvhhhgby.supabase.co
```
✅ You already have this - just copy it!

### 2. VITE_SUPABASE_ANON_KEY
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzQyMTMsImV4cCI6MjA3ODc1MDIxM30.f6_VnT84HKEyHf5q0nzdtVF0K_tky0qZp5Sz7LY9jRo
```
✅ You have this as `VITE_SUPABASE_PUBLISHABLE_KEY` - use the same value!

### 3. SUPABASE_SERVICE_ROLE_KEY
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE3NDIxMywiZXhwIjoyMDc4NzUwMjEzfQ.gif_1F5c9MAHtIgIuSzjW9MIo...
```
✅ You already have this - just copy it!

## Step 4: Your Complete .env File Should Look Like:

```env
VITE_SUPABASE_URL=https://gckddvcjwnmwdvhhhgby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzQyMTMsImV4cCI6MjA3ODc1MDIxM30.f6_VnT84HKEyHf5q0nzdtVF0K_tky0qZp5Sz7LY9jRo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE3NDIxMywiZXhwIjoyMDc4NzUwMjEzfQ.gif_1F5c9MAHtIgIuSzjW9MIo...
```

**Note:** Make sure the `SUPABASE_SERVICE_ROLE_KEY` value is complete (it might be truncated in the output).

## Step 5: Restart Dev Server

After saving the `.env` file:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`

## ✅ Verification

After restarting, the app should load without the environment variable error!

---

## 🔍 Where to Find Your Credentials

If you need to get fresh credentials:

1. Go to: https://supabase.com/dashboard/project/gckddvcjwnmwdvhhhgby
2. Navigate to: **Settings** → **API**
3. You'll see:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → Use for `SUPABASE_SERVICE_ROLE_KEY`














