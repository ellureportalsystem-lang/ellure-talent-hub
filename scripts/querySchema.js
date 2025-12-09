// Script to query schema using the get_database_schema() function
// First run setupSchemaFunction.sql in Supabase SQL Editor
// Then run: node scripts/querySchema.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

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

async function querySchema() {
  console.log('🔍 Querying database schema...\n');
  console.log('='.repeat(80));

  try {
    const { data, error } = await supabase.rpc('get_database_schema');

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Make sure you have run setupSchemaFunction.sql in your Supabase SQL Editor first!\n');
      return;
    }

    if (!data || data.length === 0) {
      console.log('No tables found in the public schema.');
      return;
    }

    // Group by table
    const tablesMap = new Map();
    data.forEach(row => {
      if (!tablesMap.has(row.table_name)) {
        tablesMap.set(row.table_name, []);
      }
      tablesMap.get(row.table_name).push(row);
    });

    console.log(`\n📊 Found ${tablesMap.size} table(s):\n`);

    tablesMap.forEach((columns, tableName) => {
      console.log('─'.repeat(80));
      console.log(`\n📋 Table: ${tableName}`);
      console.log('─'.repeat(80));
      console.log('\nColumns:');
      
      columns.forEach(col => {
        let typeStr = col.data_type;
        
        if (col.character_max_length) {
          typeStr += `(${col.character_max_length})`;
        } else if (col.numeric_precision) {
          if (col.numeric_scale) {
            typeStr += `(${col.numeric_precision},${col.numeric_scale})`;
          } else {
            typeStr += `(${col.numeric_precision})`;
          }
        }
        
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`  • ${col.column_name.padEnd(30)} ${typeStr.padEnd(20)} ${nullable}${defaultVal}`);
      });
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Schema retrieved successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

querySchema();













