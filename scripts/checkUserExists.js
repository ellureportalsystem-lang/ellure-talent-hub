// Quick script to check if a user exists in Supabase Auth
// Run with: node scripts/checkUserExists.js <email>

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

const email = process.argv[2] || '1994.amansshaikh@gmail.com';

async function checkUser() {
  console.log(`\n🔍 Checking for user: ${email}\n`);
  console.log('='.repeat(80));
  
  // Check in applicants table
  console.log('\n📋 Checking applicants table...');
  const { data: applicant, error: applicantError } = await supabase
    .from('applicants')
    .select('id, full_name, email_address, mobile_number')
    .or(`email_address.eq.${email},email.eq.${email}`)
    .maybeSingle();
  
  if (applicantError) {
    console.error('❌ Error checking applicants:', applicantError.message);
  } else if (applicant) {
    console.log('✅ Found in applicants table:');
    console.log(`   ID: ${applicant.id}`);
    console.log(`   Name: ${applicant.full_name || 'N/A'}`);
    console.log(`   Email: ${applicant.email_address || applicant.email || 'N/A'}`);
  } else {
    console.log('❌ Not found in applicants table');
  }
  
  // Check in profiles table
  console.log('\n👤 Checking profiles table...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, email_address, full_name, role')
    .or(`email.eq.${email},email_address.eq.${email}`)
    .maybeSingle();
  
  if (profileError) {
    console.error('❌ Error checking profiles:', profileError.message);
  } else if (profile) {
    console.log('✅ Found in profiles table:');
    console.log(`   ID: ${profile.id}`);
    console.log(`   Name: ${profile.full_name || 'N/A'}`);
    console.log(`   Email: ${profile.email || profile.email_address || 'N/A'}`);
    console.log(`   Role: ${profile.role || 'N/A'}`);
  } else {
    console.log('❌ Not found in profiles table');
  }
  
  // Check in Supabase Auth
  console.log('\n🔐 Checking Supabase Auth...');
  
  // Get all auth users with pagination
  const allAuthUsers = [];
  let page = 1;
  const perPage = 1000;
  
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    });
    
    if (error) {
      console.error('❌ Error checking auth users:', error.message);
      break;
    }
    
    if (!data?.users || data.users.length === 0) {
      break;
    }
    
    allAuthUsers.push(...data.users);
    
    if (data.users.length < perPage) {
      break;
    }
    
    page++;
  }
  
  console.log(`   Searched ${allAuthUsers.length} auth users`);
  
  // Check by email (case insensitive)
  const authUserByEmail = allAuthUsers.find(u => 
    u.email?.toLowerCase() === email.toLowerCase()
  );
  
  // Check by user_id if we have profile/applicant data
  let authUserById = null;
  if (profile) {
    authUserById = allAuthUsers.find(u => u.id === profile.id);
  }
  if (applicant?.user_id) {
    authUserById = allAuthUsers.find(u => u.id === applicant.user_id);
  }
  
  if (authUserByEmail) {
    console.log('✅ Found in Supabase Auth (by email):');
    console.log(`   ID: ${authUserByEmail.id}`);
    console.log(`   Email: ${authUserByEmail.email}`);
    console.log(`   Email Confirmed: ${authUserByEmail.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created: ${authUserByEmail.created_at}`);
    console.log(`   Last Sign In: ${authUserByEmail.last_sign_in_at || 'Never'}`);
    
    // Check if IDs match
    if (profile && authUserByEmail.id !== profile.id) {
      console.log(`\n⚠️  WARNING: Profile ID (${profile.id}) doesn't match Auth User ID (${authUserByEmail.id})`);
    }
    if (applicant?.user_id && authUserByEmail.id !== applicant.user_id) {
      console.log(`\n⚠️  WARNING: Applicant user_id (${applicant.user_id}) doesn't match Auth User ID (${authUserByEmail.id})`);
    }
  } else if (authUserById) {
    console.log('✅ Found in Supabase Auth (by user_id):');
    console.log(`   ID: ${authUserById.id}`);
    console.log(`   Email: ${authUserById.email || 'No email'}`);
    console.log(`   Email Confirmed: ${authUserById.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created: ${authUserById.created_at}`);
    console.log(`   Last Sign In: ${authUserById.last_sign_in_at || 'Never'}`);
    
    if (authUserById.email?.toLowerCase() !== email.toLowerCase()) {
      console.log(`\n⚠️  WARNING: Auth user email (${authUserById.email}) doesn't match searched email (${email})`);
    }
  } else {
    console.log('❌ NOT FOUND in Supabase Auth');
    console.log(`\n💡 This is why login is failing! The auth user doesn't exist.`);
    console.log(`\n📝 Solution: Create the auth user:`);
    console.log(`   npm run data:create-single-auth ${email}`);
  }
  
  // Show similar emails for debugging
  const similarEmails = allAuthUsers
    .filter(u => u.email && u.email.toLowerCase().includes(email.split('@')[0].toLowerCase()))
    .slice(0, 5);
  
  if (similarEmails.length > 0 && !authUserByEmail) {
    console.log(`\n💡 Found similar emails (for debugging):`);
    similarEmails.forEach(u => {
      console.log(`   - ${u.email} (ID: ${u.id})`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n');
}

checkUser().catch(console.error);

