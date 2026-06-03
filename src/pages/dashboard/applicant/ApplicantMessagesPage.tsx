import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

const ApplicantMessagesPage = () => (
  <DashboardPageShell width="full" className="min-h-0 p-0">
    <MessagingWorkspace dashboardRole="applicant" searchRoles={["admin", "client"]} />
  </DashboardPageShell>
);

export default ApplicantMessagesPage;
