import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import { upsertJob } from "@/services/jobService";
import { toast } from "sonner";
import { RecruiterJobsSidebar } from "./RecruiterJobsSidebar";

export default function RecruiterPostJobPage() {
  const { user } = useAuth();
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;
  const [searchParams] = useSearchParams();
  const isInternship = searchParams.get("type") === "internship";

  const [title, setTitle] = useState("");
  const [workMode, setWorkMode] = useState("in_office");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [hideSalary, setHideSalary] = useState(false);
  const [description, setDescription] = useState(
    "**Role & responsibilities:**\nOutline the day-to-day responsibilities.\n\n**Preferred candidate profile:**\nSpecify required expertise and experience.\n\n**Perks and benefits:**\nMention facilities and benefits."
  );
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || skills.includes(s)) return;
    setSkills((p) => [...p, s]);
    setSkillInput("");
  };

  const addLocation = () => {
    const v = locationInput.trim();
    if (!v || locations.includes(v)) return;
    setLocations((p) => [...p, v]);
    setLocationInput("");
  };

  const publish = async (status: "draft" | "active") => {
    if (!title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!user?.id || !clientId) return;
    setSaving(true);
    try {
      await upsertJob(
        {
          title,
          description,
          jobType: isInternship ? "internship" : "full-time",
          workMode: workMode === "remote" ? "remote" : workMode === "hybrid" ? "hybrid" : "onsite",
          skillsRequired: skills,
          city: locations[0] || undefined,
          experienceMin: minExp ? Number(minExp) : undefined,
          experienceMax: maxExp ? Number(maxExp) : undefined,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
          status,
          clientId,
        },
        user.id
      );
      toast.success(status === "active" ? "Job published" : "Draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#f4f5f7]">
      <RecruiterJobsSidebar />

      <div className="flex-1 min-w-0 p-4 md:p-6">
        <Link to="/dashboard/client/jobs" className="mb-4 inline-flex items-center gap-1 text-sm text-[#0566CD] hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <Card className="mx-auto max-w-[720px] border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isInternship ? "Post an Internship" : "Post a Hot Vacancy"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Fill in job details — Naukri-style posting form</p>
            </div>

            <div className="space-y-2">
              <Label>Job title / Designation <span className="text-red-500">*</span></Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Software Engineer" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Work mode <span className="text-red-500">*</span></Label>
                <Select value={workMode} onValueChange={setWorkMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_office">In office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min" value={minExp} onChange={(e) => setMinExp(e.target.value)} className="w-20" />
                  <span className="text-sm text-slate-500">to</span>
                  <Input type="number" placeholder="Max" value={maxExp} onChange={(e) => setMaxExp(e.target.value)} className="w-20" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Key skills <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2">
                {skills.map((s) => (
                  <Badge key={s} className="gap-1 bg-blue-50 text-[#0566CD]">
                    ★ {s}
                    <button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                <Input className="flex-1 min-w-[120px] border-0 shadow-none h-7" placeholder="Add skills" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2">
                {locations.map((loc) => (
                  <Badge key={loc} variant="secondary" className="gap-1">
                    {loc}
                    <button type="button" onClick={() => setLocations((p) => p.filter((x) => x !== loc))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                <Input className="flex-1 min-w-[100px] border-0 shadow-none h-7" placeholder="Add city" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLocation(); } }} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Annual offered salary</Label>
              <div className="flex flex-wrap items-center gap-2">
                <span>₹</span>
                <Select value={salaryMin} onValueChange={setSalaryMin}>
                  <SelectTrigger className="w-[110px]"><SelectValue placeholder="Minimum" /></SelectTrigger>
                  <SelectContent>
                    {["3", "5", "8", "12", "15", "20"].map((v) => <SelectItem key={v} value={v}>{v} lacs</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-sm text-slate-500">to</span>
                <Select value={salaryMax} onValueChange={setSalaryMax}>
                  <SelectTrigger className="w-[110px]"><SelectValue placeholder="Maximum" /></SelectTrigger>
                  <SelectContent>
                    {["8", "12", "15", "20", "25", "35"].map((v) => <SelectItem key={v} value={v}>{v} lacs</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Checkbox checked={hideSalary} onCheckedChange={(c) => setHideSalary(!!c)} />
                Hide salary details from candidates (not recommended)
              </label>
            </div>

            <div className="space-y-2">
              <Label>Job description <span className="text-red-500">*</span></Label>
              <div className="rounded border border-slate-200">
                <div className="flex gap-1 border-b px-2 py-1.5 text-xs text-slate-600">
                  <button type="button" className="font-bold px-2 bg-slate-100 rounded">B</button>
                  <button type="button" className="italic px-2">I</button>
                  <button type="button" className="underline px-2">U</button>
                </div>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[180px] border-0 rounded-none" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" disabled={saving} onClick={() => void publish("draft")}>Save as draft</Button>
              <Button className="bg-[#0566CD] hover:bg-[#0066c0]" disabled={saving} onClick={() => void publish("active")}>
                Post job now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
