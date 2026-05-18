import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ApplicantProfileDrawer } from "@/components/jobs/ApplicantProfileDrawer";
import { fetchJobApplications, moveApplicationStage, type ApplicationStage } from "@/services/jobService";
import { useAuth } from "@/contexts/AuthContext";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STAGES: { id: ApplicationStage; label: string; color: string }[] = [
  { id: "applied", label: "Applied", color: "border-t-blue-500 bg-blue-500/5" },
  { id: "screening", label: "Screening", color: "border-t-yellow-500 bg-yellow-500/5" },
  { id: "interview_scheduled", label: "Interview", color: "border-t-orange-500 bg-orange-500/5" },
  { id: "offered", label: "Offer", color: "border-t-purple-500 bg-purple-500/5" },
  { id: "hired", label: "Hired", color: "border-t-green-500 bg-green-500/5" },
  { id: "rejected", label: "Rejected", color: "border-t-red-500 bg-red-500/5" },
];

type AppRow = {
  id: string;
  current_stage: ApplicationStage;
  applied_at: string;
  applicants?: {
    id: string;
    name?: string;
    profile_image?: string;
    key_skills?: string | string[];
    total_experience_years?: number;
    city?: string;
  };
};

function parseSkills(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.slice(0, 3);
  return raw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean).slice(0, 3);
}

function KanbanCard({
  app,
  onOpen,
}: {
  app: AppRow;
  onOpen: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id });
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const a = app.applicants;
  const skills = parseSkills(a?.key_skills);
  const initials = (a?.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("cursor-grab active:cursor-grabbing border shadow-sm", isDragging && "opacity-50")}
      {...listeners}
      {...attributes}
      onClick={onOpen}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={a?.profile_image} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <p className="font-medium text-sm truncate">{a?.name || "Applicant"}</p>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px] px-1 py-0">{s}</Badge>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {a?.total_experience_years != null ? `${a.total_experience_years} yrs` : "—"}
          {a?.city ? ` · ${a.city}` : ""}
        </p>
        <p className="text-[10px] text-muted-foreground">
          Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "—"}
        </p>
      </CardContent>
    </Card>
  );
}

function StageColumn({
  stage,
  apps,
  onOpenCard,
}: {
  stage: (typeof STAGES)[0];
  apps: AppRow[];
  onOpenCard: (app: AppRow) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <Card className={cn("min-w-[240px] flex-shrink-0 border-t-4", stage.color, isOver && "ring-2 ring-primary")}>
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-sm flex justify-between">
          {stage.label}
          <Badge variant="secondary" className="text-xs">{apps.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent ref={setNodeRef} className="p-2 space-y-2 min-h-[120px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {apps.map((app) => (
          <KanbanCard key={app.id} app={app} onOpen={() => onOpenCard(app)} />
        ))}
      </CardContent>
    </Card>
  );
}

interface JobApplicationsKanbanProps {
  jobId: string;
  jobTitle?: string;
  backPath: string;
  backLabel?: string;
}

export function JobApplicationsKanban({ jobId, jobTitle, backPath, backLabel = "Back to jobs" }: JobApplicationsKanbanProps) {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerApplicantId, setDrawerApplicantId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const load = useCallback(() => {
    setLoading(true);
    fetchJobApplications(jobId)
      .then((data) => setApps(data as AppRow[]))
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    load();
  }, [load]);

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const overId = e.over?.id as ApplicationStage | undefined;
    const appId = String(e.active.id);
    if (!overId || !STAGES.some((s) => s.id === overId)) return;
    const app = apps.find((a) => a.id === appId);
    if (!app || app.current_stage === overId) return;
    try {
      await moveApplicationStage(appId, overId, user?.id || "");
      setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, current_stage: overId } : a)));
      toast.success(`Moved to ${STAGES.find((s) => s.id === overId)?.label}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
      load();
    }
  };

  const activeApp = activeId ? apps.find((a) => a.id === activeId) : null;

  const openDrawer = (app: AppRow) => {
    if (app.applicants?.id) {
      setDrawerApplicantId(app.applicants.id);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[100vw] overflow-hidden">
      <Button variant="ghost" size="sm" asChild>
        <Link to={backPath}>← {backLabel}</Link>
      </Button>
      <div>
        <h2 className="text-xl font-bold">{jobTitle || "Applications"}</h2>
        <p className="text-sm text-muted-foreground">Drag cards between stages to update pipeline</p>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto">
          {STAGES.map((s) => <Skeleton key={s.id} className="min-w-[240px] h-64" />)}
        </div>
      ) : apps.length === 0 ? (
        <EmptyState icon={Users} title="No applications yet" description="Applications will appear here when candidates apply." />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map((stage) => (
              <StageColumn
                key={stage.id}
                stage={stage}
                apps={apps.filter((a) => a.current_stage === stage.id)}
                onOpenCard={openDrawer}
              />
            ))}
          </div>
          <DragOverlay>
            {activeApp ? (
              <Card className="w-[220px] shadow-lg opacity-90">
                <CardContent className="p-3">
                  <p className="font-medium text-sm">{activeApp.applicants?.name}</p>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <ApplicantProfileDrawer applicantId={drawerApplicantId} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
