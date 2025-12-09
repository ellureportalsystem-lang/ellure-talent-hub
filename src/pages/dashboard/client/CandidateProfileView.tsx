import { useParams } from "react-router-dom";
import EnterpriseApplicantProfile from "@/pages/dashboard/admin/EnterpriseApplicantProfile";

const CandidateProfileView = () => {
  const { id } = useParams<{ id: string }>();
  
  // Use EnterpriseApplicantProfile with client view mode
  return <EnterpriseApplicantProfile viewMode="client" applicantId={id} />;
};

export default CandidateProfileView;
