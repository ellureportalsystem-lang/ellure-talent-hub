// Script to create demo admin and client accounts
// Run with: node scripts/createDemoAccounts.js

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

// Demo accounts configuration
const DEMO_ACCOUNTS = [
  {
    email: 'admin@ellureconsulting.com',
    password: 'admin@123',
    role: 'admin',
    fullName: 'Admin User',
    phone: '+919876543210',
    metadata: {
      full_name: 'Admin User',
      role: 'admin',
      is_demo: true
    }
  },
  {
    email: 'client.infosys@ellureconsulting.com',
    password: 'client@123', // Default password for client
    role: 'client',
    fullName: 'Infosys Client',
    phone: '+919876543211',
    metadata: {
      full_name: 'Infosys Client',
      role: 'client',
      is_demo: true,
      company: 'Infosys'
    }
  }
];

async function createDemoAccount(account) {
  try {
    console.log(`\n📝 Creating ${account.role} account: ${account.email}`);
    
    // Check if auth user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error(`   ❌ Error listing users:`, listError.message);
      return { success: false, error: listError };
    }
    
    const existingUser = existingUsers.users.find(
      u => u.email?.toLowerCase() === account.email.toLowerCase()
    );
    
    let authUserId = null;
    
    if (existingUser) {
      console.log(`   ℹ️  Auth user already exists: ${existingUser.id}`);
      authUserId = existingUser.id;
      
      // Update password if needed
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: account.password,
          email_confirm: true,
          user_metadata: account.metadata
        }
      );
      
      if (updateError) {
        console.error(`   ⚠️  Error updating user:`, updateError.message);
      } else {
        console.log(`   ✅ Password updated`);
      }
    } else {
      // Create new auth user - try without metadata first if it fails
      let authData, authError;
      
      try {
        const result = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: account.metadata
        });
        authData = result.data;
        authError = result.error;
      } catch (err) {
        console.error(`   ⚠️  First attempt failed, trying without metadata...`);
        // Try again without metadata
        const result = await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true
        });
        authData = result.data;
        authError = result.error;
      }
      
      if (authError) {
        console.error(`   ❌ Error creating auth user:`, authError.message);
        console.error(`   Error code:`, authError.code);
        console.error(`   Error status:`, authError.status);
        
        // If it's a user already exists error, try to find the user
        if (authError.message?.includes('already') || authError.message?.includes('registered')) {
          console.log(`   ℹ️  User might already exist, searching...`);
          // The user might exist but wasn't in our list - skip for now
          return { success: false, error: authError, reason: 'user_might_exist' };
        }
        
        return { success: false, error: authError };
      }
      
      if (!authData?.user) {
        console.error(`   ❌ Auth user creation returned no user data`);
        return { success: false, error: { message: 'No user data returned' } };
      }
      
      authUserId = authData.user.id;
      console.log(`   ✅ Auth user created: ${authUserId}`);
      
      // Update metadata separately if we created without it
      if (!authData.user.user_metadata || Object.keys(authData.user.user_metadata).length === 0) {
        const { error: updateMetaError } = await supabase.auth.admin.updateUserById(
          authUserId,
          { user_metadata: account.metadata }
        );
        if (updateMetaError) {
          console.warn(`   ⚠️  Could not update metadata:`, updateMetaError.message);
        }
      }
    }
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authUserId)
      .maybeSingle();
    
    if (existingProfile) {
      console.log(`   ℹ️  Profile already exists, updating...`);
      
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: account.email,
          email_address: account.email,
          phone: account.phone,
          mobile_number: account.phone,
          full_name: account.fullName,
          role: account.role,
          password_changed: false,
          must_change_password: false
        })
        .eq('id', authUserId);
      
      if (updateError) {
        console.error(`   ❌ Error updating profile:`, updateError.message);
        return { success: false, error: updateError };
      }
      
      console.log(`   ✅ Profile updated`);
    } else {
      // Create new profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUserId,
          email: account.email,
          email_address: account.email,
          phone: account.phone,
          mobile_number: account.phone,
          full_name: account.fullName,
          role: account.role,
          password_changed: false,
          must_change_password: false
        });
      
      if (profileError) {
        console.error(`   ❌ Error creating profile:`, profileError.message);
        return { success: false, error: profileError };
      }
      
      console.log(`   ✅ Profile created`);
    }
    
    return { success: true, userId: authUserId };
  } catch (error) {
    console.error(`   ❌ Unexpected error:`, error.message);
    return { success: false, error };
  }
}

async function main() {
  console.log('🚀 Creating Demo Admin and Client Accounts\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const account of DEMO_ACCOUNTS) {
    const result = await createDemoAccount(account);
    results.push({ account: account.email, ...result });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  successful.forEach(r => {
    console.log(`   - ${r.account} (${r.userId})`);
  });
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach(r => {
      console.log(`   - ${r.account}: ${r.error?.message || 'Unknown error'}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n🔑 Login Credentials:\n');
  console.log('Admin:');
  console.log('  Email: admin@ellureconsulting.com');
  console.log('  Password: admin@123');
  console.log('\nClient:');
  console.log('  Email: client+infosys@ellureconsulting.com');
  console.log('  Password: client@123');
  console.log('\n✅ Done! You can now login with these credentials.\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

