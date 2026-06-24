import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Mail, Plus, Clock } from "lucide-react";
import type { ResdexPageSize, ResdexSort } from "@/lib/resdexSearchParams";
import { cn } from "@/lib/utils";

const PAGE_SIZES: ResdexPageSize[] = [40, 80, 160, 500];

const SORT_OPTIONS: { value: ResdexSort; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "latest", label: "Last active" },
  { value: "experience_desc", label: "Experience (high to low)" },
  { value: "experience_asc", label: "Experience (low to high)" },
  { value: "ctc_desc", label: "Salary (high to low)" },
  { value: "ctc_asc", label: "Salary (low to high)" },
];

const ACTIVE_IN_OPTIONS = [
  { value: "15", label: "15 days" },
  { value: "30", label: "16 to 30 days" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
];

type ResdexResultsToolbarProps = {
  totalCount: number;
  searchQuery: string;
  activeIn: string;
  sort: ResdexSort;
  pageSize: ResdexPageSize;
  page: number;
  totalPages: number;
  nviteMode: boolean;
  selectedCount: number;
  allOnPageSelected: boolean;
  onActiveInChange: (v: string) => void;
  onSortChange: (v: ResdexSort) => void;
  onPageSizeChange: (v: ResdexPageSize) => void;
  onPageChange: (page: number) => void;
  onToggleNvite: () => void;
  onSelectAll: (checked: boolean) => void;
  onContinueNvite: () => void;
};

export function ResdexResultsToolbar({
  totalCount,
  searchQuery,
  activeIn,
  sort,
  pageSize,
  page,
  totalPages,
  nviteMode,
  selectedCount,
  allOnPageSelected,
  onActiveInChange,
  onSortChange,
  onPageSizeChange,
  onPageChange,
  onToggleNvite,
  onSelectAll,
  onContinueNvite,
}: ResdexResultsToolbarProps) {
  const summary = searchQuery.trim() || "all filters";

  return (
    <div className="space-y-0 border-b border-slate-200 bg-white">
      {/* Results summary bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-2 text-sm">
        <span className="text-slate-700">
          Found <strong>{totalCount.toLocaleString()} profiles</strong> for &apos;{summary.slice(0, 80)}
          {summary.length > 80 ? "…" : ""}&apos;
        </span>
        <button type="button" className="text-[#0566CD] font-medium hover:underline">
          Modify
        </button>
      </div>

      {/* Sort / Show / Pagination row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">
          {nviteMode ? "Select candidates you want to reach out" : `${totalCount.toLocaleString()} candidates`}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 whitespace-nowrap">Active in</span>
            <Select value={activeIn} onValueChange={onActiveInChange}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVE_IN_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sort by</span>
            <Select value={sort} onValueChange={(v) => onSortChange(v as ResdexSort)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Show</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v) as ResdexPageSize)}>
              <SelectTrigger className="h-8 w-[72px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-slate-600 whitespace-nowrap">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk actions row */}
      {!nviteMode ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-2">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox checked={allOnPageSelected} onCheckedChange={(c) => onSelectAll(!!c)} />
                Select all
              </label>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add to
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Set reminder
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Want to reach candidates using bulk mails?</span>
              <Button
                size="sm"
                className="h-8 bg-[#0566CD] hover:bg-[#0066c0] text-white text-xs"
                onClick={onToggleNvite}
              >
                <Mail className="h-3.5 w-3.5 mr-1" />
                Switch to NVite
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-4 border-t border-blue-200 bg-blue-50 px-4 py-3">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Checkbox checked={allOnPageSelected} onCheckedChange={(c) => onSelectAll(!!c)} />
            Select all
          </label>
          <span className="text-sm text-slate-700">
            <strong>{selectedCount}</strong> candidate{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <Button
            size="sm"
            className={cn(
              "bg-[#0566CD] hover:bg-[#0066c0] text-white",
              selectedCount === 0 && "opacity-50 pointer-events-none"
            )}
            onClick={onContinueNvite}
            disabled={selectedCount === 0}
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
