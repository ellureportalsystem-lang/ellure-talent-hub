-- Server-side imported vs self-registered filter for correct pagination totals.
-- Applied via Supabase MCP; kept in repo for version control.

CREATE OR REPLACE FUNCTION public.search_applicants(
  p_tsquery text DEFAULT NULL::text,
  p_experience_min numeric DEFAULT NULL::numeric,
  p_experience_max numeric DEFAULT NULL::numeric,
  p_current_ctc_min numeric DEFAULT NULL::numeric,
  p_current_ctc_max numeric DEFAULT NULL::numeric,
  p_expected_ctc_min numeric DEFAULT NULL::numeric,
  p_expected_ctc_max numeric DEFAULT NULL::numeric,
  p_notice_period_days integer[] DEFAULT NULL::integer[],
  p_cities text[] DEFAULT NULL::text[],
  p_education_levels text[] DEFAULT NULL::text[],
  p_skills text[] DEFAULT NULL::text[],
  p_companies text[] DEFAULT NULL::text[],
  p_job_roles text[] DEFAULT NULL::text[],
  p_gender text DEFAULT NULL::text,
  p_year_of_passing_min integer DEFAULT NULL::integer,
  p_year_of_passing_max integer DEFAULT NULL::integer,
  p_is_actively_looking boolean DEFAULT NULL::boolean,
  p_is_verified boolean DEFAULT NULL::boolean,
  p_has_resume boolean DEFAULT NULL::boolean,
  p_profile_complete_min integer DEFAULT NULL::integer,
  p_profile_complete_max integer DEFAULT NULL::integer,
  p_status text[] DEFAULT NULL::text[],
  p_registered_after timestamp with time zone DEFAULT NULL::timestamp with time zone,
  p_updated_after timestamp with time zone DEFAULT NULL::timestamp with time zone,
  p_experience_type text DEFAULT NULL::text,
  p_sort_field text DEFAULT 'relevance'::text,
  p_sort_dir text DEFAULT NULL::text,
  p_sort_order text DEFAULT 'desc'::text,
  p_page integer DEFAULT NULL::integer,
  p_page_size integer DEFAULT NULL::integer,
  p_limit integer DEFAULT 25,
  p_offset integer DEFAULT 0,
  p_client_id uuid DEFAULT NULL::uuid,
  p_is_old_applicant boolean DEFAULT NULL::boolean
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tsquery tsquery;
  v_sort_dir text := coalesce(p_sort_dir, p_sort_order, 'desc');
  v_limit int := coalesce(p_page_size, p_limit, 25);
  v_offset int := CASE WHEN p_page IS NOT NULL THEN greatest((p_page - 1) * v_limit, 0) ELSE greatest(p_offset, 0) END;
  v_cities text[];
  v_companies text[];
  v_job_roles text[];
  v_education text[];
  v_client_id uuid;
  v_is_recruiter boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_client_id := resolve_caller_client_id(p_client_id);
  v_is_recruiter := EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'client'
  );

  IF NOT is_admin() THEN
    IF v_client_id IS NOT NULL AND NOT can_access_client(v_client_id) THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;

    IF v_client_id IS NULL AND NOT v_is_recruiter THEN
      RAISE EXCEPTION 'Not authorized';
    END IF;
  END IF;

  IF p_tsquery IS NOT NULL AND trim(p_tsquery) <> '' THEN
    BEGIN
      v_tsquery := to_tsquery('english', p_tsquery);
    EXCEPTION WHEN OTHERS THEN
      v_tsquery := plainto_tsquery('english', p_tsquery);
    END;
  END IF;

  IF p_cities IS NOT NULL THEN
    SELECT array_agg(lower(trim(c))) INTO v_cities FROM unnest(p_cities) c WHERE trim(c) <> '';
  END IF;
  IF p_companies IS NOT NULL THEN
    SELECT array_agg('%' || trim(c) || '%') INTO v_companies FROM unnest(p_companies) c WHERE trim(c) <> '';
  END IF;
  IF p_job_roles IS NOT NULL THEN
    SELECT array_agg('%' || trim(r) || '%') INTO v_job_roles FROM unnest(p_job_roles) r WHERE trim(r) <> '';
  END IF;
  IF p_education_levels IS NOT NULL THEN
    SELECT array_agg(trim(e)) INTO v_education FROM unnest(p_education_levels) e WHERE trim(e) <> '';
  END IF;

  RETURN (
    WITH base AS (
      SELECT a.*,
        asi.experience_years AS idx_experience,
        asi.current_ctc AS idx_current_ctc,
        asi.notice_period_days AS idx_notice_days,
        asi.profile_complete_percent AS idx_profile_complete,
        asi.has_resume AS idx_has_resume,
        CASE WHEN v_tsquery IS NOT NULL THEN ts_rank(asi.combined_text, v_tsquery) ELSE 0 END AS search_rank
      FROM applicants a
      INNER JOIN applicant_search_index asi ON asi.applicant_id = a.id
      WHERE coalesce(a.is_deleted, false) = false
        AND (p_is_old_applicant IS NULL OR coalesce(a.is_old_applicant, false) = p_is_old_applicant)
        AND (v_tsquery IS NULL OR asi.combined_text @@ v_tsquery
          OR a.name ILIKE '%' || replace(p_tsquery, '&', ' ') || '%'
          OR coalesce(a.key_skills, '') ILIKE '%' || replace(p_tsquery, '&', ' ') || '%')
        AND (p_experience_min IS NULL OR asi.experience_years >= p_experience_min)
        AND (p_experience_max IS NULL OR asi.experience_years <= p_experience_max)
        AND (p_current_ctc_min IS NULL OR asi.current_ctc >= p_current_ctc_min)
        AND (p_current_ctc_max IS NULL OR asi.current_ctc <= p_current_ctc_max)
        AND (p_expected_ctc_min IS NULL OR asi.expected_ctc >= p_expected_ctc_min)
        AND (p_expected_ctc_max IS NULL OR asi.expected_ctc <= p_expected_ctc_max)
        AND (p_notice_period_days IS NULL OR asi.notice_period_days = ANY(p_notice_period_days))
        AND (v_cities IS NULL OR lower(coalesce(asi.location_city, '')) = ANY(v_cities)
          OR lower(coalesce(a.city, '')) = ANY(v_cities)
          OR lower(coalesce(a.city_current_location, '')) = ANY(v_cities))
        AND (v_education IS NULL OR asi.education_level = ANY(v_education) OR a.education_level = ANY(v_education)
          OR EXISTS (SELECT 1 FROM unnest(v_education) e WHERE coalesce(a.highest_qualification, '') ILIKE '%' || e || '%'))
        AND (p_skills IS NULL OR EXISTS (SELECT 1 FROM unnest(p_skills) sk WHERE coalesce(a.key_skills, '') ILIKE '%' || sk || '%' OR coalesce(asi.skills_text, '') ILIKE '%' || sk || '%'))
        AND (v_companies IS NULL OR EXISTS (SELECT 1 FROM unnest(v_companies) co WHERE coalesce(a.current_company, '') ILIKE co))
        AND (v_job_roles IS NULL OR EXISTS (SELECT 1 FROM unnest(v_job_roles) jr WHERE coalesce(a.job_role, '') ILIKE jr OR coalesce(a.skill_job_role_applying_for, '') ILIKE jr))
        AND (p_gender IS NULL OR lower(coalesce(a.gender::text, '')) = lower(p_gender))
        AND (p_year_of_passing_min IS NULL OR coalesce(a.passing_year, NULLIF(regexp_replace(coalesce(a.year_of_passing, ''), '[^0-9]', '', 'g'), '')::int) >= p_year_of_passing_min)
        AND (p_year_of_passing_max IS NULL OR coalesce(a.passing_year, NULLIF(regexp_replace(coalesce(a.year_of_passing, ''), '[^0-9]', '', 'g'), '')::int) <= p_year_of_passing_max)
        AND (p_is_actively_looking IS NULL OR coalesce(asi.is_actively_looking, a.is_actively_looking, true) = p_is_actively_looking)
        AND (p_is_verified IS NULL OR coalesce(a.is_verified, a.verified, false) = p_is_verified)
        AND (p_has_resume IS NULL OR coalesce(asi.has_resume, false) = p_has_resume)
        AND (p_profile_complete_min IS NULL OR coalesce(asi.profile_complete_percent, a.profile_complete_percent, 0) >= p_profile_complete_min)
        AND (p_profile_complete_max IS NULL OR coalesce(asi.profile_complete_percent, a.profile_complete_percent, 0) <= p_profile_complete_max)
        AND (p_status IS NULL OR a.status::text = ANY(p_status))
        AND (p_registered_after IS NULL OR a.created_at >= p_registered_after)
        AND (p_updated_after IS NULL OR a.updated_at >= p_updated_after)
        AND (p_experience_type IS NULL OR lower(coalesce(a.experience_type::text, '')) = lower(p_experience_type))
    ),
    counted AS (SELECT count(*)::bigint AS cnt FROM base),
    sorted AS (
      SELECT b.*, c.cnt AS total_count
      FROM base b
      CROSS JOIN counted c
      ORDER BY
        CASE WHEN p_sort_field = 'relevance' AND v_tsquery IS NOT NULL THEN b.search_rank END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'name' AND v_sort_dir = 'asc' THEN b.name END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'name' AND v_sort_dir = 'desc' THEN b.name END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'experience' AND v_sort_dir = 'asc' THEN b.idx_experience END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'experience' AND v_sort_dir = 'desc' THEN b.idx_experience END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'ctc' AND v_sort_dir = 'asc' THEN b.idx_current_ctc END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'ctc' AND v_sort_dir = 'desc' THEN b.idx_current_ctc END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'notice_period' AND v_sort_dir = 'asc' THEN b.idx_notice_days END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'notice_period' AND v_sort_dir = 'desc' THEN b.idx_notice_days END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'profile_complete_percent' AND v_sort_dir = 'asc' THEN b.idx_profile_complete END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'profile_complete_percent' AND v_sort_dir = 'desc' THEN b.idx_profile_complete END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'registered_at' AND v_sort_dir = 'asc' THEN b.created_at END ASC NULLS LAST,
        CASE WHEN p_sort_field = 'registered_at' AND v_sort_dir = 'desc' THEN b.created_at END DESC NULLS LAST,
        CASE WHEN p_sort_field = 'updated_at' AND v_sort_dir = 'asc' THEN b.updated_at END ASC NULLS LAST,
        b.updated_at DESC NULLS LAST
      LIMIT greatest(v_limit, 1) OFFSET v_offset
    )
    SELECT jsonb_build_object(
      'total', coalesce((SELECT cnt FROM counted), 0),
      'rows', coalesce((SELECT jsonb_agg(to_jsonb(s) - 'search_rank' - 'idx_experience' - 'idx_current_ctc' - 'idx_notice_days' - 'idx_profile_complete' - 'idx_has_resume' - 'total_count') FROM sorted s), '[]'::jsonb)
    )
  );
END;
$function$;

-- Remove legacy overload (without p_is_old_applicant) if it still exists.
DROP FUNCTION IF EXISTS public.search_applicants(
  text, numeric, numeric, numeric, numeric, numeric, numeric, integer[], text[], text[], text[], text[], text[], text, integer, integer, boolean, boolean, boolean, integer, integer, text[], timestamptz, timestamptz, text, text, text, text, integer, integer, integer, integer, uuid
);
