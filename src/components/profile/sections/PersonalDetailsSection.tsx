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
}

const PersonalDetailsSection = ({ details, viewMode }: PersonalDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Privacy Notice */}
      <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg text-sm text-yellow-700">
        <ShieldAlert className="h-4 w-4 flex-shrink-0" />
        <span>This information is private and only visible to authorized personnel.</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground text-sm">Date of Birth</span>
            </div>
            <span className="font-medium text-sm">{details.dateOfBirth || '—'}</span>
          </div>
          
          <div className="flex items-center gap-3 py-2 border-b">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground text-sm">Gender</span>
            </div>
            <span className="font-medium text-sm">{details.gender || '—'}</span>
          </div>
          
          <div className="flex items-center gap-3 py-2 border-b">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground text-sm">Marital Status</span>
            </div>
            <span className="font-medium text-sm">{details.maritalStatus || '—'}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="py-2 border-b">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Languages Known</span>
            </div>
            <div className="flex flex-wrap gap-1 pl-7">
              {details.languages?.map((lang, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              )) || <span className="text-sm">—</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-3 py-2 border-b">
            <Home className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-muted-foreground text-sm">Home Town</span>
            </div>
            <span className="font-medium text-sm">{details.homeTown || '—'}</span>
          </div>
          
          <div className="py-2 border-b">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Address</span>
            </div>
            <p className="text-sm pl-7">{details.address || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsSection;
