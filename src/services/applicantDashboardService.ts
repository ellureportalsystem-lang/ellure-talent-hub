import { supabase } from "@/lib/supabase";
import { formatDateTimeIST } from "@/lib/dateFormat";
import { getApplicantLastUpdated } from "@/lib/applicantProfileTimestamps";

export type ProfileChecklistItem = {
  key: string;
  label: string;
  done: boolean;
  href: string;
};

export async function fetchApplicantProfileChecklist(applicantId: string): Promise<ProfileChecklistItem[]> {
  const [applicantRes, skillsRes, expRes, eduRes] = await Promise.all([
    supabase
      .from("applicants")
      .select("phone, resume_file, profile_image, headline, summary")
      .eq("id", applicantId)
      .single(),
    supabase.from("applicant_skills").select("id", { count: "exact", head: true }).eq("applicant_id", applicantId),
    supabase.from("applicant_experience").select("id", { count: "exact", head: true }).eq("applicant_id", applicantId),
    supabase.from("applicant_education").select("id", { count: "exact", head: true }).eq("applicant_id", applicantId),
  ]);

  const a = applicantRes.data;
  const base = "/dashboard/applicant";

  return [
    { key: "phone", label: "Phone number", done: Boolean(a?.phone), href: `${base}#personal` },
    { key: "resume", label: "Resume uploaded", done: Boolean(a?.resume_file), href: `${base}#resume` },
    {
      key: "skills",
      label: "Skills added",
      done: (skillsRes.count ?? 0) > 0,
      href: `${base}#skills`,
    },
    {
      key: "experience",
      label: "Work experience",
      done: (expRes.count ?? 0) > 0,
      href: `${base}#experience`,
    },
    {
      key: "education",
      label: "Education details",
      done: (eduRes.count ?? 0) > 0,
      href: `${base}#education`,
    },
    { key: "photo", label: "Profile photo", done: Boolean(a?.profile_image), href: `${base}#personal` },
    {
      key: "headline",
      label: "Headline or summary",
      done: Boolean(a?.headline || a?.summary),
      href: `${base}#personal`,
    },
  ];
}

export type ApplicantActivityItem = {
  id: string;
  action: string;
  time: string;
  type: "default" | "success" | "info";
};

type ActivityDraft = ApplicantActivityItem & { sortAt: number };

export async function fetchApplicantRecentActivity(applicantId: string, limit = 5): Promise<ApplicantActivityItem[]> {
  const items: ActivityDraft[] = [];

  const [viewsRes, appsRes, applicantRes] = await Promise.all([
    supabase
      .from("profile_views")
      .select("id, viewed_at, viewer_type")
      .eq("applicant_id", applicantId)
      .order("viewed_at", { ascending: false })
      .limit(limit),
    supabase
      .from("job_applications")
      .select("id, applied_at, current_stage, stage_updated_at")
      .eq("applicant_id", applicantId)
      .order("applied_at", { ascending: false })
      .limit(limit),
    supabase
      .from("applicants")
      .select("updated_at, last_profile_updated_at, created_at")
      .eq("id", applicantId)
      .single(),
  ]);

  viewsRes.data?.forEach((v) => {
    if (!v.viewed_at) return;
    const viewedAt = new Date(v.viewed_at).getTime();
    items.push({
      id: `view-${v.id}`,
      action: `Profile viewed by ${v.viewer_type ?? "recruiter"}`,
      time: formatDateTimeIST(v.viewed_at),
      sortAt: viewedAt,
      type: "info",
    });
  });

  appsRes.data?.forEach((app) => {
    const stage = app.current_stage ?? "applied";
    const sortIso = app.stage_updated_at ?? app.applied_at;
    if (!sortIso) return;
    const sortAt = new Date(sortIso).getTime();
    items.push({
      id: `app-${app.id}`,
      action:
        stage === "shortlisted"
          ? "Shortlisted for a role"
          : stage === "rejected"
            ? "Application not selected"
            : "Application submitted",
      time: formatDateTimeIST(app.applied_at ?? sortIso),
      sortAt,
      type: stage === "shortlisted" ? "success" : "default",
    });
  });

  const profileUpdatedAt = getApplicantLastUpdated(applicantRes.data);
  if (profileUpdatedAt) {
    items.push({
      id: "profile-update",
      action: "Profile updated",
      time: formatDateTimeIST(profileUpdatedAt),
      sortAt: new Date(profileUpdatedAt).getTime(),
      type: "default",
    });
  }

  return items
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, limit)
    .map(({ sortAt: _sortAt, ...item }) => item);
}
