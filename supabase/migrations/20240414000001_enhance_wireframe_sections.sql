
-- Enhanced schema for wireframe_sections table to ensure it matches our TypeScript interfaces

-- First ensure the table has all required columns
ALTER TABLE IF EXISTS public.wireframe_sections
ADD COLUMN IF NOT EXISTS component_variant TEXT,
ADD COLUMN IF NOT EXISTS style_properties JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS design_reasoning TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS style_variants JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dynamic_elements JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS layout_score FLOAT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS optimization_suggestions JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pattern_match TEXT DEFAULT NULL;

-- Add new columns that were missing in our TypeScript definitions
ALTER TABLE IF EXISTS public.wireframe_sections
ADD COLUMN IF NOT EXISTS animation_suggestions JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS mobile_layout JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS copy_suggestions JSONB DEFAULT NULL;

-- Create an RPC function to update wireframe sections efficiently
CREATE OR REPLACE FUNCTION public.update_wireframe_sections(
  p_wireframe_id UUID,
  p_sections JSONB
) RETURNS SETOF wireframe_sections
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing sections
  DELETE FROM wireframe_sections 
  WHERE wireframe_id = p_wireframe_id;
  
  -- Insert new ones with all our properties
  RETURN QUERY
  INSERT INTO wireframe_sections (
    wireframe_id,
    name,
    section_type,
    layout_type,
    components,
    position_order,
    description,
    component_variant,
    style_properties,
    design_reasoning,
    copy_suggestions,
    mobile_layout,
    animation_suggestions,
    style_variants,
    dynamic_elements,
    layout_score,
    optimization_suggestions,
    pattern_match
  )
  SELECT
    p_wireframe_id,
    s->>'name',
    s->>'sectionType',
    s->>'layoutType',
    s->'components',
    (s->>'positionOrder')::int,
    s->>'description',
    s->>'componentVariant',
    CASE 
      WHEN s ? 'style' THEN s->'style'
      ELSE NULL::jsonb
    END,
    s->>'designReasoning',
    s->'copySuggestions',
    s->'mobileLayout',
    s->'animationSuggestions',
    s->'styleVariants',
    s->'dynamicElements',
    (s->>'layoutScore')::float,
    s->'optimizationSuggestions',
    s->>'patternMatch'
  FROM jsonb_array_elements(p_sections) s
  RETURNING *;
END;
$$;

-- Create a validation function to validate wireframe sections
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
