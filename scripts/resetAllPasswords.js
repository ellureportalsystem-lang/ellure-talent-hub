// Script to reset passwords for all users who haven't signed in yet
// This ensures all imported users have the correct default password
// Run with: node scripts/resetAllPasswords.js

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

async function resetAllPasswords() {
  console.log('🚀 Resetting passwords for all users...\n');
  console.log('='.repeat(80));
  
  // Get all auth users
  console.log('\n📥 Fetching all auth users...\n');
  const allUsers = await getAllAuthUsers();
  console.log(`📊 Found ${allUsers.length} auth user(s)\n`);
  
  // Filter users who haven't signed in (likely imported users)
  const usersToReset = allUsers.filter(u => !u.last_sign_in_at);
  
  console.log(`📊 Found ${usersToReset.length} user(s) who haven't signed in yet\n`);
  console.log('─'.repeat(80));
  
  if (usersToReset.length === 0) {
    console.log('✅ All users have signed in. No passwords to reset.');
    return;
  }
  
  let totalReset = 0;
  let totalErrors = 0;
  
  for (let i = 0; i < usersToReset.length; i++) {
    const user = usersToReset[i];
    console.log(`[${i + 1}/${usersToReset.length}] Resetting password for: ${user.email || user.id}`);
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: DEFAULT_PASSWORD }
    );
    
    if (updateError) {
      console.log(`   ❌ Failed: ${updateError.message}`);
      totalErrors++;
    } else {
      console.log(`   ✅ Password reset to: ${DEFAULT_PASSWORD}`);
      totalReset++;
    }
    
    // Progress indicator
    if ((i + 1) % 10 === 0) {
      console.log(`\n   Progress: ${i + 1}/${usersToReset.length} processed...\n`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Users (never signed in): ${usersToReset.length}`);
  console.log(`✅ Passwords Reset: ${totalReset}`);
  console.log(`❌ Errors: ${totalErrors}`);
  console.log(`\n💡 Default Password: ${DEFAULT_PASSWORD}`);
  console.log(`   Users can now login with their email or phone number\n`);
}

resetAllPasswords().catch(console.error);














