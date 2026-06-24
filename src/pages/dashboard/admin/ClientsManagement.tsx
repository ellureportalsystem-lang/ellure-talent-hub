import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, UserPlus, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { approveClient } from "@/services/dashboardService";
import {
  fetchClients,
  suspendClient,
  archiveClient,
  updateClientPlan,
  createClientRecord,
  type ClientListRow,
  type ClientFilters,
} from "@/services/clientAdminService";
import { formatDateIST } from "@/lib/dateFormat";
import { useAuth } from "@/contexts/AuthContext";

const ClientsManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [clients, setClients] = useState<ClientListRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const statusFromUrl = searchParams.get("status");
  const initialStatus =
    statusFromUrl === "pending" || statusFromUrl === "active" || statusFromUrl === "inactive"
      ? statusFromUrl
      : undefined;
  const [filters, setFilters] = useState<ClientFilters>({
    page: 1,
    pageSize: 20,
    status: initialStatus,
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_person_name: "",
    contact_email: "",
    contact_phone: "",
    subscription_plan: "basic",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err, count: total } = await fetchClients(filters);
    if (err) {
      setError(err.message);
      setClients([]);
      setCount(0);
    } else {
      setClients(data);
      setCount(total);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "pending" || status === "active" || status === "inactive") {
      setFilters((f) => ({ ...f, status, page: 1 }));
    }
  }, [searchParams]);

  const handleApprove = async (id: string) => {
    try {
      await approveClient(id, user?.id);
      toast.success("Client approved");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Approval failed");
    }
  };

  const handleSuspend = async (id: string) => {
    const { error: err } = await suspendClient(id);
    if (err) toast.error(err.message);
    else {
      toast.success("Client suspended");
      void load();
    }
  };

  const handleArchive = async (id: string) => {
    const { error: err } = await archiveClient(id, user?.id);
    if (err) toast.error(err.message);
    else {
      toast.success("Recruiter archived");
      void load();
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    const { error: err } = await createClientRecord(form);
    setCreating(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    toast.success("Client created");
    setCreateOpen(false);
    setForm({
      company_name: "",
      contact_person_name: "",
      contact_email: "",
      contact_phone: "",
      subscription_plan: "basic",
    });
    void load();
  };

  const approvalBadge = (c: ClientListRow) => {
    if (!c.approved_at) return <Badge variant="outline">Pending approval</Badge>;
    if (!c.is_active) return <Badge variant="secondary">Inactive</Badge>;
    return <Badge className="bg-emerald-600">Active</Badge>;
  };

  const totalPages = Math.max(1, Math.ceil(count / (filters.pageSize ?? 20)));

  return (
    <DashboardPageShell title="Clients" description="Manage client accounts, plans, and approvals." icon={Building2}>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-base">Client accounts</CardTitle>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Create client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New client</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Company name</Label>
                  <Input
                    value={form.company_name}
                    onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Contact person</Label>
                  <Input
                    value={form.contact_person_name}
                    onChange={(e) => setForm((f) => ({ ...f, contact_person_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={form.contact_phone}
                    onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Plan</Label>
                  <Select
                    value={form.subscription_plan}
                    onValueChange={(v) => setForm((f) => ({ ...f, subscription_plan: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => void handleCreate()} disabled={creating}>
                  {creating ? "Creating..." : "Create client"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <Input
              placeholder="Search company or email..."
              className="max-w-xs"
              value={filters.search ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
            <Select
              value={filters.status ?? "all"}
              onValueChange={(v) =>
                setFilters((f) => ({
                  ...f,
                  status: v === "all" ? undefined : (v as ClientFilters["status"]),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending approval</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
              <Button variant="link" className="ml-2 h-auto p-0" onClick={() => void load()}>
                Retry
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No clients found.</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>CV usage</TableHead>
                      <TableHead>Jobs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.company_name}</TableCell>
                        <TableCell>{c.contact_person_name ?? "—"}</TableCell>
                        <TableCell>{c.contact_email ?? c.email}</TableCell>
                        <TableCell className="capitalize">{c.subscription_plan ?? "—"}</TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {c.cv_downloads_used_this_month ?? 0}/{c.max_cv_downloads_per_month ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm tabular-nums">
                          {c.job_postings_used ?? 0}/{c.max_job_postings ?? "—"}
                        </TableCell>
                        <TableCell>{approvalBadge(c)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/dashboard/admin/recruiters/${c.id}`)}>
                                View
                              </DropdownMenuItem>
                              {!c.approved_at && (
                                <DropdownMenuItem onClick={() => void handleApprove(c.id)}>
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {c.is_active && (
                                <DropdownMenuItem onClick={() => void handleSuspend(c.id)}>
                                  Suspend
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => void handleArchive(c.id)}
                              >
                                Archive account
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={async () => {
                                  const { error: err } = await updateClientPlan(c.id, {
                                    subscription_plan: "professional",
                                    max_cv_downloads_per_month: 100,
                                    max_job_postings: 10,
                                  });
                                  if (err) toast.error(err.message);
                                  else {
                                    toast.success("Plan updated");
                                    void load();
                                  }
                                }}
                              >
                                Upgrade to Professional
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Page {filters.page} of {totalPages} ({count} clients)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page ?? 1) <= 1}
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page ?? 1) >= totalPages}
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
};

export default ClientsManagement;
