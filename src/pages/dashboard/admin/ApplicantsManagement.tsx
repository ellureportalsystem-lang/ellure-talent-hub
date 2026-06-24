import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Filter, RefreshCw, Upload, AlertCircle, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

import { ResdexSearchBar } from "@/components/dashboard/admin/ResdexSearchBar";
import { AdminResdexSidebar } from "@/components/dashboard/admin/AdminResdexSidebar";
import { AdminCandidateCard } from "@/components/dashboard/admin/AdminCandidateCard";
import ApplicantTable from "@/components/dashboard/admin/ApplicantTable";
import BulkActionsBar from "@/components/dashboard/admin/BulkActionsBar";
import { useApplicantSearch } from "@/hooks/useApplicantSearch";
import { useShortlists } from "@/hooks/useShortlists";
import { exportApplicantsToCsv, exportApplicantsToExcel } from "@/utils/applicantExport";
import type { Applicant } from "@/hooks/useApplicants";
import {
  buildResdexSearchParams,
  defaultResdexState,
  parseResdexSearchParams,
  sortToRpc,
  type ResdexSearchState,
  type ResdexSort,
} from "@/lib/resdexSearchParams";
import type { SearchFilters, ApplicantSourceFilter } from "@/components/dashboard/admin/ResumeSearchFilters";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { softDeleteApplicants } from "@/services/adminApplicantService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 20;

