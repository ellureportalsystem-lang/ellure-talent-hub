import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { RegistrationProgressBar } from "@/components/registration/RegistrationProgressBar";
import { PhotoCropUpload } from "@/components/registration/PhotoCropUpload";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { saveRegistrationStep1 } from "@/services/registrationService";
import { saveLanguagesKnown, type LanguageRow } from "@/lib/registrationExtras";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  fullName: z.string().trim().min(2, "Required").max(100),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], { required_error: "Required" }),
  maritalStatus: z.string().optional(),
  fatherName: z.string().optional(),
  differentlyAbled: z.boolean(),
  languages: z.array(z.object({
    name: z.string().min(1),
    proficiency: z.enum(["Beginner", "Intermediate", "Expert", "Native"]),
  })).optional(),
});

type FormData = z.infer<typeof schema>;

const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data, loading, email } = useRegistrationApplicant();
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | undefined>();

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { differentlyAbled: false, languages: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "languages" });

  useEffect(() => {
    if (!data) return;
    const a = data.applicant;
    const p = data.profile;
    if (a?.name || p?.full_name) setValue("fullName", a?.name || p?.full_name || "");
    if (a?.date_of_birth || a?.dob) setValue("dateOfBirth", (a.date_of_birth || a.dob)?.slice?.(0, 10) || a.date_of_birth);
    if (a?.gender) setValue("gender", a.gender as FormData["gender"]);
    if (a?.marital_status) setValue("maritalStatus", a.marital_status);
    if (a?.father_name) setValue("fatherName", a.father_name);
    setValue("differentlyAbled", !!a?.differently_abled);
    const langs = a?.languages_known as LanguageRow[] | undefined;
    if (langs?.length) setValue("languages", langs);
  }, [data, setValue]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth/applicant");
  }, [user, authLoading, navigate]);

  const onSubmit = async (form: FormData) => {
    if (!user?.id || !email) return;
    setSaving(true);
    try {
      const applicantId = await saveRegistrationStep1(user.id, email, {
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        maritalStatus: form.maritalStatus,
        fatherName: form.fatherName,
        differentlyAbled: form.differentlyAbled,
        avatarFile,
      });
      if (form.languages?.length) await saveLanguagesKnown(applicantId, form.languages);
      toast.success("Saved");
      navigate("/auth/applicant-register/step-2");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const fullName = watch("fullName") || "U";
  const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (authLoading || loading) {
    return (
      <RegistrationLayout currentStep={1} totalSteps={8} stepTitle="Loading" stepSubtitle="" showPrevious={false}>
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout
      currentStep={1}
      totalSteps={8}
      stepTitle="Basic Info"
      stepSubtitle="Tell us about yourself"
      showPrevious={false}
      onNext={handleSubmit(onSubmit)}
      nextLabel={saving ? "Saving..." : "Next"}
      isNextDisabled={saving}
    >
      <RegistrationProgressBar currentStep={1} />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <PhotoCropUpload
          currentUrl={data?.applicant?.profile_image || data?.profile?.avatar_url}
          initials={initials}
          onCropped={setAvatarFile}
        />
        <div className="space-y-2">
          <Label>Full Name *</Label>
          <Input {...register("fullName")} />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <RadioGroup value={watch("gender")} onValueChange={(v) => setValue("gender", v as FormData["gender"])}>
            {[
              { v: "male", l: "Male" },
              { v: "female", l: "Female" },
              { v: "other", l: "Other" },
              { v: "prefer_not_to_say", l: "Prefer not to say" },
            ].map(({ v, l }) => (
              <div key={v} className="flex items-center gap-2">
                <RadioGroupItem value={v} id={v} />
                <Label htmlFor={v}>{l}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <Select value={watch("maritalStatus") || ""} onValueChange={(v) => setValue("maritalStatus", v)}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {["Single", "Married", "Divorced", "Widowed"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Father&apos;s Name</Label>
            <Input {...register("fatherName")} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>Differently Abled</Label>
          <Switch checked={watch("differentlyAbled")} onCheckedChange={(c) => setValue("differentlyAbled", c)} />
        </div>
        <div className="space-y-3">
          <Label>Languages Known</Label>
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <Input placeholder="Language" {...register(`languages.${i}.name`)} className="flex-1" />
              <Select value={watch(`languages.${i}.proficiency`)} onValueChange={(v) => setValue(`languages.${i}.proficiency`, v as LanguageRow["proficiency"])}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Beginner", "Intermediate", "Expert", "Native"].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", proficiency: "Intermediate" })}>
            <Plus className="h-4 w-4 mr-1" /> Add language
          </Button>
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step1BasicInfo;
