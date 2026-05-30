import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type RangePreset = {
  id: string;
  label: string;
  range: [number, number];
};

export function rangesEqual(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

export function isAnyRange(value: [number, number], anyRange: [number, number]) {
  return rangesEqual(value, anyRange);
}

export const EXPERIENCE_FILTER_ANY: [number, number] = [0, 20];
export const EXPERIENCE_PRESETS: RangePreset[] = [
  { id: "fresher", label: "Fresher (0–1 yr)", range: [0, 1] },
  { id: "1-3", label: "1–3 yrs", range: [1, 3] },
  { id: "3-5", label: "3–5 yrs", range: [3, 5] },
  { id: "5-10", label: "5–10 yrs", range: [5, 10] },
  { id: "10plus", label: "10+ yrs", range: [10, 20] },
];

export const SALARY_FILTER_ANY: [number, number] = [0, 100];
export const SALARY_PRESETS: RangePreset[] = [
  { id: "upto5", label: "Up to ₹5L", range: [0, 5] },
  { id: "5-10", label: "₹5–10L", range: [5, 10] },
  { id: "10-15", label: "₹10–15L", range: [10, 15] },
  { id: "15-25", label: "₹15–25L", range: [15, 25] },
  { id: "25-50", label: "₹25–50L", range: [25, 50] },
  { id: "50plus", label: "₹50L+", range: [50, 100] },
];

/** Client portal uses a lower salary ceiling in defaults */
export const SALARY_FILTER_ANY_CLIENT: [number, number] = [0, 50];
export const SALARY_PRESETS_CLIENT: RangePreset[] = [
  { id: "upto5", label: "Up to ₹5L", range: [0, 5] },
  { id: "5-10", label: "₹5–10L", range: [5, 10] },
  { id: "10-15", label: "₹10–15L", range: [10, 15] },
  { id: "15-25", label: "₹15–25L", range: [15, 25] },
  { id: "25plus", label: "₹25L+", range: [25, 50] },
];

type RangeFilterControlProps = {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  min: number;
  max: number;
  anyRange: [number, number];
  presets: RangePreset[];
  formatSummary?: (range: [number, number]) => string;
  unit?: string;
};

function PresetChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-8 px-2.5 text-xs font-normal rounded-full",
        !active && "bg-background hover:bg-muted"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function RangeFilterControl({
  value,
  onChange,
  min,
  max,
  anyRange,
  presets,
  formatSummary,
  unit = "",
}: RangeFilterControlProps) {
  const matchesPreset = presets.some((p) => rangesEqual(p.range, value));
  const isAny = isAnyRange(value, anyRange);
  const isCustom = !isAny && !matchesPreset;

  const [showCustom, setShowCustom] = useState(isCustom);
  const [draftMin, setDraftMin] = useState(String(value[0]));
  const [draftMax, setDraftMax] = useState(String(value[1]));

  useEffect(() => {
    if (!showCustom) return;
    setDraftMin(String(value[0]));
    setDraftMax(String(value[1]));
  }, [value, showCustom]);

  useEffect(() => {
    if (isCustom) setShowCustom(true);
  }, [isCustom]);

  const summary =
    !isAny && formatSummary
      ? formatSummary(value)
      : !isAny
        ? value[1] >= max && value[0] > min
          ? `${value[0]}+ ${unit}`.trim()
          : `${value[0]} – ${value[1]} ${unit}`.trim()
        : null;

  const applyCustom = () => {
    let lo = parseInt(draftMin, 10);
    let hi = parseInt(draftMax, 10);
    if (Number.isNaN(lo)) lo = min;
    if (Number.isNaN(hi)) hi = max;
    lo = clamp(lo, min, max);
    hi = clamp(hi, min, max);
    if (lo > hi) [lo, hi] = [hi, lo];
    onChange([lo, hi]);
  };

  return (
    <div className="space-y-2.5">
      {summary && (
        <p className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-md">
          Active: {summary}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        <PresetChip
          label="Any"
          active={isAny}
          onClick={() => {
            onChange(anyRange);
            setShowCustom(false);
          }}
        />
        {presets.map((p) => (
          <PresetChip
            key={p.id}
            label={p.label}
            active={rangesEqual(p.range, value)}
            onClick={() => {
              onChange(p.range);
              setShowCustom(false);
            }}
          />
        ))}
      </div>

      <button
        type="button"
        className="text-xs text-primary hover:underline font-medium"
        onClick={() => setShowCustom((v) => !v)}
      >
        {showCustom ? "Hide custom range" : "Or set a custom range…"}
      </button>

      {showCustom && (
        <div className="rounded-md border bg-muted/30 p-3 space-y-2">
          <p className="text-[11px] text-muted-foreground">Enter minimum and maximum, then tap Apply.</p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div>
              <Label htmlFor={`rf-min-${unit}`} className="text-[11px] text-muted-foreground">
                Min
              </Label>
              <Input
                id={`rf-min-${unit}`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                className="h-9 mt-1"
                value={draftMin}
                onChange={(e) => setDraftMin(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyCustom()}
              />
            </div>
            <span className="pb-2 text-xs text-muted-foreground">to</span>
            <div>
              <Label htmlFor={`rf-max-${unit}`} className="text-[11px] text-muted-foreground">
                Max
              </Label>
              <Input
                id={`rf-max-${unit}`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                className="h-9 mt-1"
                value={draftMax}
                onChange={(e) => setDraftMax(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyCustom()}
              />
            </div>
          </div>
          <Button type="button" size="sm" className="w-full h-8" onClick={applyCustom}>
            Apply range
          </Button>
        </div>
      )}
    </div>
  );
}
