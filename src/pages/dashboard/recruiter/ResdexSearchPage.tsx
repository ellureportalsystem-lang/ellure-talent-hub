import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";
import { buildResdexSearchParams, defaultResdexState, defaultResdexFilters } from "@/lib/resdexSearchParams";
import { loadRecentResdexSearches, saveRecentResdexSearch } from "@/lib/resdexRecentSearches";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchSavedSearches } from "@/services/clientService";
import { buildSavedSearchResultsUrl, type SavedSearchRow } from "@/lib/savedSearchUtils";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";
import {
  ResdexDiversitySection,
  ResdexEducationSection,
  ResdexEmploymentSection,
} from "@/components/dashboard/recruiter/ResdexSearchFormSections";
import { ResdexInfoHint } from "@/components/dashboard/recruiter/ResdexSearchFormUi";
import { ResdexAutocompleteInput } from "@/components/dashboard/recruiter/ResdexAutocompleteInput";
import { matchResdexSuggestions, useResdexFilterOptions } from "@/hooks/useResdexFilterOptions";
import { Clock, Bookmark } from "lucide-react";

export default function ResdexSearchPage() {
  const navigate = useNavigate();
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;

  const [keywords, setKeywords] = useState("");
  const [booleanOn, setBooleanOn] = useState(false);
  const [searchIn, setSearchIn] = useState("entire");
  const [filters, setFilters] = useState<SearchFilters>({ ...defaultResdexFilters });
  const [activeIn, setActiveIn] = useState("6");
  const [includeRelocate, setIncludeRelocate] = useState(true);
  const [includeNoSalary, setIncludeNoSalary] = useState(false);

  const [designation, setDesignation] = useState("");
  const [designationBoolean, setDesignationBoolean] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [ugMode, setUgMode] = useState<"any" | "specific" | "none">("any");
  const [pgMode, setPgMode] = useState<"any" | "specific" | "none">("any");
  const [institute, setInstitute] = useState("");

  const [location, setLocation] = useState("");
  const [excludeLocation, setExcludeLocation] = useState("");

  const [recent, setRecent] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchRow[]>([]);
  const filterOptions = useResdexFilterOptions();

  const keywordSuggestions = useMemo(
    () => matchResdexSuggestions(keywords, filterOptions, 12),
    [keywords, filterOptions]
  );

  const citySuggestions = filterOptions.cities;

  useEffect(() => {
    if (!clientId) return;
    setRecent(loadRecentResdexSearches(clientId));
    fetchSavedSearches(clientId)
      .then((rows) => setSavedSearches((rows as SavedSearchRow[]).slice(0, 5)))
      .catch(() => setSavedSearches([]));
  }, [clientId]);

  const buildSearchQuery = () => {
    const parts = [keywords.trim()];
    if (designation.trim()) {
      parts.push(designationBoolean ? `(${designation.trim()})` : designation.trim());
    }
    return parts.filter(Boolean).join(" ");
  };

  const handleSearch = () => {
    const q = buildSearchQuery();
    saveRecentResdexSearch(clientId, q);
    setRecent(loadRecentResdexSearches(clientId));

    const cities = [
      ...filters.currentCity,
      ...(location.trim() && !filters.currentCity.includes(location.trim()) ? [location.trim()] : []),
    ];

    const mergedFilters: SearchFilters = {
      ...filters,
      currentCity: cities,
      currentCompany: [...new Set([...filters.currentCompany, ...industries])],
      openToRelocate: includeRelocate ? true : filters.openToRelocate,
    };

    if (designation.trim() && !mergedFilters.jobRoles.includes(designation.trim())) {
      mergedFilters.jobRoles = [...mergedFilters.jobRoles, designation.trim()];
    }

    const state = {
      ...defaultResdexState,
      q,
      mode: booleanOn ? ("boolean" as const) : ("normal" as const),
      page: 1,
      activeIn,
      filters: mergedFilters,
    };

    const params = buildResdexSearchParams(state);
    if (activeIn) params.set("activeIn", activeIn);
    navigate(`/dashboard/client/resdex/results?${params.toString()}`);
  };

  const clearKeywords = () => setKeywords("");

  return (
    <NaukriPageContainer className="space-y-5 pb-24">
      <h1 className="text-xl font-semibold text-[#333]">Search candidates</h1>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-0">
          <Card className="border-slate-200 shadow-sm rounded-b-none border-b-0">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold text-slate-800">Keywords</Label>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Boolean {booleanOn ? "on" : "off"}</span>
                  <Switch checked={booleanOn} onCheckedChange={setBooleanOn} />
                </div>
              </div>
              <div className="relative">
                <ResdexAutocompleteInput
                  value={keywords}
                  onChange={setKeywords}
                  suggestions={keywordSuggestions}
                  multiline
                  placeholder="Enter keywords like skills, designation and company"
                  inputClassName="pr-16"
                />
                {keywords && (
                  <button
                    type="button"
                    onClick={clearKeywords}
                    className="absolute right-3 top-2 z-10 text-xs text-[#0566CD] hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Select value={searchIn} onValueChange={setSearchIn}>
                  <SelectTrigger className="w-56 h-9 text-xs">
                    <SelectValue placeholder="Search in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire">Search keyword in Entire resume</SelectItem>
                    <SelectItem value="skills">Skills only</SelectItem>
                    <SelectItem value="title">Designation only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <button type="button" className="text-sm text-[#0566CD] hover:underline">
                + Add IT Skills
              </button>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-800">Experience</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min experience"
                    value={filters.experienceRange[0] || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        experienceRange: [Number(e.target.value) || 0, filters.experienceRange[1]],
                      })
                    }
                    className="w-36 h-9"
                  />
                  <span className="text-sm text-slate-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max experience"
                    value={filters.experienceRange[1] >= 30 ? "" : filters.experienceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        experienceRange: [filters.experienceRange[0], Number(e.target.value) || 30],
                      })
                    }
                    className="w-36 h-9"
                  />
                  <span className="text-sm text-slate-500">Years</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-800">Current location of candidate</Label>
                <ResdexAutocompleteInput
                  value={location}
                  onChange={setLocation}
                  suggestions={citySuggestions}
                  placeholder="Add location"
                  onSelect={(city) => {
                    if (city && !filters.currentCity.includes(city)) {
                      setFilters({ ...filters, currentCity: [...filters.currentCity, city] });
                    }
                  }}
                />
                <Input
                  placeholder="Exclude location (optional)"
                  value={excludeLocation}
                  onChange={(e) => setExcludeLocation(e.target.value)}
                  className="h-9"
                />
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <Checkbox checked={includeRelocate} onCheckedChange={(c) => setIncludeRelocate(!!c)} />
                  Include candidates who prefer to relocate to above locations
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <Checkbox />
                  <span className="flex items-center gap-1">
                    Exclude candidates who have mentioned Anywhere in…
                    <ResdexInfoHint />
                  </span>
                </label>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-slate-800">Annual Salary</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Select defaultValue="INR">
                    <SelectTrigger className="w-20 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Min salary"
                    value={filters.salaryRange[0] || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        salaryRange: [Number(e.target.value) || 0, filters.salaryRange[1]],
                      })
                    }
                    className="w-28 h-9"
                  />
                  <span className="text-sm text-slate-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max salary"
                    value={filters.salaryRange[1] >= 100 ? "" : filters.salaryRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        salaryRange: [filters.salaryRange[0], Number(e.target.value) || 100],
                      })
                    }
                    className="w-28 h-9"
                  />
                  <span className="text-sm text-slate-500">Lacs</span>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <Checkbox checked={includeNoSalary} onCheckedChange={(c) => setIncludeNoSalary(!!c)} />
                  Include candidates who did not mention their current salary
                </label>
              </div>

              <ResdexEmploymentSection
                filters={filters}
                onChange={setFilters}
                designation={designation}
                onDesignationChange={setDesignation}
                designationBoolean={designationBoolean}
                onDesignationBooleanChange={setDesignationBoolean}
                industries={industries}
                onIndustriesChange={setIndustries}
                companySuggestions={filterOptions.companies.slice(0, 20)}
                roleSuggestions={filterOptions.jobRoles.slice(0, 20)}
              />

              <ResdexEducationSection
                filters={filters}
                onChange={setFilters}
                ugMode={ugMode}
                onUgModeChange={setUgMode}
                pgMode={pgMode}
                onPgModeChange={setPgMode}
                institute={institute}
                onInstituteChange={setInstitute}
              />

              <ResdexDiversitySection filters={filters} onChange={setFilters} />
            </CardContent>
          </Card>

          <div className="sticky bottom-0 z-10 flex items-center justify-between rounded-b-lg border border-t-0 border-slate-200 bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            <Select value={activeIn} onValueChange={setActiveIn}>
              <SelectTrigger className="w-48 h-9 border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active in — 1 month</SelectItem>
                <SelectItem value="3">Active in — 3 months</SelectItem>
                <SelectItem value="6">Active in — 6 months</SelectItem>
                <SelectItem value="12">Active in — 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-[#0566CD] hover:bg-[#0066c0] text-white px-10 h-10 rounded-md font-semibold"
            >
              Search candidates
            </Button>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-slate-500" />
                <h3 className="font-semibold text-slate-800">Recent Searches</h3>
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-slate-500">No recent searches</p>
              ) : (
                <ul className="space-y-3">
                  {recent.slice(0, 5).map((q) => (
                    <li key={q} className="text-sm border-b border-slate-100 pb-3 last:border-0">
                      <p className="text-slate-700 line-clamp-2">{q}</p>
                      <div className="mt-1 flex gap-3 text-xs text-[#0566CD]">
                        <button type="button" onClick={() => setKeywords(q)} className="hover:underline">
                          Fill this search
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setKeywords(q);
                            saveRecentResdexSearch(clientId, q);
                            const state = { ...defaultResdexState, q, page: 1, activeIn };
                            navigate(`/dashboard/client/resdex/results?${buildResdexSearchParams(state).toString()}`);
                          }}
                          className="hover:underline"
                        >
                          Search profiles
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-slate-500" />
                  <h3 className="font-semibold text-slate-800">Saved Searches</h3>
                </div>
                <Link to="/dashboard/client" className="text-xs text-[#0566CD] hover:underline">
                  View all
                </Link>
              </div>
              {savedSearches.length === 0 ? (
                <p className="text-sm text-slate-500">Save searches from the results page to reuse them here.</p>
              ) : (
                <ul className="space-y-3">
                  {savedSearches.map((row) => (
                    <li key={row.id} className="text-sm border-b border-slate-100 pb-3 last:border-0">
                      <Link
                        to={buildSavedSearchResultsUrl(row)}
                        className="font-medium text-[#0566CD] hover:underline line-clamp-1"
                      >
                        {row.name}
                      </Link>
                      <div className="mt-1 flex gap-3 text-xs text-[#0566CD]">
                        <Link to={buildSavedSearchResultsUrl(row)} className="hover:underline">
                          Search profiles
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </NaukriPageContainer>
  );
}
