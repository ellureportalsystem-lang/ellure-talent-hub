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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Saved Jobs</h1>
      {loading ? <Skeleton className="h-32 w-full" /> : items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No saved jobs yet</CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {items.map((row) => {
            const job = row.jobs;
            if (!job) return null;
            return (
              <Card key={row.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{job.title}</p>
                    <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => unsave(job.id)}>Unsave</Button>
                    <Button size="sm" asChild><Link to={`/dashboard/applicant/jobs/${job.id}`}>Apply</Link></Button>
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


