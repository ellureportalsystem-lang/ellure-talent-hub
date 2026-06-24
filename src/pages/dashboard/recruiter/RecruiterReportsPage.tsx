import ClientReportsPage from "@/pages/dashboard/client/ClientReportsPage";
import { NaukriPageContainer } from "@/components/dashboard/naukri/NaukriPageContainer";

/** Reports — live data from clientReportsService */
export default function RecruiterReportsPage() {
  return (
    <NaukriPageContainer className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-[#333]">Reports</h1>
        <p className="text-sm text-[#666]">Resdex usage, hiring funnel, and job performance</p>
      </div>

      <ClientReportsPage embedded />
    </NaukriPageContainer>
  );
}
