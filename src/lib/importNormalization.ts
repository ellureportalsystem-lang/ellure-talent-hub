/** Shared normalization for Excel/CSV applicant imports */

import { APPLICANT_STATUS_VALUES } from "@/lib/importColumnMap";

export type ValidationLevel = "valid" | "warning" | "error";

export interface RowValidation {
  level: ValidationLevel;
  errors: string[];
  warnings: string[];
}

export interface ImportRow {
  name: string;
  email: string;
  phone: string;
  city: string;
  job_role?: string;
  current_designation?: string;
  current_company?: string;
  total_experience_years?: number;
  experience_type?: string;
  current_ctc?: string;
  expected_ctc?: string;
  notice_period?: string;
  notice_period_days?: number;
  education_level?: string;
  highest_qualification?: string;
  course_degree_name?: string;
  university_institute_name?: string;
  year_of_passing?: number;
  education_board?: string;
  medium_of_study?: string;
  key_skills?: string;
  communication?: string;
  registration_date?: string;
  gender?: string;
  headline?: string;
  status?: string;
}

const NOTICE_MAP: Record<string, { label: string; days: number }> = {
  immediate: { label: "Immediate", days: 0 },
  "15 days": { label: "15 Days", days: 15 },
  "15days": { label: "15 Days", days: 15 },
  "30 days": { label: "30 Days", days: 30 },
  "30days": { label: "30 Days", days: 30 },
  "1 month": { label: "30 Days", days: 30 },
  "1month": { label: "30 Days", days: 30 },
  "45 days": { label: "45 Days", days: 45 },
  "60 days": { label: "60 Days", days: 60 },
  "60days": { label: "60 Days", days: 60 },
  "2 months": { label: "60 Days", days: 60 },
  "2months": { label: "60 Days", days: 60 },
  "90 days": { label: "90 Days", days: 90 },
  "3 months": { label: "90 Days", days: 90 },
};

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

export function parseExperienceYears(raw: string): number | undefined {
  const t = raw.toLowerCase().trim();
  if (!t || /fresher/i.test(t)) return 0;
  if (/month/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    if (!m) return undefined;
    const months = parseFloat(m[1]);
    if (months > 480) return undefined;
    return Math.round((months / 12) * 10) / 10;
  }
  const m = t.match(/([\d.]+)/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  if (n > 40) return undefined;
  return n;
}

export function parseCtcLpa(raw: string): { text: string; numeric?: number } {
  const t = raw.toLowerCase().trim();
  if (!t) return { text: "" };
  if (/lpa/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    if (!m) return { text: raw };
    const n = parseFloat(m[1]);
    return { text: `${n} LPA`, numeric: n };
  }
  if (/k\b/i.test(t)) {
    const m = t.match(/([\d.]+)/);
    if (!m) return { text: raw };
    const n = Math.round((parseFloat(m[1]) * 12000) / 100000 * 100) / 100;
    return { text: `${n} LPA`, numeric: n };
  }
  const digits = t.replace(/[^0-9.]/g, "");
  if (!digits) return { text: raw };
  const n = parseFloat(digits);
  if (n > 1000) {
    const lpa = Math.round((n / 100000) * 100) / 100;
    return { text: `${lpa} LPA`, numeric: lpa };
  }
  return { text: `${n} LPA`, numeric: n };
}

export function normalizeNoticePeriod(raw: string): { label: string; days: number } {
  const key = raw.toLowerCase().replace(/\s+/g, " ").trim();
  if (!key || /fresher/i.test(key)) return { label: "Immediate", days: 0 };
  if (/serving|negotiable/i.test(key)) return { label: "30 Days", days: 30 };
  const direct = NOTICE_MAP[key.replace(/\s/g, "")] ?? NOTICE_MAP[key];
  if (direct) return direct;
  if (/15/.test(key)) return NOTICE_MAP["15 days"];
  if (/45/.test(key)) return NOTICE_MAP["45 days"];
  if (/90|3\s*month/.test(key)) return NOTICE_MAP["90 days"];
  if (/60|2\s*month/.test(key)) return NOTICE_MAP["60 days"];
  if (/30|1\s*month/.test(key)) return NOTICE_MAP["30 days"];
  return { label: "30 Days", days: 30 };
}

export function normalizeEducationLevel(raw: string): string {
  const t = raw.toLowerCase();
  if (!t) return "Graduate";
  if (/ph\.?d|doctorate/.test(t)) return "Doctorate";
  if (/m\.?tech|mba|mca|masters|post.?grad|pgd/.test(t)) return "Post Graduate";
  if (/b\.?tech|bachelor|bca|bba|b\.?com|b\.?sc|graduat|be\b/.test(t)) return "Graduate";
  if (/diploma/.test(t)) return "Diploma";
  if (/12th|xii|hsc/.test(t)) return "12th";
  if (/10th|x\b|ssc/.test(t)) return "10th";
  return "Graduate";
}

export function normalizeCommunication(raw: string): string {
  const t = raw.toLowerCase().trim();
  if (!t) return "";
  if (/excellent|very good|5/.test(t)) return "Excellent";
  if (/good|above|4/.test(t)) return "Good";
  if (/average|3/.test(t)) return "Average";
  if (/poor|below|2|1/.test(t)) return "Below Average";
  return raw.trim();
}

function col(raw: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = raw[k];
    if (v != null && String(v).trim()) return str(v);
  }
  return "";
}