function filtersForRpc(filters: SearchFilters) {
  return {
    ...filters,
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

const ApplicantsManagement = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = useMemo(
    () => parseResdexSearchParams(searchParams.toString()),
    [searchParams]
  );

  const [draftQ, setDraftQ] = useState(urlState.q);
  const [skillInput, setSkillInput] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [folderPickerId, setFolderPickerId] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setDraftQ(urlState.q);
  }, [urlState.q]);

  const syncUrl = useCallback(
    (next: Partial<ResdexSearchState>) => {
      const merged: ResdexSearchState = {
        q: next.q ?? urlState.q,
        mode: next.mode ?? urlState.mode,
        sort: next.sort ?? urlState.sort,
        view: next.view ?? urlState.view,
        page: next.page ?? urlState.page,
        filters: next.filters ?? urlState.filters,
      };
      setSearchParams(buildResdexSearchParams(merged), { replace: true });
    },
    [setSearchParams, urlState]
  );

  const commitSearch = useCallback(
    (q: string) => syncUrl({ q, page: 1 }),
    [syncUrl]
  );

  const { folders, addToFolder } = useShortlists("admin");

  const sortRpc = sortToRpc(urlState.sort);

  const { applicants, loading, totalCount, error, refetch } = useApplicantSearch({
    searchQuery: urlState.q,
    searchMode: urlState.mode,
    filters: filtersForRpc(urlState.filters),
    sortField: sortRpc.field,
    sortOrder: sortRpc.order,
    page: urlState.page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const showingFrom = totalCount === 0 ? 0 : (urlState.page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(urlState.page * PAGE_SIZE, totalCount);

  const selectedApplicants = useMemo(
    () => applicants.filter((a) => selectedIds.includes(a.id)),
    [applicants, selectedIds]
  );

  const handleReset = () => {
    setSelectedIds([]);
    setSearchParams(buildResdexSearchParams(defaultResdexState), { replace: true });
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    syncUrl({ filters, page: 1 });
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    if (urlState.filters.skills.includes(skill)) {
      setSkillInput("");
      return;
    }
    handleFiltersChange({ ...urlState.filters, skills: [...urlState.filters.skills, skill] });
    setSkillInput("");
  };

  const handleStatusChange = useCallback(
    async (status: string, ids: string[]) => {
      const { error: updateError } = await supabase.from("applicants").update({ status }).in("id", ids);
      if (updateError) {
        toast.error(updateError.message);
        return;
      }
      toast.success(`Updated ${ids.length} candidate(s)`);
      void refetch();
    },
    [refetch]
  );

  const handleSingleStatus = (status: string, id: string) => {
    void handleStatusChange(status, [id]);
  };

  const handleAddToFolder = async (applicantId: string, folderId: string) => {
    await addToFolder(folderId, applicantId);
    toast.success("Added to folder");
    setFolderPickerId(null);
  };

  const handleDeleteApplicants = useCallback(
    async (ids: string[]) => {
      const result = await softDeleteApplicants(ids, user?.id);
      if (!result.ok) {
        toast.error(result.error ?? "Delete failed");
        return;
      }
      toast.success(`Removed ${ids.length} candidate(s) from search`);
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      void refetch();
    },
    [refetch, user?.id]
  );

  const handleSourceChip = (source: ApplicantSourceFilter) => {
    const next = { ...urlState.filters };
    if (source === "recent_7") {
      next.registeredDays = 7;
      next.applicantSource = "all";
    } else if (source === "recent_30") {
      next.registeredDays = 30;
      next.applicantSource = "all";
    } else {
      next.applicantSource = source;
      next.registeredDays = null;
    }
    syncUrl({ filters: next, page: 1 });
  };

  const activeSourceChip: ApplicantSourceFilter =
    urlState.filters.registeredDays === 7
      ? "recent_7"
      : urlState.filters.registeredDays === 30
        ? "recent_30"
        : urlState.filters.applicantSource ?? "all";

  const sourceChips: { id: ApplicantSourceFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "imported", label: "Imported" },
    { id: "registered", label: "Self-registered" },
    { id: "recent_7", label: "New (7d)" },
    { id: "recent_30", label: "New (30d)" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-52px)] flex-col">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">ResDex — Candidate Search</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching…" : `${totalCount.toLocaleString()} candidates in database`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={() => void refetch()} disabled={loading}>
              <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/admin/data/import">
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Import
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left filter sidebar — desktop */}
        <div className="hidden lg:flex">
          <AdminResdexSidebar
            filters={urlState.filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
            skillInput={skillInput}
            onSkillInputChange={setSkillInput}
            onAddSkill={handleAddSkill}
          />
        </div>

        {/* Results panel */}
        <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
          <div className="border-b border-slate-200 bg-white px-4 py-2.5 md:px-5">
            <div className="flex flex-wrap gap-2">
              {sourceChips.map((chip) => (
                <Button
                  key={chip.id}
                  type="button"
                  size="sm"
                  variant={activeSourceChip === chip.id ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => handleSourceChip(chip.id)}
                >
                  {chip.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-b border-slate-200 bg-white px-4 py-3 md:px-5">
            <ResdexSearchBar
              value={draftQ}
              mode={urlState.mode}
              onChange={setDraftQ}
              onModeChange={(mode) => syncUrl({ mode, page: 1 })}
              onSearch={() => commitSearch(draftQ)}
            />
          </div>

          {/* Sort / view toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 md:px-5">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="inline-block h-4 w-40" />
              ) : (
                <>
                  Showing <span className="font-medium text-foreground">{showingFrom}–{showingTo}</span> of{" "}
                  <span className="font-medium text-foreground">{totalCount.toLocaleString()}</span> candidates
                </>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={urlState.sort}
                onValueChange={(v) => syncUrl({ sort: v as ResdexSort, page: 1 })}
              >
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="experience_desc">Experience ↓</SelectItem>
                  <SelectItem value="experience_asc">Experience ↑</SelectItem>
                  <SelectItem value="ctc_desc">CTC ↓</SelectItem>
                  <SelectItem value="ctc_asc">CTC ↑</SelectItem>
                </SelectContent>
              </Select>
              <div className="inline-flex rounded-md border p-0.5">
                <Button
                  type="button"
                  size="sm"
                  variant={urlState.view === "card" ? "default" : "ghost"}
                  className="h-7 px-2"
                  onClick={() => syncUrl({ view: "card" })}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={urlState.view === "table" ? "default" : "ghost"}
                  className="h-7 px-2"
                  onClick={() => syncUrl({ view: "table" })}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-5">
            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Search failed</p>
                  <p className="text-xs opacity-80">{error.message}</p>
                  <Button variant="link" className="h-auto p-0 text-destructive" onClick={() => void refetch()}>
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 w-full rounded-lg" />
                ))}
              </div>
            )}

            {!loading && !error && applicants.length === 0 && (
              <div className="rounded-lg border bg-white py-16 text-center">
                <p className="text-base font-medium text-slate-900">No candidates found</p>
                <p className="mt-1 text-sm text-muted-foreground">Adjust keywords or filters and try again.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleReset}>
                  Clear all filters
                </Button>
              </div>
            )}

            {!loading && !error && applicants.length > 0 && urlState.view === "card" && (
              <div className="space-y-3">
                {applicants.map((a) => (
                  <AdminCandidateCard
                    key={a.id}
                    applicant={a}
                    selected={selectedIds.includes(a.id)}
                    onSelect={(checked) =>
                      setSelectedIds((ids) =>
                        checked ? [...ids, a.id] : ids.filter((id) => id !== a.id)
                      )
                    }
                    searchQuery={urlState.q}
                    searchMode={urlState.mode}
                    onAddToFolder={(id) => setFolderPickerId(id)}
                    onStatusChange={handleSingleStatus}
                  />
                ))}
              </div>
            )}

            {!loading && !error && applicants.length > 0 && urlState.view === "table" && (
              <ApplicantTable
                applicants={applicants}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                sortField={sortRpc.field}
                sortDirection={sortRpc.order}
                onSort={(field) => {
                  const map: Record<string, ResdexSort> = {
                    relevance: "relevance",
                    updated_at: "latest",
                    experience: "experience_desc",
                    currentCTC: "ctc_desc",
                  };
                  syncUrl({ sort: map[field] ?? "relevance", page: 1 });
                }}
                isAdmin
                onDelete={(id) => setDeleteTargetId(id)}
                onAddToFolder={(id) => setFolderPickerId(id)}
              />
            )}

            {totalPages > 1 && !loading && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={urlState.page <= 1}
                  onClick={() => syncUrl({ page: urlState.page - 1 })}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {urlState.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={urlState.page >= totalPages}
                  onClick={() => syncUrl({ page: urlState.page + 1 })}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Folder picker for single-card add */}
      {folderPickerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <p className="mb-3 text-sm font-semibold">Add to folder</p>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {folders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No folders yet.</p>
              ) : (
                folders.map((f) => (
                  <Button
                    key={f.id}
                    variant="ghost"
                    className="h-9 w-full justify-start text-sm"
                    onClick={() => void handleAddToFolder(folderPickerId, f.id)}
                  >
                    {f.name}
                  </Button>
                ))
              )}
            </div>
            <Button variant="outline" className="mt-3 w-full" onClick={() => setFolderPickerId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-[min(92vw,300px)] p-0">
          <SheetTitle className="sr-only">Search filters</SheetTitle>
          <AdminResdexSidebar
            filters={urlState.filters}
            onChange={(f) => {
              handleFiltersChange(f);
            }}
            onReset={handleReset}
            skillInput={skillInput}
            onSkillInputChange={setSkillInput}
            onAddSkill={handleAddSkill}
          />
        </SheetContent>
      </Sheet>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        selectedApplicants={selectedApplicants as Applicant[]}
        folders={folders}
        onClearSelection={() => setSelectedIds([])}
        onAddToFolder={addToFolder}
        onExportExcel={(rows) => exportApplicantsToExcel(rows, `candidates-${Date.now()}`)}
        onExportCsv={(rows) => exportApplicantsToCsv(rows, `candidates-${Date.now()}`)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteApplicants}
        isAdmin
      />

      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this candidate?</AlertDialogTitle>
            <AlertDialogDescription>
              The profile will be soft-deleted and hidden from ResDex. This is logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                if (!deleteTargetId) return;
                setDeleting(true);
                void handleDeleteApplicants([deleteTargetId]).finally(() => {
                  setDeleting(false);
                  setDeleteTargetId(null);
                });
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApplicantsManagement;
