// Script to inspect Excel files and analyze their structure
// Run with: node scripts/inspectExcelFiles.js

import pkg from 'xlsx';
const { readFile: readXLSX, utils } = pkg;
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../data/old-applicant-data');

function getAllExcelFiles(dir) {
  const files = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllExcelFiles(fullPath));
      } else if (stat.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (['.xlsx', '.xls', '.xlsm'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }
  
  return files;
}

function inspectExcelFile(filePath) {
  try {
    const workbook = readXLSX(filePath);
    const sheets = [];
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: null,
        raw: false
      });
      
      // Get headers (first row)
      const headers = data[0] || [];
      
      // Count rows with data (excluding header)
      const dataRows = data.slice(1).filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
      );
      
      // Get all unique column names
      const columns = headers.filter(h => h !== null && h !== undefined && h !== '');
      
      // Analyze data types for each column
      const columnAnalysis = columns.map((col, index) => {
        const sampleValues = dataRows
          .slice(0, 100) // Sample first 100 rows
          .map(row => row[index])
          .filter(val => val !== null && val !== undefined && val !== '');
        
        const types = new Set();
        sampleValues.forEach(val => {
          if (typeof val === 'number') types.add('number');
          else if (typeof val === 'boolean') types.add('boolean');
          else if (val instanceof Date) types.add('date');
          else if (typeof val === 'string') {
            if (val.match(/^\d{4}-\d{2}-\d{2}/)) types.add('date-string');
            else if (val.match(/^\d+$/)) types.add('numeric-string');
            else types.add('string');
          }
        });
        
        const nullCount = dataRows.filter(row => 
          row[index] === null || row[index] === undefined || row[index] === ''
        ).length;
        
        return {
          name: col,
          index,
          dataType: Array.from(types).join(' | ') || 'unknown',
          nullCount,
          nullPercentage: ((nullCount / dataRows.length) * 100).toFixed(2),
          sampleValues: sampleValues.slice(0, 3)
        };
      });
      
      sheets.push({
        name: sheetName,
        totalRows: data.length,
        dataRows: dataRows.length,
        columns: columns.length,
        columnAnalysis
      });
    });
    
    return {
      fileName: filePath.split(/[/\\]/).pop(),
      filePath,
      sheets
    };
  } catch (error) {
    return {
      fileName: filePath.split(/[/\\]/).pop(),
      filePath,
      error: error.message
    };
  }
}

async function inspectAllFiles() {
  console.log('🔍 Inspecting Excel files in data/old-applicant-data...\n');
  console.log('='.repeat(80));
  
  const excelFiles = getAllExcelFiles(dataDir);
  
  if (excelFiles.length === 0) {
    console.log('❌ No Excel files found in data/old-applicant-data/');
    console.log('\n💡 Please upload your Excel files (.xlsx, .xls, .xlsm) to:');
    console.log(`   ${dataDir}\n`);
    return;
  }
  
  console.log(`\n📊 Found ${excelFiles.length} Excel file(s):\n`);
  
  const allColumns = new Set();
  const allFilesData = [];
  
  excelFiles.forEach((file, index) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`\n📄 File ${index + 1}: ${file.split(/[/\\]/).pop()}\n`);
    
    const fileData = inspectExcelFile(file);
    allFilesData.push(fileData);
    
    if (fileData.error) {
      console.error(`❌ Error: ${fileData.error}`);
      return;
    }
    
    fileData.sheets.forEach(sheet => {
      console.log(`\n📋 Sheet: "${sheet.name}"`);
      console.log(`   Total Rows: ${sheet.totalRows}`);
      console.log(`   Data Rows: ${sheet.dataRows}`);
      console.log(`   Columns: ${sheet.columns}\n`);
      
      console.log('   Column Analysis:');
      sheet.columnAnalysis.forEach(col => {
        console.log(`   • ${col.name.padEnd(40)} Type: ${col.dataType.padEnd(20)} Null: ${col.nullCount} (${col.nullPercentage}%)`);
        allColumns.add(col.name);
      });
    });
  });
  
  // Summary
  console.log('\n\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Files: ${excelFiles.length}`);
  console.log(`Total Unique Columns: ${allColumns.size}\n`);
  
  console.log('All Unique Columns Found:');
  Array.from(allColumns).sort().forEach((col, index) => {
    console.log(`  ${(index + 1).toString().padStart(3)}. ${col}`);
  });
  
  // Save analysis to JSON
  const analysis = {
    files: allFilesData,
    allColumns: Array.from(allColumns).sort(),
    summary: {
      totalFiles: excelFiles.length,
      totalColumns: allColumns.size
    }
  };
  
  const fs = await import('fs');
  fs.writeFileSync(
    join(__dirname, '../data/excel-analysis.json'),
    JSON.stringify(analysis, null, 2)
  );
  
  console.log('\n\n✅ Analysis saved to: data/excel-analysis.json\n');
}

inspectAllFiles().catch(console.error);

