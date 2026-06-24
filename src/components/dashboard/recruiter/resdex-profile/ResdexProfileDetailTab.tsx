import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { HighlightText } from "./HighlightText";
import { splitSkills } from "@/lib/naukriFormat";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";

type ExperienceRow = {
  id?: string;
  company_name?: string | null;
  designation?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean | null;
  description?: string | null;
};

type ResdexProfileDetailTabProps = {
  headline?: string | null;
  summary?: string | null;
  skills: string[];
  secondarySkills?: string[];
  industry?: string | null;
  department?: string | null;
  role?: string | null;
  experience: ExperienceRow[];
  searchQuery: string;
  searchMode: SearchMode;
};

export function ResdexProfileDetailTab({
  headline,
  summary,
  skills,
  secondarySkills = [],
  industry,
  department,
  role,
  experience,
  searchQuery,
  searchMode,
}: ResdexProfileDetailTabProps) {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const visibleSkills = showAllSkills ? skills : skills.slice(0, 12);
  const hiddenCount = Math.max(0, skills.length - 12);

  return (
    <div className="space-y-6">
      {(headline || summary) && (
        <div className="rounded border-l-4 border-[#0566CD] bg-blue-50/40 px-4 py-3 text-sm leading-relaxed text-slate-800">
          <HighlightText text={headline || summary || ""} query={searchQuery} mode={searchMode} />
        </div>
      )}

      {skills.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Key skills</h3>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-slate-100 text-slate-800 font-normal text-xs px-2.5 py-1"
              >
                <HighlightText text={skill} query={searchQuery} mode={searchMode} />
              </Badge>
            ))}
            {hiddenCount > 0 && !showAllSkills && (
              <button
                type="button"
                className="text-xs text-[#0566CD] hover:underline"
                onClick={() => setShowAllSkills(true)}
              >
                +{hiddenCount} more
              </button>
            )}
          </div>
          <button type="button" className="mt-2 text-xs text-[#0566CD] hover:underline">
            View IT skills
          </button>
        </section>
      )}

      {secondarySkills.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-2">May also know</h3>
          <div className="flex flex-wrap gap-2">
            {secondarySkills.slice(0, 8).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs font-normal text-slate-600">
                {skill}
              </Badge>
            ))}
            {secondarySkills.length > 8 && (
              <span className="text-xs text-[#0566CD]">+{secondarySkills.length - 8} more</span>
            )}
          </div>
        </section>
      )}

      {summary && (
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Work summary</h3>
          <p className="text-sm leading-relaxed text-slate-700">
            <HighlightText text={summary} query={searchQuery} mode={searchMode} />
          </p>
          {(industry || department || role) && (
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
              {industry && (
                <div>
                  <dt className="text-slate-500">Industry</dt>
                  <dd className="font-medium text-slate-800">{industry}</dd>
                </div>
              )}
              {department && (
                <div>
                  <dt className="text-slate-500">Department</dt>
                  <dd className="font-medium text-slate-800">{department}</dd>
                </div>
              )}
              {role && (
                <div>
                  <dt className="text-slate-500">Role</dt>
                  <dd className="font-medium text-slate-800">{role}</dd>
                </div>
              )}
            </dl>
          )}
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Work experience</h3>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={exp.id || i} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold text-slate-900">{exp.company_name || "—"}</p>
                  <p className="text-xs text-slate-500">
                    {exp.start_date || "—"} — {exp.is_current ? "Present" : exp.end_date || "—"}
                  </p>
                </div>
                <p className="text-sm italic text-slate-700">{exp.designation}</p>
                {exp.description && (
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    <HighlightText text={exp.description} query={searchQuery} mode={searchMode} />
                  </p>
                )}
              </div>
            ))}
          </div>
          {experience.length > 1 && (
            <div className="mt-4 flex items-center gap-2 text-xs text-violet-600">
              {experience.map((exp, i) => (
                <span key={i} className={cn("rounded-full border px-2 py-0.5", i === 0 && "bg-violet-50 border-violet-200")}>
                  {exp.start_date?.slice(0, 7) || "—"}
                </span>
              ))}
              <span>till date</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export function parseApplicantSkills(raw: string | null | undefined, tableSkills: { skill_name?: string }[]) {
  const fromTable = tableSkills.map((s) => s.skill_name).filter(Boolean) as string[];
  const fromField = splitSkills(raw);
  const merged = [...new Set([...fromTable, ...fromField])];
  return {
    primary: merged.slice(0, Math.ceil(merged.length * 0.7)),
    secondary: merged.slice(Math.ceil(merged.length * 0.7)),
  };
}
