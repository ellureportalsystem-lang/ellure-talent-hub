import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { SearchFilters } from "@/types/searchFilters";
import { educationOptions, noticePeriodOptions } from "@/data/masterFilterOptions";
import { fetchFilterCities, fetchFilterSkills } from "@/services/dashboardService";

interface ClientSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
  onReset: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ClientSearchFilters({ filters, onFiltersChange, onReset, isCollapsed, onToggleCollapse }: ClientSearchFiltersProps) {
  const [open, setOpen] = useState(true);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [freeTextCity, setFreeTextCity] = useState("");
  const [freeTextSkill, setFreeTextSkill] = useState("");

  useEffect(() => {
    fetchFilterCities().then(setCityOptions);
    fetchFilterSkills().then(setSkillOptions);
  }, []);

  const patch = (partial: Partial<SearchFilters>) => onFiltersChange({ ...filters, ...partial });

  const addFreeTextCity = () => {
    const c = freeTextCity.trim();
    if (!c || filters.currentCity.includes(c)) return;
    patch({ currentCity: [...filters.currentCity, c] });
    setFreeTextCity("");
  };

  const addFreeTextSkill = () => {
    const s = freeTextSkill.trim();
    if (!s || filters.skills.includes(s)) return;
    patch({ skills: [...filters.skills, s] });
    setFreeTextSkill("");
  };

  if (isCollapsed) {
    return (
      <Button variant="outline" size="sm" onClick={onToggleCollapse}>Show Filters</Button>
    );
  }

  return (
    <Card className="dashboard-card border-[var(--surface-border)] bg-[var(--surface-1)]">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onReset}><RotateCcw className="h-4 w-4" /></Button>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex w-full justify-between py-1 font-medium">
            Experience <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            <Label>{filters.experienceRange[0]}–{filters.experienceRange[1]} years</Label>
            <Slider value={filters.experienceRange} min={0} max={25} step={1} onValueChange={(v) => patch({ experienceRange: v as [number, number] })} />
          </CollapsibleContent>
        </Collapsible>
        <div>
          <Label className="mb-2 block">Skills</Label>
          {skillOptions.length === 0 && (
            <div className="flex gap-2 mb-2">
              <Input placeholder="Add skill" value={freeTextSkill} onChange={(e) => setFreeTextSkill(e.target.value)} className="h-8" />
              <Button type="button" size="sm" variant="outline" onClick={addFreeTextSkill}>Add</Button>
            </div>
          )}
          <div className="max-h-32 overflow-y-auto space-y-1">
            {skillOptions.slice(0, 20).map((s) => (
              <label key={s} className="flex items-center gap-2">
                <Checkbox checked={filters.skills.includes(s)} onCheckedChange={(c) => {
                  patch({ skills: c ? [...filters.skills, s] : filters.skills.filter((x) => x !== s) });
                }} />
                <span className="text-xs">{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Label className="mb-2 block">City</Label>
          {cityOptions.length === 0 && (
            <div className="flex gap-2 mb-2">
              <Input placeholder="Add city" value={freeTextCity} onChange={(e) => setFreeTextCity(e.target.value)} className="h-8" />
              <Button type="button" size="sm" variant="outline" onClick={addFreeTextCity}>Add</Button>
            </div>
          )}
          {cityOptions.slice(0, 15).map((c) => (
            <label key={c} className="flex items-center gap-2">
              <Checkbox checked={filters.currentCity.includes(c)} onCheckedChange={(chk) => {
                patch({ currentCity: chk ? [...filters.currentCity, c] : filters.currentCity.filter((x) => x !== c) });
              }} />
              <span className="text-xs">{c}</span>
            </label>
          ))}
        </div>
        <div>
          <Label className="mb-2 block">Notice Period</Label>
          {noticePeriodOptions.map((n) => (
            <label key={n} className="flex items-center gap-2">
              <Checkbox checked={filters.noticePeriod.includes(n)} onCheckedChange={(chk) => {
                patch({ noticePeriod: chk ? [...filters.noticePeriod, n] : filters.noticePeriod.filter((x) => x !== n) });
              }} />
              <span className="text-xs">{n}</span>
            </label>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={onToggleCollapse}>Hide Filters</Button>
      </CardContent>
    </Card>
  );
}
