import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getResumeAccessibleUrl } from "@/lib/resumePreview";
import { HighlightText } from "./HighlightText";
import { splitSkills } from "@/lib/naukriFormat";
import type { SearchMode } from "@/lib/resdexSearchParams";

type ResdexProfileCvTabProps = {
  name: string;
  city?: string;
  phone?: string;
  email?: string;
  resumeUrl?: string | null;
  skills: string[];
  experience: { company_name?: string | null; designation?: string | null; start_date?: string | null; end_date?: string | null; is_current?: boolean | null; description?: string | null }[];
  searchQuery: string;
  searchMode: SearchMode;
};

export function ResdexProfileCvTab({
  name,
  city,
  phone,
  email,
  resumeUrl,
  skills,
  experience,
  searchQuery,
  searchMode,
}: ResdexProfileCvTabProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resumeUrl?.startsWith("http")) {
      setSignedUrl(null);
      return;
    }
    setLoading(true);
    getResumeAccessibleUrl(resumeUrl)
      .then(setSignedUrl)
      .catch(() => setSignedUrl(resumeUrl))
      .finally(() => setLoading(false));
  }, [resumeUrl]);

  const hasPdf = signedUrl && (signedUrl.includes(".pdf") || signedUrl.includes("application/pdf"));

  return (
    <div className="space-y-6">
      {hasPdf && !loading ? (
        <div className="rounded border border-slate-200 bg-white overflow-hidden" style={{ minHeight: 600 }}>
          <iframe title="Resume" src={signedUrl} className="w-full h-[80vh] border-0" />
        </div>
      ) : (
        <article className="mx-auto max-w-[800px] rounded border border-slate-200 bg-white p-8 shadow-sm">
          <header className="text-center border-b border-slate-200 pb-6 mb-6">
            <h2 className="text-2xl font-serif font-bold tracking-wide text-slate-900 uppercase">
              {name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{city}</p>
            <p className="mt-1 text-sm text-slate-600">
              {phone && <span className="mr-4">📞 {phone}</span>}
              {email && <span>{email}</span>}
            </p>
          </header>

          {skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold border-b border-slate-300 pb-1 mb-3">Technical Skills</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                <HighlightText text={skills.join(" | ")} query={searchQuery} mode={searchMode} />
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold border-b border-slate-300 pb-1 mb-4">Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-900">{exp.company_name}</p>
                    <p className="text-sm text-slate-600">
                      {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                    </p>
                  </div>
                  <p className="italic text-sm text-slate-700">{exp.designation}</p>
                  {exp.description && (
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 space-y-1">
                      {exp.description.split(/\n|•/).filter(Boolean).map((line, j) => (
                        <li key={j}>
                          <HighlightText text={line.trim()} query={searchQuery} mode={searchMode} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#0566CD]" />
            </div>
          )}

          {!resumeUrl && experience.length === 0 && skills.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-8">No resume attached for this candidate.</p>
          )}
        </article>
      )}
    </div>
  );
}
