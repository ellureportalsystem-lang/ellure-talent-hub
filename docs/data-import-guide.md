# Data Import Guide

## Overview
This guide explains how to import old applicant data from Excel files into the Supabase database.

## Folder Structure
```
data/
  └── old-applicant-data/     # Upload Excel files here
      └── README.md
```

## Step-by-Step Process

### Step 1: Upload Excel Files
1. Place your Excel files (`.xlsx`, `.xls`, `.xlsm`) in the `data/old-applicant-data/` folder
2. You can organize files in subdirectories if needed
3. Files can have multiple sheets - all will be processed

### Step 2: Inspect Excel Files
Run the inspection script to analyze all Excel files:

```bash
npm run data:inspect
```

**OR**

```bash
node scripts/inspectExcelFiles.js
```

**What it does:**
- Scans all Excel files in the folder
- Analyzes all sheets and columns
- Shows data types, null counts, and sample values
- Saves analysis to `data/excel-analysis.json`

**Output:**
- List of all files found
- Column structure for each sheet
- Data type analysis
- Summary of all unique columns

### Step 3: Compare with Database
Compare Excel columns with your database schema:

```bash
npm run data:compare
```

**OR**

```bash
node scripts/compareWithDatabase.js
```

**What it does:**
- Compares Excel columns with `applicants` and `profiles` tables
- Identifies missing columns
- Generates SQL to add missing columns
- Saves comparison to `data/column-comparison.json`

**Output:**
- Columns found in database
- Missing columns that need to be added
- SQL statements to add missing columns

### Step 4: Add Missing Columns (If Needed)
If the comparison shows missing columns:

1. Go to Supabase SQL Editor: `https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/editor`
2. Run the SQL statements provided by the comparison script
3. Example:
   ```sql
   ALTER TABLE applicants ADD COLUMN IF NOT EXISTS new_column_name TEXT;
   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS new_column_name TEXT;
   ```

### Step 5: Import Data
Once all columns are in place, import the data:

```bash
npm run data:import
```

**OR**

```bash
node scripts/importApplicantData.js
```

**What it does:**
- Reads all Excel files
- Maps Excel columns to database columns
- Creates records in both `profiles` and `applicants` tables
- Links profiles to applicants via `user_id` and `applicant_id`
- Handles duplicates (upserts based on email)
- Shows progress and summary

**Column Mapping:**
The script automatically maps common column names:
- `name`, `full name` → `name` (applicants) / `full_name` (profiles)
- `email`, `email address` → `email`
- `phone`, `phone number`, `mobile` → `phone`
- `city`, `location` → `city` (applicants) / `location` (profiles)
- And many more...

**Data Handling:**
- Empty/null values are set to `null` (not empty strings)
- Required fields: `email` OR `phone` (at least one)
- Default values:
  - `status`: 'submitted'
  - `role`: 'applicant'
  - `is_old_applicant`: true
  - `verified`: false
  - `is_deleted`: false

## Column Mapping Reference

### Applicants Table Mapping
| Excel Column Name | Database Column |
|------------------|-----------------|
| name, full name, fullname | name |
| phone, phone number, mobile | phone |
| email, email address | email |
| city, location | city |
| skill, skills | skill |
| job role, role | job_role |
| education level, qualification | education_level |
| current company, company | current_company |
| current ctc, ctc | current_ctc |
| expected ctc | expected_ctc |
| key skills | key_skills |
| notice period | notice_period |
| resume, resume file | resume_file |
| profile image, photo | profile_image |

### Profiles Table Mapping
| Excel Column Name | Database Column |
|------------------|-----------------|
| name, full name, fullname | full_name |
| email, email address | email |
| phone, phone number, mobile | phone |
| location, city | location |
| key skills, skills | key_skills |
| resume, resume file | resume_file |
| profile image, photo | profile_image |
| headline | headline |
| summary | summary |

## Troubleshooting

### Error: "No Excel files found"
- Make sure files are in `data/old-applicant-data/` folder
- Check file extensions: `.xlsx`, `.xls`, `.xlsm`
- Verify file permissions

### Error: "Missing columns in database"
- Run `npm run data:compare` to see missing columns
- Add missing columns using SQL in Supabase dashboard
- Re-run the import

### Error: "Duplicate key violation"
- This is normal - the script uses `upsert` to handle duplicates
- Records are updated if they already exist (based on email)

### Error: "Missing email and phone"
- At least one of `email` or `phone` is required
- Rows without both will be skipped
- Check your Excel data for missing values

### Import is slow
- Large files may take time
- Progress is shown every 10 rows
- Be patient for large datasets

## Data Verification

After import, verify data in Supabase:

1. **Check Profiles:**
   ```sql
   SELECT COUNT(*) FROM profiles WHERE is_old_applicant = true;
   ```

2. **Check Applicants:**
   ```sql
   SELECT COUNT(*) FROM applicants;
   ```

3. **Check Links:**
   ```sql
   SELECT COUNT(*) FROM applicants a
   JOIN profiles p ON a.user_id = p.id;
   ```

## Notes

- Excel files are ignored by git (for privacy)
- Analysis files are also ignored
- Always backup your database before importing
- The import script uses service role key for full access
- Duplicate emails will update existing records
- All imported applicants are marked as `is_old_applicant = true`

## Next Steps

After importing:
1. Verify data in Supabase dashboard
2. Check that profiles and applicants are linked correctly
3. Test viewing applicants in the Client/Admin dashboards
4. Update UI to show imported data

---

*For issues or questions, check the script output for detailed error messages.*















