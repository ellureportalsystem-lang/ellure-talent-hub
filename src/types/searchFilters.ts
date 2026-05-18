export interface SearchFilters {
  keywords: string;
  experienceRange: [number, number];
  salaryRange: [number, number];
  currentCity: string[];
  preferredCity: string[];
  skills: string[];
  noticePeriod: string[];
  education: string[];
  currentCompany: string[];
  pastCompanies: string[];
  gender: string[];
  registeredDays: number | null;
  activeDays: number | null;
  resumeUpdatedDays: number | null;
  yearOfPassing: [number, number];
  isActivelyLooking: boolean | null;
  isVerified: boolean | null;
  hasResume: boolean | null;
  profileCompleteRange: [number, number];
  status: string[];
}

export const defaultSearchFilters: SearchFilters = {
  keywords: "",
  experienceRange: [0, 20],
  salaryRange: [0, 50],
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
  yearOfPassing: [1990, new Date().getFullYear()],
  isActivelyLooking: null,
  isVerified: null,
  hasResume: null,
  profileCompleteRange: [0, 100],
  status: [],
};
