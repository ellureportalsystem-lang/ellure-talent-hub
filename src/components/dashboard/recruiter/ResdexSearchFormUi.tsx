import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResdexFormAccordion({
  title,
  defaultOpen = false,
  children,
  className,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-t border-slate-200", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-semibold text-slate-900">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        )}
      </button>
      {open && <div className="space-y-5 pb-5">{children}</div>}
    </div>
  );
}

export function ResdexFieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm font-semibold text-slate-800">{children}</span>
      {hint}
    </div>
  );
}

export function ResdexPillToggle({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === opt.id
              ? "border-[#0566CD] bg-[#eff6ff] text-[#0566CD]"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function ResdexChipAdd({
  label,
  placeholder,
  values,
  onAdd,
  onRemove,
  suggestions,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);

  const filtered =
    draft.trim().length >= 1
      ? (suggestions ?? [])
          .filter((s) => s.toLowerCase().includes(draft.trim().toLowerCase()) && !values.includes(s))
          .slice(0, 8)
      : [];

  const commit = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onAdd(v);
    setDraft("");
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <ResdexFieldLabel>{label}</ResdexFieldLabel>
      <div className="relative">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (filtered[0]) {
                onAdd(filtered[0]);
                setDraft("");
                setOpen(false);
              } else {
                commit();
              }
            }
          }}
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0566CD]/30"
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onAdd(s);
                    setDraft("");
                    setOpen(false);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {suggestions && suggestions.length > 0 && !draft && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] text-slate-600 hover:border-[#0566CD] hover:text-[#0566CD]"
              onClick={() => !values.includes(s) && onAdd(s)}
            >
              {s} +
            </button>
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <button
              key={v}
              type="button"
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-700 hover:bg-slate-200"
              onClick={() => onRemove(v)}
            >
              {v} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResdexInfoHint() {
  return <Info className="h-3.5 w-3.5 text-slate-400" aria-hidden />;
}
