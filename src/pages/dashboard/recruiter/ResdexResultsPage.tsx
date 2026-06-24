import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { toast } from "sonner";

import { ResdexSearchBar } from "@/components/dashboard/admin/ResdexSearchBar";
import { ResdexFiltersPanel } from "@/components/dashboard/recruiter/ResdexFiltersPanel";
import { ResdexResultsToolbar } from "@/components/dashboard/recruiter/ResdexResultsToolbar";
import { NaukriCandidateCard } from "@/components/dashboard/recruiter/NaukriCandidateCard";
import { useApplicantSearch } from "@/hooks/useApplicantSearch";
import { useClientContext } from "@/hooks/useClientContext";
import { useRecruiterSaveToShortlist } from "@/hooks/useRecruiterSaveToShortlist";
import { matchResdexSuggestions, useResdexFilterOptions } from "@/hooks/useResdexFilterOptions";
import { saveRecentResdexSearch } from "@/lib/resdexRecentSearches";
import {
  fetchCandidateInviteStatus,
  fetchDownloadedApplicantIds,
} from "@/services/nviteService";
import { fetchRecruiterTagsForApplicants } from "@/services/recruiterCandidateService";
import {
  buildResdexSearchParams,
  defaultResdexState,
  parseResdexSearchParams,
  sortToRpc,
  type ResdexPageSize,
  type ResdexSearchState,
  type ResdexSort,
} from "@/lib/resdexSearchParams";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";

function filtersForRpc(filters: SearchFilters, activeIn: string) {
  const months = Number(activeIn);
  const activeDays =
    !Number.isNaN(months) && months > 0 && months <= 12 ? months * 30 : activeIn === "30" ? 30 : activeIn === "15" ? 15 : null;

  return {
    ...filters,
    activeDays: activeDays ?? filters.activeDays,
    experienceRange:
      filters.experienceRange[0] > 0 || filters.experienceRange[1] < 30
        ? filters.experienceRange
        : undefined,
    salaryRange:
      filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100
        ? filters.salaryRange
        : undefined,
    expectedSalaryRange:
      filters.expectedSalaryRange[0] > 0 || filters.expectedSalaryRange[1] < 100
        ? filters.expectedSalaryRange
        : undefined,
    profileCompleteRange:
      filters.profileCompleteRange[0] > 0 || filters.profileCompleteRange[1] < 100
        ? filters.profileCompleteRange
        : undefined,
    yearOfPassing:
      filters.yearOfPassing[0] > 2000 || filters.yearOfPassing[1] < new Date().getFullYear()
        ? filters.yearOfPassing
        : undefined,
  };
}

