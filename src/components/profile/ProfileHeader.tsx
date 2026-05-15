import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit, Upload, Share2, Star, StarOff, FolderPlus, Download, Trash2,
  MapPin, Briefcase, Clock, MessageSquare, Phone, Mail, User, Camera, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { uploadApplicantProfileImage } from "@/lib/applicantMediaUpload";
import { toast } from "sonner";

interface ProfileHeaderProps {
  applicant: any;
  viewMode: 'applicant' | 'admin' | 'client';
  profileCompletion: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNote?: () => void;
  onAddToFolder?: () => void;
  onShortlist?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  onProfileImageUploaded?: (url: string) => void;
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

      await supabase.from('applicants').update({ profile_image: url, updated_at: new Date().toISOString() }).eq('id', applicant.id);
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
  const hasExperience = applicant.experience && applicant.experience > 0;
  const hasCity = applicant.currentCity && applicant.currentCity !== 'N/A';
  const hasNoticePeriod = applicant.noticePeriod && applicant.noticePeriod !== 'N/A';
  const hasCommunication = applicant.communicationSkill && applicant.communicationSkill !== 'N/A' && applicant.communicationSkill !== 'Average';

  const isApplicant = viewMode === 'applicant';

  return (
    <div className="relative">
      <div className={`${isApplicant ? 'h-36' : 'h-24'} bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-t-xl`} />

      <div className="bg-card rounded-b-xl shadow-lg border border-t-0 px-4 sm:px-6 pb-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`relative ${isApplicant ? '-mt-16' : '-mt-12'} flex-shrink-0`}>
            <div
              className="relative"
              onMouseEnter={() => setIsHoveringPhoto(true)}
              onMouseLeave={() => setIsHoveringPhoto(false)}
            >
              <Avatar className={`${isApplicant ? 'h-32 w-32' : 'h-24 w-24'} border-4 border-background shadow-xl`}>
                <AvatarImage src={applicant.profilePhoto} />
                <AvatarFallback className={`${isApplicant ? 'text-3xl' : 'text-2xl'} bg-primary text-primary-foreground`}>
                  {applicant.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {(isApplicant || viewMode === 'admin') && isHoveringPhoto && (
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity"
                  onClick={() => photoInputRef.current?.click()}
                >
                  {uploadingPhoto ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                </div>
              )}
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </div>
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
          </div>

          <div className="flex-1 pt-2 lg:pt-4">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{applicant.name}</h1>
                  <Badge variant={applicant.status === 'Active' ? 'default' : 'secondary'} className="text-[10px]">
                    {applicant.status}
                  </Badge>
                </div>

                {hasDesignation && (
                  <p className="text-sm text-muted-foreground">
                    {applicant.designation}
                    {hasExperience ? ` · ${applicant.experience} years experience` : ''}
                    {applicant.primarySkill && applicant.primarySkill !== 'N/A' ? ` · ${applicant.primarySkill}` : ''}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 text-xs">
                  {hasDesignation && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <Briefcase className="h-3 w-3 text-primary" />
                      {applicant.designation}
                    </span>
                  )}
                  {hasCity && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <MapPin className="h-3 w-3 text-primary" />
                      {applicant.currentCity}
                    </span>
                  )}
                  {hasExperience && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <Clock className="h-3 w-3 text-primary" />
                      {applicant.experience} yrs
                    </span>
                  )}
                  {hasNoticePeriod && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <User className="h-3 w-3 text-primary" />
                      {applicant.noticePeriod}
                    </span>
                  )}
                </div>

                {(viewMode === 'admin' || viewMode === 'client') && (
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

                {hasCommunication && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Communication:</span>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      applicant.communicationSkill === 'Excellent' && "border-green-500 text-green-600",
                      applicant.communicationSkill === 'Good' && "border-blue-500 text-blue-600",
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
                    <Button size="sm" className="h-8 text-xs" onClick={onEdit}>
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline" size="sm" className="h-8 text-xs"
                      onClick={() => {
                        const el = document.getElementById('resume');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Upload Resume
                    </Button>
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
