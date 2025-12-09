// Script to create profiles and auth users for all imported applicants
// Run with: node scripts/createProfilesAndAuthUsers.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        env[key.trim()] = value;
      }
    }
  });
  
  return env;
}

const env = parseEnvFile(join(__dirname, '../.env'));

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key to create auth users
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DEFAULT_PASSWORD = 'applicant@123';

async function createAuthUserAndProfile(applicant, emailToUserId = new Map()) {
  try {
    // Use email_address or mobile_number for login
    const email = applicant.email_address || applicant.email;
    const phone = applicant.mobile_number || applicant.phone;
    
    if (!email && !phone) {
      console.log(`   ⚠️  Skipping applicant ${applicant.id} - no email or phone`);
      return { success: false, reason: 'no_email_or_phone' };
    }
    
    // Check if profile already exists (which means auth user exists)
    let authUserId = null;
    
    // First check if applicant already has a user_id
    if (applicant.user_id) {
      authUserId = applicant.user_id;
      console.log(`   ℹ️  Applicant already has user_id: ${authUserId}`);
    } else {
      // Check if profile exists with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .or(`email.eq.${email},email_address.eq.${email}`)
        .maybeSingle();
      
      if (existingProfile) {
        authUserId = existingProfile.id;
        console.log(`   ℹ️  Profile already exists for ${email}`);
      } else if (email && emailToUserId.has(email.toLowerCase())) {
        // Found existing auth user by email
        authUserId = emailToUserId.get(email.toLowerCase());
        console.log(`   ℹ️  Found existing auth user for ${email}`);
      }
    }
    
    // Create auth user if it doesn't exist
    if (!authUserId) {
      const authData = {
        password: DEFAULT_PASSWORD,
        email_confirm: true, // Auto-confirm email
        phone_confirm: true, // Auto-confirm phone
        user_metadata: {
          full_name: applicant.full_name || applicant.name,
          role: 'applicant',
          is_old_applicant: true
        }
      };
      
      // Add email or phone (at least one is required)
      if (email) {
        authData.email = email;
      }
      if (phone) {
        authData.phone = phone;
      }
      
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser(authData);
      
      if (authError) {
        // If user already exists, find it from our email map
        if (authError.message.includes('already been registered') || authError.message.includes('already registered')) {
          if (email && emailToUserId.has(email.toLowerCase())) {
            authUserId = emailToUserId.get(email.toLowerCase());
            console.log(`   ℹ️  Found existing auth user from map for ${email}`);
          } else {
            console.log(`   ⚠️  Auth user exists but not found in map for ${email} - skipping`);
            return { success: false, reason: 'user_exists_but_not_found' };
          }
        } else {
          console.log(`   ❌ Failed to create auth user: ${authError.message}`);
          return { success: false, reason: authError.message };
        }
      } else if (authUser?.user) {
        authUserId = authUser.user.id;
        console.log(`   ✅ Created auth user: ${email || phone}`);
      } else {
        console.log(`   ❌ Auth user creation returned no user`);
        return { success: false, reason: 'no_user_returned' };
      }
    }
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUserId)
      .maybeSingle();
    
    if (existingProfile) {
      // Update existing profile with applicant data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          applicant_id: applicant.id,
          email: email || existingProfile.email,
          email_address: email || applicant.email_address,
          phone: phone || existingProfile.phone,
          mobile_number: phone || applicant.mobile_number,
          full_name: applicant.full_name || applicant.name || existingProfile.full_name,
          role: 'applicant',
          is_old_applicant: true,
          password_changed: false,
          must_change_password: true,
          // Copy all Excel-matching columns from applicant to profile
          date: applicant.date,
          city_current_location: applicant.city_current_location || applicant.city,
          skill_job_role_applying_for: applicant.skill_job_role_applying_for || applicant.skill,
          communication: applicant.communication,
          highest_qualification: applicant.highest_qualification || applicant.education_level,
          education_board: applicant.education_board,
          medium_of_study: applicant.medium_of_study || applicant.medium,
          course_degree_name: applicant.course_degree_name || applicant.course_degree,
          university_institute_name: applicant.university_institute_name || applicant.university,
          year_of_passing: applicant.year_of_passing || applicant.passing_year,
          work_experience: applicant.work_experience,
          total_experience_numbers: applicant.total_experience_numbers || applicant.total_experience,
          current_company: applicant.current_company,
          current_designation: applicant.current_designation,
          current_ctc: applicant.current_ctc,
          exp_ctc: applicant.exp_ctc || applicant.expected_ctc,
          notice_period: applicant.notice_period,
          key_skill: applicant.key_skill || applicant.key_skills,
          upload_cv_any_format: applicant.upload_cv_any_format || applicant.resume_file,
          education: applicant.education
        })
        .eq('id', authUserId);
      
      if (updateError) {
        console.log(`   ❌ Failed to update profile: ${updateError.message}`);
        return { success: false, reason: updateError.message };
      }
      
      console.log(`   ✅ Updated existing profile`);
    } else {
      // Create new profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUserId,
          email: email || '',
          email_address: email || applicant.email_address,
          phone: phone || '',
          mobile_number: phone || applicant.mobile_number,
          full_name: applicant.full_name || applicant.name || '',
          role: 'applicant',
          applicant_id: applicant.id,
          is_old_applicant: true,
          password_changed: false,
          must_change_password: true,
          // Copy all Excel-matching columns from applicant to profile
          date: applicant.date,
          city_current_location: applicant.city_current_location || applicant.city,
          skill_job_role_applying_for: applicant.skill_job_role_applying_for || applicant.skill,
          communication: applicant.communication,
          highest_qualification: applicant.highest_qualification || applicant.education_level,
          education_board: applicant.education_board,
          medium_of_study: applicant.medium_of_study || applicant.medium,
          course_degree_name: applicant.course_degree_name || applicant.course_degree,
          university_institute_name: applicant.university_institute_name || applicant.university,
          year_of_passing: applicant.year_of_passing || applicant.passing_year,
          work_experience: applicant.work_experience,
          total_experience_numbers: applicant.total_experience_numbers || applicant.total_experience,
          current_company: applicant.current_company,
          current_designation: applicant.current_designation,
          current_ctc: applicant.current_ctc,
          exp_ctc: applicant.exp_ctc || applicant.expected_ctc,
          notice_period: applicant.notice_period,
          key_skill: applicant.key_skill || applicant.key_skills,
          upload_cv_any_format: applicant.upload_cv_any_format || applicant.resume_file,
          education: applicant.education
        });
      
      if (profileError) {
        console.log(`   ❌ Failed to create profile: ${profileError.message}`);
        return { success: false, reason: profileError.message };
      }
      
      console.log(`   ✅ Created profile`);
    }
    
    // Update applicant with user_id
    const { error: updateApplicantError } = await supabase
      .from('applicants')
      .update({ user_id: authUserId })
      .eq('id', applicant.id);
    
    if (updateApplicantError) {
      console.log(`   ⚠️  Failed to update applicant user_id: ${updateApplicantError.message}`);
    }
    
    return { success: true, authUserId };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

