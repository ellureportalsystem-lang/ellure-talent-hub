import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";
import { naukriCardClass } from "@/components/dashboard/naukri/naukriShellStyles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, X, Bell, Mail, Laptop, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  NviteAddQuestionsModal,
  SUGGESTED_NVITE_QUESTIONS,
  type NviteQuestion,
} from "@/components/dashboard/recruiter/nvite/NviteAddQuestionsModal";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import { useClientPlanFeatures } from "@/hooks/useClientPlanFeatures";
import { UpgradePlanModal } from "@/components/client/UpgradePlanModal";
import { sendNviteCampaign } from "@/services/nviteService";
import { cn } from "@/lib/utils";

const CLIENT_TYPES = ["Indian MNC", "Foreign MNC", "Govt/PSU", "Startup", "Corporate"] as const;

const STEPS = [
  { id: 1, label: "Compose details" },
  { id: 2, label: "Location & JD" },
  { id: 3, label: "Client & questions" },
  { id: 4, label: "Team & notify" },
  { id: 5, label: "Review & send" },
] as const;

function NviteEmailNotice() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <strong>NVite email status:</strong> The compose and send flow works in the app. Delivery requires{" "}
      <code className="rounded bg-amber-100 px-1 text-xs">RESEND_API_KEY</code> in Supabase Edge secrets and a
      verified sending domain. Until then, campaigns may save but emails will not deliver — see{" "}
      <code className="text-xs">docs/EXTERNAL_SERVICES_SETUP_CHECKLIST.md</code>.
    </div>
  );
}

