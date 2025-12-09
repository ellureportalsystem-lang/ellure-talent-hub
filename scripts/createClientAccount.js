// Script to create client account manually
// Run with: node scripts/createClientAccount.js

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
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CLIENT_EMAIL = 'client.infosys@ellureconsulting.com';
const CLIENT_PASSWORD = 'client@123';

async function createClientAccount() {
  console.log('🚀 Creating Client Account\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Create auth user (minimal approach)
    console.log('\n📝 Step 1: Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: CLIENT_EMAIL,
      password: CLIENT_PASSWORD,
      email_confirm: true
    });
    
    if (authError) {
      console.error(`❌ Error: ${authError.message}`);
      console.error(`   Code: ${authError.code}`);
      console.error(`   Status: ${authError.status}`);
      
      // If user exists, try to find it
      if (authError.message?.includes('already') || authError.code === 'user_already_registered') {
        console.log('\n🔍 User might already exist, searching...');
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users?.users?.find(u => u.email?.toLowerCase() === CLIENT_EMAIL.toLowerCase());
        if (existing) {
          console.log(`✅ Found existing user: ${existing.id}`);
          const clientId = await createClientRecord(existing.id);
          await createProfile(existing.id, clientId);
          return;
        }
      }
      return;
    }
    
    if (!authData?.user) {
      console.error('❌ No user data returned');
      return;
    }
    
    const userId = authData.user.id;
    console.log(`✅ Auth user created: ${userId}`);
    
    // Step 2: Create client record
    const clientId = await createClientRecord(userId);
    
    // Step 3: Create profile
    await createProfile(userId, clientId);
    
    // Step 4: Update metadata
    console.log('\n📝 Step 4: Updating user metadata...');
    const { error: metaError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: 'Infosys Client',
        role: 'client',
        is_demo: true,
        company: 'Infosys'
      }
    });
    
    if (metaError) {
      console.warn(`⚠️  Could not update metadata: ${metaError.message}`);
    } else {
      console.log('✅ Metadata updated');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Client account created successfully!');
    console.log(`\n🔑 Login Credentials:`);
    console.log(`   Email: ${CLIENT_EMAIL}`);
    console.log(`   Password: ${CLIENT_PASSWORD}\n`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function createClientRecord(userId) {
  console.log('\n📝 Step 2: Creating client record...');
  
  // Check if client record exists
  const { data: existing } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  let clientId;
  
  if (existing) {
    console.log('ℹ️  Client record exists, using existing...');
    clientId = existing.id;
  } else {
    // Create client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        company_name: 'Infosys',
        contact_person: 'Infosys Client',
        email: CLIENT_EMAIL,
        phone: '+919876543211',
        subscription_plan: 'demo',
        subscription_start_date: new Date().toISOString(),
        is_active: true
      })
      .select('id')
      .single();
    
    if (clientError) {
      console.error(`❌ Error creating client record: ${clientError.message}`);
      return null;
    }
    
    clientId = clientData.id;
    console.log(`✅ Client record created: ${clientId}`);
  }
  
  return clientId;
}

async function createProfile(userId, clientId) {
  console.log('\n📝 Step 3: Creating profile...');
  
  if (!clientId) {
    console.error('❌ Cannot create profile without client_id');
    return;
  }
  
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (existing) {
    console.log('ℹ️  Profile exists, updating...');
    const { error } = await supabase
      .from('profiles')
      .update({
        email: CLIENT_EMAIL,
        email_address: CLIENT_EMAIL,
        phone: '+919876543211',
        mobile_number: '+919876543211',
        full_name: 'Infosys Client',
        role: 'client',
        client_id: clientId,
        password_changed: false,
        must_change_password: false
      })
      .eq('id', userId);
    
    if (error) {
      console.error(`❌ Error updating profile: ${error.message}`);
      return;
    }
    console.log('✅ Profile updated');
  } else {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: CLIENT_EMAIL,
        email_address: CLIENT_EMAIL,
        phone: '+919876543211',
        mobile_number: '+919876543211',
        full_name: 'Infosys Client',
        role: 'client',
        client_id: clientId,
        password_changed: false,
        must_change_password: false
      });
    
    if (error) {
      console.error(`❌ Error creating profile: ${error.message}`);
      return;
    }
    console.log('✅ Profile created');
  }
}

createClientAccount().catch(console.error);

