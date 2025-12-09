-- ============================================================================
-- ADD MISSING COLUMNS TO MATCH EXCEL FILES
-- ============================================================================
-- Run this to add the 2 missing columns to applicants table
-- ============================================================================

-- Add communication column to applicants (exists in Excel but missing in new columns)
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS communication TEXT;

-- Add education column to applicants (exists in some Excel files like Graphic Designer)
ALTER TABLE applicants ADD COLUMN IF NOT EXISTS education TEXT;

-- Verify columns were added
SELECT 
  'communication' as column_name,
  EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'applicants' 
      AND column_name = 'communication'
  ) as exists_in_applicants;

SELECT 
  'education' as column_name,
  EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'applicants' 
      AND column_name = 'education'
  ) as exists_in_applicants;













