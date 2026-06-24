import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCw, Shield } from "lucide-react";
import { useAuditLogs, useExportAuditLogs } from "@/hooks/useAuditLogs";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { formatDateTimeIST } from "@/lib/dateFormat";
import { toast } from "sonner";

const AuditLogPage = () => {
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filters = {
    entityType: entityType || undefined,
    action: action || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo ? `${dateTo}T23:59:59` : undefined,
    page,
    pageSize: 50,
  };

  const { data, count, loading, error, refetch } = useAuditLogs(filters);
  const { exportCsv, exporting } = useExportAuditLogs();
  const totalPages = Math.max(1, Math.ceil(count / 50));

  const handleExport = async () => {
    try {
      await exportCsv(filters);
      toast.success("Audit log exported");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  };

  return (
    <DashboardPageShell
      title="Audit Log"
      description="Read-only activity trail for admin actions across the platform."
      icon={Shield}
    >
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-end justify-between gap-4">
          <CardTitle className="text-base">Filters</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => void handleExport()} disabled={exporting}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="entity-type">Entity type</Label>
              <Input
                id="entity-type"
                placeholder="e.g. applicant"
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="action">Action</Label>
              <Input
                id="action"
                placeholder="e.g. admin_edit"
                value={action}
                onChange={(e) => {
                  setAction(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date-from">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date-to">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error.message}
              <Button variant="link" className="ml-2 h-auto p-0" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No audit entries match your filters.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>IP address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {row.created_at ? formatDateTimeIST(row.created_at) : "—"}
                        </TableCell>
                        <TableCell className="text-sm">{row.actor_name ?? "System"}</TableCell>
                        <TableCell className="text-sm">{row.action}</TableCell>
                        <TableCell className="text-sm">{row.entity_type}</TableCell>
                        <TableCell className="max-w-[140px] truncate font-mono text-xs">{row.entity_id}</TableCell>
                        <TableCell className="text-sm">
                          {row.ip_address != null ? String(row.ip_address) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Page {page} of {totalPages} ({count} entries)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

export default AuditLogPage;
