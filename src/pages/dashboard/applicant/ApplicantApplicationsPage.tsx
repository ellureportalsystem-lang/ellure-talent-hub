import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchApplicantApplications } from "@/services/jobService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Applications</h1>
      <Card>
        <CardHeader><CardTitle>Application History</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-40 w-full" /> : (
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
                    <TableCell><Badge variant={stageColors[a.current_stage] || "outline"}>{a.current_stage}</Badge></TableCell>
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

export default ApplicantApplicationsPage;

