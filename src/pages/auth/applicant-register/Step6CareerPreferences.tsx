import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { saveRegistrationStep6 } from "@/services/registrationService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  currentCtc: z.coerce.number().optional(),
  currentCtcNotDisclosed: z.boolean().optional(),
  expectedCtc: z.coerce.number().optional(),
  noticePeriod: z.string().optional(),
  jobRole: z.string().optional(),
  isActivelyLooking: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const NOTICE = ["Immediate", "15 days", "30 days", "45 days", "60 days", "90 days", "More than 90 days"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship"];
const WORK_MODES = ["Onsite", "Remote", "Hybrid"];

const Step6CareerPreferences = () => {
  const navigate = useNavigate();
  const { applicantId, data, loading, user, email } = useRegistrationApplicant();
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActivelyLooking: true },
  });

  useEffect(() => {
    const a = data?.applicant;
    if (!a) return;
    if (a.current_ctc) setValue("currentCtc", Number(a.current_ctc));
    if (a.expected_ctc) setValue("expectedCtc", Number(a.expected_ctc));
    if (a.notice_period) setValue("noticePeriod", a.notice_period);
    if (a.job_role) setValue("jobRole", a.job_role);
    setValue("isActivelyLooking", a.is_actively_looking !== false);
    setJobTypes(a.preferred_job_types || []);
    setWorkModes(a.work_mode_preferences || []);
  }, [data, setValue]);

  const onSubmit = async (form: FormData) => {
    if (!applicantId) return;
    setSaving(true);
    try {
      await saveRegistrationStep6(applicantId, {
        ...form,
        preferredJobTypes: jobTypes,
        workModePreferences: workModes,
      });
      toast.success("Saved");
      navigate("/auth/applicant-register/step-7");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <RegistrationLayout currentStep={6} totalSteps={8} stepTitle="Loading" stepSubtitle=""><Loader2 className="animate-spin" /></RegistrationLayout>;

  return (
    <RegistrationLayout currentStep={6} totalSteps={8} stepTitle="Career Preferences" stepSubtitle="Help recruiters match you" onPrevious={() => navigate("/auth/applicant-register/step-5")} onNext={handleSubmit(onSubmit)} nextLabel={saving ? "Saving..." : "Next"} isNextDisabled={saving}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <Checkbox {...register("currentCtcNotDisclosed")} />
          <Label>Current CTC not disclosed</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Current CTC (LPA)</Label><Input type="number" {...register("currentCtc")} /></div>
          <div><Label>Expected CTC (LPA)</Label><Input type="number" {...register("expectedCtc")} /></div>
        </div>
        <div><Label>Notice Period</Label>
          <Select value={watch("noticePeriod") || ""} onValueChange={(v) => setValue("noticePeriod", v)}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>{NOTICE.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Functional Area / Role</Label><Input {...register("jobRole")} /></div>
        <div><Label>Job Type Preference</Label>
          <div className="flex flex-wrap gap-2 mt-1">{JOB_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-1 text-sm">
              <Checkbox checked={jobTypes.includes(t)} onCheckedChange={(c) => setJobTypes(c ? [...jobTypes, t] : jobTypes.filter((x) => x !== t))} />{t}
            </label>
          ))}</div>
        </div>
        <div><Label>Work Mode</Label>
          <div className="flex flex-wrap gap-2 mt-1">{WORK_MODES.map((t) => (
            <label key={t} className="flex items-center gap-1 text-sm">
              <Checkbox checked={workModes.includes(t)} onCheckedChange={(c) => setWorkModes(c ? [...workModes, t] : workModes.filter((x) => x !== t))} />{t}
            </label>
          ))}</div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Actively looking for opportunities</Label>
          <Switch checked={watch("isActivelyLooking")} onCheckedChange={(c) => setValue("isActivelyLooking", c)} />
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step6CareerPreferences;
