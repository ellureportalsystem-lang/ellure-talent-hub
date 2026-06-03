import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Download,
  Briefcase,
  Users,
  Search,
  Eye,
  AlertTriangle,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import {
  getClientHomeStats,
  getClientRecentProfileViews,
  getClientTopJobs,
} from "@/services/dashboardService";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import {
  PortalListRow,
  PortalQuickActionGrid,
  PortalStatLinkCard,
  PortalStatLinkGrid,
  PortalTodayPanel,
  PortalWelcomeHero,
} from "@/components/portal/portal-ui";
import { portalAlertWarning, portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const ClientHome = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: ctx } = useClientContext();
  const clientId = profile?.client_id || ctx?.client?.id;
  const plan = ctx?.client?.subscription_plans;

  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getClientHomeStats>> | null>(null);
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [topJobs, setTopJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([
      getClientHomeStats(clientId),
      getClientRecentProfileViews(clientId, 5),
      getClientTopJobs(clientId, 3),
    ])
      .then(([s, views, jobs]) => {
        setStats(s);
        setRecentViews(views);
        setTopJobs(jobs);
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  const days = stats?.daysUntilRenewal;
  const endDate = stats?.subscriptionEndDate ? new Date(stats.subscriptionEndDate) : null;
  const showBanner = endDate && days != null && days <= 14;
  const bannerExpired = days != null && days < 0;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    navigate(`/dashboard/client/candidates?${params.toString()}`);
  };

  const jobsLimit = plan?.max_active_jobs ?? 10;
  const teamLimit = plan?.max_team_members ?? 5;

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Client";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const companyName = ctx?.client?.company_name || "Your company";

  return (
    <DashboardPageShell width="wide" className="space-y-4 md:space-y-6 animate-fade-in-up">
      <PortalWelcomeHero
        name={displayName.split(" ")[0]}
        subtitle={companyName}
        initials={initials}
        avatarUrl={profile?.profile_image}
        dateLine={new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        })}
      />

      <PortalTodayPanel
        title="Hiring overview"
        action={
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary" asChild>
            <Link to="/dashboard/client/candidates">Candidates</Link>
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Active jobs</p>
            <p className="text-lg font-bold tabular-nums">{loading ? "—" : stats?.activeJobs ?? 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Shortlisted</p>
            <p className="text-lg font-bold tabular-nums">
              {loading ? "—" : stats?.shortlistedCandidates ?? 0}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <Input
            placeholder="Search candidates…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-9 flex-1 bg-background/80 text-sm"
          />
          <Button type="button" size="icon" className="h-9 w-9 shrink-0" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </PortalTodayPanel>

      <PortalQuickActionGrid
        columns={4}
        actions={[
          { to: "/dashboard/client/candidates", label: "Candidates", icon: <Users className="h-5 w-5" />, tint: "primary" },
          { to: "/dashboard/client/jobs", label: "Jobs", icon: <Briefcase className="h-5 w-5" />, tint: "sky" },
          { to: "/dashboard/client/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" />, tint: "violet" },
          { to: "/dashboard/client/billing", label: "Billing", icon: <CreditCard className="h-5 w-5" />, tint: "amber" },
        ]}
      />

      <PortalStatLinkGrid>
        <PortalStatLinkCard
          label="CV downloads left"
          value={loading ? "—" : stats?.cvDownloadsRemaining ?? 0}
          icon={<Download className="h-4 w-4" />}
          to="/dashboard/client/billing"
        />
        <PortalStatLinkCard
          label="Active jobs"
          value={loading ? "—" : stats?.activeJobs ?? 0}
          icon={<Briefcase className="h-4 w-4" />}
          to="/dashboard/client/jobs"
        />
        <PortalStatLinkCard
          label="Team"
          value={loading ? "—" : stats?.teamMembers ?? 0}
          icon={<Users className="h-4 w-4" />}
          to="/dashboard/client/team"
        />
      </PortalStatLinkGrid>

      {showBanner && (
        <div
          className={cn(
            "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
            bannerExpired ? "rounded-2xl border border-destructive/30 bg-destructive/5" : portalAlertWarning
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={cn("h-5 w-5 shrink-0", bannerExpired ? "text-destructive" : "text-amber-600")} />
            <div>
              <p className="text-sm font-medium">
                {bannerExpired ? "Your subscription has expired" : `Subscription expires in ${days} day${days === 1 ? "" : "s"}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {endDate?.toLocaleDateString()} — renew to keep full access
              </p>
            </div>
          </div>
          <Button size="sm" asChild variant={bannerExpired ? "destructive" : "default"}>
            <Link to="/dashboard/client/billing">Renew Now</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <div className={cn(portalPanelClass, "space-y-3 p-4")}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Recent candidates</h3>
            <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
              <Link to="/dashboard/client/candidates">View all</Link>
            </Button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
          ) : recentViews.length === 0 ? (
            <EmptyState icon={Eye} title="No recent views" description="Profiles you open will appear here." className="py-6" />
          ) : (
            <div className="space-y-2">
              {recentViews.map((v, i) => {
                const a = v.applicants;
                if (!a?.id) return null;
                return (
                  <PortalListRow
                    key={v.id}
                    title={a.name}
                    subtitle={v.viewed_at ? new Date(v.viewed_at).toLocaleDateString() : undefined}
                    initials={a.name?.slice(0, 2).toUpperCase()}
                    alternate={i % 2 === 1}
                    onClick={() => navigate(`/dashboard/client/candidates/${a.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={cn(portalPanelClass, "space-y-3 p-4")}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Top jobs</h3>
            <Button variant="ghost" size="sm" className="h-8 text-xs" asChild>
              <Link to="/dashboard/client/jobs">Manage</Link>
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : topJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs yet"
              description="Post a job to start receiving applications."
              actionLabel="Post Job"
              onAction={() => navigate("/dashboard/client/jobs")}
              className="py-6"
            />
          ) : (
            <div className="space-y-2">
              {topJobs.map((j, i) => (
                <PortalListRow
                  key={j.id}
                  title={j.title}
                  subtitle={`${j.applications_count ?? 0} applications`}
                  alternate={i % 2 === 1}
                  trailing={<Badge variant="outline">{j.applications_count ?? 0}</Badge>}
                  onClick={() => navigate(`/dashboard/client/jobs/${j.id}/applications`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Card className={cn(portalPanelClass, "hidden lg:block")}>
            <CardHeader className="pb-2"><CardTitle className="text-base">Usage</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" /> CV Downloads</span>
                  <span>{stats?.cvDownloadsUsed ?? 0} / {stats?.cvDownloadsLimit ?? 0}</span>
                </div>
                <Progress
                  value={stats?.cvDownloadsLimit ? ((stats.cvDownloadsUsed / stats.cvDownloadsLimit) * 100) : 0}
                  className={cn((stats?.cvDownloadsUsed ?? 0) / (stats?.cvDownloadsLimit || 1) > 0.9 && "[&>div]:bg-destructive")}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Job Postings</span>
                  <span>{stats?.activeJobs ?? 0} / {jobsLimit}</span>
                </div>
                <Progress value={jobsLimit ? ((stats?.activeJobs ?? 0) / jobsLimit) * 100 : 0} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Team Seats</span>
                  <span>{stats?.teamMembers ?? 0} / {teamLimit}</span>
                </div>
                <Progress value={teamLimit ? ((stats?.teamMembers ?? 0) / teamLimit) * 100 : 0} />
              </div>
            </CardContent>
          </Card>
    </DashboardPageShell>
  );
};

export default ClientHome;
