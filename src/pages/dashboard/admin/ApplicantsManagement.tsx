import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import BooleanSearchBar from "@/components/dashboard/admin/BooleanSearchBar";
import ResumeSearchFilters, {
  SearchFilters,
} from "@/components/dashboard/admin/ResumeSearchFilters";
import ApplicantTable from "@/components/dashboard/admin/ApplicantTable";
import BulkActionsBar from "@/components/dashboard/admin/BulkActionsBar";
import { mockApplicants, Applicant } from "@/data/mockApplicants";

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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState("lastActive");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Boolean search parser
  const parseBooleanSearch = useCallback((query: string, applicant: Applicant): boolean => {
    if (!query.trim()) return true;

    // Convert to lowercase for case-insensitive matching
    const lowerQuery = query.toLowerCase();
    const searchableText = [
      applicant.name,
      applicant.designation,
      applicant.currentCompany,
      ...applicant.skills,
      applicant.currentCity,
      applicant.education.degree,
    ]
      .join(" ")
      .toLowerCase();

    // Simple boolean parser
    // Handle NOT
    if (lowerQuery.includes(" not ")) {
      const [include, exclude] = lowerQuery.split(" not ");
      const includeMatch = include ? searchableText.includes(include.replace(/"/g, "").trim()) : true;
      const excludeMatch = exclude ? searchableText.includes(exclude.replace(/"/g, "").trim()) : false;
      return includeMatch && !excludeMatch;
    }

    // Handle AND
    if (lowerQuery.includes(" and ")) {
      const terms = lowerQuery.split(" and ").map((t) => t.replace(/"/g, "").trim());
      return terms.every((term) => searchableText.includes(term));
    }

    // Handle OR
    if (lowerQuery.includes(" or ")) {
      const terms = lowerQuery.split(" or ").map((t) => t.replace(/"/g, "").trim());
      return terms.some((term) => searchableText.includes(term));
    }

    // Simple search
    return searchableText.includes(lowerQuery.replace(/"/g, ""));
  }, []);

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    return mockApplicants.filter((applicant) => {
      // Boolean search
      if (!parseBooleanSearch(searchQuery, applicant)) return false;

      // Experience filter
      if (
        applicant.experience < filters.experienceRange[0] ||
        applicant.experience > filters.experienceRange[1]
      )
        return false;

      // Salary filter
      if (
        applicant.currentCTC < filters.salaryRange[0] ||
        applicant.currentCTC > filters.salaryRange[1]
      )
        return false;

      // Location filter
      if (
        filters.currentCity.length > 0 &&
        !filters.currentCity.includes(applicant.currentCity)
      )
        return false;

      if (
        filters.preferredCity.length > 0 &&
        !filters.preferredCity.includes(applicant.preferredCity)
      )
        return false;

      // Skills filter
      if (
        filters.skills.length > 0 &&
        !filters.skills.some((skill) => applicant.skills.includes(skill))
      )
        return false;

      // Notice period filter
      if (
        filters.noticePeriod.length > 0 &&
        !filters.noticePeriod.includes(applicant.noticePeriod)
      )
        return false;

      // Education filter
      if (
        filters.education.length > 0 &&
        !filters.education.includes(applicant.education.highest)
      )
        return false;

      // Current company filter
      if (
        filters.currentCompany.length > 0 &&
        !filters.currentCompany.includes(applicant.currentCompany)
      )
        return false;

      // Gender filter
      if (
        filters.gender.length > 0 &&
        !filters.gender.includes(applicant.gender)
      )
        return false;

      // Year of passing filter
      if (
        applicant.education.yearOfPassing < filters.yearOfPassing[0] ||
        applicant.education.yearOfPassing > filters.yearOfPassing[1]
      )
        return false;

      // Activity filters
      if (filters.registeredDays !== null) {
        const daysAgo = Math.floor(
          (Date.now() - new Date(applicant.registeredDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysAgo > filters.registeredDays) return false;
      }

      if (filters.activeDays !== null) {
        const daysAgo = Math.floor(
          (Date.now() - new Date(applicant.lastActive).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (daysAgo > filters.activeDays) return false;
      }

      return true;
    });
  }, [searchQuery, filters, parseBooleanSearch]);

  // Sort applicants
  const sortedApplicants = useMemo(() => {
    return [...filteredApplicants].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "experience":
          comparison = a.experience - b.experience;
          break;
        case "currentCTC":
          comparison = a.currentCTC - b.currentCTC;
          break;
        case "currentCity":
          comparison = a.currentCity.localeCompare(b.currentCity);
          break;
        case "lastActive":
          comparison =
            new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredApplicants, sortField, sortDirection]);

  // Paginate
  const paginatedApplicants = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedApplicants.slice(start, start + pageSize);
  }, [sortedApplicants, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedApplicants.length / pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Resume Search
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced candidate search with Boolean operators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg border-0 overflow-visible">
        <CardContent className="p-6">
          <BooleanSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <ResumeSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          onReset={handleResetFilters}
          isCollapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        />

        {/* Results */}
        <div className="flex-1 space-y-4">
          {/* Results Header */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {sortedApplicants.length.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">candidates found</span>
                  </div>
                  {(searchQuery || Object.values(filters).some(v => 
                    Array.isArray(v) ? v.length > 0 : v !== null && v !== defaultFilters[Object.keys(defaultFilters).find(k => defaultFilters[k as keyof SearchFilters] === v) as keyof SearchFilters]
                  )) && (
                    <Badge variant="secondary" className="gap-1">
                      <Filter className="h-3 w-3" />
                      Filtered
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {filtersCollapsed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFiltersCollapsed(false)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  )}
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(v) => {
                      setPageSize(parseInt(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "table" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="rounded-r-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-l-none"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <ApplicantTable
            applicants={paginatedApplicants}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            isAdmin={true}
          />

          {/* Pagination */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, sortedApplicants.length)} of{" "}
                  {sortedApplicants.length.toLocaleString()} candidates
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8"
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        isAdmin={true}
      />
    </div>
  );
};

export default ApplicantsManagement;
