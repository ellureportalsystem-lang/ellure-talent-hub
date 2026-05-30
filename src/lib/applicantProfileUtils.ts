export type ApplicantRow = Record<string, unknown>;

export function parseSkills(raw: unknown): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isResumeUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.trim();
  if (!v || v.toLowerCase() === "pdf") return false;
  return v.startsWith("http") || v.includes("/");
}

export function formatExperience(row: ApplicantRow): string {
  const years = row.total_experience_years;
  if (years != null && years !== "") return `${years} yrs`;
  const legacy = row.total_experience_numbers || row.total_experience;
  if (legacy) {
    const n = parseFloat(String(legacy));
    if (!Number.isNaN(n) && n > 0 && n < 80) return `${n} yrs`;
    if (String(legacy).trim()) return String(legacy).trim();
  }
  return "—";
}

export function formatCtc(...values: unknown[]): string {
  for (const v of values) {
    if (v == null || v === "") continue;
    const s = String(v).trim();
    if (s) return s.includes("LPA") || s.includes("L") ? s : `${s} LPA`;
  }
  return "—";
}

export function formatDate(value: unknown): string {
  if (!value) return "—";
  try {
    return new Date(String(value)).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function getResumeUrl(applicant: ApplicantRow): string | null {
  const resumeFile = String(applicant.resume_file || "");
  const uploadCv = String(applicant.upload_cv_any_format || "");
  if (isResumeUrl(resumeFile)) return resumeFile;
  if (isResumeUrl(uploadCv)) return uploadCv;
  return null;
}

export function buildEducationDisplay(applicant: ApplicantRow, education: ApplicantRow[]) {
  if (education.length > 0) {
    return education.map((e) => ({
      id: String(e.id),
      title: String(
        e.institution_name || e.education_level || applicant.university_institute_name || "Education"
      ),
      detail: [
        e.degree_id || e.field_of_study || applicant.course_degree_name,
        e.passing_year ? `Class of ${e.passing_year}` : applicant.year_of_passing,
      ]
        .filter(Boolean)
        .join(" · "),
    }));
  }
  if (applicant.education_level || applicant.highest_qualification) {
    return [
      {
        id: "flat-edu",
        title: String(applicant.highest_qualification || applicant.education_level),
        detail: [
          applicant.course_degree_name || applicant.course_degree,
          applicant.university_institute_name || applicant.university,
          applicant.year_of_passing || applicant.passing_year,
        ]
          .filter(Boolean)
          .join(" · "),
      },
    ];
  }
  return [];
}

export function buildExperienceDisplay(applicant: ApplicantRow, experience: ApplicantRow[]) {
  if (experience.length > 0) {
    return experience.map((e) => ({
      id: String(e.id),
      title: String(e.designation || "Role"),
      company: String(e.company_name || "—"),
      current: Boolean(e.is_current),
    }));
  }
  if (applicant.current_company || applicant.current_designation) {
    return [
      {
        id: "flat-exp",
        title: String(applicant.current_designation || "Current role"),
        company: String(applicant.current_company || "—"),
        current: true,
      },
    ];
  }
  return [];
}
