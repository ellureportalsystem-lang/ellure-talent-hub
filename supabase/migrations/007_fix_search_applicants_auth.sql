-- Fix search_applicants authorization for recruiters without profile.client_id
-- and allow full Resdex search (not limited to client_applicant_access unlocks)

CREATE OR REPLACE FUNCTION public.resolve_caller_client_id(p_client_id uuid DEFAULT NULL)
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_client_id uuid := p_client_id;
BEGIN
  IF v_client_id IS NOT NULL THEN
    RETURN v_client_id;
  END IF;

  SELECT coalesce(p.client_id, c.id)
  INTO v_client_id
  FROM profiles p
  LEFT JOIN clients c ON c.user_id = p.id
  WHERE p.id = auth.uid();

  IF v_client_id IS NULL THEN
    SELECT ctm.client_id
    INTO v_client_id
    FROM client_team_members ctm
    WHERE ctm.user_id = auth.uid()
      AND coalesce(ctm.status, 'active') = 'active'
    ORDER BY ctm.joined_at DESC NULLS LAST, ctm.invited_at DESC NULLS LAST
    LIMIT 1;
  END IF;

  RETURN v_client_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_client(p_client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT
    is_admin()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND client_id = p_client_id
    )
    OR EXISTS (
      SELECT 1 FROM clients
      WHERE id = p_client_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM client_team_members
      WHERE client_id = p_client_id
        AND user_id = auth.uid()
        AND coalesce(status, 'active') = 'active'
    );
$$;

-- search_applicants body updated via Supabase MCP (fix_search_applicants_auth)
-- Key changes:
-- 1. Auto-resolve client id from profile / clients.user_id / team members
-- 2. Allow role=client to search even when org link is missing
-- 3. Removed client_applicant_access filter so Resdex shows all matching candidates
