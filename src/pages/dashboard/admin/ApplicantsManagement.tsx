import { useState, useMemo, useCallback, useEffect } from "react";
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
  LayoutGrid,
  List,
  RefreshCw,
  SlidersHorizontal,
  Loader2,
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
import { useApplicants, Applicant } from "@/hooks/useApplicants";

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
  yearOfPassing: [2000, 2025],
};

const ApplicantsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const dbFilters = useMemo(() => {
    const cities = filters.currentCity.length > 0 ? filters.currentCity : undefined;
    const skills = filters.skills.length > 0 ? filters.skills : undefined;
    const education = filters.education.length > 0 ? filters.education : undefined;
    const noticePeriod = filters.noticePeriod.length > 0 ? filters.noticePeriod : undefined;

    return {
      experience: filters.experienceRange as [number, number],
      salary: filters.salaryRange as [number, number],
      cities,
      skills,
      education,
      noticePeriod,
      status: undefined,
    };
  }, [filters]);

  const { applicants: allApplicants, loading, totalCount, error } = useApplicants({
    searchQuery: searchQuery.trim() || undefined,
    filters: dbFilters,
    sortField: sortField === "lastActive" ? "created_at" : sortField,
    sortOrder: sortDirection,
    page: currentPage,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading applicants:', error);
    }
  }, [error]);

  const parseBooleanSearch = useCallback((query: string, applicant: Applicant): boolean => {
    if (!query.trim()) return true;
    const lowerQuery = query.toLowerCase();
    const skillsArray = (applicant.key_skills || '').split(/[,;|]/).map(s => s.trim());
    const searchableText = [
      applicant.name || '',
      applicant.current_designation || applicant.job_role || '',
      applicant.current_company || '',
      ...skillsArray,
      applicant.city || applicant.city_current_location || '',
      applicant.highest_qualification || applicant.education_level || '',
    ].filter(Boolean).join(" ").toLowerCase();

    if (lowerQuery.includes(" not ")) {
      const [include, exclude] = lowerQuery.split(" not ");
      return (include ? searchableText.includes(include.replace(/"/g, "").trim()) : true) &&
        !(exclude ? searchableText.includes(exclude.replace(/"/g, "").trim()) : false);
    }
    if (lowerQuery.includes(" and ")) {
      return lowerQuery.split(" and ").map((t) => t.replace(/"/g, "").trim()).every((term) => searchableText.includes(term));
    }
    if (lowerQuery.includes(" or ")) {
      return lowerQuery.split(" or ").map((t) => t.replace(/"/g, "").trim()).some((term) => searchableText.includes(term));
    }
    return searchableText.includes(lowerQuery.replace(/"/g, ""));
  }, []);

  const filteredApplicants = useMemo(() => {
    if (!searchQuery.trim() || (!searchQuery.includes(" and ") && !searchQuery.includes(" or ") && !searchQuery.includes(" not "))) {
      return allApplicants;
    }
    return allApplicants.filter((applicant) => {
      if (!parseBooleanSearch(searchQuery, applicant)) return false;
      if (filters.yearOfPassing) {
        const passingYear = parseInt((applicant as any).year_of_passing || (applicant as any).passing_year?.toString() || '0');
        if (passingYear < filters.yearOfPassing[0] || passingYear > filters.yearOfPassing[1]) return false;
      }
      if (filters.registeredDays !== null) {
        const daysAgo = Math.floor((Date.now() - new Date(applicant.created_at).getTime()) / 86400000);
        if (daysAgo > filters.registeredDays) return false;
      }
      return true;
    });
  }, [allApplicants, searchQuery, filters, parseBooleanSearch]);

  const sortedApplicants = useMemo(() => {
    if (sortField === "created_at" || sortField === "updated_at") return filteredApplicants;
    return [...filteredApplicants].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name": comparison = (a.name || '').localeCompare(b.name || ''); break;
        case "experience":
          comparison = parseFloat(a.total_experience_numbers || a.total_experience || '0') - parseFloat(b.total_experience_numbers || b.total_experience || '0');
          break;
        case "currentCTC": comparison = parseFloat(a.current_ctc || '0') - parseFloat(b.current_ctc || '0'); break;
        case "currentCity": comparison = (a.city || a.city_current_location || '').localeCompare(b.city || b.city_current_location || ''); break;
        case "status": comparison = (a.status || '').localeCompare(b.status || ''); break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredApplicants, sortField, sortDirection]);

  const paginatedApplicants = useMemo(() => {
    if (filteredApplicants.length !== allApplicants.length) {
      const start = (currentPage - 1) * pageSize;
      return sortedApplicants.slice(start, start + pageSize);
    }
    return sortedApplicants;
  }, [sortedApplicants, currentPage, pageSize, filteredApplicants.length, allApplicants.length]);

  const displayTotal = filteredApplicants.length !== allApplicants.length ? filteredApplicants.length : totalCount;
  const totalPages = Math.ceil(displayTotal / pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const isFiltered = searchQuery.trim().length > 0 || filters.currentCity.length > 0 || filters.skills.length > 0 || filters.education.length > 0;

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Resume Search
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? 'Searching...' : `${displayTotal.toLocaleString()} candidates in database`}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            onSearch={() => setCurrentPage(1)}
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Filters Sidebar */}
        <ResumeSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
          isCollapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        />

        {/* Results */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* Results toolbar */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium tabular-nums">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin inline-block" />
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
              {filtersCollapsed && (
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setFiltersCollapsed(false)}>
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                  Filters
                </Button>
              )}
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
              <div className="flex items-center border rounded-md h-8 overflow-hidden">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-none h-8 w-8 p-0"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>
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
          {!error && (
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
        onClearSelection={() => setSelectedIds([])}
        isAdmin={true}
      />
    </div>
  );
};

export default ApplicantsManagement;
