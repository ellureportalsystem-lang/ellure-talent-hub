import { Card, CardContent } from "@/components/ui/card";
import { Eye, Search, Download, Activity, BarChart3 } from "lucide-react";

interface ProfileAnalyticsProps {
  viewMode: 'applicant' | 'admin' | 'client';
}

const ProfileAnalytics = ({ viewMode }: ProfileAnalyticsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold">--</p>
                <p className="text-[10px] text-muted-foreground">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Search className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold">--</p>
                <p className="text-[10px] text-muted-foreground">Search Appearances</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Download className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold">--</p>
                <p className="text-[10px] text-muted-foreground">Resume Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Activity className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold">--</p>
                <p className="text-[10px] text-muted-foreground">Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-muted/30 p-6 text-center">
        <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm font-medium text-muted-foreground">Analytics Coming Soon</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Detailed profile views, search trends, and activity logs will appear here once tracking is enabled.
        </p>
      </div>
    </div>
  );
};

export default ProfileAnalytics;
