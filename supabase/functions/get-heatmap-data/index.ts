
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
    // Get request parameters
    const { userId, eventType, pageUrl, startDate, endDate, deviceType, sessionId, aggregationType } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Build query with filters
    let query = supabase
      .from('interaction_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (pageUrl) {
      query = query.eq('page_url', pageUrl);
    }
    
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    
    if (deviceType && deviceType !== 'all') {
      query = query.eq('device_type', deviceType);
    }
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    // Execute the query
    const { data: events, error } = await query;
    
    if (error) throw error;
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          data: []
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Process data based on aggregation type
    let processedData;
    
    switch (aggregationType) {
      case 'time':
        processedData = aggregateByTime(events);
        break;
      case 'element':
        processedData = aggregateByElement(events);
        break;
      case 'density':
      default:
        processedData = aggregateByDensity(events);
        break;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: processedData,
        eventCount: events.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in get-heatmap-data function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

/**
 * Aggregate events by point density
 */
function aggregateByDensity(events: any[]): any[] {
  // Group events by position (rounded to nearest 10px)
  const positionGrid: Record<string, { x: number, y: number, value: number, elements: string[] }> = {};
  
  events.forEach(event => {
    // Round positions to create a grid
    const gridX = Math.round(event.x_position / 10) * 10;
    const gridY = Math.round(event.y_position / 10) * 10;
    const key = `${gridX},${gridY}`;
    
    if (!positionGrid[key]) {
      positionGrid[key] = {
        x: gridX,
        y: gridY,
        value: 0,
        elements: []
      };
    }
    
    positionGrid[key].value += 1;
    
    if (event.element_selector && !positionGrid[key].elements.includes(event.element_selector)) {
      positionGrid[key].elements.push(event.element_selector);
    }
  });
  
  return Object.values(positionGrid);
}

/**
 * Aggregate events by element
 */
function aggregateByElement(events: any[]): any[] {
  // Group events by element
  const elementMap: Record<string, { element: string, value: number, x: number, y: number }> = {};
  
  events.forEach(event => {
    const element = event.element_selector || 'unknown';
    
    if (!elementMap[element]) {
      elementMap[element] = {
        element,
        value: 0,
        x: 0,
        y: 0
      };
    }
    
    elementMap[element].value += 1;
    elementMap[element].x += event.x_position;
    elementMap[element].y += event.y_position;
  });
  
  // Calculate average positions
  Object.values(elementMap).forEach(item => {
    if (item.value > 0) {
      item.x = Math.round(item.x / item.value);
      item.y = Math.round(item.y / item.value);
    }
  });
  
  return Object.values(elementMap);
}

/**
 * Aggregate events by time
 */
function aggregateByTime(events: any[]): any[] {
  // Sort events by timestamp
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Group by time intervals (hourly)
  const timeIntervals: Record<string, { timestamp: string, value: number, x: number, y: number, elements: string[] }> = {};
  
  sortedEvents.forEach(event => {
    const date = new Date(event.timestamp);
    date.setMinutes(0, 0, 0); // Round to hour
    const interval = date.toISOString();
    
    if (!timeIntervals[interval]) {
      timeIntervals[interval] = {
        timestamp: interval,
        value: 0,
        x: 0,
        y: 0,
        elements: []
      };
    }
    
    timeIntervals[interval].value += 1;
    timeIntervals[interval].x += event.x_position;
    timeIntervals[interval].y += event.y_position;
    
    if (event.element_selector && !timeIntervals[interval].elements.includes(event.element_selector)) {
      timeIntervals[interval].elements.push(event.element_selector);
    }
  });
  
  // Calculate average positions
  Object.values(timeIntervals).forEach(item => {
    if (item.value > 0) {
      item.x = Math.round(item.x / item.value);
      item.y = Math.round(item.y / item.value);
    }
  });
  
  return Object.values(timeIntervals);
}
