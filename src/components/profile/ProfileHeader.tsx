import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Edit, Upload, Share2, Star, StarOff, FolderPlus, Download, Trash2,
  MapPin, Briefcase, Clock, MessageSquare, Phone, Mail, User, Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

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
}: ProfileHeaderProps) => {
  const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);

  return (
    <div className="relative">
      {/* Banner Background */}
      <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-t-xl" />
      
      {/* Profile Content */}
      <div className="bg-card rounded-b-xl shadow-lg border border-t-0 px-6 pb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Photo */}
          <div className="relative -mt-16 flex-shrink-0">
            <div 
              className="relative"
              onMouseEnter={() => setIsHoveringPhoto(true)}
              onMouseLeave={() => setIsHoveringPhoto(false)}
            >
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={applicant.profilePhoto} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {applicant.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {viewMode === 'applicant' && isHoveringPhoto && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            {/* Profile Completion Ring */}
            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 shadow-lg">
              <div className="relative h-10 w-10">
                <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    className="stroke-primary" strokeWidth="3"
                    strokeDasharray={`${profileCompletion} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {profileCompletion}%
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 pt-4 lg:pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-3">
                {/* Name & Status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{applicant.name}</h1>
                  <Badge variant={applicant.status === 'Active' ? 'default' : 'secondary'}>
                    {applicant.status}
                  </Badge>
                  {applicant.isFavorite && (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>

                {/* Resume Headline */}
                <p className="text-muted-foreground max-w-2xl">
                  {applicant.resumeHeadline || `${applicant.designation || 'Professional'} with ${applicant.experience} years of experience in ${applicant.primarySkill}`}
                </p>

                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                    <Briefcase className="h-4 w-4 text-primary" />
                    {applicant.designation || 'Software Professional'}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                    {applicant.currentCity}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                    <Clock className="h-4 w-4 text-primary" />
                    {applicant.experience} years exp
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full">
                    <User className="h-4 w-4 text-primary" />
                    {applicant.noticePeriod}
                  </span>
                </div>

                {/* Contact Info (Admin/Client only) */}
                {(viewMode === 'admin' || viewMode === 'client') && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {applicant.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {applicant.phone}
                    </span>
                  </div>
                )}

                {/* Communication Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Communication:</span>
                  <Badge variant="outline" className={cn(
                    applicant.communicationSkill === 'Excellent' && "border-green-500 text-green-600",
                    applicant.communicationSkill === 'Good' && "border-blue-500 text-blue-600",
                    applicant.communicationSkill === 'Average' && "border-yellow-500 text-yellow-600",
                    applicant.communicationSkill === 'Poor' && "border-red-500 text-red-600",
                  )}>
                    {applicant.communicationSkill}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {viewMode === 'applicant' && (
                  <>
                    <Button onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {viewMode === 'admin' && (
                  <>
                    <Button onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={onAddNote}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                    <Button variant="outline" onClick={onAddToFolder}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Add to Folder
                    </Button>
                    <Button variant="outline" onClick={onShortlist}>
                      Shortlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={onFavorite}
                      className={isFavorite ? "text-yellow-500" : ""}
                    >
                      {isFavorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="destructive" size="icon" onClick={onDelete}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {viewMode === 'client' && (
                  <>
                    <Button variant="outline" onClick={onAddToFolder}>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Add to Folder
                    </Button>
                    <Button variant="outline" onClick={onShortlist}>
                      Shortlist
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={onFavorite}
                      className={isFavorite ? "text-yellow-500" : ""}
                    >
                      {isFavorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
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
