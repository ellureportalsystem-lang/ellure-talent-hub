// Script to create auth users for applicants that have user_id but auth user doesn't exist
// Run with: node scripts/createMissingAuthUsers.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
        value = value.replace(/^["']|["']$/g, '');
        env[key.trim()] = value;
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

const DEFAULT_PASSWORD = 'applicant@123';

async function getAllAuthUsers() {
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
      break;
    }
    
    page++;
  }
  
  return allUsers;
}

async function createMissingAuthUsers() {
  console.log('🚀 Finding and creating missing auth users...\n');
  console.log('='.repeat(80));
  
  // Get all existing auth users
  console.log('\n📥 Fetching all existing auth users...\n');
  const allAuthUsers = await getAllAuthUsers();
  const authUserIds = new Set(allAuthUsers.map(u => u.id));
  const authUserEmails = new Set(allAuthUsers.map(u => u.email?.toLowerCase()).filter(Boolean));
  console.log(`📊 Found ${allAuthUsers.length} existing auth user(s)\n`);
  
  // Get all applicants with user_id
  console.log('📥 Fetching all applicants with user_id...\n');
  const { data: applicants, error: fetchError } = await supabase
    .from('applicants')
    .select('id, full_name, email_address, mobile_number, user_id')
    .not('user_id', 'is', null);
  
  if (fetchError) {
    console.error('❌ Failed to fetch applicants:', fetchError.message);
    return;
  }
  
  if (!applicants || applicants.length === 0) {
    console.log('⚠️  No applicants with user_id found');
    return;
  }
  
  console.log(`📊 Found ${applicants.length} applicant(s) with user_id\n`);
  console.log('─'.repeat(80));
  
  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (let i = 0; i < applicants.length; i++) {
    const applicant = applicants[i];
    const email = applicant.email_address || applicant.email;
    
    // Check if auth user exists
    if (authUserIds.has(applicant.user_id)) {
      console.log(`[${i + 1}/${applicants.length}] ✅ ${applicant.full_name || email || 'Unknown'} - Auth user exists`);
      totalSkipped++;
      continue;
    }
    
    // Check if email already exists in auth (different user_id)
    if (email && authUserEmails.has(email.toLowerCase())) {
      console.log(`[${i + 1}/${applicants.length}] ⚠️  ${applicant.full_name || email} - Email exists but different user_id`);
      totalSkipped++;
      continue;
    }
    
    // Create auth user
    console.log(`[${i + 1}/${applicants.length}] 🔨 Creating auth user for: ${applicant.full_name || email || 'Unknown'}`);
    
    const authData = {
      id: applicant.user_id, // Use the existing user_id from applicants table
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        full_name: applicant.full_name || applicant.name,
        role: 'applicant',
        is_old_applicant: true
      }
    };
    
    if (email) {
      authData.email = email;
    }
    if (applicant.mobile_number || applicant.phone) {
      authData.phone = applicant.mobile_number || applicant.phone;
    }
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser(authData);
    
    if (authError) {
      console.log(`   ❌ Failed: ${authError.message}`);
      totalErrors++;
    } else if (authUser?.user) {
      console.log(`   ✅ Created auth user: ${email || applicant.mobile_number || 'N/A'}`);
      totalCreated++;
      // Add to our sets
      authUserIds.add(authUser.user.id);
      if (email) {
        authUserEmails.add(email.toLowerCase());
      }
    } else {
      console.log(`   ❌ No user returned`);
      totalErrors++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Applicants with user_id: ${applicants.length}`);
  console.log(`✅ Auth Users Created: ${totalCreated}`);
  console.log(`⚠️  Skipped (already exists): ${totalSkipped}`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`\n💡 Default Password: ${DEFAULT_PASSWORD}`);
  console.log(`   Users can now login with their email or phone number\n`);
}

createMissingAuthUsers().catch(console.error);















