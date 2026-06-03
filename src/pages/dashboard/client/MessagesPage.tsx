import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

const MessagesPage = () => (
  <DashboardPageShell width="full" className="min-h-0 p-0">
    <MessagingWorkspace dashboardRole="client" searchRoles={["admin", "applicant"]} />
  </DashboardPageShell>
);

export default MessagesPage;
