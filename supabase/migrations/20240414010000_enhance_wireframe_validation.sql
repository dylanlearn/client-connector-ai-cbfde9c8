
-- Add validation function for wireframe sections
CREATE OR REPLACE FUNCTION public.validate_wireframe_sections(
  p_sections JSONB
) RETURNS TABLE (
  is_valid BOOLEAN,
  error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  section JSONB;
  validation_errors TEXT[] := '{}';
BEGIN
  -- Check if sections is an array
  IF jsonb_typeof(p_sections) != 'array' THEN
    RETURN QUERY SELECT false, 'Sections must be an array';
    RETURN;
  END IF;
  
  -- Iterate through each section
  FOR section IN SELECT * FROM jsonb_array_elements(p_sections)
  LOOP
    -- Check required fields
    IF NOT (section ? 'id') THEN 
      validation_errors := array_append(validation_errors, 'Section missing id');
    END IF;
    
    IF NOT (section ? 'name') THEN 
      validation_errors := array_append(validation_errors, 'Section missing name');
    END IF;
    
    IF NOT (section ? 'sectionType') THEN 
      validation_errors := array_append(validation_errors, 'Section missing sectionType');
    END IF;
  END LOOP;
  
  -- Return validation result
  IF array_length(validation_errors, 1) > 0 THEN
    RETURN QUERY SELECT false, array_to_string(validation_errors, ', ');
  ELSE
    RETURN QUERY SELECT true, 'Validation successful';
  END IF;
END;
$$;

-- Create an RPC function for validating an entire wireframe
CREATE OR REPLACE FUNCTION public.validate_wireframe(
  p_wireframe JSONB
) RETURNS TABLE (
  is_valid BOOLEAN,
  errors JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  validation_errors JSONB := '[]'::JSONB;
  sections_result RECORD;
  is_wireframe_valid BOOLEAN := true;
BEGIN
  -- Check required top-level fields
  IF NOT (p_wireframe ? 'id') THEN
    validation_errors := validation_errors || '"Wireframe missing id"';
    is_wireframe_valid := false;
  END IF;
  
  IF NOT (p_wireframe ? 'title') THEN
    validation_errors := validation_errors || '"Wireframe missing title"';
    is_wireframe_valid := false;
  END IF;
  
  IF NOT (p_wireframe ? 'sections') THEN
    validation_errors := validation_errors || '"Wireframe missing sections"';
    is_wireframe_valid := false;
  ELSIF jsonb_typeof(p_wireframe->'sections') != 'array' THEN
    validation_errors := validation_errors || '"Sections must be an array"';
    is_wireframe_valid := false;
  END IF;
  
  -- Check color scheme
  IF NOT (p_wireframe ? 'colorScheme') THEN
    validation_errors := validation_errors || '"Wireframe missing colorScheme"';
    is_wireframe_valid := false;
  ELSE
    -- Check required color scheme fields
    FOREACH field IN ARRAY ARRAY['primary', 'secondary', 'accent', 'background', 'text']
    LOOP
      IF NOT (p_wireframe->'colorScheme' ? field) THEN
        validation_errors := validation_errors || ('"ColorScheme missing ' || field || '"');
        is_wireframe_valid := false;
      END IF;
    END LOOP;
  END IF;
  
  -- Check typography
  IF NOT (p_wireframe ? 'typography') THEN
    validation_errors := validation_errors || '"Wireframe missing typography"';
    is_wireframe_valid := false;
  ELSE
    -- Check required typography fields
    FOREACH field IN ARRAY ARRAY['headings', 'body']
    LOOP
      IF NOT (p_wireframe->'typography' ? field) THEN
        validation_errors := validation_errors || ('"Typography missing ' || field || '"');
        is_wireframe_valid := false;
      END IF;
    END LOOP;
  END IF;
  
  -- Validate sections if present
  IF p_wireframe ? 'sections' AND jsonb_typeof(p_wireframe->'sections') = 'array' THEN
    -- Call the section validation function
    SELECT * INTO sections_result 
    FROM public.validate_wireframe_sections(p_wireframe->'sections');
    
    IF NOT sections_result.is_valid THEN
      validation_errors := validation_errors || to_jsonb(sections_result.error_message);
      is_wireframe_valid := false;
    END IF;
  END IF;
  
  RETURN QUERY SELECT is_wireframe_valid, validation_errors;
END;
$$;
