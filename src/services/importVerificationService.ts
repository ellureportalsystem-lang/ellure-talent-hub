import { supabase } from "@/lib/supabase";
import type { ImportRow } from "@/lib/importNormalization";
import type { ImportResult } from "@/services/importService";

export type FieldCheckStatus = "ok" | "missing" | "mismatch";

export interface BatchVerificationRow {
  rowIndex: number;
  email: string;
  name: string;
  importStatus: ImportResult["status"] | "not_imported";
  importError?: string;
  inDatabase: boolean;
  applicantId?: string;
  resumeAttached: boolean;
  searchIndexed: boolean;
  /** Recommended fields missing in DB (hurts ResDex quality) */
  missingFields: string[];
  /** Fields that differ between Excel and DB */
  mismatchedFields: string[];
  readyForResdex: boolean;
}

export interface BatchVerificationSummary {
  totalInFile: number;
  importedOk: number;
  importFailed: number;
  importSkipped: number;
  inDatabase: number;
  missingFromDb: number;
  withResume: number;
  withoutResume: number;
  readyForResdex: number;
  notReady: number;
}

const RECOMMENDED_FIELDS: { key: keyof ImportRow; label: string }[] = [
  { key: "city", label: "city" },
  { key: "key_skills", label: "key_skills" },
  { key: "total_experience_years", label: "experience" },
  { key: "job_role", label: "job_role" },
  { key: "current_designation", label: "designation" },
];

type DbApplicantRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  job_role: string | null;
  current_designation: string | null;
  key_skills: string | null;
  total_experience_years: number | null;
  resume_file: string | null;
  upload_cv_any_format: string | null;
};

function normStr(v: unknown): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function hasResume(row: DbApplicantRow): boolean {
  return Boolean((row.resume_file || row.upload_cv_any_format || "").trim());
}

function compareField(
  source: ImportRow,
  db: DbApplicantRow,
  key: keyof ImportRow,
  dbKey: keyof DbApplicantRow
): boolean {
  const src = normStr(source[key]);
  const dst = normStr(db[dbKey]);
  if (!src) return true;
  if (!dst || dst === "not specified") return false;
  if (key === "phone") {
    const srcDigits = src.replace(/\D/g, "").slice(-10);
    const dstDigits = dst.replace(/\D/g, "").slice(-10);
    return srcDigits === dstDigits;
  }
  if (key === "total_experience_years") {
    const srcNum = source.total_experience_years;
    if (srcNum == null) return true;
    return Number(db.total_experience_years ?? -1) === Number(srcNum);
  }
  return src === dst || dst.includes(src) || src.includes(dst);
}

export async function fetchApplicantsByEmails(emails: string[]): Promise<Map<string, DbApplicantRow>> {
  const unique = [...new Set(emails.map((e) => e.toLowerCase()).filter(Boolean))];
  const map = new Map<string, DbApplicantRow>();
  const chunkSize = 100;

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("applicants")
      .select(
        "id,name,email,phone,city,job_role,current_designation,key_skills,total_experience_years,resume_file,upload_cv_any_format"
      )
      .in("email", chunk)
      .eq("is_deleted", false);

    if (error) throw new Error(error.message);
    for (const row of (data ?? []) as DbApplicantRow[]) {
      if (row.email) map.set(row.email.toLowerCase(), row);
    }
  }

  return map;
}

export async function fetchSearchIndexedApplicantIds(ids: string[]): Promise<Set<string>> {
  const indexed = new Set<string>();
  const chunkSize = 100;

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from("applicant_search_index")
      .select("applicant_id")
      .in("applicant_id", chunk);

    if (error) {
      console.warn("fetchSearchIndexedApplicantIds:", error.message);
      continue;
    }
    for (const row of data ?? []) {
      if (row.applicant_id) indexed.add(row.applicant_id);
    }
  }

  return indexed;
}

export async function verifyImportBatch(params: {
  sourceRows: ImportRow[];
  importResults: ImportResult[];
}): Promise<{ rows: BatchVerificationRow[]; summary: BatchVerificationSummary }> {
  const resultByEmail = new Map<string, ImportResult>();
  for (const r of params.importResults) {
    resultByEmail.set(r.email.toLowerCase(), r);
  }

  const emails = params.sourceRows.map((r) => r.email.toLowerCase()).filter(Boolean);
  const dbMap = await fetchApplicantsByEmails(emails);
  const applicantIds = [...dbMap.values()].map((r) => r.id);
  const indexedIds = applicantIds.length ? await fetchSearchIndexedApplicantIds(applicantIds) : new Set<string>();

  const rows: BatchVerificationRow[] = params.sourceRows.map((source, rowIndex) => {
    const emailKey = source.email.toLowerCase();
    const importResult = resultByEmail.get(emailKey);
    const importStatus = importResult?.status ?? "not_imported";
    const db = dbMap.get(emailKey);

    const missingFields: string[] = [];
    const mismatchedFields: string[] = [];

    if (db) {
      for (const { key, label } of RECOMMENDED_FIELDS) {
        const srcVal = source[key];
        const dbVal = db[key as keyof DbApplicantRow];
        if (srcVal != null && String(srcVal).trim() && !normStr(dbVal)) {
          missingFields.push(label);
        } else if (srcVal != null && String(srcVal).trim() && !compareField(source, db, key, key as keyof DbApplicantRow)) {
          if (key !== "city" || normStr(dbVal) !== "not specified") {
            mismatchedFields.push(label);
          }
        }
      }

      if (!normStr(db.name) && source.name) missingFields.push("name");
      if (!normStr(db.phone) && source.phone) missingFields.push("phone");
    }

    const inDatabase = Boolean(db);
    const resumeAttached = db ? hasResume(db) : false;
    const searchIndexed = db ? indexedIds.has(db.id) : false;
    const importOk = importStatus === "inserted" || importStatus === "updated";
    const readyForResdex =
      inDatabase &&
      importOk &&
      Boolean(normStr(db?.name)) &&
      Boolean(normStr(db?.email)) &&
      resumeAttached &&
      searchIndexed;

    return {
      rowIndex,
      email: source.email,
      name: source.name,
      importStatus,
      importError: importResult?.error,
      inDatabase,
      applicantId: db?.id,
      resumeAttached,
      searchIndexed,
      missingFields,
      mismatchedFields,
      readyForResdex,
    };
  });

  const summary: BatchVerificationSummary = {
    totalInFile: rows.length,
    importedOk: rows.filter((r) => r.importStatus === "inserted" || r.importStatus === "updated").length,
    importFailed: rows.filter((r) => r.importStatus === "failed").length,
    importSkipped: rows.filter((r) => r.importStatus === "skipped").length,
    inDatabase: rows.filter((r) => r.inDatabase).length,
    missingFromDb: rows.filter(
      (r) =>
        (r.importStatus === "inserted" || r.importStatus === "updated") && !r.inDatabase
    ).length,
    withResume: rows.filter((r) => r.resumeAttached).length,
    withoutResume: rows.filter((r) => r.inDatabase && !r.resumeAttached).length,
    readyForResdex: rows.filter((r) => r.readyForResdex).length,
    notReady: rows.filter((r) => r.inDatabase && !r.readyForResdex).length,
  };

  return { rows, summary };
}
