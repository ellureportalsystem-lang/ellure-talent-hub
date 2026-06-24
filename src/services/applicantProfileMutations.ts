import { supabase } from '@/lib/supabase';
import { applicantProfileTouchFields } from '@/lib/applicantProfileTimestamps';

/** Replace key skills: `applicant_skills` rows + `applicants.key_skills` (+ `profiles.key_skills` when linked). */
export async function syncApplicantSkillsFromChipList(
  applicantId: string,
  userId: string | null | undefined,
  skills: string[]
): Promise<{ error: string | null }> {
  const cleaned = skills.map((s) => s.trim()).filter(Boolean);
  const keySkillsStr = cleaned.join(', ');

  const { error: delErr } = await supabase.from('applicant_skills').delete().eq('applicant_id', applicantId);
  if (delErr) {
    return { error: delErr.message };
  }

  if (cleaned.length > 0) {
    const rows = cleaned.map((skill_name) => ({
      applicant_id: applicantId,
      skill_name,
      skill_type: 'technical',
      skill_level: 'intermediate',
    }));
    const { error: insErr } = await supabase.from('applicant_skills').insert(rows);
    if (insErr) {
      return { error: insErr.message };
    }
  }

  const { error: appErr } = await supabase
    .from('applicants')
    .update({ key_skills: keySkillsStr || null, ...applicantProfileTouchFields() })
    .eq('id', applicantId);
  if (appErr) {
    return { error: appErr.message };
  }

  if (userId) {
    const { error: profErr } = await supabase
      .from('profiles')
      .update({ key_skills: keySkillsStr || null, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (profErr) {
      return { error: profErr.message };
    }
  }

  return { error: null };
}

export async function deleteApplicantResume(
  applicantId: string,
  userId: string | null | undefined
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('applicants')
    .update({
      resume_file: null,
      upload_cv_any_format: null,
      ...applicantProfileTouchFields(),
    })
    .eq('id', applicantId);
  if (error) {
    return { error: error.message };
  }

  if (userId) {
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ resume_file: null, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (pErr) {
      return { error: pErr.message };
    }
  }

  return { error: null };
}

/** Short resume headline — stored on `profiles.headline` only (kept separate from long `summary`). */
export async function saveResumeHeadline(
  _applicantId: string,
  userId: string | null | undefined,
  headline: string
): Promise<{ error: string | null }> {
  const trimmed = headline.trim();

  if (!userId) {
    return { error: 'Profile is not linked to an account. Sign in with the same email to edit your headline.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ headline: trimmed || null, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteApplicantExperienceRow(rowId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('applicant_experience').delete().eq('id', rowId);
  return { error: error?.message ?? null };
}

export async function deleteApplicantEducationRow(rowId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('applicant_education').delete().eq('id', rowId);
  return { error: error?.message ?? null };
}

export async function deleteApplicantSkillRow(rowId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('applicant_skills').delete().eq('id', rowId);
  return { error: error?.message ?? null };
}

/** Rebuild `applicants.key_skills` from remaining `applicant_skills` rows (after single-row delete). */
export interface ExperienceFormData {
  id?: string;
  company_name: string;
  designation: string;
  employment_type?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  current_ctc?: string | null;
  notice_period?: string | null;
}

export interface EducationFormData {
  id?: string;
  education_level: string;
  institution_name: string;
  degree?: string | null;
  field_of_study?: string | null;
  passing_year?: number | null;
  percentage?: number | null;
  is_highest?: boolean;
}

export interface ProjectFormData {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  link?: string;
  githubLink?: string;
  teamSize?: number;
  duration?: string;
}

export interface PersonalDetailsFormData {
  date_of_birth?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  languages?: string[];
  address_line1?: string | null;
  city?: string | null;
}

export interface CareerPreferencesFormData {
  current_ctc?: number | null;
  current_ctc_not_disclosed?: boolean;
  expected_ctc?: number | null;
  notice_period?: string | null;
  job_role?: string | null;
  preferred_job_types?: string[];
  work_mode_preferences?: string[];
  industry_preferences?: string[];
  preferred_locations?: string[];
  open_to_relocate?: boolean;
  is_actively_looking?: boolean;
  current_industry?: string | null;
  preferred_industry?: string | null;
  functional_area?: string | null;
}

export interface ITSkillFormData {
  id?: string;
  skill_name: string;
  skill_level: string;
  years_of_experience?: number | null;
  skill_version?: string | null;
}

export async function upsertApplicantExperience(
  applicantId: string,
  data: ExperienceFormData
): Promise<{ error: string | null; id?: string }> {
  const row = {
    company_name: data.company_name.trim(),
    designation: data.designation.trim(),
    employment_type: data.employment_type || 'full-time',
    start_date: data.start_date || null,
    end_date: data.is_current ? null : data.end_date || null,
    is_current: data.is_current,
    description: data.description?.trim() || null,
    current_ctc: data.current_ctc?.trim() || null,
    notice_period: data.notice_period?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (data.is_current) {
    await supabase
      .from('applicant_experience')
      .update({ is_current: false })
      .eq('applicant_id', applicantId)
      .eq('is_current', true);
  }

  if (data.id) {
    const { error } = await supabase
      .from('applicant_experience')
      .update(row)
      .eq('id', data.id)
      .eq('applicant_id', applicantId);
    if (error) return { error: error.message };
    await syncApplicantSummaryFromExperience(applicantId);
    return { error: null, id: data.id };
  }

  const { data: inserted, error } = await supabase
    .from('applicant_experience')
    .insert({ applicant_id: applicantId, ...row })
    .select('id')
    .single();
  if (error) return { error: error.message };
  await syncApplicantSummaryFromExperience(applicantId);
  return { error: null, id: inserted?.id };
}

async function syncApplicantSummaryFromExperience(applicantId: string) {
  const { data: rows } = await supabase
    .from('applicant_experience')
    .select('company_name, designation, is_current, start_date, end_date')
    .eq('applicant_id', applicantId)
    .order('start_date', { ascending: false });

  const current = rows?.find((r) => r.is_current) ?? rows?.[0];
  let totalMonths = 0;
  for (const exp of rows ?? []) {
    if (!exp.start_date) continue;
    const start = new Date(exp.start_date);
    const end = exp.end_date ? new Date(exp.end_date) : new Date();
    totalMonths += Math.max(
      0,
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()
    ));
  }
  const totalYears = Math.round((totalMonths / 12) * 10) / 10;

  await supabase
    .from('applicants')
    .update({
      current_company: current?.company_name ?? null,
      current_designation: current?.designation ?? null,
      total_experience_years: totalYears,
      total_experience: String(totalYears),
      experience_type: rows?.length ? 'experienced' : 'fresher',
      ...applicantProfileTouchFields(),
    })
    .eq('id', applicantId);
}

export async function upsertApplicantEducation(
  applicantId: string,
  data: EducationFormData
): Promise<{ error: string | null; id?: string }> {
  const row = {
    education_level: data.education_level.trim(),
    institution_name: data.institution_name.trim(),
    degree_id: data.degree?.trim() || null,
    field_of_study: data.field_of_study?.trim() || null,
    passing_year: data.passing_year ?? null,
    percentage: data.percentage ?? null,
    is_highest: data.is_highest ?? false,
    updated_at: new Date().toISOString(),
  };

  if (data.is_highest) {
    await supabase
      .from('applicant_education')
      .update({ is_highest: false })
      .eq('applicant_id', applicantId);
  }

  if (data.id) {
    const { error } = await supabase
      .from('applicant_education')
      .update(row)
      .eq('id', data.id)
      .eq('applicant_id', applicantId);
    if (error) return { error: error.message };
    return { error: null, id: data.id };
  }

  const { data: inserted, error } = await supabase
    .from('applicant_education')
    .insert({ applicant_id: applicantId, ...row })
    .select('id')
    .single();
  if (error) return { error: error.message };
  return { error: null, id: inserted?.id };
}

export async function saveApplicantProjects(
  applicantId: string,
  projects: ProjectFormData[]
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('applicants')
    .update({ projects, ...applicantProfileTouchFields() })
    .eq('id', applicantId);
  return { error: error?.message ?? null };
}

export async function savePersonalDetails(
  applicantId: string,
  userId: string | null | undefined,
  data: PersonalDetailsFormData
): Promise<{ error: string | null }> {
  const languagesJson = data.languages?.length ? data.languages : null;
  const { error: appErr } = await supabase
    .from('applicants')
    .update({
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      marital_status: data.marital_status || null,
      languages_known: languagesJson,
      city: data.city?.trim() || undefined,
      city_current_location: data.city?.trim() || null,
      ...applicantProfileTouchFields(),
    })
    .eq('id', applicantId);
  if (appErr) return { error: appErr.message };

  if (data.address_line1?.trim()) {
    const { data: existingAddr } = await supabase
      .from('applicant_addresses')
      .select('id')
      .eq('applicant_id', applicantId)
      .eq('is_primary', true)
      .maybeSingle();

    if (existingAddr?.id) {
      await supabase
        .from('applicant_addresses')
        .update({ address_line1: data.address_line1.trim() })
        .eq('id', existingAddr.id);
    } else {
      await supabase.from('applicant_addresses').insert({
        applicant_id: applicantId,
        address_line1: data.address_line1.trim(),
        is_primary: true,
      });
    }
  }

  if (userId && data.city?.trim()) {
    await supabase
      .from('profiles')
      .update({ location: data.city.trim(), updated_at: new Date().toISOString() })
      .eq('id', userId);
  }

  return { error: null };
}

export async function saveCareerPreferences(
  applicantId: string,
  data: CareerPreferencesFormData
): Promise<{ error: string | null }> {
  const industryPrefs = [
    ...(data.current_industry?.trim() ? [data.current_industry.trim()] : []),
    ...(data.preferred_industry?.trim() ? [data.preferred_industry.trim()] : []),
    ...(data.industry_preferences || []),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const { error } = await supabase
    .from('applicants')
    .update({
      current_ctc: data.current_ctc_not_disclosed ? null : data.current_ctc ?? null,
      expected_ctc: data.expected_ctc ?? null,
      exp_ctc: data.expected_ctc != null ? String(data.expected_ctc) : null,
      notice_period: data.notice_period || null,
      job_role: data.functional_area?.trim() || data.job_role || null,
      skill_job_role_applying_for: data.job_role || data.functional_area || null,
      preferred_job_types: data.preferred_job_types || [],
      work_mode_preferences: data.work_mode_preferences || [],
      industry_preferences: industryPrefs.length ? industryPrefs : null,
      preferred_locations: data.preferred_locations || [],
      open_to_relocate: data.open_to_relocate ?? false,
      is_actively_looking: data.is_actively_looking ?? true,
      ...applicantProfileTouchFields(),
    })
    .eq('id', applicantId);
  return { error: error?.message ?? null };
}

export async function upsertApplicantITSkill(
  applicantId: string,
  userId: string | null | undefined,
  data: ITSkillFormData
): Promise<{ error: string | null; id?: string }> {
  const level = data.skill_level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced' | 'expert';
  const row = {
    skill_name: data.skill_name.trim(),
    skill_type: 'technical' as const,
    skill_level: level,
    years_of_experience: data.years_of_experience ?? null,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    const { error } = await supabase
      .from('applicant_skills')
      .update(row)
      .eq('id', data.id)
      .eq('applicant_id', applicantId);
    if (error) return { error: error.message };
    await resyncApplicantKeySkillsFromTable(applicantId, userId);
    return { error: null, id: data.id };
  }

  const { data: inserted, error } = await supabase
    .from('applicant_skills')
    .insert({ applicant_id: applicantId, ...row })
    .select('id')
    .single();
  if (error) return { error: error.message };
  await resyncApplicantKeySkillsFromTable(applicantId, userId);
  return { error: null, id: inserted?.id };
}

export async function resyncApplicantKeySkillsFromTable(
  applicantId: string,
  userId: string | null | undefined
): Promise<{ error: string | null }> {
  const { data: rows, error: selErr } = await supabase
    .from('applicant_skills')
    .select('skill_name')
    .eq('applicant_id', applicantId);
  if (selErr) {
    return { error: selErr.message };
  }
  const keySkillsStr = (rows || []).map((r) => r.skill_name).filter(Boolean).join(', ');
  const { error: appErr } = await supabase
    .from('applicants')
    .update({ key_skills: keySkillsStr || null, ...applicantProfileTouchFields() })
    .eq('id', applicantId);
  if (appErr) {
    return { error: appErr.message };
  }
  if (userId) {
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ key_skills: keySkillsStr || null, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (pErr) {
      return { error: pErr.message };
    }
  }
  return { error: null };
}
