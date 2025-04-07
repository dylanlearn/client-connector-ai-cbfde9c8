
-- This script helps set up or reset the pg_stat_statements extension
-- which is required for the ProfileQueryMonitor to work

-- First, check if extension is installed
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configure the extension to track more queries
ALTER SYSTEM SET pg_stat_statements.max = 10000;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Reset statistics if needed (uncomment to use)
-- SELECT pg_stat_statements_reset();

-- Create index on profiles table if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- The following query will help confirm that pg_stat_statements is properly installed
-- and has the expected column names
DO $$
DECLARE
  col_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'pg_stat_statements'
    AND column_name = 'total_exec_time'
  ) INTO col_exists;
  
  IF NOT col_exists THEN
    RAISE NOTICE 'Warning: The pg_stat_statements extension may not be properly installed or is an older version.';
    RAISE NOTICE 'Expected column "total_exec_time" not found.';
  ELSE
    RAISE NOTICE 'pg_stat_statements extension is properly installed with expected column names.';
  END IF;
END $$;
