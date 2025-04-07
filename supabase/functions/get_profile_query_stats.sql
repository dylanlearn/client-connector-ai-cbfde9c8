
-- The base function is now defined in _shared/create-rpc-functions.sql
-- This file is kept for backward compatibility but now uses the base function

CREATE OR REPLACE FUNCTION public.get_profile_query_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  extension_exists boolean;
  pg_version text;
BEGIN
  -- Check if pg_stat_statements extension is installed and active
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;

  -- Get PostgreSQL version for logging
  SELECT version() INTO pg_version;
  
  -- Log diagnostic information
  RAISE NOTICE 'PostgreSQL Version: %', pg_version;
  RAISE NOTICE 'pg_stat_statements extension exists: %', extension_exists;
  
  IF NOT extension_exists THEN
    -- Return structured result indicating extension is not enabled
    RETURN jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', false,
      'error', 'pg_stat_statements extension is not installed',
      'queries', jsonb_build_array(),
      'pg_version', pg_version
    );
  END IF;
  
  -- Check if the extension is actually working by attempting to query it
  BEGIN
    -- Try to access pg_stat_statements to verify it's working
    EXECUTE 'SELECT COUNT(*) FROM pg_stat_statements LIMIT 1';
    
    -- If we got here, extension is working, call the base function
    -- with specific filter for profile queries
    RETURN public.analyze_profile_queries();
    
  EXCEPTION WHEN OTHERS THEN
    -- Extension exists but there was an error accessing it
    RETURN jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', false,
      'error', 'Error accessing pg_stat_statements: ' || SQLERRM,
      'queries', jsonb_build_array(),
      'pg_version', pg_version
    );
  END;
END;
$$;

-- Create a helper function to check if the extension is available
CREATE OR REPLACE FUNCTION public.check_pg_stat_statements_availability()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension_exists boolean;
  can_access boolean;
  stats_count integer;
  pg_version text;
BEGIN
  -- Get PostgreSQL version
  SELECT version() INTO pg_version;
  
  -- Check if extension is installed
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;
  
  -- Try to access it
  BEGIN
    EXECUTE 'SELECT COUNT(*) FROM pg_stat_statements' INTO stats_count;
    can_access := true;
  EXCEPTION WHEN OTHERS THEN
    can_access := false;
    stats_count := 0;
  END;
  
  RETURN jsonb_build_object(
    'timestamp', now(),
    'extension_exists', extension_exists,
    'can_access', can_access,
    'stats_count', stats_count,
    'pg_version', pg_version
  );
END;
$$;
