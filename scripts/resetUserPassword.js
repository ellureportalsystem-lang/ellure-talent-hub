// Script to reset a user's password
// Run with: node scripts/resetUserPassword.js <email> [newPassword]

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

const email = process.argv[2];
const newPassword = process.argv[3] || 'applicant@123';

if (!email) {
  console.error('❌ Please provide an email address');
  console.error('Usage: node scripts/resetUserPassword.js <email> [newPassword]');
  process.exit(1);
}

async function resetPassword() {
  console.log(`\n🔐 Resetting password for: ${email}\n`);
  console.log('='.repeat(80));
  
  // Find user by email (with pagination)
  const allUsers = [];
  let page = 1;
  const perPage = 1000;
  
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    });
    
    if (error) {
      console.error(`❌ Error fetching users: ${error.message}`);
      return;
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
  
  const user = allUsers.find(u => 
    u.email?.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) {
    console.error(`❌ No auth user found with email: ${email}`);
    console.log(`   Searched ${allUsers.length} users`);
    return;
  }
  
  console.log(`✅ Found user:`);
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Created: ${user.created_at}`);
  
  // Update password
  console.log(`\n🔨 Resetting password to: ${newPassword}`);
  
  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );
  
  if (updateError) {
    console.error(`\n❌ Failed to reset password: ${updateError.message}`);
    return;
  }
  
  console.log(`\n✅ Password reset successfully!`);
  console.log(`\n💡 User can now login with:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${newPassword}`);
  console.log('\n' + '='.repeat(80));
}

resetPassword().catch(console.error);

