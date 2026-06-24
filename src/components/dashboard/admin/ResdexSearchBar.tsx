import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import type { SearchMode } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";

const RECENT_KEY = "admin_resdex_recent_searches";

interface ResdexSearchBarProps {
  value: string;
  mode: SearchMode;
  onChange: (value: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onSearch: () => void;
  debounceMs?: number;
  /** Live suggestions from database (skills, cities, companies, roles) */
  suggestions?: string[];
}

function loadRecent(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const prev = loadRecent().filter((q) => q !== trimmed);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify([trimmed, ...prev].slice(0, 8)));
}

export function ResdexSearchBar({
  value,
  mode,
  onChange,
  onModeChange,
  onSearch,
  debounceMs = 500,
  suggestions = [],
}: ResdexSearchBarProps) {
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const dbMatches =
    value.trim().length >= 1
      ? suggestions
          .filter((s) => s.toLowerCase().includes(value.trim().toLowerCase()))
          .slice(0, 8)
      : [];

  const dropdownItems = dbMatches.length > 0 ? dbMatches : [];

  useEffect(() => {
    setHighlight(0);
  }, [value, dropdownItems.length]);

  const triggerSearch = () => {
    saveRecent(value);
    setRecent(loadRecent());
    setOpen(false);
    onSearch();
  };

  const pickSuggestion = (item: string) => {
    onChange(item);
    setOpen(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(), 0);
  };

  const handleChange = (next: string) => {
    onChange(next);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch();
    }, debounceMs);
  };

  const placeholder =
    mode === "normal"
      ? "Keywords — skills, designation, company (suggestions from your database)"
      : 'Boolean — e.g. "Java Developer" AND Spring NOT Python';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg border bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => onModeChange("normal")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "normal" ? "bg-white text-slate-900 shadow-sm" : "text-muted-foreground"
            )}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => onModeChange("boolean")}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              mode === "boolean" ? "bg-white text-slate-900 shadow-sm" : "text-muted-foreground"
            )}
          >
            Boolean
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {mode === "normal" ? "Comma = OR across profile fields" : "AND / OR / NOT supported"}
        </span>
      </div>

      <div className="flex gap-2">
        <div ref={wrapRef} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (open && dropdownItems.length) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlight((h) => Math.min(h + 1, dropdownItems.length - 1));
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlight((h) => Math.max(h - 1, 0));
                  return;
                }
                if (e.key === "Enter" && dropdownItems[highlight]) {
                  e.preventDefault();
                  pickSuggestion(dropdownItems[highlight]);
                  return;
                }
              }
              if (e.key === "Enter") {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                triggerSearch();
              }
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={placeholder}
            className="h-11 pl-9 pr-9 text-sm"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
                setTimeout(() => onSearch(), 0);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground z-10"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {open && dropdownItems.length > 0 && (
            <ul className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white py-1 shadow-lg">
              {dropdownItems.map((item, i) => (
                <li key={item}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-slate-50",
                      i === highlight && "bg-blue-50 text-[#0566CD]"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickSuggestion(item)}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="button" className="h-11 px-5" onClick={triggerSearch}>
          Search
        </Button>
      </div>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recent
          </span>
          {recent.slice(0, 5).map((q) => (
            <Badge
              key={q}
              variant="outline"
              className="cursor-pointer text-[11px] font-normal hover:bg-primary/5"
              onClick={() => {
                onChange(q);
                setTimeout(() => onSearch(), 0);
              }}
            >
              {q.length > 36 ? `${q.slice(0, 36)}…` : q}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
