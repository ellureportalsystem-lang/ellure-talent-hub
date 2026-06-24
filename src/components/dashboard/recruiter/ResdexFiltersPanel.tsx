import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";
import { ResdexAutocompleteInput } from "@/components/dashboard/recruiter/ResdexAutocompleteInput";
import { useResdexFilterOptions } from "@/hooks/useResdexFilterOptions";
import { cn } from "@/lib/utils";

type ResdexFiltersPanelProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
  className?: string;
};

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-slate-800"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

export function ResdexFiltersPanel({ filters, onChange, onReset, className }: ResdexFiltersPanelProps) {
  const { cities } = useResdexFilterOptions();
  const [cityDraft, setCityDraft] = useState("");

  const patch = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className={cn("w-[240px] shrink-0 border-r border-slate-200 bg-white", className)}>
      <div className="border-b border-slate-200 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox />
          Hide Profiles
        </label>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <span className="font-semibold text-slate-900">Filters</span>
          <Badge className="bg-orange-500 hover:bg-orange-500 text-[10px] px-1.5 h-4">New</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onReset} title="Reset">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="px-4 py-2 border-b border-slate-200">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox />
          Premium Institute Candidates
        </label>
      </div>

      <div className="px-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <AccordionSection title="Keywords">
          <Input
            placeholder="Refine keywords"
            className="h-8 text-xs"
            value={filters.keywords}
            onChange={(e) => patch("keywords", e.target.value)}
          />
        </AccordionSection>

        <AccordionSection title="Location">
          <ResdexAutocompleteInput
            value={cityDraft}
            onChange={setCityDraft}
            suggestions={cities}
            placeholder="Add city"
            onSelect={(city) => {
              if (city && !filters.currentCity.includes(city)) {
                patch("currentCity", [...filters.currentCity, city]);
                setCityDraft("");
              }
            }}
            inputClassName="h-8 text-xs"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.currentCity.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => patch("currentCity", filters.currentCity.filter((x) => x !== c))}>
                {c} ×
              </Badge>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Experience (Years)" defaultOpen>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="h-8 w-16 text-xs"
              value={filters.experienceRange[0]}
              onChange={(e) => patch("experienceRange", [Number(e.target.value), filters.experienceRange[1]])}
            />
            <span className="text-xs text-slate-500">to</span>
            <Input
              type="number"
              className="h-8 w-16 text-xs"
              value={filters.experienceRange[1]}
              onChange={(e) => patch("experienceRange", [filters.experienceRange[0], Number(e.target.value)])}
            />
          </div>
        </AccordionSection>

        <AccordionSection title="Salary (INR-Lacs)">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="h-8 w-16 text-xs"
              value={filters.salaryRange[0] || ""}
              onChange={(e) => patch("salaryRange", [Number(e.target.value), filters.salaryRange[1]])}
              placeholder="Min"
            />
            <span className="text-xs">to</span>
            <Input
              type="number"
              className="h-8 w-16 text-xs"
              value={filters.salaryRange[1] >= 100 ? "" : filters.salaryRange[1]}
              onChange={(e) => patch("salaryRange", [filters.salaryRange[0], Number(e.target.value)])}
              placeholder="Max"
            />
          </div>
        </AccordionSection>

        <AccordionSection title="Current designation">
          <Input className="h-8 text-xs" placeholder="Designation" />
        </AccordionSection>

        <AccordionSection title="Current company">
          <Input
            className="h-8 text-xs"
            placeholder="Company"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value.trim();
                if (v) patch("currentCompany", [...filters.currentCompany, v]);
              }
            }}
          />
        </AccordionSection>

        <AccordionSection title="Education">
          <Input
            className="h-8 text-xs mb-2"
            placeholder="Degree / course"
            value={filters.degreeCourse}
            onChange={(e) => patch("degreeCourse", e.target.value)}
          />
          <div className="flex flex-wrap gap-1">
            {["B.Tech", "MBA", "MCA", "B.Com", "M.Tech"].map((edu) => (
              <button
                key={edu}
                type="button"
                className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] hover:border-[#0566CD]"
                onClick={() => {
                  if (!filters.education.includes(edu)) patch("education", [...filters.education, edu]);
                }}
              >
                + {edu}
              </button>
            ))}
          </div>
          {filters.education.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {filters.education.map((e) => (
                <Badge key={e} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => patch("education", filters.education.filter((x) => x !== e))}>
                  {e} ×
                </Badge>
              ))}
            </div>
          )}
        </AccordionSection>

        <AccordionSection title="Employment details">
          <Label className="text-xs text-slate-500">Notice period</Label>
          <div className="mt-1 flex flex-wrap gap-1">
            {["Immediate", "15 days", "1 month", "2 months", "3 months"].map((n) => (
              <button
                key={n}
                type="button"
                className={`rounded-full border px-2 py-0.5 text-[10px] ${filters.noticePeriod.includes(n) ? "border-[#0566CD] bg-blue-50 text-[#0566CD]" : "border-slate-200"}`}
                onClick={() => {
                  const next = filters.noticePeriod.includes(n)
                    ? filters.noticePeriod.filter((x) => x !== n)
                    : [...filters.noticePeriod, n];
                  patch("noticePeriod", next);
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Diversity & other">
          <label className="flex items-center gap-2 text-xs text-slate-600 mb-2">
            <Checkbox
              checked={filters.isActivelyLooking === true}
              onCheckedChange={(c) => patch("isActivelyLooking", c ? true : null)}
            />
            Actively looking
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 mb-2">
            <Checkbox
              checked={filters.hasResume === true}
              onCheckedChange={(c) => patch("hasResume", c ? true : null)}
            />
            Has resume attached
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <Checkbox
              checked={filters.openToRelocate === true}
              onCheckedChange={(c) => patch("openToRelocate", c ? true : null)}
            />
            Open to relocate
          </label>
        </AccordionSection>

        <AccordionSection title="Skills">
          <Input
            className="h-8 text-xs"
            placeholder="Add skill + Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value.trim();
                if (v && !filters.skills.includes(v)) {
                  patch("skills", [...filters.skills, v]);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {filters.skills.map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => patch("skills", filters.skills.filter((x) => x !== s))}>
                {s} ×
              </Badge>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Department and Role">
          <Label className="text-xs text-slate-500">Job roles in filters</Label>
        </AccordionSection>
      </div>
    </aside>
  );
}
