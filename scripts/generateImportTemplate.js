/**
 * Generates public/templates/ellure_candidate_import_template.xlsx
 * Run: node scripts/generateImportTemplate.js
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/templates");
const outPath = join(outDir, "ellure_candidate_import_template.xlsx");

const HEADERS = [
  "name",
  "email",
  "phone",
  "city",
  "job_role",
  "current_designation",
  "current_company",
  "total_experience_years",
  "experience_type",
  "current_ctc",
  "expected_ctc",
  "notice_period",
  "education_level",
  "highest_qualification",
  "course_degree_name",
  "university_institute_name",
  "year_of_passing",
  "education_board",
  "medium_of_study",
  "key_skills",
  "communication",
  "gender",
  "headline",
  "status",
  "registration_date",
];

const SAMPLE = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "9876543210",
  city: "Pune",
  job_role: "Data Analyst",
  current_designation: "Analyst",
  current_company: "Acme Corp",
  total_experience_years: 3,
  experience_type: "Mid-Level",
  current_ctc: "5",
  expected_ctc: "7",
  notice_period: "30 Days",
  education_level: "Graduate",
  highest_qualification: "B.Tech",
  course_degree_name: "B.Tech IT",
  university_institute_name: "SPPU",
  year_of_passing: 2020,
  education_board: "State Board",
  medium_of_study: "English",
  key_skills: "SQL, Python, Excel",
  communication: "Good",
  gender: "Female",
  headline: "Data analyst with 3 yrs experience",
  status: "submitted",
  registration_date: "2024-01-15",
};

const FIELD_GUIDE = [
  ["Column", "Required", "Description", "Example"],
  ["name", "Yes", "Full name of the candidate", "Jane Doe"],
  ["email", "Yes", "Unique email address", "jane.doe@example.com"],
  ["phone", "Yes", "10-digit mobile number", "9876543210"],
  ["city", "No", "Current city / location", "Pune"],
  ["job_role", "No", "Role the candidate is applying for", "Data Analyst"],
  ["current_designation", "No", "Current job title", "Analyst"],
  ["current_company", "No", "Current employer", "Acme Corp"],
  ["total_experience_years", "No", "Numeric years of experience", "3"],
  ["experience_type", "No", "Fresher, Junior, Mid-Level, Senior", "Mid-Level"],
  ["current_ctc", "No", "Current CTC in LPA", "5"],
  ["expected_ctc", "No", "Expected CTC in LPA", "7"],
  ["notice_period", "No", "Immediate, 15/30/45/60/90 Days", "30 Days"],
  ["education_level", "No", "Graduate, Post Graduate, Diploma, 12th, 10th", "Graduate"],
  ["highest_qualification", "No", "Degree name", "B.Tech"],
  ["course_degree_name", "No", "Course or degree title", "B.Tech IT"],
  ["university_institute_name", "No", "Institution name", "SPPU"],
  ["year_of_passing", "No", "Graduation year", "2020"],
  ["education_board", "No", "Education board", "State Board"],
  ["medium_of_study", "No", "Medium of study", "English"],
  ["key_skills", "No", "Comma-separated skills", "SQL, Python"],
  ["communication", "No", "Excellent, Good, Average, Below Average", "Good"],
  ["gender", "No", "Male, Female, Other", "Female"],
  ["headline", "No", "Professional headline", "Data analyst with 3 yrs exp"],
  ["status", "No", "submitted, under_review, shortlisted, rejected, hired, on_hold", "submitted"],
  ["registration_date", "No", "YYYY-MM-DD", "2024-01-15"],
];

mkdirSync(outDir, { recursive: true });

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet([SAMPLE], { header: HEADERS });
XLSX.utils.book_append_sheet(wb, ws, "Candidates");
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(FIELD_GUIDE), "Field guide");

const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
writeFileSync(outPath, buffer);
console.log(`Wrote ${outPath}`);
