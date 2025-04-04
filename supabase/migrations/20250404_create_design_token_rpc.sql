
-- Create an RPC function for inserting design tokens
CREATE OR REPLACE FUNCTION insert_design_token(
  p_project_id TEXT,
  p_name TEXT,
  p_category TEXT,
  p_value JSONB,
  p_description TEXT
) RETURNS UUID AS $$
DECLARE
  v_token_id UUID;
BEGIN
  INSERT INTO design_tokens (
    project_id,
    name,
    category,
    value,
    description
  ) VALUES (
    p_project_id,
    p_name,
    p_category,
    p_value,
    p_description
  )
  RETURNING id INTO v_token_id;
  
  RETURN v_token_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
