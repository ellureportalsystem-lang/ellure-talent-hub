import { supabase } from "@/lib/supabase";
import { booleanToTsquery } from "@/utils/booleanSearchParser";
import type { Applicant } from "@/hooks/useApplicants";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";

export interface ApplicantSearchParams {
  searchQuery?: string;
  filters?: Partial<SearchFilters> & {
    isActivelyLooking?: boolean | null;
    isVerified?: boolean | null;
    hasResume?: boolean | null;
    profileCompleteRange?: [number, number];
    status?: string[];
  };
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  clientId?: string;
}

const NOTICE_PERIOD_DAYS: Record<string, number> = {
  Immediate: 0,
  "15 days": 15,
  "30 days": 30,
  "45 days": 45,
  "60 days": 60,
  "90 days": 90,
  "More than 90 days": 120,
};

function mapNoticePeriods(periods: string[]): number[] | null {
  if (!periods.length) return null;
  return periods.map((p) => NOTICE_PERIOD_DAYS[p]).filter((d) => d !== undefined);
}

function registeredAfter(days: number | null): string | null {
  if (days === null) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export interface ApplicantSearchResult {
  applicants: Applicant[];
  total: number;
}

export async function searchApplicants(
  params: ApplicantSearchParams
): Promise<ApplicantSearchResult> {
  const {
    searchQuery = "",
    filters = {},
    sortField = "updated_at",
    sortOrder = "desc",
    page = 1,
    pageSize = 25,
    clientId,
  } = params;

  const tsquery = booleanToTsquery(searchQuery);
  const sortMap: Record<string, string> = {
    created_at: "updated_at",
    updated_at: "updated_at",
    lastActive: "updated_at",
    relevance: "relevance",
    name: "name",
    experience: "experience",
    profile_complete_percent: "profile_complete_percent",
    profileCompletion: "profile_complete_percent",
  };

  const { data, error } = await supabase.rpc("search_applicants", {
    p_tsquery: tsquery,
    p_experience_min: filters.experienceRange?.[0] ?? null,
    p_experience_max: filters.experienceRange?.[1] ?? null,
    p_current_ctc_min: filters.salaryRange?.[0] ?? null,
    p_current_ctc_max: filters.salaryRange?.[1] ?? null,
    p_expected_ctc_min: null,
    p_expected_ctc_max: null,
    p_notice_period_days: mapNoticePeriods(filters.noticePeriod ?? []),
    p_cities: filters.currentCity?.length ? filters.currentCity : null,
    p_education_levels: filters.education?.length ? filters.education : null,
    p_skills: filters.skills?.length ? filters.skills : null,
    p_is_actively_looking: filters.isActivelyLooking ?? null,
    p_is_verified: filters.isVerified ?? null,
    p_has_resume: filters.hasResume ?? null,
    p_profile_complete_min: filters.profileCompleteRange?.[0] ?? null,
    p_profile_complete_max: filters.profileCompleteRange?.[1] ?? null,
    p_status: filters.status?.length ? filters.status : null,
    p_registered_after: registeredAfter(filters.registeredDays ?? null),
    p_sort_field: sortMap[sortField] ?? "updated_at",
    p_sort_order: sortOrder,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize,
    p_client_id: clientId ?? null,
  });

  if (error) {
    console.error("search_applicants RPC error:", error);
    throw new Error(error.message);
  }

  const payload = data as { total?: number; rows?: Applicant[] } | null;
  return {
    applicants: payload?.rows ?? [],
    total: Number(payload?.total ?? 0),
  };
}
