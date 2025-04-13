
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
  const errors: ValidationError[] = [];
  
  // Check required fields
  if (!wireframeData.id) {
    errors.push({ path: 'id', message: 'Wireframe must have an ID' });
  }
  
  if (!wireframeData.title) {
    errors.push({ path: 'title', message: 'Wireframe must have a title' });
  }
  
  // Check sections
  if (!wireframeData.sections || !Array.isArray(wireframeData.sections)) {
    errors.push({ path: 'sections', message: 'Wireframe must have a sections array' });
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
      }
    });
  }
  
  // Check color scheme
  if (!wireframeData.colorScheme) {
    errors.push({ path: 'colorScheme', message: 'Wireframe must have a colorScheme' });
  } else {
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!wireframeData.colorScheme[color]) {
        errors.push({ path: `colorScheme.${color}`, message: `ColorScheme must include ${color} color` });
      }
    });
  }
  
  // Check typography
  if (!wireframeData.typography) {
    errors.push({ path: 'typography', message: 'Wireframe must have typography settings' });
  } else {
    const requiredFonts = ['headings', 'body'];
    requiredFonts.forEach(font => {
      if (!wireframeData.typography[font]) {
        errors.push({ path: `typography.${font}`, message: `Typography must include ${font} font` });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verify that this is a POST request
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Parse the request body
    const { wireframeData } = await req.json();
    
    if (!wireframeData) {
      return new Response(JSON.stringify({ error: "Missing wireframeData" }), { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Validate the wireframe data
    const validationResult = validateWireframeData(wireframeData);
    
    // If valid and requested, save to Supabase
    if (validationResult.isValid) {
      // Record the validation in the metrics table
      await supabaseAdmin.from('wireframe_generation_metrics').insert({
        project_id: wireframeData.projectId || null,
        prompt: 'Validation service',
        success: true,
        result_data: wireframeData
      });
    }
    
    return new Response(JSON.stringify(validationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error validating wireframe:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
