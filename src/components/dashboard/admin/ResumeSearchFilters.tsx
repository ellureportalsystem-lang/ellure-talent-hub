import { useState, useEffect } from "react";
import { fetchFilterCities, fetchFilterSkills } from "@/services/dashboardService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { companyOptions, educationOptions, noticePeriodOptions } from "@/data/masterFilterOptions";

/** Pipeline statuses — must match values used in DB / Applicant table */
const APPLICANT_STATUS_OPTIONS = [
  "Active",
  "Shortlisted",
  "Interview",
  "Hired",
  "Rejected",
  "On Hold",
  "submitted",
] as const;

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

interface ResumeSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  /** @deprecated use layout="panel" + onClose */
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  layout?: "sidebar" | "panel";
  onClose?: () => void;
}

function RangeFilterBlock({
  label,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatMin,
  formatMax,
}: {
  label: string;
  hint?: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  formatMin: (n: number) => string;
  formatMax: (n: number) => string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/25 p-3 space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground mt-0.5">{hint}</p> : null}
      </div>
      <Slider value={value} onValueChange={(v) => onChange(v as [number, number])} min={min} max={max} step={step} />
      <p className="text-center text-xs font-semibold text-foreground tabular-nums">
        {formatMin(value[0])} – {formatMax(value[1])}
      </p>
    </div>
  );
}

const FilterSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const MultiSelectCheckbox = ({
  options,
  selected,
  onChange,
  maxDisplay = 8,
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  maxDisplay?: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, maxDisplay);

  return (
    <div className="space-y-2">
      {displayOptions.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...selected, option]);
              } else {
                onChange(selected.filter((s) => s !== option));
              }
            }}
          />
          <label
            htmlFor={option}
            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            {option}
          </label>
        </div>
      ))}
      {options.length > maxDisplay && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary p-0 h-auto"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : `+${options.length - maxDisplay} More`}
        </Button>
      )}
    </div>
  );
};

