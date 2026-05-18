import * as XLSX from "xlsx";
import type { Applicant } from "@/hooks/useApplicants";

function skillText(a: Applicant): string {
  if (a.key_skills) return a.key_skills;
  if (a.skill) return a.skill;
  return "";
}

function formatTs(v?: string): string {
  if (!v) return "";
  return new Date(v).toLocaleDateString();
}

/** Export helpers for admin/client candidate lists sourced from Postgres (via useApplicants shape). */
export interface ExportField {
  key: string;
  label: string;
  category: "basic" | "contact" | "professional" | "education" | "other";
  getValue: (applicant: Applicant) => string | number;
}

export const exportFields: ExportField[] = [
  { key: "name", label: "Full Name", category: "basic", getValue: (a) => a.name ?? "" },
  { key: "gender", label: "Gender", category: "basic", getValue: () => "" },
  { key: "age", label: "Age", category: "basic", getValue: () => "" },
  { key: "currentCity", label: "Current City", category: "basic", getValue: (a) => a.city || a.city_current_location || "" },
  { key: "preferredCity", label: "Preferred City", category: "basic", getValue: () => "" },
  { key: "email", label: "Email", category: "contact", getValue: (a) => a.email ?? "" },
  { key: "phone", label: "Phone", category: "contact", getValue: (a) => a.phone ?? "" },
  {
    key: "designation",
    label: "Designation",
    category: "professional",
    getValue: (a) => a.current_designation || a.job_role || a.skill_job_role_applying_for || "",
  },
  { key: "currentCompany", label: "Current Company", category: "professional", getValue: (a) => a.current_company ?? "" },
  {
    key: "experience",
    label: "Experience (Years)",
    category: "professional",
    getValue: (a) => a.total_experience_years ?? a.total_experience_numbers ?? a.total_experience ?? "",
  },
  { key: "primarySkill", label: "Primary Skill", category: "professional", getValue: (a) => a.skill_job_role_applying_for || a.skill || "" },
  { key: "skills", label: "All Skills", category: "professional", getValue: (a) => skillText(a) },
  { key: "currentCTC", label: "Current CTC (LPA)", category: "professional", getValue: (a) => a.current_ctc ?? "" },
  { key: "expectedCTC", label: "Expected CTC (LPA)", category: "professional", getValue: (a) => a.expected_ctc ?? "" },
  { key: "noticePeriod", label: "Notice Period", category: "professional", getValue: (a) => a.notice_period ?? "" },
  { key: "communicationSkill", label: "Communication Skill", category: "professional", getValue: () => "" },
  { key: "pastCompanies", label: "Past Companies", category: "professional", getValue: () => "" },
  {
    key: "highestQualification",
    label: "Highest Qualification",
    category: "education",
    getValue: (a) => a.highest_qualification || a.education_level || "",
  },
  { key: "degree", label: "Degree", category: "education", getValue: () => "" },
  { key: "university", label: "University", category: "education", getValue: () => "" },
  { key: "yearOfPassing", label: "Year of Passing", category: "education", getValue: () => "" },
  { key: "percentage", label: "Percentage/CGPA", category: "education", getValue: () => "" },
  { key: "status", label: "Status", category: "other", getValue: (a) => a.status ?? "" },
  { key: "lastActive", label: "Last Active", category: "other", getValue: (a) => formatTs(a.updated_at) },
  { key: "registeredDate", label: "Registered Date", category: "other", getValue: (a) => formatTs(a.created_at) },
  { key: "resumeUpdated", label: "Resume Updated", category: "other", getValue: () => "" },
];

export const defaultSelectedFields = [
  "name",
  "email",
  "phone",
  "designation",
  "currentCompany",
  "experience",
  "skills",
  "currentCity",
  "currentCTC",
  "noticePeriod",
];

export const exportToCSV = (applicants: Applicant[], selectedFieldKeys: string[], filename: string) => {
  const fields = exportFields.filter((f) => selectedFieldKeys.includes(f.key));

  const headers = fields.map((f) => f.label);

  const rows = applicants.map((applicant) =>
    fields.map((f) => {
      const value = f.getValue(applicant);
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    })
  );

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (applicants: Applicant[], selectedFieldKeys: string[], filename: string) => {
  const fields = exportFields.filter((f) => selectedFieldKeys.includes(f.key));

  const data = [
    fields.map((f) => f.label),
    ...applicants.map((applicant) => fields.map((f) => f.getValue(applicant))),
  ];

  const wb = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  const colWidths = fields.map((f) => ({ wch: Math.max(f.label.length, 15) }));
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, worksheet, "Candidates");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const getFieldsByCategory = () => {
  const categories = {
    basic: { label: "Basic Information", fields: [] as ExportField[] },
    contact: { label: "Contact Details", fields: [] as ExportField[] },
    professional: { label: "Professional Details", fields: [] as ExportField[] },
    education: { label: "Education", fields: [] as ExportField[] },
    other: { label: "Other", fields: [] as ExportField[] },
  };

  exportFields.forEach((field) => {
    categories[field.category].fields.push(field);
  });

  return categories;
};
