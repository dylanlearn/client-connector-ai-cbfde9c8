
-- Component Types table
CREATE TABLE IF NOT EXISTS component_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Component Fields table - fields that a component type can have
CREATE TABLE IF NOT EXISTS component_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type_id UUID NOT NULL REFERENCES component_types(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(30) NOT NULL, -- text, textarea, select, boolean, etc.
  description TEXT,
  default_value JSONB,
  options JSONB, -- For selects, this contains the options
  validation JSONB, -- Contains validation rules
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Component Styles table - reusable style configurations
CREATE TABLE IF NOT EXISTS component_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  style_token VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  properties JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Component Variants table
CREATE TABLE IF NOT EXISTS component_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type_id UUID NOT NULL REFERENCES component_types(id) ON DELETE CASCADE,
  variant_token VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  default_data JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(component_type_id, variant_token)
);

-- Many-to-many relationship between variants and styles
CREATE TABLE IF NOT EXISTS variant_styles (
  variant_id UUID NOT NULL REFERENCES component_variants(id) ON DELETE CASCADE,
  style_id UUID NOT NULL REFERENCES component_styles(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (variant_id, style_id)
);

-- Create triggers to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_component_types_modtime
BEFORE UPDATE ON component_types
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_component_fields_modtime
BEFORE UPDATE ON component_fields
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_component_styles_modtime
BEFORE UPDATE ON component_styles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_component_variants_modtime
BEFORE UPDATE ON component_variants
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
