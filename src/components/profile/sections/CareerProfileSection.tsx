import { Badge } from "@/components/ui/badge";
import { Building, MapPin, IndianRupee, Target } from "lucide-react";

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
  onEdit?: () => void;
}

const CareerProfileSection = ({ career, viewMode, onEdit }: CareerProfileSectionProps) => {
  const canEdit = viewMode !== 'client';
  const hasIndustryData = career.currentIndustry || career.preferredIndustry || career.functionalArea;
  const hasRoleData = career.preferredRole || (career.desiredJobType && career.desiredJobType.length > 0);
  const hasLocationData = (career.preferredLocations && career.preferredLocations.length > 0);
  const hasSalaryData = career.expectedSalary && career.expectedSalary > 0;

  if (!hasIndustryData && !hasRoleData && !hasLocationData && !hasSalaryData) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground space-y-3">
        <p>No career preferences added yet. Complete this section to help us match you better.</p>
        {canEdit && onEdit && (
          <button type="button" className="text-xs text-[#0566CD] hover:underline" onClick={onEdit}>
            Add career preferences
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {hasIndustryData && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <Building className="h-3.5 w-3.5 text-primary" />
            Industry Preferences
          </h4>
          <div className="space-y-2">
            {career.currentIndustry && (
              <div className="flex justify-between py-1.5 border-b text-sm">
                <span className="text-muted-foreground">Current Industry</span>
                <span className="font-medium">{career.currentIndustry}</span>
              </div>
            )}
            {career.preferredIndustry && (
              <div className="flex justify-between py-1.5 border-b text-sm">
                <span className="text-muted-foreground">Preferred Industry</span>
                <span className="font-medium">{career.preferredIndustry}</span>
              </div>
            )}
            {career.functionalArea && (
              <div className="flex justify-between py-1.5 border-b text-sm">
                <span className="text-muted-foreground">Functional Area</span>
                <span className="font-medium text-right max-w-[60%]">{career.functionalArea}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasRoleData && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <Target className="h-3.5 w-3.5 text-primary" />
            Role Preferences
          </h4>
          <div className="space-y-2">
            {career.preferredRole && (
              <div className="flex justify-between py-1.5 border-b text-sm">
                <span className="text-muted-foreground">Preferred Role</span>
                <span className="font-medium">{career.preferredRole}</span>
              </div>
            )}
            {career.desiredJobType && career.desiredJobType.length > 0 && (
              <div className="py-1.5 border-b">
                <span className="text-muted-foreground text-sm block mb-1.5">Job Type</span>
                <div className="flex flex-wrap gap-1">
                  {career.desiredJobType.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-[10px]">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {hasLocationData && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Location Preferences
          </h4>
          <div className="space-y-2">
            <div className="py-1.5 border-b">
              <span className="text-muted-foreground text-sm block mb-1.5">Preferred Locations</span>
              <div className="flex flex-wrap gap-1">
                {career.preferredLocations?.map((loc, index) => (
                  <Badge key={index} variant="outline" className="text-[10px]">
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
            {career.openToRelocation !== undefined && (
              <div className="flex justify-between py-1.5 border-b text-sm">
                <span className="text-muted-foreground">Open to Relocation</span>
                <Badge variant={career.openToRelocation ? "default" : "secondary"} className="text-[10px]">
                  {career.openToRelocation ? 'Yes' : 'No'}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {hasSalaryData && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
            <IndianRupee className="h-3.5 w-3.5 text-primary" />
            Salary Expectations
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b text-sm">
              <span className="text-muted-foreground">Expected Salary</span>
              <span className="font-medium">₹{career.expectedSalary} LPA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerProfileSection;
