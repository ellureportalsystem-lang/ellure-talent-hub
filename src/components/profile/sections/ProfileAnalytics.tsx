import { Card, CardContent } from "@/components/ui/card";
import { Eye, Search, Download, Activity, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProfileAnalyticsProps {
  viewMode: 'applicant' | 'admin' | 'client';
  profileViewsCount?: number;
  searchAppearanceCount?: number;
  shortlistCount?: number;
  resumeDownloads?: number;
}

const ProfileAnalytics = ({
  viewMode,
  profileViewsCount = 0,
  searchAppearanceCount = 0,
  shortlistCount = 0,
  resumeDownloads = 0,
}: ProfileAnalyticsProps) => {
  const stats = [
    { label: "Profile Views", value: profileViewsCount, icon: Eye, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Search Appearances", value: searchAppearanceCount, icon: Search, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Resume Downloads", value: resumeDownloads, icon: Download, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Shortlisted", value: shortlistCount, icon: Activity, color: "text-blue-600", bg: "bg-blue-500/10" },
  ];

  const hasAnyData = stats.some((s) => s.value > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border">
              <CardContent className="p-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!hasAnyData ? (
        <div className="rounded-lg border bg-muted/30 p-6 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No activity recorded yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Complete your profile and apply to jobs to increase visibility.
          </p>
        </div>
      ) : viewMode === "applicant" ? (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
            <Link to="/dashboard/applicant/profile-views">View profile activity</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileAnalytics;
