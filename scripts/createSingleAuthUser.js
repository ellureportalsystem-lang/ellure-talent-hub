// Script to create a single auth user for a specific email
// Run with: node scripts/createSingleAuthUser.js <email>

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

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.error('Usage: node scripts/createSingleAuthUser.js <email>');
  process.exit(1);
}

async function createAuthUser() {
  console.log(`\n🔍 Creating auth user for: ${email}\n`);
  console.log('='.repeat(80));
  
  // Find applicant
  const { data: applicant, error: applicantError } = await supabase
    .from('applicants')
    .select('*')
    .or(`email_address.eq.${email},email.eq.${email}`)
    .maybeSingle();
  
  if (applicantError) {
    console.error('❌ Error finding applicant:', applicantError.message);
    return;
  }
  
  if (!applicant) {
    console.error(`❌ No applicant found with email: ${email}`);
    return;
  }
  
  console.log(`✅ Found applicant: ${applicant.full_name || applicant.name}`);
  console.log(`   Email: ${applicant.email_address || applicant.email}`);
  console.log(`   Phone: ${applicant.mobile_number || applicant.phone || 'N/A'}`);
  console.log(`   User ID: ${applicant.user_id || 'None'}`);
  
  // Check if auth user already exists
  const { data: usersList } = await supabase.auth.admin.listUsers();
  const existingUser = usersList?.users?.find(u => 
    u.email?.toLowerCase() === email.toLowerCase() || 
    u.id === applicant.user_id
  );
  
  if (existingUser) {
    console.log(`\n✅ Auth user already exists:`);
    console.log(`   ID: ${existingUser.id}`);
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Created: ${existingUser.created_at}`);
    return;
  }
  
  // Create auth user
  console.log(`\n🔨 Creating auth user...`);
  
  const authData = {
    password: DEFAULT_PASSWORD,
    email_confirm: true,
    phone_confirm: true,
    user_metadata: {
      full_name: applicant.full_name || applicant.name,
      role: 'applicant',
      is_old_applicant: true
    }
  };
  
  // Use existing user_id if available
  if (applicant.user_id) {
    authData.id = applicant.user_id;
    console.log(`   Using existing user_id: ${applicant.user_id}`);
  }
  
  if (applicant.email_address || applicant.email) {
    authData.email = applicant.email_address || applicant.email;
  }
  
  if (applicant.mobile_number || applicant.phone) {
    authData.phone = applicant.mobile_number || applicant.phone;
  }
  
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser(authData);
  
  if (authError) {
    console.error(`\n❌ Failed to create auth user: ${authError.message}`);
    return;
  }
  
  if (authUser?.user) {
    console.log(`\n✅ Auth user created successfully!`);
    console.log(`   ID: ${authUser.user.id}`);
    console.log(`   Email: ${authUser.user.email}`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log(`\n💡 User can now login with:`);
    console.log(`   Email: ${authUser.user.email}`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
  } else {
    console.error(`\n❌ Auth user creation returned no user`);
  }
  
  console.log('\n' + '='.repeat(80));
}

createAuthUser().catch(console.error);














