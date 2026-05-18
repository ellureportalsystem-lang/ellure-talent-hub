import { supabase } from "@/lib/supabase";
import { uploadApplicantProfileImage, uploadApplicantResume } from "@/lib/applicantMediaUpload";

export const REGISTRATION_STEPS = [
  { num: 1, path: "/auth/applicant-register/step-1", title: "Basic Info" },
  { num: 2, path: "/auth/applicant-register/step-2", title: "Contact & Location" },
  { num: 3, path: "/auth/applicant-register/step-3", title: "Education" },
  { num: 4, path: "/auth/applicant-register/step-4", title: "Work Experience" },
  { num: 5, path: "/auth/applicant-register/step-5", title: "Skills & Projects" },
  { num: 6, path: "/auth/applicant-register/step-6", title: "Career Preferences" },
  { num: 7, path: "/auth/applicant-register/step-7", title: "Documents & Links" },
  { num: 8, path: "/auth/applicant-register/step-8", title: "Review & Submit" },
] as const;

export async function getOrCreateApplicant(userId: string, email: string) {
  const { data: existing } = await supabase
    .from("applicants")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email")
    .eq("id", userId)
    .maybeSingle();

  const { data: created, error } = await supabase
    .from("applicants")
    .insert({
      user_id: userId,
      name: profile?.full_name || email.split("@")[0],
      email: email.toLowerCase(),
      phone: profile?.phone || null,
      status: "draft",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await supabase
    .from("profiles")
    .update({ applicant_id: created.id, role: "applicant" })
    .eq("id", userId);

  return created;
}

export async function refreshProfileCompletion(applicantId: string) {
  const { error } = await supabase.rpc("calculate_profile_completion", {
    applicant_uuid: applicantId,
  });
  if (error) console.warn("calculate_profile_completion:", error.message);
}

export async function createApplicantNotification(
  userId: string,
  title: string,
  message: string,
  type = "profile"
) {
  await supabase.rpc("create_notification", {
    p_user_id: userId,
    p_title: title,
    p_message: message,
    p_type: type,
    p_link: "/dashboard/applicant/profile",
  }).catch(() => {
    supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      link: "/dashboard/applicant/profile",
    });
  });
}

export async function sendEmailViaEdge(to: string, subject: string, html: string) {
  try {
    await supabase.functions.invoke("send-email", { body: { to, subject, html } });
  } catch (e) {
    console.warn("send-email skipped:", e);
  }
}

export interface Step1Payload {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus?: string;
  fatherName?: string;
  differentlyAbled?: boolean;
  avatarFile?: File;
}

export async function saveRegistrationStep1(
  userId: string,
  email: string,
  payload: Step1Payload
) {
  const applicant = await getOrCreateApplicant(userId, email);
  let avatarUrl: string | null = applicant.profile_image;

  if (payload.avatarFile) {
    avatarUrl = await uploadApplicantProfileImage(payload.avatarFile, {
      applicantId: applicant.id,
      authUserId: userId,
    });
  }

  const updates = {
    name: payload.fullName,
    full_name: payload.fullName,
    gender: payload.gender,
    date_of_birth: payload.dateOfBirth,
    dob: payload.dateOfBirth,
    marital_status: payload.maritalStatus || null,
    father_name: payload.fatherName || null,
    differently_abled: payload.differentlyAbled ?? false,
    profile_image: avatarUrl,
    updated_at: new Date().toISOString(),
  };

  await supabase.from("applicants").update(updates).eq("id", applicant.id);
  await supabase
    .from("profiles")
    .update({
      full_name: payload.fullName,
      avatar_url: avatarUrl,
      date_of_birth: payload.dateOfBirth,
      gender: payload.gender,
    })
    .eq("id", userId);

  await refreshProfileCompletion(applicant.id);
  return applicant.id;
}

export interface Step2Payload {
  phone: string;
  alternatePhone?: string;
  currentAddress?: string;
  pincode?: string;
  city: string;
  state?: string;
  permanentSameAsCurrent?: boolean;
  permanentAddress?: string;
  permanentPincode?: string;
  permanentCity?: string;
  preferredLocations?: string[];
  openToRelocate?: boolean;
}

