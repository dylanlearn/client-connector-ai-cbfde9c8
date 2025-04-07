
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
