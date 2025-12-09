import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const step3Schema = z.object({
  workExperience: z.enum(["fresher", "experienced"], {
    required_error: "Please select work experience type",
  }),
  totalExperience: z.string().optional(),
  currentCompany: z.string().trim().max(200).optional(),
  currentDesignation: z.string().trim().max(200).optional(),
  currentCTC: z.string().trim().max(50).optional(),
  expectedCTC: z.string().trim().max(50).optional(),
});

type Step3FormData = z.infer<typeof step3Schema>;

const Step3Professional = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [keySkills, setKeySkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
  });

  const workExperience = watch("workExperience");

  const suggestedSkills = [
    "Communication",
    "Excel",
    "CRM",
    "Word",
    "English Speaking",
    "Data Entry",
    "Telecalling",
    "Team Handling",
    "MS Office",
    "Customer Service",
  ];

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !keySkills.includes(trimmedSkill)) {
      setKeySkills([...keySkills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setKeySkills(keySkills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = (data: Step3FormData) => {
    if (keySkills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please add at least one key skill",
        variant: "destructive",
      });
      return;
    }

    const formDataWithSkills = {
      ...data,
      keySkills,
    };

    localStorage.setItem("applicant_step3", JSON.stringify(formDataWithSkills));
    navigate("/auth/applicant-register/step-4");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-2");
  };

  const handleSaveLater = () => {
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  return (
    <RegistrationLayout
      currentStep={3}
      totalSteps={4}
      stepTitle="Professional Details"
      stepSubtitle="Help us understand your work experience"
      onNext={handleSubmit(onSubmit)}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <form className="space-y-6">
        {/* Work Experience */}
        <div className="space-y-3">
          <Label>
            Work Experience <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            onValueChange={(value) => setValue("workExperience", value as any)}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "fresher", label: "Fresher" },
              { value: "experienced", label: "Experienced" },
            ].map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.value}
                  className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.workExperience && (
            <p className="text-sm text-destructive">{errors.workExperience.message}</p>
          )}
        </div>

        {/* Conditional Fields for Experienced */}
        {workExperience === "experienced" && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Total Experience */}
              <div className="space-y-2">
                <Label htmlFor="totalExperience">
                  Total Experience <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("totalExperience", value)}>
                  <SelectTrigger id="totalExperience">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="0-6-months">0-6 months</SelectItem>
                    <SelectItem value="6-12-months">6-12 months</SelectItem>
                    <SelectItem value="1-2-years">1-2 years</SelectItem>
                    <SelectItem value="2-5-years">2-5 years</SelectItem>
                    <SelectItem value="5+-years">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Company */}
              <div className="space-y-2">
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input
                  id="currentCompany"
                  placeholder="e.g., ABC Corporation"
                  {...register("currentCompany")}
                />
              </div>

              {/* Current Designation */}
              <div className="space-y-2">
                <Label htmlFor="currentDesignation">Current Designation</Label>
                <Input
                  id="currentDesignation"
                  placeholder="e.g., Sales Executive"
                  {...register("currentDesignation")}
                />
              </div>

              {/* Current CTC */}
              <div className="space-y-2">
                <Label htmlFor="currentCTC">Current CTC</Label>
                <Input
                  id="currentCTC"
                  placeholder="e.g., ₹3.5 LPA or ₹25,000/month"
                  {...register("currentCTC")}
                />
              </div>

              {/* Expected CTC */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expectedCTC">Expected CTC</Label>
                <Input
                  id="expectedCTC"
                  placeholder="e.g., ₹5 LPA or ₹35,000/month"
                  {...register("expectedCTC")}
                />
              </div>
            </div>
          </>
        )}

        {/* Key Skills */}
        <div className="space-y-3">
          <Label>
            Key Skills <span className="text-destructive">*</span>
          </Label>

          {/* Skill Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill(skillInput)}
            >
              Add
            </Button>
          </div>

          {/* Suggested Skills */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Suggested Skills:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Added Skills */}
          {keySkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Skills:</p>
              <div className="flex flex-wrap gap-2">
                {keySkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step3Professional;
