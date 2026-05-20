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
    experienceType?: string | null;
    jobRoles?: string[];
  };
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  clientId?: string;
}

const NOTICE_PERIOD_MAP: Record<string, number> = {
  immediate: 0,
  "15 days": 15,
  "30 days": 30,
  "45 days": 45,
  "60 days": 60,
  "90 days": 90,
};

function mapNoticePeriods(periods: string[]): number[] | null {
  if (!periods.length) return null;
  const days = periods
    .map((p) => NOTICE_PERIOD_MAP[p.toLowerCase().trim()])
    .filter((d): d is number => d !== undefined);
  return days.length ? days : null;
}

function daysAgoTimestamp(days: number | null): string | null {
  if (days === null) return null;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const SORT_FIELD_MAP: Record<string, string> = {
  created_at: "registered_at",
  updated_at: "updated_at",
  lastActive: "updated_at",
  relevance: "relevance",
  name: "name",
  experience: "experience",
  primarySkill: "name",
  currentCity: "name",
  currentCTC: "ctc",
  noticePeriod: "notice_period",
  profile_complete_percent: "profile_complete_percent",
  profileCompletion: "profile_complete_percent",
};

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
  const gender = filters.gender?.length === 1 ? filters.gender[0] : null;

  const yearMaxDefault = new Date().getFullYear();
  const yearMin =
    filters.yearOfPassing?.[0] != null && filters.yearOfPassing[0] > 2000
      ? filters.yearOfPassing[0]
      : null;
  const yearMax =
    filters.yearOfPassing?.[1] != null && filters.yearOfPassing[1] < yearMaxDefault
      ? filters.yearOfPassing[1]
      : null;

  const { data, error } = await supabase.rpc("search_applicants", {
    p_tsquery: tsquery,
    p_experience_min: filters.experienceRange?.[0] ?? null,
    p_experience_max:
      filters.experienceRange?.[1] != null && filters.experienceRange[1] < 20
        ? filters.experienceRange[1]
        : null,
    p_current_ctc_min: filters.salaryRange?.[0] ?? null,
    p_current_ctc_max:
      filters.salaryRange?.[1] != null && filters.salaryRange[1] < 100
        ? filters.salaryRange[1]
        : null,
    p_expected_ctc_min: null,
    p_expected_ctc_max: null,
    p_notice_period_days: mapNoticePeriods(filters.noticePeriod ?? []),
    p_cities: filters.currentCity?.length ? filters.currentCity : null,
    p_education_levels: filters.education?.length ? filters.education : null,
    p_skills: filters.skills?.length ? filters.skills : null,
    p_companies: filters.currentCompany?.length ? filters.currentCompany : null,
    p_job_roles: filters.jobRoles?.length
      ? filters.jobRoles
      : null,
    p_gender: gender,
    p_year_of_passing_min: yearMin,
    p_year_of_passing_max: yearMax,
    p_is_actively_looking: filters.isActivelyLooking ?? null,
    p_is_verified: filters.isVerified ?? null,
    p_has_resume: filters.hasResume ?? null,
    p_profile_complete_min: filters.profileCompleteRange?.[0] ?? null,
    p_profile_complete_max:
      filters.profileCompleteRange?.[1] != null && filters.profileCompleteRange[1] < 100
        ? filters.profileCompleteRange[1]
        : null,
    p_status: filters.status?.length ? filters.status : null,
    p_registered_after: daysAgoTimestamp(filters.registeredDays ?? null),
    p_updated_after: daysAgoTimestamp(filters.activeDays ?? null),
    p_experience_type: filters.experienceType ?? null,
    p_sort_field: SORT_FIELD_MAP[sortField] ?? "updated_at",
    p_sort_dir: sortOrder,
    p_page: page,
    p_page_size: pageSize,
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
