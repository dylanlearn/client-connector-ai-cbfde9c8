
-- Create a base function for analyzing profile queries
-- This centralizes the logic and allows other functions to call it with different parameters

CREATE OR REPLACE FUNCTION public.analyze_profile_queries(
  query_pattern text DEFAULT '%profile%'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  extension_exists boolean;
BEGIN
  -- Check if pg_stat_statements extension is installed
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;
  
  IF NOT extension_exists THEN
    -- Return structured result indicating extension is not enabled
    RETURN jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', false,
      'queries', jsonb_build_array()
    );
  END IF;
  
  -- Try to query pg_stat_statements to get profile-related queries
  BEGIN
    SELECT jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', true,
      'queries', COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'query', query,
              'calls', calls,
              'total_exec_time', total_exec_time,
              'mean_exec_time', mean_exec_time
            )
          )
          FROM pg_stat_statements
          WHERE query ILIKE query_pattern
          ORDER BY total_exec_time DESC
          LIMIT 50
        ),
        '[]'::jsonb
      )
    ) INTO result;
    
    RETURN result;
  EXCEPTION WHEN OTHERS THEN
    -- Handle errors accessing pg_stat_statements
    RETURN jsonb_build_object(
      'timestamp', now(),
      'extension_enabled', false,
      'error', 'Error accessing pg_stat_statements: ' || SQLERRM,
      'queries', jsonb_build_array()
    );
  END;
END;
$$;

-- Create a function to run setup for pg_stat_statements
CREATE OR REPLACE FUNCTION public.run_pg_stat_statements_setup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension_exists boolean;
  result jsonb;
  setup_commands text[];
  cmd text;
BEGIN
  -- Check if extension already exists
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements'
  ) INTO extension_exists;
  
  -- Prepare setup commands with error handling for each
  setup_commands := ARRAY[
    'CREATE EXTENSION IF NOT EXISTS pg_stat_statements',
    'ALTER SYSTEM SET pg_stat_statements.max = 10000',
    'ALTER SYSTEM SET pg_stat_statements.track = all',
    'SELECT pg_stat_statements_reset()' -- Reset statistics for clean start
  ];
  
  -- Initialize result object
  result := jsonb_build_object(
    'timestamp', now(),
    'success', true,
    'actions', jsonb_build_array(),
    'extension_existed', extension_exists
  );
  
  -- Execute each command with error handling
  FOREACH cmd IN ARRAY setup_commands LOOP
    BEGIN
      EXECUTE cmd;
      
      -- Record successful command
      result := jsonb_set(
        result, 
        '{actions}', 
        (result->'actions') || jsonb_build_object('command', cmd, 'success', true)
      );
    EXCEPTION WHEN OTHERS THEN
      -- Record failed command
      result := jsonb_set(
        result,
        '{actions}', 
        (result->'actions') || jsonb_build_object(
          'command', cmd, 
          'success', false,
          'error', SQLERRM
        )
      );
      
      -- Mark overall process as failed
      result := jsonb_set(result, '{success}', 'false'::jsonb);
    END;
  END LOOP;
  
  -- Provide instructions for completing setup
  result := jsonb_set(
    result,
    '{next_steps}',
    '"To complete setup, restart the database or reload the PostgreSQL configuration"'::jsonb
  );
  
  RETURN result;
END;
$$;
