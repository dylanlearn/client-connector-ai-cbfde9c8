import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

// Define wireframe validation schemas
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Define type definitions for wireframe data
interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components?: any[];
  // Other optional properties
  [key: string]: any;
}

interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    headings: string;
    body: string;
    [key: string]: string;
  };
  [key: string]: any;
}

// Get Supabase client from environment variables
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Validate wireframe structure
function validateWireframe(wireframe: any): ValidationResult {
  console.log('Validating wireframe:', wireframe.id);
  const errors: string[] = [];
  
  // Check for required top-level fields
  if (!wireframe.id) errors.push('Wireframe must have an ID');
  if (!wireframe.title) errors.push('Wireframe must have a title');
  if (!Array.isArray(wireframe.sections)) errors.push('Wireframe must have a sections array');
  
  // Validate color scheme
  if (!wireframe.colorScheme) {
    errors.push('Wireframe must have a colorScheme');
  } else {
    ['primary', 'secondary', 'accent', 'background', 'text'].forEach(color => {
      if (!wireframe.colorScheme[color]) errors.push(`ColorScheme must include ${color} color`);
    });
  }
  
  // Validate typography
  if (!wireframe.typography) {
    errors.push('Wireframe must have typography');
  } else {
    ['headings', 'body'].forEach(font => {
      if (!wireframe.typography[font]) errors.push(`Typography must include ${font} font`);
    });
  }
  
  // Validate sections (if they exist)
  if (Array.isArray(wireframe.sections)) {
    wireframe.sections.forEach((section, index) => {
      if (!section.id) errors.push(`Section at index ${index} is missing an id`);
      if (!section.name) errors.push(`Section at index ${index} is missing a name`);
      if (!section.sectionType) errors.push(`Section at index ${index} is missing a sectionType`);
    });
  }
  
  console.log(`Validation complete. Found ${errors.length} errors.`);
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Validate wireframe sections with database consistency checks
async function validateWireframeWithDb(wireframe: any): Promise<ValidationResult> {
  const basicValidation = validateWireframe(wireframe);
  
  // If basic validation failed, no need to check database
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  console.log('Performing database validation checks');
  
  try {
    // Call the database validation function (defined in migrations)
    const { data, error } = await supabaseClient.rpc('validate_wireframe_sections', {
      p_sections: JSON.stringify(wireframe.sections)
    });
    
    if (error) {
      console.error('Database validation error:', error);
      return {
        isValid: false,
        errors: [`Database validation error: ${error.message}`]
      };
    }
    
    return {
      isValid: data.is_valid,
      errors: data.is_valid ? [] : [data.error_message]
    };
  } catch (err) {
    console.error('Error during database validation:', err);
    return {
      isValid: false,
      errors: [`Error during database validation: ${err instanceof Error ? err.message : String(err)}`]
    };
  }
}

// Handle HTTP requests
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Parse request JSON
    const { wireframe, validateWithDb = false } = await req.json();
    
    if (!wireframe) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing wireframe data' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    console.log(`Validating wireframe ${wireframe.id}. Database validation: ${validateWithDb}`);
    
    // Perform validation
    const validationResult = validateWithDb 
      ? await validateWireframeWithDb(wireframe)
      : validateWireframe(wireframe);
    
    // Return validation result
    return new Response(
      JSON.stringify({
        success: true,
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        wireframeId: wireframe.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing validation request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error processing validation request: ${error instanceof Error ? error.message : String(error)}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
