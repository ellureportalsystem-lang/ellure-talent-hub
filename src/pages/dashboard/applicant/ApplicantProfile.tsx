// TEMPORARY: Demo mode - always shows UI with mock data
import EnterpriseApplicantProfile from "@/pages/dashboard/admin/EnterpriseApplicantProfile";
import { mockApplicants } from "@/data/mockApplicants";

const ApplicantProfile = () => {
  // TEMPORARY: Use first mock applicant for demo UI
  const demoApplicantId = mockApplicants[0].id.toString();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            <strong>⚠️ DEMO MODE:</strong> Showing profile UI with mock data for testing purposes.
          </p>
        </div>
        <EnterpriseApplicantProfile viewMode="applicant" applicantId={demoApplicantId} />
      </div>
    </div>
  );
};

export default ApplicantProfile;
