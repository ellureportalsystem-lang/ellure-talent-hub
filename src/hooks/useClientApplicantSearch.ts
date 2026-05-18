import { useState, useEffect, useCallback } from "react";
import { searchApplicants, type ApplicantSearchParams } from "@/services/searchService";
import type { Applicant } from "@/hooks/useApplicants";
import type { SearchFilters } from "@/types/searchFilters";

export function useClientApplicantSearch(clientId: string | undefined, params: {
  searchQuery?: string;
  filters?: Partial<SearchFilters>;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSearch = useCallback(async () => {
    if (!clientId) {
      setApplicants([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const searchParams: ApplicantSearchParams = {
        ...params,
        clientId,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 25,
      };
      const result = await searchApplicants(searchParams);
      setApplicants(result.applicants);
      setTotalCount(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
      setApplicants([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    clientId,
    params.searchQuery,
    params.page,
    params.pageSize,
    params.sortField,
    params.sortOrder,
    JSON.stringify(params.filters),
  ]);

  useEffect(() => {
    void fetchSearch();
  }, [fetchSearch]);

  return { applicants, loading, error, totalCount, refetch: fetchSearch };
}
