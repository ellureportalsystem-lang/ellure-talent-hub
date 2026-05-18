import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { saveRegistrationStep7 } from "@/services/registrationService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const Step7Documents = () => {
  const navigate = useNavigate();
  const { applicantId, data, loading, user } = useRegistrationApplicant();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const a = data?.applicant;
    if (a?.linkedin_url) setValue("linkedinUrl", a.linkedin_url);
    if (a?.github_url) setValue("githubUrl", a.github_url);
    if (a?.portfolio_url) setValue("portfolioUrl", a.portfolio_url);
  }, [data, setValue]);

  const onSubmit = async (form: FormData) => {
    if (!applicantId || !user?.id) return;
    if (!resumeFile && !data?.applicant?.resume_file) {
      toast.error("Resume is required");
      return;
    }
    setSaving(true);
    try {
      await saveRegistrationStep7(applicantId, user.id, { ...form, resumeFile: resumeFile || undefined });
      toast.success("Saved");
      navigate("/auth/applicant-register/step-8");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <RegistrationLayout currentStep={7} totalSteps={8} stepTitle="Loading" stepSubtitle=""><Loader2 className="animate-spin" /></RegistrationLayout>;

  return (
    <RegistrationLayout currentStep={7} totalSteps={8} stepTitle="Documents & Links" stepSubtitle="Upload resume and profiles" onPrevious={() => navigate("/auth/applicant-register/step-6")} onNext={handleSubmit(onSubmit)} isNextDisabled={saving}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Resume (PDF/DOC, max 5MB) *</Label>
          {data?.applicant?.resume_file && <p className="text-xs text-muted-foreground mb-1">Current file on record — upload to replace</p>}
          <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        </div>
        <div><Label>LinkedIn URL</Label><Input {...register("linkedinUrl")} placeholder="https://linkedin.com/in/..." /></div>
        <div><Label>GitHub URL</Label><Input {...register("githubUrl")} /></div>
        <div><Label>Portfolio URL</Label><Input {...register("portfolioUrl")} /></div>
      </form>
    </RegistrationLayout>
  );
};

export default Step7Documents;
