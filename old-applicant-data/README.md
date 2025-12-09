# Old Applicant Data Import

## Instructions

1. **Upload Excel Files**: Place all your Excel files (.xlsx, .xls) in the `excel-files` folder
2. **Analyze Files**: Run `npm run analyze-excel` to see what columns are in your Excel files
3. **Compare with Database**: The script will compare Excel columns with database schema
4. **Import Data**: Run `npm run import-excel` to import all data to Supabase

## Folder Structure

```
old-applicant-data/
├── excel-files/          # Place your Excel files here
├── README.md             # This file
└── analysis-results/     # Analysis results will be saved here
```

## Steps

1. Upload your Excel files to `excel-files/` folder
2. Run analysis: `node scripts/analyzeExcelFiles.js`
3. Review the analysis results
4. Run import: `node scripts/importExcelData.js`

