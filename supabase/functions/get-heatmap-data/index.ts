
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse the request to get filter parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const eventType = url.searchParams.get("event_type");
    const pageUrl = url.searchParams.get("page_url");
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    const deviceType = url.searchParams.get("device_type");
    const sessionId = url.searchParams.get("session_id");
    const aggregationType = url.searchParams.get("aggregation") || "density";
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "user_id is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Verify the calling user is either the owner of the data or an admin
    const authHeader = req.headers.get("Authorization")?.split(" ")[1] || "";
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      // Check if the user is either the owner or an admin
      if (user.id !== userId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
          
        if (!profile || profile.role !== "admin") {
          return new Response(
            JSON.stringify({ error: "Unauthorized to access this user's data" }),
            { 
              status: 403, 
              headers: { ...corsHeaders, "Content-Type": "application/json" } 
            }
          );
        }
      }
    }
    
    // Build the query
    let query = supabase
      .from("interaction_events")
      .select("*")
      .eq("user_id", userId);
    
    // Apply filters
    if (eventType) query = query.eq("event_type", eventType);
    if (pageUrl) query = query.eq("page_url", pageUrl);
    if (deviceType) query = query.eq("device_type", deviceType);
    if (sessionId) query = query.eq("session_id", sessionId);
    if (startDate) query = query.gte("timestamp", startDate);
    if (endDate) query = query.lte("timestamp", endDate);
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Process data based on aggregation type
    let processedData;
    
    if (aggregationType === "density") {
      // Create a density heatmap
      processedData = processDataForDensityHeatmap(data);
    } else if (aggregationType === "time") {
      // Create a time-based visualization
      processedData = processDataForTimeVisualization(data);
    } else if (aggregationType === "element") {
      // Create an element-based aggregation
      processedData = processDataForElementAggregation(data);
    } else {
      // Default to density
      processedData = processDataForDensityHeatmap(data);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: processedData,
        metadata: {
          count: data.length,
          filters: {
            userId,
            eventType,
            pageUrl,
            startDate,
            endDate,
            deviceType,
            sessionId,
            aggregationType
          }
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Process data for density heatmap
function processDataForDensityHeatmap(data: any[]) {
  // Group data points by position (rounded to nearest 10px to create clusters)
  const gridSize = 10;
  const heatPoints: Record<string, { x: number, y: number, value: number, elements: Set<string> }> = {};
  
  data.forEach(point => {
    // Round position to nearest grid point
    const x = Math.round(point.x_position / gridSize) * gridSize;
    const y = Math.round(point.y_position / gridSize) * gridSize;
    const key = `${x}-${y}`;
    
    if (!heatPoints[key]) {
      heatPoints[key] = {
        x,
        y,
        value: 0,
        elements: new Set()
      };
    }
    
    heatPoints[key].value += 1;
    if (point.element_selector) {
      heatPoints[key].elements.add(point.element_selector);
    }
  });
  
  // Convert to array and format for heatmap
  return Object.values(heatPoints).map(point => ({
    x: point.x,
    y: point.y,
    value: point.value,
    elements: Array.from(point.elements)
  }));
}

// Process data for time-based visualization
function processDataForTimeVisualization(data: any[]) {
  // Group data by time interval (hour)
  const timePoints: Record<string, { timestamp: string, count: number, elements: Set<string> }> = {};
  
  data.forEach(point => {
    const date = new Date(point.timestamp);
    const hour = date.getHours();
    const key = `${date.toDateString()}-${hour}`;
    
    if (!timePoints[key]) {
      timePoints[key] = {
        timestamp: `${date.toDateString()} ${hour}:00`,
        count: 0,
        elements: new Set()
      };
    }
    
    timePoints[key].count += 1;
    if (point.element_selector) {
      timePoints[key].elements.add(point.element_selector);
    }
  });
  
  // Convert to array and format for visualization
  return Object.values(timePoints).map(point => ({
    timestamp: point.timestamp,
    count: point.count,
    elements: Array.from(point.elements)
  }));
}

// Process data for element-based aggregation
function processDataForElementAggregation(data: any[]) {
  // Group data by element
  const elementPoints: Record<string, { element: string, count: number, sessions: Set<string> }> = {};
  
  data.forEach(point => {
    const element = point.element_selector || 'unknown';
    
    if (!elementPoints[element]) {
      elementPoints[element] = {
        element,
        count: 0,
        sessions: new Set()
      };
    }
    
    elementPoints[element].count += 1;
    if (point.session_id) {
      elementPoints[element].sessions.add(point.session_id);
    }
  });
  
  // Convert to array and format for visualization
  return Object.values(elementPoints).map(point => ({
    element: point.element,
    count: point.count,
    uniqueSessions: Array.from(point.sessions).length
  }));
}