export default function ResdexResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: ctx, isLoading: ctxLoading } = useClientContext();
  const clientId = ctx?.client?.id;
  const { saveApplicant } = useRecruiterSaveToShortlist();
  const filterOptions = useResdexFilterOptions();

  const urlState = useMemo(
    () => parseResdexSearchParams(searchParams.toString()),
    [searchParams]
  );

  const [draftQ, setDraftQ] = useState(urlState.q);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [tagsByApplicant, setTagsByApplicant] = useState<Map<string, { tag: string; color: string }[]>>(new Map());

  useEffect(() => {
    setDraftQ(urlState.q);
  }, [urlState.q]);

  useEffect(() => {
    if (!urlState.nvite) setSelectedIds([]);
  }, [urlState.nvite, urlState.page, urlState.q]);

  const syncUrl = useCallback(
    (next: Partial<ResdexSearchState>) => {
      const merged: ResdexSearchState = {
        ...urlState,
        ...next,
        filters: next.filters ?? urlState.filters,
      };
      setSearchParams(buildResdexSearchParams(merged), { replace: true });
    },
    [setSearchParams, urlState]
  );

  const commitSearch = useCallback(
    (q: string) => {
      saveRecentResdexSearch(clientId, q);
      syncUrl({ q, page: 1 });
    },
    [syncUrl, clientId]
  );

  const sortRpc = sortToRpc(urlState.sort);

  const { applicants, loading, totalCount, error, refetch } = useApplicantSearch({
    searchQuery: urlState.q,
    searchMode: urlState.mode,
    filters: filtersForRpc(urlState.filters, urlState.activeIn),
    sortField: sortRpc.field,
    sortOrder: sortRpc.order,
    page: urlState.page,
    pageSize: urlState.pageSize,
    clientId,
    enabled: !ctxLoading,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / urlState.pageSize));
  const pageIds = applicants.map((a) => a.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    if (!clientId || !pageIds.length) return;
    void Promise.all([
      fetchCandidateInviteStatus(clientId, pageIds),
      fetchDownloadedApplicantIds(clientId, pageIds),
      fetchRecruiterTagsForApplicants(clientId, pageIds),
    ]).then(([invites, downloaded, tags]) => {
      setContactedIds(new Set(invites.keys()));
      setDownloadedIds(downloaded);
      setTagsByApplicant(tags);
    });
  }, [clientId, pageIds.join(",")]);

  const handleReset = () => {
    setSelectedIds([]);
    setSearchParams(buildResdexSearchParams(defaultResdexState), { replace: true });
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    syncUrl({ filters, page: 1 });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleContinueNvite = () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one candidate");
      return;
    }
    const p = new URLSearchParams();
    p.set("ids", selectedIds.join(","));
    if (urlState.q.trim()) p.set("q", urlState.q.trim());
    navigate(`/dashboard/client/nvite?${p.toString()}`);
  };

  const profileBase = "/dashboard/client/candidates";

  const keywordSuggestions = useMemo(
    () => matchResdexSuggestions(draftQ, filterOptions, 12),
    [draftQ, filterOptions]
  );

  return (
    <div className="flex min-h-[calc(100vh-52px)] flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 max-w-3xl">
            <ResdexSearchBar
              value={draftQ}
              mode={urlState.mode}
              onChange={setDraftQ}
              onModeChange={(mode) => syncUrl({ mode, page: 1 })}
              onSearch={() => commitSearch(draftQ)}
              suggestions={keywordSuggestions}
            />
          </div>
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <ResdexFiltersPanel
          className="hidden lg:block"
          filters={urlState.filters}
          onChange={handleFiltersChange}
          onReset={handleReset}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <ResdexResultsToolbar
            totalCount={totalCount}
            searchQuery={urlState.q}
            activeIn={urlState.activeIn}
            sort={urlState.sort}
            pageSize={urlState.pageSize}
            page={urlState.page}
            totalPages={totalPages}
            nviteMode={urlState.nvite}
            selectedCount={selectedIds.length}
            allOnPageSelected={allOnPageSelected}
            onActiveInChange={(v) => syncUrl({ activeIn: v, page: 1 })}
            onSortChange={(sort: ResdexSort) => syncUrl({ sort, page: 1 })}
            onPageSizeChange={(pageSize: ResdexPageSize) => syncUrl({ pageSize, page: 1 })}
            onPageChange={(page) => syncUrl({ page })}
            onToggleNvite={() => syncUrl({ nvite: true })}
            onSelectAll={handleSelectAll}
            onContinueNvite={handleContinueNvite}
          />

          <div className="flex-1 overflow-y-auto bg-[#f4f5f7] p-4">
            {error && (
              <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error.message}
              </p>
            )}

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded" />
                ))}
              </div>
            ) : applicants.length === 0 ? (
              <div className="rounded border border-slate-200 bg-white p-12 text-center">
                <p className="text-lg font-semibold text-slate-900">No candidates found</p>
                <p className="mt-2 text-sm text-slate-600">Try broadening your keywords or filters.</p>
                <Button asChild className="mt-4 bg-[#0566CD] hover:bg-[#0066c0]" variant="default">
                  <a href="/dashboard/client/resdex">New search</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((applicant) => (
                  <NaukriCandidateCard
                    key={applicant.id}
                    applicant={applicant}
                    selected={selectedIds.includes(applicant.id)}
                    onSelect={(checked) => {
                      setSelectedIds((prev) =>
                        checked ? [...prev, applicant.id] : prev.filter((id) => id !== applicant.id)
                      );
                    }}
                    searchQuery={urlState.q}
                    searchMode={urlState.mode}
                    profilePath={`${profileBase}/${applicant.id}?q=${encodeURIComponent(urlState.q)}${urlState.mode === "boolean" ? "&mode=boolean" : ""}`}
                    onSave={(id) => void saveApplicant(id)}
                    showContactActions={!urlState.nvite}
                    tags={tagsByApplicant.get(applicant.id) ?? []}
                    isContacted={contactedIds.has(applicant.id)}
                    isDownloaded={downloadedIds.has(applicant.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Filters</SheetTitle>
          <ResdexFiltersPanel
            filters={urlState.filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
