import { useEffect, useState } from "react";
import { Link, Routes, Route, useParams } from "react-router-dom";
import { JobApplicationsKanban } from "@/components/jobs/JobApplicationsKanban";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Briefcase, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAllJobs, upsertJob, updateJobStatus, softDeleteJob, type JobFormData,
} from "@/services/jobService";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagInput } from "@/components/ui/tag-input";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const AdminJobKanbanRoute = () => {
  const { jobId } = useParams();
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (!jobId) return;
    supabase.from("jobs").select("title").eq("id", jobId).single().then(({ data }) => setTitle(data?.title || ""));
  }, [jobId]);
  if (!jobId) return null;
  return <JobApplicationsKanban jobId={jobId} jobTitle={title} backPath="/dashboard/admin/jobs" />;
};

const AdminJobsList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [clients, setClients] = useState<{ id: string; company_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    jobType: "full-time",
    workMode: "onsite",
    skillsRequired: [],
    status: "draft",
    salaryDisclosed: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllJobs({ status: statusFilter });
      setJobs(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    supabase.from("clients").select("id, company_name").then(({ data }) => setClients(data || []));
  }, [statusFilter]);

  const handleSave = async () => {
    if (!user?.id || !form.title) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      await upsertJob(form, user.id);
      toast.success("Job saved");
      setOpen(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === "active") return "default";
    if (s === "paused") return "secondary";
    if (s === "closed") return "destructive";
    return "outline";
  };

  return (
    <DashboardPageShell width="wide" className="space-y-6">
      <PortalPageHeader
        title="Jobs management"
        subtitle="All client and Ellure job postings"
        action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Post Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={form.clientId || "ellure"} onValueChange={(v) => setForm({ ...form, clientId: v === "ellure" ? undefined : v })}>
                  <SelectTrigger><SelectValue placeholder="Post as Ellure" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ellure">Ellure Consulting</SelectItem>
                    {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={form.jobType} onValueChange={(v) => setForm({ ...form, jobType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["full-time", "part-time", "contract", "internship", "freelance"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Work Mode</Label>
                  <Select value={form.workMode} onValueChange={(v) => setForm({ ...form, workMode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["onsite", "remote", "hybrid"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skills Required</Label>
                <TagInput value={form.skillsRequired} onChange={(skills) => setForm({ ...form, skillsRequired: skills })} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.featured} onCheckedChange={(c) => setForm({ ...form, featured: !!c })} />
                <Label>Featured Job</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setForm({ ...form, status: "draft" })} disabled={saving}>Save Draft</Button>
                <Button onClick={() => { setForm({ ...form, status: "active" }); handleSave(); }} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        }
      />

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          {["all", "active", "draft", "paused", "closed"].map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className={portalPanelClass}>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Briefcase className="h-5 w-5" />All jobs</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
          ) : (
            <>
            <div className="space-y-2 md:hidden">
              {jobs.map((job, i) => (
                <div
                  key={job.id}
                  className={cn(
                    portalPanelClass,
                    "flex items-center justify-between gap-3 p-3",
                    i % 2 === 1 && "bg-card/80"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {(job.clients as { company_name?: string })?.company_name || "Ellure"}
                    </p>
                  </div>
                  <Badge variant={statusColor(job.status)}>{job.status}</Badge>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{(job.clients as { company_name?: string })?.company_name || "Ellure"}</TableCell>
                    <TableCell><Badge variant={statusColor(job.status)}>{job.status}</Badge></TableCell>
                    <TableCell>{job.applications_count ?? 0}</TableCell>
                    <TableCell>{job.published_at ? new Date(job.published_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/dashboard/admin/jobs/${job.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      {job.status !== "active" && (
                        <Button size="sm" variant="ghost" onClick={() => updateJobStatus(job.id, "active").then(load)}>Activate</Button>
                      )}
                      {job.status === "active" && (
                        <Button size="sm" variant="ghost" onClick={() => updateJobStatus(job.id, "paused").then(load)}>Pause</Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => softDeleteJob(job.id).then(load)}>Close</Button>
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

const AdminJobsPage = () => (
  <Routes>
    <Route index element={<AdminJobsList />} />
    <Route path=":jobId" element={<AdminJobKanbanRoute />} />
  </Routes>
);

export default AdminJobsPage;


