import { supabase } from "@/lib/supabase";
import {
  normalizeImportRow,
  validateImportRow,
  type ImportRow,
} from "@/lib/importNormalization";

export type { ImportRow } from "@/lib/importNormalization";
export { normalizeImportRow, validateImportRow } from "@/lib/importNormalization";

export interface ImportResult {
  email: string;
  status: "inserted" | "updated" | "failed";
  error?: string;
}

function rowToPayload(row: ImportRow): Record<string, unknown> {
  return {
    name: row.name,
    email: row.email.toLowerCase(),
    phone: row.phone,
    city: row.city,
    job_role: row.job_role ?? null,
    current_designation: row.current_designation ?? null,
    current_company: row.current_company ?? null,
    total_experience_years: row.total_experience_years ?? null,
    experience_type: row.experience_type ?? null,
    current_ctc: row.current_ctc ?? null,
    expected_ctc: row.expected_ctc ?? null,
    notice_period: row.notice_period ?? null,
    education_level: row.education_level ?? null,
    highest_qualification: row.highest_qualification ?? null,
    course_degree_name: row.course_degree_name ?? null,
    university_institute_name: row.university_institute_name ?? null,
    year_of_passing: row.year_of_passing ?? null,
    education_board: row.education_board ?? null,
    medium_of_study: row.medium_of_study ?? null,
    key_skills: row.key_skills ?? null,
    communication: row.communication ?? null,
    is_old_applicant: true,
  };
}

export async function importSingleApplicant(row: ImportRow): Promise<ImportResult> {
  const errors = validateImportRow(row);
  if (errors.length) {
    return { email: row.email || "unknown", status: "failed", error: errors.join("; ") };
  }

  const { data, error } = await supabase.rpc("admin_import_applicant_row", {
    p_row: rowToPayload(row),
  });

  if (error) {
    return { email: row.email, status: "failed", error: error.message };
  }

  const result = data as { status?: string; email?: string; error?: string };
  if (result?.error) {
    return { email: row.email, status: "failed", error: result.error };
  }

  return {
    email: row.email,
    status: result?.status === "inserted" ? "inserted" : "updated",
  };
}

export async function importApplicantsBatch(
  rows: ImportRow[],
  onProgress: (done: number, total: number, result: ImportResult) => void
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];
  const batchSize = 10;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((row) => importSingleApplicant(row)));
    batchResults.forEach((result, idx) => {
      results.push(result);
      onProgress(i + idx + 1, rows.length, result);
    });
  }

  return results;
}
