import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MapPin, Briefcase, Search } from "lucide-react";
import { fetchActiveJobs, toggleSavedJob } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const ApplicantJobsPage = () => {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const init = async () => {
      const aid = profile?.applicant_id;
      if (aid) {
        setApplicantId(aid);
        const { data } = await supabase.from("saved_jobs").select("job_id").eq("applicant_id", aid);
        setSavedIds(new Set((data || []).map((r) => r.job_id)));
      } else if (user?.id) {
        const { data } = await supabase.from("applicants").select("id").eq("user_id", user.id).maybeSingle();
        if (data?.id) setApplicantId(data.id);
      }
    };
    init();
  }, [profile, user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchActiveJobs({ search: search || undefined, city: city || undefined, limit: 30 });
        setJobs(data);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, city]);

  const onSave = async (jobId: string) => {
    if (!applicantId) return;
    const saved = await toggleSavedJob(applicantId, jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
    toast.success(saved ? "Job saved" : "Removed from saved");
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Find Jobs</h1>
        <p className="text-muted-foreground">Browse active openings matching your profile</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Keywords..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Input placeholder="Location" value={city} onChange={(e) => setCity(e.target.value)} className="sm:w-48" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : jobs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No active jobs found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{(job.clients as { company_name?: string })?.company_name || "Company"}</p>
                    <Link to={`/dashboard/applicant/jobs/${job.id}`} className="text-lg font-semibold hover:text-primary">
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.city || "Remote"}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.job_type}</span>
                      {job.published_at && (
                        <span>{formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(job.skills_required || []).slice(0, 5).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <p className="text-sm font-medium">
                      {job.salary_disclosed === false ? "Salary not disclosed" : `₹${job.salary_min || "?"}-${job.salary_max || "?"} LPA`}
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => onSave(job.id)}>
                      <Bookmark className={`h-4 w-4 ${savedIds.has(job.id) ? "fill-primary text-primary" : ""}`} />
                    </Button>
                    <Button size="sm" asChild><Link to={`/dashboard/applicant/jobs/${job.id}`}>Apply</Link></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantJobsPage;


