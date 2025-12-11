// Script to verify Excel columns match database columns
// Run with: node scripts/verifyColumnMapping.js

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Excel columns from analysis
const excelColumns = [
  'Date',
  'Full Name',
  'Mobile Number',
  'Email Address',
  'City / Current Location',
  'Skill / Job Role Applying For',
  'Communication',
  'Highest Qualification',
  'Education Board',
  'Medium of Study',
  'Course / Degree Name',
  'University / Institute Name',
  'Year of Passing',
  'Work Experience',
  'Total Experience(Numbers)',
  'Current Company',
  'Current Designation',
  'Current CTC',
  'Exp CTC',
  'Notice Period',
  'Key Skill',
  'Upload CV any format',
  // Alternative columns from some files
  'Skill',
  'Name',
  'Contact',
  'Email',
  'Experience',
  'Education',
  'Location'
];

// Database columns (normalized)
function normalizeColumnName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// Expected database columns (from Excel)
const expectedColumns = excelColumns.map(normalizeColumnName);

// Actual database columns (from user's list)
const applicantsColumns = [
  'date',
  'full_name',
  'mobile_number',
  'email_address',
  'city_current_location',
  'skill_job_role_applying_for',
  'highest_qualification',
  'medium_of_study',
  'course_degree_name',
  'university_institute_name',
  'year_of_passing',
  'work_experience',
  'total_experience_numbers',
  'exp_ctc',
  'key_skill',
  'upload_cv_any_format'
];

const profilesColumns = [
  'date',
  'mobile_number',
  'email_address',
  'city_current_location',
  'skill',
  'skill_job_role_applying_for',
  'communication',
  'highest_qualification',
  'education_board',
  'medium_of_study',
  'course_degree_name',
  'university_institute_name',
  'year_of_passing',
  'work_experience',
  'total_experience_numbers',
  'current_company',
  'current_designation',
  'current_ctc',
  'exp_ctc',
  'notice_period',
  'key_skill',
  'upload_cv_any_format',
  'education',
  'contact'
];

console.log('🔍 Verifying Column Mapping...\n');
console.log('='.repeat(80));

// Check applicants table
console.log('\n📊 APPLICANTS TABLE\n');
console.log('─'.repeat(80));

const missingInApplicants = [];
const foundInApplicants = [];

expectedColumns.forEach(excelCol => {
  if (applicantsColumns.includes(excelCol)) {
    foundInApplicants.push(excelCol);
  } else {
    // Check if it's a system column or alternative name
    if (!['skill', 'name', 'contact', 'email', 'experience', 'education', 'location', 'communication'].includes(excelCol)) {
      missingInApplicants.push(excelCol);
    }
  }
});

console.log('✅ Found in Applicants:');
foundInApplicants.forEach(col => {
  const excelCol = excelColumns.find(c => normalizeColumnName(c) === col);
  console.log(`   ✓ ${excelCol || col} → ${col}`);
});

if (missingInApplicants.length > 0) {
  console.log('\n❌ Missing in Applicants:');
  missingInApplicants.forEach(col => {
    const excelCol = excelColumns.find(c => normalizeColumnName(c) === col);
    console.log(`   ✗ ${excelCol || col} → ${col}`);
  });
}

// Check profiles table
console.log('\n\n📊 PROFILES TABLE\n');
console.log('─'.repeat(80));

const missingInProfiles = [];
const foundInProfiles = [];

expectedColumns.forEach(excelCol => {
  const normalized = normalizeColumnName(excelCol);
  if (profilesColumns.includes(normalized)) {
    foundInProfiles.push(normalized);
  } else {
    missingInProfiles.push(normalized);
  }
});

console.log('✅ Found in Profiles:');
foundInProfiles.forEach(col => {
  const excelCol = excelColumns.find(c => normalizeColumnName(c) === col);
  console.log(`   ✓ ${excelCol || col} → ${col}`);
});

if (missingInProfiles.length > 0) {
  console.log('\n❌ Missing in Profiles:');
  missingInProfiles.forEach(col => {
    const excelCol = excelColumns.find(c => normalizeColumnName(c) === col);
    console.log(`   ✗ ${excelCol || col} → ${col}`);
  });
}

// Summary
console.log('\n\n' + '='.repeat(80));
console.log('\n📋 SUMMARY\n');

const allExcelCols = excelColumns.map(normalizeColumnName);
const allApplicantsCols = new Set(applicantsColumns);
const allProfilesCols = new Set(profilesColumns);

console.log(`Excel Columns: ${allExcelCols.length}`);
console.log(`Applicants Columns (Excel-matching): ${allApplicantsCols.size}`);
console.log(`Profiles Columns (Excel-matching): ${allProfilesCols.size}`);

// Check if we need to add any columns
const needToAddApplicants = [];
const needToAddProfiles = [];

// Communication should be in applicants too
if (!allApplicantsCols.has('communication')) {
  needToAddApplicants.push('communication');
}

// Education should be in applicants too (for some files)
if (!allApplicantsCols.has('education')) {
  needToAddApplicants.push('education');
}

if (needToAddApplicants.length > 0) {
  console.log('\n⚠️  RECOMMENDED: Add these columns to applicants table:');
  needToAddApplicants.forEach(col => {
    console.log(`   ALTER TABLE applicants ADD COLUMN IF NOT EXISTS ${col} TEXT;`);
  });
}

if (needToAddProfiles.length > 0) {
  console.log('\n⚠️  RECOMMENDED: Add these columns to profiles table:');
  needToAddProfiles.forEach(col => {
    console.log(`   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${col} TEXT;`);
  });
}

console.log('\n✅ Verification complete!\n');















