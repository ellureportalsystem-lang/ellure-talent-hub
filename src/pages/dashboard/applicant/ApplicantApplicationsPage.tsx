import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchApplicantApplications } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";
import { cn } from "@/lib/utils";

const stageColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  applied: "outline",
  screening: "secondary",
  interview_scheduled: "default",
  offered: "default",
  hired: "default",
  rejected: "destructive",
};

const ApplicantApplicationsPage = () => {
  const { user, profile } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardPageShell width="standard" className="space-y-5">
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
              {/* Mobile: card list */}
              <div className="space-y-3 md:hidden">
                {apps.map((a) => (
                  <div key={a.id} className={cn(portalPanelClass, "p-4 active:scale-[0.99]")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{a.jobs?.title || "—"}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {(a.jobs?.clients as { company_name?: string })?.company_name || "—"}
                        </p>
                      </div>
                      <Badge variant={stageColors[a.current_stage] || "outline"} className="shrink-0">
                        {a.current_stage}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Applied{" "}
                      <span className="font-medium text-foreground">
                        {a.applied_at ? format(new Date(a.applied_at), "dd MMM yyyy") : "—"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop/tablet: table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apps.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.jobs?.title || "—"}</TableCell>
                        <TableCell>{(a.jobs?.clients as { company_name?: string })?.company_name || "—"}</TableCell>
                        <TableCell>{a.applied_at ? format(new Date(a.applied_at), "dd MMM yyyy") : "—"}</TableCell>
                        <TableCell>
                          <Badge variant={stageColors[a.current_stage] || "outline"}>{a.current_stage}</Badge>
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

export default ApplicantApplicationsPage;

