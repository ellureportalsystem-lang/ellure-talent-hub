import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Eye } from "lucide-react";
import { useRegistrationApplicant } from "@/hooks/useRegistrationApplicant";
import { fetchApplicantProfileViews } from "@/services/profileViewService";
import { formatDistanceToNow } from "date-fns";

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
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Profile views</h1>
        <p className="text-muted-foreground text-sm">Last 30 days · {views.length} view{views.length === 1 ? "" : "s"}</p>
      </div>

      <Card className="border-[var(--surface-border)] bg-[var(--surface-1)]">
        <CardHeader><CardTitle className="text-base">Recent views</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : views.length === 0 ? (
            <EmptyState icon={Eye} title="No profile views yet" description="When recruiters view your profile, they'll appear here." />
          ) : (
            <ul className="divide-y divide-[var(--surface-border)]">
              {views.map((v) => {
                const profiles = v.profiles as { clients?: { company_name?: string } } | null;
                const company = profiles?.clients?.company_name || "Recruiter";
                return (
                  <li key={String(v.id)} className="py-3 flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{company}</p>
                      <p className="text-xs text-muted-foreground capitalize">{String(v.viewer_type || "viewer")}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {v.viewed_at ? formatDistanceToNow(new Date(String(v.viewed_at)), { addSuffix: true }) : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantProfileViewsPage;
