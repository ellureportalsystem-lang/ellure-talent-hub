import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchTeamMembers, inviteTeamMember } from "@/services/clientService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PortalListRow, PortalPageHeader } from "@/components/portal/portal-ui";
import { portalPanelClass } from "@/components/portal/portalStyles";

const ClientTeamPage = () => {
  const { user } = useAuth();
  const { data: ctx } = useClientContext();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const clientId = ctx?.client?.id;

  const load = () => {
    if (!clientId) return;
    setLoading(true);
    fetchTeamMembers(clientId).then(setMembers).finally(() => setLoading(false));
  };

  useEffect(load, [clientId]);

  const invite = async () => {
    if (!clientId || !user?.id || !email) return;
    try {
      await inviteTeamMember(clientId, email, role, user.id);
      toast.success("Invitation sent");
      setOpen(false);
      setEmail("");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invite failed");
    }
  };

  return (
    <DashboardPageShell width="standard" className="space-y-6">
      <PortalPageHeader
        title="Team"
        subtitle="Invite colleagues to your hiring workspace"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-10">
                <Plus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite team member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={invite} className="w-full">
                  Send invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className={portalPanelClass}>
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full rounded-xl" />
          ) : (
            <>
              <div className="space-y-2 md:hidden">
                {members.map((m, i) => (
                  <PortalListRow
                    key={m.id}
                    title={m.profiles?.full_name || m.email || "—"}
                    subtitle={m.email}
                    alternate={i % 2 === 1}
                    trailing={<Badge variant="outline">{m.role}</Badge>}
                  />
                ))}
              </div>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.profiles?.full_name || "—"}</TableCell>
                        <TableCell>{m.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{m.role}</Badge>
                        </TableCell>
                        <TableCell>{m.status || "active"}</TableCell>
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

export default ClientTeamPage;
