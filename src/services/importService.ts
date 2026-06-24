import { supabase } from "@/lib/supabase";
import {
  normalizeImportRow,
  validateImportRow,
  validateImportRowDetailed,
  type ImportRow,
  type RowValidation,
} from "@/lib/importNormalization";

export type { ImportRow, RowValidation } from "@/lib/importNormalization";
export { normalizeImportRow, validateImportRow, validateImportRowDetailed } from "@/lib/importNormalization";

export interface ImportResult {
  rowIndex: number;
  email: string;
  status: "inserted" | "updated" | "skipped" | "failed";
  error?: string;
  row?: ImportRow;
}

export interface ImportSummary {
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
}

function rowToPayload(row: ImportRow): Record<string, unknown> {
  return {
    name: row.name,
    email: row.email.toLowerCase(),
    phone: row.phone,
    city: row.city || "Not specified",
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
    gender: row.gender ?? null,
    headline: row.headline ?? null,
    status: row.status ?? "submitted",
    registration_date: row.registration_date ?? null,
    is_old_applicant: true,
  };
}

/** Batch-fetch emails that already exist in applicants table */
export async function fetchExistingApplicantEmails(emails: string[]): Promise<Set<string>> {
  const unique = [...new Set(emails.map((e) => e.toLowerCase()).filter(Boolean))];
  const found = new Set<string>();
  const chunkSize = 200;

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("applicants")
      .select("email")
      .in("email", chunk)
      .eq("is_deleted", false);

    if (error) throw new Error(error.message);
    data?.forEach((r) => {
      if (r.email) found.add(r.email.toLowerCase());
    });
  }

  return found;
}

export function findFileDuplicateEmails(rows: ImportRow[]): Set<string> {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const row of rows) {
    const e = row.email?.toLowerCase();
    if (!e) continue;
    if (seen.has(e)) dupes.add(e);
    else seen.add(e);
  }
  return dupes;
}

export async function importSingleApplicant(
  row: ImportRow,
  rowIndex: number,
  options: { overwrite: boolean; skipIfDuplicate: boolean; existingEmails: Set<string> }
): Promise<ImportResult> {
  const validation = validateImportRowDetailed(row, {
    existingEmails: options.existingEmails,
  });

  if (validation.errors.length) {
    return {
      rowIndex,
      email: row.email || "unknown",
      status: "failed",
      error: validation.errors.join("; "),
      row,
    };
  }

  const emailKey = row.email.toLowerCase();
  if (options.existingEmails.has(emailKey) && !options.overwrite) {
    if (options.skipIfDuplicate) {
      return { rowIndex, email: row.email, status: "skipped", error: "Duplicate email (skipped)", row };
    }
  }

  const { data, error } = await supabase.rpc("admin_import_applicant_row", {
    p_row: rowToPayload(row),
  });

  if (error) {
    return { rowIndex, email: row.email, status: "failed", error: error.message, row };
  }

  const result = data as { status?: string; email?: string; error?: string };
  if (result?.error) {
    return { rowIndex, email: row.email, status: "failed", error: result.error, row };
  }

  const status =
    result?.status === "inserted" ? "inserted" : result?.status === "updated" ? "updated" : "inserted";

  return { rowIndex, email: row.email, status, row };
}

export async function importApplicantsBatch(
  rows: ImportRow[],
  options: {
    overwrite: boolean;
    skipIfDuplicate: boolean;
    existingEmails: Set<string>;
    onProgress: (done: number, total: number, result: ImportResult) => void;
  }
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];
  const batchSize = 50;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((row, idx) =>
        importSingleApplicant(row, i + idx, {
          overwrite: options.overwrite,
          skipIfDuplicate: options.skipIfDuplicate,
          existingEmails: options.existingEmails,
        })
      )
    );
    batchResults.forEach((result, idx) => {
      results.push(result);
      options.onProgress(i + idx + 1, rows.length, result);
    });
  }

  return results;
}

export function summarizeImportResults(results: ImportResult[]): ImportSummary {
  return {
    inserted: results.filter((r) => r.status === "inserted").length,
    updated: results.filter((r) => r.status === "updated").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    failed: results.filter((r) => r.status === "failed").length,
  };
}

export async function logImportToAudit(params: {
  fileName: string;
  summary: ImportSummary;
  totalRows: number;
  actorId?: string;
}) {
  const { error } = await supabase.from("audit_logs").insert({
    action: "bulk_import",
    entity_type: "applicant",
    entity_id: `import-${Date.now()}`,
    actor_id: params.actorId ?? null,
    new_data: {
      file_name: params.fileName,
      total_rows: params.totalRows,
      ...params.summary,
    },
  });
  if (error) console.error("Failed to write import audit log:", error.message);
}

export function buildErrorReportRows(results: ImportResult[]): Record<string, unknown>[] {
  return results
    .filter((r) => r.status === "failed" || r.status === "skipped")
    .map((r) => ({
      email: r.email,
      name: r.row?.name ?? "",
      phone: r.row?.phone ?? "",
      status: r.status,
      reason: r.error ?? "",
    }));
}

/** Rebuild ResDex search index for applicants imported/updated in this batch */
export async function refreshSearchIndexForEmails(emails: string[]): Promise<void> {
  const unique = [...new Set(emails.map((e) => e.toLowerCase()).filter(Boolean))];
  const chunkSize = 100;

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("applicants")
      .select("id")
      .in("email", chunk)
      .eq("is_deleted", false);

    if (error) {
      console.error("refreshSearchIndexForEmails lookup:", error.message);
      continue;
    }

    await Promise.all(
      (data ?? []).map((row) =>
        supabase.rpc("refresh_applicant_search_index", { p_applicant_id: row.id }).then(({ error: rpcErr }) => {
          if (rpcErr) console.warn("refresh_applicant_search_index:", rpcErr.message);
        })
      )
    );
  }
}
