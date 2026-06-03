import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Filter,
  RefreshCw,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Upload,
} from "lucide-react";
import BooleanSearchBar from "@/components/dashboard/admin/BooleanSearchBar";
import ResumeSearchFilters, {
  SearchFilters,
} from "@/components/dashboard/admin/ResumeSearchFilters";
import ApplicantTable from "@/components/dashboard/admin/ApplicantTable";
import BulkActionsBar from "@/components/dashboard/admin/BulkActionsBar";
import { useApplicantSearch } from "@/hooks/useApplicantSearch";
import { useShortlists } from "@/hooks/useShortlists";
import { exportApplicantsToCsv, exportApplicantsToExcel } from "@/utils/applicantExport";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import type { Applicant } from "@/hooks/useApplicants";

const currentYear = new Date().getFullYear();

const defaultFilters: SearchFilters = {
  keywords: "",
  experienceRange: [0, 20],
  salaryRange: [0, 100],
  currentCity: [],
  preferredCity: [],
  skills: [],
  noticePeriod: [],
  education: [],
  currentCompany: [],
  pastCompanies: [],
  gender: [],
  registeredDays: null,
  activeDays: null,
  resumeUpdatedDays: null,
  yearOfPassing: [2000, currentYear],
  isActivelyLooking: null,
  isVerified: null,
  hasResume: null,
  profileCompleteRange: [0, 100],
  status: [],
};

const ApplicantsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { folders, addToFolder } = useShortlists("admin");

  const searchFilters = useMemo(
    () => ({
      ...filters,
      experienceRange:
        filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20
          ? filters.experienceRange
          : undefined,
      salaryRange:
        filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100
          ? filters.salaryRange
          : undefined,
      profileCompleteRange:
        filters.profileCompleteRange[0] > 0 || filters.profileCompleteRange[1] < 100
          ? filters.profileCompleteRange
          : undefined,
    }),
    [filters]
  );

  const effectiveSortField =
    submittedQuery.trim() && sortField === "updated_at" ? "relevance" : sortField;

  const { applicants: paginatedApplicants, loading, totalCount, error, refetch } = useApplicantSearch({
    searchQuery: submittedQuery,
    filters: searchFilters,
    sortField: effectiveSortField === "lastActive" ? "updated_at" : effectiveSortField,
    sortOrder: sortDirection,
    page: currentPage,
    pageSize,
  });

  const selectedApplicants = useMemo(
    () => paginatedApplicants.filter((a) => selectedIds.includes(a.id)),
    [paginatedApplicants, selectedIds]
  );

  const displayTotal = totalCount;
  const totalPages = Math.max(1, Math.ceil(displayTotal / pageSize));

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSearch = () => {
    setSubmittedQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
    setSubmittedQuery("");
    setCurrentPage(1);
  };

  const isFiltered =
    submittedQuery.trim().length > 0 ||
    filters.currentCity.length > 0 ||
    filters.preferredCity.length > 0 ||
    filters.skills.length > 0 ||
    filters.education.length > 0 ||
    filters.noticePeriod.length > 0 ||
    filters.currentCompany.length > 0 ||
    filters.pastCompanies.length > 0 ||
    filters.gender.length > 0 ||
    filters.status.length > 0 ||
    filters.experienceRange[0] > 0 ||
    filters.experienceRange[1] < 20 ||
    filters.salaryRange[0] > 0 ||
    filters.salaryRange[1] < 100 ||
    filters.yearOfPassing[0] > 2000 ||
    filters.yearOfPassing[1] < currentYear ||
    filters.registeredDays !== null ||
    filters.activeDays !== null ||
    filters.resumeUpdatedDays !== null ||
    filters.isActivelyLooking !== null ||
    filters.isVerified !== null ||
    filters.hasResume !== null ||
    filters.profileCompleteRange[0] > 0 ||
    filters.profileCompleteRange[1] < 100;

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Resume Search
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? 'Searching...' : `${displayTotal.toLocaleString()} candidates in database`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button variant="default" size="sm" className="h-8 text-xs" asChild>
            <Link to="/dashboard/admin/applicants/bulk-resumes">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Bulk CV upload
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <BooleanSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {/* Filters + results */}
      <div className="space-y-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-4 lg:space-y-0">
        <div className="lg:sticky lg:top-20">
          <ResumeSearchFilters
            filters={filters}
            onFiltersChange={(f) => {
              setFilters(f);
              setCurrentPage(1);
            }}
            onReset={handleResetFilters}
            isCollapsed={filtersCollapsed}
            onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          />
        </div>

        {/* Results */}
        <div className="space-y-3 min-w-0">
          {/* Results toolbar */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums">
                {loading ? (
                  <Skeleton className="h-4 w-12 inline-block" />
                ) : (
                  <span className="text-primary font-bold">{displayTotal.toLocaleString()}</span>
                )}
                <span className="text-muted-foreground ml-1.5">results</span>
              </span>
              {isFiltered && (
                <Badge variant="secondary" className="gap-1 text-[10px] h-5">
                  <Filter className="h-3 w-3" />
                  Filtered
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(parseInt(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Error Loading Candidates</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {error.message || 'Failed to fetch applicants.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table */}
          {!error && loading && <SkeletonTable rows={Math.min(pageSize, 10)} cols={6} />}
          {!error && !loading && (
            <ApplicantTable
              applicants={paginatedApplicants}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isAdmin={true}
            />
          )}

          {/* Empty State */}
          {!loading && !error && paginatedApplicants.length === 0 && (
            <Card className="border">
              <CardContent className="p-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                <h3 className="text-base font-semibold mb-1">No candidates found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isFiltered ? "Try adjusting your search or filters" : "No applicants in the database yet"}
                </p>
                {isFiltered && (
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>Clear Filters</Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                {loading ? "Loading..." : (
                  <>
                    Showing {((currentPage - 1) * pageSize + 1).toLocaleString()}-{Math.min(currentPage * pageSize, displayTotal).toLocaleString()} of {displayTotal.toLocaleString()}
                  </>
                )}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronsRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BulkActionsBar
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        selectedApplicants={selectedApplicants}
        folders={folders}
        onClearSelection={() => setSelectedIds([])}
        onAddToFolder={addToFolder}
        onExportExcel={(rows) => exportApplicantsToExcel(rows, `candidates-${Date.now()}`)}
        onExportCsv={(rows) => exportApplicantsToCsv(rows, `candidates-${Date.now()}`)}
        onStatusChange={handleStatusChange}
        isAdmin
      />
    </div>
  );
};

export default ApplicantsManagement;
