import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Info } from "lucide-react";
import collegesData from "@/data/collegesByCity.json";

// Dynamic schema based on qualification
const createStep2Schema = (qualification: string) => {
  const baseSchema = {
    highestQualification: z.string().min(1, "Please select qualification"),
    yearOfPassing: z.string().min(1, "Please select year of passing"),
  };

  if (qualification === "10th" || qualification === "12th") {
    return z.object({
      ...baseSchema,
      educationBoard: z.string().min(1, "Please select education board"),
      mediumOfStudy: z.string().min(1, "Please select medium"),
      stream: qualification === "12th" ? z.string().min(1, "Please select stream") : z.string().optional(),
      percentageGrade: z.string().min(1, "Please select percentage/grade"),
    });
  } else if (qualification === "graduation" || qualification === "post-graduation" || qualification === "mba" || qualification === "mca" || qualification === "bca" || qualification === "bba") {
    return z.object({
      ...baseSchema,
      courseDegreeName: z.string().trim().min(2, "Course/Degree name is required").max(200),
      universityInstitute: z.string().min(1, "Please select or enter university/institute"),
      cgpaSgpa: z.enum(["cgpa", "sgpa"], { required_error: "Please select CGPA or SGPA" }),
      cgpaSgpaValue: z.string().regex(/^[0-9]+\.?[0-9]*$/, "Enter valid CGPA/SGPA (e.g., 8.5)").min(1, "CGPA/SGPA is required"),
    });
  } else if (qualification === "diploma") {
    return z.object({
      ...baseSchema,
      courseDegreeName: z.string().trim().min(2, "Course name is required").max(200),
      universityInstitute: z.string().min(1, "Please select or enter institute"),
      percentageGrade: z.string().min(1, "Please select percentage/grade"),
    });
  } else {
    // Below 10th, PhD - minimal fields
    return z.object({
      ...baseSchema,
      educationBoard: z.string().optional(),
      mediumOfStudy: z.string().optional(),
      percentageGrade: z.string().optional(),
    });
  }
};

type Step2FormData = {
  highestQualification: string;
  educationBoard?: string;
  mediumOfStudy?: string;
  stream?: string;
  courseDegreeName?: string;
  universityInstitute?: string;
  percentageGrade?: string;
  cgpaSgpa?: "cgpa" | "sgpa";
  cgpaSgpaValue?: string;
  yearOfPassing: string;
};

