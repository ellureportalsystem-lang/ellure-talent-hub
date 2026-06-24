import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, FileText, ClipboardList, X } from "lucide-react";
import { toast } from "sonner";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";
import { naukriCardClass } from "@/components/dashboard/naukri/naukriShellStyles";
import { cn } from "@/lib/utils";
import { fetchSavedSearches, deleteSavedSearch, countNewProfilesSinceLastRun, updateSavedSearchLastRun } from "@/services/clientService";
import {
  buildRecentSearchResultsUrl,
  buildSavedSearchResultsUrl,
  formatSavedSearchMeta,
  getSavedSearchQuery,
  type SavedSearchRow,
} from "@/lib/savedSearchUtils";
import { loadRecentResdexSearches } from "@/lib/resdexRecentSearches";
import { resolveCvDownloadLimit } from "@/services/clientPlanHelper";
import { usePortalBanners, usePortalWebinars } from "@/hooks/usePortalContent";
import { PortalBannerStrip } from "@/components/portal/PortalBannerStrip";
import { PortalWebinarsPanel } from "@/components/portal/PortalWebinarsPanel";

function QuotaCard({
  title,
  subtitle,
  total,
  used,
  left,
  icon,
}: {
  title: string;
  subtitle: string;
  total: string;
  used: number;
  left: number;
  icon: React.ReactNode;
}) {
  const pct = used + left > 0 ? (used / (used + left)) * 100 : 0;
  return (
    <Card className={cn(naukriCardClass, "min-w-[220px] shrink-0")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0566CD]">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#0566CD]">{title}</p>
            <p className="text-[10px] text-slate-500">{subtitle}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{total}</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-[#0566CD]" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-slate-500">
              <span>{used.toLocaleString()} used</span>
              <span>{left.toLocaleString()} left</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecruiterHomePage() {
  const { profile } = useAuth();
  const { data: ctx } = useClientContext();
  const name = profile?.full_name?.split(" ")[0] || "Recruiter";
  const clientId = ctx?.client?.id;

  const [savedSearches, setSavedSearches] = useState<SavedSearchRow[]>([]);
  const [newCounts, setNewCounts] = useState<Record<string, number>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { banners } = usePortalBanners("recruiter");
  const { webinars } = usePortalWebinars("recruiter");

  const cvUsed = ctx?.client?.cv_downloads_used_this_month ?? 0;
  const cvLimit = resolveCvDownloadLimit(ctx?.client ?? {}, ctx?.client?.subscription_plans);
  const cvLeft = Math.max(0, cvLimit - cvUsed);

  const jobsActive = ctx?.client?.active_jobs_count ?? 0;
  const jobLimit = ctx?.client?.subscription_plans?.max_active_jobs ?? ctx?.client?.subscription_plans?.max_job_postings ?? 5;

  useEffect(() => {
    if (!clientId) return;
    fetchSavedSearches(clientId)
      .then(async (rows) => {
        const sliced = (rows as SavedSearchRow[]).slice(0, 8);
        setSavedSearches(sliced);
        const counts: Record<string, number> = {};
        await Promise.all(
          sliced.map(async (row) => {
            try {
              counts[row.id] = await countNewProfilesSinceLastRun(row.last_run_at, getSavedSearchQuery(row));
            } catch {
              counts[row.id] = 0;
            }
          })
        );
        setNewCounts(counts);
      })
      .catch(() => setSavedSearches([]));
    setRecentSearches(loadRecentResdexSearches(clientId));
  }, [clientId]);

  const handleOpenSavedSearch = async (row: SavedSearchRow) => {
    try {
      await updateSavedSearchLastRun(row.id);
    } catch {
      /* non-blocking */
    }
  };

  const handleDeleteSavedSearch = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteSavedSearch(id);
      setSavedSearches((prev) => prev.filter((s) => s.id !== id));
      toast.success("Saved search deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <NaukriPageContainer className="space-y-5">
      <h1 className="text-xl font-semibold text-[#333]">Welcome, {name}!</h1>

      <PortalBannerStrip
        banners={banners}
        fallback={{
          title: "Hire exceptional talent on Ellure TalentHub",
          body: "Search verified candidates with Resdex, post jobs, and track your hiring pipeline.",
          ctaLabel: "Search candidates",
          ctaLink: "/dashboard/client/resdex",
        }}
      />

      {ctx?.client && !ctx.client.is_verified && (
        <Card className="border-[#bfdbfe] bg-[#eff6ff]/60">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#e84444] shrink-0" />
              <div>
                <p className="font-semibold text-[#333] text-sm">Account verification pending</p>
                <p className="text-sm text-[#666]">Complete verification to unlock full Resdex access.</p>
                <Link to="/dashboard/client/settings" className="text-sm font-medium text-[#0566CD] hover:underline">
                  Verify account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className={cn("grid gap-6", webinars.length > 0 && "lg:grid-cols-3")}>
        <div className={cn("space-y-6", webinars.length > 0 && "lg:col-span-2")}>
        <div>
          <h2 className="text-base font-semibold text-[#333]">Company&apos;s quota</h2>
          <p className="text-sm text-[#666]">Track your and your company&apos;s quota</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <QuotaCard
            title="Resdex"
            subtitle="FULL QUOTA"
            total={`${cvLimit.toLocaleString()} CV Access`}
            used={cvUsed}
            left={cvLeft}
            icon={<FileText className="h-5 w-5" />}
          />
          <QuotaCard
            title="Job posting"
            subtitle="OVERALL"
            total={`${jobLimit} active jobs`}
            used={jobsActive}
            left={Math.max(0, jobLimit - jobsActive)}
            icon={<ClipboardList className="h-5 w-5" />}
          />
        </div>

        <Card className={naukriCardClass}>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold text-[#0566CD]">Resdex Searches</h2>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-800 mb-2">Recently searched for</p>
              {recentSearches.length === 0 ? (
                <p className="text-sm text-slate-500">No recent searches yet. Start a search from Resdex.</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {recentSearches.map((tag) => (
                    <Link
                      key={tag}
                      to={buildRecentSearchResultsUrl(tag)}
                      className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#0566CD] hover:text-[#0566CD]"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-semibold text-slate-500">
                <span>Saved searches</span>
                <span>Last run</span>
              </div>
              {savedSearches.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">
                  No saved searches yet. Save a search from Resdex results to see it here.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {savedSearches.map((row) => (
                    <li key={row.id} className="flex items-center justify-between py-3 text-sm gap-2">
                      <Link
                        to={buildSavedSearchResultsUrl(row)}
                        onClick={() => void handleOpenSavedSearch(row)}
                        className="text-slate-800 hover:text-[#0566CD] min-w-0 flex-1"
                      >
                        <span className="font-semibold">{row.name}</span>
                        <span className="text-slate-500"> — {formatSavedSearchMeta(row)}</span>
                        {(newCounts[row.id] ?? 0) > 0 && (
                          <Badge className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                            {newCounts[row.id]} new
                          </Badge>
                        )}
                        {getSavedSearchQuery(row) !== row.name && (
                          <span className="block text-xs text-slate-400 truncate">{getSavedSearchQuery(row)}</span>
                        )}
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-500 tabular-nums text-xs">
                          {row.last_run_at
                            ? new Date(row.last_run_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            : "—"}
                        </span>
                        <button
                          type="button"
                          className="text-slate-400 hover:text-red-500"
                          onClick={(e) => void handleDeleteSavedSearch(row.id, e)}
                          aria-label="Delete saved search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Button asChild variant="default" className="mt-4 bg-[#0566CD] hover:bg-[#0066c0] text-white">
                <Link to="/dashboard/client/resdex">Search candidates</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>

        {webinars.length > 0 && (
          <div className="space-y-3">
            <PortalWebinarsPanel webinars={webinars} />
          </div>
        )}
      </div>
    </NaukriPageContainer>
  );
}
