import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  fetchBoards,
  fetchInstitutions,
  fetchDegrees,
  fetchCourses,
  addBoard,
  addInstitution,
  addCourse,
  type Board,
  type Institution,
  type Degree,
  type Course,
} from "@/services/masterDataService";
import { Plus, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const educationEntrySchema = z.object({
  educationLevel: z.enum(["10th", "12th", "Diploma", "UG", "PG", "PhD"], {
    required_error: "Please select education level",
  }),
  boardId: z.string().optional(),
  institutionId: z.string().optional(),
  degreeId: z.string().optional(),
  courseId: z.string().optional(),
  passingYear: z.string().min(1, "Please select passing year"),
  percentage: z.string().optional(),
  medium: z.enum(["english", "hindi", "other"]).optional(),
  stream: z.enum(["science", "commerce", "arts"]).optional(),
  isHighest: z.boolean().default(false),
  // For "Other" options
  otherBoardName: z.string().optional(),
  otherInstitutionName: z.string().optional(),
  otherCourseName: z.string().optional(),
});

type EducationEntry = z.infer<typeof educationEntrySchema>;

const step3Schema = z.object({
  entries: z.array(educationEntrySchema).min(1, "Please add at least one education entry"),
});

type Step3FormData = z.infer<typeof step3Schema>;

const Step3Education = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [entries, setEntries] = useState<EducationEntry[]>([
    {
      educationLevel: "10th",
      passingYear: "",
      isHighest: false,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState<string | null>(null);

  // Get city/state from step 2
  const [cityId, setCityId] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");

  useEffect(() => {
    const step2Data = localStorage.getItem("applicant_step2");
    if (step2Data) {
      const data = JSON.parse(step2Data);
      setCityId(data.cityId || "");
      setStateId(data.stateId || "");
    }
  }, []);

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      setLoading(true);
      const [boardsData, degreesData] = await Promise.all([
        fetchBoards(),
        fetchDegrees(),
      ]);
      setBoards(boardsData);
      setDegrees(degreesData);
      setLoading(false);
    };
    loadMasterData();
  }, []);

  // Load institutions when city/state changes
  useEffect(() => {
    if (cityId || stateId) {
      fetchInstitutions(cityId || undefined, stateId || undefined).then(setInstitutions);
    }
  }, [cityId, stateId]);

  // Load courses when degree changes in any entry
  const loadCoursesForDegree = async (degreeId: string) => {
    const coursesData = await fetchCourses(degreeId);
    setCourses(coursesData);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        educationLevel: "10th",
        passingYear: "",
        isHighest: false,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    if (entries.length === 1) {
      toast({
        title: "Cannot Remove",
        description: "At least one education entry is required",
        variant: "destructive",
      });
      return;
    }
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof EducationEntry, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    
    // Reset dependent fields when education level changes
    if (field === "educationLevel") {
      updated[index].boardId = "";
      updated[index].institutionId = "";
      updated[index].degreeId = "";
      updated[index].courseId = "";
      updated[index].otherBoardName = "";
      updated[index].otherInstitutionName = "";
      updated[index].otherCourseName = "";
    }
    
    // If isHighest is set to true, ensure only one entry has isHighest = true
    if (field === "isHighest" && value === true) {
      // Set all other entries to false
      updated.forEach((entry, i) => {
        if (i !== index) {
          entry.isHighest = false;
        }
      });
    }
    
    // Load courses when degree changes
    if (field === "degreeId" && value) {
      loadCoursesForDegree(value);
    }
    
    setEntries(updated);
  };

  const handleAddNew = async (
    type: "board" | "institution" | "course",
    index: number,
    name: string
  ) => {
    if (!name) {
      toast({
        title: "Name Required",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    setAddingNew(`${type}-${index}`);
    let result;

    if (type === "board") {
      result = await addBoard(name);
      if (result.success && result.boardId) {
        const updatedBoards = await fetchBoards();
        setBoards(updatedBoards);
        updateEntry(index, "boardId", result.boardId);
        toast({
          title: "Board Added",
          description: "Board will be reviewed by admin",
        });
      }
    } else if (type === "institution") {
      // Get districtId from step2 data if available
      const step2Data = JSON.parse(localStorage.getItem("applicant_step2") || "{}");
      const districtId = step2Data.districtId || undefined;
      
      // Determine institution type based on education level
      let institutionType = "college"; // default
      const entry = entries[index];
      if (entry.educationLevel === "10th" || entry.educationLevel === "12th") {
        institutionType = "school";
      } else if (entry.educationLevel === "UG" || entry.educationLevel === "PG") {
        institutionType = "college";
      }
      
      result = await addInstitution(
        name,
        institutionType,
        stateId || undefined,
        districtId,
        cityId || undefined,
        undefined, // universityId - not available in current form
        undefined  // address - not available in current form
      );
      if (result.success && result.institutionId) {
        const updatedInstitutions = await fetchInstitutions(cityId || undefined, stateId || undefined);
        setInstitutions(updatedInstitutions);
        updateEntry(index, "institutionId", result.institutionId);
        toast({
          title: "Institution Added",
          description: "Institution will be reviewed by admin",
        });
      }
    } else if (type === "course") {
      const entry = entries[index];
      result = await addCourse(
        name,
        entry.degreeId || undefined,
        undefined // category - not available in current form, can be added later
      );
      if (result.success && result.courseId) {
        const updatedCourses = await fetchCourses(entry.degreeId || undefined);
        setCourses(updatedCourses);
        updateEntry(index, "courseId", result.courseId);
        toast({
          title: "Course Added",
          description: "Course will be reviewed by admin",
        });
      }
    }

    if (result && !result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to add",
        variant: "destructive",
      });
    }

    setAddingNew(null);
  };

  const onSubmit = () => {
    // Validate at least one entry has isHighest = true
    const hasHighest = entries.some((e) => e.isHighest);
    if (!hasHighest && entries.length > 0) {
      toast({
        title: "Highest Qualification Required",
        description: "Please mark at least one education as highest",
        variant: "destructive",
      });
      return;
    }

    // Validate only one entry has isHighest = true (frontend validation)
    const highestCount = entries.filter((e) => e.isHighest).length;
    if (highestCount > 1) {
      toast({
        title: "Multiple Highest Qualifications",
        description: "Only one education entry can be marked as highest qualification",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("applicant_step3", JSON.stringify({ entries }));
    navigate("/auth/applicant-register/step-4");
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-2");
  };

  const handleSaveLater = () => {
    localStorage.setItem("applicant_step3_draft", JSON.stringify({ entries }));
    toast({
      title: "Progress Saved",
      description: "Your progress has been saved. You can continue later.",
    });
    navigate("/");
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <RegistrationLayout
      currentStep={3}
      totalSteps={7}
      stepTitle="Education Details"
      stepSubtitle="Add your educational qualifications"
      onNext={onSubmit}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
    >
      <div className="space-y-6">
        {entries.map((entry, index) => {
          const isSchoolLevel = entry.educationLevel === "10th" || entry.educationLevel === "12th";
          const isGraduationLevel = entry.educationLevel === "UG" || entry.educationLevel === "PG";
          const showOtherBoard = entry.boardId === "other";
          const showOtherInstitution = entry.institutionId === "other";
          const showOtherCourse = entry.courseId === "other";

          return (
            <div key={index} className="p-6 border rounded-lg space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Education Entry {index + 1}</h3>
                {entries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <Label>
                  Education Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={entry.educationLevel}
                  onValueChange={(value) => updateEntry(index, "educationLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">10th</SelectItem>
                    <SelectItem value="12th">12th</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="UG">Undergraduate</SelectItem>
                    <SelectItem value="PG">Postgraduate</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* School Level Fields */}
              {isSchoolLevel && (
                <>
                  <div className="space-y-2">
                    <Label>Board {entry.educationLevel === "10th" && <span className="text-destructive">*</span>}</Label>
                    {!showOtherBoard ? (
                      <Select
                        value={entry.boardId || ""}
                        onValueChange={(value) => {
                          if (value === "other") {
                            updateEntry(index, "boardId", "other");
                          } else {
                            updateEntry(index, "boardId", value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select board" />
                        </SelectTrigger>
                        <SelectContent>
                          {boards.map((board) => (
                            <SelectItem key={board.id} value={board.id}>
                              {board.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Add New)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter board name"
                          value={entry.otherBoardName || ""}
                          onChange={(e) => updateEntry(index, "otherBoardName", e.target.value)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleAddNew("board", index, entry.otherBoardName || "")}
                          disabled={addingNew === `board-${index}`}
                        >
                          {addingNew === `board-${index}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {entry.educationLevel === "12th" && (
                    <div className="space-y-2">
                      <Label>Stream</Label>
                      <Select
                        value={entry.stream || ""}
                        onValueChange={(value) => updateEntry(index, "stream", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="commerce">Commerce</SelectItem>
                          <SelectItem value="arts">Arts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Medium</Label>
                    <Select
                      value={entry.medium || ""}
                      onValueChange={(value) => updateEntry(index, "medium", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Graduation Level Fields */}
              {isGraduationLevel && (
                <>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Select
                      value={entry.degreeId || ""}
                      onValueChange={(value) => updateEntry(index, "degreeId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degrees.map((degree) => (
                          <SelectItem key={degree.id} value={degree.id}>
                            {degree.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {entry.degreeId && (
                    <div className="space-y-2">
                      <Label>Course</Label>
                      {!showOtherCourse ? (
                        <Select
                          value={entry.courseId || ""}
                          onValueChange={(value) => {
                            if (value === "other") {
                              updateEntry(index, "courseId", "other");
                            } else {
                              updateEntry(index, "courseId", value);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other (Add New)</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter course name"
                            value={entry.otherCourseName || ""}
                            onChange={(e) => updateEntry(index, "otherCourseName", e.target.value)}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAddNew("course", index, entry.otherCourseName || "")}
                            disabled={addingNew === `course-${index}`}
                          >
                            {addingNew === `course-${index}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Add"
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Institution</Label>
                    {!showOtherInstitution ? (
                      <Select
                        value={entry.institutionId || ""}
                        onValueChange={(value) => {
                          if (value === "other") {
                            updateEntry(index, "institutionId", "other");
                          } else {
                            updateEntry(index, "institutionId", value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select institution" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                              {inst.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (Add New)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter institution name"
                          value={entry.otherInstitutionName || ""}
                          onChange={(e) => updateEntry(index, "otherInstitutionName", e.target.value)}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleAddNew("institution", index, entry.otherInstitutionName || "")}
                          disabled={addingNew === `institution-${index}`}
                        >
                          {addingNew === `institution-${index}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Passing Year <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={entry.passingYear}
                    onValueChange={(value) => updateEntry(index, "passingYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Percentage/CGPA</Label>
                  <Input
                    placeholder="e.g., 85% or 8.5"
                    value={entry.percentage || ""}
                    onChange={(e) => updateEntry(index, "percentage", e.target.value)}
                  />
                </div>
              </div>

              {/* Is Highest */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`isHighest-${index}`}
                  checked={entry.isHighest}
                  onChange={(e) => updateEntry(index, "isHighest", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`isHighest-${index}`} className="cursor-pointer">
                  Mark as highest qualification
                </Label>
              </div>
            </div>
          );
        })}

        <Button type="button" variant="outline" onClick={addEntry} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education Entry
        </Button>
      </div>
    </RegistrationLayout>
  );
};

export default Step3Education;