export async function saveRegistrationStep2(
  applicantId: string,
  userId: string,
  payload: Step2Payload
) {
  await supabase
    .from("applicants")
    .update({
      phone: payload.phone,
      alternate_phone: payload.alternatePhone || null,
      city: payload.city,
      open_to_relocation: payload.openToRelocate ?? false,
      preferred_locations: payload.preferredLocations?.length
        ? payload.preferredLocations.join(", ")
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicantId);

  await supabase.from("profiles").update({ phone: payload.phone }).eq("id", userId);

  const { data: existingAddr } = await supabase
    .from("applicant_addresses")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("address_type", "current")
    .maybeSingle();

  const addrRow = {
    applicant_id: applicantId,
    address_type: "current",
    address_line1: payload.currentAddress || null,
    pincode: payload.pincode || null,
    city: payload.city,
    state: payload.state || null,
    is_primary: true,
  };

  if (existingAddr?.id) {
    await supabase.from("applicant_addresses").update(addrRow).eq("id", existingAddr.id);
  } else {
    await supabase.from("applicant_addresses").insert(addrRow);
  }

  if (!payload.permanentSameAsCurrent && payload.permanentAddress) {
    await supabase.from("applicant_addresses").upsert(
      {
        applicant_id: applicantId,
        address_type: "permanent",
        address_line1: payload.permanentAddress,
        pincode: payload.permanentPincode || null,
        city: payload.permanentCity || null,
        is_primary: false,
      },
      { onConflict: "applicant_id,address_type" }
    );
  }

  await refreshProfileCompletion(applicantId);
}

export interface EducationRow {
  degree?: string;
  course?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  boardName?: string;
  passingYear?: number;
  percentage?: number;
  gradeType?: string;
  mode?: string;
}

export interface CertificationRow {
  title: string;
  organization?: string;
  year?: number;
  credentialUrl?: string;
}

export async function saveRegistrationStep3(
  applicantId: string,
  education: EducationRow[],
  certifications: CertificationRow[]
) {
  await supabase.from("applicant_education").delete().eq("applicant_id", applicantId);

  if (education.length) {
    await supabase.from("applicant_education").insert(
      education.map((e, i) => ({
        applicant_id: applicantId,
        education_level: e.degree || e.course || "Other",
        degree_id: e.degree || null,
        course_id: e.course || null,
        field_of_study: e.fieldOfStudy || null,
        institution_name: e.institutionName || null,
        board_name: e.boardName || null,
        passing_year: e.passingYear || null,
        percentage: e.percentage || null,
        grade_type: e.gradeType || null,
        mode: e.mode || null,
        is_highest: i === 0,
      }))
    );
  }

  await supabase
    .from("applicant_achievements")
    .delete()
    .eq("applicant_id", applicantId)
    .eq("achievement_type", "certification");

  if (certifications.length) {
    await supabase.from("applicant_achievements").insert(
      certifications.map((c) => ({
        applicant_id: applicantId,
        achievement_type: "certification",
        title: c.title,
        organization: c.organization || null,
        year: c.year || null,
        url: c.credentialUrl || null,
      }))
    );
  }

  await refreshProfileCompletion(applicantId);
}

export interface ExperienceRow {
  companyName: string;
  designation: string;
  employmentType?: string;
  location?: string;
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  isCurrent?: boolean;
  department?: string;
  responsibilities?: string;
  skillsUsed?: string[];
  ctc?: number;
}

export async function saveRegistrationStep4(
  applicantId: string,
  isFresher: boolean,
  experiences: ExperienceRow[]
) {
  if (isFresher) {
    await supabase
      .from("applicants")
      .update({
        experience_type: "fresher",
        total_experience_years: 0,
        total_experience: "0",
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicantId);
    await supabase.from("applicant_experience").delete().eq("applicant_id", applicantId);
    await refreshProfileCompletion(applicantId);
    return;
  }

  await supabase.from("applicant_experience").delete().eq("applicant_id", applicantId);

  let totalMonths = 0;
  const rows = experiences.map((exp) => {
    const start = exp.startYear
      ? new Date(exp.startYear, (exp.startMonth || 1) - 1, 1)
      : null;
    const end = exp.isCurrent
      ? new Date()
      : exp.endYear
        ? new Date(exp.endYear, (exp.endMonth || 12) - 1, 1)
        : null;
    if (start && end) {
      totalMonths += Math.max(
        0,
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      );
    }
    return {
      applicant_id: applicantId,
      company_name: exp.companyName,
      designation: exp.designation,
      employment_type: exp.employmentType || null,
      city_id: exp.location || null,
      start_date: start?.toISOString().split("T")[0] || null,
      end_date: exp.isCurrent ? null : end?.toISOString().split("T")[0] || null,
      is_current: exp.isCurrent ?? false,
      department: exp.department || null,
      key_responsibilities: exp.responsibilities || null,
      skills_used: exp.skillsUsed || [],
      current_ctc: exp.ctc || null,
    };
  });

  if (rows.length) await supabase.from("applicant_experience").insert(rows);

  const totalYears = Math.round((totalMonths / 12) * 10) / 10;
  await supabase
    .from("applicants")
    .update({
      experience_type: "experienced",
      total_experience_years: totalYears,
      total_experience: String(totalYears),
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicantId);

  await refreshProfileCompletion(applicantId);
}

export interface ProjectRow {
  title: string;
  description?: string;
  role?: string;
  techStack?: string[];
  duration?: string;
  url?: string;
}

export async function saveRegistrationStep5(
  applicantId: string,
  userId: string,
  keySkills: string[],
  itSkills: { name: string; proficiency: string; years?: number }[],
  projects: ProjectRow[]
) {
  const keySkillsStr = keySkills.join(", ");
  await supabase
    .from("applicants")
    .update({
      key_skills: keySkills,
      projects: projects,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicantId);

  await supabase.from("profiles").update({ key_skills: keySkillsStr }).eq("id", userId);

  await supabase.from("applicant_skills").delete().eq("applicant_id", applicantId);

  const skillRows = [
    ...keySkills.map((s) => ({
      applicant_id: applicantId,
      skill_name: s,
      skill_type: "key",
      skill_level: "intermediate",
    })),
    ...itSkills.map((s) => ({
      applicant_id: applicantId,
      skill_name: s.name,
      skill_type: "technical",
      skill_level: s.proficiency.toLowerCase(),
      years_of_experience: s.years || null,
    })),
  ];

  if (skillRows.length) await supabase.from("applicant_skills").insert(skillRows);
  await refreshProfileCompletion(applicantId);
}

export interface Step6Payload {
  currentCtc?: number;
  currentCtcNotDisclosed?: boolean;
  expectedCtc?: number;
  noticePeriod?: string;
  preferredJobTypes?: string[];
  workModePreferences?: string[];
  jobRole?: string;
  industryPreferences?: string[];
  isActivelyLooking?: boolean;
}

export async function saveRegistrationStep6(applicantId: string, payload: Step6Payload) {
  await supabase
    .from("applicants")
    .update({
      current_ctc: payload.currentCtcNotDisclosed ? null : payload.currentCtc ?? null,
      expected_ctc: payload.expectedCtc ?? null,
      notice_period: payload.noticePeriod || null,
      preferred_job_types: payload.preferredJobTypes || [],
      work_mode_preferences: payload.workModePreferences || [],
      job_role: payload.jobRole || null,
      industry_preferences: payload.industryPreferences || [],
      is_actively_looking: payload.isActivelyLooking ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicantId);

  await supabase.rpc("update_applicant_search_index", { p_applicant_id: applicantId }).catch(() => {});
  await refreshProfileCompletion(applicantId);
}

export interface Step7Payload {
  resumeFile?: File;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  otherLinks?: { label: string; url: string }[];
}

export async function saveRegistrationStep7(
  applicantId: string,
  userId: string,
  payload: Step7Payload
) {
  let resumeUrl: string | undefined;
  if (payload.resumeFile) {
    resumeUrl = await uploadApplicantResume(payload.resumeFile, {
      applicantId,
      authUserId: userId,
    });
  }

  const updates: Record<string, unknown> = {
    linkedin_url: payload.linkedinUrl || null,
    github_url: payload.githubUrl || null,
    portfolio_url: payload.portfolioUrl || null,
    updated_at: new Date().toISOString(),
  };
  if (resumeUrl) {
    updates.resume_file = resumeUrl;
    updates.upload_cv_any_format = resumeUrl;
  }

  await supabase.from("applicants").update(updates).eq("id", applicantId);

  if (resumeUrl) {
    await supabase.from("profiles").update({ resume_file: resumeUrl }).eq("id", userId);
  }

  await refreshProfileCompletion(applicantId);
}

export async function submitRegistration(applicantId: string, userId: string, email: string) {
  await supabase
    .from("applicants")
    .update({ status: "submitted", updated_at: new Date().toISOString() })
    .eq("id", applicantId);

  await refreshProfileCompletion(applicantId);
  await createApplicantNotification(
    userId,
    "Profile submitted successfully",
    "Your profile has been submitted. Recruiters can now discover you."
  );
  await sendEmailViaEdge(
    email,
    "Welcome to Ellure NexHire",
    "<p>Your profile has been submitted successfully. Thank you for registering!</p>"
  );
}

export async function loadRegistrationData(userId: string) {
  const { data: applicant } = await supabase
    .from("applicants")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!applicant) return null;

  const [education, experience, skills, addresses, achievements] = await Promise.all([
    supabase.from("applicant_education").select("*").eq("applicant_id", applicant.id),
    supabase.from("applicant_experience").select("*").eq("applicant_id", applicant.id),
    supabase.from("applicant_skills").select("*").eq("applicant_id", applicant.id),
    supabase.from("applicant_addresses").select("*").eq("applicant_id", applicant.id),
    supabase
      .from("applicant_achievements")
      .select("*")
      .eq("applicant_id", applicant.id)
      .eq("achievement_type", "certification"),
  ]);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return {
    applicant,
    profile,
    education: education.data || [],
    experience: experience.data || [],
    skills: skills.data || [],
    addresses: addresses.data || [],
    certifications: achievements.data || [],
  };
}
