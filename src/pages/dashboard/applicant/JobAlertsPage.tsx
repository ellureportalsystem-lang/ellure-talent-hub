import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { upsertJobAlert, deleteJobAlert, fetchJobAlerts } from "@/services/jobService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const JobAlertsPage = () => {
  const { profile, user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [applicantId, setApplicantId] = useState<string | null>(null);

  const load = async (aid: string) => {
    setLoading(true);
    try {
      setAlerts(await fetchJobAlerts(aid));
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
  }, [profile, user]);

  const toggleActive = async (alert: { id: string; is_active?: boolean }) => {
    if (!applicantId) return;
    await supabase.from("job_alerts").update({ is_active: !alert.is_active }).eq("id", alert.id);
    load(applicantId);
  };

  const createAlert = async () => {
    if (!applicantId) return;
    await upsertJobAlert(applicantId, { keywords, locations, frequency, isActive: true });
    toast.success("Alert created");
    setOpen(false);
    setKeywords([]);
    setLocations([]);
    load(applicantId);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Job alerts</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Get notified about roles that match you</p>
        </div>
        <Button onClick={() => setOpen(true)} className="h-10 shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {loading ? <Skeleton className="h-32 w-full" /> : alerts.length === 0 ? (
        <EmptyState icon={Bell} title="No alerts yet" description="Create one to get notified about matching jobs." actionLabel="Create New Alert" onAction={() => setOpen(true)} />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id} className="dashboard-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(a.keywords || []).map((k: string) => <Badge key={k} variant="secondary">{k}</Badge>)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(a.locations || []).map((l: string) => <Badge key={l} variant="outline">{l}</Badge>)}
                  </div>
                  <Badge className="mt-2">{a.frequency}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={a.is_active !== false} onCheckedChange={() => toggleActive(a)} />
                  <Button variant="ghost" size="icon" onClick={() => deleteJobAlert(a.id).then(() => load(applicantId!))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Job Alert</DialogTitle></DialogHeader>
          <Label>Keywords</Label>
          <TagInput value={keywords} onChange={setKeywords} maxTags={10} />
          <Label className="mt-3">Locations</Label>
          <TagInput value={locations} onChange={(v) => setLocations(v.slice(0, 5))} maxTags={5} />
          <Label className="mt-3">Frequency</Label>
          <RadioGroup value={frequency} onValueChange={setFrequency} className="flex gap-4">
            <label className="flex items-center gap-2"><RadioGroupItem value="daily" /> Daily</label>
            <label className="flex items-center gap-2"><RadioGroupItem value="weekly" /> Weekly</label>
          </RadioGroup>
          <DialogFooter><Button onClick={createAlert}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobAlertsPage;
