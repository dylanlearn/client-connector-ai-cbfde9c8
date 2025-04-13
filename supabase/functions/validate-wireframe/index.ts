
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client with the Admin key
const supabaseAdmin = createClient(
  // Supabase API URL - env var exported by default.
  Deno.env.get('SUPABASE_URL') ?? '',
  // Supabase API ANON KEY - env var exported by default.
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationResponse {
  isValid: boolean;
  errors: ValidationError[];
}

const validateWireframeData = (wireframeData: any): ValidationResponse => {
  console.log("Validating wireframe data:", JSON.stringify({ 
    id: wireframeData.id,
    title: wireframeData.title,
    sectionCount: wireframeData.sections?.length
  }));

  const errors: ValidationError[] = [];
  
  // Check required fields
  if (!wireframeData.id) {
    errors.push({ path: 'id', message: 'Wireframe must have an ID' });
  } else if (typeof wireframeData.id !== 'string') {
    errors.push({ path: 'id', message: 'Wireframe ID must be a string' });
  }
  
  if (!wireframeData.title) {
    errors.push({ path: 'title', message: 'Wireframe must have a title' });
  } else if (typeof wireframeData.title !== 'string') {
    errors.push({ path: 'title', message: 'Wireframe title must be a string' });
  }
  
  // Check sections with additional type validation
  if (!wireframeData.sections) {
    errors.push({ path: 'sections', message: 'Wireframe must have sections' });
  } else if (!Array.isArray(wireframeData.sections)) {
    errors.push({ path: 'sections', message: 'Wireframe sections must be an array' });
  } else {
    // Validate each section
    wireframeData.sections.forEach((section: any, index: number) => {
      if (!section.id) {
        errors.push({ path: `sections[${index}].id`, message: 'Section must have an ID' });
      }
      
      if (!section.name) {
        errors.push({ path: `sections[${index}].name`, message: 'Section must have a name' });
      }
      
      if (!section.sectionType) {
        errors.push({ path: `sections[${index}].sectionType`, message: 'Section must have a sectionType' });
      } else if (typeof section.sectionType !== 'string') {
        errors.push({ path: `sections[${index}].sectionType`, message: 'Section sectionType must be a string' });
      }
      
      // Validate components if they exist
      if (section.components && !Array.isArray(section.components)) {
        errors.push({ path: `sections[${index}].components`, message: 'Section components must be an array' });
      }
      
      // Validate layoutType if it exists
      if (section.layoutType && typeof section.layoutType !== 'string') {
        errors.push({ path: `sections[${index}].layoutType`, message: 'Section layoutType must be a string' });
      }
      
      // Validate style if it exists
      if (section.style && typeof section.style !== 'object') {
        errors.push({ path: `sections[${index}].style`, message: 'Section style must be an object' });
      }
    });
  }
  
  // Check color scheme with type validation
  if (!wireframeData.colorScheme) {
    errors.push({ path: 'colorScheme', message: 'Wireframe must have a colorScheme' });
  } else if (typeof wireframeData.colorScheme !== 'object') {
    errors.push({ path: 'colorScheme', message: 'ColorScheme must be an object' });
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!wireframeData.colorScheme[color]) {
        errors.push({ path: `colorScheme.${color}`, message: `ColorScheme must include ${color} color` });
      } else if (typeof wireframeData.colorScheme[color] !== 'string') {
        errors.push({ path: `colorScheme.${color}`, message: `ColorScheme ${color} must be a string` });
      }
    });
  }
  
  // Check typography with type validation
  if (!wireframeData.typography) {
    errors.push({ path: 'typography', message: 'Wireframe must have typography settings' });
  } else if (typeof wireframeData.typography !== 'object') {
    errors.push({ path: 'typography', message: 'Typography must be an object' });
  } else {
    const requiredFonts = ['headings', 'body'];
    requiredFonts.forEach(font => {
      if (!wireframeData.typography[font]) {
        errors.push({ path: `typography.${font}`, message: `Typography must include ${font} font` });
      } else if (typeof wireframeData.typography[font] !== 'string') {
        errors.push({ path: `typography.${font}`, message: `Typography ${font} must be a string` });
      }
    });
  }
  
  const validationResult = {
    isValid: errors.length === 0,
    errors
  };
  
  console.log("Validation result:", JSON.stringify({
    isValid: validationResult.isValid,
    errorCount: validationResult.errors.length
  }));
  
  return validationResult;
};

serve(async (req) => {
  // Track execution time for performance logging
  const startTime = Date.now();
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verify that this is a POST request
    if (req.method !== "POST") {
      console.error(`Invalid request method: ${req.method}`);
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Parse the request body
    const requestData = await req.json();
    const { wireframeData } = requestData;
    
    // Log the received request
    console.log(`Received wireframe validation request for ID: ${wireframeData?.id || 'unknown'}`);
    
    if (!wireframeData) {
      console.error("Missing wireframeData in request");
      return new Response(JSON.stringify({ error: "Missing wireframeData" }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Validate the wireframe data
    const validationResult = validateWireframeData(wireframeData);
    
    // If valid and requested, save to Supabase
    if (validationResult.isValid) {
      try {
        // Record the validation in the metrics table
        await supabaseAdmin.from('wireframe_generation_metrics').insert({
          project_id: wireframeData.projectId || null,
          prompt: requestData.prompt || 'Validation service',
          success: true,
          result_data: wireframeData,
          validation_time_ms: Date.now() - startTime
        });
        console.log("Successfully recorded validation metrics");
      } catch (insertError) {
        console.error("Error recording validation metrics:", insertError);
        // Continue despite metrics error
      }
    } else {
      try {
        // Record failed validation
        await supabaseAdmin.from('wireframe_generation_metrics').insert({
          project_id: wireframeData.projectId || null,
          prompt: requestData.prompt || 'Validation service',
          success: false,
          error_data: validationResult.errors,
          validation_time_ms: Date.now() - startTime
        });
        console.log("Recorded failed validation metrics");
      } catch (insertError) {
        console.error("Error recording failed validation metrics:", insertError);
        // Continue despite metrics error
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Validation completed in ${totalTime}ms with result: ${validationResult.isValid ? 'valid' : 'invalid'}`);
    
    return new Response(JSON.stringify(validationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error validating wireframe:", errorMessage);
    
    try {
      // Log the error for monitoring
      await supabaseAdmin.from('wireframe_generation_metrics').insert({
        project_id: null,
        prompt: 'Validation service error',
        success: false,
        error_message: errorMessage,
        validation_time_ms: Date.now() - startTime
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      isValid: false,
      errors: [{ path: "server", message: errorMessage }]
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