const ResumeSearchFilters = ({
  filters,
  onFiltersChange,
  onReset,
  isCollapsed = false,
  onToggleCollapse,
  layout = "sidebar",
  onClose,
}: ResumeSearchFiltersProps) => {
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterSkills().then(setSkillOptions);
    fetchFilterCities().then(setCityOptions);
  }, []);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const currentYear = new Date().getFullYear();

  const activeFiltersCount = [
    filters.currentCity.length > 0,
    filters.preferredCity.length > 0,
    filters.skills.length > 0,
    filters.noticePeriod.length > 0,
    filters.education.length > 0,
    filters.currentCompany.length > 0,
    filters.pastCompanies.length > 0,
    filters.gender.length > 0,
    filters.status.length > 0,
    filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20,
    filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100,
    filters.registeredDays !== null,
    filters.activeDays !== null,
    filters.resumeUpdatedDays !== null,
    filters.yearOfPassing[0] > 2000 || filters.yearOfPassing[1] < currentYear,
    filters.isActivelyLooking !== null,
    filters.isVerified !== null,
    filters.hasResume !== null,
    filters.profileCompleteRange[0] > 0 || filters.profileCompleteRange[1] < 100,
  ].filter(Boolean).length;

  const isPanel = layout === "panel";

  if (!isPanel && isCollapsed) {
    return (
      <Card className="w-full border shadow-sm">
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-none">Candidate filters</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} filter${activeFiltersCount === 1 ? "" : "s"} applied — expand to edit`
                  : "Expand to narrow by experience, salary, location, and more"}
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="shrink-0">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={onReset}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
            <Button type="button" size="sm" className="h-8 text-xs" onClick={() => onToggleCollapse?.()}>
              Show filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl border-border/80 shadow-sm">
      <CardHeader className="space-y-1 pb-3 border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base flex flex-wrap items-center gap-2">
              Filter candidates
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="font-normal">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 max-w-2xl">
              Narrow the list by experience, salary, location, and status.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2 text-xs"
              title="Reset all filters"
            >
              <RotateCcw className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={isPanel ? onClose : onToggleCollapse}
              className="h-8 w-8 p-0"
              title="Hide filters"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
            <TabsTrigger value="basics" className="text-xs sm:text-sm">
              Basics
            </TabsTrigger>
            <TabsTrigger value="place" className="text-xs sm:text-sm">
              Location
            </TabsTrigger>
            <TabsTrigger value="employers" className="text-xs sm:text-sm">
              Employers
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4 space-y-3 min-h-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <RangeFilterBlock
                label="Years of experience"
                hint="Total work experience"
                value={filters.experienceRange}
                onChange={(v) => updateFilter("experienceRange", v)}
                min={0}
                max={20}
                formatMin={(n) => `${n} yr${n === 1 ? "" : "s"}`}
                formatMax={(n) => `${n} yr${n === 1 ? "" : "s"}`}
              />
              <RangeFilterBlock
                label="Expected salary (LPA)"
                hint="Annual CTC in lakhs"
                value={filters.salaryRange}
                onChange={(v) => updateFilter("salaryRange", v)}
                min={0}
                max={100}
                formatMin={(n) => `₹${n}L`}
                formatMax={(n) => `₹${n}L`}
              />
            </div>
            <FilterSection title="Application status" defaultOpen>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[...APPLICANT_STATUS_OPTIONS].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option}`}
                      checked={filters.status.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) updateFilter("status", [...filters.status, option]);
                        else updateFilter("status", filters.status.filter((s) => s !== option));
                      }}
                    />
                    <label
                      htmlFor={`status-${option}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </FilterSection>
            <RangeFilterBlock
              label="Year of passing"
              hint="Graduation / completion year"
              value={filters.yearOfPassing}
              onChange={(v) => updateFilter("yearOfPassing", v)}
              min={2000}
              max={currentYear}
              formatMin={(n) => String(n)}
              formatMax={(n) => String(n)}
            />
          </TabsContent>

          <TabsContent value="place" className="mt-4 space-y-1 min-h-[200px]">
            <FilterSection title="Current location" defaultOpen>
              <MultiSelectCheckbox
                options={cityOptions}
                selected={filters.currentCity}
                onChange={(values) => updateFilter("currentCity", values)}
              />
            </FilterSection>
            <FilterSection title="Preferred location">
              <MultiSelectCheckbox
                options={cityOptions}
                selected={filters.preferredCity}
                onChange={(values) => updateFilter("preferredCity", values)}
              />
            </FilterSection>
            <FilterSection title="Skills">
              <MultiSelectCheckbox
                options={skillOptions.slice(0, 20)}
                selected={filters.skills}
                onChange={(values) => updateFilter("skills", values)}
                maxDisplay={10}
              />
            </FilterSection>
            <FilterSection title="Notice period">
              <MultiSelectCheckbox
                options={noticePeriodOptions}
                selected={filters.noticePeriod}
                onChange={(values) => updateFilter("noticePeriod", values)}
              />
            </FilterSection>
            <FilterSection title="Education">
              <MultiSelectCheckbox
                options={educationOptions}
                selected={filters.education}
                onChange={(values) => updateFilter("education", values)}
              />
            </FilterSection>
          </TabsContent>

          <TabsContent value="employers" className="mt-4 space-y-1 min-h-[200px]">
            <FilterSection title="Current company" defaultOpen>
              <MultiSelectCheckbox
                options={companyOptions}
                selected={filters.currentCompany}
                onChange={(values) => updateFilter("currentCompany", values)}
                maxDisplay={6}
              />
            </FilterSection>
            <FilterSection title="Past companies">
              <MultiSelectCheckbox
                options={companyOptions}
                selected={filters.pastCompanies}
                onChange={(values) => updateFilter("pastCompanies", values)}
                maxDisplay={6}
              />
            </FilterSection>
            <FilterSection title="Gender">
              <MultiSelectCheckbox
                options={["Male", "Female", "Other"]}
                selected={filters.gender}
                onChange={(values) => updateFilter("gender", values)}
              />
            </FilterSection>
          </TabsContent>

          <TabsContent value="activity" className="mt-4 space-y-1 min-h-[200px]">
            <FilterSection title="Recent activity" defaultOpen>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Registered in the last</Label>
                  <Select
                    value={filters.registeredDays === null ? "any" : String(filters.registeredDays)}
                    onValueChange={(value) =>
                      updateFilter(
                        "registeredDays",
                        value === "any" ? null : parseInt(value, 10)
                      )
                    }
                  >
                    <SelectTrigger className="mt-1 h-9 text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="15">Last 15 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="60">Last 60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Active in the last</Label>
                  <Select
                    value={filters.activeDays === null ? "any" : String(filters.activeDays)}
                    onValueChange={(value) =>
                      updateFilter("activeDays", value === "any" ? null : parseInt(value, 10))
                    }
                  >
                    <SelectTrigger className="mt-1 h-9 text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="15">Last 15 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Resume updated in the last</Label>
                  <Select
                    value={filters.resumeUpdatedDays === null ? "any" : String(filters.resumeUpdatedDays)}
                    onValueChange={(value) =>
                      updateFilter(
                        "resumeUpdatedDays",
                        value === "any" ? null : parseInt(value, 10)
                      )
                    }
                  >
                    <SelectTrigger className="mt-1 h-9 text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="15">Last 15 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="60">Last 60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Profile quality">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs shrink-0">Actively looking</Label>
                  <Select
                    value={filters.isActivelyLooking === null ? "any" : filters.isActivelyLooking ? "yes" : "no"}
                    onValueChange={(v) =>
                      updateFilter("isActivelyLooking", v === "any" ? null : v === "yes")
                    }
                  >
                    <SelectTrigger className="h-9 w-[110px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs shrink-0">Verified</Label>
                  <Select
                    value={filters.isVerified === null ? "any" : filters.isVerified ? "yes" : "no"}
                    onValueChange={(v) => updateFilter("isVerified", v === "any" ? null : v === "yes")}
                  >
                    <SelectTrigger className="h-9 w-[110px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs shrink-0">Has resume</Label>
                  <Select
                    value={filters.hasResume === null ? "any" : filters.hasResume ? "yes" : "no"}
                    onValueChange={(v) => updateFilter("hasResume", v === "any" ? null : v === "yes")}
                  >
                    <SelectTrigger className="h-9 w-[110px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="px-1">
                  <Label className="text-xs">Profile completion %</Label>
                  <Slider
                    value={filters.profileCompleteRange}
                    onValueChange={(value) =>
                      updateFilter("profileCompleteRange", value as [number, number])
                    }
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{filters.profileCompleteRange[0]}%</span>
                    <span>{filters.profileCompleteRange[1]}%</span>
                  </div>
                </div>
              </div>
            </FilterSection>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResumeSearchFilters;
