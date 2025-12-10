// Script to compare Excel columns with database schema
// Run with: node scripts/compareWithDatabase.js

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function compareWithDatabase() {
  console.log('🔍 Comparing Excel columns with database schema...\n');
  console.log('='.repeat(80));
  
  // Read Excel analysis
  let excelAnalysis;
  try {
    const excelData = await readFile(join(__dirname, '../data/excel-analysis.json'), 'utf-8');
    excelAnalysis = JSON.parse(excelData);
  } catch (error) {
    console.error('❌ Error: Please run inspectExcelFiles.js first!');
    console.error('   Run: node scripts/inspectExcelFiles.js\n');
    return;
  }
  
  // Read database schema
  let schema;
  try {
    const schemaData = await readFile(join(__dirname, '../schema.json'), 'utf-8');
    schema = JSON.parse(schemaData);
  } catch (error) {
    console.error('❌ Error: schema.json not found!');
    console.error('   Run: node scripts/queryCompleteSchema.js first\n');
    return;
  }
  
  // Get database columns
  const dbApplicantColumns = new Set();
  const dbProfileColumns = new Set();
  
  schema.tables.forEach(table => {
    if (table.table_name === 'applicants') {
      table.columns.forEach(col => {
        dbApplicantColumns.add(col.column_name.toLowerCase());
      });
    }
    if (table.table_name === 'profiles') {
      table.columns.forEach(col => {
        dbProfileColumns.add(col.column_name.toLowerCase());
      });
    }
  });
  
  // Get Excel columns (normalized to lowercase)
  const excelColumns = new Set(
    excelAnalysis.allColumns.map(col => col.toLowerCase().trim())
  );
  
  // Find missing columns
  const missingInApplicants = [];
  const missingInProfiles = [];
  const foundInApplicants = [];
  const foundInProfiles = [];
  
  excelColumns.forEach(excelCol => {
    const normalized = excelCol.toLowerCase().trim();
    
    if (dbApplicantColumns.has(normalized)) {
      foundInApplicants.push(excelCol);
    } else {
      missingInApplicants.push(excelCol);
    }
    
    if (dbProfileColumns.has(normalized)) {
      foundInProfiles.push(excelCol);
    } else {
      missingInProfiles.push(excelCol);
    }
  });
  
  // Display results
  console.log('\n📊 COMPARISON RESULTS\n');
  
  console.log(`Excel Columns Found: ${excelColumns.size}`);
  console.log(`Applicants Table Columns: ${dbApplicantColumns.size}`);
  console.log(`Profiles Table Columns: ${dbProfileColumns.size}\n`);
  
  console.log('─'.repeat(80));
  console.log('\n✅ COLUMNS FOUND IN APPLICANTS TABLE:\n');
  if (foundInApplicants.length > 0) {
    foundInApplicants.sort().forEach((col, index) => {
      console.log(`  ${(index + 1).toString().padStart(3)}. ${col}`);
    });
  } else {
    console.log('  (none)');
  }
  
  console.log('\n❌ COLUMNS MISSING IN APPLICANTS TABLE:\n');
  if (missingInApplicants.length > 0) {
    missingInApplicants.sort().forEach((col, index) => {
      console.log(`  ${(index + 1).toString().padStart(3)}. ${col}`);
    });
  } else {
    console.log('  (none - all columns exist!)');
  }
  
  console.log('\n─'.repeat(80));
  console.log('\n✅ COLUMNS FOUND IN PROFILES TABLE:\n');
  if (foundInProfiles.length > 0) {
    foundInProfiles.sort().forEach((col, index) => {
      console.log(`  ${(index + 1).toString().padStart(3)}. ${col}`);
    });
  } else {
    console.log('  (none)');
  }
  
  console.log('\n❌ COLUMNS MISSING IN PROFILES TABLE:\n');
  if (missingInProfiles.length > 0) {
    missingInProfiles.sort().forEach((col, index) => {
      console.log(`  ${(index + 1).toString().padStart(3)}. ${col}`);
    });
  } else {
    console.log('  (none - all columns exist!)');
  }
  
  // Generate SQL for missing columns
  if (missingInApplicants.length > 0 || missingInProfiles.length > 0) {
    console.log('\n\n' + '='.repeat(80));
    console.log('\n💡 RECOMMENDED SQL TO ADD MISSING COLUMNS\n');
    console.log('-- Add missing columns to applicants table:');
    
    missingInApplicants.forEach(col => {
      const normalized = col.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      console.log(`ALTER TABLE applicants ADD COLUMN IF NOT EXISTS ${normalized} TEXT;`);
    });
    
    if (missingInProfiles.length > 0) {
      console.log('\n-- Add missing columns to profiles table:');
      missingInProfiles.forEach(col => {
        const normalized = col.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        console.log(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${normalized} TEXT;`);
      });
    }
  }
  
  // Save comparison results
  const comparison = {
    excelColumns: Array.from(excelColumns).sort(),
    dbApplicantColumns: Array.from(dbApplicantColumns).sort(),
    dbProfileColumns: Array.from(dbProfileColumns).sort(),
    foundInApplicants: foundInApplicants.sort(),
    missingInApplicants: missingInApplicants.sort(),
    foundInProfiles: foundInProfiles.sort(),
    missingInProfiles: missingInProfiles.sort()
  };
  
  const fs = await import('fs');
  fs.writeFileSync(
    join(__dirname, '../data/column-comparison.json'),
    JSON.stringify(comparison, null, 2)
  );
  
  console.log('\n\n✅ Comparison saved to: data/column-comparison.json\n');
}

compareWithDatabase().catch(console.error);














