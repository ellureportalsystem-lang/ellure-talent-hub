-- Allow recruiters (role=client) to read applicant profiles for Resdex browse.
-- Contact masking remains in the UI until CV unlock.

CREATE OR REPLACE FUNCTION public.is_recruiter_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'client'::user_role
  );
$$;

CREATE POLICY "Recruiters can browse resdex applicants"
ON public.applicants
FOR SELECT
TO authenticated
USING (
  is_recruiter_user()
  AND coalesce(is_deleted, false) = false
);

CREATE POLICY "Recruiters can browse applicant education"
ON public.applicant_education
FOR SELECT
TO authenticated
USING (
  is_recruiter_user()
  AND EXISTS (
    SELECT 1 FROM applicants a
    WHERE a.id = applicant_education.applicant_id
      AND coalesce(a.is_deleted, false) = false
  )
);

CREATE POLICY "Recruiters can browse applicant experience"
ON public.applicant_experience
FOR SELECT
TO authenticated
USING (
  is_recruiter_user()
  AND EXISTS (
    SELECT 1 FROM applicants a
    WHERE a.id = applicant_experience.applicant_id
      AND coalesce(a.is_deleted, false) = false
  )
);

CREATE POLICY "Recruiters can browse applicant skills"
ON public.applicant_skills
FOR SELECT
TO authenticated
USING (
  is_recruiter_user()
  AND EXISTS (
    SELECT 1 FROM applicants a
    WHERE a.id = applicant_skills.applicant_id
      AND coalesce(a.is_deleted, false) = false
  )
);
