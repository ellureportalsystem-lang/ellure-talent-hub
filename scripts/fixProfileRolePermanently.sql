-- ============================================================================
-- FIX PROFILE ROLE PERMANENTLY
-- ============================================================================
-- This script ensures profiles always have role 'applicant' when syncing
-- from applicants table, and fixes any existing profiles with wrong roles
-- ============================================================================

-- STEP 1: Update the sync function to ALWAYS set role = 'applicant'
CREATE OR REPLACE FUNCTION public.sync_profile_from_applicant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If user_id is null, do nothing
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Update matching profile with only valid fields
  -- CRITICAL: Always set role = 'applicant' when syncing from applicants table
  UPDATE public.profiles
  SET
    full_name = COALESCE(NEW.name, full_name),
    phone = COALESCE(NEW.phone, phone),
    email = COALESCE(NEW.email, email),
    role = 'applicant', -- ALWAYS set to applicant when syncing from applicants
    location = CASE
      WHEN NEW.city_id IS NOT NULL THEN (
        SELECT COALESCE(c.name, '') || 
               CASE 
                 WHEN d.name IS NOT NULL THEN ', ' || d.name 
                 ELSE '' 
               END ||
               CASE 
                 WHEN s.name IS NOT NULL THEN ', ' || s.name 
                 ELSE '' 
               END
        FROM public.cities c
        LEFT JOIN public.districts d ON d.id = c.district_id
        LEFT JOIN public.states s ON s.id = c.state_id
        WHERE c.id = NEW.city_id
        LIMIT 1
      )
      ELSE location
    END,
    updated_at = now()
  WHERE id = NEW.user_id;

  -- If profile doesn't exist, create it with role 'applicant'
  IF NOT FOUND THEN
    INSERT INTO public.profiles (
      id,
      email,
      phone,
      full_name,
      role,
      updated_at
    )
    VALUES (
      NEW.user_id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.phone, ''),
      COALESCE(NEW.name, ''),
      'applicant', -- Always create as applicant
      now()
    )
    ON CONFLICT (id) DO UPDATE
    SET
      full_name = COALESCE(NEW.name, profiles.full_name),
      phone = COALESCE(NEW.phone, profiles.phone),
      email = COALESCE(NEW.email, profiles.email),
      role = 'applicant', -- Ensure role is 'applicant' even on conflict
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

-- STEP 2: Fix any existing profiles that have wrong role but are linked to applicants
UPDATE public.profiles p
SET role = 'applicant'
WHERE EXISTS (
  SELECT 1 
  FROM public.applicants a 
  WHERE a.user_id = p.id
)
AND p.role != 'applicant';

-- STEP 3: Verify the fix
SELECT 
  p.id,
  p.email,
  p.role,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.applicants a WHERE a.user_id = p.id) 
    THEN 'Has Applicant Record' 
    ELSE 'No Applicant Record' 
  END as applicant_status
FROM public.profiles p
WHERE EXISTS (SELECT 1 FROM public.applicants a WHERE a.user_id = p.id)
ORDER BY p.role, p.email;

-- ============================================================================
-- Expected Result: All profiles linked to applicants should have role = 'applicant'
-- ============================================================================










