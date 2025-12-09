-- ============================================================================
-- DIAGNOSTIC QUERIES FOR SIGNUP ERROR
-- ============================================================================
-- Run these queries to identify the exact issue
-- ============================================================================

-- 1. Check the ACTUAL current function definition
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'auto_create_profile_from_auth_user';

-- 2. Check if there are any check constraints on profiles.email
SELECT 
  tc.table_name,
  tc.constraint_name,
  cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'profiles'
  AND tc.constraint_type = 'CHECK';

-- 3. Check for existing profiles with the generated email pattern
SELECT 
  COUNT(*) as existing_generated_emails,
  'Check if generated emails already exist' as note
FROM public.profiles
WHERE email LIKE 'user-%@generated.local';

-- 4. Check for duplicate emails (should be none due to unique constraint)
SELECT 
  email,
  COUNT(*) as count
FROM public.profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- 5. Check RLS policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- 6. Check if RLS is enabled on profiles
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'profiles';

-- 7. Check for any triggers that might conflict
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- 8. Check recent errors in Postgres logs (if accessible)
-- Note: This might not work in Supabase SQL Editor
-- Check Supabase Dashboard → Logs → Postgres Logs instead








