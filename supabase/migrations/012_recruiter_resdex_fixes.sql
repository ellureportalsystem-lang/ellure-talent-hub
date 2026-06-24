-- Recruiter ResDex fixes: broader recruiter check, profile RPC, search index RLS, demo client link

CREATE OR REPLACE FUNCTION public.is_recruiter_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'client'::user_role
    )
    OR EXISTS (
      SELECT 1 FROM clients
      WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM client_team_members
      WHERE user_id = auth.uid()
        AND coalesce(status, 'active') = 'active'
    );
$$;

-- Recruiter profile view (consistent with search_applicants SECURITY DEFINER access)
CREATE OR REPLACE FUNCTION public.get_resdex_applicant_profile(p_applicant_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_row applicants%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT is_admin() AND NOT is_recruiter_user() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT * INTO v_row
  FROM applicants
  WHERE id = p_applicant_id
    AND coalesce(is_deleted, false) = false;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(v_row);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_resdex_applicant_profile(uuid) TO authenticated;

DROP POLICY IF EXISTS "Recruiters can read resdex search index" ON public.applicant_search_index;
CREATE POLICY "Recruiters can read resdex search index"
ON public.applicant_search_index
FOR SELECT
TO authenticated
USING (
  is_recruiter_user()
  AND EXISTS (
    SELECT 1 FROM applicants a
    WHERE a.id = applicant_search_index.applicant_id
      AND coalesce(a.is_deleted, false) = false
  )
);

-- Link demo recruiter login to a client org (if profile exists without client_id)
DO $$
DECLARE
  v_user_id uuid;
  v_client_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM profiles
  WHERE email = 'client.infosys@ellureconsulting.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  SELECT id INTO v_client_id FROM clients WHERE user_id = v_user_id LIMIT 1;

  IF v_client_id IS NULL THEN
    SELECT id INTO v_client_id FROM clients WHERE email = 'client.infosys@ellureconsulting.com' LIMIT 1;
  END IF;

  IF v_client_id IS NULL THEN
    INSERT INTO clients (
      company_name,
      email,
      user_id,
      is_active,
      subscription_status,
      subscription_plan,
      approved_at
    )
    VALUES (
      'Infosys (Demo)',
      'client.infosys@ellureconsulting.com',
      v_user_id,
      true,
      'active',
      'professional',
      now()
    )
    RETURNING id INTO v_client_id;
  ELSE
    UPDATE clients
    SET user_id = v_user_id,
        is_active = true,
        subscription_status = coalesce(subscription_status, 'active')
  WHERE id = v_client_id;
  END IF;

  UPDATE profiles
  SET client_id = v_client_id,
      role = 'client'::user_role
  WHERE id = v_user_id;
END $$;
