
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

// Define wireframe validation schemas
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
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

// Validate wireframe structure with detailed logging
function validateWireframe(wireframe: any): ValidationResult {
  console.log(`[validate-wireframe] Validating wireframe with ID: ${wireframe?.id || 'unknown'}`);
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for required top-level fields
  if (!wireframe.id) {
    errors.push('Wireframe must have an ID');
    console.error('[validate-wireframe] Missing required field: id');
  }
  
  if (!wireframe.title) {
    errors.push('Wireframe must have a title');
    console.error('[validate-wireframe] Missing required field: title');
  }
  
  if (!Array.isArray(wireframe.sections)) {
    errors.push('Wireframe must have a sections array');
    console.error('[validate-wireframe] Missing or invalid sections array');
  } else {
    console.log(`[validate-wireframe] Found ${wireframe.sections.length} sections`);
  }
  
  // Validate color scheme
  if (!wireframe.colorScheme) {
    errors.push('Wireframe must have a colorScheme');
    console.error('[validate-wireframe] Missing colorScheme object');
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
    const missingColors = requiredColors.filter(color => !wireframe.colorScheme[color]);
    
    if (missingColors.length > 0) {
      missingColors.forEach(color => {
        errors.push(`ColorScheme must include ${color} color`);
        console.error(`[validate-wireframe] Missing color in colorScheme: ${color}`);
      });
    }
    
    // Validate that colors are valid hex codes if present
    Object.entries(wireframe.colorScheme).forEach(([key, value]) => {
      if (typeof value === 'string' && !(/^#([0-9A-F]{3}){1,2}$/i.test(value as string))) {
        warnings.push(`Color '${key}' does not appear to be a valid hex code: ${value}`);
        console.warn(`[validate-wireframe] Invalid color format for ${key}: ${value}`);
      }
    });
  }
  
  // Validate typography
  if (!wireframe.typography) {
    errors.push('Wireframe must have typography');
    console.error('[validate-wireframe] Missing typography object');
  } else {
    const requiredFonts = ['headings', 'body'];
    const missingFonts = requiredFonts.filter(font => !wireframe.typography[font]);
    
    if (missingFonts.length > 0) {
      missingFonts.forEach(font => {
        errors.push(`Typography must include ${font} font`);
        console.error(`[validate-wireframe] Missing font in typography: ${font}`);
      });
    }
  }
  
  // Validate sections (if they exist)
  if (Array.isArray(wireframe.sections)) {
    wireframe.sections.forEach((section, index) => {
      const sectionId = section.id || `unknown-${index}`;
      console.log(`[validate-wireframe] Validating section ${sectionId}`);
      
      if (!section.id) {
        errors.push(`Section at index ${index} is missing an id`);
        console.error(`[validate-wireframe] Section at index ${index} has no ID`);
      }
      
      if (!section.name) {
        errors.push(`Section at index ${index} is missing a name`);
        console.error(`[validate-wireframe] Section ${sectionId} has no name`);
      }
      
      if (!section.sectionType) {
        errors.push(`Section at index ${index} is missing a sectionType`);
        console.error(`[validate-wireframe] Section ${sectionId} has no sectionType`);
      }
      
      // Check for section position or dimensions if applicable
      if (!section.position && !section.dimensions) {
        warnings.push(`Section ${sectionId} has neither position nor dimensions defined`);
        console.warn(`[validate-wireframe] Section ${sectionId} has no position or dimensions`);
      }
    });
  }
  
  console.log(`[validate-wireframe] Validation complete. Found ${errors.length} errors and ${warnings.length} warnings.`);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

// Validate wireframe sections with database consistency checks
async function validateWireframeWithDb(wireframe: any): Promise<ValidationResult> {
  console.log(`[validate-wireframe] Starting database validation for wireframe: ${wireframe?.id || 'unknown'}`);
  
  const basicValidation = validateWireframe(wireframe);
  
  // If basic validation failed, no need to check database
  if (!basicValidation.isValid) {
    console.log('[validate-wireframe] Basic validation failed, skipping database checks');
    return basicValidation;
  }
  
  try {
    console.log('[validate-wireframe] Performing database validation checks');
    
    // Call the database validation function (defined in migrations)
    const { data, error } = await supabaseClient.rpc('validate_wireframe_sections', {
      p_sections: JSON.stringify(wireframe.sections)
    });
    
    if (error) {
      console.error('[validate-wireframe] Database validation error:', error);
      return {
        isValid: false,
        errors: [`Database validation error: ${error.message}`],
        warnings: basicValidation.warnings
      };
    }
    
    if (!data.is_valid) {
      console.warn('[validate-wireframe] Database validation found issues:', data.error_message);
    } else {
      console.log('[validate-wireframe] Database validation successful');
    }
    
    return {
      isValid: data.is_valid,
      errors: data.is_valid ? [] : [data.error_message],
      warnings: basicValidation.warnings
    };
  } catch (err) {
    console.error('[validate-wireframe] Exception during database validation:', err);
    return {
      isValid: false,
      errors: [`Error during database validation: ${err instanceof Error ? err.message : String(err)}`],
      warnings: basicValidation.warnings
    };
  }
}

// Handle HTTP requests
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const requestStartTime = new Date().getTime();
    console.log(`[validate-wireframe] Received validation request at ${new Date().toISOString()}`);
    
    // Parse request JSON
    const { wireframe, validateWithDb = false } = await req.json();
    
    if (!wireframe) {
      console.error('[validate-wireframe] Missing wireframe data in request');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing wireframe data',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    console.log(`[validate-wireframe] Validating wireframe ${wireframe.id || 'unknown'}. Database validation: ${validateWithDb}`);
    
    // Perform validation
    const validationResult = validateWithDb 
      ? await validateWireframeWithDb(wireframe)
      : validateWireframe(wireframe);
    
    const requestDuration = new Date().getTime() - requestStartTime;
    console.log(`[validate-wireframe] Validation completed in ${requestDuration}ms. Result: ${validationResult.isValid ? 'VALID' : 'INVALID'}`);
    
    // Return validation result
    return new Response(
      JSON.stringify({
        success: true,
        isValid: validationResult.isValid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        wireframeId: wireframe.id,
        timestamp: new Date().toISOString(),
        duration: requestDuration
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('[validate-wireframe] Error processing validation request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Error processing validation request: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
        stackTrace: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
