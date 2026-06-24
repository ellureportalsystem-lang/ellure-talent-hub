import { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchApplicantApplications, fetchApplicationStages } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { ApplicationStageTimeline } from "@/components/applicant/ApplicationStageTimeline";
import { cn } from "@/lib/utils";

const stageColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  applied: "outline",
  screening: "secondary",
  shortlisted: "secondary",
  interview_scheduled: "default",
  interviewed: "default",
  offer: "default",
  offered: "default",
  hired: "default",
  rejected: "destructive",
  withdrawn: "outline",
};

const ApplicantApplicationsPage = () => {
  const { user, profile } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stagesByApp, setStagesByApp] = useState<Record<string, Awaited<ReturnType<typeof fetchApplicationStages>>>>({});
  const [loadingStages, setLoadingStages] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      let aid = profile?.applicant_id;
      if (!aid && user?.id) {
        const { data } = await supabase.from("applicants").select("id").eq("user_id", user.id).maybeSingle();
        aid = data?.id;
      }
      if (!aid) { setLoading(false); return; }
      try {
        setApps(await fetchApplicantApplications(aid));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, profile]);

  const toggleExpand = async (appId: string) => {
    if (expandedId === appId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(appId);
    if (!stagesByApp[appId]) {
      setLoadingStages(appId);
      try {
        const stages = await fetchApplicationStages(appId);
        setStagesByApp((prev) => ({ ...prev, [appId]: stages }));
      } catch {
        setStagesByApp((prev) => ({ ...prev, [appId]: [] }));
      } finally {
        setLoadingStages(null);
      }
    }
  };

  const renderTimeline = (app: any) => {
    if (loadingStages === app.id) {
      return <Skeleton className="h-24 w-full" />;
    }
    return (
      <ApplicationStageTimeline
        stages={stagesByApp[app.id] ?? []}
        appliedAt={app.applied_at}
        currentStage={app.current_stage}
      />
    );
  };

  return (
    <DashboardPageShell width="standard" className="space-y-5 pb-20 lg:pb-5">
      <PortalPageHeader title="My applications" subtitle="Track progress across your job applications" />

      <Card className={portalPanelClass}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Application history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : apps.length === 0 ? (
            <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No applications yet.
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {apps.map((a) => (
                  <div key={a.id} className={cn(portalPanelClass, "overflow-hidden")}>
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-3 p-4 text-left"
                      onClick={() => toggleExpand(a.id)}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{a.jobs?.title || "—"}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {(a.jobs?.clients as { company_name?: string })?.company_name || "—"}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Applied{" "}
                          <span className="font-medium text-foreground">
                            {a.applied_at ? format(new Date(a.applied_at), "dd MMM yyyy") : "—"}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge variant={stageColors[a.current_stage] || "outline"}>
                          {a.current_stage}
                        </Badge>
                        {expandedId === a.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {expandedId === a.id && (
                      <div className="border-t bg-muted/20 px-4 py-3">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Status timeline</p>
                        {renderTimeline(a)}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8" />
                      <TableHead>Job</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apps.map((a) => (
                      <Fragment key={a.id}>
                        <TableRow className="cursor-pointer" onClick={() => toggleExpand(a.id)}>
                          <TableCell>
                            {expandedId === a.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>{a.jobs?.title || "—"}</TableCell>
                          <TableCell>{(a.jobs?.clients as { company_name?: string })?.company_name || "—"}</TableCell>
                          <TableCell>{a.applied_at ? format(new Date(a.applied_at), "dd MMM yyyy") : "—"}</TableCell>
                          <TableCell>
                            <Badge variant={stageColors[a.current_stage] || "outline"}>{a.current_stage}</Badge>
                          </TableCell>
                        </TableRow>
                        {expandedId === a.id && (
                          <TableRow key={`${a.id}-timeline`}>
                            <TableCell colSpan={5} className="bg-muted/20">
                              <div className="py-2">
                                <p className="mb-2 text-xs font-medium text-muted-foreground">Status timeline</p>
                                {renderTimeline(a)}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
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

export default ApplicantApplicationsPage;
