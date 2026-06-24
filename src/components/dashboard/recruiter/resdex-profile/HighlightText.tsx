import { extractHighlightTerms } from "@/utils/booleanSearchParser";
import type { SearchMode } from "@/lib/resdexSearchParams";

export function HighlightText({
  text,
  query,
  mode = "normal",
}: {
  text: string;
  query: string;
  mode?: SearchMode;
}) {
  if (!text) return null;
  const terms = extractHighlightTerms(query, mode);
  if (!terms.length) return <>{text}</>;

  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-yellow-200 px-0.5 text-slate-900">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
