
-- Function to update wireframe data without using SQL directly in TypeScript
CREATE OR REPLACE FUNCTION update_wireframe_data(
  p_wireframe_id UUID,
  p_data JSONB
)
RETURNS ai_wireframes
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wireframe ai_wireframes;
BEGIN
  UPDATE ai_wireframes
  SET 
    generation_params = jsonb_set(
      generation_params, 
      '{result_data}', 
      p_data
    ),
    updated_at = now()
  WHERE id = p_wireframe_id
  RETURNING * INTO v_wireframe;
  
  RETURN v_wireframe;
END;
$$;
