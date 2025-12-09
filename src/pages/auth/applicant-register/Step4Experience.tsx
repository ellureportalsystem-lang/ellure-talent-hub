import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import { fetchCities, type City } from "@/services/masterDataService";

interface ExperienceEntry {
  companyName: string;
  designation: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  cityId: string;
}

const Step4Experience = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [stateId, setStateId] = useState<string>("");

  useEffect(() => {
    const step2Data = localStorage.getItem("applicant_step2");
    if (step2Data) {
      const data = JSON.parse(step2Data);
      setStateId(data.stateId || "");
    }
  }, []);

  useEffect(() => {
    if (stateId) {
      fetchCities(stateId).then(setCities);
    }
  }, [stateId]);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        companyName: "",
        designation: "",
        employmentType: "full-time",
        startDate: "",
        endDate: "",
        isCurrent: false,
        currentCtc: "",
        expectedCtc: "",
        noticePeriod: "",
        cityId: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof ExperienceEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    
    // If isCurrent is true, clear endDate
    if (field === "isCurrent" && value === true) {
      updated[index].endDate = "";
    }
    
    setEntries(updated);
  };

  const onSubmit = () => {
    // Validate entries
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry.companyName || !entry.designation || !entry.startDate) {
        toast({
          title: "Incomplete Entry",
          description: `Please fill all required fields in experience entry ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
      if (!entry.isCurrent && !entry.endDate) {
        toast({
          title: "End Date Required",
          description: `Please provide end date for experience entry ${i + 1}`,
          variant: "destructive",
        });
        return;
      }
      
      // Validate dates: start_date < end_date
      if (!entry.isCurrent && entry.startDate && entry.endDate) {
        const startDate = new Date(entry.startDate);
        const endDate = new Date(entry.endDate);
        if (startDate >= endDate) {
          toast({
            title: "Invalid Date Range",
            description: `Start date must be before end date in experience entry ${i + 1}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    localStorage.setItem("applicant_step4", JSON.stringify({ entries }));
    navigate("/auth/applicant-register/step-5");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-3");
  };

  const handleSaveLater = () => {
    localStorage.setItem("applicant_step4_draft", JSON.stringify({ entries }));
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  const handleSkip = () => {
    localStorage.setItem("applicant_step4", JSON.stringify({ entries: [] }));
    navigate("/auth/applicant-register/step-5");
  };

  return (
    <RegistrationLayout
      currentStep={4}
      totalSteps={7}
      stepTitle="Work Experience"
      stepSubtitle="Add your work experience (optional)"
      onNext={onSubmit}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <div className="space-y-6">
        {entries.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No experience entries yet</p>
            <div className="flex gap-2 justify-center">
              <Button type="button" onClick={addEntry}>
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
              <Button type="button" variant="outline" onClick={handleSkip}>
                Skip (Fresher)
              </Button>
            </div>
          </div>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="p-6 border rounded-lg space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Experience Entry {index + 1}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEntry(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter company name"
                  value={entry.companyName}
                  onChange={(e) => updateEntry(index, "companyName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Designation <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter designation"
                  value={entry.designation}
                  onChange={(e) => updateEntry(index, "designation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={entry.employmentType}
                  onValueChange={(value) => updateEntry(index, "employmentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select
                  value={entry.cityId}
                  onValueChange={(value) => updateEntry(index, "cityId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={entry.startDate}
                  onChange={(e) => updateEntry(index, "startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date {!entry.isCurrent && <span className="text-destructive">*</span>}</Label>
                <Input
                  type="date"
                  value={entry.endDate}
                  onChange={(e) => updateEntry(index, "endDate", e.target.value)}
                  disabled={entry.isCurrent}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  type="checkbox"
                  id={`isCurrent-${index}`}
                  checked={entry.isCurrent}
                  onChange={(e) => updateEntry(index, "isCurrent", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`isCurrent-${index}`} className="cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Current CTC</Label>
                <Input
                  placeholder="e.g., ₹3.5 LPA"
                  value={entry.currentCtc}
                  onChange={(e) => updateEntry(index, "currentCtc", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Expected CTC</Label>
                <Input
                  placeholder="e.g., ₹5 LPA"
                  value={entry.expectedCtc}
                  onChange={(e) => updateEntry(index, "expectedCtc", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Notice Period</Label>
                <Select
                  value={entry.noticePeriod}
                  onValueChange={(value) => updateEntry(index, "noticePeriod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="15-days">15 Days</SelectItem>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="45-days">45 Days</SelectItem>
                    <SelectItem value="60-days">60 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        {entries.length > 0 && (
          <Button type="button" variant="outline" onClick={addEntry} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Experience Entry
          </Button>
        )}
      </div>
    </RegistrationLayout>
  );
};

export default Step4Experience;

