-- Applicant dashboard: read own applications/views; manage profile child rows.

CREATE OR REPLACE FUNCTION public.owns_applicant_row(p_applicant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applicants a
    WHERE a.id = p_applicant_id
      AND a.user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.owns_applicant_row(uuid) TO authenticated;

-- job_applications: applicants read their own applications
DROP POLICY IF EXISTS "Applicants can read own job applications" ON public.job_applications;
CREATE POLICY "Applicants can read own job applications"
  ON public.job_applications
  FOR SELECT
  TO authenticated
  USING (public.owns_applicant_row(applicant_id));

-- profile_views: applicants read views on their profile
DROP POLICY IF EXISTS "Applicants can read own profile views" ON public.profile_views;
CREATE POLICY "Applicants can read own profile views"
  ON public.profile_views
  FOR SELECT
  TO authenticated
  USING (public.owns_applicant_row(applicant_id));

-- applicant_education: update + delete own rows
DROP POLICY IF EXISTS "Applicants can update their own education" ON public.applicant_education;
CREATE POLICY "Applicants can update their own education"
  ON public.applicant_education
  FOR UPDATE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id))
  WITH CHECK (public.owns_applicant_row(applicant_id));

DROP POLICY IF EXISTS "Applicants can delete their own education" ON public.applicant_education;
CREATE POLICY "Applicants can delete their own education"
  ON public.applicant_education
  FOR DELETE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id));

-- applicant_experience: update + delete own rows
DROP POLICY IF EXISTS "Applicants can update their own experience" ON public.applicant_experience;
CREATE POLICY "Applicants can update their own experience"
  ON public.applicant_experience
  FOR UPDATE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id))
  WITH CHECK (public.owns_applicant_row(applicant_id));

DROP POLICY IF EXISTS "Applicants can delete their own experience" ON public.applicant_experience;
CREATE POLICY "Applicants can delete their own experience"
  ON public.applicant_experience
  FOR DELETE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id));

-- applicant_skills: update + delete own rows
DROP POLICY IF EXISTS "Applicants can update their own skills" ON public.applicant_skills;
CREATE POLICY "Applicants can update their own skills"
  ON public.applicant_skills
  FOR UPDATE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id))
  WITH CHECK (public.owns_applicant_row(applicant_id));

DROP POLICY IF EXISTS "Applicants can delete their own skills" ON public.applicant_skills;
CREATE POLICY "Applicants can delete their own skills"
  ON public.applicant_skills
  FOR DELETE
  TO authenticated
  USING (public.owns_applicant_row(applicant_id));
