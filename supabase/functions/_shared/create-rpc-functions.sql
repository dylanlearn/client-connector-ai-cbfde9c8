
-- Function to analyze profile queries
CREATE OR REPLACE FUNCTION public.analyze_profile_queries(
  max_queries integer DEFAULT 20,
  query_filter text DEFAULT '%profiles%'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_stats jsonb;
  extension_exists boolean;
BEGIN
  -- Check if the extension exists
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;
  
  -- If extension doesn't exist, return early with status
  IF NOT extension_exists THEN
    RETURN jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', false,
      'queries', '[]'::jsonb
    );
  END IF;

  -- Get query statistics with filtering
  SELECT 
    jsonb_agg(jsonb_build_object(
      'query', query,
      'calls', calls,
      'total_exec_time', total_exec_time,
      'mean_exec_time', mean_exec_time
    ))
  INTO query_stats
  FROM pg_stat_statements
  WHERE query ILIKE query_filter
  AND query NOT ILIKE '%pg_stat_statements%'
  ORDER BY total_exec_time DESC
  LIMIT max_queries;
  
  RETURN jsonb_build_object(
    'timestamp', now(),
    'extension_enabled', true,
    'queries', COALESCE(query_stats, '[]'::jsonb)
  );
END;
$$;

-- Function to get profile query stats - uses the base analyze function
CREATE OR REPLACE FUNCTION public.get_profile_query_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use the base function with default parameters
  RETURN public.analyze_profile_queries();
END;
$$;

-- Function to run setup for pg_stat_statements
CREATE OR REPLACE FUNCTION public.run_pg_stat_statements_setup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension_exists boolean;
BEGIN
  -- Check if extension exists first
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;
  
  -- Create extension if it doesn't exist
  IF NOT extension_exists THEN
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  END IF;
  
  -- Configure the extension settings
  EXECUTE 'ALTER SYSTEM SET pg_stat_statements.max = 10000';
  EXECUTE 'ALTER SYSTEM SET pg_stat_statements.track = ''all''';
  
  -- Create index on profiles table if it doesn't exist
  CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
  
  -- Reset statistics to start fresh
  SELECT pg_stat_statements_reset();
  
  RETURN jsonb_build_object(
    'success', true,
    'timestamp', now(),
    'message', 'pg_stat_statements setup completed successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'timestamp', now(),
    'message', 'Error setting up pg_stat_statements: ' || SQLERRM
  );
END;
$$;
