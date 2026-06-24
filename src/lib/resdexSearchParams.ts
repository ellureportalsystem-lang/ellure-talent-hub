import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";

export type SearchMode = "normal" | "boolean";
export type ResultView = "card" | "table";
export type ResdexPageSize = 40 | 80 | 160 | 500;
export type ResdexSort =
  | "relevance"
  | "latest"
  | "experience_asc"
  | "experience_desc"
  | "ctc_asc"
  | "ctc_desc";

export type ResdexSearchState = {
  q: string;
  mode: SearchMode;
  sort: ResdexSort;
  view: ResultView;
  page: number;
  pageSize: ResdexPageSize;
  activeIn: string;
  nvite: boolean;
  filters: SearchFilters;
};

const currentYear = new Date().getFullYear();

export const defaultResdexFilters: SearchFilters = {
  keywords: "",
  experienceRange: [0, 30],
  salaryRange: [0, 100],
  expectedSalaryRange: [0, 100],
  currentCity: [],
  preferredCity: [],
  skills: [],
  noticePeriod: [],
  education: [],
  currentCompany: [],
  pastCompanies: [],
  gender: [],
  experienceTypes: [],
  jobRoles: [],
  degreeCourse: "",
  registeredDays: null,
  activeDays: null,
  resumeUpdatedDays: null,
  yearOfPassing: [2000, currentYear],
  isActivelyLooking: null,
  isVerified: null,
  hasResume: null,
  openToRelocate: null,
  profileCompleteRange: [0, 100],
  status: [],
  applicantSource: "all",
};

export const defaultResdexState: ResdexSearchState = {
  q: "",
  mode: "normal",
  sort: "relevance",
  view: "card",
  page: 1,
  pageSize: 40,
  activeIn: "6",
  nvite: false,
  filters: defaultResdexFilters,
};

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((s) => decodeURIComponent(s.trim())).filter(Boolean);
}

function joinList(values: string[]): string | undefined {
  if (!values.length) return undefined;
  return values.map(encodeURIComponent).join(",");
}

function triState(param: string | null): boolean | null {
  if (param === "1") return true;
  if (param === "0") return false;
  return null;
}

export function parseResdexSearchParams(search: string): ResdexSearchState {
  const params = new URLSearchParams(search);
  const expMin = Number(params.get("exp_min") ?? 0);
  const expMax = Number(params.get("exp_max") ?? 30);
  const ctcMin = Number(params.get("ctc_min") ?? 0);
  const ctcMax = Number(params.get("ctc_max") ?? 100);
  const ectcMin = Number(params.get("ectc_min") ?? 0);
  const ectcMax = Number(params.get("ectc_max") ?? 100);
  const yopMin = Number(params.get("yop_min") ?? 2000);
  const yopMax = Number(params.get("yop_max") ?? currentYear);
  const pcmMin = Number(params.get("pcm_min") ?? 0);
  const pcmMax = Number(params.get("pcm_max") ?? 100);

  const updated = params.get("updated");
  const activeDays =
    updated === "7" ? 7 : updated === "30" ? 30 : updated === "90" ? 90 : null;
  const regParam = params.get("reg");
  const registeredDays = regParam ? Number(regParam) : null;
  const sourceParam = params.get("source");
  const applicantSource =
    sourceParam === "imported" || sourceParam === "registered" ? sourceParam : "all";

  return {
    q: params.get("q") ?? "",
    mode: params.get("mode") === "boolean" ? "boolean" : "normal",
    sort: (params.get("sort") as ResdexSort) || "relevance",
    view: params.get("view") === "table" ? "table" : "card",
    page: Math.max(1, Number(params.get("page") ?? 1)),
    pageSize: ([40, 80, 160, 500].includes(Number(params.get("show"))) ? Number(params.get("show")) : 40) as ResdexPageSize,
    activeIn: params.get("activeIn") ?? "6",
    nvite: params.get("nvite") === "1",
    filters: {
      ...defaultResdexFilters,
      experienceRange: [expMin, expMax],
      salaryRange: [ctcMin, ctcMax],
      expectedSalaryRange: [ectcMin, ectcMax],
      currentCity: splitList(params.get("cities")),
      skills: splitList(params.get("skills")),
      noticePeriod: splitList(params.get("notice")),
      education: splitList(params.get("education")),
      currentCompany: splitList(params.get("companies")),
      jobRoles: splitList(params.get("job_roles")),
      gender: splitList(params.get("gender")),
      experienceTypes: splitList(params.get("exp_type")),
      status: splitList(params.get("status")),
      degreeCourse: params.get("degree") ?? "",
      isActivelyLooking: triState(params.get("active")),
      isVerified: triState(params.get("verified")),
      hasResume: triState(params.get("resume")),
      openToRelocate: triState(params.get("relocate")),
      activeDays,
      registeredDays: registeredDays && !Number.isNaN(registeredDays) ? registeredDays : null,
      yearOfPassing: [yopMin, yopMax],
      profileCompleteRange: [pcmMin, pcmMax],
      applicantSource,
    },
  };
}

