import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');

// Parse .env manually (simple approach)
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.+?)"?$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface TableInfo {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface ConstraintInfo {
  table_name: string;
  constraint_name: string;
  constraint_type: string;
  column_name: string | null;
}

async function viewSchema() {
  console.log('🔍 Fetching database schema...\n');
  console.log('='.repeat(80));

  try {
    // Get all tables in public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE')
      .order('table_name');

    if (tablesError) {
      // Try direct SQL query instead
      console.log('📊 Querying schema using direct SQL...\n');
      
      // Query using RPC or direct SQL
      const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
        query: `
          SELECT 
            t.table_name,
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,
            c.character_maximum_length
          FROM information_schema.tables t
          JOIN information_schema.columns c ON t.table_name = c.table_name
          WHERE t.table_schema = 'public' 
            AND t.table_type = 'BASE TABLE'
          ORDER BY t.table_name, c.ordinal_position;
        `
      });

      if (schemaError) {
        // Alternative: Use pg_catalog queries
        console.log('Using alternative method to query schema...\n');
        await querySchemaAlternative();
        return;
      }

      displaySchema(schemaData);
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('No tables found in the public schema.');
      return;
    }

    console.log(`\n📋 Found ${tables.length} table(s):\n`);
    
    // For each table, get column information
    for (const table of tables) {
      await displayTableInfo(table.table_name);
    }

  } catch (error) {
    console.error('❌ Error fetching schema:', error);
    await querySchemaAlternative();
  }
}

async function querySchemaAlternative() {
  console.log('\n📊 Querying schema using PostgreSQL system catalogs...\n');
  
  // This approach uses Supabase's REST API to query pg_catalog
  // Note: This requires the service role key and may need specific RPC functions
  
  console.log('💡 To view your complete schema, you can:');
  console.log('   1. Use Supabase Dashboard → Table Editor → View all tables');
  console.log('   2. Use Supabase Dashboard → SQL Editor → Run:');
  console.log('      SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';');
  console.log('   3. Use psql to connect directly:');
  console.log(`      psql "postgresql://postgres:[PASSWORD]@db.${supabaseUrl.split('//')[1].split('.')[0]}.supabase.co:5432/postgres"`);
  console.log('\n   4. Or I can create a script that uses the Supabase Management API\n');
}

async function displayTableInfo(tableName: string) {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📊 Table: ${tableName}`);
  console.log('─'.repeat(80));
  
  // Query column information
  let columns: any[] | null = null;
  try {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: tableName });

    if (error || !data) {
      console.log(`   (Column details require direct database access)`);
      return;
    }
    
    columns = data;
  } catch (error) {
    console.log(`   (Column details require direct database access)`);
    return;
  }

  if (columns && columns.length > 0) {
    console.log('\nColumns:');
    columns.forEach((col: any) => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  • ${col.column_name}: ${col.data_type}${nullable}${defaultVal}`);
    });
  }
}

function displaySchema(data: any) {
  if (!data || data.length === 0) {
    console.log('No schema data found.');
    return;
  }

  const tablesMap = new Map<string, any[]>();
  
  data.forEach((row: any) => {
    if (!tablesMap.has(row.table_name)) {
      tablesMap.set(row.table_name, []);
    }
    tablesMap.get(row.table_name)!.push(row);
  });

  tablesMap.forEach((columns, tableName) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`📊 Table: ${tableName}`);
    console.log('─'.repeat(80));
    console.log('\nColumns:');
    
    columns.forEach((col: any) => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      const maxLength = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
      console.log(`  • ${col.column_name}: ${col.data_type}${maxLength} ${nullable}${defaultVal}`);
    });
  });
}

// Run the script
viewSchema().catch(console.error);

