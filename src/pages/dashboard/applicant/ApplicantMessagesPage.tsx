import { MessagingWorkspace } from "@/components/messages/MessagingWorkspace";

const ApplicantMessagesPage = () => (
  <div className="p-4 lg:p-6">
    <MessagingWorkspace dashboardRole="applicant" searchRoles={["admin", "client"]} />
  </div>
);

export default ApplicantMessagesPage;
