import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { RegistrationProgressBar } from "@/components/registration/RegistrationProgressBar";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { saveRegistrationStep2 } from "@/services/registrationService";
import { fetchStates, fetchCities, type State, type City } from "@/services/masterDataService";
import { TagInput } from "@/components/ui/tag-input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const schema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "10-digit mobile required"),
  alternatePhone: z.string().regex(/^[0-9]{10}$/, "Invalid").optional().or(z.literal("")),
  currentAddress: z.string().optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, "6-digit pincode").optional().or(z.literal("")),
  city: z.string().min(1, "City required"),
  state: z.string().optional(),
  permanentSame: z.boolean(),
  permanentAddress: z.string().optional(),
  permanentPincode: z.string().optional(),
  permanentCity: z.string().optional(),
  preferredLocations: z.array(z.string()).max(5),
  openToRelocate: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const Step2Address = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applicantId, data, loading, email } = useRegistrationApplicant();
  const [saving, setSaving] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [stateId, setStateId] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { permanentSame: true, preferredLocations: [], openToRelocate: false },
  });

  useEffect(() => {
    fetchStates().then(setStates);
  }, []);

  useEffect(() => {
    if (!data) return;
    const a = data.applicant;
    const addr = data.addresses?.find((x: { address_type?: string }) => x.address_type === "current");
    if (a?.phone) setValue("phone", a.phone.replace(/\D/g, "").slice(-10));
    if (a?.alternate_phone) setValue("alternatePhone", a.alternate_phone);
    if (addr?.address_line1) setValue("currentAddress", addr.address_line1);
    if (addr?.pincode) setValue("pincode", addr.pincode);
    if (a?.city || addr?.city) setValue("city", a?.city || addr?.city);
    if (addr?.state) setValue("state", addr.state);
    setValue("openToRelocate", !!a?.open_to_relocation);
    const pref = a?.preferred_locations;
    if (pref) setValue("preferredLocations", typeof pref === "string" ? pref.split(",").map((s: string) => s.trim()) : pref);
  }, [data, setValue]);

  useEffect(() => {
    if (stateId) fetchCities(stateId).then(setCities);
  }, [stateId]);

  const onSubmit = async (form: FormData) => {
    if (!applicantId || !user?.id) return;
    setSaving(true);
    try {
      await saveRegistrationStep2(applicantId, user.id, {
        phone: form.phone,
        alternatePhone: form.alternatePhone || undefined,
        currentAddress: form.currentAddress,
        pincode: form.pincode || undefined,
        city: form.city,
        state: form.state,
        permanentSameAsCurrent: form.permanentSame,
        permanentAddress: form.permanentSame ? undefined : form.permanentAddress,
        permanentPincode: form.permanentSame ? undefined : form.permanentPincode,
        permanentCity: form.permanentSame ? undefined : form.permanentCity,
        preferredLocations: form.preferredLocations,
        openToRelocate: form.openToRelocate,
      });
      toast.success("Saved");
      navigate("/auth/applicant-register/step-3");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RegistrationLayout currentStep={2} totalSteps={8} stepTitle="Loading" stepSubtitle="">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
      </RegistrationLayout>
    );
  }

  return (
    <RegistrationLayout
      currentStep={2}
      totalSteps={8}
      stepTitle="Contact & Location"
      stepSubtitle="How recruiters can reach you"
      onPrevious={() => navigate("/auth/applicant-register/step-1")}
      onNext={handleSubmit(onSubmit)}
      nextLabel={saving ? "Saving..." : "Next"}
      isNextDisabled={saving}
    >
      <RegistrationProgressBar currentStep={2} />
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mobile *</Label>
            <Input {...register("phone")} maxLength={10} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Alternate Mobile</Label>
            <Input {...register("alternatePhone")} maxLength={10} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email || user?.email || ""} readOnly disabled className="bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>Current Address</Label>
          <Textarea {...register("currentAddress")} rows={3} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input {...register("pincode")} maxLength={6} />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Select onValueChange={(v) => { setStateId(v); const s = states.find((x) => x.id === v); setValue("state", s?.name || v); }}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{states.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            {cities.length > 0 ? (
              <Select onValueChange={(v) => setValue("city", cities.find((c) => c.id === v)?.name || v)}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{cities.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <Input {...register("city")} placeholder="Enter city" />
            )}
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={watch("permanentSame")} onCheckedChange={(c) => setValue("permanentSame", !!c)} />
          <Label>Permanent address same as current</Label>
        </div>
        {!watch("permanentSame") && (
          <div className="space-y-3 border rounded-lg p-4">
            <Label>Permanent Address</Label>
            <Textarea {...register("permanentAddress")} />
            <Input {...register("permanentPincode")} placeholder="Pincode" />
            <Input {...register("permanentCity")} placeholder="City" />
          </div>
        )}
        <div className="space-y-2">
          <Label>Preferred Work Locations (max 5)</Label>
          <TagInput value={watch("preferredLocations")} onChange={(v) => setValue("preferredLocations", v.slice(0, 5))} maxTags={5} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Open to Relocate</Label>
          <Switch checked={watch("openToRelocate")} onCheckedChange={(c) => setValue("openToRelocate", c)} />
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step2Address;
