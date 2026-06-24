import type { ApplicantStatus } from "@/types/database.types";
import { Constants } from "@/types/database.types";

export type ImportDbField =
  | "name"
  | "email"
  | "phone"
  | "city"
  | "job_role"
  | "current_designation"
  | "current_company"
  | "total_experience_years"
  | "experience_type"
  | "current_ctc"
  | "expected_ctc"
  | "notice_period"
  | "education_level"
  | "highest_qualification"
  | "course_degree_name"
  | "university_institute_name"
  | "year_of_passing"
  | "education_board"
  | "medium_of_study"
  | "key_skills"
  | "communication"
  | "gender"
  | "headline"
  | "status"
  | "registration_date"
  | "ignore";

export type ImportColumnDef = {
  field: ImportDbField;
  label: string;
  required: boolean;
  description: string;
  example?: string;
};

export const IMPORT_COLUMN_DEFS: ImportColumnDef[] = [
  { field: "name", label: "Name", required: true, description: "Full name of the candidate", example: "Jane Doe" },
  { field: "email", label: "Email", required: true, description: "Unique email address", example: "jane@example.com" },
  { field: "phone", label: "Phone", required: true, description: "10-digit mobile number", example: "9876543210" },
  { field: "city", label: "City", required: false, description: "Current city / location", example: "Pune" },
  { field: "job_role", label: "Job role", required: false, description: "Role the candidate is applying for", example: "Data Analyst" },
  { field: "current_designation", label: "Current designation", required: false, description: "Current job title", example: "Analyst" },
  { field: "current_company", label: "Current company", required: false, description: "Current employer", example: "Acme Corp" },
  { field: "total_experience_years", label: "Total experience (years)", required: false, description: "Numeric years of experience", example: "3" },
  { field: "experience_type", label: "Experience type", required: false, description: "Fresher, Junior, Mid-Level, Senior", example: "Mid-Level" },
  { field: "current_ctc", label: "Current CTC", required: false, description: "Current CTC in LPA (numeric)", example: "5" },
  { field: "expected_ctc", label: "Expected CTC", required: false, description: "Expected CTC in LPA (numeric)", example: "7" },
  { field: "notice_period", label: "Notice period", required: false, description: "Immediate, 15 Days, 30 Days, 60 Days, 90 Days", example: "30 Days" },
  { field: "education_level", label: "Education level", required: false, description: "Graduate, Post Graduate, Diploma, 12th, 10th", example: "Graduate" },
  { field: "highest_qualification", label: "Highest qualification", required: false, description: "Degree name", example: "B.Tech" },
  { field: "course_degree_name", label: "Course / degree", required: false, description: "Course or degree title", example: "B.Tech IT" },
  { field: "university_institute_name", label: "University / institute", required: false, description: "Institution name", example: "SPPU" },
  { field: "year_of_passing", label: "Year of passing", required: false, description: "Graduation year (numeric)", example: "2020" },
  { field: "education_board", label: "Education board", required: false, description: "Board name if applicable", example: "CBSE" },
  { field: "medium_of_study", label: "Medium of study", required: false, description: "English, Hindi, etc.", example: "English" },
  { field: "key_skills", label: "Key skills", required: false, description: "Comma-separated skills", example: "SQL, Python" },
  { field: "communication", label: "Communication", required: false, description: "Excellent, Good, Average, Poor", example: "Good" },
  { field: "gender", label: "Gender", required: false, description: "Male, Female, Other", example: "Female" },
  { field: "headline", label: "Headline", required: false, description: "Professional headline", example: "Data analyst with 3 yrs exp" },
  {
    field: "status",
    label: "Status",
    required: false,
    description: `Applicant status: ${Constants.public.Enums.applicant_status.join(", ")}`,
    example: "submitted",
  },
  { field: "registration_date", label: "Registration date", required: false, description: "YYYY-MM-DD", example: "2024-01-15" },
];

