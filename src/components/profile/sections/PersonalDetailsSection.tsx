import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Calendar, User, Heart, Globe, MapPin, Home } from "lucide-react";

interface PersonalDetails {
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  languages?: string[];
  address?: string;
  homeTown?: string;
}

interface PersonalDetailsSectionProps {
  details: PersonalDetails;
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: () => void;
}

const PersonalDetailsSection = ({ details, viewMode, onEdit }: PersonalDetailsSectionProps) => {
  const canEdit = viewMode !== 'client';
  const hasAnyData = details.dateOfBirth || details.gender || details.maritalStatus ||
    (details.languages && details.languages.length > 0) || details.address || details.homeTown;

  if (!hasAnyData) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground space-y-3">
        <p>No personal details added yet.</p>
        {canEdit && onEdit && (
          <button type="button" className="text-xs text-[#0566CD] hover:underline" onClick={onEdit}>
            Add personal details
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 p-2 bg-yellow-500/10 rounded-md text-xs text-yellow-700">
        <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
        <span>This information is private and only visible to authorized personnel.</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {details.dateOfBirth && (
            <div className="flex items-center gap-2.5 py-1.5 border-b">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">Date of Birth</span>
              <span className="font-medium text-xs">{details.dateOfBirth}</span>
            </div>
          )}

          {details.gender && (
            <div className="flex items-center gap-2.5 py-1.5 border-b">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">Gender</span>
              <span className="font-medium text-xs">{details.gender}</span>
            </div>
          )}

          {details.maritalStatus && (
            <div className="flex items-center gap-2.5 py-1.5 border-b">
              <Heart className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">Marital Status</span>
              <span className="font-medium text-xs">{details.maritalStatus}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {details.languages && details.languages.length > 0 && (
            <div className="py-1.5 border-b">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Languages Known</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-6">
                {details.languages.map((lang, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px]">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {details.homeTown && (
            <div className="flex items-center gap-2.5 py-1.5 border-b">
              <Home className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground flex-1">Home Town</span>
              <span className="font-medium text-xs">{details.homeTown}</span>
            </div>
          )}

          {details.address && (
            <div className="py-1.5 border-b">
              <div className="flex items-center gap-2.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">Address</span>
              </div>
              <p className="text-xs pl-6">{details.address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
