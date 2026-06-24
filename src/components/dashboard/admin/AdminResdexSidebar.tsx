import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, X } from "lucide-react";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";
import {
  fetchFilterCities,
  fetchFilterSkills,
  fetchFilterJobRoles,
} from "@/services/dashboardService";
import { educationOptions, experienceTypeOptions, noticePeriodOptions } from "@/data/masterFilterOptions";

interface AdminResdexSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  skillInput: string;
  onSkillInputChange: (v: string) => void;
  onAddSkill: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {children}
    </div>
  );
}

export function AdminResdexSidebar({
  filters,
  onChange,
  onReset,
  skillInput,
  onSkillInputChange,
  onAddSkill,
}: AdminResdexSidebarProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    void fetchFilterCities().then(setCities);
    void fetchFilterSkills().then(setSkillSuggestions);
    void fetchFilterJobRoles().then(setJobRoles);
  }, []);

  const patch = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleInList = (key: keyof SearchFilters, value: string) => {
    const list = filters[key] as string[];
    patch(
      key,
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value] as SearchFilters[typeof key]
    );
  };

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 12);

  const currentYear = new Date().getFullYear();

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="text-[11px] text-muted-foreground">Refine candidate results</p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onReset} title="Reset filters">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <Section title="Experience">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Total years</Label>
              <Slider
                className="mt-2"
                value={filters.experienceRange}
                onValueChange={(v) => patch("experienceRange", v as [number, number])}
                min={0}
                max={30}
                step={1}
              />
              <p className="mt-1 text-center text-xs tabular-nums text-muted-foreground">
                {filters.experienceRange[0]} – {filters.experienceRange[1]} yrs
              </p>
            </div>
            <div className="space-y-1.5">
              {experienceTypeOptions.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.experienceTypes.includes(opt)}
                    onCheckedChange={() => toggleInList("experienceTypes", opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Compensation (LPA)">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Current CTC</Label>
              <Slider
                className="mt-2"
                value={filters.salaryRange}
                onValueChange={(v) => patch("salaryRange", v as [number, number])}
                min={0}
                max={100}
                step={1}
              />
              <p className="mt-1 text-center text-xs tabular-nums">₹{filters.salaryRange[0]} – ₹{filters.salaryRange[1]} LPA</p>
            </div>
            <div>
              <Label className="text-xs">Expected CTC</Label>
              <Slider
                className="mt-2"
                value={filters.expectedSalaryRange}
                onValueChange={(v) => patch("expectedSalaryRange", v as [number, number])}
                min={0}
                max={100}
                step={1}
              />
              <p className="mt-1 text-center text-xs tabular-nums">
                ₹{filters.expectedSalaryRange[0]} – ₹{filters.expectedSalaryRange[1]} LPA
              </p>
            </div>
          </div>
        </Section>

        <Section title="Notice period">
          <div className="space-y-1.5">
            {noticePeriodOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.noticePeriod.includes(opt)}
                  onCheckedChange={() => toggleInList("noticePeriod", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Location">
          <Input
            placeholder="Search city..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="mb-2 h-8 text-xs"
          />
          <div className="max-h-32 space-y-1 overflow-y-auto">
            {filteredCities.map((city) => (
              <label key={city} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.currentCity.includes(city)}
                  onCheckedChange={() => toggleInList("currentCity", city)}
                />
                <span className="truncate">{city}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Education">
          <div className="mb-2 space-y-1.5">
            {educationOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.education.includes(opt)}
                  onCheckedChange={() => toggleInList("education", opt)}
                />
                {opt}
              </label>
            ))}
          </div>
          <Input
            placeholder="Degree / course"
            value={filters.degreeCourse}
            onChange={(e) => patch("degreeCourse", e.target.value)}
            className="mb-2 h-8 text-xs"
          />
          <Label className="text-xs">Year of passing</Label>
          <Slider
            className="mt-2"
            value={filters.yearOfPassing}
            onValueChange={(v) => patch("yearOfPassing", v as [number, number])}
            min={2000}
            max={currentYear}
            step={1}
          />
          <p className="mt-1 text-center text-xs tabular-nums">
            {filters.yearOfPassing[0]} – {filters.yearOfPassing[1]}
          </p>
        </Section>

        <Section title="Employment">
          <Input
            placeholder="Current company"
            value={filters.currentCompany[0] ?? ""}
            onChange={(e) => patch("currentCompany", e.target.value ? [e.target.value] : [])}
            className="mb-2 h-8 text-xs"
          />
          <Label className="text-xs">Job role</Label>
          <div className="mt-1 max-h-28 space-y-1 overflow-y-auto">
            {jobRoles.slice(0, 15).map((role) => (
              <label key={role} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.jobRoles.includes(role)}
                  onCheckedChange={() => toggleInList("jobRoles", role)}
                />
                <span className="truncate">{role}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Skills">
          <div className="flex gap-1">
            <Input
              list="skill-suggestions"
              placeholder="Add skill"
              value={skillInput}
              onChange={(e) => onSkillInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAddSkill())}
              className="h-8 text-xs"
            />
            <Button type="button" size="sm" className="h-8 px-2 text-xs" onClick={onAddSkill}>
              Add
            </Button>
          </div>
          <datalist id="skill-suggestions">
            {skillSuggestions.slice(0, 30).map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.skills.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 text-[10px]">
                {s}
                <button type="button" onClick={() => patch("skills", filters.skills.filter((x) => x !== s))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Section>

        <Section title="Application status">
          <div className="space-y-1.5">
            {["submitted", "under_review", "shortlisted", "rejected", "hired", "on_hold"].map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm capitalize">
                <Checkbox
                  checked={filters.status.includes(s)}
                  onCheckedChange={() => toggleInList("status", s)}
                />
                {s.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Profile status">
          <div className="space-y-2 text-sm">
            <label className="flex items-center justify-between">
              <span>Actively looking</span>
              <Switch
                checked={filters.isActivelyLooking === true}
                onCheckedChange={(c) => patch("isActivelyLooking", c ? true : null)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Open to relocate</span>
              <Switch
                checked={filters.openToRelocate === true}
                onCheckedChange={(c) => patch("openToRelocate", c ? true : null)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Verified only</span>
              <Switch
                checked={filters.isVerified === true}
                onCheckedChange={(c) => patch("isVerified", c ? true : null)}
              />
            </label>
            <label className="flex items-center justify-between">
              <span>Has resume</span>
              <Switch
                checked={filters.hasResume === true}
                onCheckedChange={(c) => patch("hasResume", c ? true : null)}
              />
            </label>
          </div>
        </Section>

        <Section title="Diversity">
          <div className="space-y-1.5">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.gender.includes(g)}
                  onCheckedChange={() => toggleInList("gender", g)}
                />
                {g}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Activity">
          <Select
            value={filters.activeDays === null ? "any" : String(filters.activeDays)}
            onValueChange={(v) => patch("activeDays", v === "any" ? null : Number(v))}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Last updated" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </Section>
      </div>
    </aside>
  );
}
