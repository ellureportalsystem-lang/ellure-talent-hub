import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchSavedJobs, toggleSavedJob } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
    if (aid) { setApplicantId(aid); load(aid); return; }
    if (user?.id) {
      supabase.from("applicants").select("id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
        if (data?.id) { setApplicantId(data.id); load(data.id); }
        else setLoading(false);
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
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Saved jobs</h1>
        <p className="text-sm text-muted-foreground">Keep track of roles you want to apply for</p>
      </div>
      {loading ? <Skeleton className="h-32 w-full" /> : items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No saved jobs yet</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {items.map((row) => {
            const job = row.jobs;
            if (!job) return null;
            return (
              <Card key={row.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-tight">{job.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(job.clients as { company_name?: string })?.company_name || "Company"}
                      </p>
                      <div className="mt-2">
                        <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-[11px]">
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Button variant="outline" size="sm" className="h-9" onClick={() => unsave(job.id)}>
                        Unsave
                      </Button>
                      <Button size="sm" className="h-9" asChild>
                        <Link to={`/dashboard/applicant/jobs/${job.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicantSavedJobsPage;


