# 🔧 Fix: Missing Supabase Environment Variables

## Problem

You're getting this error:
```
Error: Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.
```

## Solution

### 1. Check Your .env File Location

Make sure your `.env` file is in the **root directory** of your project:
```
ellure-talent-hub/
├── .env          ← Must be here
├── src/
├── package.json
└── ...
```

### 2. Check Variable Names

**IMPORTANT**: In Vite, environment variables **MUST** be prefixed with `VITE_` to be accessible in client-side code.

Your `.env` file should look like this:

```env
# ✅ CORRECT - Has VITE_ prefix
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ❌ WRONG - Missing VITE_ prefix (won't work in Vite)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. .env File Format

Your `.env` file should be formatted like this:

```env
VITE_SUPABASE_URL=https://gckddvcjwnmwdvhhhgby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Notes:**
- No spaces around the `=` sign
- No quotes needed (but they work if you use them)
- One variable per line
- Lines starting with `#` are comments

### 4. Restart Dev Server

After updating your `.env` file, you **MUST** restart your Vite dev server:

1. Stop the current server (Ctrl+C)
2. Start it again: `npm run dev`

Vite only reads `.env` files when it starts, so changes won't take effect until you restart.

### 5. Verify Variables Are Loaded

You can check if variables are loaded by temporarily adding this to your code:

```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
```

## Common Issues

### Issue 1: Variables Not Prefixed with VITE_

**Symptom**: Variables exist but are `undefined` in code

**Fix**: Add `VITE_` prefix:
```env
# Before
SUPABASE_URL=...

# After
VITE_SUPABASE_URL=...
```

### Issue 2: Dev Server Not Restarted

**Symptom**: Updated .env but still getting error

**Fix**: Restart the dev server

### Issue 3: .env File in Wrong Location

**Symptom**: File exists but variables not found

**Fix**: Move `.env` to project root (same level as `package.json`)

### Issue 4: Typos in Variable Names

**Symptom**: Variables set but still undefined

**Fix**: Check for typos:
- `VITE_SUPABASE_URL` (not `VITE_SUPABASEURL` or `VITE_SUPABASE_URLS`)
- `VITE_SUPABASE_ANON_KEY` (not `VITE_SUPABASE_ANON` or `VITE_SUPABASE_KEY`)

## Quick Fix Checklist

- [ ] `.env` file is in project root
- [ ] Variables have `VITE_` prefix
- [ ] No spaces around `=` sign
- [ ] Dev server restarted after changes
- [ ] No typos in variable names

## Still Not Working?

1. **Check file encoding**: Make sure `.env` is saved as UTF-8
2. **Check for hidden characters**: Copy-paste the variable names from this guide
3. **Check .gitignore**: Make sure `.env` is in `.gitignore` (it should be)
4. **Try .env.local**: Sometimes Vite prefers `.env.local` for local development

## Example .env File

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://gckddvcjwnmwdvhhhgby.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2ODk2MDAsImV4cCI6MjAzNzI2NTYwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Service Role Key (for scripts only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2RkdmNqd25td2R2aGhoZ2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTY4OTYwMCwiZXhwIjoyMDM3MjY1NjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

**After fixing, restart your dev server!** 🚀