const Step2Education = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qualification, setQualification] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [collegeSearch, setCollegeSearch] = useState<string>("");
  const [showOtherCollege, setShowOtherCollege] = useState(false);
  const [cgpaSgpaType, setCgpaSgpaType] = useState<"cgpa" | "sgpa" | "">("");

  // Get city from step 1
  useEffect(() => {
    const step1Data = localStorage.getItem("applicant_step1");
    if (step1Data) {
      const data = JSON.parse(step1Data);
      setSelectedCity(data.city || "");
    }
  }, []);

  // Get available colleges for selected city
  const availableColleges = selectedCity && collegesData[selectedCity as keyof typeof collegesData]
    ? collegesData[selectedCity as keyof typeof collegesData]
    : [];

  const filteredColleges = availableColleges.filter((college) =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: qualification ? zodResolver(createStep2Schema(qualification) as any) : undefined,
  });

  const watchedQualification = watch("highestQualification");

  useEffect(() => {
    if (watchedQualification) {
      setQualification(watchedQualification);
    }
  }, [watchedQualification]);

  const onSubmit = (data: Step2FormData) => {
    localStorage.setItem("applicant_step2", JSON.stringify(data));
    navigate("/auth/applicant-register/step-3");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-1");
  };

  const handleSaveLater = () => {
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  const handleCollegeSelect = (value: string) => {
    if (value === "Other") {
      setShowOtherCollege(true);
      setValue("universityInstitute", "");
    } else {
      setShowOtherCollege(false);
      setValue("universityInstitute", value);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 26 }, (_, i) => currentYear - i);

  const isSchoolLevel = qualification === "10th" || qualification === "12th";
  const isGraduationLevel = qualification === "graduation" || qualification === "post-graduation" || qualification === "mba" || qualification === "mca" || qualification === "bca" || qualification === "bba";
  const isDiploma = qualification === "diploma";

  return (
    <RegistrationLayout
      currentStep={2}
      totalSteps={4}
      stepTitle="Education Details"
      stepSubtitle="These details help recruiters understand your educational background"
      onNext={handleSubmit(onSubmit)}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <div className="mb-6 p-4 bg-info/5 border border-info/20 rounded-lg flex gap-3">
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Provide accurate educational details as they will be verified during the hiring process.
        </p>
      </div>

      <form className="space-y-6">
        {/* Highest Qualification */}
        <div className="space-y-2">
          <Label htmlFor="highestQualification">
            Highest Qualification <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => {
            setValue("highestQualification", value);
            setQualification(value);
            // Reset dependent fields
            setValue("educationBoard", "");
            setValue("mediumOfStudy", "");
            setValue("stream", "");
            setValue("courseDegreeName", "");
            setValue("universityInstitute", "");
            setValue("percentageGrade", "");
            setValue("cgpaSgpa", undefined);
            setValue("cgpaSgpaValue", "");
            setShowOtherCollege(false);
            setCgpaSgpaType("");
          }}>
            <SelectTrigger id="highestQualification">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="below-10th">Below 10th</SelectItem>
              <SelectItem value="10th">10th</SelectItem>
              <SelectItem value="12th">12th</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="graduation">Graduation</SelectItem>
              <SelectItem value="post-graduation">Post-Graduation</SelectItem>
              <SelectItem value="mba">MBA</SelectItem>
              <SelectItem value="mca">MCA</SelectItem>
              <SelectItem value="bca">BCA</SelectItem>
              <SelectItem value="bba">BBA</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
            </SelectContent>
          </Select>
          {errors.highestQualification && (
            <p className="text-sm text-destructive">{errors.highestQualification.message}</p>
          )}
        </div>

        {/* School Level Fields (10th/12th) */}
        {isSchoolLevel && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Education Board */}
            <div className="space-y-2">
              <Label htmlFor="educationBoard">
                Education Board <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("educationBoard", value)}>
                <SelectTrigger id="educationBoard">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="cbse">CBSE</SelectItem>
                  <SelectItem value="icse">ICSE</SelectItem>
                  <SelectItem value="state-board">State Board</SelectItem>
                  <SelectItem value="ib">IB (International Baccalaureate)</SelectItem>
                  <SelectItem value="open-school">Open School</SelectItem>
                </SelectContent>
              </Select>
              {errors.educationBoard && (
                <p className="text-sm text-destructive">{errors.educationBoard.message}</p>
              )}
            </div>

            {/* Medium of Study */}
            <div className="space-y-2">
              <Label htmlFor="mediumOfStudy">
                Medium of Study <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("mediumOfStudy", value)}>
                <SelectTrigger id="mediumOfStudy">
                  <SelectValue placeholder="Select medium" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                  <SelectItem value="gujarati">Gujarati</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                  <SelectItem value="malayalam">Malayalam</SelectItem>
                </SelectContent>
              </Select>
              {errors.mediumOfStudy && (
                <p className="text-sm text-destructive">{errors.mediumOfStudy.message}</p>
              )}
            </div>

            {/* Stream (Only for 12th) */}
            {qualification === "12th" && (
              <div className="space-y-2">
                <Label htmlFor="stream">
                  Stream <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("stream", value)}>
                  <SelectTrigger id="stream">
                    <SelectValue placeholder="Select stream" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stream && (
                  <p className="text-sm text-destructive">{errors.stream.message}</p>
                )}
              </div>
            )}

            {/* Percentage/Grade */}
            <div className="space-y-2">
              <Label htmlFor="percentageGrade">
                Percentage / Grade <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("percentageGrade", value)}>
                <SelectTrigger id="percentageGrade">
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="90-100">90-100%</SelectItem>
                  <SelectItem value="85-89.9">85-89.9%</SelectItem>
                  <SelectItem value="80-84.9">80-84.9%</SelectItem>
                  <SelectItem value="75-79.9">75-79.9%</SelectItem>
                  <SelectItem value="70-74.9">70-74.9%</SelectItem>
                  <SelectItem value="65-69.9">65-69.9%</SelectItem>
                  <SelectItem value="60-64.9">60-64.9%</SelectItem>
                  <SelectItem value="55-59.9">55-59.9%</SelectItem>
                  <SelectItem value="50-54.9">50-54.9%</SelectItem>
                </SelectContent>
              </Select>
              {errors.percentageGrade && (
                <p className="text-sm text-destructive">{errors.percentageGrade.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Graduation Level Fields */}
        {isGraduationLevel && (
          <>
            {/* Course/Degree Name */}
            <div className="space-y-2">
              <Label htmlFor="courseDegreeName">
                Course / Degree Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="courseDegreeName"
                placeholder="e.g., Bachelor of Computer Applications, B.Com, B.E., M.Sc."
                {...register("courseDegreeName")}
              />
              {errors.courseDegreeName && (
                <p className="text-sm text-destructive">{errors.courseDegreeName.message}</p>
              )}
            </div>

            {/* University/College with Search */}
            <div className="space-y-2">
              <Label htmlFor="universityInstitute">
                University / College <span className="text-destructive">*</span>
              </Label>
              {selectedCity && availableColleges.length > 0 ? (
                <>
                  <Select onValueChange={handleCollegeSelect}>
                    <SelectTrigger id="universityInstitute">
                      <SelectValue placeholder="Search and select college" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-60">
                      {filteredColleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showOtherCollege && (
                    <Input
                      id="universityInstituteOther"
                      placeholder="Enter college/university name"
                      className="mt-2"
                      {...register("universityInstitute")}
                    />
                  )}
                </>
              ) : (
                <Input
                  id="universityInstitute"
                  placeholder="Enter university/college name"
                  {...register("universityInstitute")}
                />
              )}
              {errors.universityInstitute && (
                <p className="text-sm text-destructive">{errors.universityInstitute.message}</p>
              )}
            </div>

            {/* CGPA/SGPA Selection */}
            <div className="space-y-3">
              <Label>
                CGPA or SGPA <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                onValueChange={(value) => {
                  setCgpaSgpaType(value as "cgpa" | "sgpa");
                  setValue("cgpaSgpa", value as "cgpa" | "sgpa");
                }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="cgpa" id="cgpa" className="peer sr-only" />
                  <Label
                    htmlFor="cgpa"
                    className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    CGPA
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="sgpa" id="sgpa" className="peer sr-only" />
                  <Label
                    htmlFor="sgpa"
                    className="flex items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    SGPA
                  </Label>
                </div>
              </RadioGroup>
              {errors.cgpaSgpa && (
                <p className="text-sm text-destructive">{errors.cgpaSgpa.message}</p>
              )}
            </div>

            {/* CGPA/SGPA Value */}
            {cgpaSgpaType && (
              <div className="space-y-2">
                <Label htmlFor="cgpaSgpaValue">
                  {cgpaSgpaType.toUpperCase()} Value <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cgpaSgpaValue"
                  type="text"
                  placeholder={`Enter ${cgpaSgpaType.toUpperCase()} (e.g., 8.5)`}
                  {...register("cgpaSgpaValue")}
                />
                {errors.cgpaSgpaValue && (
                  <p className="text-sm text-destructive">{errors.cgpaSgpaValue.message}</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Diploma Fields */}
        {isDiploma && (
          <>
            <div className="space-y-2">
              <Label htmlFor="courseDegreeName">
                Course Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="courseDegreeName"
                placeholder="e.g., Diploma in IT, Diploma in Mechanical Engineering"
                {...register("courseDegreeName")}
              />
              {errors.courseDegreeName && (
                <p className="text-sm text-destructive">{errors.courseDegreeName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="universityInstitute">
                Institute Name <span className="text-destructive">*</span>
              </Label>
              {selectedCity && availableColleges.length > 0 ? (
                <>
                  <Select onValueChange={handleCollegeSelect}>
                    <SelectTrigger id="universityInstitute">
                      <SelectValue placeholder="Search and select institute" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-60">
                      {filteredColleges.map((college) => (
                        <SelectItem key={college} value={college}>
                          {college}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showOtherCollege && (
                    <Input
                      id="universityInstituteOther"
                      placeholder="Enter institute name"
                      className="mt-2"
                      {...register("universityInstitute")}
                    />
                  )}
                </>
              ) : (
                <Input
                  id="universityInstitute"
                  placeholder="Enter institute name"
                  {...register("universityInstitute")}
                />
              )}
              {errors.universityInstitute && (
                <p className="text-sm text-destructive">{errors.universityInstitute.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentageGrade">
                Percentage / Grade <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("percentageGrade", value)}>
                <SelectTrigger id="percentageGrade">
                  <SelectValue placeholder="Select percentage" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="90-100">90-100%</SelectItem>
                  <SelectItem value="85-89.9">85-89.9%</SelectItem>
                  <SelectItem value="80-84.9">80-84.9%</SelectItem>
                  <SelectItem value="75-79.9">75-79.9%</SelectItem>
                  <SelectItem value="70-74.9">70-74.9%</SelectItem>
                  <SelectItem value="65-69.9">65-69.9%</SelectItem>
                  <SelectItem value="60-64.9">60-64.9%</SelectItem>
                  <SelectItem value="55-59.9">55-59.9%</SelectItem>
                  <SelectItem value="50-54.9">50-54.9%</SelectItem>
                </SelectContent>
              </Select>
              {errors.percentageGrade && (
                <p className="text-sm text-destructive">{errors.percentageGrade.message}</p>
              )}
            </div>
          </>
        )}

        {/* Year of Passing (Always shown) */}
        <div className="space-y-2">
          <Label htmlFor="yearOfPassing">
            Year of Passing <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("yearOfPassing", value)}>
            <SelectTrigger id="yearOfPassing">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50 max-h-60">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.yearOfPassing && (
            <p className="text-sm text-destructive">{errors.yearOfPassing.message}</p>
          )}
        </div>
      </form>
    </RegistrationLayout>
  );
};

export default Step2Education;
