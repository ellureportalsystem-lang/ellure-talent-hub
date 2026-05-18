import { supabase } from "@/lib/supabase";

export type JobStatus = "draft" | "active" | "paused" | "closed";
export type ApplicationStage =
  | "applied"
  | "screening"
  | "interview_scheduled"
  | "offered"
  | "hired"
  | "rejected";

export interface JobFormData {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  jobType: string;
  workMode: string;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryDisclosed?: boolean;
  city?: string;
  state?: string;
  skillsRequired: string[];
  educationRequired?: string;
  openings?: number;
  applicationDeadline?: string;
  status: JobStatus;
  clientId?: string;
  featured?: boolean;
  featuredUntil?: string;
}

export async function fetchJobsForClient(clientId: string, status?: string) {
  let q = supabase
    .from("jobs")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchAllJobs(filters?: {
  status?: string;
  clientId?: string;
  jobType?: string;
  fromDate?: string;
  toDate?: string;
}) {
  let q = supabase.from("jobs").select("*, clients(company_name)").order("created_at", { ascending: false });
  if (filters?.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters?.clientId) q = q.eq("client_id", filters.clientId);
  if (filters?.jobType) q = q.eq("job_type", filters.jobType);
  if (filters?.fromDate) q = q.gte("created_at", filters.fromDate);
  if (filters?.toDate) q = q.lte("created_at", filters.toDate);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchActiveJobs(params?: {
  search?: string;
  city?: string;
  jobTypes?: string[];
  workModes?: string[];
  expMin?: number;
  expMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  postedWithinDays?: number;
  skills?: string[];
  limit?: number;
  offset?: number;
}) {
  let q = supabase
    .from("jobs")
    .select("*, clients(company_name)")
    .eq("status", "active")
    .order("published_at", { ascending: false });

  if (params?.city) q = q.ilike("city", `%${params.city}%`);
  if (params?.jobTypes?.length) q = q.in("job_type", params.jobTypes);
  if (params?.workModes?.length) q = q.in("work_mode", params.workModes);
  if (params?.expMin != null) q = q.gte("experience_max", params.expMin);
  if (params?.expMax != null) q = q.lte("experience_min", params.expMax);
  if (params?.postedWithinDays) {
    const d = new Date();
    d.setDate(d.getDate() - params.postedWithinDays);
    q = q.gte("published_at", d.toISOString());
  }
  if (params?.search) {
    q = q.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }

  const limit = params?.limit ?? 20;
  const offset = params?.offset ?? 0;
  q = q.range(offset, offset + limit - 1);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchJobById(jobId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*, clients(company_name, id)")
    .eq("id", jobId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function upsertJob(
  form: JobFormData,
  postedBy: string,
  jobId?: string
) {
  const row: Record<string, unknown> = {
    title: form.title,
    description: form.description,
    requirements: form.requirements || null,
    responsibilities: form.responsibilities || null,
    job_type: form.jobType,
    work_mode: form.workMode,
    experience_min: form.experienceMin ?? null,
    experience_max: form.experienceMax ?? null,
    salary_min: form.salaryDisclosed === false ? null : form.salaryMin ?? null,
    salary_max: form.salaryDisclosed === false ? null : form.salaryMax ?? null,
    salary_disclosed: form.salaryDisclosed !== false,
    city: form.city || null,
    state: form.state || null,
    skills_required: form.skillsRequired,
    education_required: form.educationRequired || null,
    openings: form.openings ?? 1,
    application_deadline: form.applicationDeadline || null,
    status: form.status,
    client_id: form.clientId || null,
    posted_by: postedBy,
    is_featured: form.featured ?? false,
    featured_until: form.featuredUntil || null,
    updated_at: new Date().toISOString(),
  };

  if (form.status === "active" && !jobId) {
    row.published_at = new Date().toISOString();
  }

  if (jobId) {
    const { data, error } = await supabase.from("jobs").update(row).eq("id", jobId).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase.from("jobs").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (status === "active") updates.published_at = new Date().toISOString();
  const { error } = await supabase.from("jobs").update(updates).eq("id", jobId);
  if (error) throw new Error(error.message);
}

export async function softDeleteJob(jobId: string) {
  const { error } = await supabase
    .from("jobs")
    .update({ status: "closed", deleted_at: new Date().toISOString() })
    .eq("id", jobId);
  if (error) throw new Error(error.message);
}

export async function fetchJobApplications(jobId: string) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*, applicants(id, name, profile_image, key_skills, total_experience_years, city)")
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function moveApplicationStage(
  applicationId: string,
  newStage: ApplicationStage,
  movedBy: string,
  applicantUserId?: string,
  jobTitle?: string
) {
  const { error } = await supabase
    .from("job_applications")
    .update({
      current_stage: newStage,
      status: newStage === "rejected" ? "rejected" : newStage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  await supabase.from("job_application_stages").insert({
    application_id: applicationId,
    stage: newStage,
    moved_by: movedBy,
    moved_at: new Date().toISOString(),
  });

  if (applicantUserId && jobTitle) {
    await supabase.rpc("create_notification", {
      p_user_id: applicantUserId,
      p_title: "Application update",
      p_message: `Your application for ${jobTitle} moved to ${newStage.replace(/_/g, " ")}`,
      p_type: "application",
      p_link: "/dashboard/applicant/applications",
    }).catch(() => {});
  }
}

export async function applyToJob(params: {
  jobId: string;
  applicantId: string;
  userId: string;
  resumeUrl?: string;
  coverLetter?: string;
  jobTitle: string;
  posterUserId?: string;
}) {
  const { data: existing } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", params.jobId)
    .eq("applicant_id", params.applicantId)
    .maybeSingle();

  if (existing) throw new Error("You have already applied to this job");

  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      job_id: params.jobId,
      applicant_id: params.applicantId,
      status: "applied",
      current_stage: "applied",
      resume_url: params.resumeUrl || null,
      cover_letter: params.coverLetter || null,
      applied_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.rpc("increment_job_applications", { p_job_id: params.jobId }).catch(async () => {
    const { data: job } = await supabase.from("jobs").select("applications_count").eq("id", params.jobId).single();
    await supabase
      .from("jobs")
      .update({ applications_count: (job?.applications_count || 0) + 1 })
      .eq("id", params.jobId);
  });

  await supabase.rpc("create_notification", {
    p_user_id: params.userId,
    p_title: "Application submitted",
    p_message: `Application submitted for ${params.jobTitle}`,
    p_type: "application",
    p_link: "/dashboard/applicant/applications",
  }).catch(() => {});

  if (params.posterUserId) {
    await supabase.rpc("create_notification", {
      p_user_id: params.posterUserId,
      p_title: "New application",
      p_message: `New application received for ${params.jobTitle}`,
      p_type: "application",
      p_link: `/dashboard/client/jobs`,
    }).catch(() => {});
  }

  return data;
}

export async function fetchApplicantApplications(applicantId: string) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*, jobs(id, title, city, job_type, work_mode, clients(company_name))")
    .eq("applicant_id", applicantId)
    .order("applied_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchSavedJobs(applicantId: string) {
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, jobs(*, clients(company_name))")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function toggleSavedJob(applicantId: string, jobId: string) {
  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("job_id", jobId)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_jobs").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("saved_jobs").insert({ applicant_id: applicantId, job_id: jobId });
  return true;
}

export async function fetchJobAlerts(applicantId: string) {
  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function upsertJobAlert(
  applicantId: string,
  alert: {
    id?: string;
    keywords?: string[];
    locations?: string[];
    experienceMin?: number;
    experienceMax?: number;
    jobTypes?: string[];
    frequency?: string;
    isActive?: boolean;
  }
) {
  const row = {
    applicant_id: applicantId,
    keywords: alert.keywords || [],
    locations: alert.locations || [],
    experience_min: alert.experienceMin ?? null,
    experience_max: alert.experienceMax ?? null,
    job_types: alert.jobTypes || [],
    frequency: alert.frequency || "weekly",
    is_active: alert.isActive ?? true,
  };

  if (alert.id) {
    const { data, error } = await supabase.from("job_alerts").update(row).eq("id", alert.id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase.from("job_alerts").insert(row).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteJobAlert(alertId: string) {
  const { error } = await supabase.from("job_alerts").delete().eq("id", alertId);
  if (error) throw new Error(error.message);
}
