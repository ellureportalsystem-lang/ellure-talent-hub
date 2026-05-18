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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold">My Jobs</h1><p className="text-muted-foreground">Manage postings and applications</p></div>
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
      </div>
      <Card>
        <CardContent className="p-0 pt-4">
          {loading ? <Skeleton className="h-40 m-4" /> : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const JobsPage = () => (
  <Routes>
    <Route index element={<JobsList />} />
    <Route path=":jobId/applications" element={<JobApplicationsRoute />} />
  </Routes>
);

export default JobsPage;
