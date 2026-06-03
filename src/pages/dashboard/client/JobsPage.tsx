import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Eye, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchJobsForClient, upsertJob, updateJobStatus, type JobFormData } from "@/services/jobService";
import { JobApplicationsKanban } from "@/components/jobs/JobApplicationsKanban";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagInput } from "@/components/ui/tag-input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const JobApplicationsRoute = () => {
  const { jobId } = useParams();
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (!jobId) return;
    supabase.from("jobs").select("title").eq("id", jobId).single().then(({ data }) => setTitle(data?.title || ""));
  }, [jobId]);
  if (!jobId) return null;
  return <JobApplicationsKanban jobId={jobId} jobTitle={title} backPath="/dashboard/client/jobs" />;
};

const JobsList = () => {
  const { user } = useAuth();
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<JobFormData>({ title: "", description: "", jobType: "full-time", workMode: "onsite", skillsRequired: [], status: "draft", clientId });

  const load = () => {
    if (!clientId) return;
    setLoading(true);
    fetchJobsForClient(clientId).then(setJobs).finally(() => setLoading(false));
  };

  useEffect(load, [clientId]);

  const save = async (status: "draft" | "active") => {
    if (!user?.id || !clientId) return;
    try {
      await upsertJob({ ...form, status, clientId }, user.id);
      toast.success("Job saved");
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <DashboardPageShell width="standard" className="space-y-6">
      <PortalPageHeader
        title="My jobs"
        subtitle="Manage postings and applications"
        action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Post New Job</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Job</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} /></div>
              <TagInput value={form.skillsRequired} onChange={(skills) => setForm({ ...form, skillsRequired: skills })} />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => save("draft")}>Draft</Button>
                <Button onClick={() => save("active")}>Publish</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        }
      />
      <Card className={portalPanelClass}>
        <CardContent className="p-0 pt-4">
          {loading ? <Skeleton className="h-40 m-4 rounded-xl" /> : (
            <>
            <div className="space-y-2 p-4 md:hidden">
              {jobs.map((j, i) => (
                <div
                  key={j.id}
                  className={cn(
                    portalPanelClass,
                    "flex items-center justify-between gap-3 p-3 active:scale-[0.99]",
                    i % 2 === 1 && "bg-card/80"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{j.title}</p>
                    <p className="text-xs text-muted-foreground">{j.applications_count ?? 0} applications</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 shrink-0" asChild>
                    <Link to={`/dashboard/client/jobs/${j.id}/applications`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell>{j.title}</TableCell>
                    <TableCell><Badge>{j.status}</Badge></TableCell>
                    <TableCell>{j.applications_count ?? 0}</TableCell>
                    <TableCell>{j.application_deadline ? new Date(j.application_deadline).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="space-x-1">
                      <Button size="sm" variant="outline" asChild><Link to={`/dashboard/client/jobs/${j.id}/applications`}><Eye className="h-4 w-4" /></Link></Button>
                      {j.status !== "active" && <Button size="sm" variant="ghost" onClick={() => updateJobStatus(j.id, "active").then(load)}>Activate</Button>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

const JobsPage = () => (
  <Routes>
    <Route index element={<JobsList />} />
    <Route path=":jobId/applications" element={<JobApplicationsRoute />} />
  </Routes>
);

export default JobsPage;
