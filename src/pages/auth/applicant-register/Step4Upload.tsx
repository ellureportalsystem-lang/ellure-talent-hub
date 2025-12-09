import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RegistrationLayout from "@/components/registration/RegistrationLayout";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// No schema needed for Step 6 - just file uploads
type Step6FormData = {
  resumeFile?: File;
  profilePicture?: File;
};

const Step4Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // No form validation needed - just file uploads

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate MIME types before uploading
      const validMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-word.document.macroEnabled.12"
      ];
      
      // Also check file extension as fallback
      const validExtensions = [".pdf", ".doc", ".docx"];
      const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();
      
      if (!validMimeTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload PDF, DOC, or DOCX file only",
          variant: "destructive",
        });
        e.target.value = ""; // Clear input
        return;
      }

      // Enforce max file size (2MB) before uploading
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeBytes) {
        toast({
          title: "File Too Large",
          description: `Resume must be less than 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          variant: "destructive",
        });
        e.target.value = ""; // Clear input
        return;
      }

      setResumeFile(file);
      toast({
        title: "Resume Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate MIME types before uploading
      const validImageMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp"
      ];
      
      // Also check file extension as fallback
      const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const fileExtension = "." + file.name.split('.').pop()?.toLowerCase();
      
      if (!validImageMimeTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload JPG, PNG, GIF, or WEBP image file only",
          variant: "destructive",
        });
        e.target.value = ""; // Clear input
        return;
      }

      // Enforce max file size (2MB) before uploading
      const maxSizeBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeBytes) {
        toast({
          title: "File Too Large",
          description: `Image must be less than 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
          variant: "destructive",
        });
        e.target.value = ""; // Clear input
        return;
      }

      setProfilePicture(file);
      toast({
        title: "Profile Picture Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }
  };

  const uploadFile = async (file: File, type: 'resume' | 'profile'): Promise<string | null> => {
    try {
      if (!user?.id) {
        throw new Error('User ID is required for file upload');
      }

      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${type}_${timestamp}.${fileExt}`;
      // New folder structure: resumes/applicants/{user_id}/resume_timestamp.pdf
      const filePath = `applicants/${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const onSubmit = async () => {
    if (!resumeFile) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume to continue",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Upload files
      let uploadedResumeUrl = resumeUrl;
      let uploadedProfileUrl = profileImageUrl;

      if (resumeFile && !uploadedResumeUrl) {
        setUploadProgress(30);
        uploadedResumeUrl = await uploadFile(resumeFile, 'resume');
        if (!uploadedResumeUrl) {
          throw new Error("Failed to upload resume");
        }
        setResumeUrl(uploadedResumeUrl);
      }

      if (profilePicture && !uploadedProfileUrl) {
        setUploadProgress(60);
        uploadedProfileUrl = await uploadFile(profilePicture, 'profile');
        if (uploadedProfileUrl) {
          setProfileImageUrl(uploadedProfileUrl);
        }
      }

      setUploadProgress(80);

      // Save file URLs to localStorage for review step
      const fileData = {
        resumeFile: resumeFile ? {
          name: resumeFile.name,
          size: resumeFile.size,
          type: resumeFile.type,
          url: uploadedResumeUrl,
        } : null,
        profilePicture: profilePicture ? {
          name: profilePicture.name,
          size: profilePicture.size,
          type: profilePicture.type,
          url: uploadedProfileUrl,
        } : null,
      };
      
      localStorage.setItem("applicant_step6", JSON.stringify(fileData));
      setUploadProgress(100);

      // Navigate to review page
      navigate("/auth/applicant-register/step-7");
    } catch (error: any) {
      console.error("Error uploading files:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePrevious = () => {
    navigate("/auth/applicant-register/step-5");
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
      currentStep={6}
      totalSteps={7}
      stepTitle="Upload Documents"
      stepSubtitle="Upload your resume and profile picture"
      onNext={onSubmit}
      onPrevious={handlePrevious}
      onSaveLater={handleSaveLater}
      nextLabel="Continue to Review"
      isNextDisabled={isUploading}
    >
      <form className="space-y-6">
        {/* Resume Upload */}
        <div className="space-y-3">
          <Label>
            Upload Resume <span className="text-destructive">*</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            PDF, DOC, or DOCX format (Max 2MB)
          </p>

          {!resumeFile ? (
            <div className="relative">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              <label
                htmlFor="resume-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX (max 2MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              <FileText className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{resumeFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(resumeFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setResumeFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div className="space-y-3">
          <Label>Upload Profile Picture (Optional)</Label>
          <p className="text-sm text-muted-foreground">
            JPG, PNG format (Max 2MB)
          </p>

          {!profilePicture ? (
            <div className="relative">
              <input
                type="file"
                id="profile-picture-upload"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureUpload}
              />
              <label
                htmlFor="profile-picture-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">
                  Click to upload profile picture
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG (max 2MB)
                </p>
              </label>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
              <ImageIcon className="h-10 w-10 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{profilePicture.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(profilePicture.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProfilePicture(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Label>Uploading...</Label>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress}% complete
            </p>
          </div>
        )}

      </form>
    </RegistrationLayout>
  );
};

export default Step4Upload;
