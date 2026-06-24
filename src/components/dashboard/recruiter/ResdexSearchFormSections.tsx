import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchFilters } from "@/components/dashboard/admin/ResumeSearchFilters";
import {
  ResdexChipAdd,
  ResdexFieldLabel,
  ResdexFormAccordion,
  ResdexInfoHint,
  ResdexPillToggle,
} from "./ResdexSearchFormUi";

const NOTICE_OPTIONS = ["Immediate", "15 days", "1 month", "2 months", "3 months"];

const UG_COURSES = [
  "B.Tech/B.E.",
  "Any Engineering",
  "Any Computers (Degree/Diploma)",
  "MBA",
  "MCA",
  "B.Com",
  "M.Tech",
  "Any Medical",
  "Journalism/Mass Communication",
];

const EDUCATION_TYPE_OPTIONS = [
  { id: "Full Time", label: "Full Time" },
  { id: "Part Time", label: "Part Time" },
  { id: "Correspondence", label: "Correspondence" },
];

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

type ResdexEmploymentSectionProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  designation: string;
  onDesignationChange: (v: string) => void;
  designationBoolean: boolean;
  onDesignationBooleanChange: (v: boolean) => void;
  industries: string[];
  onIndustriesChange: (v: string[]) => void;
  companySuggestions?: string[];
  roleSuggestions?: string[];
};

export function ResdexEmploymentSection({
  filters,
  onChange,
  designation,
  onDesignationChange,
  designationBoolean,
  onDesignationBooleanChange,
  industries,
  onIndustriesChange,
  companySuggestions = [],
  roleSuggestions = [],
}: ResdexEmploymentSectionProps) {
  const patch = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <ResdexFormAccordion title="Employment details">
      <ResdexChipAdd
        label="Department and Role"
        placeholder="Add Department/Role"
        values={filters.jobRoles}
        onAdd={(v) => patch("jobRoles", [...filters.jobRoles, v])}
        onRemove={(v) => patch("jobRoles", filters.jobRoles.filter((x) => x !== v))}
        suggestions={roleSuggestions}
      />

      <ResdexChipAdd
        label="Industry / Company"
        placeholder="Add company or industry from your database"
        values={industries}
        onAdd={(v) => onIndustriesChange([...industries, v])}
        onRemove={(v) => onIndustriesChange(industries.filter((x) => x !== v))}
        suggestions={companySuggestions}
      />

      <div className="space-y-2">
        <ResdexFieldLabel>Company</ResdexFieldLabel>
        <Input
          placeholder="Add company name"
          className="h-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = (e.target as HTMLInputElement).value.trim();
              if (v && !filters.currentCompany.includes(v)) {
                patch("currentCompany", [...filters.currentCompany, v]);
                (e.target as HTMLInputElement).value = "";
              }
            }
          }}
        />
        <p className="text-xs text-slate-500">Search in Current company</p>
        <button type="button" className="text-xs text-[#0566CD] hover:underline">
          + Add Exclude Company
        </button>
        {filters.currentCompany.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.currentCompany.map((c) => (
              <button
                key={c}
                type="button"
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px]"
                onClick={() => patch("currentCompany", filters.currentCompany.filter((x) => x !== c))}
              >
                {c} ×
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <ResdexFieldLabel>Designation</ResdexFieldLabel>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Boolean {designationBoolean ? "on" : "off"}</span>
            <Switch checked={designationBoolean} onCheckedChange={onDesignationBooleanChange} />
          </div>
        </div>
        <Input
          placeholder="Add designation"
          className="h-9"
          value={designation}
          onChange={(e) => onDesignationChange(e.target.value)}
        />
        <p className="text-xs text-slate-500">Search in Current designation</p>
      </div>

      <div className="space-y-2">
        <ResdexFieldLabel hint={<ResdexInfoHint />}>Notice Period / Availability to join</ResdexFieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {NOTICE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              className={`rounded-full border px-2.5 py-1 text-[11px] ${
                filters.noticePeriod.includes(n)
                  ? "border-[#0566CD] bg-[#eff6ff] text-[#0566CD]"
                  : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
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
      </div>
    </ResdexFormAccordion>
  );
}

type ResdexEducationSectionProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  ugMode: "any" | "specific" | "none";
  onUgModeChange: (v: "any" | "specific" | "none") => void;
  pgMode: "any" | "specific" | "none";
  onPgModeChange: (v: "any" | "specific" | "none") => void;
  institute: string;
  onInstituteChange: (v: string) => void;
};

export function ResdexEducationSection({
  filters,
  onChange,
  ugMode,
  onUgModeChange,
  pgMode,
  onPgModeChange,
  institute,
  onInstituteChange,
}: ResdexEducationSectionProps) {
  const patch = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const currentYear = new Date().getFullYear();

  return (
    <ResdexFormAccordion title="Education details">
      <div className="space-y-2">
        <ResdexFieldLabel>UG Qualification</ResdexFieldLabel>
        <ResdexPillToggle
          value={ugMode}
          onChange={(id) => onUgModeChange(id as typeof ugMode)}
          options={[
            { id: "any", label: "Any UG qualification" },
            { id: "specific", label: "Specific UG qualification" },
            { id: "none", label: "No UG qualification" },
          ]}
        />
      </div>

      {ugMode === "specific" && (
        <>
          <div className="space-y-2">
            <ResdexFieldLabel>Choose Course</ResdexFieldLabel>
            <Input
              placeholder="Type or select UG course from list"
              className="h-9"
              value={filters.degreeCourse}
              onChange={(e) => patch("degreeCourse", e.target.value)}
            />
            <div className="flex flex-wrap gap-1.5">
              {UG_COURSES.map((course) => (
                <button
                  key={course}
                  type="button"
                  className={`rounded border px-2 py-1 text-[11px] text-left ${
                    filters.education.includes(course)
                      ? "border-[#0566CD] bg-[#eff6ff] text-[#0566CD]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => {
                    const next = filters.education.includes(course)
                      ? filters.education.filter((x) => x !== course)
                      : [...filters.education, course];
                    patch("education", next);
                  }}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <ResdexFieldLabel>Education Type</ResdexFieldLabel>
            <ResdexPillToggle
              value={filters.experienceTypes[0] ?? "Full Time"}
              onChange={(id) => patch("experienceTypes", [id])}
              options={EDUCATION_TYPE_OPTIONS}
            />
          </div>

          <div className="space-y-2">
            <ResdexFieldLabel>Year of degree completion</ResdexFieldLabel>
            <div className="flex items-center gap-2">
              <Select
                value={String(filters.yearOfPassing[0])}
                onValueChange={(v) => patch("yearOfPassing", [Number(v), filters.yearOfPassing[1]])}
              >
                <SelectTrigger className="h-9 w-28 text-xs">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => currentYear - i).map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-slate-500">to</span>
              <Select
                value={String(filters.yearOfPassing[1])}
                onValueChange={(v) => patch("yearOfPassing", [filters.yearOfPassing[0], Number(v)])}
              >
                <SelectTrigger className="h-9 w-28 text-xs">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => currentYear - i).map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      <div className="rounded-md border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
        Show candidates with both UG and PG qualification
      </div>

      <div className="space-y-2">
        <ResdexFieldLabel>PG Qualification</ResdexFieldLabel>
        <ResdexPillToggle
          value={pgMode}
          onChange={(id) => onPgModeChange(id as typeof pgMode)}
          options={[
            { id: "any", label: "Any PG qualification" },
            { id: "specific", label: "Specific PG qualification" },
            { id: "none", label: "No PG qualification" },
          ]}
        />
      </div>

      {pgMode === "specific" && (
        <>
          <div className="space-y-2">
            <ResdexFieldLabel>Choose Course</ResdexFieldLabel>
            <Input placeholder="Type or select PG course from list" className="h-9" />
          </div>
          <div className="space-y-2">
            <ResdexFieldLabel>Institute</ResdexFieldLabel>
            <Input
              placeholder="Select institute"
              className="h-9"
              value={institute}
              onChange={(e) => onInstituteChange(e.target.value)}
            />
          </div>
        </>
      )}
    </ResdexFormAccordion>
  );
}

