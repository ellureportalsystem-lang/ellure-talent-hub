import * as XLSX from 'xlsx';
import { Applicant } from '@/data/mockApplicants';

export interface ExportField {
  key: string;
  label: string;
  category: 'basic' | 'contact' | 'professional' | 'education' | 'other';
  getValue: (applicant: Applicant) => string | number;
}

export const exportFields: ExportField[] = [
  // Basic Info
  { key: 'name', label: 'Full Name', category: 'basic', getValue: (a) => a.name },
  { key: 'gender', label: 'Gender', category: 'basic', getValue: (a) => a.gender },
  { key: 'age', label: 'Age', category: 'basic', getValue: (a) => a.age },
  { key: 'currentCity', label: 'Current City', category: 'basic', getValue: (a) => a.currentCity },
  { key: 'preferredCity', label: 'Preferred City', category: 'basic', getValue: (a) => a.preferredCity },
  
  // Contact Info
  { key: 'email', label: 'Email', category: 'contact', getValue: (a) => a.email },
  { key: 'phone', label: 'Phone', category: 'contact', getValue: (a) => a.phone },
  
  // Professional Info
  { key: 'designation', label: 'Designation', category: 'professional', getValue: (a) => a.designation },
  { key: 'currentCompany', label: 'Current Company', category: 'professional', getValue: (a) => a.currentCompany },
  { key: 'experience', label: 'Experience (Years)', category: 'professional', getValue: (a) => a.experience },
  { key: 'primarySkill', label: 'Primary Skill', category: 'professional', getValue: (a) => a.primarySkill },
  { key: 'skills', label: 'All Skills', category: 'professional', getValue: (a) => a.skills.join(', ') },
  { key: 'currentCTC', label: 'Current CTC (LPA)', category: 'professional', getValue: (a) => a.currentCTC },
  { key: 'expectedCTC', label: 'Expected CTC (LPA)', category: 'professional', getValue: (a) => a.expectedCTC },
  { key: 'noticePeriod', label: 'Notice Period', category: 'professional', getValue: (a) => a.noticePeriod },
  { key: 'communicationSkill', label: 'Communication Skill', category: 'professional', getValue: (a) => a.communicationSkill },
  { key: 'pastCompanies', label: 'Past Companies', category: 'professional', getValue: (a) => a.pastCompanies.join(', ') },
  
  // Education
  { key: 'highestQualification', label: 'Highest Qualification', category: 'education', getValue: (a) => a.education.highest },
  { key: 'degree', label: 'Degree', category: 'education', getValue: (a) => a.education.degree },
  { key: 'university', label: 'University', category: 'education', getValue: (a) => a.education.university },
  { key: 'yearOfPassing', label: 'Year of Passing', category: 'education', getValue: (a) => a.education.yearOfPassing },
  { key: 'percentage', label: 'Percentage/CGPA', category: 'education', getValue: (a) => a.education.percentage },
  
  // Other
  { key: 'status', label: 'Status', category: 'other', getValue: (a) => a.status },
  { key: 'lastActive', label: 'Last Active', category: 'other', getValue: (a) => a.lastActive },
  { key: 'registeredDate', label: 'Registered Date', category: 'other', getValue: (a) => a.registeredDate },
  { key: 'resumeUpdated', label: 'Resume Updated', category: 'other', getValue: (a) => a.resumeUpdated },
];

export const defaultSelectedFields = [
  'name', 'email', 'phone', 'designation', 'currentCompany', 
  'experience', 'skills', 'currentCity', 'currentCTC', 'noticePeriod'
];

export const exportToCSV = (
  applicants: Applicant[], 
  selectedFieldKeys: string[], 
  filename: string
) => {
  const fields = exportFields.filter(f => selectedFieldKeys.includes(f.key));
  
  // Create header row
  const headers = fields.map(f => f.label);
  
  // Create data rows
  const rows = applicants.map(applicant => 
    fields.map(f => {
      const value = f.getValue(applicant);
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    })
  );
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (
  applicants: Applicant[], 
  selectedFieldKeys: string[], 
  filename: string
) => {
  const fields = exportFields.filter(f => selectedFieldKeys.includes(f.key));
  
  // Create data array with headers
  const data = [
    fields.map(f => f.label),
    ...applicants.map(applicant => fields.map(f => f.getValue(applicant)))
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Convert array to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // Set column widths
  const colWidths = fields.map(f => ({ wch: Math.max(f.label.length, 15) }));
  worksheet['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, worksheet, 'Candidates');
  
  // Generate and download file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const getFieldsByCategory = () => {
  const categories = {
    basic: { label: 'Basic Information', fields: [] as ExportField[] },
    contact: { label: 'Contact Details', fields: [] as ExportField[] },
    professional: { label: 'Professional Details', fields: [] as ExportField[] },
    education: { label: 'Education', fields: [] as ExportField[] },
    other: { label: 'Other', fields: [] as ExportField[] },
  };
  
  exportFields.forEach(field => {
    categories[field.category].fields.push(field);
  });
  
  return categories;
};
