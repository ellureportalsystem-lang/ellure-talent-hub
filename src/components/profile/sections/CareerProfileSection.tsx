import { Badge } from "@/components/ui/badge";
import { Building, MapPin, IndianRupee, Briefcase, Target, Globe } from "lucide-react";

interface CareerProfile {
  currentIndustry?: string;
  preferredIndustry?: string;
  functionalArea?: string;
  preferredRole?: string;
  desiredJobType?: string[];
  preferredLocations?: string[];
  expectedSalary?: number;
  openToRelocation?: boolean;
}

interface CareerProfileSectionProps {
  career: CareerProfile;
  viewMode: 'applicant' | 'admin' | 'client';
}

const CareerProfileSection = ({ career, viewMode }: CareerProfileSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Industry Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" />
          Industry Preferences
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Current Industry</span>
            <span className="font-medium text-sm">{career.currentIndustry || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Preferred Industry</span>
            <span className="font-medium text-sm">{career.preferredIndustry || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Functional Area</span>
            <span className="font-medium text-sm">{career.functionalArea || '—'}</span>
          </div>
        </div>
      </div>

      {/* Role Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Role Preferences
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Preferred Role</span>
            <span className="font-medium text-sm">{career.preferredRole || '—'}</span>
          </div>
          <div className="py-2 border-b">
            <span className="text-muted-foreground text-sm block mb-2">Desired Job Type</span>
            <div className="flex flex-wrap gap-1">
              {career.desiredJobType?.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              )) || <span className="text-sm">—</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Location Preferences */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Location Preferences
        </h4>
        <div className="space-y-3">
          <div className="py-2 border-b">
            <span className="text-muted-foreground text-sm block mb-2">Preferred Locations</span>
            <div className="flex flex-wrap gap-1">
              {career.preferredLocations?.map((loc, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {loc}
                </Badge>
              )) || <span className="text-sm">—</span>}
            </div>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Open to Relocation</span>
            <Badge variant={career.openToRelocation ? "default" : "secondary"} className="text-xs">
              {career.openToRelocation ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-primary" />
          Salary Expectations
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground text-sm">Expected Salary</span>
            <span className="font-medium text-sm">
              {career.expectedSalary ? `₹${career.expectedSalary} LPA` : 'Negotiable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerProfileSection;