export const MAPPABLE_FIELDS = IMPORT_COLUMN_DEFS.map((c) => c.field);

const ALIAS_MAP: Record<ImportDbField, string[]> = {
  name: ["name", "full name", "full_name", "candidate name", "candidate_name"],
  email: ["email", "email address", "email_address", "e-mail"],
  phone: ["phone", "mobile", "mobile number", "mobile_number", "contact", "phone number"],
  city: ["city", "location", "current city", "city_current_location", "current location"],
  job_role: ["job role", "job_role", "role", "skill_job_role_applying_for", "applying for"],
  current_designation: ["current designation", "current_designation", "designation", "title"],
  current_company: ["current company", "current_company", "company", "employer"],
  total_experience_years: ["total experience", "total_experience_years", "total_experience", "experience years", "experience"],
  experience_type: ["experience type", "experience_type", "exp type"],
  current_ctc: ["current ctc", "current_ctc", "current ctc (lpa)", "ctc"],
  expected_ctc: ["expected ctc", "expected_ctc", "expected ctc (lpa)", "exp ctc"],
  notice_period: ["notice period", "notice_period", "notice", "np"],
  education_level: ["education level", "education_level", "education"],
  highest_qualification: ["highest qualification", "highest_qualification", "qualification"],
  course_degree_name: ["course", "course_degree_name", "course/degree", "degree", "course degree"],
  university_institute_name: ["university", "university_institute_name", "institute", "college"],
  year_of_passing: ["year of passing", "year_of_passing", "passing year", "passing_year", "yop"],
  education_board: ["education board", "education_board", "board"],
  medium_of_study: ["medium", "medium_of_study", "medium of study"],
  key_skills: ["key skills", "key_skills", "skills", "skill"],
  communication: ["communication", "comm skills", "communication skills"],
  gender: ["gender", "sex"],
  headline: ["headline", "profile headline", "summary headline"],
  status: ["status", "applicant status", "candidate status"],
  registration_date: ["registration date", "registration_date", "registered on", "date"],
  ignore: [],
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

export function autoDetectColumnMapping(headers: string[]): Record<string, ImportDbField> {
  const mapping: Record<string, ImportDbField> = {};
  const usedFields = new Set<ImportDbField>();

  for (const header of headers) {
    const norm = normalizeHeader(header);
    let matched: ImportDbField = "ignore";

    for (const [field, aliases] of Object.entries(ALIAS_MAP) as [ImportDbField, string[]][]) {
      if (field === "ignore") continue;
      if (aliases.some((a) => norm === a || norm.includes(a))) {
        if (!usedFields.has(field)) {
          matched = field;
          usedFields.add(field);
          break;
        }
      }
    }

    if (matched === "ignore" && MAPPABLE_FIELDS.includes(norm.replace(/ /g, "_") as ImportDbField)) {
      const f = norm.replace(/ /g, "_") as ImportDbField;
      if (!usedFields.has(f)) {
        matched = f;
        usedFields.add(f);
      }
    }

    mapping[header] = matched;
  }

  return mapping;
}

export function applyColumnMapping(
  rawRows: Record<string, unknown>[],
  mapping: Record<string, ImportDbField>
): Record<string, unknown>[] {
  return rawRows.map((row) => {
    const mapped: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(row)) {
      const field = mapping[header];
      if (!field || field === "ignore") continue;
      mapped[field] = value;
    }
    return mapped;
  });
}

export const APPLICANT_STATUS_VALUES = Constants.public.Enums.applicant_status as readonly ApplicantStatus[];

export function buildTemplateSampleRow(): Record<string, string | number> {
  const row: Record<string, string | number> = {};
  for (const col of IMPORT_COLUMN_DEFS) {
    if (col.example != null) row[col.field] = col.example;
  }
  return row;
}

export function buildTemplateHeaders(): string[] {
  return IMPORT_COLUMN_DEFS.filter((c) => c.field !== "ignore").map((c) => c.field);
}
