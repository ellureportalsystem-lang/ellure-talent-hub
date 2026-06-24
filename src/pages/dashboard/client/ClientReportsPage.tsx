import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, BarChart3, Eye, Loader2 } from "lucide-react";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { useClientContext } from "@/hooks/useClientContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  exportCsv,
  fetchClientCvDownloadHistory,
  fetchClientJobPerformance,
  fetchClientPipeline,
  fetchClientProfileViewsCount,
  fetchClientSavedSearches,
  type ClientReportRange,
} from "@/services/clientReportsService";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDateIST } from "@/lib/dateFormat";
import { toast } from "sonner";

const ClientReportsPage = ({ embedded = false }: { embedded?: boolean }) => {
  const { user } = useAuth();
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;
  const [range, setRange] = useState<ClientReportRange>("30");
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Awaited<ReturnType<typeof fetchClientJobPerformance>>>([]);
  const [pipeline, setPipeline] = useState<{ stage: string; count: number }[]>([]);
  const [downloads, setDownloads] = useState<Awaited<ReturnType<typeof fetchClientCvDownloadHistory>>>([]);
  const [savedSearches, setSavedSearches] = useState<Awaited<ReturnType<typeof fetchClientSavedSearches>>>([]);
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    if (!clientId || !user?.id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchClientJobPerformance(clientId),
      fetchClientPipeline(clientId),
      fetchClientCvDownloadHistory(clientId, range),
      fetchClientSavedSearches(clientId),
      fetchClientProfileViewsCount(clientId, user.id, range),
    ])
      .then(([j, p, d, s, v]) => {
        if (cancelled) return;
        setJobs(j);
        setPipeline(p);
        setDownloads(d);
        setSavedSearches(s);
        setProfileViews(v);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reports"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clientId, user?.id, range]);

  const totalApplications = jobs.reduce((sum, j) => sum + j.applications, 0);
  const totalShortlisted = jobs.reduce((sum, j) => sum + j.shortlisted, 0);

  const rangeControl = (
    <div className="flex gap-2">
      <Select value={range} onValueChange={(v) => setRange(v as ClientReportRange)}>
        <SelectTrigger className="w-36 h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Last 7 days</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="h-9 bg-[#0566CD] hover:bg-[#0066c0]"
        onClick={() =>
          exportCsv(
            `client-report-${range}d.csv`,
            jobs.map((j) => ({
              job: j.title,
              views: j.views,
              applications: j.applications,
              shortlisted: j.shortlisted,
              hired: j.hired,
              status: j.status,
            }))
          )
        }
      >
        <Download className="mr-2 h-4 w-4" />
        Export jobs
      </Button>
    </div>
  );

  if (loading) {
    const loader = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0566CD]" />
      </div>
    );
    if (embedded) return loader;
    return <DashboardPageShell className="flex min-h-[40vh] items-center justify-center">{loader}</DashboardPageShell>;
  }

  const body = (
    <>
      {!embedded ? (
        <PortalPageHeader
          title="Reports"
          subtitle="Hiring performance and activity for your account"
          action={rangeControl}
        />
      ) : (
        <div className="flex justify-end">{rangeControl}</div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={portalPanelClass}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Profile views</p>
            <p className="text-2xl font-bold mt-1">{profileViews}</p>
          </CardContent>
        </Card>
        <Card className={portalPanelClass}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">CV downloads</p>
            <p className="text-2xl font-bold mt-1">{downloads.length}</p>
          </CardContent>
        </Card>
        <Card className={portalPanelClass}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Applications</p>
            <p className="text-2xl font-bold mt-1">{totalApplications}</p>
          </CardContent>
        </Card>
        <Card className={portalPanelClass}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Shortlisted</p>
            <p className="text-2xl font-bold mt-1">{totalShortlisted}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={portalPanelClass}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Pipeline by stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <BarChart width={400} height={224} data={pipeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" tick={{ fontSize: 9 }} />
                <YAxis allowDecimals={false} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardHeader>
            <CardTitle className="text-lg">Job performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-56 overflow-y-auto">
            {jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs posted yet</p>
            ) : (
              jobs.map((j) => (
                <div key={j.id} className="flex justify-between text-sm border-b border-border/50 py-2">
                  <span className="font-medium truncate pr-4">{j.title}</span>
                  <span className="text-muted-foreground shrink-0">
                    {j.applications} apps · {j.shortlisted} short
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={portalPanelClass}>
        <CardHeader>
          <CardTitle className="text-lg">CV download history</CardTitle>
        </CardHeader>
        <CardContent>
          {downloads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No CV downloads in this period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left p-2">Candidate</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Downloaded by</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((row, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="p-2">{row.candidateName}</td>
                      <td className="p-2">{row.role}</td>
                      <td className="p-2">{row.downloadedBy}</td>
                      <td className="p-2">{row.downloadedAt ? formatDateIST(row.downloadedAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={portalPanelClass}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Saved searches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {savedSearches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved searches yet</p>
          ) : (
            savedSearches.map((s) => (
              <div key={s.id} className="flex justify-between text-sm py-2 border-b border-border/50">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                  {s.last_run_at ? formatDateIST(s.last_run_at) : "Never run"}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );

  if (embedded) return <div className="space-y-6">{body}</div>;

  return (
    <DashboardPageShell width="wide" className="space-y-6">
      {body}
    </DashboardPageShell>
  );
};

export default ClientReportsPage;
