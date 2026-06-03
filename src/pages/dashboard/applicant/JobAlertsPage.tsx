import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { upsertJobAlert, deleteJobAlert, fetchJobAlerts } from "@/services/jobService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalEmptyState, PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
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
    <DashboardPageShell width="standard" className="space-y-5">
      <PortalPageHeader
        title="Job alerts"
        subtitle="Get notified about roles that match you"
        action={
          <Button onClick={() => setOpen(true)} className="h-10 shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        }
      />

      {loading ? (
        <Skeleton className="h-32 w-full rounded-2xl" />
      ) : alerts.length === 0 ? (
        <PortalEmptyState
          title="No alerts yet"
          description="Create one to get notified about matching jobs."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create alert
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id} className={portalPanelClass}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
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
    </DashboardPageShell>
  );
};

export default JobAlertsPage;
