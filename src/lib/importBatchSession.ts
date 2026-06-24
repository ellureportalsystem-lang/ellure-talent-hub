import type { ImportResult } from "@/services/importService";
import type { ImportRow } from "@/lib/importNormalization";

const STORAGE_KEY = "ellure_import_batch_v1";

export type ImportBatchPhase =
  | "excel_validating"
  | "excel_importing"
  | "excel_imported"
  | "data_verified"
  | "resumes_uploading"
  | "completed";

export interface ImportBatchSession {
  batchId: string;
  fileName: string;
  createdAt: string;
  phase: ImportBatchPhase;
  /** All rows from the Excel file (for verification) */
  sourceRows: ImportRow[];
  /** Per-row import outcomes */
  importResults: ImportResult[];
  /** Emails that should exist in DB after successful import */
  expectedEmails: string[];
}

function safeParse(raw: string | null): ImportBatchSession | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as ImportBatchSession;
    if (!data?.batchId || !Array.isArray(data.expectedEmails)) return null;
    return data;
  } catch {
    return null;
  }
}

export function loadImportBatch(): ImportBatchSession | null {
  if (typeof sessionStorage === "undefined") return null;
  return safeParse(sessionStorage.getItem(STORAGE_KEY));
}

export function saveImportBatch(batch: ImportBatchSession): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
}

export function clearImportBatch(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function createImportBatch(params: {
  fileName: string;
  sourceRows: ImportRow[];
}): ImportBatchSession {
  return {
    batchId: `batch-${Date.now()}`,
    fileName: params.fileName,
    createdAt: new Date().toISOString(),
    phase: "excel_validating",
    sourceRows: params.sourceRows,
    importResults: [],
    expectedEmails: params.sourceRows.map((r) => r.email.toLowerCase()).filter(Boolean),
  };
}

export function updateImportBatch(patch: Partial<ImportBatchSession>): ImportBatchSession | null {
  const current = loadImportBatch();
  if (!current) return null;
  const next = { ...current, ...patch };
  saveImportBatch(next);
  return next;
}

/** Emails from this batch that were inserted or updated (should be in DB) */
export function getSuccessfulBatchEmails(batch: ImportBatchSession): string[] {
  return batch.importResults
    .filter((r) => r.status === "inserted" || r.status === "updated")
    .map((r) => r.email.toLowerCase())
    .filter(Boolean);
}
