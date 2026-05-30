import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Users, Building2, Briefcase, Download, UserCheck, FileText, Clock, CheckCircle,
  AlertCircle, RefreshCw, TrendingUp,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  useAdminDashboardStats,
  useProfileRegistrationTrend,
  useTopSkillsFromSearchIndex,
  useExperienceDistribution,
  useEducationDistribution,
  useCityDistribution,
  usePendingClients,
} from "@/hooks/useDashboardStats";
import { approveClient } from "@/services/dashboardService";
import { toast } from "sonner";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalKpiGrid } from "@/components/portal/PortalKpiGrid";
import { portalMobilePrimaryButtonClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
  "hsl(var(--secondary))",
];

function KpiSkeleton() {
  return (
    <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
      <CardContent className="p-4">
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

function KpiCard({
  title, value, icon, accent, delay = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)] shadow-sm">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-xl font-bold tabular-nums tracking-tight text-[var(--text-primary)] sm:text-2xl">{value}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const AdminHome = () => {
  const [approving, setApproving] = useState<string | null>(null);
  const { stats, loading: statsLoading, error: statsError } = useAdminDashboardStats("7days");
  const { data: registrationData, loading: trendLoading } = useProfileRegistrationTrend(30);
  const { data: topSkills, loading: skillsLoading } = useTopSkillsFromSearchIndex(10);
  const { data: experienceData, loading: expLoading } = useExperienceDistribution();
  const { data: educationData, loading: eduLoading } = useEducationDistribution();
  const { data: cityData, loading: cityLoading } = useCityDistribution(10);
  const { data: pendingClients, loading: pendingLoading, refetch: refetchPending } = usePendingClients(8);

  const handleApprove = async (clientId: string) => {
    setApproving(clientId);
    try {
      await approveClient(clientId);
      toast.success("Client approved");
      refetchPending();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approval failed");
    } finally {
      setApproving(null);
    }
  };

  const expPie = experienceData.map((e) => ({ name: e.range, value: e.count }));
  const eduPie = educationData.map((e) => ({ name: e.level, value: e.count }));

  return (
    <DashboardPageShell className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[var(--text-primary)] md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time recruitment analytics</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9", portalMobilePrimaryButtonClass)}
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {statsError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{statsError.message || "Failed to load statistics"}</p>
          </CardContent>
        </Card>
      )}

      <PortalKpiGrid count={8}>
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : (
          <>
            <KpiCard title="Total Applicants" value={(stats?.totalApplicants ?? 0).toLocaleString()} icon={<Users className="h-5 w-5 text-primary-foreground" />} accent="bg-primary" />
            <KpiCard title="New This Week" value={stats?.newThisWeek ?? 0} icon={<TrendingUp className="h-5 w-5 text-success-foreground" />} accent="bg-success" delay={0.05} />
            <KpiCard title="Active Clients" value={stats?.activeClients ?? 0} icon={<Building2 className="h-5 w-5 text-info-foreground" />} accent="bg-info" delay={0.1} />
            <KpiCard title="Jobs Posted" value={stats?.jobsPosted ?? 0} icon={<Briefcase className="h-5 w-5 text-primary-foreground" />} accent="bg-primary" delay={0.15} />
            <KpiCard title="CV Downloads" value={stats?.cvDownloadsThisMonth ?? 0} icon={<Download className="h-5 w-5 text-secondary-foreground" />} accent="bg-secondary" />
            <KpiCard title="Pending Approvals" value={stats?.pendingApprovals ?? 0} icon={<Clock className="h-5 w-5 text-warning-foreground" />} accent="bg-warning" delay={0.05} />
            <KpiCard title="Verified Profiles" value={stats?.verifiedProfiles ?? 0} icon={<UserCheck className="h-5 w-5 text-success-foreground" />} accent="bg-success" delay={0.1} />
            <KpiCard title="Applications" value={stats?.applicationsThisMonth ?? 0} icon={<FileText className="h-5 w-5 text-info-foreground" />} accent="bg-info" delay={0.15} />
          </>
        )}
      </PortalKpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardHeader className="pb-2"><CardTitle className="text-base">Registration Trend (30 days)</CardTitle></CardHeader>
          <CardContent>
            {trendLoading ? <Skeleton className="h-[280px] w-full" /> : registrationData.length === 0 ? (
              <EmptyState icon={Users} title="No registrations" description="No profile sign-ups in the last 30 days." className="py-8" />
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="applicants" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardHeader className="pb-2"><CardTitle className="text-base">Top Skills</CardTitle></CardHeader>
          <CardContent>
            {skillsLoading ? <Skeleton className="h-[280px] w-full" /> : topSkills.length === 0 ? (
              <EmptyState icon={FileText} title="No skill data" description="Skills will appear once applicants add key skills." className="py-8" />
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSkills} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" width={90} fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardHeader className="pb-2"><CardTitle className="text-base">Experience</CardTitle></CardHeader>
          <CardContent>
            {expLoading ? <Skeleton className="h-[220px]" /> : expPie.every((d) => !d.value) ? (
              <EmptyState icon={Users} title="No data" className="py-6" />
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {expPie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardHeader className="pb-2"><CardTitle className="text-base">Education Level</CardTitle></CardHeader>
          <CardContent>
            {eduLoading ? <Skeleton className="h-[220px]" /> : eduPie.every((d) => !d.value) ? (
              <EmptyState icon={FileText} title="No data" className="py-6" />
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={eduPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {eduPie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
          <CardHeader className="pb-2"><CardTitle className="text-base">Top Cities</CardTitle></CardHeader>
          <CardContent>
            {cityLoading ? <Skeleton className="h-[220px]" /> : cityData.length === 0 ? (
              <EmptyState icon={Building2} title="No city data" className="py-6" />
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="city" fontSize={9} angle={-25} textAnchor="end" height={50} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-warning" />
            Pending Actions — Client Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : pendingClients.length === 0 ? (
            <EmptyState icon={CheckCircle} title="All caught up" description="No clients waiting for approval." />
          ) : (
            <ul className="divide-y divide-[var(--surface-border)]">
              {pendingClients.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.contact_email || "—"} · {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className={cn("shrink-0", portalMobilePrimaryButtonClass)}
                    disabled={approving === c.id}
                    onClick={() => handleApprove(c.id)}
                  >
                    {approving === c.id ? "Approving…" : "Approve"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

export default AdminHome;
