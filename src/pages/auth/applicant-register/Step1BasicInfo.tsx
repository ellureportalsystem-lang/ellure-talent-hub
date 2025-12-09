import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Loader2 } from "lucide-react";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const step1Schema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit mobile number"),
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Enter valid email address")
    .max(255)
    .transform((val) => val.trim().toLowerCase()), // Always lowercase and trim
  dob: z.string().min(1, "Please select date of birth"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select gender",
  }),
  jobRole: z.string().min(1, "Please select a job role"),
  communicationSkill: z.enum(["good", "okay", "average", "poor"], {
    required_error: "Please select communication skill level",
  }),
});

type Step1FormData = z.infer<typeof step1Schema>;

const Step1BasicInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      communicationSkill: undefined,
      jobRole: "",
      gender: undefined,
      dob: "",
    },
  });

  // TEMPORARY: Check for demo mode
  const isDemoMode = sessionStorage.getItem('demo_registration') === 'true';

  // Check authentication on mount (skip in demo mode)
  useEffect(() => {
    if (isDemoMode) {
      // Skip auth check in demo mode
      return;
    }
    
    if (!authLoading && !user) {
      // User not authenticated, redirect to account creation
      toast({
        title: "Authentication Required",
        description: "Please create an account first to continue registration",
      });
      navigate("/auth/register");
    }
  }, [user, authLoading, navigate, toast, isDemoMode]);

  // Show loading while checking auth (skip in demo mode)
  if (!isDemoMode && authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render form (will redirect) - skip in demo mode
  if (!isDemoMode && !user) {
    return null;
  }

  const onSubmit = (data: Step1FormData) => {
    // Ensure email is lowercase and trimmed
    const normalizedData = {
      ...data,
      email: data.email.trim().toLowerCase(),
      mobileNumber: data.mobileNumber.trim(),
    };
    
    // Save to localStorage for multi-step form
    localStorage.setItem("applicant_step1", JSON.stringify(normalizedData));
    navigate("/auth/applicant-register/step-2");
  };

  const handleSaveLater = () => {
    const data = watch();
    localStorage.setItem("applicant_step1_draft", JSON.stringify(data));
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  return (
    <RegistrationLayout
      currentStep={1}
      totalSteps={7}
      stepTitle="Personal Details"
      stepSubtitle="Tell us about yourself"
      onNext={handleSubmit(onSubmit)}
      onSaveLater={handleSaveLater}
      showPrevious={false}
    >
      <form className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">
              +91
            </span>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              className="rounded-l-none"
              maxLength={10}
              {...register("mobileNumber")}
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dob"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            {...register("dob")}
          />
          {errors.dob && (
            <p className="text-sm text-destructive">{errors.dob.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label>
            Gender <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            onValueChange={(value) =>
              setValue("gender", value as any)
            }
            className="grid grid-cols-3 gap-4"
          >
            {[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
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
          {errors.gender && (
            <p className="text-sm text-destructive">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Job Role */}
        <div className="space-y-2">
          <Label htmlFor="jobRole">
            Skill / Job Role Applying For <span className="text-destructive">*</span>
          </Label>
          <Select
            onValueChange={(value) => setValue("jobRole", value)}
            defaultValue=""
          >
            <SelectTrigger id="jobRole">
              <SelectValue placeholder="Select job role" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="telecaller">Telecaller</SelectItem>
              <SelectItem value="data-entry">Data Entry Operator</SelectItem>
              <SelectItem value="sales-executive">Sales Executive</SelectItem>
              <SelectItem value="back-office">Back Office</SelectItem>
              <SelectItem value="hr-trainee">HR Trainee</SelectItem>
              <SelectItem value="admin-executive">Admin Executive</SelectItem>
              <SelectItem value="graphic-designer">Graphic Designer</SelectItem>
              <SelectItem value="customer-support">Customer Support</SelectItem>
            </SelectContent>
          </Select>
          {errors.jobRole && (
            <p className="text-sm text-destructive">{errors.jobRole.message}</p>
          )}
        </div>

        {/* Communication Skill */}
        <div className="space-y-3">
          <Label>
            Communication Skill Rating <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            onValueChange={(value) =>
              setValue("communicationSkill", value as any)
            }
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "good", label: "Good" },
              { value: "okay", label: "Okay" },
              { value: "average", label: "Average" },
              { value: "poor", label: "Poor" },
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
          {errors.communicationSkill && (
            <p className="text-sm text-destructive">
              {errors.communicationSkill.message}
            </p>
          )}
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step1BasicInfo;
