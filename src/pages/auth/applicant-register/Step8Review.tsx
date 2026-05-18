import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { submitRegistration } from "@/services/registrationService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Step8Review = () => {
  const navigate = useNavigate();
  const { applicantId, data, loading, user, email } = useRegistrationApplicant();
  const [submitting, setSubmitting] = useState(false);

  const a = data?.applicant;
  const checks = [
    { ok: !!a?.profile_image, label: "Photo", step: 1 },
    { ok: !!a?.name, label: "Basic Info", step: 1 },
    { ok: !!(a?.phone && a?.city), label: "Contact Details", step: 2 },
    { ok: (data?.education?.length || 0) > 0, label: "Education", step: 3 },
    { ok: a?.experience_type === "fresher" || (data?.experience?.length || 0) > 0, label: "Experience", step: 4 },
    { ok: (data?.skills?.length || 0) >= 3, label: "Skills (min 3)", step: 5 },
    { ok: !!a?.resume_file, label: "Resume", step: 7 },
    { ok: !!a?.expected_ctc || !!a?.notice_period, label: "Career Preferences", step: 6 },
  ];
  const canSubmit = checks.filter((c) => !c.ok && ["Photo", "Basic Info", "Contact Details", "Education", "Skills (min 3)", "Resume"].includes(c.label)).length === 0;

  const handleSubmit = async () => {
    if (!applicantId || !user?.id || !email) return;
    setSubmitting(true);
    try {
      await submitRegistration(applicantId, user.id, email);
      toast.success("Profile submitted!");
      navigate("/auth/applicant-register/success");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <RegistrationLayout currentStep={8} totalSteps={8} stepTitle="Loading" stepSubtitle=""><Loader2 className="animate-spin" /></RegistrationLayout>;

  return (
    <RegistrationLayout currentStep={8} totalSteps={8} stepTitle="Review & Submit" stepSubtitle="Confirm your details" onPrevious={() => navigate("/auth/applicant-register/step-7")} showPrevious nextLabel={submitting ? "Submitting..." : "Submit"} onNext={handleSubmit} isNextDisabled={!canSubmit || submitting}>
      <div className="space-y-4 mb-6">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2 text-sm">
            {c.ok ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-orange-500" />}
            <span>{c.label}</span>
            <Button type="button" variant="link" size="sm" className="ml-auto" onClick={() => navigate(`/auth/applicant-register/step-${c.step}`)}>Edit</Button>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>{a?.name || "Your Profile"}</CardTitle></CardHeader>
        <CardContent className="text-sm space-y-1 text-muted-foreground">
          <p>{a?.email}</p>
          <p>{a?.phone} · {a?.city}</p>
          <p>Skills: {a?.key_skills ? (Array.isArray(a.key_skills) ? a.key_skills.join(", ") : a.key_skills) : "—"}</p>
        </CardContent>
      </Card>
    </RegistrationLayout>
  );
};

export default Step8Review;
