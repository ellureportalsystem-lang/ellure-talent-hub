import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchSavedJobs, toggleSavedJob } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalEmptyState, PortalListRow, PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const ApplicantSavedJobsPage = () => {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const load = async (aid: string) => {
    setLoading(true);
    try {
      setItems(await fetchSavedJobs(aid));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const aid = profile?.applicant_id;
    if (aid) {
      setApplicantId(aid);
      load(aid);
      return;
    }
    if (user?.id) {
      supabase
        .from("applicants")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) {
            setApplicantId(data.id);
            load(data.id);
          } else setLoading(false);
        });
    }
  }, [user, profile]);

  const unsave = async (jobId: string) => {
    if (!applicantId) return;
    await toggleSavedJob(applicantId, jobId);
    toast.success("Removed from saved");
    load(applicantId);
  };

  return (
    <DashboardPageShell width="standard" className="space-y-5">
      <PortalPageHeader title="Saved jobs" subtitle="Keep track of roles you want to apply for" />

      {loading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : items.length === 0 ? (
        <PortalEmptyState
          title="No saved jobs yet"
          description="Save jobs while browsing to find them here."
          action={
            <Button asChild>
              <Link to="/dashboard/applicant/jobs">Browse jobs</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map((row, i) => {
            const job = row.jobs;
            if (!job) return null;
            const company = (job.clients as { company_name?: string })?.company_name || "Company";
            return (
              <div key={row.id} className={cn(portalPanelClass, "p-0 overflow-hidden")}>
                <PortalListRow
                  title={job.title}
                  subtitle={company}
                  alternate={i % 2 === 1}
                  trailing={
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-[10px]">
                        {job.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-xs" onClick={() => unsave(job.id)}>
                          Unsave
                        </Button>
                        <Button size="sm" className="h-8 px-2 text-xs" asChild>
                          <Link to={`/dashboard/applicant/jobs/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </DashboardPageShell>
  );
};

export default ApplicantSavedJobsPage;
