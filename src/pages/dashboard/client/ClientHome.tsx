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
  Download, Briefcase, Star, Users, Calendar, Search, Eye, AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import {
  getClientHomeStats,
  getClientRecentProfileViews,
  getClientTopJobs,
} from "@/services/dashboardService";
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
  const renewalClass =
    days == null ? "text-muted-foreground" : days <= 7 ? "text-destructive" : days <= 30 ? "text-orange-500" : "text-success";

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

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Client Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your hiring workspace at a glance</p>
      </div>

      {showBanner && (
        <Card className={cn("border", bannerExpired ? "border-destructive/50 bg-destructive/10" : "border-amber-500/50 bg-amber-500/10")}>
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className={cn("h-5 w-5 shrink-0", bannerExpired ? "text-destructive" : "text-amber-600")} />
              <div>
                <p className="font-medium text-sm">
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
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="bg-[var(--surface-1)] border-[var(--surface-border)]">
              <CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="lg:col-span-1 border-primary/30 bg-[var(--surface-1)] shadow-md">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">CV Downloads Remaining</p>
                <p className="text-3xl font-bold text-primary">{stats?.cvDownloadsRemaining ?? 0}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {stats?.cvDownloadsUsed ?? 0} / {stats?.cvDownloadsLimit ?? 0} used
                </p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
              <CardContent className="p-4 flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-info opacity-80" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                  <p className="text-xl font-bold">{stats?.activeJobs ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
              <CardContent className="p-4 flex items-center gap-3">
                <Star className="h-8 w-8 text-warning opacity-80" />
                <div>
                  <p className="text-xs text-muted-foreground">Shortlisted</p>
                  <p className="text-xl font-bold">{stats?.shortlistedCandidates ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-8 w-8 text-secondary opacity-80" />
                <div>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                  <p className="text-xl font-bold">{stats?.teamMembers ?? 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className={cn("h-8 w-8 opacity-80", renewalClass)} />
                <div>
                  <p className="text-xs text-muted-foreground">Days Until Renewal</p>
                  <p className={cn("text-xl font-bold", renewalClass)}>{days ?? "—"}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
            <CardHeader className="pb-2"><CardTitle className="text-base">Quick Search</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder="Search candidates by skills, role…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-[var(--surface-2)]"
              />
              <Button onClick={handleSearch}><Search className="h-4 w-4" /></Button>
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Candidates Viewed</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link to="/dashboard/client/candidates">View all</Link></Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : recentViews.length === 0 ? (
                <EmptyState icon={Eye} title="No recent views" description="Profiles you open will appear here." className="py-6" />
              ) : (
                <ul className="space-y-2">
                  {recentViews.map((v) => {
                    const a = v.applicants;
                    if (!a?.id) return null;
                    return (
                      <li key={v.id}>
                        <button
                          type="button"
                          className="w-full text-left flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[var(--surface-2)]"
                          onClick={() => navigate(`/dashboard/client/candidates/${a.id}`)}
                        >
                          <span className="font-medium text-sm">{a.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {v.viewed_at ? new Date(v.viewed_at).toLocaleDateString() : ""}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">My Jobs</CardTitle>
              <Button variant="ghost" size="sm" asChild><Link to="/dashboard/client/jobs">Manage</Link></Button>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-24" /> : topJobs.length === 0 ? (
                <EmptyState icon={Briefcase} title="No jobs yet" description="Post a job to start receiving applications." actionLabel="Post Job" onAction={() => navigate("/dashboard/client/jobs")} className="py-6" />
              ) : (
                <ul className="space-y-3">
                  {topJobs.map((j) => (
                    <li key={j.id} className="flex justify-between items-center border-b border-[var(--surface-border)] pb-2 last:border-0">
                      <Link to={`/dashboard/client/jobs/${j.id}/applications`} className="font-medium text-sm hover:text-primary">
                        {j.title}
                      </Link>
                      <Badge variant="outline">{j.applications_count ?? 0} apps</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[var(--surface-1)] border-[var(--surface-border)]">
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
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
