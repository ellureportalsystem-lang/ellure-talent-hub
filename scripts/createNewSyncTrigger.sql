-- ============================================================================
-- CREATE NEW SYNC TRIGGER (APPLICANTS → PROFILES)
-- ============================================================================
-- This creates the new trigger that syncs only valid fields
-- ============================================================================

-- STEP 1: Create the new sync function
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
  UPDATE public.profiles
  SET
    full_name = NEW.name,
    phone = NEW.phone,
    email = NEW.email,
    location = (
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
    ),
    updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

-- STEP 2: Create triggers
DROP TRIGGER IF EXISTS trg_sync_profile_on_insert ON public.applicants;
CREATE TRIGGER trg_sync_profile_on_insert
AFTER INSERT ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_applicant();

DROP TRIGGER IF EXISTS trg_sync_profile_on_update ON public.applicants;
CREATE TRIGGER trg_sync_profile_on_update
AFTER UPDATE ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_applicant();

-- STEP 3: Verify triggers are created
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'applicants'
  AND trigger_name LIKE '%sync_profile%'
ORDER BY trigger_name;

-- ============================================================================
-- Done! The new trigger is now active.
-- ============================================================================










