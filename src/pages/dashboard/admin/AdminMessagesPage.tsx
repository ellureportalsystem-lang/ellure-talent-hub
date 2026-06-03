import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

const AdminMessagesPage = () => (
  <DashboardPageShell width="full" className="min-h-0 p-0">
    <MessagingWorkspace dashboardRole="admin" searchRoles={["client", "applicant"]} />
  </DashboardPageShell>
);

export default AdminMessagesPage;