function isDefaultRange(range: [number, number], min: number, max: number) {
  return range[0] <= min && range[1] >= max;
}

export function buildResdexSearchParams(state: ResdexSearchState): URLSearchParams {
  const p = new URLSearchParams();
  const { filters: f } = state;

  if (state.q.trim()) p.set("q", state.q.trim());
  if (state.mode === "boolean") p.set("mode", "boolean");
  if (state.sort !== "relevance") p.set("sort", state.sort);
  if (state.view === "table") p.set("view", "table");
  if (state.page > 1) p.set("page", String(state.page));
  if (state.pageSize !== 40) p.set("show", String(state.pageSize));
  if (state.activeIn && state.activeIn !== "6") p.set("activeIn", state.activeIn);
  if (state.nvite) p.set("nvite", "1");

  if (!isDefaultRange(f.experienceRange, 0, 30)) {
    p.set("exp_min", String(f.experienceRange[0]));
    p.set("exp_max", String(f.experienceRange[1]));
  }
  if (!isDefaultRange(f.salaryRange, 0, 100)) {
    p.set("ctc_min", String(f.salaryRange[0]));
    p.set("ctc_max", String(f.salaryRange[1]));
  }
  if (!isDefaultRange(f.expectedSalaryRange, 0, 100)) {
    p.set("ectc_min", String(f.expectedSalaryRange[0]));
    p.set("ectc_max", String(f.expectedSalaryRange[1]));
  }
  if (!isDefaultRange(f.yearOfPassing, 2000, currentYear)) {
    p.set("yop_min", String(f.yearOfPassing[0]));
    p.set("yop_max", String(f.yearOfPassing[1]));
  }
  if (!isDefaultRange(f.profileCompleteRange, 0, 100)) {
    p.set("pcm_min", String(f.profileCompleteRange[0]));
    p.set("pcm_max", String(f.profileCompleteRange[1]));
  }

  const cities = joinList(f.currentCity);
  if (cities) p.set("cities", cities);
  const skills = joinList(f.skills);
  if (skills) p.set("skills", skills);
  const notice = joinList(f.noticePeriod);
  if (notice) p.set("notice", notice);
  const education = joinList(f.education);
  if (education) p.set("education", education);
  const companies = joinList(f.currentCompany);
  if (companies) p.set("companies", companies);
  const jobRoles = joinList(f.jobRoles);
  if (jobRoles) p.set("job_roles", jobRoles);
  const gender = joinList(f.gender);
  if (gender) p.set("gender", gender);
  const expType = joinList(f.experienceTypes);
  if (expType) p.set("exp_type", expType);
  const status = joinList(f.status);
  if (status) p.set("status", status);

  if (f.degreeCourse.trim()) p.set("degree", f.degreeCourse.trim());
  if (f.isActivelyLooking === true) p.set("active", "1");
  if (f.isActivelyLooking === false) p.set("active", "0");
  if (f.isVerified === true) p.set("verified", "1");
  if (f.isVerified === false) p.set("verified", "0");
  if (f.hasResume === true) p.set("resume", "1");
  if (f.hasResume === false) p.set("resume", "0");
  if (f.openToRelocate === true) p.set("relocate", "1");
  if (f.openToRelocate === false) p.set("relocate", "0");
  if (f.activeDays === 7) p.set("updated", "7");
  if (f.activeDays === 30) p.set("updated", "30");
  if (f.activeDays === 90) p.set("updated", "90");
  if (f.registeredDays) p.set("reg", String(f.registeredDays));
  if (f.applicantSource && f.applicantSource !== "all") p.set("source", f.applicantSource);

  return p;
}

export function sortToRpc(sort: ResdexSort): { field: string; order: "asc" | "desc" } {
  switch (sort) {
    case "latest":
      return { field: "updated_at", order: "desc" };
    case "experience_asc":
      return { field: "experience", order: "asc" };
    case "experience_desc":
      return { field: "experience", order: "desc" };
    case "ctc_asc":
      return { field: "currentCTC", order: "asc" };
    case "ctc_desc":
      return { field: "currentCTC", order: "desc" };
    default:
      return { field: "relevance", order: "desc" };
  }
}
