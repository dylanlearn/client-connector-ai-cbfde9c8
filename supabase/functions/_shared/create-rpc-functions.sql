
-- Database performance check function
CREATE OR REPLACE FUNCTION public.check_database_performance()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  WITH table_stats AS (
    SELECT
      schemaname,
      relname as table,
      seq_scan,
      idx_scan,
      n_tup_ins,
      n_tup_upd,
      n_tup_del,
      n_live_tup,
      n_dead_tup,
      CASE 
        WHEN n_live_tup = 0 THEN 0
        ELSE (n_dead_tup::FLOAT / n_live_tup::FLOAT) * 100
      END AS dead_tup_ratio
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
  )
  SELECT
    jsonb_build_object(
      'table_stats', jsonb_agg(
        jsonb_build_object(
          'table', table,
          'live_rows', n_live_tup,
          'dead_rows', n_dead_tup,
          'dead_row_ratio', dead_tup_ratio,
          'sequentialScans', seq_scan,
          'indexScans', idx_scan
        )
        ORDER BY dead_tup_ratio DESC
      ),
      'high_vacuum_tables', jsonb_agg(table) FILTER (WHERE dead_tup_ratio > 20),
      'timestamp', now()
    )
  INTO result
  FROM table_stats;
  
  RETURN result;
END;
$$;

-- Function to record system events
CREATE OR REPLACE FUNCTION public.record_system_event(
  p_event_type TEXT,
  p_details JSONB,
  p_severity TEXT DEFAULT 'info'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO wireframe_system_events (
    event_type,
    details,
    severity
  ) VALUES (
    p_event_type,
    p_details,
    p_severity
  );
END;
$$;

-- Function to record health check
CREATE OR REPLACE FUNCTION public.record_health_check(
  p_component TEXT, 
  p_status TEXT,
  p_response_time_ms INTEGER DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_check_id UUID;
BEGIN
  INSERT INTO public.system_health_checks (
    component, status, response_time_ms, details
  ) VALUES (
    p_component, p_status, p_response_time_ms, p_details
  ) RETURNING id INTO v_check_id;
  
  RETURN v_check_id;
END;
$$;

-- Function to analyze profile queries
CREATE OR REPLACE FUNCTION public.analyze_profile_queries()
RETURNS JSONB
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
      'total_time', total_time,
      'mean_time', mean_time
    ))
  INTO query_stats
  FROM pg_stat_statements
  WHERE query ILIKE '%profiles%'
  AND query NOT ILIKE '%pg_stat_statements%'
  ORDER BY total_time DESC
  LIMIT 20;
  
  RETURN jsonb_build_object(
    'timestamp', now(),
    'queries', COALESCE(query_stats, '[]'::jsonb)
  );
END;
$$;
