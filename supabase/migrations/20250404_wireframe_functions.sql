
-- Functions for wireframe cache management
CREATE OR REPLACE FUNCTION public.check_wireframe_cache(p_params_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cache_record JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'id', id,
      'wireframe_data', wireframe_data
    )
  INTO v_cache_record
  FROM wireframe_cache
  WHERE params_hash = p_params_hash
  AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN v_cache_record;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_cache_hit(p_cache_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE wireframe_cache
  SET hit_count = hit_count + 1
  WHERE id = p_cache_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.store_wireframe_in_cache(
  p_params_hash TEXT,
  p_wireframe_data JSONB,
  p_expires_at TIMESTAMP WITH TIME ZONE,
  p_generation_params JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO wireframe_cache (
    params_hash,
    wireframe_data,
    expires_at,
    generation_params
  ) VALUES (
    p_params_hash,
    p_wireframe_data,
    p_expires_at,
    p_generation_params
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_expired_wireframe_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM wireframe_cache
    WHERE expires_at < now()
    RETURNING id
  )
  SELECT COUNT(*) INTO v_count FROM deleted;
  
  RETURN v_count;
END;
$$;

-- Functions for background task management
CREATE OR REPLACE FUNCTION public.create_background_task(
  p_task_type TEXT,
  p_input_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task_id UUID;
BEGIN
  INSERT INTO wireframe_background_tasks (
    task_type,
    input_data
  ) VALUES (
    p_task_type,
    p_input_data
  )
  RETURNING id INTO v_task_id;
  
  RETURN v_task_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_background_task_status(
  p_task_id UUID,
  p_status TEXT,
  p_output_data JSONB DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_update_values JSONB = jsonb_build_object(
    'status', p_status
  );
BEGIN
  IF p_output_data IS NOT NULL THEN
    v_update_values = v_update_values || jsonb_build_object('output_data', p_output_data);
  END IF;
  
  IF p_error_message IS NOT NULL THEN
    v_update_values = v_update_values || jsonb_build_object('error_message', p_error_message);
  END IF;
  
  IF p_status IN ('completed', 'failed') THEN
    v_update_values = v_update_values || jsonb_build_object('completed_at', now());
  END IF;
  
  UPDATE wireframe_background_tasks
  SET
    status = (v_update_values->>'status')::TEXT,
    output_data = CASE WHEN v_update_values ? 'output_data' THEN (v_update_values->'output_data') ELSE output_data END,
    error_message = CASE WHEN v_update_values ? 'error_message' THEN (v_update_values->>'error_message')::TEXT ELSE error_message END,
    completed_at = CASE WHEN v_update_values ? 'completed_at' THEN (v_update_values->>'completed_at')::TIMESTAMP WITH TIME ZONE ELSE completed_at END
  WHERE id = p_task_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_next_pending_task()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_task JSONB;
BEGIN
  SELECT to_jsonb(t)
  INTO v_task
  FROM wireframe_background_tasks t
  WHERE status = 'pending'
  ORDER BY created_at ASC
  LIMIT 1;
  
  RETURN v_task;
END;
$$;

-- Functions for system monitoring
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

-- Rate limiting functions
CREATE OR REPLACE FUNCTION public.check_wireframe_rate_limits(
  p_user_id UUID,
  p_max_daily INTEGER,
  p_max_hourly INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_daily_count INTEGER;
  v_hourly_count INTEGER;
  v_today_start TIMESTAMP WITH TIME ZONE;
  v_hour_start TIMESTAMP WITH TIME ZONE;
  v_is_limited BOOLEAN;
BEGIN
  -- Calculate time ranges
  v_today_start := date_trunc('day', now());
  v_hour_start := date_trunc('hour', now());
  
  -- Get daily count
  SELECT COUNT(*)
  INTO v_daily_count
  FROM wireframe_generation_metrics
  WHERE project_id = p_user_id
  AND created_at >= v_today_start;
  
  -- Get hourly count
  SELECT COUNT(*)
  INTO v_hourly_count
  FROM wireframe_generation_metrics
  WHERE project_id = p_user_id
  AND created_at >= v_hour_start;
  
  -- Check if limited
  v_is_limited := (v_daily_count >= p_max_daily) OR (v_hourly_count >= p_max_hourly);
  
  RETURN jsonb_build_object(
    'daily_count', v_daily_count,
    'hourly_count', v_hourly_count,
    'is_rate_limited', v_is_limited
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.record_wireframe_generation(
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO wireframe_generation_metrics (
    project_id,
    prompt,
    success
  ) VALUES (
    p_user_id,
    'Rate limit tracking',
    true
  );
END;
$$;

-- Metrics analysis functions
CREATE OR REPLACE FUNCTION public.get_wireframe_metrics(
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_project_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_count INTEGER;
  v_success_count INTEGER;
  v_failure_count INTEGER;
  v_success_rate NUMERIC;
  v_avg_generation_time NUMERIC;
BEGIN
  -- Build the query dynamically based on whether project_id is provided
  IF p_project_id IS NULL THEN
    -- Get metrics for all projects
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE success = true),
      COUNT(*) FILTER (WHERE success = false),
      CASE WHEN COUNT(*) > 0 THEN 
        (COUNT(*) FILTER (WHERE success = true))::NUMERIC / COUNT(*)::NUMERIC * 100 
      ELSE 0 END,
      AVG(generation_time) FILTER (WHERE success = true AND generation_time IS NOT NULL)
    INTO
      v_total_count,
      v_success_count,
      v_failure_count,
      v_success_rate,
      v_avg_generation_time
    FROM
      wireframe_generation_metrics
    WHERE
      created_at >= p_start_date;
  ELSE
    -- Get metrics for specific project
    SELECT 
      COUNT(*),
      COUNT(*) FILTER (WHERE success = true),
      COUNT(*) FILTER (WHERE success = false),
      CASE WHEN COUNT(*) > 0 THEN 
        (COUNT(*) FILTER (WHERE success = true))::NUMERIC / COUNT(*)::NUMERIC * 100 
      ELSE 0 END,
      AVG(generation_time) FILTER (WHERE success = true AND generation_time IS NOT NULL)
    INTO
      v_total_count,
      v_success_count,
      v_failure_count,
      v_success_rate,
      v_avg_generation_time
    FROM
      wireframe_generation_metrics
    WHERE
      created_at >= p_start_date
      AND project_id = p_project_id;
  END IF;
  
  -- Return as JSON
  RETURN jsonb_build_object(
    'total_count', v_total_count,
    'success_count', v_success_count,
    'failure_count', v_failure_count,
    'success_rate', v_success_rate,
    'average_generation_time', COALESCE(v_avg_generation_time, 0)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.analyze_wireframe_sections(
  p_start_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sections JSONB;
  v_total_sections INTEGER := 0;
  v_section_counts JSONB := '{}'::JSONB;
  v_section_data JSONB;
BEGIN
  -- Extract section types from AI wireframes
  FOR v_section_data IN
    SELECT
      jsonb_array_elements(
        CASE 
          WHEN generation_params->'result_data'->'sections' IS NOT NULL THEN
            generation_params->'result_data'->'sections'
          ELSE 
            '[]'::jsonb
        END
      ) as section
    FROM
      ai_wireframes
    WHERE
      created_at >= p_start_date
  LOOP
    -- Count each section type
    IF v_section_data->'section'->'sectionType' IS NOT NULL THEN
      v_section_counts := jsonb_set(
        v_section_counts,
        ARRAY[v_section_data->'section'->>'sectionType'],
        COALESCE(v_section_counts->(v_section_data->'section'->>'sectionType'), '0')::jsonb + 1,
        true
      );
      v_total_sections := v_total_sections + 1;
    END IF;
  END LOOP;
  
  -- Calculate percentages
  v_sections := '[]'::jsonb;
  FOR v_section_data IN
    SELECT 
      jsonb_build_object(
        'section_type', key,
        'count', value::int,
        'percentage', CASE WHEN v_total_sections > 0 THEN
          (value::int::numeric / v_total_sections::numeric) * 100
        ELSE 0 END
      ) as data
    FROM 
      jsonb_each(v_section_counts)
  LOOP
    v_sections := v_sections || v_section_data->'data';
  END LOOP;
  
  RETURN v_sections;
END;
$$;
