import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Eye, Clock, Sparkles, FileWarning, Loader2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { uploadApplicantResume } from "@/lib/applicantMediaUpload";
import { openResumePreview, triggerResumeDownload } from "@/lib/resumePreview";
import { toast } from "sonner";
import { deleteApplicantResume } from "@/services/applicantProfileMutations";

interface ResumeSectionProps {
  applicant: any;
  viewMode: 'applicant' | 'admin' | 'client';
  onUpdateHeadline?: (headline: string) => void | Promise<void>;
  onResumeUploaded?: (url: string) => void;
  /** Called after resume is removed from DB so parent can refetch. */
  onResumeRemoved?: () => void;
}

const isValidUrl = (str: string) => {
  if (!str) return false;
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('blob:');
};

const ResumeSection = ({ applicant, viewMode, onUpdateHeadline, onResumeUploaded, onResumeRemoved }: ResumeSectionProps) => {
  const hasResume = isValidUrl(applicant.resumeUrl);
  const hasSkills = applicant.skills && applicant.skills.length > 0 && applicant.skills[0] !== 'N/A';
  const resumeFormatOnly = applicant.resumeUrl && !isValidUrl(applicant.resumeUrl);

  const defaultHeadline = hasSkills
    ? `${applicant.designation && applicant.designation !== 'N/A' ? applicant.designation : applicant.primarySkill || 'Professional'}${applicant.experience ? ` with ${applicant.experience}+ years of experience` : ''}${hasSkills ? ` in ${applicant.skills.slice(0, 3).join(', ')}` : ''}.`
    : '';

  const [headline, setHeadline] = useState(() => (applicant.resumeHeadline?.trim() ? applicant.resumeHeadline : defaultHeadline));
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingResume, setRemovingResume] = useState(false);
  const [openingPreview, setOpeningPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxHeadlineLength = 250;

  useEffect(() => {
    if (isEditingHeadline) return;
    const fromProfile = applicant.resumeHeadline?.trim();
    setHeadline(fromProfile || defaultHeadline);
  }, [applicant.resumeHeadline, applicant.id, defaultHeadline, isEditingHeadline]);

  const resumeDate = applicant.resumeUpdated && applicant.resumeUpdated !== 'N/A'
    ? new Date(applicant.resumeUpdated).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  const canUploadResume = viewMode === 'applicant' || viewMode === 'admin';
  const maxBytes = viewMode === 'admin' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    if (file.size > maxBytes) {
      toast.error(viewMode === 'admin' ? 'File size must be less than 15MB' : 'File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload a resume');
        return;
      }

      const publicUrl = await uploadApplicantResume(file, {
        applicantId: applicant.id,
        authUserId: applicant.userId || user.id,
      });

      const { error: updateError } = await supabase
        .from('applicants')
        .update({ resume_file: publicUrl, upload_cv_any_format: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', applicant.id);

      if (updateError) {
        console.error('DB update error:', updateError);
        toast.error('Resume uploaded but failed to link to profile');
        return;
      }

      if (applicant.userId) {
        await supabase
          .from('profiles')
          .update({ resume_file: publicUrl, updated_at: new Date().toISOString() })
          .eq('id', applicant.userId);
      }

      toast.success(viewMode === 'admin' ? 'Resume uploaded for this applicant' : 'Resume uploaded successfully!');
      onResumeUploaded?.(publicUrl);
    } catch (err) {
      console.error('Error uploading:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred while uploading');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePreviewResume = async () => {
    if (!applicant.resumeUrl) return;
    setOpeningPreview(true);
    try {
      await openResumePreview(applicant.resumeUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not open resume');
    } finally {
      setOpeningPreview(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!applicant.resumeUrl) return;
    setDownloading(true);
    try {
      await triggerResumeDownload(
        applicant.resumeUrl,
        `${applicant.name?.replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not download resume');
    } finally {
      setDownloading(false);
    }
  };

  const handleRemoveResume = async () => {
    if (!hasResume || !applicant.id) return;
    if (!window.confirm('Remove this resume from your profile? You can upload a new file later.')) return;
    setRemovingResume(true);
    try {
      const { error } = await deleteApplicantResume(applicant.id, applicant.userId ?? null);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Resume removed');
      onResumeRemoved?.();
    } finally {
      setRemovingResume(false);
    }
  };

  return (
    <div className="space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Resume Headline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Resume Headline
          </h4>
          <Badge variant="outline" className="text-[10px] font-normal">
            First thing recruiters see
          </Badge>
        </div>

        {isEditingHeadline && viewMode !== 'client' ? (
          <div className="space-y-2">
            <Textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value.slice(0, maxHeadlineLength))}
              rows={3}
              placeholder="Write a compelling headline that summarizes your experience and skills..."
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <span className={`text-[11px] ${headline.length >= maxHeadlineLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                {headline.length}/{maxHeadlineLength}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditingHeadline(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={async () => {
                    try {
                      await onUpdateHeadline?.(headline);
                      setIsEditingHeadline(false);
                    } catch {
                      /* parent shows toast */
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
            onClick={() => viewMode !== 'client' && setIsEditingHeadline(true)}
          >
            {headline ? (
              <p className="text-sm leading-relaxed">{headline}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Click to add a resume headline...</p>
            )}
          </div>
        )}
      </div>

      {/* Resume File */}
      {hasResume ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{applicant.name?.replace(/\s+/g, "_")}_Resume.pdf</p>
                  {resumeDate && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      Updated: {resumeDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                {canUploadResume && (
                  <Button
                    variant="outline" size="sm" className="h-8 text-xs"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
                    {viewMode === 'admin' ? 'Replace (admin)' : 'Replace'}
                  </Button>
                )}
                <Button
                  variant="outline" size="sm" className="h-8 text-xs"
                  disabled={openingPreview}
                  onClick={handlePreviewResume}
                >
                  {openingPreview ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Eye className="h-3.5 w-3.5 mr-1.5" />}
                  Preview
                </Button>
                <Button
                  size="sm" className="h-8 text-xs"
                  disabled={downloading}
                  onClick={handleDownloadResume}
                >
                  {downloading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
                  Download
                </Button>
                {canUploadResume && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={removingResume}
                    onClick={() => void handleRemoveResume()}
                  >
                    {removingResume ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-6 text-center">
          <FileWarning className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            {resumeFormatOnly ? `Resume was submitted in ${applicant.resumeUrl} format (file not available for download)` : 'No resume uploaded yet'}
          </p>
          {canUploadResume && (
            <Button
              variant="outline" size="sm" className="mt-3 h-8 text-xs"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1.5" />}
              {viewMode === 'admin' ? 'Upload resume (admin)' : 'Upload Resume'}
            </Button>
          )}
          <p className="text-[10px] text-muted-foreground mt-2">
            Accepted: PDF, DOC, DOCX (max {viewMode === 'admin' ? '15' : '5'}MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeSection;
