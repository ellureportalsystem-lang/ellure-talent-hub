import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchJobById, applyToJob } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeHtml } from "@/components/ui/safe-html";
import { toast } from "sonner";

const ApplicantJobDetail = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicant, setApplicant] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchJobById(id).then(setJob).catch(() => toast.error("Job not found")).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("applicants").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      setApplicant(data);
      if (data && id) {
        supabase.from("job_applications").select("id").eq("job_id", id).eq("applicant_id", data.id).maybeSingle()
          .then(({ data: app }) => setHasApplied(!!app));
      }
    });
  }, [user, id]);

  const submitApply = async () => {
    if (!applicant || !job || !user) return;
    setApplying(true);
    try {
      await applyToJob({
        jobId: job.id,
        applicantId: applicant.id,
        userId: user.id,
        resumeUrl: applicant.resume_file,
        coverLetter: coverLetter.slice(0, 500),
        jobTitle: job.title,
      });
      setHasApplied(true);
      setApplyOpen(false);
      toast.success("Application submitted!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Apply failed");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-4 lg:p-6"><Skeleton className="h-64 w-full" /></div>;
  if (!job) return <div className="p-4 lg:p-6">Job not found</div>;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <Button variant="ghost" size="sm" className="h-9 px-2" asChild>
        <Link to="/dashboard/applicant/jobs">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
      </Button>
      <Card className="border shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{job.title}</h1>
            <p className="text-sm text-muted-foreground">
              {(job.clients as { company_name?: string })?.company_name || "Company"}
            </p>
          </div>
          <SafeHtml html={job.description || ""} className="max-w-none" />
          {job.requirements && (
            <>
              <h3 className="font-semibold">Requirements</h3>
              <SafeHtml html={job.requirements} className="max-w-none" />
            </>
          )}
          {hasApplied ? (
            <Button disabled className="h-10">Already applied</Button>
          ) : (
            <Button onClick={() => setApplyOpen(true)} className="h-10">Apply</Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Apply for {job.title}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Resume on file: {applicant?.resume_file ? "Yes" : "None — upload in profile first"}</p>
          <Textarea placeholder="Cover letter (optional, max 500 chars)" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} maxLength={500} />
          <Button onClick={submitApply} disabled={applying || !applicant?.resume_file}>
            {applying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantJobDetail;


