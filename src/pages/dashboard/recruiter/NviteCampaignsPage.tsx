import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";
import { naukriCardClass } from "@/components/dashboard/naukri/naukriShellStyles";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, ChevronRight, ArrowLeft } from "lucide-react";
import { useClientContext } from "@/hooks/useClientContext";
import {
  fetchNviteCampaigns,
  fetchCampaignInvites,
  type NviteCampaignRow,
  type NviteInviteRow,
} from "@/services/nviteService";
import { formatDateIST } from "@/lib/dateFormat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function pct(num: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((num / total) * 100)}%`;
}

export default function NviteCampaignsPage() {
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;
  const location = useLocation();
  const successState = location.state as { success?: boolean; sent?: number } | null;

  const [campaigns, setCampaigns] = useState<NviteCampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [invites, setInvites] = useState<NviteInviteRow[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  useEffect(() => {
    if (successState?.success) {
      toast.success(`Campaign sent to ${successState.sent ?? 0} candidate(s)`);
      window.history.replaceState({}, document.title);
    }
  }, [successState]);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    fetchNviteCampaigns(clientId)
      .then(setCampaigns)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [clientId]);

  useEffect(() => {
    if (!selectedId) {
      setInvites([]);
      return;
    }
    setLoadingInvites(true);
    fetchCampaignInvites(selectedId)
      .then(setInvites)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingInvites(false));
  }, [selectedId]);

  const selected = campaigns.find((c) => c.id === selectedId);

  if (selected) {
    return (
      <NaukriPageContainer className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={() => setSelectedId(null)}>
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </Button>
        <Card className={naukriCardClass}>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold text-slate-900">{selected.subject}</h2>
            <p className="text-sm text-slate-500">
              {selected.jobs?.title && <>Job: {selected.jobs.title} · </>}
              Sent: {formatDateIST(selected.sent_at)} · Status: {selected.status}
            </p>
            <div className="flex gap-4 text-sm">
              <span>Sent: <strong>{selected.total_sent}</strong></span>
              <span>Opened: <strong>{pct(selected.total_opened, selected.total_sent)}</strong></span>
              <span>Responded: <strong>{pct(selected.total_responded, selected.total_sent)}</strong></span>
            </div>
          </CardContent>
        </Card>

        <Card className={naukriCardClass}>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-4 py-2">Candidate</th>
                  <th className="px-4 py-2">Sent</th>
                  <th className="px-4 py-2">Opened</th>
                  <th className="px-4 py-2">Responded</th>
                  <th className="px-4 py-2">Answers</th>
                </tr>
              </thead>
              <tbody>
                {loadingInvites ? (
                  <tr><td colSpan={5} className="p-4"><Skeleton className="h-8 w-full" /></td></tr>
                ) : invites.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No invites in this campaign</td></tr>
                ) : (
                  invites.map((inv) => (
                    <tr key={inv.id} className="border-b border-slate-100">
                      <td className="px-4 py-2.5">
                        <p className="font-medium">{inv.applicants?.name ?? "—"}</p>
                        <p className="text-xs text-slate-400">{inv.applicants?.email}</p>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{formatDateIST(inv.sent_at)}</td>
                      <td className="px-4 py-2.5">{inv.email_opened_at ? formatDateIST(inv.email_opened_at) : "—"}</td>
                      <td className="px-4 py-2.5">{inv.responded_at ? formatDateIST(inv.responded_at) : "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 max-w-[200px] truncate">
                        {Array.isArray(inv.answers) && inv.answers.length
                          ? JSON.stringify(inv.answers)
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </NaukriPageContainer>
    );
  }

  return (
    <NaukriPageContainer className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Send className="h-5 w-5 text-[#0566CD]" /> NVite Campaigns
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track opens, responses, and per-candidate status</p>
        </div>
        <Button asChild className="bg-[#0566CD] hover:bg-[#0066c0]">
          <Link to="/dashboard/client/resdex/results?nvite=1">New NVite</Link>
        </Button>
      </div>

      <Card className={naukriCardClass}>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Job</th>
                <th className="px-4 py-2">Sent</th>
                <th className="px-4 py-2">Opened</th>
                <th className="px-4 py-2">Responded</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 w-8" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="p-3"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500">
                    No campaigns yet. Select candidates from Resdex and send your first NVite.
                  </td>
                </tr>
              ) : (
                campaigns.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedId(row.id)}
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-800 max-w-[220px] truncate">{row.subject}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.jobs?.title ?? "—"}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.total_sent}</td>
                    <td className="px-4 py-2.5 tabular-nums">{pct(row.total_opened, row.total_sent)}</td>
                    <td className="px-4 py-2.5 tabular-nums">{pct(row.total_responded, row.total_sent)}</td>
                    <td className="px-4 py-2.5 text-slate-600">{formatDateIST(row.sent_at ?? row.created_at)}</td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          row.status === "sent" && "border-emerald-300 text-emerald-700",
                          row.status === "failed" && "border-red-300 text-red-700",
                          row.status === "scheduled" && "border-amber-300 text-amber-700",
                        )}
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5"><ChevronRight className="h-4 w-4 text-slate-400" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </NaukriPageContainer>
  );
}
