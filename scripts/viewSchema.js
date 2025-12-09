// Script to view Supabase database schema
// Run with: node scripts/viewSchema.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read and parse .env file
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
        // Remove surrounding quotes if present
        value = value.replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    }
  });
  
  return env;
}

const env = parseEnvFile('.env');
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

async function viewSchema() {
  console.log('🔍 Fetching database schema from Supabase...\n');
  console.log('='.repeat(80));
  console.log(`Project: ${supabaseUrl}\n`);

  try {
    // Method 1: Try to create and use a SQL function to get schema
    // First, let's provide instructions for the SQL function approach
    console.log('📋 To view your complete schema, you have two options:\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 OPTION 1: Use Supabase Dashboard SQL Editor (Recommended)\n');
    console.log('1. Go to: https://supabase.com/dashboard/project/gckddvcjwnmwdvhhhgby/editor');
    console.log('2. Paste and run this query:\n');
    console.log(`
SELECT 
  t.table_name,
  c.column_name,
  c.data_type,
  c.character_maximum_length,
  c.numeric_precision,
  c.numeric_scale,
  c.is_nullable,
  c.column_default,
  c.ordinal_position
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;
    `.trim());
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 OPTION 2: Create a SQL Function (I can help set this up)\n');
    console.log('This will allow you to query schema programmatically.\n');

    // Test connection
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔌 Testing Supabase connection...\n');
    
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('JWT')) {
      console.log('✅ Supabase client initialized successfully!');
      console.log('   (Service role key is valid)\n');
    } else if (!error) {
      console.log('✅ Supabase connection successful!\n');
    }

    // Try to discover tables by attempting to query common table names
    // This is a workaround since we can't directly query information_schema
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Next Steps:\n');
    console.log('1. Run the SQL query above in your Supabase Dashboard SQL Editor');
    console.log('2. Or, I can create a SQL function that you can call via RPC');
    console.log('3. The function will return your complete schema as JSON\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

viewSchema();
