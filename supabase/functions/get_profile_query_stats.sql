
CREATE OR REPLACE FUNCTION public.get_profile_query_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  query_stats jsonb;
BEGIN
  SELECT 
    jsonb_agg(jsonb_build_object(
      'query', query,
      'calls', calls,
      'total_exec_time', total_exec_time,
      'mean_exec_time', mean_exec_time
    ))
  INTO query_stats
  FROM pg_stat_statements
  WHERE query ILIKE '%profiles%'
  AND query NOT ILIKE '%pg_stat_statements%'
  ORDER BY total_exec_time DESC
  LIMIT 20;
  
  RETURN jsonb_build_object(
    'timestamp', now(),
    'extension_enabled', true,
    'queries', COALESCE(query_stats, '[]'::jsonb)
  );
END;
$$;
