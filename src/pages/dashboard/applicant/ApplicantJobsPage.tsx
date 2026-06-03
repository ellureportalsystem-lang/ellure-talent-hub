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
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Find jobs</h1>
        <p className="text-sm text-muted-foreground">Browse active openings matching your profile</p>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="h-10 pl-9"
                placeholder="Search by role, skill, or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="City / Remote"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-10 sm:w-56"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : jobs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No active jobs found</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      {(job.clients as { company_name?: string })?.company_name || "Company"}
                    </p>
                    <Link
                      to={`/dashboard/applicant/jobs/${job.id}`}
                      className="mt-0.5 block truncate text-base font-semibold tracking-tight hover:text-primary"
                    >
                      {job.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.city || "Remote"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {job.job_type}
                      </span>
                      {job.published_at ? (
                        <span>{formatDistanceToNow(new Date(job.published_at), { addSuffix: true })}</span>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 shrink-0"
                    onClick={() => onSave(job.id)}
                    aria-label={savedIds.has(job.id) ? "Unsave job" : "Save job"}
                  >
                    <Bookmark className={savedIds.has(job.id) ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(job.skills_required || []).slice(0, 5).map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-[11px] px-2 py-0.5">
                      {s}
                    </Badge>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold tabular-nums">
                    {job.salary_disclosed === false
                      ? "Salary not disclosed"
                      : `₹${job.salary_min || "?"}-${job.salary_max || "?"} LPA`}
                  </p>
                  <Button size="sm" className="h-9 px-4" asChild>
                    <Link to={`/dashboard/applicant/jobs/${job.id}`}>View</Link>
                  </Button>
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


