# Old Applicant Data

## Purpose
This folder is for uploading Excel files containing historical applicant data that needs to be imported into the system.

## Instructions

1. **Upload Excel Files**
   - Place your Excel files (.xlsx, .xls, .xlsm) in this folder
   - Files can be in subdirectories if needed

2. **Inspect Files**
   - Run: `node scripts/inspectExcelFiles.js`
   - This will analyze all Excel files and show their structure

3. **Compare with Database**
   - Run: `node scripts/compareWithDatabase.js`
   - This will compare Excel columns with database schema
   - It will identify missing columns that need to be added

4. **Import Data**
   - After adding any missing columns to the database
   - Run: `node scripts/importApplicantData.js`
   - This will import data into both `profiles` and `applicants` tables

## Notes

- Excel files in this folder are ignored by git (for privacy)
- Analysis files are also ignored
- Make sure to backup your data before importing















