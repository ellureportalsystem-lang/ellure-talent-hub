import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";

const AdminMessagesPage = () => (
  <div className="p-4 lg:p-6">
    <MessagingWorkspace dashboardRole="admin" searchRoles={["client", "applicant"]} />
  </div>
);

export default AdminMessagesPage;
