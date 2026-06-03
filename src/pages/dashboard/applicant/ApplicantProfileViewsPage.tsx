import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { fetchApplicantProfileViews } from "@/services/profileViewService";
import { formatDistanceToNow } from "date-fns";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalEmptyState, PortalListRow, PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const ApplicantProfileViewsPage = () => {
  const { applicantId } = useRegistrationApplicant();
  const [views, setViews] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!applicantId) return;
    setLoading(true);
    fetchApplicantProfileViews(applicantId, 30)
      .then(setViews)
      .finally(() => setLoading(false));
  }, [applicantId]);

  return (
    <DashboardPageShell width="standard" className="space-y-5">
      <PortalPageHeader
        title="Profile views"
        subtitle={`Last 30 days · ${views.length} view${views.length === 1 ? "" : "s"}`}
      />

      <div className={cn(portalPanelClass, "p-4")}>
        <h2 className="mb-3 text-sm font-semibold">Recent views</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : views.length === 0 ? (
          <PortalEmptyState
            title="No profile views yet"
            description="When recruiters view your profile, they'll appear here."
          />
        ) : (
          <div className="space-y-2">
            {views.map((v, i) => {
              const profiles = v.profiles as { clients?: { company_name?: string } } | null;
              const company = profiles?.clients?.company_name || "Recruiter";
              return (
                <PortalListRow
                  key={String(v.id)}
                  title={company}
                  subtitle={String(v.viewer_type || "viewer")}
                  initials={company.slice(0, 2).toUpperCase()}
                  alternate={i % 2 === 1}
                  trailing={
                    <span className="text-xs text-muted-foreground shrink-0">
                      {v.viewed_at
                        ? formatDistanceToNow(new Date(String(v.viewed_at)), { addSuffix: true })
                        : ""}
                    </span>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </DashboardPageShell>
  );
};

export default ApplicantProfileViewsPage;
