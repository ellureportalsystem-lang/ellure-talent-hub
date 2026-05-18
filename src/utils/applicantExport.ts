import * as XLSX from "xlsx";
import type { Applicant } from "@/hooks/useApplicants";

export function exportApplicantsToExcel(applicants: Applicant[], filename = "candidates-export") {
  const rows = applicants.map((a) => ({
    Name: a.name,
    Email: a.email,
    Phone: a.phone,
    City: a.city || a.city_current_location || "",
    Designation: a.current_designation || a.job_role || "",
    Company: a.current_company || "",
    Experience: a.total_experience_years ?? a.total_experience_numbers ?? a.total_experience ?? "",
    Skills: a.key_skills || "",
    "Current CTC": a.current_ctc || "",
    "Expected CTC": a.expected_ctc || "",
    "Notice Period": a.notice_period || "",
    Education: a.highest_qualification || a.education_level || "",
    Status: a.status || "",
    "Profile %": a.profile_complete_percent ?? "",
    "Created At": a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Candidates");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportApplicantsToCsv(applicants: Applicant[], filename = "candidates-export") {
  const rows = applicants.map((a) => ({
    name: a.name,
    email: a.email,
    phone: a.phone,
    city: a.city || a.city_current_location || "",
    designation: a.current_designation || a.job_role || "",
    skills: a.key_skills || "",
    status: a.status || "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
