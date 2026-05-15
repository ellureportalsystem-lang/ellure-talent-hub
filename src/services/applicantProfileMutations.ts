import { supabase } from '@/lib/supabase';

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
    .update({ key_skills: keySkillsStr || null, updated_at: new Date().toISOString() })
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
      updated_at: new Date().toISOString(),
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
    .update({ key_skills: keySkillsStr || null, updated_at: new Date().toISOString() })
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
