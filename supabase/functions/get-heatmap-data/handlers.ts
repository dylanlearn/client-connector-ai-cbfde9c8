
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";
import { 
  aggregateByDensity,
  aggregateByElement,
  aggregateByTime 
} from "./aggregators.ts";

/**
 * Main handler for heatmap data requests
 */
export async function handleHeatmapRequest(req: Request): Promise<Response> {
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
  const events = await queryHeatmapData(
    supabase, 
    userId, 
    eventType, 
    pageUrl, 
    startDate, 
    endDate, 
    deviceType, 
    sessionId
  );
  
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
}

/**
 * Query interaction events with filters
 */
async function queryHeatmapData(
  supabase: any,
  userId: string,
  eventType?: string,
  pageUrl?: string,
  startDate?: string,
  endDate?: string,
  deviceType?: string,
  sessionId?: string
) {
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
  
  return events;
}
