import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit, Upload, Share2, Star, StarOff, FolderPlus, Download, Trash2,
  MapPin, Briefcase, Clock, MessageSquare, Phone, Mail, User, Camera, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  applicantProfileCardLg,
  applicantProfileCover,
  applicantProfileMuted,
} from "@/components/dashboard/applicant/applicantProfileStyles";
import { supabase } from "@/lib/supabase";
import { uploadApplicantProfileImage } from "@/lib/applicantMediaUpload";
import { applicantProfileTouchFields } from "@/lib/applicantProfileTimestamps";
import { displayCandidateName, maskCandidateName } from "@/lib/clientMasking";
import { formatApplicantStatusLabel, resolveExperienceYears } from "@/lib/applicantProfileUtils";
import { toast } from "sonner";

interface ProfileHeaderProps {
  applicant: any;
  viewMode: 'applicant' | 'admin' | 'client';
  profileCompletion: number;
  applicantProfileLayout?: 'view' | 'edit';
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNote?: () => void;
  onAddToFolder?: () => void;
  onShortlist?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  onProfileImageUploaded?: (url: string) => void;
  clientContactVisible?: boolean;
}

const ProfileHeader = ({
  applicant,
  viewMode,
  profileCompletion,
  onEdit,
  onDelete,
  onAddNote,
  onAddToFolder,
  onShortlist,
  onFavorite,
  isFavorite = false,
  onProfileImageUploaded,
  clientContactVisible = true,
  applicantProfileLayout = 'edit',
}: ProfileHeaderProps) => {
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }

    setUploadingPhoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in'); return; }

      const url = await uploadApplicantProfileImage(file, {
        applicantId: applicant.id,
        authUserId: applicant.userId || user.id,
      });

      await supabase.from('applicants').update({ profile_image: url, ...applicantProfileTouchFields() }).eq('id', applicant.id);
      if (applicant.userId) {
        await supabase
          .from('profiles')
          .update({ profile_image: url, updated_at: new Date().toISOString() })
          .eq('id', applicant.userId);
      }
      toast.success('Profile photo updated!');
      onProfileImageUploaded?.(url);
    } catch { toast.error('An error occurred'); } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const hasDesignation = applicant.designation && applicant.designation !== 'N/A';
  const experienceYears = resolveExperienceYears(
    {
      total_experience_years: applicant.experienceYears,
      total_experience: applicant.totalExperienceRaw,
      total_experience_numbers: applicant.totalExperienceNumbers,
    },
    applicant.experienceRows || []
  );
  const hasExperience = experienceYears > 0;
  const experienceLabel = hasExperience
    ? experienceYears === 1
      ? "1 year"
      : `${experienceYears} years`
    : null;
  const hasCity = applicant.currentCity && applicant.currentCity !== 'N/A';
  const hasNoticePeriod = applicant.noticePeriod && applicant.noticePeriod !== 'N/A';
  const headline = (applicant.resumeHeadline || "").trim();
  const statusLabel = formatApplicantStatusLabel(applicant.status);

  const isApplicant = viewMode === 'applicant';
  const isApplicantView = isApplicant && applicantProfileLayout === 'view';
  const showCompletionRing = !isApplicantView;
  const showStatusBadge = !isApplicantView && statusLabel && viewMode !== 'applicant';
  const headerName =
    viewMode === "client"
      ? (clientContactVisible ? applicant.name : maskCandidateName(applicant.name || "Candidate"))
      : applicant.name;

  return (
    <div className="relative">
      <div
        className={cn(
          isApplicant ? applicantProfileCover : "h-24 bg-gradient-to-r from-primary via-primary/80 to-primary/60",
          !isApplicant && "rounded-t-xl"
        )}
      />

      <div
        className={cn(
          isApplicant
            ? cn(applicantProfileCardLg, "border-t-0 px-4 pb-5 sm:px-6")
            : "bg-card rounded-b-xl shadow-lg border border-t-0 px-4 sm:px-6 pb-5"
        )}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`relative ${isApplicant ? "-mt-11" : "-mt-12"} flex-shrink-0`}>
            <div
              className="relative"
              onMouseEnter={() => setIsHoveringPhoto(true)}
              onMouseLeave={() => setIsHoveringPhoto(false)}
            >
              <Avatar className={`${isApplicant ? 'h-[88px] w-[88px]' : 'h-24 w-24'} border-4 border-white shadow-md`}>
                <AvatarImage src={applicant.profilePhoto} />
                <AvatarFallback className={`${isApplicant ? 'text-2xl' : 'text-2xl'} bg-[#f0f7ff] text-[#0566CD]`}>
                  {applicant.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {((isApplicant && !isApplicantView) || viewMode === 'admin') && isHoveringPhoto && (
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {uploadingPhoto ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                </div>
              )}
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>
            {showCompletionRing && (
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-lg">
              <div className={`relative ${isApplicant ? 'h-10 w-10' : 'h-8 w-8'}`}>
                <svg className={`${isApplicant ? 'h-10 w-10' : 'h-8 w-8'} -rotate-90`} viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="16" fill="none"
                    className="stroke-primary" strokeWidth="3"
                    strokeDasharray={`${profileCompletion} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center ${isApplicant ? 'text-[10px]' : 'text-[9px]'} font-bold`}>
                  {profileCompletion}%
                </span>
              </div>
            </div>
            )}
          </div>

          <div className={cn("flex-1", isApplicant ? "pt-1 lg:pt-2" : "pt-2 lg:pt-4")}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className={cn("font-bold", isApplicant ? "text-[22px] text-[#333]" : "text-xl")}>
                    {headerName}
                  </h1>
                  {showStatusBadge && (
                  <Badge
                    variant={applicant.status === 'Active' ? 'default' : 'secondary'}
                    className={cn("text-[10px]", isApplicant && "bg-[#f0f7ff] text-[#0566CD] hover:bg-[#f0f7ff]")}
                  >
                    {statusLabel}
                  </Badge>
                  )}
                </div>

                {headline && (
                  <p className={cn("text-sm font-medium text-[#333]", isApplicant && "leading-snug")}>
                    {headline}
                  </p>
                )}

                <p className={cn("text-sm", isApplicant ? applicantProfileMuted : "text-muted-foreground")}>
                  {[
                    !headline && hasDesignation ? applicant.designation : null,
                    hasCity ? applicant.currentCity : null,
                    experienceLabel,
                    applicant.currentCompany && applicant.currentCompany !== 'N/A' ? applicant.currentCompany : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {hasNoticePeriod && (
                    <span className="flex items-center gap-1 rounded-full bg-[#f4f5f7] px-2 py-1 text-[#333]">
                      <Clock className="h-3 w-3 text-[#0566CD]" />
                      Notice: {applicant.noticePeriod}
                    </span>
                  )}
                  {applicant.expectedCTC > 0 && (
                    <span className="flex items-center gap-1 rounded-full bg-[#f4f5f7] px-2 py-1 text-[#333]">
                      Expected: ₹{applicant.expectedCTC} LPA
                    </span>
                  )}
                </div>

                {viewMode === 'admin' && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                    {applicant.email && applicant.email !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {applicant.email}
                      </span>
                    )}
                    {applicant.phone && applicant.phone !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {applicant.phone}
                      </span>
                    )}
                  </div>
                )}

                {viewMode === 'client' && clientContactVisible && (
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1">
                    {applicant.email && applicant.email !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {applicant.email}
                      </span>
                    )}
                    {applicant.phone && applicant.phone !== 'N/A' && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {applicant.phone}
                      </span>
                    )}
                  </div>
                )}

                {viewMode !== 'applicant' && applicant.communicationSkill && applicant.communicationSkill !== 'N/A' && applicant.communicationSkill !== 'Average' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Communication:</span>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      applicant.communicationSkill === 'Excellent' && "border-green-500 text-green-600",
                      applicant.communicationSkill === 'Good' && "border-blue-500 text-green-600",
                      applicant.communicationSkill === 'Average' && "border-yellow-500 text-yellow-600",
                      applicant.communicationSkill === 'Poor' && "border-red-500 text-red-600",
                    )}>
                      {applicant.communicationSkill}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {viewMode === 'applicant' && (
                  <>
                    <Button size="sm" className="h-8 bg-[#0566CD] text-xs hover:bg-[#0066c0]" onClick={onEdit}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      {isApplicantView ? "Update profile" : "Edit profile"}
                    </Button>
                    {!isApplicantView && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-[#e8e8e8] text-xs text-[#333]"
                      onClick={() => {
                        const el = document.getElementById('resume');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Upload Resume
                    </Button>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: `${applicant.name} - Profile`, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Profile link copied!');
                      }
                    }}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}

                {viewMode === 'admin' && (
                  <>
                    <Button size="sm" className="h-8 text-xs" onClick={onEdit}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onAddNote}>
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                      Note
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onShortlist}>
                      Shortlist
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onFavorite}
                    >
                      {isFavorite ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onDelete}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}

                {viewMode === 'client' && (
                  <>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onAddToFolder}>
                      <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                      Folder
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs" onClick={onShortlist}>
                      Shortlist
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Resume
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={onFavorite}
                    >
                      {isFavorite ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