type ResdexDiversitySectionProps = {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
};

export function ResdexDiversitySection({ filters, onChange }: ResdexDiversitySectionProps) {
  const patch = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <ResdexFormAccordion title="Diversity and additional details">
      <div className="space-y-2">
        <ResdexFieldLabel>Gender</ResdexFieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              className={`rounded-full border px-2.5 py-1 text-[11px] ${
                filters.gender.includes(g)
                  ? "border-[#0566CD] bg-[#eff6ff] text-[#0566CD]"
                  : "border-slate-200 text-slate-700"
              }`}
              onClick={() => {
                patch("gender", filters.gender.includes(g) ? [] : [g]);
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox
            checked={filters.isActivelyLooking === true}
            onCheckedChange={(c) => patch("isActivelyLooking", c ? true : null)}
          />
          Actively looking for job change
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox
            checked={filters.hasResume === true}
            onCheckedChange={(c) => patch("hasResume", c ? true : null)}
          />
          Has resume attached
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox
            checked={filters.openToRelocate === true}
            onCheckedChange={(c) => patch("openToRelocate", c ? true : null)}
          />
          Open to relocate
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox
            checked={filters.isVerified === true}
            onCheckedChange={(c) => patch("isVerified", c ? true : null)}
          />
          Verified profiles only
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <Checkbox />
          Premium institute candidates
        </label>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-slate-800">IT Skills</Label>
        <Input
          placeholder="Add skill + Enter"
          className="h-9"
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
        {filters.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {filters.skills.map((s) => (
              <button
                key={s}
                type="button"
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px]"
                onClick={() => patch("skills", filters.skills.filter((x) => x !== s))}
              >
                {s} ×
              </button>
            ))}
          </div>
        )}
      </div>
    </ResdexFormAccordion>
  );
}
