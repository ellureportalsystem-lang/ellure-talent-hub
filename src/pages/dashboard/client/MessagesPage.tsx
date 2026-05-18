import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";

const MessagesPage = () => (
  <div className="p-4 lg:p-6">
    <MessagingWorkspace dashboardRole="client" searchRoles={["admin", "applicant"]} />
  </div>
);

export default MessagesPage;