export default function NvitePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useAuth();
  const { data: ctx } = useClientContext();
  const { canSendNvite } = useClientPlanFeatures();
  const clientId = ctx?.client?.id;

  const [sending, setSending] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const idsParam = searchParams.get("ids") ?? "";
  const query = searchParams.get("q") ?? "";
  const step = Math.min(5, Math.max(1, Number(searchParams.get("step") ?? 1)));

  const selectedIds = useMemo(
    () => idsParam.split(",").map((s) => s.trim()).filter(Boolean),
    [idsParam]
  );
  const count = selectedIds.length;

  const [proceedMode, setProceedMode] = useState<"new" | "existing">("new");
  const [designation, setDesignation] = useState("");
  const [workMode, setWorkMode] = useState("in_office");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [locations, setLocations] = useState<string[]>(["Pune"]);
  const [locationInput, setLocationInput] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [hideSalary, setHideSalary] = useState(false);
  const [jobDescription, setJobDescription] = useState(
    "**Role & responsibilities:**\nOutline the day-to-day responsibilities for this role.\n\n**Preferred candidate profile:**\nSpecify required role expertise, previous job experience, or relevant certifications.\n\n**Perks and benefits:**\nMention available facilities and benefits the company is offering with this job."
  );
  const [walkIn, setWalkIn] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientIndustry, setClientIndustry] = useState("it_services");
  const [clientType, setClientType] = useState<string>("Indian MNC");
  const [questions, setQuestions] = useState<NviteQuestion[]>([]);
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState("every");
  const [betaReach, setBetaReach] = useState("no");

  const userEmail = profile?.email ?? "you@company.com";

  const goStep = (n: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("step", String(n));
    setSearchParams(p);
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const addLocation = () => {
    const v = locationInput.trim();
    if (!v || locations.includes(v)) return;
    setLocations((p) => [...p, v]);
    setLocationInput("");
  };

  const addSuggestedQuestion = (text: string) => {
    setQuestions((p) => [
      ...p,
      { id: crypto.randomUUID(), text, mandatory: true, type: "short", options: [] },
    ]);
  };

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!designation.trim()) {
        toast.error("Designation is required");
        return false;
      }
      if (skills.length === 0) {
        toast.error("Add at least one key skill");
        return false;
      }
    }
    if (s === 2 && !jobDescription.trim()) {
      toast.error("Job description is required");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!canSendNvite) {
      setUpgradeOpen(true);
      return;
    }
    if (!clientId) {
      toast.error("Client account not loaded");
      return;
    }

    const salaryLine =
      salaryMin || salaryMax
        ? `<p><strong>Salary:</strong> ₹${salaryMin || "—"} to ₹${salaryMax || "—"}${hideSalary ? " (confidential)" : ""}</p>`
        : "";

    const messageHtml = `
      <p>Hi {candidate_name},</p>
      <p>{recruiter_name} from {company_name} would like to share an opportunity with you.</p>
      <p><strong>Role:</strong> ${designation}</p>
      <p><strong>Skills:</strong> ${skills.join(", ")}</p>
      <p><strong>Location:</strong> ${locations.join(", ")}</p>
      <p><strong>Work mode:</strong> ${workMode.replace(/_/g, " ")}</p>
      ${salaryLine}
      <div>${jobDescription.replace(/\n/g, "<br>")}</div>
      ${clientName ? `<p><strong>Client:</strong> ${clientName} (${clientType})</p>` : ""}
    `;

    const mappedQuestions = questions.map((q) => ({
      question: q.text,
      type: (q.type === "short" ? "text" : "mcq") as "text" | "mcq",
      options: q.type !== "short" && q.options?.length ? q.options : undefined,
    }));

    setSending(true);
    toast.info(`Sending to ${count} candidate(s)...`);

    try {
      const result = await sendNviteCampaign({
        recruiter_id: clientId,
        candidate_ids: selectedIds,
        job_id: null,
        subject: `${designation} opportunity at ${clientName || "{company_name}"}`,
        message_html: messageHtml,
        questions: mappedQuestions,
        reply_to_email: profile?.email ?? null,
      });

      if (result.failed > 0 && result.sent === 0) {
        toast.error(`Failed to send NVite. ${result.errors.slice(0, 3).join("; ")}`);
        return;
      }

      if (result.failed > 0) {
        toast.warning(`Sent to ${result.sent}, failed for ${result.failed}`, {
          description: result.errors.slice(0, 5).join("\n"),
        });
      } else {
        toast.success(`NVite sent to ${result.sent} candidate(s)!`);
      }

      navigate("/dashboard/client/nvite/campaigns", {
        state: { success: true, sent: result.sent },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send NVite");
    } finally {
      setSending(false);
    }
  };

  if (count === 0) {
    return (
      <NaukriPageContainer className="space-y-4">
        <NviteEmailNotice />
        <Card className={naukriCardClass}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Send className="h-12 w-12 text-[#0566CD] mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Send NVite</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Select candidates from Resdex results, then continue here to compose your mass mail.
            </p>
            <Button asChild className="mt-6 bg-[#0566CD] hover:bg-[#0066c0]">
              <Link to="/dashboard/client/resdex/results?nvite=1">Go to Resdex results</Link>
            </Button>
          </CardContent>
        </Card>
      </NaukriPageContainer>
    );
  }

  return (
    <NaukriPageContainer className="max-w-[720px] space-y-4 pb-28" dense>
      <NviteEmailNotice />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Send className="h-4 w-4 text-[#0566CD]" />
        <Link to="/dashboard/client/resdex/results?nvite=1" className="hover:text-[#0566CD]">
          Send NVite
        </Link>
        <span>&gt;</span>
        <span>
          <strong className="text-slate-800">{count} candidates selected</strong>
        </span>
        <span>&gt;</span>
        <span className="font-semibold text-slate-900">{STEPS[step - 1].label}</span>
      </nav>

      {/* Step indicator */}
      <div className="flex gap-1">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={cn(
              "h-1 flex-1 rounded-full",
              s.id <= step ? "bg-[#0566CD]" : "bg-slate-200"
            )}
          />
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">How would you like to proceed?</h2>
              <RadioGroup value={proceedMode} onValueChange={(v) => setProceedMode(v as "new" | "existing")}>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                  <RadioGroupItem value="new" id="new" className="mt-1" />
                  <div>
                    <Label htmlFor="new" className="font-semibold cursor-pointer">Create new</Label>
                    <p className="text-sm text-slate-500">All responses will appear as a new item in Manage Jobs and Responses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
                  <RadioGroupItem value="existing" id="existing" className="mt-1" />
                  <div>
                    <Label htmlFor="existing" className="font-semibold cursor-pointer">Use a previous one / posted job</Label>
                    <p className="text-sm text-slate-500">Responses will be clubbed with a previous NVite / posted job</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Compose details to be shared with candidates</h2>
                <button type="button" className="mt-1 text-sm text-[#0566CD] hover:underline">
                  Pre-fill details using a previous NVite
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Designation <span className="text-red-500">*</span></Label>
                  <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Short & specific designations get more attention" />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-500">Suggestions:</span>
                    {["Solution Architect", "Architect", "Software Engineer"].map((s) => (
                      <button key={s} type="button" className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs hover:border-[#0566CD]" onClick={() => setDesignation(s)}>{s}</button>
                    ))}
                  </div>
                </div>
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
              </div>
              <div className="space-y-2">
                <Label>Key skills <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2 min-h-[42px]">
                  {skills.map((s) => (
                    <Badge key={s} className="gap-1 bg-blue-50 text-[#0566CD] border-blue-200">
                      ★ {s}
                      <button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
                    </Badge>
                  ))}
                  <Input className="flex-1 min-w-[120px] border-0 shadow-none h-7" placeholder="Add skills" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Java", "Python", "AWS", "SQL", "Microservices", "React.js"].map((s) => (
                    <button key={s} type="button" disabled={skills.includes(s)} className="text-xs text-slate-600 hover:text-[#0566CD] disabled:opacity-40" onClick={() => addSkill(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Location <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 p-2">
                {locations.map((loc) => (
                  <Badge key={loc} variant="secondary" className="gap-1 bg-blue-50 text-[#0566CD]">
                    {loc}
                    <button type="button" onClick={() => setLocations((p) => p.filter((x) => x !== loc))}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
                <Input className="flex-1 min-w-[100px] border-0 shadow-none h-7" placeholder="Add city" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLocation(); } }} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Annual offered salary <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm">₹</span>
                <Select value={salaryMin} onValueChange={setSalaryMin}>
                  <SelectTrigger className="w-[110px]"><SelectValue placeholder="Minimum" /></SelectTrigger>
                  <SelectContent>
                    {["50,000", "3", "5", "8", "12", "15"].map((v) => <SelectItem key={v} value={v}>{v === "50,000" ? "50,000" : `${v} lacs`}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-sm text-slate-500">to</span>
                <Select value={salaryMax} onValueChange={setSalaryMax}>
                  <SelectTrigger className="w-[110px]"><SelectValue placeholder="Maximum" /></SelectTrigger>
                  <SelectContent>
                    {["3 lacs", "8", "12", "15", "20", "25", "35"].map((v) => <SelectItem key={v} value={v}>{v.includes("lacs") ? v : `${v} lacs`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Checkbox checked={hideSalary} onCheckedChange={(c) => setHideSalary(!!c)} />
                Hide salary details from candidates (not recommended) ⓘ
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Job description <span className="text-red-500">*</span></Label>
                <button type="button" className="text-sm text-[#0566CD] hover:underline flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" /> Upload JD
                </button>
              </div>
              <div className="rounded border border-slate-200">
                <div className="flex gap-1 border-b border-slate-100 px-2 py-1.5 text-xs">
                  <button type="button" className="font-bold px-2 py-0.5 rounded bg-slate-100">B</button>
                  <button type="button" className="italic px-2 py-0.5">I</button>
                  <button type="button" className="underline px-2 py-0.5">U</button>
                  <button type="button" className="px-2 py-0.5">• List</button>
                  <button type="button" className="px-2 py-0.5">1. List</button>
                </div>
                <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-[200px] border-0 rounded-none focus-visible:ring-0" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={walkIn} onCheckedChange={(c) => setWalkIn(!!c)} />
              Include walk-in details
            </label>

            <div className="space-y-2">
              <Label>Client name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter the name of the client you are hiring for" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Client industry you are hiring for <span className="text-red-500">*</span></Label>
              <Select value={clientIndustry} onValueChange={setClientIndustry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="it_services">IT Services &amp; Consulting</SelectItem>
                  <SelectItem value="bfsi">BFSI</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Client type</Label>
                <button type="button" className="text-xs text-[#0566CD]" onClick={() => setClientType("")}>Clear selection</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {CLIENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs",
                      clientType === t ? "border-[#0566CD] bg-blue-50 text-[#0566CD]" : "border-slate-200 text-slate-700"
                    )}
                    onClick={() => setClientType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="text-sm text-[#0566CD] hover:underline">+ Add reference code ⓘ</button>

            <div className="rounded border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">Questions for candidates</h3>
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-[10px]">Recommended</Badge>
              </div>
              <p className="text-sm text-slate-500">To better evaluate candidates, ask them questions regarding the job requirement</p>
              <Button variant="outline" className="w-full border-[#0566CD] text-[#0566CD]" onClick={() => setQuestionsModalOpen(true)}>
                + Add a question
              </Button>
              {questions.length > 0 && (
                <ul className="text-sm text-slate-700 space-y-1">
                  {questions.map((q) => (
                    <li key={q.id}>• {q.text}</li>
                  ))}
                </ul>
              )}
              <div>
                <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_NVITE_QUESTIONS.map((q) => (
                    <button key={q} type="button" className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:border-[#0566CD]" onClick={() => addSuggestedQuestion(q)}>
                      + {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900">Add team members who can view and manage this NVite&apos;s responses</h3>
              <p className="mt-2 text-sm text-slate-600">
                You and <strong>{userEmail}</strong> (super-user) are already included.{" "}
                <button type="button" className="text-[#0566CD] hover:underline">Select more users</button>
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex flex-wrap items-center gap-2 text-sm">
                <Checkbox checked={emailNotify} onCheckedChange={(c) => setEmailNotify(!!c)} />
                Get responses through email as well,
                <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                  <SelectTrigger className="h-8 w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every">on every new response</SelectItem>
                    <SelectItem value="daily">once daily</SelectItem>
                    <SelectItem value="weekly">once weekly</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">No extra cost</Badge>
              </label>

              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Users who&apos;ll receive responses through email (max 5) ⓘ</Label>
                <div className="rounded-md border border-slate-200 p-2 min-h-[42px]">
                  <Badge className="bg-blue-50 text-[#0566CD] gap-1">
                    {userEmail.slice(0, 12)}… (Me)
                    <X className="h-3 w-3" />
                  </Badge>
                  <Input className="mt-2 border-0 shadow-none h-7" placeholder="Search or select from list" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <p className="font-semibold text-slate-900">Candidates will be able to view your NVite on their</p>
              <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                <div className="text-center">
                  <Bell className="h-8 w-8 text-orange-500 mx-auto" />
                  <p className="text-xs mt-1">App notification</p>
                </div>
                <span className="text-slate-400">+</span>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-[#0566CD] mx-auto" />
                  <p className="text-xs mt-1">Email</p>
                </div>
                <span className="text-slate-400">+</span>
                <div className="text-center">
                  <Laptop className="h-8 w-8 text-pink-500 mx-auto" />
                  <p className="text-xs mt-1">TalentHub inbox</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm relative">
            <Badge className="absolute top-3 left-3 bg-slate-200 text-slate-600 text-[10px]">Beta</Badge>
            <CardContent className="p-6 pt-10">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-sm text-slate-800 flex-1">
                  Allow TalentHub to get more applies by reaching out to additional matching candidates
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 shrink-0">No extra cost</Badge>
              </div>
              <RadioGroup value={betaReach} onValueChange={setBetaReach} className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="beta-yes" />
                  <Label htmlFor="beta-yes">Yes, I am interested</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="beta-no" />
                  <Label htmlFor="beta-no">No, I don&apos;t require it</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="p-4 text-sm text-slate-600">
              <p><strong>Designation:</strong> {designation}</p>
              <p><strong>Skills:</strong> {skills.join(", ")}</p>
              <p><strong>Locations:</strong> {locations.join(", ")}</p>
              {query && <p><strong>Search:</strong> {query}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <NviteAddQuestionsModal
        open={questionsModalOpen}
        onOpenChange={setQuestionsModalOpen}
        questions={questions}
        onSave={setQuestions}
      />

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-4 shadow-lg z-30">
        <div className="mx-auto max-w-[720px] flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Reaching out to</p>
            <p className="text-2xl font-bold text-slate-900">{count} candidates</p>
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => goStep(step - 1)}>Back</Button>
            )}
            {step < 5 ? (
              <Button
                className="bg-[#0566CD] hover:bg-[#0066c0]"
                onClick={() => {
                  if (validateStep(step)) goStep(step + 1);
                }}
              >
                Continue
              </Button>
            ) : (
              <>
                <Button variant="outline" className="border-[#0566CD] text-[#0566CD]">Preview</Button>
                <Button
                  className="bg-[#0566CD] hover:bg-[#0066c0]"
                  onClick={() => void handleSend()}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send now"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <UpgradePlanModal open={upgradeOpen} onOpenChange={setUpgradeOpen} feature="NVite mass mail" />
    </NaukriPageContainer>
  );
}
