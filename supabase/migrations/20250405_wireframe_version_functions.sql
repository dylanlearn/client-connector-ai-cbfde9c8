
-- Create helper functions for wireframe version management

-- Function to get the latest version number for a wireframe and branch
CREATE OR REPLACE FUNCTION get_latest_version_number(p_wireframe_id UUID, p_branch_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_version_number INTEGER;
BEGIN
  SELECT MAX(version_number)
  INTO v_version_number
  FROM wireframe_versions
  WHERE wireframe_id = p_wireframe_id
  AND branch_name = p_branch_name;
  
  RETURN COALESCE(v_version_number, 0);
END;
$$;

-- Function to set all versions of a wireframe branch to inactive
CREATE OR REPLACE FUNCTION set_versions_inactive(p_wireframe_id UUID, p_branch_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE wireframe_versions
  SET is_current = false
  WHERE wireframe_id = p_wireframe_id
  AND branch_name = p_branch_name;
END;
$$;

-- Function to create a wireframe version
CREATE OR REPLACE FUNCTION create_wireframe_version(
  p_wireframe_id UUID,
  p_version_number INTEGER,
  p_data JSONB,
  p_change_description TEXT,
  p_created_by UUID,
  p_is_current BOOLEAN,
  p_parent_version_id UUID,
  p_branch_name TEXT
)
RETURNS wireframe_versions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_version wireframe_versions;
BEGIN
  INSERT INTO wireframe_versions (
    wireframe_id,
    version_number,
    data,
    change_description,
    created_by,
    is_current,
    parent_version_id,
    branch_name
  ) VALUES (
    p_wireframe_id,
    p_version_number,
    p_data,
    p_change_description,
    p_created_by,
    p_is_current,
    p_parent_version_id,
    p_branch_name
  )
  RETURNING * INTO v_version;
  
  RETURN v_version;
END;
$$;

-- Function to update a wireframe with version data
CREATE OR REPLACE FUNCTION update_wireframe_with_version(
  p_wireframe_id UUID,
  p_version_id UUID,
  p_wireframe_data JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE ai_wireframes
  SET 
    generation_params = jsonb_set(
      generation_params, 
      '{result_data}', 
      p_wireframe_data
    ),
    generation_params = jsonb_set(
      generation_params,
      '{latest_version_id}',
      to_jsonb(p_version_id::text)
    ),
    updated_at = now()
  WHERE id = p_wireframe_id;
END;
$$;

-- Function to get wireframe versions
CREATE OR REPLACE FUNCTION get_wireframe_versions(p_wireframe_id UUID)
RETURNS SETOF wireframe_versions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM wireframe_versions
  WHERE wireframe_id = p_wireframe_id
  ORDER BY created_at DESC;
END;
$$;

-- Function to get a specific wireframe version
CREATE OR REPLACE FUNCTION get_wireframe_version(p_version_id UUID)
RETURNS wireframe_versions
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_version wireframe_versions;
BEGIN
  SELECT *
  INTO v_version
  FROM wireframe_versions
  WHERE id = p_version_id;
  
  RETURN v_version;
END;
$$;

-- Function to get branches for a wireframe
CREATE OR REPLACE FUNCTION get_wireframe_branches(p_wireframe_id UUID)
RETURNS TABLE(
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  version_count BIGINT,
  latest_version_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    branch_name AS name,
    MIN(created_at) AS created_at,
    COUNT(*) AS version_count,
    (
      SELECT id
      FROM wireframe_versions v2
      WHERE v2.wireframe_id = p_wireframe_id
      AND v2.branch_name = v1.branch_name
      ORDER BY v2.created_at DESC
      LIMIT 1
    ) AS latest_version_id
  FROM wireframe_versions v1
  WHERE v1.wireframe_id = p_wireframe_id
  GROUP BY branch_name
  ORDER BY MIN(created_at) DESC;
END;
$$;

-- Function to compare two wireframe versions
CREATE OR REPLACE FUNCTION compare_wireframe_versions(
  p_version_id1 UUID,
  p_version_id2 UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_version1 wireframe_versions;
  v_version2 wireframe_versions;
  v_changes JSONB := '[]'::JSONB;
  v_summary TEXT;
  v_result JSONB;
BEGIN
  -- Get both versions
  SELECT * INTO v_version1 FROM wireframe_versions WHERE id = p_version_id1;
  SELECT * INTO v_version2 FROM wireframe_versions WHERE id = p_version_id2;
  
  IF v_version1 IS NULL OR v_version2 IS NULL THEN
    v_summary := 'Could not find both versions for comparison';
    RETURN jsonb_build_object(
      'changes', '[]'::JSONB,
      'summary', v_summary
    );
  END IF;
  
  -- This is a simplified comparison for now - in a real implementation,
  -- you'd implement a proper JSON diff algorithm here
  
  -- Count added sections
  WITH section_counts AS (
    SELECT 
      COALESCE((v_version1.data->'sections')::JSONB, '[]'::JSONB) AS old_sections,
      COALESCE((v_version2.data->'sections')::JSONB, '[]'::JSONB) AS new_sections
  )
  SELECT 
    jsonb_build_object(
      'added', jsonb_array_length(new_sections) - jsonb_array_length(old_sections)
        + (jsonb_array_length(new_sections) - jsonb_array_length(old_sections))::int,
      'modified', jsonb_array_length(old_sections) / 2,
      'removed', 0
    )
  INTO v_changes
  FROM section_counts;
  
  -- Create a summary
  v_summary := 'Comparison between version ' || v_version1.version_number::text || 
    ' and version ' || v_version2.version_number::text;
      
  -- Add details about changes in title and description
  IF v_version1.data->>'title' <> v_version2.data->>'title' THEN
    v_summary := v_summary || '. Title was changed.';
  END IF;
  
  IF v_version1.data->>'description' <> v_version2.data->>'description' THEN
    v_summary := v_summary || '. Description was changed.';
  END IF;
  
  -- Add section changes
  v_summary := v_summary || '. Section changes: ' || 
    COALESCE((v_changes->>'added')::text, '0') || ' added, ' || 
    COALESCE((v_changes->>'modified')::text, '0') || ' modified, ' || 
    COALESCE((v_changes->>'removed')::text, '0') || ' removed.';
  
  -- Build the result object
  v_result := jsonb_build_object(
    'changes', v_changes,
    'summary', v_summary
  );
  
  RETURN v_result;
END;
$$;
