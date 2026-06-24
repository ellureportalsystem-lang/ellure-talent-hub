import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BarChart3, PieChart, TrendingUp, Users, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPie,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchAdminReportOverview,
  fetchApplicationFunnel,
  fetchClientPlanDistribution,
  fetchRegistrationTrend,
  fetchTopJobRoles,
  fetchTopSkillsDemand,
  toCsv,
  type ReportRange,
} from "@/services/adminReportsService";
import { toast } from "sonner";

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444"];

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const ReportsPage = () => {
  const [range, setRange] = useState<ReportRange>("30");
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ newCandidates: 0, newClients: 0, applicationsSubmitted: 0, activeJobs: 0 });
  const [trend, setTrend] = useState<{ date: string; count: number }[]>([]);
  const [topRoles, setTopRoles] = useState<{ name: string; value: number }[]>([]);
  const [funnel, setFunnel] = useState<{ stage: string; count: number }[]>([]);
  const [plans, setPlans] = useState<{ plan: string; count: number }[]>([]);
  const [skills, setSkills] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchAdminReportOverview(range),
      fetchRegistrationTrend(range),
      fetchTopJobRoles(8),
      fetchApplicationFunnel(),
      fetchClientPlanDistribution(),
      fetchTopSkillsDemand(12),
    ])
      .then(([ov, tr, roles, fn, pl, sk]) => {
        if (cancelled) return;
        setOverview(ov);
        setTrend(tr);
        setTopRoles(roles);
        setFunnel(fn);
        setPlans(pl);
        setSkills(sk);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load reports"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const handleExportAll = () => {
    const rows = [
      { metric: "New candidates", value: overview.newCandidates },
      { metric: "New clients", value: overview.newClients },
      { metric: "Applications submitted", value: overview.applicationsSubmitted },
      { metric: "Active jobs", value: overview.activeJobs },
      ...topRoles.map((r) => ({ metric: `Role: ${r.name}`, value: r.value })),
      ...funnel.map((f) => ({ metric: `Stage: ${f.stage}`, value: f.count })),
    ];
    downloadCsv(`admin-reports-${range}d.csv`, toCsv(rows));
    toast.success("Report exported");
  };

  if (loading) {
    return (
      <DashboardPageShell className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell width="wide" className="space-y-6">
      <PortalPageHeader
        title="Reports & analytics"
        subtitle="Live insights from your talent database"
        action={
          <div className="flex flex-wrap gap-2">
            <Select value={range} onValueChange={(v) => setRange(v as ReportRange)}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-9" onClick={handleExportAll}>
              <Download className="mr-2 h-4 w-4" />
              Export summary
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={portalPanelClass}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New candidates</p>
                <p className="text-2xl font-bold mt-1">{overview.newCandidates.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Last {range} days</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New clients</p>
                <p className="text-2xl font-bold mt-1">{overview.newClients.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Last {range} days</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold mt-1">{overview.applicationsSubmitted.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Last {range} days</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active jobs</p>
                <p className="text-2xl font-bold mt-1">{overview.activeJobs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently open</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={portalPanelClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Candidate registrations</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv(`registrations-${range}d.csv`, toCsv(trend.map((t) => ({ date: t.date, count: t.count }))))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <LineChart width={500} height={256} data={trend} className="w-full h-full">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Application funnel</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv("application-funnel.csv", toCsv(funnel.map((f) => ({ stage: f.stage, count: f.count }))))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart width={500} height={256} data={funnel}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top job roles</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv("top-roles.csv", toCsv(topRoles.map((r) => ({ role: r.name, count: r.value }))))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart width={500} height={256} data={topRoles} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        <Card className={portalPanelClass}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Client plan distribution</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv("client-plans.csv", toCsv(plans.map((p) => ({ plan: p.plan, count: p.count }))))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <RechartsPie width={280} height={256}>
                <Pie data={plans} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={90} label>
                  {plans.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </RechartsPie>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(portalPanelClass, "md:col-span-2")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top skills in demand</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadCsv("top-skills.csv", toCsv(skills.map((s) => ({ skill: s.name, count: s.value }))))}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart width={700} height={256} data={skills}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
};

export default ReportsPage;
