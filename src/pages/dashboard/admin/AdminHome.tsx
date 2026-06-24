import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Upload,
  UserCog,
  BarChart3,
  CheckCircle,
  CreditCard,
  Users,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useAdminDashboardStats,
  useProfileRegistrationTrend,
  useTopSkillsFromSearchIndex,
  useExperienceDistribution,
  useCityDistribution,
  usePendingClients,
} from "@/hooks/useDashboardStats";
import { approveClient } from "@/services/dashboardService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import {
  PortalListRow,
  PortalQuickActionGrid,
  PortalTodayPanel,
  PortalWelcomeHero,
} from "@/components/portal/portal-ui";
import { portalMobilePrimaryButtonClass, portalPanelClass, portalAlertError } from "@/components/portal/portalStyles";
import { AdminOpsInbox } from "@/components/dashboard/admin/AdminOpsInbox";
import { cn } from "@/lib/utils";

function AdminStatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={cn(portalPanelClass, "p-3 md:p-3.5")}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground leading-tight">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums tracking-tight sm:text-2xl">{value}</p>
    </div>
  );
}

function AdminStatSkeleton() {
  return (
    <div className={cn(portalPanelClass, "p-3")}>
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-7 w-14" />
    </div>
  );
}

const AdminHome = ({ expiringCount = 0 }: { expiringCount?: number }) => {
  const { profile } = useAuth();
  const [approving, setApproving] = useState<string | null>(null);
  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Admin";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminDashboardStats("7days");
  const { data: registrationData, loading: trendLoading, refetch: refetchTrend } = useProfileRegistrationTrend(30);
  const { data: topSkills, loading: skillsLoading, refetch: refetchSkills } = useTopSkillsFromSearchIndex(8);
  const { data: experienceData, loading: expLoading, refetch: refetchExp } = useExperienceDistribution();
  const { data: cityData, loading: cityLoading, refetch: refetchCity } = useCityDistribution(6);
  const { data: pendingClients, loading: pendingLoading, refetch: refetchPending } = usePendingClients(8);

  const handleRefreshAll = () => {
    refetchStats();
    refetchTrend();
    refetchSkills();
    refetchExp();
    refetchCity();
    refetchPending();
  };

  const isRefreshing =
    statsLoading || trendLoading || skillsLoading || expLoading || cityLoading || pendingLoading;

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

  const pendingCount = stats?.pendingApprovals ?? pendingClients.length;

  return (
    <DashboardPageShell width="wide" className="space-y-5 md:space-y-6">
      <PortalWelcomeHero
        name={displayName.split(" ")[0]}
        subtitle="Recruitment operations overview"
        initials={initials}
        avatarUrl={profile?.profile_image}
        dateLine={new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      />

      <PortalQuickActionGrid
        columns={6}
        actions={[
          { to: "/dashboard/admin/applicants", label: "Candidates", icon: <Users className="h-5 w-5" />, tint: "primary" },
          { to: "/dashboard/admin/data/import", label: "Import wizard", icon: <Upload className="h-5 w-5" />, tint: "sky" },
          { to: "/dashboard/admin/recruiters", label: "Recruiters", icon: <UserCog className="h-5 w-5" />, tint: "violet" },
          { to: "/dashboard/admin/subscriptions", label: "Plans", icon: <CreditCard className="h-5 w-5" />, tint: "amber" },
          { to: "/dashboard/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" />, tint: "primary" },
          { to: "/dashboard/admin/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" />, tint: "sky" },
        ]}
      />

      <div>
        <h2 className="text-sm font-semibold tracking-tight text-foreground mb-3">Action inbox</h2>
        <AdminOpsInbox
          pendingApprovals={pendingCount}
          totalApplicants={stats?.totalApplicants ?? 0}
          resumesUploaded={stats?.resumesUploaded ?? 0}
        />
      </div>

      {expiringCount > 0 && (
        <div className={cn(portalPanelClass, "border-amber-200 bg-amber-50/80 p-4")}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold text-amber-900">
                  {expiringCount} recruiter{expiringCount !== 1 ? "s" : ""} near subscription expiry
                </p>
                <p className="text-sm text-amber-800">Subscriptions ending in the next 7 days — renew to avoid access loss.</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0 border-amber-300">
              <Link to="/dashboard/admin/recruiters">View recruiters</Link>
            </Button>
          </div>
        </div>
      )}

      {statsError && (
        <div className={portalAlertError}>
          <div className="flex gap-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{statsError.message || "Failed to load statistics"}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Key metrics</h2>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9", portalMobilePrimaryButtonClass)}
          onClick={handleRefreshAll}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("mr-2 h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        {statsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <AdminStatSkeleton key={i} />)
        ) : (
          <>
            <AdminStatCard label="Total Candidates" value={(stats?.totalApplicants ?? 0).toLocaleString()} />
            <AdminStatCard label="Active Clients" value={stats?.activeClients ?? 0} />
            <AdminStatCard label="Jobs Posted" value={stats?.jobsPosted ?? 0} />
            <AdminStatCard label="Applications Today" value={stats?.applicationsToday ?? 0} />
            <AdminStatCard label="Pending Approvals" value={stats?.pendingApprovals ?? 0} />
            <AdminStatCard label="Resumes Uploaded" value={stats?.resumesUploaded ?? 0} />
            <AdminStatCard label="Profile Views (7d)" value={stats?.profileViews7Days ?? 0} />
            <AdminStatCard label="Verified Candidates" value={stats?.verifiedProfiles ?? 0} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:col-span-2">
          <Card className={portalPanelClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">New registrations (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              {trendLoading ? (
                <Skeleton className="h-[200px] w-full rounded-xl" />
              ) : registrationData.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No sign-ups in the last 30 days.</p>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} width={32} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="applicants"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className={portalPanelClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Top skills</CardTitle>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-8 w-full rounded-lg" />
                    ))}
                  </div>
                ) : topSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No skill data yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topSkills.map((s, i) => {
                      const max = topSkills[0]?.value || 1;
                      const pct = Math.round((s.value / max) * 100);
                      return (
                        <div key={s.name} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium truncate pr-2">{s.name}</span>
                            <span className="text-muted-foreground tabular-nums shrink-0">{s.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/80"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className={portalPanelClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Experience mix</CardTitle>
              </CardHeader>
              <CardContent>
                {expLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {experienceData.map((e) => (
                      <Badge key={e.range} variant="secondary" className="text-xs font-normal">
                        {e.range}: {e.count}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <PortalTodayPanel
            title="Needs attention"
            action={
              pendingCount > 0 ? (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary" asChild>
                  <Link to="/dashboard/admin/clients">View all</Link>
                </Button>
              ) : null
            }
          >
            {pendingLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : pendingClients.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success shrink-0" />
                All caught up — no client approvals waiting.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingClients.slice(0, 4).map((c, i) => (
                  <PortalListRow
                    key={c.id}
                    title={c.company_name}
                    subtitle={c.contact_email || "No email"}
                    alternate={i % 2 === 1}
                    trailing={
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        disabled={approving === c.id}
                        onClick={() => handleApprove(c.id)}
                      >
                        {approving === c.id ? "…" : "Approve"}
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </PortalTodayPanel>

          <Card className={portalPanelClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top cities</CardTitle>
            </CardHeader>
            <CardContent>
              {cityLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : cityData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No city data.</p>
              ) : (
                <ul className="space-y-2">
                  {cityData.map((c) => (
                    <li key={c.city} className="flex items-center justify-between text-sm">
                      <span className="truncate font-medium">{c.city}</span>
                      <span className="text-muted-foreground tabular-nums shrink-0 ml-2">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {!statsLoading && (stats?.newThisWeek ?? 0) > 0 && (
            <div className={cn(portalPanelClass, "p-4 flex items-center gap-3")}>
              <TrendingUp className="h-8 w-8 text-success shrink-0" />
              <div>
                <p className="text-sm font-semibold">+{stats?.newThisWeek} new this week</p>
                <p className="text-xs text-muted-foreground">Applicant sign-ups in the last 7 days</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardPageShell>
  );
};

export default AdminHome;
