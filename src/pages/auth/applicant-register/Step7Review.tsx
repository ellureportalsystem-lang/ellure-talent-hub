import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveApplicantPhase2 } from "@/services/applicantService";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Step7Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  useEffect(() => {
    // Load all form data from localStorage
    const step1 = JSON.parse(localStorage.getItem("applicant_step1") || "{}");
    const step2 = JSON.parse(localStorage.getItem("applicant_step2") || "{}");
    const step3 = JSON.parse(localStorage.getItem("applicant_step3") || "{}");
    const step4 = JSON.parse(localStorage.getItem("applicant_step4") || "{}");
    const step5 = JSON.parse(localStorage.getItem("applicant_step5") || "{}");
    const step6 = JSON.parse(localStorage.getItem("applicant_step6") || "{}");

    setFormData({
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
    });

    // Note: File objects can't be stored in localStorage
    // In a real implementation, you'd need to use IndexedDB or keep files in component state
    // For now, we'll handle file upload separately
  }, []);

  const handleSubmit = async () => {
    // TEMPORARY: Check for demo mode
    const isDemoMode = sessionStorage.getItem('demo_registration') === 'true';
    
    if (!isDemoMode && !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(10);

    try {
      // Prepare data for submission
      const submissionData = {
        personal: formData.step1,
        address: formData.step2,
        education: formData.step3,
        experience: formData.step4,
        skills: formData.step5,
        files: formData.step6,
      };

      setSubmitProgress(30);

      // TEMPORARY: Skip database save in demo mode
      if (isDemoMode) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitProgress(100);
        
        // Clear localStorage
        localStorage.removeItem("applicant_step1");
        localStorage.removeItem("applicant_step2");
        localStorage.removeItem("applicant_step3");
        localStorage.removeItem("applicant_step4");
        localStorage.removeItem("applicant_step5");
        localStorage.removeItem("applicant_step6");
        localStorage.removeItem("applicant_step1_draft");
        localStorage.removeItem("applicant_step2_draft");
        localStorage.removeItem("applicant_step3_draft");
        localStorage.removeItem("applicant_step4_draft");
        localStorage.removeItem("applicant_step5_draft");

        toast({
          title: "Form Submitted (Demo Mode)",
          description: "Your form has been submitted successfully! (No data saved to database)",
        });

        // Navigate to success page with demo flag
        navigate(`/auth/applicant-register/success?demo=true`);
        return;
      }

      // Save to database (files are already uploaded, URLs are in step6)
      const result = await saveApplicantPhase2(submissionData, user!.id);

      setSubmitProgress(80);

      if (!result.success) {
        throw new Error(result.error || "Failed to save application");
      }

      setSubmitProgress(100);

      // Clear localStorage
      localStorage.removeItem("applicant_step1");
      localStorage.removeItem("applicant_step2");
      localStorage.removeItem("applicant_step3");
      localStorage.removeItem("applicant_step4");
      localStorage.removeItem("applicant_step5");
      localStorage.removeItem("applicant_step6");
      localStorage.removeItem("applicant_step1_draft");
      localStorage.removeItem("applicant_step2_draft");
      localStorage.removeItem("applicant_step3_draft");
      localStorage.removeItem("applicant_step4_draft");
      localStorage.removeItem("applicant_step5_draft");

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      // Navigate to success page
      navigate(`/auth/applicant-register/success?applicantId=${result.applicantId}`);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-6");
  };

  const handleEdit = (step: number) => {
    navigate(`/auth/applicant-register/step-${step}`);
  };

  return (
    <RegistrationLayout
      currentStep={7}
      totalSteps={7}
      stepTitle="Review & Submit"
      stepSubtitle="Please review all your information before submitting"
      onNext={handleSubmit}
      onPrevious={handlePrevious}
      nextLabel={isSubmitting ? "Submitting..." : "Submit Application"}
      isNextDisabled={isSubmitting}
    >
      <div className="space-y-6">
        {isSubmitting && (
          <div className="space-y-2 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Submitting your application...</span>
              <span className="text-sm text-muted-foreground">{submitProgress}%</span>
            </div>
            <Progress value={submitProgress} className="h-2" />
          </div>
        )}

        {/* Personal Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(1)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Name:</strong> {formData.step1?.fullName}</div>
            <div><strong>Email:</strong> {formData.step1?.email}</div>
            <div><strong>Phone:</strong> {formData.step1?.mobileNumber}</div>
            <div><strong>DOB:</strong> {formData.step1?.dob}</div>
            <div><strong>Gender:</strong> {formData.step1?.gender}</div>
            <div><strong>Job Role:</strong> {formData.step1?.jobRole}</div>
            <div><strong>Communication:</strong> {formData.step1?.communicationSkill}</div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Address</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(2)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>State:</strong> {formData.step2?.stateId}</div>
            <div><strong>District:</strong> {formData.step2?.districtId || "N/A"}</div>
            <div><strong>City:</strong> {formData.step2?.cityId}</div>
            {formData.step2?.addressLine1 && (
              <div><strong>Address Line 1:</strong> {formData.step2.addressLine1}</div>
            )}
            {formData.step2?.addressLine2 && (
              <div><strong>Address Line 2:</strong> {formData.step2.addressLine2}</div>
            )}
            {formData.step2?.pincode && (
              <div><strong>Pincode:</strong> {formData.step2.pincode}</div>
            )}
            {formData.step2?.landmark && (
              <div><strong>Landmark:</strong> {formData.step2.landmark}</div>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education ({formData.step3?.entries?.length || 0} entries)</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(3)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.step3?.entries?.map((entry: any, index: number) => (
              <div key={index} className="p-3 border rounded text-sm">
                <div><strong>Level:</strong> {entry.educationLevel}</div>
                {entry.passingYear && <div><strong>Year:</strong> {entry.passingYear}</div>}
                {entry.percentage && <div><strong>Percentage:</strong> {entry.percentage}</div>}
                {entry.isHighest && <div className="text-primary font-medium">✓ Highest Qualification</div>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Experience ({formData.step4?.entries?.length || 0} entries)</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(4)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.step4?.entries?.length > 0 ? (
              formData.step4.entries.map((entry: any, index: number) => (
                <div key={index} className="p-3 border rounded text-sm">
                  <div><strong>Company:</strong> {entry.companyName}</div>
                  <div><strong>Designation:</strong> {entry.designation}</div>
                  <div><strong>Period:</strong> {entry.startDate} to {entry.isCurrent ? "Present" : entry.endDate}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No experience entries (Fresher)</div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skills ({formData.step5?.entries?.length || 0} entries)</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(5)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.step5?.entries?.map((entry: any, index: number) => (
              <div key={index} className="text-sm">
                <strong>{entry.skillName}</strong> - {entry.skillType} ({entry.skillLevel})
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => handleEdit(6)}>
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {formData.step6?.resumeFile ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Resume: {formData.step6.resumeFile.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <XCircle className="h-4 w-4" />
                <span>No resume uploaded</span>
              </div>
            )}
            {formData.step6?.profilePicture ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Profile Picture: {formData.step6.profilePicture.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>No profile picture uploaded</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            By submitting, you confirm that all information provided is accurate and complete.
          </p>
        </div>
      </div>
    </RegistrationLayout>
  );
};

export default Step7Review;

