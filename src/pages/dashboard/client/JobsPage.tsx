import { Routes, Route, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { JobApplicationsKanban } from "@/components/jobs/JobApplicationsKanban";
import { RecruiterJobsHome } from "@/components/dashboard/recruiter/jobs/RecruiterJobsHome";
import RecruiterPostJobPage from "@/components/dashboard/recruiter/jobs/RecruiterPostJobPage";
import { RecruiterManageResponses } from "@/components/dashboard/recruiter/jobs/RecruiterManageResponses";
import { RecruiterJobsSidebar } from "@/components/dashboard/recruiter/jobs/RecruiterJobsSidebar";

const JobApplicationsRoute = () => {
  const { jobId } = useParams();
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (!jobId) return;
    supabase.from("jobs").select("title").eq("id", jobId).single().then(({ data }) => setTitle(data?.title || ""));
  }, [jobId]);
  if (!jobId) return null;
  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#f4f5f7]">
      <RecruiterJobsSidebar />
      <div className="flex-1 min-w-0 p-4">
        <JobApplicationsKanban jobId={jobId} jobTitle={title} backPath="/dashboard/client/jobs" />
      </div>
    </div>
  );
};

/** Jobs & Responses — Naukri-style recruiter module */
const JobsPage = () => (
  <Routes>
    <Route index element={<RecruiterJobsHome />} />
    <Route path="post" element={<RecruiterPostJobPage />} />
    <Route path="responses" element={<RecruiterManageResponses />} />
    <Route path=":jobId/applications" element={<JobApplicationsRoute />} />
  </Routes>
);

export default JobsPage;
