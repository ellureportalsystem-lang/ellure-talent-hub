// Script to import applicant data from Excel files to Supabase
// Run with: node scripts/importApplicantData.js

import pkg from 'xlsx';
const { readFile: readXLSX, utils } = pkg;
import { createClient } from '@supabase/supabase-js';
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFile } from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../data/old-applicant-data');

// Load environment variables
function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)="?(.+?)"?$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        value = value.replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    }
  });
  
  return env;
}

const env = parseEnvFile(join(__dirname, '../.env'));
const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Column mapping: Excel column name -> Database column name (Excel-matching columns)
const applicantColumnMap = {
  // Date
  'date': 'date',
  
  // Name variations
  'name': 'full_name',
  'full name': 'full_name',
  'fullname': 'full_name',
  
  // Phone variations
  'phone': 'mobile_number',
  'phone number': 'mobile_number',
  'mobile': 'mobile_number',
  'mobile number': 'mobile_number',
  'contact': 'mobile_number',
  
  // Email variations
  'email': 'email_address',
  'email address': 'email_address',
  
  // Location variations
  'city': 'city_current_location',
  'city / current location': 'city_current_location',
  'location': 'city_current_location',
  
  // Skill variations
  'skill': 'skill_job_role_applying_for',
  'skills': 'skill_job_role_applying_for',
  'skill / job role applying for': 'skill_job_role_applying_for',
  'job role': 'skill_job_role_applying_for',
  'role': 'skill_job_role_applying_for',
  
  // Communication
  'communication': 'communication',
  
  // Education variations
  'education level': 'highest_qualification',
  'qualification': 'highest_qualification',
  'highest qualification': 'highest_qualification',
  'education': 'education',
  'education board': 'education_board',
  'board': 'education_board',
  'medium': 'medium_of_study',
  'medium of study': 'medium_of_study',
  'course degree': 'course_degree_name',
  'course / degree name': 'course_degree_name',
  'degree': 'course_degree_name',
  'university': 'university_institute_name',
  'university / institute name': 'university_institute_name',
  'college': 'university_institute_name',
  'year of passing': 'year_of_passing',
  'passing year': 'year_of_passing',
  'year': 'year_of_passing',
  
  // Experience variations
  'work experience': 'work_experience',
  'experience': 'work_experience',
  'total experience(numbers)': 'total_experience_numbers',
  'total experience': 'total_experience_numbers',
  
  // Company/Job variations
  'current company': 'current_company',
  'company': 'current_company',
  'current designation': 'current_designation',
  'designation': 'current_designation',
  
  // CTC variations
  'current ctc': 'current_ctc',
  'ctc': 'current_ctc',
  'exp ctc': 'exp_ctc',
  'expected ctc': 'exp_ctc',
  
  // Other fields
  'key skill': 'key_skill',
  'key skills': 'key_skill',
  'notice period': 'notice_period',
  'upload cv any format': 'upload_cv_any_format',
  'resume': 'upload_cv_any_format',
  'resume file': 'upload_cv_any_format',
  
  // System fields (keep for compatibility)
  'availability': 'availability',
  'profile image': 'profile_image',
  'photo': 'profile_image',
  'status': 'status',
  'remarks': 'remarks'
};