export function normalizeImportRow(raw: Record<string, unknown>): ImportRow {
  const email = col(raw, "email", "Email", "email_address").toLowerCase();
  const expRaw = col(raw, "total_experience_years", "total_experience", "total_experience_numbers", "experience");
  const expNum =
    typeof raw.total_experience_years === "number"
      ? (raw.total_experience_years as number)
      : parseExperienceYears(expRaw);

  const noticeRaw = col(raw, "notice_period", "Notice Period");
  const notice = normalizeNoticePeriod(noticeRaw);

  const currentCtcRaw = col(raw, "current_ctc", "current_ctc (LPA)", "Current CTC");
  const expectedCtcRaw = col(raw, "expected_ctc", "expected_ctc (LPA)", "Expected CTC");
  const currentCtc = parseCtcLpa(currentCtcRaw);
  const expectedCtc = parseCtcLpa(expectedCtcRaw);

  const eduRaw = col(raw, "education_level", "highest_qualification", "Education Level");
  const yearRaw = col(raw, "year_of_passing", "passing_year", "Year of Passing");

  return {
    name: col(raw, "name", "Name", "full_name"),
    email,
    phone: col(raw, "phone", "Phone", "mobile", "mobile_number"),
    city: col(raw, "city", "City", "city_current_location"),
    job_role: col(raw, "job_role", "Job Role", "skill_job_role_applying_for"),
    current_designation: col(raw, "current_designation", "Current Designation"),
    current_company: col(raw, "current_company", "Current Company"),
    total_experience_years: expNum,
    experience_type: col(raw, "experience_type", "Experience Type") || (expNum === 0 ? "Fresher" : undefined),
    current_ctc: currentCtc.text || currentCtcRaw,
    expected_ctc: expectedCtc.text || expectedCtcRaw,
    notice_period: notice.label,
    notice_period_days: notice.days,
    education_level: normalizeEducationLevel(eduRaw),
    highest_qualification: col(raw, "highest_qualification", "Highest Qualification") || eduRaw,
    course_degree_name: col(raw, "course_degree_name", "course_degree", "Course/Degree"),
    university_institute_name: col(raw, "university_institute_name", "university", "University"),
    year_of_passing: yearRaw ? parseInt(yearRaw, 10) : undefined,
    education_board: col(raw, "education_board", "Education Board"),
    medium_of_study: col(raw, "medium_of_study", "medium", "Medium"),
    key_skills: col(raw, "key_skills", "Key Skills", "skills"),
    communication: normalizeCommunication(col(raw, "communication", "Communication")),
    registration_date: col(raw, "registration_date", "Registration Date", "date"),
    gender: col(raw, "gender", "Gender"),
    headline: col(raw, "headline", "Headline"),
    status: col(raw, "status", "Status").toLowerCase().replace(/\s+/g, "_") || undefined,
  };
}

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "").slice(-10);
}

export function validateImportRowDetailed(
  row: ImportRow,
  options?: { existingEmails?: Set<string>; fileDuplicateEmails?: Set<string> }
): RowValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!row.name?.trim()) errors.push("Name is required");

  if (!row.email?.trim()) errors.push("Email is required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push("Invalid email format");
  else {
    if (options?.fileDuplicateEmails?.has(row.email.toLowerCase())) {
      errors.push("Duplicate email in file");
    } else if (options?.existingEmails?.has(row.email.toLowerCase())) {
      warnings.push("Email already exists in database");
    }
  }

  if (!row.phone?.trim()) errors.push("Phone is required");
  else {
    const digits = normalizePhone(row.phone);
    if (digits.length !== 10) errors.push("Phone must be 10 digits");
    else row.phone = digits;
  }

  if (row.total_experience_years != null && Number.isNaN(row.total_experience_years)) {
    errors.push("Total experience must be numeric");
  } else if (
    row.total_experience_years === undefined &&
    row.experience_type &&
    !/fresher/i.test(row.experience_type)
  ) {
    warnings.push("Experience years could not be parsed");
  }

  if (row.current_ctc) {
    const c = parseCtcLpa(row.current_ctc);
    if (c.numeric == null && row.current_ctc.trim()) warnings.push("Current CTC format unclear");
  }
  if (row.expected_ctc) {
    const c = parseCtcLpa(row.expected_ctc);
    if (c.numeric == null && row.expected_ctc.trim()) warnings.push("Expected CTC format unclear");
  }

  if (row.status) {
    const normalized = row.status.toLowerCase().replace(/\s+/g, "_") as (typeof APPLICANT_STATUS_VALUES)[number];
    if (!APPLICANT_STATUS_VALUES.includes(normalized)) {
      errors.push(`Invalid status "${row.status}"`);
    } else {
      row.status = normalized;
    }
  }

  if (!row.city?.trim()) warnings.push("City is empty");

  const level: ValidationLevel = errors.length ? "error" : warnings.length ? "warning" : "valid";
  return { level, errors, warnings };
}

export function validateImportRow(row: ImportRow): string[] {
  return validateImportRowDetailed(row).errors;
}
