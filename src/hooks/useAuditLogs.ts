import { useCallback, useEffect, useState } from "react";
import {
  fetchAuditLogs,
  exportAuditLogsCsv,
  type AuditLogFilters,
  type AuditLogRow,
} from "@/services/auditLogService";

export function useAuditLogs(filters: AuditLogFilters) {
  const [data, setData] = useState<AuditLogRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: rows, error: err, count: total } = await fetchAuditLogs(filters);
    if (err) {
      setError(new Error(err.message));
      setData([]);
      setCount(0);
    } else {
      setData(rows ?? []);
      setCount(total);
    }
    setLoading(false);
  }, [
    filters.actorId,
    filters.entityType,
    filters.action,
    filters.dateFrom,
    filters.dateTo,
    filters.page,
    filters.pageSize,
  ]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, count, loading, error, refetch };
}

export function useExportAuditLogs() {
  const [exporting, setExporting] = useState(false);

  const exportCsv = async (filters: AuditLogFilters) => {
    setExporting(true);
    const { csv, error } = await exportAuditLogsCsv(filters);
    setExporting(false);
    if (error || !csv) throw error ?? new Error("Export failed");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportCsv, exporting };
}
