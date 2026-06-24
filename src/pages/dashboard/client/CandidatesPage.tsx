import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BooleanSearchBar from "@/components/dashboard/admin/BooleanSearchBar";
import { ClientSearchFilters } from "@/components/search/ClientSearchFilters";
import { CandidateCard } from "@/components/client/CandidateCard";
import { CVLimitModal } from "@/components/client/CVLimitModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Bookmark } from "lucide-react";
import { useClientContext } from "@/hooks/useClientContext";
import { useClientApplicantSearch } from "@/hooks/useClientApplicantSearch";
import { checkAndLogCvDownload, fetchSavedSearches, saveClientSearch, deleteSavedSearch, fetchClientUnlockedApplicantIds } from "@/services/clientService";
import { displayCandidateName } from "@/lib/clientMasking";
import { defaultSearchFilters, type SearchFilters } from "@/types/searchFilters";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalListRow, PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { useNavigate } from "react-router-dom";

const CandidatesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ctx, refetch: refetchClientCtx } = useClientContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(1);
  const [cvLimitOpen, setCvLimitOpen] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [savedSearches, setSavedSearches] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const clientId = ctx?.client?.id;
  const plan = ctx?.client?.subscription_plans;
  const canSeeContact = plan?.can_see_contact_details !== false;

  const { applicants, loading, totalCount, refetch } = useClientApplicantSearch(clientId, {
    searchQuery,
    filters,
    page,
    pageSize: 24,
    sortField: "relevance",
    sortOrder: "desc",
  });

  const cvUsed = ctx?.client?.cv_downloads_used_this_month ?? 0;
  const cvLimit = plan?.cv_downloads_per_month ?? 100;

  const loadSaved = () => {
    if (clientId) fetchSavedSearches(clientId).then(setSavedSearches);
  };

  useEffect(() => { loadSaved(); }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    fetchClientUnlockedApplicantIds(clientId)
      .then(setUnlockedIds)
      .catch(() => setUnlockedIds(new Set()));
  }, [clientId]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
    setSearchParams(q ? { q } : {});
  };

  const handleDownloadCv = async (applicantId: string) => {
    if (!clientId || !user?.id) return;
    try {
      const result = await checkAndLogCvDownload(clientId, applicantId, user.id);
      if (!result.allowed) {
        setCvLimitOpen(true);
        return;
      }
      const app = applicants.find((a) => a.id === applicantId);
      const url = app?.resume_file || app?.resumeUrl;
      if (url) window.open(url, "_blank");
      toast.success(`Downloaded. ${result.remaining} downloads left this month.`);
      refetchClientCtx();
      setUnlockedIds((prev) => new Set([...prev, applicantId]));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    }
  };

  const resetDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 1);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (filters.skills.length) chips.push(...filters.skills.map((s) => ({ key: `skill-${s}`, label: s })));
    if (filters.currentCity.length) chips.push(...filters.currentCity.map((c) => ({ key: `city-${c}`, label: c })));
    return chips;
  }, [filters]);

  return (
    <DashboardPageShell width="wide" className="space-y-4">
      <PortalPageHeader
        title="Candidates"
        subtitle={loading ? "Searching…" : `Showing ${totalCount} candidates`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSaveSearchOpen(true)}>
              Save search
            </Button>
            <Button variant={view === "cards" ? "default" : "outline"} size="icon" className="hidden sm:inline-flex" onClick={() => setView("cards")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={view === "table" ? "default" : "outline"} size="icon" className="hidden md:inline-flex" onClick={() => setView("table")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <BooleanSearchBar value={searchQuery} onChange={handleSearch} onSearch={() => refetch()} />

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterChips.map((c) => (
            <Badge key={c.key} variant="secondary">{c.label}</Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFilters(defaultSearchFilters)}>Clear all</Button>
        </div>
      )}

      {savedSearches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {savedSearches.slice(0, 10).map((s) => (
            <Badge key={s.id} variant="outline" className="cursor-pointer" onClick={() => {
              setSearchQuery(s.search_query || "");
              setFilters({ ...defaultSearchFilters, ...(s.filters as SearchFilters) });
            }}>
              {s.name}
              <button type="button" className="ml-1" onClick={(e) => { e.stopPropagation(); deleteSavedSearch(s.id).then(loadSaved); }}>×</button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        {filtersOpen && (
          <aside className="w-72 shrink-0 hidden lg:block sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            <ClientSearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters(defaultSearchFilters)}
              isCollapsed={false}
              onToggleCollapse={() => setFiltersOpen(false)}
            />
          </aside>
        )}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : applicants.length === 0 ? (
            <EmptyState icon={Users} title="No candidates found" description="Try adjusting your search or filters." actionLabel="Clear Filters" onAction={() => { setFilters(defaultSearchFilters); setSearchQuery(""); }} />
          ) : view === "table" ? (
            <div className={cn(portalPanelClass, "hidden md:block overflow-x-auto p-0")}>
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Experience</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t border-border/60 hover:bg-muted/30 h-[52px] cursor-pointer"
                      onClick={() => navigate(`/dashboard/client/candidates/${a.id}`)}
                    >
                      <td className="p-3 font-medium">
                        {displayCandidateName(a.name, canSeeContact, unlockedIds.has(a.id))}
                      </td>
                      <td className="p-3">{a.total_experience_years ?? "—"}y</td>
                      <td className="p-3">{a.city}</td>
                      <td className="p-3">{a.profile_complete_percent ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {applicants.map((a) => (
                <CandidateCard
                  key={a.id}
                  applicant={a}
                  canSeeContact={canSeeContact}
                  isUnlocked={unlockedIds.has(a.id)}
                  onDownloadCv={handleDownloadCv}
                />
              ))}
            </div>
          )}
          {view === "table" && applicants.length > 0 && (
            <div className="space-y-2 md:hidden">
              {applicants.map((a, i) => (
                <PortalListRow
                  key={a.id}
                  title={displayCandidateName(a.name, canSeeContact, unlockedIds.has(a.id))}
                  subtitle={`${a.total_experience_years ?? "—"}y · ${a.city || "—"}`}
                  initials={a.name?.slice(0, 2).toUpperCase()}
                  alternate={i % 2 === 1}
                  trailing={
                    <Badge variant="outline">{a.profile_complete_percent ?? 0}%</Badge>
                  }
                  onClick={() => navigate(`/dashboard/client/candidates/${a.id}`)}
                />
              ))}
            </div>
          )}
          {totalCount > 24 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" disabled={page * 24 >= totalCount} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </main>
      </div>

      <CVLimitModal open={cvLimitOpen} onOpenChange={setCvLimitOpen} limit={cvLimit} resetDate={resetDate} />

      <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Save Search</DialogTitle></DialogHeader>
          <Label>Name</Label>
          <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <DialogFooter>
            <Button onClick={async () => {
              if (!clientId || !user?.id || !searchName) return;
              await saveClientSearch(clientId, user.id, searchName, searchQuery, filters as unknown as Record<string, unknown>);
              toast.success("Search saved");
              setSaveSearchOpen(false);
              loadSaved();
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardPageShell>
  );
};

export default CandidatesPage;
