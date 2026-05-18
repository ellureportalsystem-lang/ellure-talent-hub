import { useState, useEffect, useCallback } from "react";
import { searchApplicants, ApplicantSearchParams } from "@/services/searchService";
import type { Applicant } from "@/hooks/useApplicants";

export type { Applicant } from "@/hooks/useApplicants";

export function useApplicantSearch(params: ApplicantSearchParams) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchApplicants(params);
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
    params.searchQuery,
    params.page,
    params.pageSize,
    params.sortField,
    params.sortOrder,
    params.clientId,
    JSON.stringify(params.filters),
  ]);

  useEffect(() => {
    void fetchSearch();
  }, [fetchSearch]);

  return { applicants, loading, error, totalCount, refetch: fetchSearch };
}