async function getAllAuthUsers() {
  // Get all auth users with pagination
  const allUsers = [];
  let page = 1;
  const perPage = 1000;
  
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    });
    
    if (error) {
      console.error(`Error fetching users page ${page}:`, error.message);
      break;
    }
    
    if (!data?.users || data.users.length === 0) {
      break;
    }
    
    allUsers.push(...data.users);
    
    if (data.users.length < perPage) {
      break; // Last page
    }
    
    page++;
  }
  
  return allUsers;
}

async function createProfilesForAllApplicants() {
  console.log('🚀 Starting profile and auth user creation...\n');
  console.log('='.repeat(80));
  
  // First, get all existing auth users
  console.log('\n📥 Fetching all existing auth users...\n');
  const allAuthUsers = await getAllAuthUsers();
  console.log(`📊 Found ${allAuthUsers.length} existing auth user(s)\n`);
  
  // Create a map of email -> user_id for quick lookup
  const emailToUserId = new Map();
  allAuthUsers.forEach(user => {
    if (user.email) {
      emailToUserId.set(user.email.toLowerCase(), user.id);
    }
  });
  
  // Fetch all applicants
  console.log('📥 Fetching all applicants...\n');
  const { data: applicants, error: fetchError } = await supabase
    .from('applicants')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (fetchError) {
    console.error('❌ Failed to fetch applicants:', fetchError.message);
    return;
  }
  
  if (!applicants || applicants.length === 0) {
    console.log('⚠️  No applicants found in database');
    return;
  }
  
  console.log(`📊 Found ${applicants.length} applicant(s)\n`);
  console.log('─'.repeat(80));
  
  let totalProcessed = 0;
  let totalCreated = 0;
  let totalErrors = 0;
  let totalSkipped = 0;
  
  for (let i = 0; i < applicants.length; i++) {
    const applicant = applicants[i];
    totalProcessed++;
    
    console.log(`\n[${i + 1}/${applicants.length}] Processing: ${applicant.full_name || applicant.name || applicant.email_address || 'Unknown'}`);
    
    const result = await createAuthUserAndProfile(applicant, emailToUserId);
    
    if (result.success) {
      totalCreated++;
    } else if (result.reason === 'no_email_or_phone') {
      totalSkipped++;
    } else {
      totalErrors++;
    }
    
    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`\n   Progress: ${i + 1}/${applicants.length} processed...`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Applicants: ${totalProcessed}`);
  console.log(`✅ Profiles Created/Updated: ${totalCreated}`);
  console.log(`⚠️  Skipped (no email/phone): ${totalSkipped}`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`\n💡 Default Password: ${DEFAULT_PASSWORD}`);
  console.log(`   Users can login with their email or phone number\n`);
}

// Run the script
createProfilesForAllApplicants().catch(console.error);

