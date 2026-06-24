import EnterpriseApplicantProfile from "@/pages/dashboard/admin/EnterpriseApplicantProfile";

/** Read-only profile view — how recruiters see your profile. */
const ApplicantProfilePage = () => {
  return <EnterpriseApplicantProfile viewMode="applicant" applicantDisplayMode="view" />;
};

export default ApplicantProfilePage;
