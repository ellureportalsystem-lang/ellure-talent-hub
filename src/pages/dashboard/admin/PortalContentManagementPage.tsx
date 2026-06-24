import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  deleteBanner,
  deleteFaq,
  deleteWebinar,
  fetchAllBannersAdmin,
  fetchAllFaqsAdmin,
  fetchAllWebinarsAdmin,
  upsertBanner,
  upsertFaq,
  upsertWebinar,
  type PortalAudience,
  type PortalBanner,
  type PortalFaq,
  type PortalWebinar,
} from "@/services/portalContentService";

const AUDIENCES: PortalAudience[] = ["recruiter", "applicant", "admin", "all"];

function AudienceBadge({ audience }: { audience: PortalAudience }) {
  return (
    <Badge variant="outline" className="text-[10px] capitalize">
      {audience}
    </Badge>
  );
}

export default function PortalContentManagementPage() {
  const { user } = useAuth();
  const [banners, setBanners] = useState<PortalBanner[]>([]);
  const [webinars, setWebinars] = useState<PortalWebinar[]>([]);
  const [faqs, setFaqs] = useState<PortalFaq[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerDialog, setBannerDialog] = useState(false);
  const [webinarDialog, setWebinarDialog] = useState(false);
  const [faqDialog, setFaqDialog] = useState(false);

  const emptyBanner = (): Partial<PortalBanner> & Pick<PortalBanner, "title" | "audience"> => ({
    title: "",
    body: "",
    image_url: "",
    cta_label: "",
    cta_link: "",
    audience: "recruiter",
    sort_order: 0,
    is_active: true,
    starts_at: null,
    ends_at: null,
  });

  const emptyWebinar = (): Partial<PortalWebinar> & Pick<PortalWebinar, "title" | "scheduled_at" | "audience"> => ({
    title: "",
    description: "",
    scheduled_at: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    timezone: "Asia/Kolkata",
    registration_url: "",
    audience: "recruiter",
    sort_order: 0,
    is_active: true,
  });

  const emptyFaq = (): Partial<PortalFaq> & Pick<PortalFaq, "question" | "answer" | "audience"> => ({
    question: "",
    answer: "",
    audience: "applicant",
    sort_order: 0,
    is_active: true,
  });

  const [bannerForm, setBannerForm] = useState(emptyBanner());
  const [webinarForm, setWebinarForm] = useState(emptyWebinar());
  const [faqForm, setFaqForm] = useState(emptyFaq());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, w, f] = await Promise.all([
        fetchAllBannersAdmin(),
        fetchAllWebinarsAdmin(),
        fetchAllFaqsAdmin(),
      ]);
      setBanners(b);
      setWebinars(w);
      setFaqs(f);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveBanner = async () => {
    try {
      await upsertBanner(
        {
          ...bannerForm,
          image_url: bannerForm.image_url || null,
          body: bannerForm.body || null,
          cta_label: bannerForm.cta_label || null,
          cta_link: bannerForm.cta_link || null,
        },
        user?.id
      );
      toast.success(bannerForm.id ? "Banner updated" : "Banner created");
      setBannerDialog(false);
      setBannerForm(emptyBanner());
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const saveWebinar = async () => {
    try {
      const scheduled = webinarForm.scheduled_at.includes("T")
        ? new Date(webinarForm.scheduled_at).toISOString()
        : new Date(`${webinarForm.scheduled_at}T10:00:00`).toISOString();
      await upsertWebinar(
        {
          ...webinarForm,
          scheduled_at: scheduled,
          description: webinarForm.description || null,
          registration_url: webinarForm.registration_url || null,
        },
        user?.id
      );
      toast.success(webinarForm.id ? "Webinar updated" : "Webinar created");
      setWebinarDialog(false);
      setWebinarForm(emptyWebinar());
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  const saveFaq = async () => {
    try {
      await upsertFaq({ ...faqForm }, user?.id);
      toast.success(faqForm.id ? "FAQ updated" : "FAQ created");
      setFaqDialog(false);
      setFaqForm(emptyFaq());
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-[#333]">Portal content</h1>
        <p className="text-sm text-[#666]">
          Manage banners, webinars, and FAQs shown on recruiter and applicant dashboards.
        </p>
      </div>

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-[#0566CD] hover:bg-[#0066c0]"
              onClick={() => {
                setBannerForm(emptyBanner());
                setBannerDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add banner
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : banners.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-slate-500">
                No banners yet. Add one for the recruiter home hero or applicant tips.
              </CardContent>
            </Card>
          ) : (
            banners.map((b) => (
              <Card key={b.id}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{b.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <AudienceBadge audience={b.audience} />
                      <Badge variant={b.is_active ? "default" : "secondary"} className="text-[10px]">
                        {b.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setBannerForm(b);
                        setBannerDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600"
                      onClick={async () => {
                        await deleteBanner(b.id);
                        toast.success("Deleted");
                        await load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                {b.body && <CardContent className="pt-0 text-sm text-slate-600">{b.body}</CardContent>}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-[#0566CD] hover:bg-[#0066c0]"
              onClick={() => {
                setWebinarForm(emptyWebinar());
                setWebinarDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add webinar
            </Button>
          </div>
          {webinars.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-slate-500">No webinars scheduled.</CardContent>
            </Card>
          ) : (
            webinars.map((w) => (
              <Card key={w.id}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{w.title}</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(w.scheduled_at).toLocaleString()} · <AudienceBadge audience={w.audience} />
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setWebinarForm({
                          ...w,
                          scheduled_at: w.scheduled_at.slice(0, 16),
                        });
                        setWebinarDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600"
                      onClick={async () => {
                        await deleteWebinar(w.id);
                        toast.success("Deleted");
                        await load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              className="bg-[#0566CD] hover:bg-[#0066c0]"
              onClick={() => {
                setFaqForm(emptyFaq());
                setFaqDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add FAQ
            </Button>
          </div>
          {faqs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-slate-500">
                No FAQs — default copy is shown on the applicant dashboard until you add items here.
              </CardContent>
            </Card>
          ) : (
            faqs.map((f) => (
              <Card key={f.id}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-sm font-medium">{f.question}</CardTitle>
                    <AudienceBadge audience={f.audience} />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setFaqForm(f);
                        setFaqDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600"
                      onClick={async () => {
                        await deleteFaq(f.id);
                        toast.success("Deleted");
                        await load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-slate-600">{f.answer}</CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{bannerForm.id ? "Edit banner" : "New banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} />
            </div>
            <div>
              <Label>Body</Label>
              <Textarea value={bannerForm.body ?? ""} onChange={(e) => setBannerForm({ ...bannerForm, body: e.target.value })} />
            </div>
            <div>
              <Label>Image URL (optional)</Label>
              <Input value={bannerForm.image_url ?? ""} onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>CTA label</Label>
                <Input value={bannerForm.cta_label ?? ""} onChange={(e) => setBannerForm({ ...bannerForm, cta_label: e.target.value })} />
              </div>
              <div>
                <Label>CTA link</Label>
                <Input value={bannerForm.cta_link ?? ""} onChange={(e) => setBannerForm({ ...bannerForm, cta_link: e.target.value })} placeholder="/dashboard/client/resdex" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Audience</Label>
                <Select value={bannerForm.audience} onValueChange={(v) => setBannerForm({ ...bannerForm, audience: v as PortalAudience })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort order</Label>
                <Input type="number" value={bannerForm.sort_order ?? 0} onChange={(e) => setBannerForm({ ...bannerForm, sort_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={bannerForm.is_active ?? true} onCheckedChange={(c) => setBannerForm({ ...bannerForm, is_active: c })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => void saveBanner()} className="bg-[#0566CD] hover:bg-[#0066c0]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={webinarDialog} onOpenChange={setWebinarDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{webinarForm.id ? "Edit webinar" : "New webinar"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={webinarForm.title} onChange={(e) => setWebinarForm({ ...webinarForm, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={webinarForm.description ?? ""} onChange={(e) => setWebinarForm({ ...webinarForm, description: e.target.value })} />
            </div>
            <div>
              <Label>Date & time</Label>
              <Input type="datetime-local" value={webinarForm.scheduled_at.slice(0, 16)} onChange={(e) => setWebinarForm({ ...webinarForm, scheduled_at: e.target.value })} />
            </div>
            <div>
              <Label>Registration URL</Label>
              <Input value={webinarForm.registration_url ?? ""} onChange={(e) => setWebinarForm({ ...webinarForm, registration_url: e.target.value })} />
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={webinarForm.audience} onValueChange={(v) => setWebinarForm({ ...webinarForm, audience: v as PortalAudience })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={webinarForm.is_active ?? true} onCheckedChange={(c) => setWebinarForm({ ...webinarForm, is_active: c })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => void saveWebinar()} className="bg-[#0566CD] hover:bg-[#0066c0]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{faqForm.id ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Question</Label>
              <Input value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} rows={4} />
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={faqForm.audience} onValueChange={(v) => setFaqForm({ ...faqForm, audience: v as PortalAudience })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={faqForm.is_active ?? true} onCheckedChange={(c) => setFaqForm({ ...faqForm, is_active: c })} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => void saveFaq()} className="bg-[#0566CD] hover:bg-[#0066c0]">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
