import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import {
  skillOptions,
  cityOptions,
  companyOptions,
  educationOptions,
  noticePeriodOptions,
} from "@/data/mockApplicants";

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
}

interface ResumeSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="pb-4"
        >
          {children}
        </motion.div>
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
  isCollapsed,
  onToggleCollapse,
}: ResumeSearchFiltersProps) => {
  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.currentCity.length > 0,
    filters.preferredCity.length > 0,
    filters.skills.length > 0,
    filters.noticePeriod.length > 0,
    filters.education.length > 0,
    filters.currentCompany.length > 0,
    filters.pastCompanies.length > 0,
    filters.gender.length > 0,
    filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20,
    filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100,
    filters.registeredDays !== null,
    filters.activeDays !== null,
    filters.resumeUpdatedDays !== null,
  ].filter(Boolean).length;

  if (isCollapsed) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleCollapse}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="w-80 flex-shrink-0 shadow-lg sticky top-4 max-h-[calc(100vh-8rem)] overflow-hidden flex flex-col">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0"
              title="Reset All"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
              title="Collapse"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto flex-1 space-y-1">
        {/* Experience Range */}
        <FilterSection title="Experience (Years)" defaultOpen>
          <div className="px-1">
            <Slider
              value={filters.experienceRange}
              onValueChange={(value) =>
                updateFilter("experienceRange", value as [number, number])
              }
              max={20}
              min={0}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{filters.experienceRange[0]} yrs</span>
              <span>{filters.experienceRange[1]} yrs</span>
            </div>
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection title="Salary Range (LPA)" defaultOpen>
          <div className="px-1">
            <Slider
              value={filters.salaryRange}
              onValueChange={(value) =>
                updateFilter("salaryRange", value as [number, number])
              }
              max={100}
              min={0}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>₹{filters.salaryRange[0]}L</span>
              <span>₹{filters.salaryRange[1]}L</span>
            </div>
          </div>
        </FilterSection>

        {/* Current Location */}
        <FilterSection title="Current Location">
          <MultiSelectCheckbox
            options={cityOptions}
            selected={filters.currentCity}
            onChange={(values) => updateFilter("currentCity", values)}
          />
        </FilterSection>

        {/* Preferred Location */}
        <FilterSection title="Preferred Location">
          <MultiSelectCheckbox
            options={cityOptions}
            selected={filters.preferredCity}
            onChange={(values) => updateFilter("preferredCity", values)}
          />
        </FilterSection>

        {/* Skills */}
        <FilterSection title="Skills">
          <MultiSelectCheckbox
            options={skillOptions.slice(0, 20)}
            selected={filters.skills}
            onChange={(values) => updateFilter("skills", values)}
            maxDisplay={10}
          />
        </FilterSection>

        {/* Notice Period */}
        <FilterSection title="Notice Period">
          <MultiSelectCheckbox
            options={noticePeriodOptions}
            selected={filters.noticePeriod}
            onChange={(values) => updateFilter("noticePeriod", values)}
          />
        </FilterSection>

        {/* Education */}
        <FilterSection title="Education">
          <MultiSelectCheckbox
            options={educationOptions}
            selected={filters.education}
            onChange={(values) => updateFilter("education", values)}
          />
        </FilterSection>

        {/* Current Company */}
        <FilterSection title="Current Company">
          <MultiSelectCheckbox
            options={companyOptions}
            selected={filters.currentCompany}
            onChange={(values) => updateFilter("currentCompany", values)}
            maxDisplay={6}
          />
        </FilterSection>

        {/* Past Companies */}
        <FilterSection title="Past Companies">
          <MultiSelectCheckbox
            options={companyOptions}
            selected={filters.pastCompanies}
            onChange={(values) => updateFilter("pastCompanies", values)}
            maxDisplay={6}
          />
        </FilterSection>

        {/* Year of Passing */}
        <FilterSection title="Year of Passing">
          <div className="px-1">
            <Slider
              value={filters.yearOfPassing}
              onValueChange={(value) =>
                updateFilter("yearOfPassing", value as [number, number])
              }
              max={2025}
              min={2000}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{filters.yearOfPassing[0]}</span>
              <span>{filters.yearOfPassing[1]}</span>
            </div>
          </div>
        </FilterSection>

        {/* Gender */}
        <FilterSection title="Diversity - Gender">
          <MultiSelectCheckbox
            options={["Male", "Female", "Other"]}
            selected={filters.gender}
            onChange={(values) => updateFilter("gender", values)}
          />
        </FilterSection>

        {/* Activity Filters */}
        <FilterSection title="Activity Filters">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Registered in last (days)</Label>
              <Select
                value={filters.registeredDays?.toString() || ""}
                onValueChange={(value) =>
                  updateFilter(
                    "registeredDays",
                    value ? parseInt(value) : null
                  )
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="15">Last 15 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="60">Last 60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Active in last (days)</Label>
              <Select
                value={filters.activeDays?.toString() || ""}
                onValueChange={(value) =>
                  updateFilter("activeDays", value ? parseInt(value) : null)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="15">Last 15 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Resume updated in last (days)</Label>
              <Select
                value={filters.resumeUpdatedDays?.toString() || ""}
                onValueChange={(value) =>
                  updateFilter(
                    "resumeUpdatedDays",
                    value ? parseInt(value) : null
                  )
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="15">Last 15 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="60">Last 60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
};

export default ResumeSearchFilters;