const profileColumnMap = {
  // Date
  'date': 'date',
  
  // Name variations
  'name': 'full_name',
  'full name': 'full_name',
  'fullname': 'full_name',
  
  // Email variations
  'email': 'email_address',
  'email address': 'email_address',
  
  // Phone variations
  'phone': 'mobile_number',
  'phone number': 'mobile_number',
  'mobile': 'mobile_number',
  'mobile number': 'mobile_number',
  'contact': 'contact',
  
  // Location variations
  'location': 'city_current_location',
  'city': 'city_current_location',
  'city / current location': 'city_current_location',
  
  // Skill variations
  'skill': 'skill',
  'skill / job role applying for': 'skill_job_role_applying_for',
  'skills': 'skill',
  
  // Communication
  'communication': 'communication',
  
  // Education
  'education': 'education',
  'highest qualification': 'highest_qualification',
  'education board': 'education_board',
  'medium of study': 'medium_of_study',
  'course / degree name': 'course_degree_name',
  'university / institute name': 'university_institute_name',
  'year of passing': 'year_of_passing',
  
  // Experience
  'work experience': 'work_experience',
  'total experience(numbers)': 'total_experience_numbers',
  
  // Company/Job
  'current company': 'current_company',
  'current designation': 'current_designation',
  'current ctc': 'current_ctc',
  'exp ctc': 'exp_ctc',
  'notice period': 'notice_period',
  
  // Skills
  'key skill': 'key_skill',
  'key skills': 'key_skill',
  
  // Resume
  'upload cv any format': 'upload_cv_any_format',
  'resume': 'upload_cv_any_format',
  'resume file': 'upload_cv_any_format',
  
  // Profile image
  'profile image': 'profile_image',
  'photo': 'profile_image',
  
  // Other profile fields
  'headline': 'headline',
  'summary': 'summary',
  'display name': 'display_name'
};

function normalizeColumnName(name) {
  if (!name) return '';
  return name.toString().toLowerCase().trim().replace(/\s+/g, ' ');
}

function cleanValue(value, isInteger = false) {
  // Handle null/empty values
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  // Convert to string and trim
  let strValue = String(value).trim();
  
  // Handle empty strings
  if (strValue === '' || strValue.toLowerCase() === 'na' || strValue.toLowerCase() === 'n/a') {
    return null;
  }
  
  // For integer fields, handle special cases
  if (isInteger) {
    // Remove non-numeric characters except minus sign
    const numericValue = strValue.replace(/[^\d-]/g, '');
    
    // Handle ranges like "2022-2026" - take the first year
    if (strValue.includes('-') && numericValue.includes('-')) {
      const parts = numericValue.split('-');
      if (parts.length > 0 && parts[0]) {
        const year = parseInt(parts[0], 10);
        if (!isNaN(year)) return year;
      }
      return null;
    }
    
    // Try to parse as integer
    const intValue = parseInt(numericValue, 10);
    if (!isNaN(intValue)) {
      return intValue;
    }
    
    // If it's a date string like "December, 2013", try to extract year
    const yearMatch = strValue.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      return parseInt(yearMatch[0], 10);
    }
    
    return null;
  }
  
  return strValue;
}

function mapExcelToDatabase(excelRow, columnMap) {
  const mapped = {};
  
  // Integer columns that need special handling
  const integerColumns = ['passing_year', 'year_of_passing', 'total_experience', 'total_experience_numbers'];
  
  Object.keys(excelRow).forEach(excelCol => {
    const normalized = normalizeColumnName(excelCol);
    const dbColumn = columnMap[normalized];
    
    if (dbColumn) {
      const value = excelRow[excelCol];
      const isInteger = integerColumns.includes(dbColumn);
      mapped[dbColumn] = cleanValue(value, isInteger);
    }
  });
  
  return mapped;
}

