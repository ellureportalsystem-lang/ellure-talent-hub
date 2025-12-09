// Query complete database schema including tables, functions, triggers, etc.
// First run: scripts/getCompleteSchemaFunction.sql in Supabase SQL Editor
// Then run: node scripts/queryCompleteSchema.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

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
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env');
  process.exit(1);
}

// Use service role key if available, otherwise use anon key (function is granted to anon)
const apiKey = serviceRoleKey || anonKey;
if (!apiKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, apiKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function formatType(col) {
  let typeStr = col.data_type;
  
  if (col.character_maximum_length) {
    typeStr += `(${col.character_maximum_length})`;
  } else if (col.numeric_precision) {
    if (col.numeric_scale) {
      typeStr += `(${col.numeric_precision},${col.numeric_scale})`;
    } else {
      typeStr += `(${col.numeric_precision})`;
    }
  }
  
  return typeStr;
}

async function queryCompleteSchema() {
  console.log('🔍 Fetching COMPLETE database schema...\n');
  console.log('='.repeat(80));

  try {
    const { data, error } = await supabase.rpc('get_complete_schema');

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Make sure you have run getCompleteSchemaFunction.sql in your Supabase SQL Editor first!\n');
      console.log('   Go to: https://supabase.com/dashboard/project/gckddvcjwnmwdvhhhgby/editor');
      console.log('   Copy and run the contents of: scripts/getCompleteSchemaFunction.sql\n');
      return;
    }

    if (!data) {
      console.log('No schema data found.');
      return;
    }

    const schema = data;

    // Save to file
    writeFileSync('schema.json', JSON.stringify(schema, null, 2));
    console.log('✅ Schema saved to schema.json\n');

    // Display Tables
    if (schema.tables && schema.tables.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n📊 TABLES (${schema.tables.length})\n`);
      
      schema.tables.forEach(table => {
        console.log('─'.repeat(80));
        console.log(`\n📋 Table: ${table.table_name}`);
        console.log('─'.repeat(80));
        
        if (table.columns && table.columns.length > 0) {
          console.log('\nColumns:');
          table.columns.forEach(col => {
            const typeStr = formatType(col);
            const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
            const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
            console.log(`  • ${col.column_name.padEnd(30)} ${typeStr.padEnd(25)} ${nullable}${defaultVal}`);
          });
        }
      });
    }

    // Display Primary Keys
    if (schema.primary_keys && schema.primary_keys.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🔑 PRIMARY KEYS (${schema.primary_keys.length})\n`);
      schema.primary_keys.forEach(pk => {
        console.log(`  • ${pk.table_name}: ${pk.columns.join(', ')} (${pk.constraint_name})`);
      });
    }

    // Display Foreign Keys
    if (schema.foreign_keys && schema.foreign_keys.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🔗 FOREIGN KEYS (${schema.foreign_keys.length})\n`);
      schema.foreign_keys.forEach(fk => {
        console.log(`  • ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name} (${fk.constraint_name})`);
      });
    }

    // Display Unique Constraints
    if (schema.unique_constraints && schema.unique_constraints.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n✨ UNIQUE CONSTRAINTS (${schema.unique_constraints.length})\n`);
      schema.unique_constraints.forEach(uc => {
        console.log(`  • ${uc.table_name}: ${uc.columns.join(', ')} (${uc.constraint_name})`);
      });
    }

    // Display Indexes
    if (schema.indexes && schema.indexes.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n📇 INDEXES (${schema.indexes.length})\n`);
      schema.indexes.forEach(idx => {
        console.log(`  • ${idx.table_name}.${idx.index_name}`);
        console.log(`    ${idx.index_definition}`);
      });
    }

    // Display Functions
    if (schema.functions && schema.functions.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n⚙️  FUNCTIONS (${schema.functions.length})\n`);
      schema.functions.forEach(func => {
        console.log(`  • ${func.function_name} (${func.routine_type})`);
        if (func.routine_definition) {
          const def = func.routine_definition.substring(0, 200);
          console.log(`    ${def}${func.routine_definition.length > 200 ? '...' : ''}`);
        }
      });
    }

    // Display Triggers
    if (schema.triggers && schema.triggers.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n⚡ TRIGGERS (${schema.triggers.length})\n`);
      schema.triggers.forEach(trigger => {
        console.log(`  • ${trigger.trigger_name}`);
        console.log(`    Table: ${trigger.event_object_table}`);
        console.log(`    Event: ${trigger.event_manipulation} (${trigger.action_timing})`);
        if (trigger.action_statement) {
          const stmt = trigger.action_statement.substring(0, 150);
          console.log(`    Action: ${stmt}${trigger.action_statement.length > 150 ? '...' : ''}`);
        }
      });
    }

    // Display Views
    if (schema.views && schema.views.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n👁️  VIEWS (${schema.views.length})\n`);
      schema.views.forEach(view => {
        console.log(`  • ${view.view_name}`);
        if (view.view_definition) {
          const def = view.view_definition.substring(0, 200);
          console.log(`    ${def}${view.view_definition.length > 200 ? '...' : ''}`);
        }
      });
    }

    // Display Sequences
    if (schema.sequences && schema.sequences.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🔢 SEQUENCES (${schema.sequences.length})\n`);
      schema.sequences.forEach(seq => {
        console.log(`  • ${seq.sequence_name} (${seq.data_type})`);
        console.log(`    Start: ${seq.start_value}, Min: ${seq.minimum_value}, Max: ${seq.maximum_value}, Increment: ${seq.increment}`);
      });
    }

    // Display Types
    if (schema.types && schema.types.length > 0) {
      console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🏷️  CUSTOM TYPES (${schema.types.length})\n`);
      schema.types.forEach(type => {
        console.log(`  • ${type.type_name} (${type.type_type})`);
      });
    }

    console.log('\n\n' + '='.repeat(80));
    console.log('\n✅ Complete schema retrieved and saved to schema.json!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

queryCompleteSchema();




