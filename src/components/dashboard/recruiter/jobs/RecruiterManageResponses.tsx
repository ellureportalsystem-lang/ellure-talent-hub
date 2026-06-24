import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { RecruiterJobsSidebar } from "./RecruiterJobsSidebar";

/** Manage NVite & job responses — Naukri-style placeholder with sidebar */
export function RecruiterManageResponses() {
  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#f4f5f7]">
      <RecruiterJobsSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-4">Manage Responses</h1>
        <Card className="border-slate-200 max-w-lg">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-600">
              NVite and job responses appear here after you send campaigns or publish jobs.
            </p>
            <Link to="/dashboard/client/jobs" className="mt-4 inline-block text-sm text-[#0566CD] hover:underline">
              View your jobs
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