function getAllExcelFiles(dir) {
  const files = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllExcelFiles(fullPath));
      } else if (stat.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (['.xlsx', '.xls', '.xlsm'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }
  
  return files;
}

async function importData() {
  console.log('📥 Starting data import from Excel files...\n');
  console.log('='.repeat(80));
  
  // Note: We can't easily disable triggers via Supabase client
  // The trigger should handle NULL user_id gracefully (it checks IF NEW.user_id IS NOT NULL)
  // If it's still failing, the trigger code might need to be updated
  console.log('ℹ️  Importing applicants (profiles will be created when users register)...\n');
  
  const excelFiles = getAllExcelFiles(dataDir);
  
  if (excelFiles.length === 0) {
    console.log('❌ No Excel files found in data/old-applicant-data/');
    console.log('\n💡 Please upload your Excel files first!\n');
    return;
  }
  
  console.log(`\n📊 Found ${excelFiles.length} Excel file(s)\n`);
  
  let totalProcessed = 0;
  let totalImported = 0;
  let totalErrors = 0;
  
  for (const filePath of excelFiles) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`\n📄 Processing: ${filePath.split(/[/\\]/).pop()}\n`);
    
    try {
      const workbook = readXLSX(filePath);
      
      for (const sheetName of workbook.SheetNames) {
        console.log(`\n📋 Sheet: "${sheetName}"`);
        
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet, { 
          defval: null,
          raw: false
        });
        
        console.log(`   Rows to process: ${data.length}`);
        
        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          totalProcessed++;
          
          try {
            // Map Excel data to database columns
            const applicantData = mapExcelToDatabase(row, applicantColumnMap);
            const profileData = mapExcelToDatabase(row, profileColumnMap);
            
            // Handle date field - store in Excel-matching 'date' column
            if (row['Date'] || row['date']) {
              const dateValue = row['Date'] || row['date'];
              if (dateValue) {
                applicantData.date = String(dateValue).trim();
              }
            }
            
            // Debug: Log first row to see what's being mapped
            if (i === 0 && totalProcessed === 1) {
              console.log(`   🔍 Debug - First row mapping:`);
              console.log(`      Excel columns: ${Object.keys(row).slice(0, 5).join(', ')}...`);
              console.log(`      Mapped applicant keys: ${Object.keys(applicantData).slice(0, 5).join(', ')}...`);
              console.log(`      email_address: ${applicantData.email_address || 'NULL'}`);
              console.log(`      mobile_number: ${applicantData.mobile_number || 'NULL'}`);
            }
            
            // Required fields validation - check new column names
            const hasEmail = applicantData.email_address;
            const hasPhone = applicantData.mobile_number;
            
            if (!hasEmail && !hasPhone) {
              // Try to find email/phone in raw Excel row
              const rawEmail = row['Email Address'] || row['Email'] || row['email address'] || row['email'];
              const rawPhone = row['Mobile Number'] || row['Mobile'] || row['mobile number'] || row['phone'] || row['Phone'] || row['Contact'] || row['contact'];
              
              if (!rawEmail && !rawPhone) {
                console.log(`   ⚠️  Row ${i + 1}: Skipping - missing email and phone`);
                totalErrors++;
                continue;
              } else {
                // Use raw values if mapping didn't work
                if (rawEmail && !applicantData.email_address) {
                  applicantData.email_address = String(rawEmail).trim();
                }
                if (rawPhone && !applicantData.mobile_number) {
                  applicantData.mobile_number = String(rawPhone).trim();
                }
              }
            }
            
            // CRITICAL: Map email_address to email for profiles (profiles table still requires old 'email' column)
            if (applicantData.email_address && !profileData.email) {
              profileData.email = applicantData.email_address;
            }
            if (profileData.email_address && !profileData.email) {
              profileData.email = profileData.email_address;
            }
            
            // Also map phone for profiles
            if (applicantData.mobile_number && !profileData.phone) {
              profileData.phone = applicantData.mobile_number;
            }
            if (profileData.mobile_number && !profileData.phone) {
              profileData.phone = profileData.mobile_number;
            }
            
            // Set defaults
            applicantData.status = applicantData.status || 'submitted';
            applicantData.verified = false;
            applicantData.otp_verified = false;
            applicantData.is_deleted = false;
            applicantData.profile_complete_percent = 0;
            
            profileData.role = 'applicant';
            profileData.is_old_applicant = true;
            profileData.profile_complete_percent = 0;
            
            // For old applicants: profiles.id must reference auth.users.id
            // Since we're importing old data, we'll create applicants WITHOUT profiles initially
            // Profiles will be created when users register/login via the trigger
            applicantData.user_id = null; // No auth user yet for old applicants
            
            // Map new Excel-matching columns to old required columns (applicants table still has old columns as required)
            if (applicantData.full_name && !applicantData.name) {
              applicantData.name = applicantData.full_name;
            }
            if (applicantData.mobile_number && !applicantData.phone) {
              applicantData.phone = applicantData.mobile_number;
            }
            if (applicantData.email_address && !applicantData.email) {
              applicantData.email = applicantData.email_address;
            }
            // City is required - provide default if missing
            if (applicantData.city_current_location) {
              applicantData.city = applicantData.city_current_location;
            } else if (!applicantData.city) {
              applicantData.city = 'Not Specified'; // Default value for required field
            }
            if (applicantData.skill_job_role_applying_for && !applicantData.skill) {
              applicantData.skill = applicantData.skill_job_role_applying_for;
            }
            if (applicantData.highest_qualification && !applicantData.education_level) {
              applicantData.education_level = applicantData.highest_qualification;
            }
            if (applicantData.medium_of_study && !applicantData.medium) {
              applicantData.medium = applicantData.medium_of_study;
            }
            if (applicantData.course_degree_name && !applicantData.course_degree) {
              applicantData.course_degree = applicantData.course_degree_name;
            }
            if (applicantData.university_institute_name && !applicantData.university) {
              applicantData.university = applicantData.university_institute_name;
            }
            // Handle year_of_passing - convert to integer if it's a string
            if (applicantData.year_of_passing && !applicantData.passing_year) {
              const yearValue = cleanValue(applicantData.year_of_passing, true);
              applicantData.passing_year = yearValue;
            } else if (applicantData.passing_year) {
              // Ensure passing_year is cleaned
              applicantData.passing_year = cleanValue(applicantData.passing_year, true);
            }
            if (applicantData.total_experience_numbers && !applicantData.total_experience) {
              applicantData.total_experience = applicantData.total_experience_numbers;
            }
            if (applicantData.exp_ctc && !applicantData.expected_ctc) {
              applicantData.expected_ctc = applicantData.exp_ctc;
            }
            if (applicantData.key_skill && !applicantData.key_skills) {
              applicantData.key_skills = applicantData.key_skill;
            }
            if (applicantData.upload_cv_any_format && !applicantData.resume_file) {
              applicantData.resume_file = applicantData.upload_cv_any_format;
            }
            
            // Check if applicant already exists by email_address
            const { data: existingApplicant } = await supabase
              .from('applicants')
              .select('id')
              .eq('email_address', applicantData.email_address)
              .maybeSingle();
            
            let applicant;
            let applicantError = null;
            
            if (existingApplicant) {
              // Update existing applicant
              const { data: updated, error: updateError } = await supabase
                .from('applicants')
                .update(applicantData)
                .eq('id', existingApplicant.id)
                .select()
                .single();
              applicant = updated;
              applicantError = updateError;
            } else {
              // Insert new applicant
              const { data: inserted, error: insertError } = await supabase
                .from('applicants')
                .insert(applicantData)
                .select()
                .single();
              applicant = inserted;
              applicantError = insertError;
            }
            
            if (applicantError && !applicantError.message.includes('duplicate')) {
              console.log(`   ❌ Row ${i + 1}: Applicant error - ${applicantError.message}`);
              totalErrors++;
              continue;
            }
            
            // Note: Profiles will be created automatically when users register/login
            // OR we can create them later using a separate script that creates auth users
            // For now, we're just importing applicant data
            
            totalImported++;
            
            if ((i + 1) % 10 === 0) {
              process.stdout.write(`   Processed ${i + 1}/${data.length} rows...\r`);
            }
          } catch (error) {
            console.log(`   ❌ Row ${i + 1}: ${error.message}`);
            totalErrors++;
          }
        }
        
        console.log(`\n   ✅ Completed sheet "${sheetName}"`);
      }
    } catch (error) {
      console.error(`\n❌ Error processing file ${filePath}:`, error.message);
      totalErrors++;
    }
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 IMPORT SUMMARY\n');
  console.log(`Total Rows Processed: ${totalProcessed}`);
  console.log(`Successfully Imported: ${totalImported}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Success Rate: ${((totalImported / totalProcessed) * 100).toFixed(2)}%\n`);
  
  if (totalImported > 0) {
    console.log('✅ Data import completed successfully!\n');
  }
}

importData().catch(console.error);

