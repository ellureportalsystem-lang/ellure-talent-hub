import { useEffect, useState } from "react";
import {
  fetchFilterCities,
  fetchFilterSkills,
  fetchFilterCompanies,
  fetchFilterJobRoles,
} from "@/services/dashboardService";

export type ResdexFilterOptions = {
  cities: string[];
  skills: string[];
  companies: string[];
  jobRoles: string[];
  loading: boolean;
};

export function useResdexFilterOptions(): ResdexFilterOptions {
  const [state, setState] = useState<ResdexFilterOptions>({
    cities: [],
    skills: [],
    companies: [],
    jobRoles: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchFilterCities(),
      fetchFilterSkills(),
      fetchFilterCompanies(),
      fetchFilterJobRoles(),
    ])
      .then(([cities, skills, companies, jobRoles]) => {
        if (!cancelled) {
          setState({ cities, skills, companies, jobRoles, loading: false });
        }
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/** Match suggestions from live DB values only (no demo/static lists). */
export function matchResdexSuggestions(
  query: string,
  options: Pick<ResdexFilterOptions, "cities" | "skills" | "companies" | "jobRoles">,
  limit = 10
): string[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const pool = [
    ...options.skills,
    ...options.companies,
    ...options.jobRoles,
    ...options.cities,
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of pool) {
    const norm = item.trim();
    if (!norm || seen.has(norm.toLowerCase())) continue;
    if (norm.toLowerCase().includes(q)) {
      seen.add(norm.toLowerCase());
      out.push(norm);
      if (out.length >= limit) break;
    }
  }
  return out;
}
